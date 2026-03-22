import BackButton from '../../Parts/BackButton'
import { Link } from 'react-router-dom'

export default function DestroySigil() {
  return (
    <div>
      <br />
      <h1> DestroySigil </h1>
      <br />
      <Link to="/home">Back to Sigil Room</Link>
      <br />
      <br />
      <br />

      <BackButton />
    </div>
  )
};