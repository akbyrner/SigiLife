import BackButton from "../../Parts/BackButton"

import { Link } from 'react-router-dom'

export default function Grimoire({ user }: { user: any }) {

  return (
    <div className={'grimoire'}>
      <h1> {user.user}'s Grimoire </h1>

      <div className={'bookbox'}>
        <div className={'leftpage'}>
          <br />
          <Link to="/map"> Map </Link>
          <br />
          <Link to="/scrye-friends"> Scrye Friends </Link>
          <br />
          <Link to="/profile" > Profile </Link>
          <br />
        </div>

        <div className={'rightpage'}>
          <Link to="/library"> SigiLibrary </Link>
        </div>
        <br />
        <br />
        <br />
      </div>
      <BackButton />
    </div>
  )
}
