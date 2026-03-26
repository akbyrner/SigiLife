import { useNavigate } from 'react-router-dom'

export default function BackButton({ name }: { name: any }) {
  const navigate = useNavigate();
  return (
    <button className="navbutton"
      onClick={() => navigate(-1)}>
      { name }
    </button>
  )
}

