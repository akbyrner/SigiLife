import { Link } from 'react-router-dom'

export default function HomeRoom() {
  return (
    <div>
      <h1>Home Room</h1>
      <br />
      <nav>
        <Link to="/library">Destroy Sigil</Link>
        <br />
        <Link to="/library">Charge Sigil</Link>
        <br />
        <Link to="/grimoire">Grimoire</Link>
        <br />
        <Link to="/make-sigil">Make Sigil</Link>
        <br />
      </nav>
    </div>
  )
}

