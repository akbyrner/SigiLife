
//import { useState } from "react"
import BackButton from "../../../../Parts/BackButton"
import { Link } from 'react-router-dom'
import { useUser } from '@/context/UserContext'
import  UserFriends  from './UserFriends'

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

  //  const handleFollow = async (targetId: number) => {
  //   await fetch(`/api/users/follow`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ followerId: user.id, followingId: targetId })
  //   })
  //   setSearchResults(prev => prev.filter(u => u.id !== targetId))
  //   fetchFollowData()
  // }

  //   const handleUnfollow = async (targetId: number) => {
  //   await fetch(`/api/users/unfollow`, {
  //     method: "PATCH",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ followerId: user.id, followingId: targetId })
  //   })
  //   fetchFollowData()
  // }

  console.log(user)
  return (
    <div className="maincontainer">
      <div className="profilepage">
        <br />
        <h1> UserProfile </h1>
        <AvatarFace />

        {user.username}
        <br />
        <AvatarPicture />
        <br />
        <Themebox />
        <br />
        <UserFriends/>
        <br />
        <br />
        <Link to='/settings'> Go To Settings </Link>
        <br />
        <BackButton name={"Grimoire"} />
      </div>
    </div>
  )
};