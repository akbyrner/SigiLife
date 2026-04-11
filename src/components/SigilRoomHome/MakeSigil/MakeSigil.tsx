import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useUser } from '@/context/UserContext'
import Menu from '../../Parts/Menu'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function MakeSigil() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [sigilCount, setSigilCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [canCreateMore, setCanCreateMore] = useState(true)
  const [remainingSlots, setRemainingSlots] = useState(12)

  const MAX_SIGILS = 12

  useEffect(() => {
    if (user) {
      checkSigilCount()
    }
  }, [user])


  const checkSigilCount = async () => {
    if (!user) return null;
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get(`${API_URL}/api/sigils/user/${user.id}/count`)
      console.log('full data object:', JSON.stringify(response.data))  // ← right here
      const data = response.data
      setSigilCount(data.count)
      setCanCreateMore(data.canCreateMore)
      setRemainingSlots(data.remainingSlots)
    } catch (err) {
      console.error('Error checking sigil count:', err)
      setError('Failed to load sigil count. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSigil = () => {
    if (canCreateMore) {
      navigate('/make-sigil/write')
    } else {
      alert('You have reached the maximum limit of 12 sigils.\n\nPlease destroy an existing sigil before creating a new one.')
    }
  }

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, []);
  if (!user) return null


  return (
    <div className='maincontainer'>
      <div ref={scrollRef} className='scrollcontainer'>
        <div className='makesigil'>
          <h1>Make a Sigil</h1>
          <Menu />
          <div className="sigilinfo">
            <p className="infotext">Current Sigils: {sigilCount}/{MAX_SIGILS}</p>
            {remainingSlots < 3 && (

              <p className="info-text warning">⚠️ {remainingSlots} slot(s) remaining</p>
            )}
            {error && <p className="info-text error">{error}</p>}
          </div>

          <button
            className="navbutton"
            onClick={handleCreateSigil}
            disabled={loading || !canCreateMore}
          >
            {loading ? 'Loading...' : canCreateMore ? 'Create New Sigil' : 'Max Limit Reached'}
          </button>

          <Link className="navbutton" to="/library">Sigil Library</Link>

        </div>
      </div>
    </div>
  )
}
