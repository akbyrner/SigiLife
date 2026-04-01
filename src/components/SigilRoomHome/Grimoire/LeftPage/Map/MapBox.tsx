import { useState } from 'react';
import Map, { NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

import BackButton from "../../../../Parts/BackButton"
import MapSearchBox from "./MapSearchBox"
import PlaceSigil from "./PlaceSigil"

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

export default function MapBox({ user }: { user: any }) {
  console.log(user)


  const [viewState, setViewState] = useState({
    longitude: -95.7129, // Default center over US
    latitude: 37.0902,
    zoom: 3.5
  });

  return (
  <div className='maincontainer'>
    <div className="flex flex-col items-center w-full">
      <br />
      <h1>This is the MapBox</h1>
      <div className="relative w-full max-w-4xl h-100 rounded-lg overflow-hidden my-4 border-2 border-purple-500 shadow-xl">
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/dark-v11" // You can change this style url
          mapboxAccessToken={MAPBOX_TOKEN}
          style={{ width: '100%', height: '100%' }}
        >

          <NavigationControl position="bottom-right" />
        </Map>
      </div>

      <MapSearchBox
        accessToken={MAPBOX_TOKEN}
        onRetrieve={(res) => {
          if (res.features && res.features.length > 0) {
            const [lng, lat] = res.features[0].geometry.coordinates;
            setViewState({
              ...viewState,
              longitude: lng,
              latitude: lat,
              zoom: 14
            });
          }
        }}
      />
      <PlaceSigil />

      <BackButton name={"Grimoire"} />
    </div>
  </div>)
};