import { Link } from 'react-router-dom'

export default function NextButton({ to }: { to: string }) {
  return (
    <Link to={ to }>
      <button className="navbutton">
        { to }
      </button>
    </Link>
  )
}