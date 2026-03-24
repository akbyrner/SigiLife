import BackButton from "../../../../Parts/BackButton"
import ScryeFriendsHome from "./ScryeFriendsHome"

export default function ScryeMirror({ user }: { user: any }) {
    console.log(user)
  return (
    <div>
      <br />
      <h1>Scrye Mirror</h1>
      <ScryeFriendsHome user={user}/>
      <br />
      <br />
      <br />

      <BackButton name={"Grimiore"}/>
    </div>
  )
}
