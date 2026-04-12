import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SigiLifeLogo from '../../assets/SigilifeLogo.svg';
import GoogleAuth from './GoogleAuth';
import MapSearchBox from '@/components/SigilRoomHome/Grimoire/LeftPage/Map/MapSearchBox';
import { useUser } from '@/context/UserContext';
import * as SwitchPrimitive from "@radix-ui/react-switch"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"


export default function LandingPage() {
  const { user, isLoading, setUser } = useUser();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('0');
  const [homeLocation, setHomeLocation] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [isDark, setIsDark] = useState(false)
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();


  const handleSlideClick = useCallback(() => {
    carouselApi?.scrollNext();
  }, [carouselApi]);


  const handleThemeChange = (checked: boolean) => {
    setIsDark(checked)
    document.documentElement.classList.toggle("dark", checked)
    if (!user) return 
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
  useEffect(() => {
    if (!carouselApi) return;

    const interval = setInterval(() => {
      carouselApi.scrollNext();
    }, 8000);

    return () => clearInterval(interval)
  }, [carouselApi]);


  const slides = [
    <>Mark your intent.<br />Leave a trace.<br /><br />Nothing disappears without a ritual.</>,
    <>SigiLife is a map of hidden intentions:<br /><br />yours and everyone else's.</>,
    <>Every sigil is a statement,<br /> a feeling,<br /> a moment made permanent…<br /><br />until you choose to let it go.</>,
    <>How It Works:<br /><br />You don't just write goals.<br /> You encode them.<br />Write your intention. <br />Strip it down. <br />Distill it.</>,
    <>Turn it into a Sigil:<br /><br />something abstract, <br />something unique, <br /> something yours.</>,
    <>Then, choose how it feels: <br /><br /> Hope. Anger. Obsession. Relief.<br /><br />Emotion becomes the Charge.</>,
    <>Place it somewhere real:<br /><br />A street corner.<br /><br />Your bedroom.<br /><br />A bar you shouldn't go back to.</>,
    <>Use SigiLife to:<br /><br />Let go of things you <br />can't carry anymore...<br /><br />Anchor moments you <br /> don't want to forget.</>,
    <>Track personal transformations...<br /> <br />Leave something<br /> behind <br /><br /> for someone else <br />to find <br /></>,
    <><br />Or just see what's <br /> hidden in the world <br />around you </>,
    <> </>,
    <>Nothing lasts forever.<br /><br />When you are ready,<br /> you can destroy your sigil.<br /><br />Not delete—destroy.</>,
    <>The intention dissolves.<br />The charge breaks.<br />The mark is gone.<br /><br />And that matters.</>,
    <>Right now, you can see and use what your friends make.<br />Soon, you'll be able to do much more.</>,
    <>Every moment can leave a trace.<br /> SigiLife can let you decide what remains.</>,
  ];

  return (
    <>
      <div className='maincontainer'>

        <div className="landingpage">
 {!isNewUser && (
          <>
            <img src={SigiLifeLogo} className="logo" alt="Sigil-Life-Logo" />
            <div className='rowbox'>
              <h1 style={{ width: "75vw", color: "white", backgroundColor: "black", padding: "15px", margin: "5px", borderRadius: "12px" }}>
                SigiLife is a location-based ritual platform where users transform personal intentions into digital sigils
              </h1>
            </div>
            <div className='displaypitch'>
              <Carousel setApi={setCarouselApi} opts={{ loop: true }} orientation="vertical" className="slidebox">
                <CarouselContent className="h-48">
                  {slides.map((content, i) => (
                    <CarouselItem key={i} onClick={handleSlideClick} className="cursor-pointer select-none">
                      {content}
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </>
        )}

        {isNewUser && (
          <div className="makeprofile">
            <h1>Create Your Profile:</h1>
            <label>Choose a SigiLife Username!
              <br />
              <input className="textinput" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </label>

            <label className='avatarchoicebox'>Choose a SigiLord:
              <div className='avatarchoice'>
                <img className='avatar' src='Avatar1.png' alt='trench-coat-detective' onClick={() => setAvatar('0')}
                  style={{ outline: avatar === '0' ? '2px solid #2b0681' : 'none', cursor: 'pointer', height: 100, borderRadius: "20px" }} />
                <img className='avatar' src='Avatar2.png' alt='dress-detective' onClick={() => setAvatar('1')}
                  style={{ outline: avatar === '1' ? '2px solid #2b0681' : 'none', cursor: 'pointer', height: 100, borderRadius: "20px" }} />
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

            <label>
              Dark or Light Theme:<br />
              <SwitchPrimitive.Root checked={isDark} onCheckedChange={handleThemeChange}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-300 data-[state=checked]:bg-purple-500">
                <SwitchPrimitive.Thumb className="block h-4 w-4 translate-x-1 rounded-full bg-white transition-transform data-[state=checked]:translate-x-6" />
              </SwitchPrimitive.Root>
              {isDark ? "Dark" : "Light"}
            </label>
          </div>
        )}


       <div className='landingrowbox' style={{ display: isNewUser && !username || isNewUser && !homeLocation ? 'none' : 'flex' }}>
          <GoogleAuth
            formData={isNewUser ? { username, avatar, theme: isDark ? 1 : 0, homeLocation } : {}}
            isNewUser={isNewUser}
          />
          {!isNewUser && (
            <button
              className="createaccountbutton"
              style={{ borderRadius: "20px", backgroundColor: "white", borderColor: "#e0e0e0", borderWidth: "1px", width: "135px", height: "40px", alignSelf: "center" }}
              onClick={() => setIsNewUser(true)}
            >
              Create an Account
            </button>
          )}
        </div>

      </div>
    </div>
  </>
);
}