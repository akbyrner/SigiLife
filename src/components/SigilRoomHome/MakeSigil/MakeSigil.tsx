import { Link } from 'react-router-dom'
import BackButton from '../../Parts/BackButton'

export default function MakeSigil() {
  return (
    <div>
      <br />
      <h1>Make a Sigil</h1>
      <Link to="/make-sigil/write">Write It</Link>
      <Link to="/library">Sigil Library</Link>
      <br />
      <br />
      <br />

      <BackButton />
    </div>
  )
}
