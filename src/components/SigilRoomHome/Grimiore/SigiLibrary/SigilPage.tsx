import BackButton from "../../../Parts/BackButton"
import { Link } from 'react-router-dom'

export default function SigilPage() {

  return (<div>
    <h1>This is the SigilPage</h1>
    <br />
    <Link to="/charge-sigil">Charge Sigil</Link>
    <br />
    <Link to="/destroy-sigil">Destroy Sigil</Link>
    <br />
    <BackButton />
  </div>)
};