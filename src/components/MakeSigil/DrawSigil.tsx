import BackButton from "../Parts/BackButton"
import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';

export default function DrawSigil() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(true);

  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      // Start with a fallback width, but use container size if available
      const initialSize = wrapperRef.current ? wrapperRef.current.clientWidth : 500;

      // Initialize the Fabric canvas
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: initialSize,
        height: initialSize, // Keep it a square
        backgroundColor: '#f5f5f5',
        isDrawingMode: true
      });
      
      // Explicitly instantiate the PencilBrush
      const brush = new fabric.PencilBrush(canvas);
      brush.color = '#000000';
      brush.width = 5;
      canvas.freeDrawingBrush = brush;

      fabricCanvasRef.current = canvas;

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

      // Cleanup on unmount
      return () => {
        resizeObserver.disconnect();
        if (fabricCanvasRef.current) {
          fabricCanvasRef.current.dispose();
          fabricCanvasRef.current = null;
        }
      };
    }
  }, []);

  // Update canvas state when mode changes
  useEffect(() => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.isDrawingMode = isDrawingMode;
      // Deselect active items when returning to draw mode
      if (isDrawingMode) {
        fabricCanvasRef.current.discardActiveObject();
        fabricCanvasRef.current.requestRenderAll();
      }
    }
  }, [isDrawingMode]);

  const handleClear = () => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.clear();
      fabricCanvasRef.current.backgroundColor = '#f5f5f5';
      fabricCanvasRef.current.renderAll(); 
    }
  };

  const handleSVGUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (f) => {
      const data = f.target?.result;
      if (typeof data === 'string' && fabricCanvasRef.current) {
        try {
          const { objects, options } = await fabric.loadSVGFromString(data);
          
          if (!objects || objects.length === 0) return;

          // Filter out null values
          const validObjects = objects.filter((o): o is fabric.FabricObject => o !== null);

          // Group the objects so they move as a single vector shape
          const obj = fabric.util.groupSVGElements(validObjects, options);
          
          // Center the loaded SVG
          obj.set({
            left: 250,
            top: 250,
            originX: 'center',
            originY: 'center',
            selectable: true,
          });
          
          // Scale it down if it's too big
          if (obj.width && obj.width > 400) {
            obj.scaleToWidth(400);
          }
          
          fabricCanvasRef.current.add(obj);
          fabricCanvasRef.current.renderAll();
          
          // Switch to select mode so they can manipulate the imported vector
          setIsDrawingMode(false);
          
        } catch (error) {
          console.error("Error parsing SVG:", error);
        }
      }
    };
    
    reader.readAsText(file);
    // Reset file input so they can re-upload the same file if needed
    e.target.value = '';
  };

  return (
    <div className="draw-sigil-container">
      <h2>Draw Your Sigil</h2>
      <BackButton />
      
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '1rem' }}>
        <button 
          onClick={() => setIsDrawingMode(!isDrawingMode)}
          style={{ 
            background: isDrawingMode ? '#e0e0e0' : '#4a90e2', 
            color: isDrawingMode ? '#000' : '#fff',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isDrawingMode ? "Switch to Manipulate Mode" : "Switch to Draw Mode"}
        </button>

        <label style={{ 
            background: '#e0e0e0', 
            padding: '8px 16px', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '14px'
          }}>
          Import SVG Vector
          <input 
            type="file" 
            accept=".svg" 
            style={{ display: 'none' }} 
            onChange={handleSVGUpload}
          />
        </label>
      </div>
      
      {/* Wrap the canvas in a responsive div to monitor resizing,
          and keep Fabric's internal wrapper from messing up borders */}
      <div
        ref={wrapperRef}
        style={{
          width: '100%',
          maxWidth: 'calc(100vh - 250px)', // Scale up on desktop without causing vertical scrolling
          margin: '0 auto', // Center the canvas
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
        <button onClick={handleClear}>Clear Sigil</button>
      </div>
    </div>
  );
}
