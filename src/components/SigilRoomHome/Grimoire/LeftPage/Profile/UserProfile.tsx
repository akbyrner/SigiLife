
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
    const colorTheme = user!.color_theme ?? 'cyber'
    const isDark = theme === 1

    const labels = {
      'cyber-light': 'Cyber · Light',
      'cyber-dark': 'Cyber · Dark',
      'foliage-light': 'Foliage · Light',
      'foliage-dark': 'Foliage · Dark',
    }

    const swatches = {
      'cyber-light': ['#c8d8f0', '#a0bcee', '#1a4fc4', '#4d9fff'],
      'cyber-dark': ['#0a0f2e', '#0d1a4a', '#4d9fff', '#00d4ff'],
      'foliage-light': ['#d4ebd0', '#b2d9a8', '#2d7a3a', '#66bb6a'],
      'foliage-dark': ['#0a1f0d', '#122b14', '#66bb6a', '#a5d6a7'],
    }

    const key = `${colorTheme}-${isDark ? 'dark' : 'light'}` as keyof typeof swatches

    return (
      <div className="themebox">
        {labels[key]}
        <div className="flex gap-2 mt-2">
          {swatches[key].map((color, i) => (
            <div
              key={i}
              style={{ backgroundColor: color, width: 32, height: 32, borderRadius: 6 }}
            />
          ))}
        </div>
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