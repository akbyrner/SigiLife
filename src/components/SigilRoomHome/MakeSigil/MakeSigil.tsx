import { Link } from 'react-router-dom'
import BackButton from '../../Parts/BackButton'
import {useUser} from '@/context/UserContext'

export default function MakeSigil() {
  const { user } = useUser()
if (!user) { return null }
    console.log(user)
  return (
    <div className='maincontainer'>
    <div className='makesigil'>
      <h1>Make a Sigil</h1>
      <Link className="navbutton" to="/make-sigil/write">Write It</Link>
      <br />
      <Link className="navbutton" to="/library">Sigil Library</Link>
      <br />
      <br />
      <br />

      <BackButton name={"Go Back"} />
    </div>
    </div>
  )
}
