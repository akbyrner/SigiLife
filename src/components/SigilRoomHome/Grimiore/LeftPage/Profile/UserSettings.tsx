import BackButton from "../../../../Parts/BackButton"
export default function UserSettings({ user }: { user: any }) {
  console.log(user)
  return (
    <div>
      <h1>User Settings</h1>
      <br />
      <br /> This is where you can Log Out
      <br />
      <br />
      <br />
            This is where you can delete your account

      <BackButton name={"Go Back"}/>
    </div>
  )
}
