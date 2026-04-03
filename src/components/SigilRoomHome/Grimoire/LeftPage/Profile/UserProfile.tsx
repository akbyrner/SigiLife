
import { useState } from "react"

import BackButton from "../../../../Parts/BackButton"
import * as SwitchPrimitive from "@radix-ui/react-switch"

const AvatarSelector = ({ avatarId, onSelect }: { avatarId: string, onSelect: (id: string) => void }) => {
  return (
    <div className="flex gap-4">
      {["0", "1"].map((id) => (
        <img
          key={id}
          src={`public/Avatar${parseInt(id) + 1}.png`}
          className={`avatar cursor-pointer border-4 rounded-full ${avatarId === id ? "border-purple-500" : "border-transparent"}`}
          onClick={() => onSelect(id)}
        />
      ))}
    </div>
  )
}




export default function UserProfile({ user }: { user: any }) {
  const [isDark, setIsDark] = useState(user.theme === 1)
  const [avatarId, setAvatarId] = useState(user.avatar)
  const handleThemeChange = async (checked: boolean) => {
    setIsDark(checked)
    document.documentElement.classList.toggle("dark", checked)
    await fetch(`/api/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme: checked ? 1 : 0 })
    })
  }

  const handleAvatarChange = async (id: string) => {
    setAvatarId(id)
    await fetch(`/api/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatar: id })
    })
  }




  console.log(user)
  return (
    <div className="maincontainer">
      <div>
        <br />
        <h1> UserProfile </h1>
        <img className="avatar border-4 rounded-full" src={user.picture} />
        {user.username}
        <br />
        <AvatarSelector avatarId={avatarId} onSelect={handleAvatarChange} />
        <br />
        <label>
          Theme picker:
          <SwitchPrimitive.Root
            checked={isDark}
            onCheckedChange={handleThemeChange}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-300 data-[state=checked]:bg-purple-600">
            <SwitchPrimitive.Thumb className="block h-4 w-4 translate-x-1 rounded-full bg-white transition-transform data-[state=checked]:translate-x-6" />
          </SwitchPrimitive.Root>
          {isDark ? "Dark" : "Light"}
        </label>
        <br />
        {user.theme}
        <br />

        <BackButton name={"Grimiore"} />
      </div>
    </div>
  )
};