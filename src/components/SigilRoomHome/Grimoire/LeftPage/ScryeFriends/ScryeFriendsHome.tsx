import BackButton from "../../../../Parts/BackButton"
import {useUser} from  '@/context/UserContext'

export default function ScryeFriendsHome() {
const { user } = useUser()
if (!user) { return null }
  return (
  <div className="maincontainer">
  <div>
    <br />
    <h1>This is the ScryeFriendsHome!</h1>
      <br />
      <br />
      <br />

      <BackButton name={"Grimoire"}/>
    </div></div>
  )
};