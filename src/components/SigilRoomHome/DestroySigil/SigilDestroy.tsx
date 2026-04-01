import BackButton from '../../Parts/BackButton'
import { useLocation, useNavigate } from "react-router-dom"
//import SigilDestroyEffect from './DestroyComponents/SigilDestroyEffect'
import ChangeEmotion from '../ChargeSigil/ChargeComponents/ChangeEmotion'
import { useEffect } from 'react';
import  DestroyEmotion  from './DestroyComponents/DestroyEmotion'

export default function DestroySigil() {
  const { state } = useLocation();
  const { sigilData } = state;
 const navigate = useNavigate();

  console.log(sigilData)

  useEffect(() => {
    setTimeout(() => {
      const scrollableWidth = document.documentElement.scrollWidth - window.innerWidth;
      window.scrollTo(scrollableWidth / 2, 0);
    }, 0);
  }, []);

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
        <ChangeEmotion />
        <DestroyEmotion />

        <button className="navbutton" onClick={()=> handleDestroy} >
          Destroy Sigil
        </button>
        <div className='footer'>
          <BackButton name={"Go Back"} />
        </div>
      </div>
    </div >
  )
};