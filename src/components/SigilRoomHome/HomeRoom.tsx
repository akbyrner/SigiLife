

import { Link } from 'react-router-dom'
import { useUser } from '@/context/UserContext'
import { useEffect, useRef } from 'react';
import Menu from '../Parts/Menu'


export default function HomeRoom() {
  const { user } = useUser();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, []);

  if (!user) { return null; }
  console.log(user)

  return (
    <div className='maincontainer'>
      <div ref={scrollRef} className='scrollcontainer'>
        <div className='homeroom'>
          <Menu />

          <nav>
            <Link className='destroybutton' to="/library?action=destroy">Destroy Sigil</Link>
            <Link className='chargebutton' to="/library?action=charge">Charge Sigil</Link>
            <Link className='grimoirebutton' to="/grimoire" >Grimoire</Link>
            <Link className='makesigilbutton' to="/make-sigil">Make Sigil</Link>
          </nav>

          <div className='footer'>
          </div>
        </div>
      </div>
    </div>
  )

}

