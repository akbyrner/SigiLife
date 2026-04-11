import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// THREE is provided by the XR8 standalone engine at runtime via XR8.Threejs.xrScene()
// Do NOT import three from npm here - that would create a second instance and break AR rendering.
declare const THREE: any;
declare const XR8: any;

export default function PlaceSigilInWorld() {
  const { state } = useLocation();
  const sigilData = state?.sigilData; // Contains imageData (base64) or canvasData
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaced, setIsPlaced] = useState(false);
  const [status, setStatus] = useState("Initializing...");
  const navigate = useNavigate();

  useEffect(() => {
    if (!canvasRef.current) return;

    let placedSigilMesh: any = null;
    // SLAM needs several frames before hitTest WASM memory is valid.
    // We count frames in onUpdate and unlock hit testing after a threshold.
    let slamReady = false;
    let frameCount = 0;
    const SLAM_WARMUP_FRAMES = 90; // ~1.5s at 60fps, ~3s at 30fps

    const startAR = () => {
      setStatus("Loading AR Engine...");
      console.log("[AR] Starting AR Engine...");

      if (typeof XR8 === 'undefined') {
        setStatus("Error: XR8 not found");
        return;
      }

      // Set canvas to full window size so XR8 renders at native resolution
      const canvas = canvasRef.current!;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      try {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const pipelineModules: any[] = [
          XR8.GlTextureRenderer.pipelineModule(), // renders camera feed to canvas
          XR8.Threejs.pipelineModule(),            // Three.js scene integration
          createWorldTrackingModule()              // our custom placement module
        ];

        // SLAM tracking (XrController) requires IMU sensors (gyro/accelerometer).
        // Without an IMU, it crashes the camera feed on desktop.
        if (isMobile) {
          pipelineModules.splice(1, 0, XR8.XrController.pipelineModule());
        }

        XR8.addCameraPipelineModules(pipelineModules);

        XR8.run({
          canvas: canvasRef.current,
          allowedDevices: XR8.XrConfig.device().ANY,
          cameraConfig: { direction: XR8.XrConfig.camera().BACK }
        });

        setStatus("Requesting Camera...");
      } catch (err: any) {
        console.error("[AR] Setup Error:", err);
        setStatus(`Setup Error: ${err.message || err}`);
      }
    };

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    const createWorldTrackingModule = () => {
      return {
        name: 'place-sigil-module',

        onStart: () => {
          setStatus("Scanning environment...");
          const { scene, camera } = XR8.Threejs.xrScene();

          const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
          scene.add(ambientLight);
          const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
          directionalLight.position.set(5, 10, 5);
          scene.add(directionalLight);

          const textureLoader = new THREE.TextureLoader();
          const sigilMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            side: THREE.DoubleSide,
          });

          if (sigilData?.imageData) {
            textureLoader.load(sigilData.imageData, (texture: any) => {
              sigilMaterial.map = texture;
              sigilMaterial.needsUpdate = true;
            });
          } else {
            sigilMaterial.color.setHex(0xc70eff);
          }

          const getOrCreateMesh = () => {
            if (!placedSigilMesh) {
              const geometry = new THREE.PlaneGeometry(1, 1);
              placedSigilMesh = new THREE.Mesh(geometry, sigilMaterial);
              scene.add(placedSigilMesh);
              setIsPlaced(true);
            }
            return placedSigilMesh;
          };

          // Desktop fallback: place sigil on a virtual plane 2 units in front of the camera,
          // based on exactly where the user tapped the screen.
          const placeViaRaycastFallback = (tapX: number, tapY: number) => {
            const raycaster = new THREE.Raycaster();
            // Convert viewport tap coordinates (0 to 1) to NDC (-1 to 1)
            const ndcX = tapX * 2 - 1;
            const ndcY = -(tapY * 2 - 1);
            raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);

            const camPos = new THREE.Vector3();
            const camDir = new THREE.Vector3();
            camera.getWorldPosition(camPos);
            camera.getWorldDirection(camDir);

            // Create a virtual plane parallel to the camera view, 2 units away
            const planeCenter = new THREE.Vector3().copy(camPos).addScaledVector(camDir, 2);
            const planeNormal = new THREE.Vector3().copy(camDir).negate();
            const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(planeNormal, planeCenter);

            const target = new THREE.Vector3();
            const intersection = raycaster.ray.intersectPlane(plane, target);

            const mesh = getOrCreateMesh();
            if (intersection) {
              mesh.position.copy(intersection);
            } else {
              mesh.position.copy(planeCenter); // Absolute fallback
            }
            
            // Rotate to face the camera (billboard toward viewer)
            mesh.lookAt(camPos);
            setStatus("Sigil Placed!");
            console.log(`[AR] Placed via raycast fallback at (${mesh.position.x.toFixed(2)}, ${mesh.position.y.toFixed(2)})`);
          };

          const handleTap = (e: TouchEvent | MouseEvent) => {
            if (!slamReady) {
              setStatus("Still scanning... move your camera slowly.");
              return;
            }

            let clientX, clientY;
            if ('touches' in e) {
              if ((e as TouchEvent).touches.length > 1) return;
              clientX = (e as TouchEvent).touches[0].clientX;
              clientY = (e as TouchEvent).touches[0].clientY;
            } else {
              clientX = (e as MouseEvent).clientX;
              clientY = (e as MouseEvent).clientY;
            }

            const tapX = clientX / window.innerWidth;
            const tapY = clientY / window.innerHeight;

            console.log(`[AR] Tap at (${tapX.toFixed(2)}, ${tapY.toFixed(2)})`);

            // Try SLAM hit test first (requires mobile IMU + SLAM tracking)
            let slamSucceeded = false;
            try {
              if (XR8.XrController && XR8.XrController.hitTest) {
                const hitTestResults = XR8.XrController.hitTest(
                  tapX, tapY, ['ESTIMATED_SURFACE']
                );
                console.log("[AR] hitTest results:", hitTestResults);
                if (hitTestResults && hitTestResults.length > 0) {
                  const hit = hitTestResults[0];
                  const mesh = getOrCreateMesh();
                  mesh.position.set(hit.position.x, hit.position.y, hit.position.z);
                  if (hit.rotation) {
                    mesh.quaternion.set(
                      hit.rotation.x, hit.rotation.y, hit.rotation.z, hit.rotation.w
                    );
                  } else {
                    mesh.rotation.x = -Math.PI / 2; // default: flat on floor
                  }
                  setStatus("Sigil Anchored!");
                  slamSucceeded = true;
                } else {
                  console.log("[AR] hitTest returned no results, using fallback.");
                }
              }
            } catch (err: any) {
              console.warn("[AR] hitTest threw:", err.message, "— using fallback.");
            }

            if (!slamSucceeded) {
              placeViaRaycastFallback(tapX, tapY);
            }
          };

          // Only listen to taps directly on the canvas (not on UI overlays or buttons)
          const canvas = canvasRef.current!;
          canvas.addEventListener('touchstart', handleTap);
          canvas.addEventListener('click', handleTap);
        },

        onUpdate: () => {
          if (!slamReady) {
            frameCount++;
            if (frameCount >= SLAM_WARMUP_FRAMES) {
              slamReady = true;
              setStatus("Ready! Tap a surface to place.");
              console.log("[AR] SLAM warmup complete, hit testing enabled.");
            }
          }
        }
      };
    };

    if (typeof XR8 !== 'undefined') {
      startAR();
    } else {
      window.addEventListener('xrloaded', startAR);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('xrloaded', startAR);
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('touchstart', startAR);
        canvasRef.current.removeEventListener('click', startAR);
      }
      if (typeof XR8 !== 'undefined') {
        XR8.stop();
        XR8.clearCameraPipelineModules();
      }
    };
  }, [sigilData]);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: 'black' }}>
      <canvas 
        ref={canvasRef} 
        style={{ width: '100%', height: '100%', display: 'block', position: 'absolute', top: 0, left: 0 }}
      />

      {/* SigiLife Overlay UI */}
      <div style={{ position: 'absolute', top: '20px', width: '100%', textAlign: 'center', zIndex: 10, pointerEvents: 'none' }}>
        <h1 style={{ color: 'gold', textShadow: '0 0 10px #000', fontFamily: 'New Rocker', marginBottom: '5px' }}>
          {isPlaced ? 'Sigil Anchored!' : 'AR Sigil Placement'}
        </h1>
        <div style={{ color: 'white', background: 'rgba(0,0,0,0.5)', display: 'inline-block', padding: '5px 15px', borderRadius: '20px', fontSize: '0.9rem' }}>
            Status: {status}
        </div>
      </div>

      {/* Back Button */}
      <div style={{ position: 'absolute', bottom: '40px', left: '20px', zIndex: 10 }}>
        <button
          className="grimoirebutton"
          onClick={() => navigate(-1)}
          style={{ padding: '10px 20px', fontSize: '1.2rem', cursor: 'pointer', background: '#4a148c', color: 'white', border: '2px solid gold', borderRadius: '8px' }}
        >
          Return to Grimoire
        </button>
      </div>
    </div>
  );
}