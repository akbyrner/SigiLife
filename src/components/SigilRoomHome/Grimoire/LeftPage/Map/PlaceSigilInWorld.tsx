import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// We are relying entirely on the globally injected Three.js script from index.html
// This prevents the "Multiple instances of Three.js" warning.
declare const THREE: any;

export default function PlaceSigilInWorld() {
  const { state } = useLocation();
  const sigilData = state?.sigilData; // Contains imageData (base64) or canvasData
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaced, setIsPlaced] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!canvasRef.current) return;

    // This is where we hold a reference to our placed Sigil
    let placedSigilMesh: THREE.Mesh | null = null;

    const startAR = () => {
      // It is critical to include ALL of these modules for the camera to render and SLAM to work
      XR8.addCameraPipelineModules([
        // Draws the camera feed to the canvas
        XR8.GlTextureRenderer.pipelineModule(),
        
        // XRExtras provide standard UI
        XRExtras.AlmostThere.pipelineModule(),
        XRExtras.FullWindowCanvas.pipelineModule(),
        XRExtras.Loading.pipelineModule(),
        XRExtras.RuntimeError.pipelineModule(),
        
        // Initializes Three.js integration
        XR8.Threejs.pipelineModule(), 
        // Our custom World Tracking Module
        createWorldTrackingModule()
      ]);

      XR8.run({
        canvas: canvasRef.current,
        allowedDevices: XR8.XrConfig.device().ANY, // Works on phones and desktop (using webcam)
        cameraConfig: { direction: XR8.XrConfig.camera().BACK }
      });
    };

    const createWorldTrackingModule = () => {
      return {
        name: 'place-sigil-module',
        
        onStart: () => {
          const { scene, camera, renderer } = XR8.Threejs.xrScene();

          // 1. Add Lighting so our Sigil is visible
          const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
          scene.add(ambientLight);
          const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
          directionalLight.position.set(5, 10, 5);
          scene.add(directionalLight);

          // 2. Prepare the Sigil Texture from your database's imageData (Base64)
          // Fallback to a purple color if no image data exists
          const textureLoader = new THREE.TextureLoader();
          const sigilMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffff,
            transparent: true,
            side: THREE.DoubleSide,
            // Add a glowing effect to the material
          });

          if (sigilData?.imageData) {
            textureLoader.load(sigilData.imageData, (texture) => {
              sigilMaterial.map = texture;
              sigilMaterial.needsUpdate = true;
            });
          } else {
             sigilMaterial.color.setHex(0xc70eff); // SigiLife purple fallback
          }

          // 3. Listen for Taps on the Screen
          const handleTap = (e: TouchEvent | MouseEvent) => {
             // If touch event, ensure single touch
            let clientX, clientY;

            if ('touches' in e) {
               if (e.touches.length > 1) return;
               clientX = e.touches[0].clientX;
               clientY = e.touches[0].clientY;
            } else {
               clientX = e.clientX;
               clientY = e.clientY;
            }
            
            // Calculate tap position normalized from 0 to 1
            const tapX = clientX / window.innerWidth;
            const tapY = clientY / window.innerHeight;

            // 4. Perform a Hit Test to find the real-world floor
            // Check if SLAM tracking is initialized and working before hitting the memory map
            if (!XR8.XrController.hitTest) return;

            // Note: passing the types as strings helps prevent the WASM memory buffer from trying to map undefined enums
            const hitTestResults = XR8.XrController.hitTest(tapX, tapY, ['ESTIMATED_SURFACE']);

            if (hitTestResults && hitTestResults.length > 0) {
              // Get the closest physical surface hit
              const hit = hitTestResults[0]; 

              // If we already placed the sigil, let's just move it to the new tap location
              if (!placedSigilMesh) {
                // Create a 2D plane geometry in the 3D world (Size: 1 meter x 1 meter)
                const geometry = new THREE.PlaneGeometry(1, 1);
                placedSigilMesh = new THREE.Mesh(geometry, sigilMaterial);
                
                // Lay the plane flat on the ground
                placedSigilMesh.rotation.x = -Math.PI / 2;
                
                scene.add(placedSigilMesh);
                setIsPlaced(true);
              }

              // Position the Sigil at the exact coordinates returned by 8th Wall's floor detection
              placedSigilMesh.position.set(
                hit.position.x,
                hit.position.y,
                hit.position.z
              );
            }
          };

          window.addEventListener('touchstart', handleTap);
          window.addEventListener('click', handleTap);
        },

        // We can add simple floating animation in the update loop
        onUpdate: () => {
          if (placedSigilMesh) {
             // Slowly rotate the Sigil like a magical rune on the floor
             placedSigilMesh.rotation.z += 0.01;
          }
        }
      };
    };

    // Wait for the 8th Wall script to load from index.html
    if (window.XR8) {
      startAR();
    } else {
      window.addEventListener('xrloaded', startAR);
    }

    return () => {
      window.removeEventListener('xrloaded', startAR);
      if (window.XR8) {
        XR8.stop();
        XR8.clearCameraPipelineModules();
      }
    };
  }, [sigilData]);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: 'black' }}>
      {/* The AR Canvas takes up the full screen and is managed entirely by XR8 */}
      <canvas 
        ref={canvasRef} 
        style={{ width: '100%', height: '100%', display: 'block', position: 'absolute', top: 0, left: 0 }}
      />

      {/* SigiLife Overlay UI */}
      <div style={{ position: 'absolute', top: '20px', width: '100%', textAlign: 'center', zIndex: 10, pointerEvents: 'none' }}>
        <h1 style={{ color: 'gold', textShadow: '0 0 10px #000', fontFamily: 'New Rocker', pointerEvents: 'auto' }}>
          {isPlaced ? 'Sigil Anchored!' : 'Tap floor to place Sigil'}
        </h1>
      </div>
      
      {/* Back Button */}
      <div style={{ position: 'absolute', bottom: '40px', left: '20px', zIndex: 10 }}>
        <button 
          className="grimoirebutton" 
          onClick={() => navigate(-1)}
          style={{ padding: '10px', fontSize: '1.2rem', cursor: 'pointer' }}
        >
          Return to Grimoire
        </button>
      </div>
    </div>
  );
}