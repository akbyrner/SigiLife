import BackButton from '../../Parts/BackButton'
import { Link, useLocation } from "react-router-dom"
import SigilChargeEffect from './ChargeComponents/SigilChargeEffect'
import ChargeEmotion from './ChargeComponents/ChargeEmotion'
//import { useState } from 'react'

export default function ChargeSigil({ user }: { user: any }) {
  const { state } = useLocation();
  const { sigilData } = state;



  return (
    <div className='maincontainer'>
      <div className='chargesigil'>
        <h1>ChargeSigil</h1>

        <ChargeEmotion />
        <SigilChargeEffect />

        <Link className="navbutton" to="/sigil-page" state={{ sigilData }}>Save your Sigil!</Link>

        <Link className="navbutton" to="/destroy-sigil" state={{ sigilData }}>Destroy Your Charged Sigil!</Link>

        <Link className="navbutton" to="/home">Back to Sigil Room</Link>

        <div className='footer'>
          <BackButton name={"Go Back"} />
        </div>
      </div>
    </div>
  )
};