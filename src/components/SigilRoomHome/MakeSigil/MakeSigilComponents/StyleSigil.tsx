
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@/context/UserContext'

export default function StyleSigil() {
  const { user } = useUser()

  const navigate = useNavigate();
  const [sigilData, setSigilData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [friends, setFriends] = useState<any[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollCallbackRef = (el: HTMLDivElement | null) => {
  if (el) {
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
    scrollRef.current = el;
  }
};


  useEffect(() => {
    // Load data from localStorage
    const name = localStorage.getItem('sigilName') || 'My New Sigil';
    const intention = localStorage.getItem('sigilIntention') || '';
    const canvasData = localStorage.getItem('sigilCanvasData') || '';
    const imageData = localStorage.getItem('sigilImageData') || '';

    setSigilData({ name, intention, canvasData, imageData });
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/users/${user.id}/following`)
        .then(res => res.json())
        .then(data => setFriends(data))
        .catch(err => console.error("Error fetching friends:", err));
    }
  }, [user]);

  const toggleFriend = (id: number) => {
    setSelectedFriends(prev =>
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };


  const handleSave = async () => {
    if (!user || !user.id) {
      setError("You must be logged in to save a sigil.");
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const response = await fetch('/api/sigils', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: sigilData.name,
          userId: user.id,
          intention: sigilData.intention,
          canvasData: sigilData.canvasData,
          imageData: sigilData.imageData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save sigil');
      }

      const result = await response.json();
      console.log(result)

      if (selectedFriends.length > 0) {
        await fetch('/api/sigils/share', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sigilId: result.id,
            targetUserIds: selectedFriends
          })
        });
      }

      // Clear localStorage
      localStorage.removeItem('sigilName');
      localStorage.removeItem('sigilIntention');
      localStorage.removeItem('sigilUniqueChars');
      localStorage.removeItem('sigilCanvasData');
      localStorage.removeItem('sigilImageData');

      // Navigate to library to see the newly saved sigil
      navigate('/library');
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!sigilData) return <div>Loading...</div>;



  return (
    <div className='maincontainer'>
      <div className="scrollcontainer" ref={scrollCallbackRef}>
        <div className='stylesigilcontainer'>
          <div className='header'></div>

          <h1 >Review & Save Your Sigil</h1>
          <div className="stylesigilcontainerbox">
            <h3>Name: {sigilData.name}</h3>
            {sigilData.intention && <p style={{ color: '#666', marginBottom: '1rem' }}>Intention: {sigilData.intention}</p>}

            {sigilData.imageData && (
              <div  style={{ marginTop: '1rem', border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', display: 'inline-block', backgroundColor: 'transparent' }}>
                <img src={sigilData.imageData} alt={sigilData.name} style={{ maxWidth: '100%', maxHeight: '300px' }} />
              </div>
            )}
          </div>

          <div className="sharebox" style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9', width: '275px', maxWidth: '400px', margin: '20px auto' }}>
            <h3 style={{ marginTop: 0 }}>Clone & Share to SigilFriends</h3>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '10px' }}>
              Select users to share this sigil with. It will be added to their library if they have a slot available.
            </p>
            <div style={{ maxHeight: '150px', overflowY: 'auto', textAlign: 'left', padding: '5px' }}>
              {friends.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: '#888' }}>You are not following anyone yet.</p>
              ) : (
                friends.map(friend => (
                  <div key={friend.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 0' }}>
                    <input
                      type="checkbox"
                      id={`friend-${friend.id}`}
                      checked={selectedFriends.includes(friend.id)}
                      onChange={() => toggleFriend(friend.id)}
                      style={{ cursor: 'pointer' }}
                    />
                    <label htmlFor={`friend-${friend.id}`} style={{ cursor: 'pointer', fontSize: '0.9rem' }}>
                      {friend.username}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}
            <button
              className="navbutton"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save to Account"}
            </button>

        </div>
      </div>
    </div>
  )
}
