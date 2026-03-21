import { Link } from 'react-router-dom'
import BackButton from '../Parts/BackButton'

export default function MakeSigil() {
  return (
    <div>
      <h1>Make a Sigil</h1>
      <BackButton />
      <Link to="/make-sigil/draw">Draw It</Link>
      <Link to="/make-sigil/write">Write It</Link>
      <Link to="/make-sigil/style">Style It</Link>
    </div>
  )
}
