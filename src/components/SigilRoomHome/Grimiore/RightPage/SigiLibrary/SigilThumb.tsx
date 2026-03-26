import { Link } from 'react-router-dom'

export default function SigilThumb({ sigilKey, sigilData }: { sigilKey: string, sigilData: any }) {
  return (
    <Link className="sigilthumb" to="/sigil-page" state={{ sigilKey, sigilData }}>
      <div>
        <p>{sigilData.name}</p>
        <p>{sigilData.location.name}</p>
        <p>{sigilData.sigilGroup}</p>
      </div>
    </Link>
  )

};