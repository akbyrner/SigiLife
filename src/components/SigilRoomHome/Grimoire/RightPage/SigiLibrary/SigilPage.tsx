
import { Link, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import MapSearchBox from '../../LeftPage/Map/MapSearchBox'
import Menu from '../../../../Parts/Menu'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

export default function SigilPage() {
  const [searchParams] = useSearchParams()
  const sigilId = searchParams.get('sigilId')
  const [sigilData, setSigilData] = useState<any>(null);
  const [isSavingLocation, setIsSavingLocation] = useState(false);

  useEffect(() => {
    if (!sigilId) { return }
    fetch(`/api/sigils/${sigilId}`)
      .then(res => res.json())
      .then(data => setSigilData(data))
      .catch(err => console.error(err))
  }, [sigilId])
  if (!sigilData) { return <p>Loading sigil...</p> }


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

  return (
    <div className="maincontainer">
      <div className="sigilpage">
        <Menu />

        <div className="sigildetails">
          Sigil Name : <br />
          {sigilData.name}
          <br />
          was created on :
          <br />
          {new Date(sigilData.createdAt).toLocaleDateString()}
          <br />
          {sigilData.locationName ? (
            <div className="sigildetailslocation">
              at:
              <br />
              {sigilData.locationName}</div>
          ) : (
            <div className="sigilpageaddlocation">
              <p>Set a location for this sigil:</p>
              {isSavingLocation ? (
                <p >Saving...</p>
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

        {
          sigilData.imageData
            ?
            (
              <img className="sigilbox" src={sigilData.imageData} alt={sigilData.name} />
            )

            :

            (
              <img className="sigilbox" src="src/assets/dummySigil.svg" alt="Dummy Sigil" />
            )
        }

        <div className="rowbox">

          <Link className="navbutton" to={`/charge-sigil?sigilId=${sigilData.id}`}>Charge Sigil</Link>

          <Link className="navbutton" to={`/destroy-sigil?sigilId=${sigilData.id}`}>Destroy Sigil</Link>

          <Link className="navbutton" to="/place-sigil-world" state={{ sigilData }} > View in AR </Link>
        </div>
      </div>
    </div>)
};