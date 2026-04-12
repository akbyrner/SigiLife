
import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as fabric from 'fabric';
import axios from 'axios';
import { useUser } from '@/context/UserContext'
import Menu from '../../../Parts/Menu'

export default function DrawSigil() {
  const { user } = useUser()
  if (!user) { return null }
  const navigate = useNavigate();
  // console.log(user)
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<'draw' | 'style'>('draw');
  const [isDrawingMode, setIsDrawingMode] = useState(true);
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushWidth, setBrushWidth] = useState(5);
  const [sigilName, setSigilName] = useState('My New Sigil');
  const [styleColor, setStyleColor] = useState('#9e38fd');

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
    if (!canvasRef.current || fabricCanvasRef.current) return;

    const initialSize = wrapperRef.current ? wrapperRef.current.clientWidth : 500;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: initialSize,
      height: initialSize,
      backgroundColor: 'transparent',
      isDrawingMode: true
    });

    const brush = new fabric.PencilBrush(canvas);
    brush.color = brushColor;
    brush.width = brushWidth;
    canvas.freeDrawingBrush = brush;

    fabricCanvasRef.current = canvas;

    saveHistory();

    canvas.on('path:created', saveHistory);
    canvas.on('object:modified', saveHistory);
    canvas.on('object:removed', () => {
      if (!isRestoringHistory.current) saveHistory();
    });

    const loadCharacters = async () => {
      const uniqueChars = localStorage.getItem('sigilUniqueChars');
      if (uniqueChars && fabricCanvasRef.current) {
        const canvas = fabricCanvasRef.current;
        try {
          console.log("Fetching vectors for unique chars:", uniqueChars);
          
          const response = await axios.post('/api/vectors/character-vectors', { chars: uniqueChars });
          const vectors = response.data;
          
          if (!vectors || vectors.length === 0) {
            console.warn("No vectors found for these characters.");
            return;
          }

          for (const vector of vectors) {
            console.log("Loading path for char:", vector.filename);

            const { objects } = await fabric.loadSVGFromString(vector.vectorData);
            
            if (objects && objects.length > 0) {
              const pathObj = objects[0] as fabric.FabricObject;
              
              pathObj.set({
                fill: 'transparent',
                stroke: 'black',
                strokeWidth: 2,
                left: canvas.width ? (canvas.width / 2) + (Math.random() * 80 - 40) : 250,
                top: canvas.height ? (canvas.height / 2) + (Math.random() * 80 - 40) : 250,
                originX: 'center',
                originY: 'center',
                selectable: true,
              });

              if (pathObj.width && canvas.width && pathObj.width > canvas.width * 0.4) {
                pathObj.scaleToWidth(canvas.width * 0.4);
              }

              canvas.add(pathObj);
            }
          }
          
          canvas.renderAll();
          setIsDrawingMode(false);
          saveHistory();
          
        } catch (error) {
          console.error("Error loading character vectors:", error);
        }
      }
    };

    loadCharacters();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Do not delete if they are typing in an input field
        if (document.activeElement?.tagName === 'INPUT') return;
        handleDeleteSelected();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

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

  useEffect(() => {
    if (fabricCanvasRef.current && fabricCanvasRef.current.freeDrawingBrush) {
      fabricCanvasRef.current.freeDrawingBrush.color = brushColor;
      fabricCanvasRef.current.freeDrawingBrush.width = brushWidth;
    }
  }, [brushColor, brushWidth]);

  const handleClear = () => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.clear();
      fabricCanvasRef.current.backgroundColor = 'transparent';
      fabricCanvasRef.current.renderAll();
      saveHistory();
    }
  };

  const handleDeleteSelected = () => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length > 0) {
      canvas.discardActiveObject();
      activeObjects.forEach((obj) => {
        canvas.remove(obj);
      });
      saveHistory();
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
    const dataURL = fabricCanvasRef.current.toDataURL({
      format: 'png',
      multiplier: 2
    });
    const link = document.createElement('a');
    link.download = `${sigilName.replace(/\s+/g, '_')}_sigil.png`;
    link.href = dataURL;
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
          const obj = fabric.util.groupSVGElements(validObjects, options) as fabric.Group;

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

  // ----- Styling Mode Handlers -----
  const handleAddRing = () => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;

    const ring = new fabric.Circle({
      radius: canvas.width ? canvas.width * 0.4 : 150,
      fill: 'transparent',
      stroke: styleColor,
      strokeWidth: brushWidth,
      left: canvas.width ? canvas.width / 2 : 250,
      top: canvas.height ? canvas.height / 2 : 250,
      originX: 'center',
      originY: 'center',
      selectable: true
    });

    canvas.add(ring);
    canvas.renderAll();
    saveHistory();
  };

  const handleChangeColor = () => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;
    const activeObjects = canvas.getActiveObjects();
    const objectsToChange = activeObjects.length > 0 ? activeObjects : canvas.getObjects();

    objectsToChange.forEach(obj => {
      obj.set('stroke', styleColor);
      if (obj.type === 'group') {
        (obj as fabric.Group).forEachObject(innerObj => {
          innerObj.set('stroke', styleColor);
        });
      }
    });
    canvas.renderAll();
    saveHistory();
  };

  const handleAddGlow = () => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;
    const activeObjects = canvas.getActiveObjects();
    const objectsToChange = activeObjects.length > 0 ? activeObjects : canvas.getObjects();

    objectsToChange.forEach(obj => {
      obj.set('shadow', new fabric.Shadow({
        color: styleColor,
        blur: 20,
        offsetX: 0,
        offsetY: 0
      }));
    });
    canvas.renderAll();
    saveHistory();
  };

  const handleNextToStyle = () => {
    if (!fabricCanvasRef.current) return;

    const canvasData = JSON.stringify(fabricCanvasRef.current.toJSON());
    const imageData = fabricCanvasRef.current.toDataURL({ format: 'png', multiplier: 1 });
    localStorage.setItem('sigilCanvasData', canvasData);
    localStorage.setItem('sigilImageData', imageData);
    localStorage.setItem('sigilName', sigilName);
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = (scrollRef.current.scrollWidth - scrollRef.current.clientWidth) / 2;
    }
    navigate('/make-sigil/style');
    window.scrollTo(0, 0);
  };

  const canUndo = historyIndexRef.current > 0;
  const canRedo = historyIndexRef.current < historyRef.current.length - 1;
  
useEffect(() => {
  const el = scrollRef.current;
  if (!el) return;
  setTimeout(() => {
    el.scrollLeft = 0;
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  },);
}, []);


  return (
    <div className='maincontainer'>
      <div ref={scrollRef} className='scrollcontainer'>
        <div className="drawsigilcontainer">

          <h2 >Draw Your Sigil</h2>
                    <Menu />
          {/* Main Control Panel */}
          <div className="drawsigilmenu">
            {step === 'draw' ? (
              <>

                <button
                  className="navbutton"
                  onClick={() => setIsDrawingMode(!isDrawingMode)}
                  style={{
                    color: isDrawingMode ? '#000' : '#fff',
                    cursor: 'pointer'
                  }}
                >
                  {isDrawingMode ? "✍️ Draw Mode" : "🖐 Manipulate Mode"}
                </button>

                {user.isAdmin === true &&
                  <label>
                    📂 Import SVG
                    <input type="file" accept=".svg" style={{ display: 'none' }} onChange={handleSVGUpload} />
                  </label>}
              </>
            ) : (<div className='drawsigilmenutoobox'>
              <div className='clmnbox'>
                <label htmlFor="sigilName">Name:</label>
                <input
                  type="text"
                  className='textinput'

                  id="sigilName"
                  value={sigilName}
                  onChange={(e) => setSigilName(e.target.value)}
                />
              </div>

              <div className='drawsigilmenutoo' >
                <div className='drawsigilmenutoobox1' >
                  <label >Style Color:</label>
                  <input type="color" value={styleColor} onChange={(e) => setStyleColor(e.target.value)} style={{ cursor: 'pointer', width: '30px', height: '30px' }} /><br />
                  <button className="navbutton" onClick={handleChangeColor} >🎨 Apply Color</button>
                  <br /></div>
                <div className='drawsigilmenutoobox2' >
                  <button className="navbutton" onClick={handleAddRing}>⭕ Add Ring</button><br /><br /><br />
                  <button className="navbutton" onClick={handleAddGlow}>✨ Add Glow</button>
                </div></div>
            </div>
            )}


            {user.isAdmin === true &&
              <button className="navbutton" onClick={handleExport}>
                💾 Save Image
              </button>
            }



          </div>

          {/* Brush Controls (Only relevant in Drawing Mode) */}
          {step === 'draw' && isDrawingMode && (
            <div>
              <div >
                <label htmlFor="brushColor">Color:</label>
                <input
                  type="color"
                  id="brushColor"
                  value={brushColor}
                  onChange={(e) => setBrushColor(e.target.value)}
                  style={{ cursor: 'pointer' }}
                />
              </div>
              <div >
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
              maxWidth: 'calc(100vh - 350px)',
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
          {!isDrawingMode && (
            <button className="navbutton" onClick={handleDeleteSelected} >
              🗑️ Delete Selected
            </button>
          )}
          {/* Undo/Redo */}
          <div >
            <button className="navbutton" onClick={undo} disabled={!canUndo} style={{ opacity: canUndo ? 1 : 0.5 }}>↶ Undo</button>
            <button className="navbutton" onClick={redo} disabled={!canRedo} style={{ opacity: canRedo ? 1 : 0.5 }}>↷ Redo</button>
          </div>

          {step === 'draw' ? (
            <div >
              <button className="navbutton" onClick={handleClear} >
                Clear All
              </button>

              <button
                className="navbutton"
                onClick={() => { setStep('style'); setIsDrawingMode(false); }}
              >
                Next: Style Sigil
              </button>
            </div>
          ) : (
            <div style={{ marginTop: '1rem', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button className="navbutton" onClick={() => setStep('draw')} style={{ background: '#6c757d', color: '#fff', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', border: 'none' }}>
                ⬅ Back to Draw
              </button>
              <button
                className="navbutton"
                onClick={handleNextToStyle}
                style={{ backgroundColor: "#9e38fd", color: 'white', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', border: 'none' }}
              >
                Review & Save
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}