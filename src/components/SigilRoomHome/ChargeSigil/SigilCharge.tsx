import BackButton from '../../Parts/BackButton'
import { Link } from 'react-router-dom'
import SigilChargeEffect from './ChargeComponents/SigilChargeEffect'
import ChargeEmotion from './ChargeComponents/ChargeEmotion'
//import { useState } from 'react'

export default function ChargeSigil({ user }: { user: any }) {
 // const [isCharged, setIsCharged] = useState(false);

  console.log(user);

  return (
    <div>
      <br />
      <h1>ChargeSigil</h1>
      <SigilChargeEffect />
      <ChargeEmotion />
      <br />
      <Link className="navbutton" to="/sigil-page">Save your Sigil!</Link>
      <br />
      <Link className="navbutton" to="/destroy-sigil">Destroy Your Charged Sigil!</Link>
      <br />
      <Link className="navbutton" to="/home">Back to Sigil Room</Link>
      <br />
      <br />
      <br />

      <BackButton name={"Go Back"} />

    </div>
  )
};