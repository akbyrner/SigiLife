import BackButton from "../../../../Parts/BackButton"
import { Link } from 'react-router-dom'
import {useLocation} from "react-router-dom"

export default function SigilPage( ) {
    const {state} = useLocation();
    const {sigilKey, sigilData} = state;
    console.log(sigilKey, sigilData)
  return (<div>
    <h1>This is the SigilPage for </h1>
    <br />
    <Link to="/charge-sigil">Charge Sigil</Link>
    <br />
    <Link to="/destroy-sigil">Destroy Sigil</Link>
    <br />

    <br />
    <BackButton name={"Go Back"}/>
  </div>)
};