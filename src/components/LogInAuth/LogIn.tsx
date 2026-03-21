import { Link } from 'react-router-dom'
import GoogleAuth from './GoogleAuth'

export default function Login() {
  return (
    <div>
      <h1>Login</h1>
      <br />
      <GoogleAuth />
      <br />
      Or:
      <br />
      <Link to="/make-profile">Create an account</Link>
    </div>
  )
}
