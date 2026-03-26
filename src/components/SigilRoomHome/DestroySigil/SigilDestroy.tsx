import BackButton from '../../Parts/BackButton'
import { Link } from 'react-router-dom'
import SigilDestroyEffect from './DestroyComponents/SigilDestroyEffect'
import DestroyEmotion from './DestroyComponents/DestroyEmotion'

export default function DestroySigil({ user }: { user: any }) {
    console.log(user)
  return (
    <div>
      <br />
      <h1> DestroySigil </h1>
      <DestroyEmotion />
      <SigilDestroyEffect />
      <br />
      <Link to="/home">Back to Sigil Room</Link>
      <br />
      <br />
      <br />

      <BackButton name={"Go Back"}/>
    </div>
  )
};