import { Routes, Route } from 'react-router-dom'

// LogInAuth
import LandingPage from './components/LogInAuth/LandingPage'
import Login from './components/LogInAuth/LogIn'
import MakeProfile from './components/LogInAuth/MakeProfile'
import UserSettings from './components/SigilRoomHome/Grimiore/ProfileFriends/UserSettings'

// SigilRoomHome
import HomeRoom from './components/SigilRoomHome/HomeRoom'
import Grimoire from './components/SigilRoomHome/Grimiore/Grimoire'
import ScryeFriends from './components/SigilRoomHome/Grimiore/ScryeFriends/ScryeFriendsHome'

// MakeSigil
import MakeSigil from './components/SigilRoomHome/MakeSigil/MakeSigil'
import DrawSigil from './components/SigilRoomHome/MakeSigil/MakeSigilComponents/DrawSigil'
import WriteSigil from './components/SigilRoomHome/MakeSigil/MakeSigilComponents/WriteSigil'
import StyleSigil from './components/SigilRoomHome/MakeSigil/MakeSigilComponents/StyleSigil'

// Other
import MapBox from './components/SigilRoomHome/Grimiore/Map/MapBox'
import UserProfile from './components/SigilRoomHome/Grimiore/ProfileFriends/UserProfile'
import SigilCharge from './components/SigilRoomHome/ChargeSigil/SigilCharge'
import SigilDestroy from './components/SigilRoomHome/DestroySigil/SigilDestroy'
import SigiLibrary from './components/SigilRoomHome/Grimiore/SigiLibrary/SigiLibrary'
import SigilPage from './components/SigilRoomHome/Grimiore/SigiLibrary/SigilPage'

function App() {
  return (
    <Routes>
      {/* Auth flow */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/make-profile" element={<MakeProfile />} />

      {/* User */}
      <Route path="/settings" element={<UserSettings />} />
      <Route path="/profile" element={<UserProfile />} />

      {/* Main Room Nav */}
      <Route path="/destroy-sigil" element={<SigilDestroy />} />
      <Route path="/home" element={<HomeRoom />} />
      <Route path="/charge-sigil" element={<SigilCharge />} />
      <Route path="/grimoire" element={<Grimoire />} />
      <Route path="/make-sigil" element={<MakeSigil />} />


      {/* Make Sigil flow */}
      <Route path="/make-sigil/draw" element={<DrawSigil />} />
      <Route path="/make-sigil/write" element={<WriteSigil />} />
      <Route path="/make-sigil/style" element={<StyleSigil />} />

      {/* Grimoire flow */}

      <Route path="/map" element={<MapBox />} />
      <Route path="/scrye-friends" element={<ScryeFriends />} />
      <Route path="/library" element={<SigiLibrary />} />
      <Route path="/sigil-page" element={<SigilPage />} />

    </Routes>
  )
}

export default App
