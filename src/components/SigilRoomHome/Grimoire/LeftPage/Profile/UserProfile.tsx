
//import { useState } from "react"
import { useUser } from '@/context/UserContext'
import UserFriends from './UserFriends'
import Menu from '../../../../Parts/Menu'

export default function UserProfile() {
  const { user } = useUser()
  if (!user) { return null }
  const theme = user!.theme;

  const AvatarPicture = () => {
    return (
      <div className="useravatar">
        <img className="avatar"
          src={`Avatar${user!.avatar + 1}.png`} />
      </div>
    )
  }

  const AvatarFace = () => {
    return (
      <div className="avatarfacebox">
        <img className="avatarface"
          src={`Avatar${user!.avatar + 1}face.png`} />
      </div>
    )
  }

  const Themebox = () => {
    if (theme === 0) {
      return (
        <div className="themebox">
          You have a Light Theme
          <div className="themecolor1"></div>
          <div className="themecolor2"></div>
          <div className="themecolor3"></div>
        </div>
      )
    }
    return (
      <div className="themebox">
        You have a Dark Theme
        <div className="themecolor4"></div>
        <div className="themecolor5"></div>
        <div className="themecolor6"></div>
      </div>
    )

  }


  console.log(user)
  return (
    <div className="maincontainer">
      <div className="profilepage">
        <Menu />
        <h1> UserProfile </h1>
        <AvatarFace />

        {user.username}
        <br />
        <AvatarPicture />
        <br />
        <Themebox />
        <br />
        <UserFriends />
        <br />

      </div>
    </div>
  )
};