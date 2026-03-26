import { Link } from 'react-router-dom'
import BackButton from '../../Parts/BackButton'

export default function MakeSigil({ user }: { user: any }) {
    console.log(user)
  return (
    <div className='maincontainer'>
    <div>
      <br />
      <h1>Make a Sigil</h1>
      <Link to="/make-sigil/write">Write It</Link>
      <br />
      <Link to="/library">Sigil Library</Link>
      <br />
      <br />
      <br />

      <BackButton name={"Go Back"} />
    </div>
    </div>
  )
}
