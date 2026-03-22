import BackButton from "../../../Parts/BackButton"
import MapSearchBox from "./MapSearchBox"
import PlaceSigil from "./PlaceSigil"

export default function MapBox() {

  return (<div>
    <h1>This is the MapBox</h1>
    <MapSearchBox/>
    <PlaceSigil/>
    <BackButton />
  </div>)
};