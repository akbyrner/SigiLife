import SigilThumb from "./SigilThumb"

import MapBox from "../../LeftPage/Map/MapBox"

export default function SigiLibrary({ items, user }: { items: any[], user: any }) {
  return (

    <div className="flex flex-col w-full h-full p-4">
      
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
      
    </div>
  );
};