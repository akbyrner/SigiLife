import { Link } from 'react-router-dom'

export default function SigilThumb({ sigilData }: {  sigilData: any }) {
  return (
    <Link className="sigilthumb" to="/sigil-page" state={{ sigilData }}>
      <div>
        <p>{sigilData.name}</p>
        <p>{sigilData.locationName}</p>
        <p>{sigilData.sigilGroups?.map((g: any) => g.groupMember.join(','))}</p>
      </div>
    </Link>
  )

};