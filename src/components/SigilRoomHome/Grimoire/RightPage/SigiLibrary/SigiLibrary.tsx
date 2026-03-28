import SigilThumb from "./SigilThumb"
import MapBox from "../../LeftPage/Map/MapBox"
import { Link } from 'react-router-dom'

export default function SigiLibrary({ items, user }: { items: any[], user: any }) {
  return (

    <div className="flex flex-col w-full p-4 pb-20">
      
      <div className="w-full shrink-0">
        <MapBox user={user} />
      </div>

      <div className="sigilibrary flex-1 overflow-auto mt-4">
        {items.map((sigil:any) => (
          <SigilThumb
            key={sigil.name}
            sigilData={sigil} 
          />
        ))}
      </div>

      <div className="flex justify-between mt-4">
        <Link className="navbutton" to="/grimoire">⬅️ Left Page</Link>
        <Link className="navbutton" to="/right-page">Right Page ➡️</Link>
      </div>
      
    </div>
  );
};