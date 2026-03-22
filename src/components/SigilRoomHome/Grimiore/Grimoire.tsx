import BackButton from "../../Parts/BackButton"
import SigiLibrary from "./SigiLibrary/SigiLibrary"

import { Link } from 'react-router-dom'


export default function Grimoire() {
  return (
    <div>
      <h1>Grimoire</h1>
      <br />
      <Link to="/map">Map</Link>
      <br />
      <Link to="/profile">Profile</Link>
      <br />
      <SigiLibrary />
      <br />
      <Link to="/scrye-mirror">Scrye</Link>
      <br />
      <BackButton />
    </div>
  )
}
