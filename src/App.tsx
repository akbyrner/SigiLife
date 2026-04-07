import { Routes, Route } from 'react-router-dom'
//import { useState, useEffect } from 'react'
import { useUser } from '@/context/UserContext';

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
import PlaceSigilInWorld from './components/SigilRoomHome/Grimoire/LeftPage/Map/PlaceSigilInWorld'
import ScryeFriends from './components/SigilRoomHome/Grimoire/LeftPage/ScryeFriends/ScryeFriendsHome'
import RightPage from './components/SigilRoomHome/Grimoire/RightPage/RightPage'
import SigilPage from './components/SigilRoomHome/Grimoire/RightPage/SigiLibrary/SigilPage'


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Properties



function App() {
  // const [user, setUser] = useState(null);
  // const [authStatus, setAuthStatus]= useState<"loading"|"done">("loading");

// useEffect(()=> {
//   fetch("/api/auth/me", { credentials: "include" })
//   .then(res => res.json())
//   .then(data => {
//     if(data.user){
//       setUser(data.user);
//     }
//     setAuthStatus("done");
//   })
//   .catch(()=> setAuthStatus("done"));
// }, []);

// if (authStatus === "loading"){
//   return <div> Loading Auth... </div>
// }
  const { isLoading } = useUser()

  if (isLoading) {
    return <div>Loading...</div>
  }


  return (
    <Routes>
      {/* Auth flow */}
      <Route path="/login" element={<LandingPage/>} />
      <Route path="/" element={<LandingPage/>} />

      {/* User */}
      <Route path="/settings" element={<ProtectedRoute><UserSettings/></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><UserProfile/></ProtectedRoute>} />

      {/* Main Room Nav */}
      <Route path="/destroy-sigil" element={<ProtectedRoute><SigilDestroy/></ProtectedRoute>}/>
      <Route path="/home" element={<ProtectedRoute><HomeRoom/></ProtectedRoute>} />
      <Route path="/charge-sigil" element={<ProtectedRoute><SigilCharge /></ProtectedRoute>} />
      <Route path="/grimoire" element={<ProtectedRoute><Grimoire /></ProtectedRoute>} />
      <Route path="/make-sigil" element={<ProtectedRoute><MakeSigil /></ProtectedRoute>} />


      {/* Make Sigil flow */}
      <Route path="/make-sigil/draw" element={<ProtectedRoute><DrawSigil /></ProtectedRoute>} />
      <Route path="/make-sigil/write" element={<ProtectedRoute><WriteSigil /></ProtectedRoute>} />
      <Route path="/make-sigil/style" element={<ProtectedRoute><StyleSigil /></ProtectedRoute>} />

      {/* Grimoire flow */}

      <Route path="/map" element={<ProtectedRoute><MapBox /></ProtectedRoute>} />
      <Route path="/place-sigil-world" element={<ProtectedRoute><PlaceSigilInWorld /></ProtectedRoute>} />
      <Route path="/scrye-friends" element={<ProtectedRoute><ScryeFriends /></ProtectedRoute>} />
      <Route path="/right-page" element={<ProtectedRoute><RightPage /></ProtectedRoute>} />
      <Route path="/library" element={<ProtectedRoute><RightPage /></ProtectedRoute>} />
      <Route path="/sigil-page" element={<ProtectedRoute><SigilPage /></ProtectedRoute>} />

    </Routes>
  )
}

export default App
