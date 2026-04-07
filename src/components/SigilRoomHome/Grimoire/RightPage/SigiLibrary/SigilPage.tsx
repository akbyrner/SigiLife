import BackButton from "../../../../Parts/BackButton"
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import MapSearchBox from '../../LeftPage/Map/MapSearchBox'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

export default function SigilPage() {
  const { state } = useLocation();
  const [sigilData, setSigilData] = useState(state?.sigilData);
  const [isSavingLocation, setIsSavingLocation] = useState(false);

  const handleLocationRetrieve = async (res: any) => {
    if (res.features && res.features.length > 0) {
      const feature = res.features[0];
      const [lng, lat] = feature.geometry.coordinates;
      const locationName = feature.properties.name || feature.properties.full_address || "Unknown Location";

      setIsSavingLocation(true);
      try {
        const response = await axios.patch(`/api/sigils/${sigilData.id}/location`, {
          locationName,
          latitude: lat,
          longitude: lng
        });

        setSigilData(response.data);
      } catch (error) {
        console.error("Failed to save location:", error);
        alert("Failed to save location");
      } finally {
        setIsSavingLocation(false);
      }
    }
  };

  return (<div className="sigilpage">
    <h1>This is the SigilPage for {sigilData.name}</h1>
    <br />

    <div className="sigildetails">

      {sigilData.name}
      <br />
      was created on : {sigilData.createdAt}
      <br />
      {sigilData.locationName ? (
        <span>at {sigilData.locationName}</span>
      ) : (
        <div className="flex flex-col items-center mt-2 p-2 border border-purple-500 rounded bg-black/20">
          <p className="text-sm mb-2 text-black">Set a location for this sigil:</p>
          {isSavingLocation ? (
            <p className="text-xs text-yellow-400">Saving...</p>
          ) : (
            <MapSearchBox
              accessToken={MAPBOX_TOKEN}
              onRetrieve={handleLocationRetrieve}
            />
          )}
        </div>
      )}
      <br />
      {sigilData.isCharged ? "Sigil is Charged" : "Sigil is not Charged"}
      <br />
    </div>

    <Link className="navbutton" to="/charge-sigil" state={{ sigilData }} >Charge Sigil</Link>
    <br />
    <Link className="navbutton" to="/destroy-sigil" state={{ sigilData }}  >Destroy Sigil</Link>
    <br />
    {sigilData.imageData ? (
      <img className="sigilbox" src={sigilData.imageData} alt={sigilData.name} />
    ) : (
      <img className="sigilbox" src="src/assets/dummySigil.svg" alt="Dummy Sigil" />
    )}
    <br />
    <Link 
      className="navbutton" 
      to="/place-sigil-world" 
      state={{ sigilData }} 
      style={{ backgroundColor: '#2b0681', border: '2px solid gold', color: 'gold' }}
    >
      View in AR
    </Link>
    <br />
    <BackButton name={"Go Back"} />

  </div>)
};