import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SigiLifeLogo from '../../assets/SigilifeLogo.svg';
import GoogleAuth from './GoogleAuth';
import MapSearchBox from '@/components/SigilRoomHome/Grimoire/LeftPage/Map/MapSearchBox';
import { useUser } from '@/context/UserContext';
import * as SwitchPrimitive from "@radix-ui/react-switch"


export default function LandingPage() {
  const { user, isLoading, setUser } = useUser();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('0');
  const [homeLocation, setHomeLocation] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [isDark, setIsDark] = useState(false)




  const handleThemeChange = (checked: boolean) => {
    setIsDark(checked)
    document.documentElement.classList.toggle("dark", checked)
    fetch(`/api/users/${user!.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme: checked ? 1 : 0 })
    })
      .then(res => res.json())
      .then(updated => setUser(updated))
  }

  useEffect(() => {
    if (!isLoading && user) {
      navigate('/home');
    }
  }, [user, isLoading]);

  return (
    <>
      <div className='maincontainer'>

        <div className="landingpage">

          <img src={SigiLifeLogo} className="logo" width="100%" height="100%" alt="Sigil-Life-Logo" />
        </div>
        <h1>Coming Soon, SigiLife!</h1>
        An app for creating and sharing magically imbued sigils.
        {!isNewUser && (
          <div>
            <GoogleAuth formData={{}} />
            <br />
            <button className="navbutton" onClick={() => setIsNewUser(true)}>
              Create an Account
            </button>
          </div>
        )}

        {isNewUser && (
          <div className="makeprofile">
            <h2>Create Your Profile:</h2>
            <label>Choose a SigiLife Username!
              <br />
              <input
                className="textinput"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>

            <label>Choose a SigiLord:
              <div className='avatarchoice'>
                <img className='avatar'
                  src='Avatar1.png'
                  alt='trench-coat-detective'
                  onClick={() => setAvatar('0')}
                  style={{ outline: avatar === '0' ? '3px solid purple' : 'none', cursor: 'pointer', height: 100 }}
                />
                <img className='avatar'
                  src='Avatar2.png'
                  alt='dress-detective'
                  onClick={() => setAvatar('1')}
                  style={{ outline: avatar === '1' ? '3px solid purple' : 'none', cursor: 'pointer', height: 100 }}
                />
              </div>
            </label>

            <label>Choose your Home Sigil Location:
              <MapSearchBox
                accessToken={import.meta.env.VITE_MAPBOX_TOKEN || ''}
                onRetrieve={(res) => {
                  if (res.features && res.features.length > 0) {
                    setHomeLocation(res.features[0].properties.full_address || res.features[0].properties.name);
                  }
                }}
              />
            </label>

            <label>          Theme:
              <SwitchPrimitive.Root
                checked={isDark}
                onCheckedChange={handleThemeChange}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 data-[state=checked]:bg-purple-500"
              >
                <SwitchPrimitive.Thumb className="block h-4 w-4 translate-x-1 rounded-full bg-white transition-transform data-[state=checked]:translate-x-6" />
              </SwitchPrimitive.Root>
              {isDark ? "Dark" : "Light"}
            </label>

            {username && homeLocation && (
              <GoogleAuth
                formData={{ username, avatar, theme: isDark ? 1 : 0, homeLocation }}
                isNewUser={true}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}