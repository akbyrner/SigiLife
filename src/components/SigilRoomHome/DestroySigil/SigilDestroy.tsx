import BackButton from '../../Parts/BackButton'
import { Link, useLocation } from "react-router-dom"
import SigilDestroyEffect from './DestroyComponents/SigilDestroyEffect'
import DestroyEmotion from './DestroyComponents/DestroyEmotion'

export default function DestroySigil() {
  const { state } = useLocation();
  const { sigilData } = state;

  console.log(sigilData)

  return (
    <div className='maincontainer'>
      <div className='destroysigil'>
        <br />
        <h1> DestroySigil </h1>
        <DestroyEmotion />
        <SigilDestroyEffect />
        <br />
        <Link className="navbutton" to="/home">Back to Sigil Room</Link>

        <div className='footer'>
          <BackButton name={"Go Back"} />
        </div>
      </div>
    </div >
  )
};