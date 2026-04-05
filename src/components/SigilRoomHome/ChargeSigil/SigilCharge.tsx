import BackButton from '../../Parts/BackButton'
import { Link, useLocation, useNavigate } from "react-router-dom"
import SigilChargeEffect from './ChargeComponents/SigilChargeEffect'
import ChangeEmotion from './ChargeComponents/ChangeEmotion'
import { useState } from 'react'
import {useUser} from '@/context/UserContext'

export default function ChargeSigil() {
  const { state } = useLocation();
  const { sigilData } = state;
  const navigate = useNavigate();
  const { user } = useUser()

  const [emotion, setEmotion] = useState("")

  if (!user) { return null }


  const handleCharge = async () => {
    try {
      const res = await fetch(`/api/sigils/${sigilData.id}/charge`, { method: 'PATCH' });
      if (!res.ok) { throw new Error('Failed to charge sigil'); }
      const updatedSigil = await res.json();
      navigate('/sigil-page', { state: { sigilData: updatedSigil } });
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <div className='maincontainer'>
      <div className='chargesigil'>
        <h1>ChargeSigil</h1>

        <ChangeEmotion emotion={emotion} setEmotion={setEmotion} />
        <SigilChargeEffect />
        <button className="navbutton" onClick={handleCharge}>
          Charge Sigil
        </button>
        <Link className="navbutton" to="/sigil-page" state={{ sigilData }}>
          Save your Sigil!</Link>
        <Link className="navbutton" to="/destroy-sigil" state={{ sigilData }}>
          Destroy Your Charged Sigil!</Link>

        <div className='footer'>
          <BackButton name={"Go Back"} />
        </div>
      </div>
    </div>
  )
};