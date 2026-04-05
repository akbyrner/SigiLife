import BackButton from '../../Parts/BackButton'
import { useLocation, useNavigate } from "react-router-dom"
//import SigilDestroyEffect from './DestroyComponents/SigilDestroyEffect'
import ChargeEmotion from '../ChargeSigil/ChargeComponents/ChangeEmotion'
import { useState} from 'react';
import DestroyEmotion from './DestroyComponents/DestroyEmotion'
import { useUser } from '@/context/UserContext';

export default function DestroySigil() {
  const { state } = useLocation();
  const { sigilData } = state;

  const navigate = useNavigate();
  const { user } = useUser()
  if (!user) { return null }

  const [emotion, setEmotion] = useState("");

  console.log(sigilData)


  const handleDestroy = async () => {
    try {
      const res = await fetch(`/api/sigils/${sigilData.id}`, { method: 'DELETE' });
      if (!res.ok) { throw new Error('Failed to destroy sigil'); }
      navigate('/home');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='maincontainer'>
      <div className='destroysigil'>
        <h1> DestroySigil </h1>
        <ChargeEmotion emotion={emotion} setEmotion={setEmotion}/>
        <DestroyEmotion />

        <button className="navbutton" onClick={handleDestroy} >
          Destroy Sigil
        </button>
        <div className='footer'>
          <BackButton name={"Go Back"} />
        </div>
      </div>
    </div >
  )
};