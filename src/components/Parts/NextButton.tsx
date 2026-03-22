import { Link } from 'react-router-dom'

export default function NextButton({ to }: { to: string }) {
  return (
    <Link to={to}>
      <button className="nav-button"
        style={{ backgroundColor: "#9e38fd" }}>
        Next
      </button>
    </Link>
  )
}