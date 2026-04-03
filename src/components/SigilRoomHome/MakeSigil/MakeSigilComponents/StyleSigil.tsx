import BackButton from "../../../Parts/BackButton"
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@/context/UserContext'

export default function StyleSigil() {
  const { user } = useUser()
  if (!user) { return null }
  const navigate = useNavigate();
  const [sigilData, setSigilData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load data from localStorage
    const name = localStorage.getItem('sigilName') || 'My New Sigil';
    const intention = localStorage.getItem('sigilIntention') || '';
    const canvasData = localStorage.getItem('sigilCanvasData') || '';
    const imageData = localStorage.getItem('sigilImageData') || '';

    setSigilData({ name, intention, canvasData, imageData });
  }, []);

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
      <div>
        <h1>Review & Save Your Sigil</h1>
        <div style={{ margin: '1rem 0' }}>
          <h3>Name: {sigilData.name}</h3>
          {sigilData.intention && <p style={{ color: '#666', marginBottom: '1rem' }}>Intention: {sigilData.intention}</p>}

          {sigilData.imageData && (
            <div style={{ marginTop: '1rem', border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', display: 'inline-block', backgroundColor: '#f5f5f5' }}>
              <img src={sigilData.imageData} alt={sigilData.name} style={{ maxWidth: '100%', maxHeight: '300px' }} />
            </div>
          )}
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', alignItems: 'center' }}>
          <BackButton name={"Go Back"} />
          <button
            className="navbutton"
            onClick={handleSave}
            disabled={isSaving}
            style={{
              backgroundColor: isSaving ? '#ccc' : '#9e38fd',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              border: 'none',
              fontSize: '16px'
            }}
          >
            {isSaving ? "Saving..." : "Save to Account"}
          </button>
        </div>
      </div>
    </div>
  )
}
