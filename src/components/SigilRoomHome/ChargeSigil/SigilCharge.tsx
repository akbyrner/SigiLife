import Menu from '../../Parts/Menu'
import { Link, useNavigate, useSearchParams } from "react-router-dom"

import ChangeEmotion from './ChargeComponents/ChangeEmotion'
import { useState, useEffect, useRef } from 'react'
import { useUser } from '@/context/UserContext'
import SplashCursor from './ChargeComponents/SplashCursor'

export default function ChargeSigil() {
  const [searchParams] = useSearchParams()
  const sigilId = searchParams.get('sigilId')
  const { user } = useUser()
  const navigate = useNavigate()
  const [sigilData, setSigilData] = useState<any>(null)
  const [emotion, setEmotion] = useState("")
  const [isCharging, setIsCharging] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sigilData) { return }
    const el = scrollRef.current;
    if (!el) { return; }
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, [sigilData])

  useEffect(() => {
    if (!sigilId) { return }
    fetch(`/api/sigils/${sigilId}`)
      .then(res => res.json())
      .then(data => setSigilData(data))
      .catch(err => console.error(err))
  }, [sigilId])

  if (!user) { return null }
  if (!sigilData) {
    return (
      <p>Loading Sigil!</p>
    )
  }

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/sigils/${sigilData.id}/charge`, { method: 'PATCH' });
      if (!res.ok) { throw new Error('Failed to charge sigil'); }
      const updatedSigil = await res.json();
      navigate(`/sigil-page?sigilId=${updatedSigil.id}`)
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className='maincontainer'>
                <Menu />
      <div ref={scrollRef} className={`scrollcontainer ${isCharging ? 'noscroll' : ''}`}>
        {isCharging && (
          <SplashCursor
            BACK_COLOR={{ r: 0, g: 0, b: 0 }}
            TRANSPARENT={true}
            SPLAT_RADIUS={0.2}
            SPLAT_FORCE={6000}
            DENSITY_DISSIPATION={3.5}
            VELOCITY_DISSIPATION={2}
          />
        )}
        <div className='chargesigil'>
          <Menu />
          <h1>ChargeSigil</h1>



          {sigilData.imageData ? (
            <img className="sigilbox" src={sigilData.imageData} alt={sigilData.name} />
          ) : (
            <img className="sigilbox" src="src/assets/dummySigil.svg" alt="placeholderSigil" />
          )}
          <ChangeEmotion emotion={emotion} setEmotion={setEmotion} />
          {!isCharging && (
            <button
              className='navbutton'
              onClick={() => setIsCharging(true)}
              disabled={!emotion}>
              Charge Sigil
            </button>
          )}

          {isCharging && (
            <button className='navbutton' onClick={handleSave}>
              Save your Sigil!
            </button>
          )}

          {isCharging && (
            <Link className="navbutton" to="/destroy-sigil" state={{ sigilData }}>
              Destroy Your Charged Sigil!
            </Link>
          )}

        </div>
      </div>
    </div>
  )
}