import BackButton from "../../../../Parts/BackButton"
import ScryeFriendsHome from "./ScryeFriendsHome"
import { useUser } from '@/context/UserContext'

export default function ScryeMirror() {
  const { user } = useUser()
if (!user) { return null }
    console.log(user)
  return (
    <div>
      <br />
      <h1>Scrye Mirror</h1>
      <ScryeFriendsHome />
      <br />
      <br />
      <br />

      <BackButton name={"Grimoire"}/>
    </div>
  )
}
