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
          <div className={'leftpage'}>
            <br />
            <Link to="/map"> 🗺️ Map </Link>
            <br />
            <Link to="/scrye-friends"> 👥 Scrye Friends </Link>
            <br />
            <Link to="/profile" > 👤 Profile </Link>
            <br />
          </div>

          <div className={'grimiorerightpage'}>
            <br />
            <Link className="grimiorerightpagelibrarybox" to="/right-page" > 📜 SigiLibrary </Link>
            <br />
            <br />
            <Link to="/make-sigil"> 🪶 MakeSigil </Link>
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
