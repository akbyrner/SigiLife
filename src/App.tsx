import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Landing Page & Log in
import ProtectedRoute from './components/LogInAuth/ProtectedRoute'
import LandingPage from './components/LogInAuth/LandingPage'


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ User
import UserProfile from './components/SigilRoomHome/Grimoire/LeftPage/Profile/UserProfile'
import UserSettings from './components/SigilRoomHome/Grimoire/LeftPage/Profile/UserSettings'

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ HomeRoom & Components
import HomeRoom from './components/SigilRoomHome/HomeRoom'
import SigilDestroy from './components/SigilRoomHome/DestroySigil/SigilDestroy'
import SigilCharge from './components/SigilRoomHome/ChargeSigil/SigilCharge'
import Grimoire from './components/SigilRoomHome/Grimoire/Grimoire'
import MakeSigil from './components/SigilRoomHome/MakeSigil/MakeSigil'

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Make Sigil
import DrawSigil from './components/SigilRoomHome/MakeSigil/MakeSigilComponents/DrawSigil'
import WriteSigil from './components/SigilRoomHome/MakeSigil/MakeSigilComponents/WriteSigil'
import StyleSigil from './components/SigilRoomHome/MakeSigil/MakeSigilComponents/StyleSigil'

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Grimoire

import MapBox from './components/SigilRoomHome/Grimoire/LeftPage/Map/MapBox'
import ScryeFriends from './components/SigilRoomHome/Grimoire/LeftPage/ScryeFriends/ScryeFriendsHome'
import RightPage from './components/SigilRoomHome/Grimoire/RightPage/RightPage'
import SigilPage from './components/SigilRoomHome/Grimoire/RightPage/SigiLibrary/SigilPage'


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Properties



function App() {
  const [user, setUser] = useState(null);
  const [authStatus, setAuthStatus]= useState<"loading"|"done">("loading");

useEffect(()=> {
  fetch("api/auth/me", { credentials: "include" })
  .then(res => res.json())
  .then(data => {
    if(data.user){
      setUser(data.user);
    }
    setAuthStatus("done");
  })
  .catch(()=> setAuthStatus("done"));
}, []);

if (authStatus === "loading"){
  return <div> Loading Auth... </div>
}


  return (
    <Routes>
      {/* Auth flow */}
      <Route path="/login" element={<LandingPage setUser={setUser}/>} />
      <Route path="/" element={<LandingPage setUser={setUser}/>} />

      {/* User */}
      <Route path="/settings" element={<UserSettings user={user} />} />
      <Route path="/profile" element={<UserProfile user={user} />} />

      {/* Main Room Nav */}
      <Route path="/destroy-sigil" element={<SigilDestroy  />} />
      <Route path="/home" element={<ProtectedRoute><HomeRoom user={user} /></ProtectedRoute>} />
      <Route path="/charge-sigil" element={<SigilCharge />} />
      <Route path="/grimoire" element={<Grimoire user={user} />} />
      <Route path="/make-sigil" element={<MakeSigil user={user} />} />


      {/* Make Sigil flow */}
      <Route path="/make-sigil/draw" element={<DrawSigil user={user} />} />
      <Route path="/make-sigil/write" element={<WriteSigil user={user} />} />
      <Route path="/make-sigil/style" element={<StyleSigil user={user} />} />

      {/* Grimoire flow */}

      <Route path="/map" element={<MapBox user={user} />} />
      <Route path="/scrye-friends" element={<ScryeFriends user={user} />} />
      <Route path="/right-page" element={<RightPage user={user} />} />
      <Route path="/library" element={<RightPage user={user} />} />
      <Route path="/sigil-page" element={<SigilPage />} />

    </Routes>
  )
}

export default App
