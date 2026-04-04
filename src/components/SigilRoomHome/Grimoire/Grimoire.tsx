import BackButton from "../../Parts/BackButton"
import { Link } from 'react-router-dom'
import { useUser } from '@/context/UserContext'


export default function Grimoire() {
  const { user } = useUser()
  if (!user) { return null }
  console.log(user)
  return (
    <div className='maincontainer'>

      <div className={'grimoire'}>
        <div className={'usertitle'}>
          {user!.username}'s
          <br />Grimoire
        </div>
        <div className={'bookbox'}>
          <div className={"grimoireleftpage"}>
            <Link to="/map"> 🗺️ Map </Link>
            <br />
            <Link to="/profile" > 👤 Profile </Link>
          </div>
        </div>
        <div className="bookbox">
          <div className={"grimoirerightpage"}>
            <Link to="/right-page" > 📜 SigiLibrary </Link>
            <br />
            <Link to="/make-sigil"> 🪶 MakeSigil </Link>
          </div>

        </div>
        <div className="footer">
          <BackButton name={"Sigil Home Room"} /></div>
      </div>
    </div>
  )
}
