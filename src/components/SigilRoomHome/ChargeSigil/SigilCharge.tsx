import BackButton from '../../Parts/BackButton'
import { Link } from 'react-router-dom'

export default function ChargeSigil() {

  return (
    <div>
      <br />
      <h1>ChargeSigil</h1>
      <br />
      <Link to="/sigil-page">Save your Sigil!</Link>
      <br />
      <Link to="/destroy-sigil">Destroy Your Charged Sigil!</Link>
      <br />
      <Link to="/home">Back to Sigil Room</Link>
      <br />
      <br />
      <br />

      <BackButton />

    </div>
  )
};