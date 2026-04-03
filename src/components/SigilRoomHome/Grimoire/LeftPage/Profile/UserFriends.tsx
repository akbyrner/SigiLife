import BackButton from "../../../../Parts/BackButton"
import {useUser} from '@/context/UserContext'

export default function UserFriends() {
  const { user } = useUser()
if (!user) { return null }
  console.log(user)
  return (
    <div>
      <br />
      <h1> UserFriends </h1>
      <br />
      <br />
      <br />

      <BackButton name={"Profile"}/>
    </div>
  )
};