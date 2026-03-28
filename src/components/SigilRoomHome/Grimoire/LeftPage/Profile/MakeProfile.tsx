import { Link } from 'react-router-dom';
import { useState } from 'react';
import GoogleAuth from '@/components/LogInAuth/GoogleAuth';
import MapSearchBox from '@/components/SigilRoomHome/Grimoire/LeftPage/Map/MapSearchBox';



export default function MakeProfile({ setUser }: { setUser: (user: any) => void }) {
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("0");
  const [theme, setTheme] = useState("0");
  // const [homeLatitude, setHomeLatitude] = useState('');
  // const [homeLongitude, setHomeLongitude] = useState('');
  const [homeLocation, setHomeLocation] = useState('')
  const [validated, setValidated] = useState(false);



  // const handleHomeLocation = ({ latitude, longitude }: { latitude: any, longitude: any }) => {
  //   console.log('this will set your', homeLatitude, homeLongitude, homeLocation)
  //   setHomeLatitude(latitude);
  //   setHomeLongitude(longitude)
  //   setHomeLocation('set location!')
  // }

  // handleHomeLocation({ latitude: 0, longitude: 0 });

  return (
    <div className='main-container'>
      <div className='makeprofile'>
        <h1>Create Profile</h1>

        <form onSubmit={(e) => { e.preventDefault(); setValidated(true) }}>
          <label>Choose a SigiLife Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>


          <label> Choose a SigiLord:
            <div>
              <img
                src='../../../../../assets/Avatar1.png'
                alt='trench-coat-detective'
                onClick={() => setAvatar("0")}
                style={{ outline: avatar === "0" ? '3px solid purple' : 'none', cursor: 'pointer' }}
              />
              <img
                src='../../../../../assets/Avatar1.png'
                alt='dress-detective'
                onClick={() => setAvatar("1")}
                style={{ outline: avatar === "1" ? '3px solid purple' : 'none', cursor: 'pointer' }}
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

          <label> Choose a theme:
            <input
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            />
            choose your theme?
          </label>
          {!validated && <button type='submit'> I have double checked my choices! </button>}
        </form>

        {validated && (<GoogleAuth setUser={setUser} formData={{ username, avatar, theme, homeLocation }} />)}

        <Link to="/home">Enter SigiLife</Link>
      </div ></div>
  )
}
