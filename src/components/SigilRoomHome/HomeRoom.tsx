import { Link } from 'react-router-dom'

export default function HomeRoom() {
  return (
    <div>
      <h1>Home Room</h1>
      <nav>
        <Link to="/grimoire">Grimoire</Link>
        <Link to="/scrye-mirror">Scrye Mirror</Link>
        <Link to="/make-sigil">Make Sigil</Link>
        <Link to="/map">Map</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/charge-sigil">Charge Sigil</Link>
        <Link to="/destroy-sigil">Destroy Sigil</Link>
      </nav>
    </div>
  )
}

