import { Link } from 'react-router-dom'

export default function HomeRoom() {
  return (
    <div>
      <h1>Home Room</h1>
      <br />
      <nav>
        <Link to="/destroy-sigil">Destroy Sigil</Link>
        <br />
        <Link to="/charge-sigil">Charge Sigil</Link>
        <br />
        <Link to="/grimoire">Grimoire</Link>
        <br />
        <Link to="/make-sigil">Make Sigil</Link>
        <br />
      </nav>
    </div>
  )
}

