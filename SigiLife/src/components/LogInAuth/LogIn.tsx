import { Link } from 'react-router-dom'

function Login() {
  return (
    <div>
      <h1>Login</h1>
      <Link to="/make-profile">Create an account</Link>
    </div>
  )
}
export default Login