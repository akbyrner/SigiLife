import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SigiLifeLogo from '../../assets/SigiLifeLogo.png';
import GoogleAuth from './GoogleAuth';
import MapSearchBox from '@/components/SigilRoomHome/Grimoire/LeftPage/Map/MapSearchBox';


export default function LandingPage({ setUser }: { setUser: (user: any) => void }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('0');
  const [theme, setTheme] = useState('0');
  const [homeLocation, setHomeLocation] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data.user && !data.needsProfile) {
          navigate('/home');
        }
      });
  }, []);

  return (
    <>
      <div className='maincontainer'>

        <div className="landingpage">
          <section id="center">
            <div >
              <img src={SigiLifeLogo} className="logo" width="75%" height="75%" alt="Sigil-Life-Logo" />
            </div>
            <h1>Coming Soon, SigiLife!</h1>
            <div >
              An app for creating and sharing magically imbued sigils.
            </div>

            {!isNewUser && (
              <div>
                <GoogleAuth setUser={setUser} formData={{}} />
                <br />
                <button className="navbutton" onClick={() => setIsNewUser(true)}>
                  Create an Account
                </button>
              </div>
            )}

            {isNewUser && (
              <div className="makeprofile">
                <h2>Create Your Profile</h2>

                <label>Choose a SigiLife Username:
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </label>

                <label >Choose a SigiLord:
                  <div className='avatarchoice'>
                    <img className='avatar'
                      src='src/assets/Avatar1.png'
                      alt='trench-coat-detective'
                      onClick={() => setAvatar('0')}
                      style={{ outline: avatar === '0' ? '3px solid purple' : 'none', cursor: 'pointer', height: 100 }}
                    />
                    <img className='avatar'
                      src='src/assets/Avatar2.png'
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

                <label>Choose a theme:
                  <input value={theme} onChange={(e) => setTheme(e.target.value)} />
                </label>
                {username && homeLocation && (
                  <GoogleAuth
                    setUser={setUser}
                    formData={{ username, avatar, theme, homeLocation }}
                  />
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}