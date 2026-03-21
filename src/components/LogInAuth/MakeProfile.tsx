import { Link } from 'react-router-dom'

export default function MakeProfile() {
  return (
    <div>
      <br />
      <h1>Create Profile</h1>
      <br />
      This is where you will link your Google Account
      <br />
      This is where you will choose your username
      <br />
      This is where you will choose your avatar
      <br />
      This is where you will confirm your choices / Choices are validated
      <br />
      <Link to="/home">Enter SigiLife</Link>
    </div >
  )
}
