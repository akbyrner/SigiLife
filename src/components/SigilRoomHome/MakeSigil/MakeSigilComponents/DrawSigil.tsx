import BackButton from "../../../Parts/BackButton"
import { useEffect, useRef, useState, useCallback } from 'react';
import NextButton from "../../../Parts/NextButton";
import * as fabric from 'fabric';

export default function DrawSigil({ user }: { user: any }) {
  console.log(user)
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  const [isDrawingMode, setIsDrawingMode] = useState(true);
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushWidth, setBrushWidth] = useState(5);

  // Undo/Redo State
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const isRestoringHistory = useRef(false);

  // Re-render to update button disabled states
  const [, forceRender] = useState({});

  const saveHistory = useCallback(() => {
    if (isRestoringHistory.current || !fabricCanvasRef.current) return;

    const json = JSON.stringify(fabricCanvasRef.current.toJSON());
    const currentHistory = historyRef.current;

    if (historyIndexRef.current < currentHistory.length - 1) {
      historyRef.current = currentHistory.slice(0, historyIndexRef.current + 1);
    }

    historyRef.current.push(json);
    historyIndexRef.current = historyRef.current.length - 1;
    forceRender({});
  }, []);

  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      const initialSize = wrapperRef.current ? wrapperRef.current.clientWidth : 500;

      const canvas = new fabric.Canvas(canvasRef.current, {
        width: initialSize,
        height: initialSize,
        backgroundColor: '#f5f5f5',
        isDrawingMode: true
      });

      const brush = new fabric.PencilBrush(canvas);
      brush.color = brushColor;
      brush.width = brushWidth;
      canvas.freeDrawingBrush = brush;

      fabricCanvasRef.current = canvas;

      // Initial blank state for history
      saveHistory();

      // Setup history listeners
      canvas.on('path:created', saveHistory);
      canvas.on('object:modified', saveHistory);
      canvas.on('object:removed', () => {
        // Prevent duplicate history entries when clearing the canvas programmatically
        if (!isRestoringHistory.current) saveHistory();
      });

      // Handle keyboard Delete
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          // Do not delete if they are typing in an input field
          if (document.activeElement?.tagName === 'INPUT') return;
          handleDeleteSelected();
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      // Handle responsive resizing
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (fabricCanvasRef.current) {
            const newSize = entry.contentRect.width;
            fabricCanvasRef.current.setDimensions({ width: newSize, height: newSize });
          }
        }
      });

      if (wrapperRef.current) {
        resizeObserver.observe(wrapperRef.current);
      }

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        resizeObserver.disconnect();
        if (fabricCanvasRef.current) {
          fabricCanvasRef.current.dispose();
          fabricCanvasRef.current = null;
        }
      };
    }
  }, [saveHistory]);

  // Update canvas state when mode changes
  useEffect(() => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.isDrawingMode = isDrawingMode;
      if (isDrawingMode) {
        fabricCanvasRef.current.discardActiveObject();
        fabricCanvasRef.current.requestRenderAll();
      }
    }
  }, [isDrawingMode]);

  // Update brush color and width dynamically
  useEffect(() => {
    if (fabricCanvasRef.current && fabricCanvasRef.current.freeDrawingBrush) {
      fabricCanvasRef.current.freeDrawingBrush.color = brushColor;
      fabricCanvasRef.current.freeDrawingBrush.width = brushWidth;
    }
  }, [brushColor, brushWidth]);

  const handleClear = () => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.clear();
      fabricCanvasRef.current.backgroundColor = '#f5f5f5';
      fabricCanvasRef.current.renderAll();
      saveHistory();
    }
  };

  const handleDeleteSelected = () => {
    if (!fabricCanvasRef.current) return;
    const activeObjects = fabricCanvasRef.current.getActiveObjects();
    if (activeObjects.length > 0) {
      fabricCanvasRef.current.discardActiveObject();
      activeObjects.forEach((obj) => {
        fabricCanvasRef.current!.remove(obj);
      });
      // history is updated via 'object:removed' listener
    }
  };

  const undo = async () => {
    if (historyIndexRef.current > 0 && fabricCanvasRef.current) {
      isRestoringHistory.current = true;
      historyIndexRef.current -= 1;
      const jsonStr = historyRef.current[historyIndexRef.current]!;
        await fabricCanvasRef.current.loadFromJSON(JSON.parse(jsonStr));
      fabricCanvasRef.current.renderAll();
      isRestoringHistory.current = false;
        forceRender({});
        return;
    }
  };

  const redo = async () => {
    if (historyIndexRef.current < historyRef.current.length - 1 && fabricCanvasRef.current) {
      isRestoringHistory.current = true;
      historyIndexRef.current += 1;
      const jsonStr = historyRef.current[historyIndexRef.current]!;
        await fabricCanvasRef.current.loadFromJSON(JSON.parse(jsonStr));
      fabricCanvasRef.current.renderAll();
      isRestoringHistory.current = false;
        forceRender({});
        return;
    }
  };

  const handleExport = () => {
    if (!fabricCanvasRef.current) return;
    // Export at a higher multiplier for a crisper sigil
    const dataURL = fabricCanvasRef.current.toDataURL({
      format: 'png',
      multiplier: 2
    });
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'my-sigil.png';
    link.click();
  };

  const handleSVGUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (f) => {
      const data = f.target?.result;
      if (typeof data === 'string' && data && fabricCanvasRef.current) {
        try {
          const { objects, options } = await fabric.loadSVGFromString(data);
          if (!objects || objects.length === 0) return;

          const validObjects = objects.filter((o): o is fabric.FabricObject => o !== null);
          const obj = fabric.util.groupSVGElements(validObjects, options);

          obj.set({
            left: fabricCanvasRef.current.width ? fabricCanvasRef.current.width / 2 : 250,
            top: fabricCanvasRef.current.height ? fabricCanvasRef.current.height / 2 : 250,
            originX: 'center',
            originY: 'center',
            selectable: true,
          });

          if (obj.width && fabricCanvasRef.current.width && obj.width > fabricCanvasRef.current.width * 0.8) {
            obj.scaleToWidth(fabricCanvasRef.current.width * 0.8);
          }

          fabricCanvasRef.current.add(obj);
          fabricCanvasRef.current.renderAll();
          setIsDrawingMode(false);
          saveHistory();

        } catch (error) {
          console.error("Error parsing SVG:", error);
        }
      }
    };

    reader.readAsText(file);
    e.target.value = '';
  };

  const canUndo = historyIndexRef.current > 0;
  const canRedo = historyIndexRef.current < historyRef.current.length - 1;

  return (
    <div className='maincontainer'>
    <div className="draw-sigil-container" style={{ paddingBottom: '2rem' }}>
      <h2>Draw Your Sigil</h2>
      <BackButton name={"MakeSigil"}/>

      {/* Main Control Panel */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginTop: '1rem' }}>

        {/* Undo/Redo */}
        <div style={{ display: 'flex', gap: '5px' }}>
          <button onClick={undo} disabled={!canUndo} style={{ opacity: canUndo ? 1 : 0.5 }}>↶ Undo</button>
          <button onClick={redo} disabled={!canRedo} style={{ opacity: canRedo ? 1 : 0.5 }}>↷ Redo</button>
        </div>

        <button
          onClick={() => setIsDrawingMode(!isDrawingMode)}
          style={{
            background: isDrawingMode ? '#e0e0e0' : '#4a90e2',
            color: isDrawingMode ? '#000' : '#fff',
            padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer'
          }}
        >
          {isDrawingMode ? "✍️ Draw Mode" : "🖐 Manipulate Mode"}
        </button>

        {!isDrawingMode && (
          <button onClick={handleDeleteSelected} style={{ background: '#ff4d4d', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
            🗑️ Delete Selected
          </button>
        )}

        <label style={{ background: '#e0e0e0', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
          📂 Import SVG
          <input type="file" accept=".svg" style={{ display: 'none' }} onChange={handleSVGUpload} />
        </label>

        <button onClick={handleExport} style={{ background: '#28a745', color: '#fff', padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
          💾 Save Image
        </button>
      </div>

      {/* Brush Controls (Only relevant in Drawing Mode) */}
      {isDrawingMode && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center', marginTop: '1rem', background: '#f9f9f9', padding: '10px', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <label htmlFor="brushColor">Color:</label>
            <input
              type="color"
              id="brushColor"
              value={brushColor}
              onChange={(e) => setBrushColor(e.target.value)}
              style={{ cursor: 'pointer' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <label htmlFor="brushWidth">Thickness ({brushWidth}px):</label>
            <input
              type="range"
              id="brushWidth"
              min="1"
              max="50"
              value={brushWidth}
              onChange={(e) => setBrushWidth(parseInt(e.target.value))}
              style={{ cursor: 'pointer' }}
            />
          </div>
        </div>
      )}

      <div
        ref={wrapperRef}
        style={{
          width: '100%',
          maxWidth: 'calc(100vh - 350px)', // Scale up on desktop (adjusted for new toolbars)
          margin: '0 auto',
          aspectRatio: '1 / 1',
          border: '2px solid #ccc',
          borderRadius: '8px',
          overflow: 'hidden',
          marginTop: '1rem'
        }}
      >
        <canvas ref={canvasRef} />
      </div>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleClear} style={{ background: '#6c757d', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
          Clear All
        </button>
        <button onClick={handleClear}>Clear Sigil</button>
        <NextButton to="/make-sigil/style" />
      </div>
    </div>
    </div>
  );
}
