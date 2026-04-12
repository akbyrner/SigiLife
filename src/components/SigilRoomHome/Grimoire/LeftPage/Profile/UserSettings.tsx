import { useState } from 'react'
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { useUser } from '@/context/UserContext'
import { useNavigate, Link } from 'react-router-dom'


const AvatarSelector = ({ avatarId, onSelect }: { avatarId: string, onSelect: (id: string) => void }) => {
  return (
    <div className="flex gap-4">
      {["0", "1"].map((id) => (
        <img
          key={id}
          src={`Avatar${parseInt(id) + 1}.png`}
          className={`avatar cursor-pointer border-4 rounded-full ${avatarId === id ? "border-purple-500" : "border-transparent"}`}
          onClick={() => onSelect(id)}
        />
      ))}
    </div>
  )
}
export default function UserSettings() {
  const { user, setUser } = useUser()
  const navigate = useNavigate()
  const [isDark, setIsDark] = useState(user!.theme === 1)
  const [avatarId, setAvatarId] = useState(String(user?.avatar ?? 0))
  const [colorTheme, setColorTheme] = useState(user?.color_theme ?? 'cyber')


  const handleThemeChange = (checked: boolean) => {
    setIsDark(checked)
    document.documentElement.classList.toggle("dark", checked)
    fetch(`/api/users/${user!.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme: checked ? 1 : 0 })
    })
      .then(res => res.json())
      .then(updated => setUser(updated))
  }

  const handleColorThemeChange = (checked: boolean) => {
    const next = checked ? 'foliage' : 'cyber'
    setColorTheme(next)
    document.documentElement.classList.remove('theme-foliage')
    if (next === 'foliage') document.documentElement.classList.add('theme-foliage');
    fetch(`/api/users/${user!.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ color_theme: next })
    })
      .then(res => res.json())
      .then(updated => setUser(updated))
  }


  const handleAvatarChange = async (id: string) => {
    setAvatarId(id)
    const res = await fetch(`/api/users/${user!.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatar: parseInt(id) })
    })
    const updated = await res.json()
    setUser(updated)
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    navigate('/')
  }

  return (
    <div className="maincontainer">
      <div className="usersettings">
        <div className='header'></div>
        <h1>User Settings</h1>
        <br />
        <AvatarSelector avatarId={avatarId} onSelect={handleAvatarChange} />
        <br />

        <label className="flex items-center gap-2">
          Theme:
          <SwitchPrimitive.Root
            checked={isDark}
            onCheckedChange={handleThemeChange}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 data-[state=checked]:bg-purple-500"
          >
            <SwitchPrimitive.Thumb className="block h-4 w-4 translate-x-1 rounded-full bg-white transition-transform data-[state=checked]:translate-x-6" />
          </SwitchPrimitive.Root>
          {isDark ? "Dark" : "Light"}
        </label>
        <br />
        <label className="flex items-center gap-2">
          Colour Theme:
          <SwitchPrimitive.Root
            checked={colorTheme === 'foliage'}
            onCheckedChange={handleColorThemeChange}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-400 data-[state=checked]:bg-green-500"
          >
            <SwitchPrimitive.Thumb className="block h-4 w-4 translate-x-1 rounded-full bg-white transition-transform data-[state=checked]:translate-x-6" />
          </SwitchPrimitive.Root>
          {colorTheme === 'foliage' ? "Foliage" : "Cyber"}
        </label>
        <button className="navbutton" onClick={handleLogout}>
          Log Out
        </button>
        <br />
        <br />
        This is where you can delete your account
        <br />
        <Link to="/profile">Go to Profile </Link>

      </div>
    </div>
  )
}
