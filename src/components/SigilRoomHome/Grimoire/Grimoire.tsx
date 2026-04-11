
import { Link } from 'react-router-dom'
import { useUser } from '@/context/UserContext'
import { useEffect, useRef } from 'react';
import Menu from "@/components/Parts/Menu";

export default function Grimoire() {
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
        <div className={'grimoire'}>
          <Menu />
          <div className={'usertitle'}>
            {user!.username}'s
            <br />Grimoire
          </div>

          <div className={'bookbox'}>
            <div className="grimoire-left-page">
              <Link to="/map"> 🗺️ Map </Link>
              <br />
              <Link to="/profile" > 👤 Profile </Link>
            </div>
          </div>
          <div className="bookbox">
            <div className="grimoire-right-page">
              <Link to="/right-page" > 📜 SigiLibrary </Link>

            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
