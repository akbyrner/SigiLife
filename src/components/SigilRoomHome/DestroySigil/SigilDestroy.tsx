import { useState, useRef, useEffect } from 'react'
import BackButton from '../../Parts/BackButton'
import { useLocation, Link } from "react-router-dom"
import ChangeEmotion from '../ChargeSigil/ChargeComponents/ChangeEmotion'
import EvilEye from './DestroyComponents/EvilEye'
import { useUser } from '@/context/UserContext'
import GhostCursor from './DestroyComponents/GhostCursor.tsx'

export default function DestroySigil() {
  const { state } = useLocation();
  const { sigilData } = state;
  const { user } = useUser()
  const [emotion, setEmotion] = useState("")
  const [isDestroying, setIsDestroying] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const eyeContainerRef = useRef<HTMLDivElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, []);


  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const eyeEl = eyeContainerRef.current;
    if (!eyeEl) return;
    const rect = eyeEl.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    setMousePos({ x, y });
  };

  const handleDestroy = async () => {
    console.log('destroy clicked, sigilData.id:', sigilData.id)
    if (isSubmitting) {
      return;
    }
    try {
      const res = await fetch(`/api/sigils/${sigilData.id}`, { method: 'DELETE' });
      console.log('response status:', res.status)
      if (!res.ok) { throw new Error('Failed to destroy sigil'); }
      setIsDestroying(true)
    } catch (error) {
      console.error('destroy error:', error);
      setIsSubmitting(false)
    }
  };

  if (!user) { return null }

  return (
    <div className='maincontainer'>
      <div ref={scrollRef} className={`scrollcontainer ${isDestroying ? 'noscroll' : ''}`}>

        <div className='destroysigil' onMouseMove={isDestroying ? handleMouseMove : undefined}>
          {isDestroying && (
            <>

              <div className='evileye'>
                <EvilEye
                  eyeColor="#2e0fa9"
                  intensity={3.1}
                  pupilSize={0.75}
                  irisWidth={0.25}
                  glowIntensity={0.65}
                  scale={0.5}
                  noiseScale={1}
                  pupilFollow={1.6}
                  flameSpeed={2.5}
                  backgroundColor="#06000f"
                  externalMouse={mousePos}
                />
              </div>
              <GhostCursor
                // Visuals
                zIndex={1} 
                color="#e74040"
                brightness={2}
                edgeIntensity={0}

                // Trail and motion
                trailLength={50}
                inertia={0.5}

                // Post-processing
                grainIntensity={0.05}
                bloomStrength={0.1}
                bloomRadius={1}
                bloomThreshold={0.025}

                // Fade-out behavior
                fadeDelayMs={1000}
                fadeDurationMs={1500}
              />
            </>
          )
          }

          <h1>Destroy Sigil</h1>
          <ChangeEmotion emotion={emotion} setEmotion={setEmotion} />
          {sigilData.imageData ? (
            <img className="sigilbox" src={sigilData.imageData} alt={sigilData.name} />
          ) : (
            <img className="sigilbox" src="src/assets/dummySigil.svg" alt="Dummy Sigil" />
          )}
          {!isDestroying && (
            <button className="navbutton" onClick={handleDestroy} disabled={!emotion || isSubmitting}>
              Destroy Sigil
            </button>
          )}
          {isDestroying && (
            <Link className="navbutton" to='/home'>Go Home</Link>
          )}
          {!isDestroying && (
            <div className='footer'>
              <BackButton name={"Go Back"} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}