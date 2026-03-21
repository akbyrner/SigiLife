import { Link } from 'react-router-dom'

function MakeSigil() {
  return (
    <div>
      <h1>Make a Sigil</h1>
      <Link to="/make-sigil/draw">Draw It</Link>
      <Link to="/make-sigil/write">Write It</Link>
      <Link to="/make-sigil/style">Style It</Link>
    </div>
  )
}
export default MakeSigil