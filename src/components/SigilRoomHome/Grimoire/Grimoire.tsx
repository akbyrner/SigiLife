import BackButton from "../../Parts/BackButton"
import { Link } from 'react-router-dom'

export default function Grimoire({ user }: { user: any }) {
 console.log(user)
  return (
    <div className='maincontainer'>

      <div className={'grimoire'}>
        <div className={'usertitle'}>
          <img className="userpicture" src={user.picture}/>
          {user.username}'s
          <br/>Grimoire
        </div>
        <div className={'bookbox'}>
          <div className={"grimoireleftpage"}>
            <Link to="/map"> 🗺️ Map </Link>
            <br />
            <Link to="/scrye-friends"> 👥 Scrye Friends </Link>
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
