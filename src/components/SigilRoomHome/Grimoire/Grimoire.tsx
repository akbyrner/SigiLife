import BackButton from "../../Parts/BackButton"

import { Link } from 'react-router-dom'

export default function Grimoire({ user }: { user: any }) {

  return (
    <div className='maincontainer'>

      <div className={'grimoire'}>
        <div className={'usertitle'}>
          {user.user}'s Grimoire
        </div>
        <div className={'bookbox'}>
          <div className="grimiore-left-page-nav-box">
            <Link className="navbutton" to="/map"> 🗺️ Map </Link>
            <br />
            <Link className="navbutton" to="/scrye-friends"> 👥 Scrye Friends </Link>
            <br />
            <Link className="navbutton" to="/profile" > 👤 Profile </Link>
          </div>
        </div>
        <div className="bookbox">
          <div className="grimiore-right-page">
            <br />
            <Link className="navbutton grimiorerightpagelibrarybox" to="/right-page" > 📜 SigiLibrary </Link>
            <br />
            <br />
            <Link className="navbutton" to="/make-sigil"> 🪶 MakeSigil </Link>
          </div>
          <br />
          <br />
          <br />
        </div>
        <BackButton name={"Sigil Home Room"} />
      </div>
    </div>
  )
}
