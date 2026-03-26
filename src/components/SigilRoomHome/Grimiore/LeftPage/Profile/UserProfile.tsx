
import BackButton from "../../../../Parts/BackButton"

export default function UserProfile({ user }: { user: any }) {
  console.log(user)
  return (
    <div>
      <br />
      <h1> UserProfile </h1>
      {user.user}
      <br />
      {user.avatar}
      <br />
      {user.theme}
      <br />

      <BackButton name={"Grimiore"}/>
    </div>
  )
};