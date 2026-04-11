import { Link } from 'react-router-dom'

import SigiLibrary from './SigiLibrary/SigiLibrary'
import { useEffect, useState, useRef } from 'react'
import { useUser } from '@/context/UserContext'
import Menu from '../../../Parts/Menu'


export default function RightPage() {
  const [sigils, setSigils] = useState([])
  const { user } = useUser();
  const scrollRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, []);
  
    if (!user) { return null }
  useEffect(() => {
    fetch(`/api/sigils/user/${user.id}/sigils`)
      .then(res => res.json())
      .then(data => setSigils(data))
  }, [])



  return (
    <div className='maincontainer'>
      <div ref={scrollRef} className='scrollcontainer'>
      <div className="rightpage">
                <Menu/>
        <SigiLibrary items={sigils} user={user} />
        <Link to="/make-sigil"> 🪶 MakeSigil </Link>
      </div>
      </div>
      </div>
  )
}
