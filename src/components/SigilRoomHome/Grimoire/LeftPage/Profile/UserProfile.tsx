
import { useState } from "react"

import BackButton from "../../../../Parts/BackButton"
import * as SwitchPrimitive from "@radix-ui/react-switch"

const AvatarSelector = ({ avatarId }: { avatarId: any }) => {
  if (avatarId === "0") {
    return (
      <img className="avatar" src="public/Avatar1.png" />
    )
  } else {
    return (
      <img className="avatar" src="public/Avatar2.png" />
    )
  }
}




export default function UserProfile({ user }: { user: any }) {
    
  console.log(user)
  return (
    <div className="maincontainer">
      <div>
        <br />
        <h1> UserProfile </h1>

        {user.username}
        <br />
        <AvatarSelector avatarId={user.avatar} />
        <br />
        <label>
        Theme picker:
        <SwitchPrimitive.Root>
          <SwitchPrimitive.Thumb />
        </SwitchPrimitive.Root>
        </label>
        {user.theme}
        <br />

        <BackButton name={"Grimiore"} />
      </div>
    </div>
  )
};