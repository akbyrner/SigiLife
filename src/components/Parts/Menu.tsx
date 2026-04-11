import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useUser } from '@/context/UserContext'

const NavMenu = function () {
  const navigate = useNavigate()
  return (
    <nav className='menu'>

      <button className="button" onClick={() => navigate(-1)}>⬅ Go Back</button>
      <Link className="button" to="/home">Home Room</Link>
      <Link className="button" to="/library?action=charge">Charge Sigil</Link>
      <Link className="button" to="/library?action=destroy">Destroy Sigil</Link>
      <Link className="button" to="/make-sigil/write">Make Sigil</Link>
      <Link className="button" to="/library">Sigil Library</Link>
      <Link className="button" to="/map">SigilMap</Link>
      <Link className="button" to="/settings">Settings</Link>

    </nav>
  )
}


export default function Menu() {
  const { user } = useUser()
  const [menuOpen, setMenuOpen] = useState(false)

  if (!user) { return null }

  return (
    <div className="navmenu">
      <button onClick={() => setMenuOpen(prev => !prev)}>
        {menuOpen ? '✕ Close Menu' : '☰ Menu'}
      </button>
      {menuOpen && <NavMenu />}
    </div>
  )
}