import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Landing Page & Log in
import LandingPage from './components/LogInAuth/LandingPage'
import Login from './components/LogInAuth/LogIn'
import MakeProfile from './components/SigilRoomHome/Grimoire/LeftPage/Profile/MakeProfile'

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
  //const [room, setRoom] = useState('home');


  return (
    <Routes>
      {/* Auth flow */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login setUser={setUser} />} />
      <Route path="/make-profile" element={<MakeProfile setUser={setUser} />} />

      {/* User */}
      <Route path="/settings" element={<UserSettings user={user} />} />
      <Route path="/profile" element={<UserProfile user={user} />} />

      {/* Main Room Nav */}
      <Route path="/destroy-sigil" element={<SigilDestroy user={user} />} />
      <Route path="/home" element={<HomeRoom user={user} />} />
      <Route path="/charge-sigil" element={<SigilCharge user={user} />} />
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
      <Route path="/sigil-page" element={<SigilPage />} />

    </Routes>
  )
}

export default App
