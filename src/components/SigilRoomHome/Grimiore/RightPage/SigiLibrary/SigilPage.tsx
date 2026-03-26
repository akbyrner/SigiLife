import BackButton from "../../../../Parts/BackButton"
import { Link } from 'react-router-dom'
import {useLocation} from "react-router-dom"

export default function SigilPage( ) {
    const {state} = useLocation();
    const {sigilKey, sigilData} = state;
    console.log(sigilKey, sigilData)
  return (<div className="sigilpage">
    <h1>This is the SigilPage for {sigilData.name}</h1>
    <br />

    <div className="sigildetails">

    {sigilData.name}
        <br />
        was created on : {sigilData.created_at}
        <br />
    at {sigilData.location.name}
    <br/>
    {sigilData.isCharged ? "Sigil is Charged" : "Sigil is not Charged"}
        <br />
    </div>
    
    <Link to="/charge-sigil">Charge Sigil</Link>
    <br />
    <Link to="/destroy-sigil">Destroy Sigil</Link>
    <br />
    <img className="sigilbox"src="src/assets/dummySigil.svg"/>
    <br />
    <BackButton name={"Go Back"}/>

  </div>)
};