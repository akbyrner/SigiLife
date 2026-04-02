import BackButton from "../../../../Parts/BackButton"
import { Link, useLocation } from 'react-router-dom'


export default function SigilPage() {
  const { state } = useLocation();
  const { sigilData } = state;
  return (<div className="sigilpage">
    <h1>This is the SigilPage for {sigilData.name}</h1>
    <br />

    <div className="sigildetails">

      {sigilData.name}
      <br />
      was created on : {sigilData.createdAt}
      <br />
      at {sigilData.locationName}
      <br />
      {sigilData.isCharged ? "Sigil is Charged" : "Sigil is not Charged"}
      <br />
    </div>

    <Link className="navbutton" to="/charge-sigil" state={{ sigilData }} >Charge Sigil</Link>
    <br />
    <Link className="navbutton" to="/destroy-sigil"state={{ sigilData }}  >Destroy Sigil</Link>
    <br />
    {sigilData.imageData ? (
      <img className="sigilbox" src={sigilData.imageData} alt={sigilData.name} />
    ) : (
      <img className="sigilbox" src="src/assets/dummySigil.svg" alt="Dummy Sigil" />
    )}
    <br />
    <BackButton name={"Go Back"} />

  </div>)
};