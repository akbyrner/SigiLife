import { useState, useEffect, useRef } from 'react';
import Map, { NavigationControl, Marker, Popup } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';

import BackButton from "../../../../Parts/BackButton"
import MapSearchBox from "./MapSearchBox"

import { useUser } from "@/context/UserContext"

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

export default function MapBox() {
  const { user } = useUser()
  if (!user) { return null }
  console.log(user)
  const [sigils, setSigils] = useState<any[]>([]);
  const [popupInfo, setPopupInfo] = useState<any | null>(null);
  const [filterMode, setFilterMode] = useState<"all" | "mine">("all");
  const scrollRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, []);

  if (!user) { return null; }
  console.log(user)
  useEffect(() => {
    // Fetch all sigils or just user's sigils based on filterMode
    const url = filterMode === "all" ? '/api/sigils/allsigils' : `/api/sigils/user/${user.id}/sigils`;

    axios.get(url)
      .then(res => {
        setSigils(res.data);
      })
      .catch(err => console.error("Error fetching sigils for map:", err));
  }, [user?.id, filterMode]);


  const [viewState, setViewState] = useState({
    longitude: -95.7129, // Default center over US
    latitude: 37.0902,
    zoom: 3.5
  });

  return (
    <div className='maincontainer'>
      <div ref={scrollRef} className='scrollcontainer'>
        <div className=" mapbox">
          <br />
          <h1>This is the MapBox</h1>

          <div className="flex gap-4 my-2 w-90">
            <button
              onClick={() => setFilterMode("all")}
              className={`px-4 py-2 rounded-md font-bold transition-colors ${filterMode === "all" ? "bg-purple-600 text-white" : "bg-zinc-800 text-purple-300 border border-purple-600"}`}
            >
              World Map
            </button>
            <button
              onClick={() => setFilterMode("mine")}
              className={`px-4 py-2 rounded-md font-bold transition-colors ${filterMode === "mine" ? "bg-purple-600 text-white" : "bg-zinc-800 text-purple-300 border border-purple-600"}`}
            >
              My Sigils
            </button>
          </div>

          <div className="relative w-75 max-w-4xl h-100 rounded-lg overflow-hidden my-4 border-2 border-purple-500 shadow-xl" style={{ height: "60vh" }}>
            <Map
              {...viewState}
              onMove={evt => setViewState(evt.viewState)}
              mapStyle="mapbox://styles/mapbox/dark-v11" // You can change this style url
              mapboxAccessToken={MAPBOX_TOKEN}
              style={{ width: '100%', height: '100%' }}
            >
              {sigils.map((sigil) => {
                if (sigil.longitude && sigil.latitude) {
                  return (
                    <Marker
                      key={`marker-${sigil.id}`}
                      longitude={Number(sigil.longitude)}
                      latitude={Number(sigil.latitude)}
                      anchor="bottom"
                      onClick={e => {
                        e.originalEvent.stopPropagation();
                        setPopupInfo(sigil);
                      }}
                    >
                      <div className="cursor-pointer">
                        {sigil.imageData ? (
                          <img src={sigil.imageData} alt={sigil.name} className="w-8 h-8 object-cover rounded-full border-2 border-purple-500 bg-black/50" />
                        ) : (
                          <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs">
                            ✧
                          </div>
                        )}
                      </div>
                    </Marker>
                  );
                }
                return null;
              })}

              {popupInfo && (
                <Popup
                  anchor="top"
                  longitude={Number(popupInfo.longitude)}
                  latitude={Number(popupInfo.latitude)}
                  onClose={() => setPopupInfo(null)}
                  className="bg-zinc-800 text-white rounded-md p-2"
                >
                  <div className="flex flex-col items-center p-1 text-black">
                    <h3 className="font-bold text-md text-purple-700">{popupInfo.name}</h3>
                    {popupInfo.locationName && (
                      <p className="text-xs text-gray-500">{popupInfo.locationName}</p>
                    )}
                    {popupInfo.imageData && (
                      <img width="80" src={popupInfo.imageData} alt="Sigil" className="mt-2 border-purple-300 border rounded" />
                    )}
                    <p className="text-sm mt-1 italic">{popupInfo.intention || "A mysterious sigil..."}</p>
                  </div>
                </Popup>
              )}

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


          <BackButton name={"Grimoire"} />
        </div></div>
    </div>)
};