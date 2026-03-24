import BackButton from "../../../../Parts/BackButton"

export default function UserFriends({ user }: { user: any }) {
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