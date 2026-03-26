import { Link } from 'react-router-dom'

export default function Menu() {
  return (
    <div>
      <Link to="/profile">Profile</Link>
      <br />
      <Link to="/map">SigilMap</Link>
      <br />
      <Link to="/settings">Settings</Link>
    </div>
  )
}