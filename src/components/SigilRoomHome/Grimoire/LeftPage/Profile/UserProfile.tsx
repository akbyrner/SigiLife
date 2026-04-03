
//import { useState } from "react"
import BackButton from "../../../../Parts/BackButton"
import {Link} from 'react-router-dom'
import { useUser } from '@/context/UserContext'


const AvatarSelector = () => {
  const { user } = useUser()
if (!user) { return null }
  return (
    <div className="useravatar">
        <img className="avatar"
          src={`Avatar${user!.avatar}.png`}/>
    </div>
  )
}


export default function UserProfile() {
const { user } = useUser()
if (!user) { return null }

  console.log(user)
  return (
    <div className="maincontainer">
      <div>
        <br />
        <h1> UserProfile </h1>
        <img className="avatar border-4 rounded-full" />
        {user.username}
        <br />
        <AvatarSelector/>
        <br />
        {user.theme}
        <br />
<Link to='/settings'> Go To Settings </Link>
  <br />
        <BackButton name={"Grimiore"} />
      </div>
    </div>
  )
};