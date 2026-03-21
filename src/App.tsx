import { Routes, Route } from 'react-router-dom'

// LogInAuth
import LandingPage from './components/LogInAuth/LandingPage'
import Login from './components/LogInAuth/LogIn'
import MakeProfile from './components/LogInAuth/MakeProfile'
import UserSettings from './components/LogInAuth/UserSettings'

// SigilRoomHome
import HomeRoom from './components/SigilRoomHome/HomeRoom'
import Grimoire from './components/SigilRoomHome/Grimoire'
import ScryeMirror from './components/SigilRoomHome/ScryeMirror'

// MakeSigil
import MakeSigil from './components/MakeSigil/MakeSigil'
import DrawSigil from './components/MakeSigil/DrawSigil'
import WriteSigil from './components/MakeSigil/WriteSigil'
import StyleSigil from './components/MakeSigil/StyleSigil'

// Other
import MapBox from './components/Map/MapBox'
import UserProfile from './components/ProfileFriends/UserProfile'
import SigilCharge from './components/ActivateSigils/ChargeSigil/SigilCharge'
import SigilDestroy from './components/ActivateSigils/DestroySigil/SigilDestroy'

function App() {
  return (
    <Routes>
      {/* Auth flow */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/make-profile" element={<MakeProfile />} />
      <Route path="/settings" element={<UserSettings />} />

      {/* Main rooms */}
      <Route path="/home" element={<HomeRoom />} />
      <Route path="/grimoire" element={<Grimoire />} />
      <Route path="/scrye-mirror" element={<ScryeMirror />} />

      {/* Make Sigil flow */}
      <Route path="/make-sigil" element={<MakeSigil />} />
      <Route path="/make-sigil/draw" element={<DrawSigil />} />
      <Route path="/make-sigil/write" element={<WriteSigil />} />
      <Route path="/make-sigil/style" element={<StyleSigil />} />

      {/* Other */}
      <Route path="/map" element={<MapBox />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/charge-sigil" element={<SigilCharge />} />
      <Route path="/destroy-sigil" element={<SigilDestroy />} />
    </Routes>
  )
}

export default App
