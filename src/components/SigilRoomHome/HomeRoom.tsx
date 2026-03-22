import { Link } from 'react-router-dom'
import BackButton from '../Parts/BackButton'

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
      </nav>
      <br />
      <br />
      <br />

      <BackButton />
    </div>
  )

}

