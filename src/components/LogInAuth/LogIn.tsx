import { Link } from 'react-router-dom'
import GoogleAuth from './GoogleAuth'


export default function Login({ setUser, formData }: { setUser: (user: any) => void, formData: any }) {
  return (
    <div>
      <h1>Login</h1>
      <br />
      <GoogleAuth setUser={setUser} formData={formData} />
      <br />
      Or:
      <br />
      <Link className="navbutton" to="/make-profile">Create an account</Link>
    </div>
  )
}
