

import { Link } from 'react-router-dom'
import { useUser } from '@/context/UserContext'
import { useEffect, useRef, useState } from 'react';
import Menu from '../Parts/Menu'
import TutorialOverlay from '../ui/TutorialOverlay'


export default function HomeRoom() {
  const { user } = useUser();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, []);

  useEffect(() => {
    if (user && !user.hasCompletedTutorial) {
      setShowTutorial(true);
    }
  }, [user]);

  if (!user) { return null; }
  console.log(user)

  return (
    <div className='maincontainer'>
      <div ref={scrollRef} className='scrollcontainer'>
        <div className='homeroom'>
          <Menu />

          <nav>
            <Link id="destroy-btn" className='destroybutton' to="/library?action=destroy">Destroy Sigil</Link>
            <Link id="charge-btn" className='chargebutton' to="/library?action=charge">Charge Sigil</Link>
            <Link id="grimoire-btn" className='grimoirebutton' to="/grimoire" >Grimoire</Link>
            <Link id="makesigil-btn" className='makesigilbutton' to="/make-sigil">Make Sigil</Link>
          </nav>

          <div className='footer'>
          </div>
        </div>
      </div>
      {showTutorial && <TutorialOverlay onComplete={() => setShowTutorial(false)} />}
    </div>
  )

}

