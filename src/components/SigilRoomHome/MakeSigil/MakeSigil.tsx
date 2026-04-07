import { Link } from 'react-router-dom'
import BackButton from '../../Parts/BackButton'
import { useUser } from '@/context/UserContext'
import { useEffect, useRef } from 'react';

export default function MakeSigil() {
  const { user } = useUser()
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, []);


  if (!user) { return null }
  console.log(user)
  return (
    <div className='maincontainer'>
      <div ref={scrollRef} className='scrollcontainer'>
        <div className='makesigil'>
          <h1>Make a Sigil</h1>
          <Link className="navbutton" to="/make-sigil/write">Write It</Link>
          <br />
          <Link className="navbutton" to="/library">Sigil Library</Link>
          <br />
          <br />
          <br />

          <BackButton name={"Go Back"}/>
        </div>
      </div></div>
  )
}
