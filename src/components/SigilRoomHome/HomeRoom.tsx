

import { Link } from 'react-router-dom'
import BackButton from '../Parts/BackButton'

export default function HomeRoom({ user }: { user: any }) {
  console.log(user)
  return (
    <div className='maincontainer'>
      <div className='homeroom'>
        <h1>Home Room</h1>

        <nav>
          <Link className='destroybutton' to="/library">Destroy Sigil</Link>
          <Link className='chargebutton' to="/library">Charge Sigil</Link>
          <Link className='grimoirebutton' to="/grimoire" >Grimoire</Link>
          <Link className='makesigilbutton' to="/make-sigil">Make Sigil</Link>
        </nav>

        <BackButton name={"Go Back"} />
      </div>
    </div>
  )

}

