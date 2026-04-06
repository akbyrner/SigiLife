import BackButton from "../../../Parts/BackButton"
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext'

export default function WriteSigil() {
  const { user } = useUser();

  if (!user) { return null; }


  const [intention, setIntention] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();



  const getUniqueChars = (text: string): string => {
    // Remove vowels, non-alphabetic characters, and duplicate characters
    const nonAlphaOrVowels = /[^a-zA-Z]|[aeiouAEIOU]/g;
    const cleanText = text.replace(nonAlphaOrVowels, '').toUpperCase();
    const seen = new Set<string>();
    const uniqueChars = cleanText.split('').filter(char => {
      if (seen.has(char)) return false;
      seen.add(char);
      return true;
    });
    return uniqueChars.join('');
  };


  const handleNext = async () => {
    if (!intention) return;
    setIsProcessing(true);

    const uniqueChars = getUniqueChars(intention);
    localStorage.setItem('sigilIntention', intention);
    localStorage.setItem('sigilUniqueChars', uniqueChars);

    setIsProcessing(false);
    navigate('/make-sigil/draw');
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, []);



  // console.log(user)
  return (
    <div className='maincontainer'>
      <div ref={scrollRef} className='scrollcontainer'>
        <div className="writesigil">
          <div className="writesigilbox">
            <h1>Write Your Sigil</h1>
            <p style={{ color: '#666', marginBottom: '1rem' }}>
              Enter your intention.
            </p>
            <textarea
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              placeholder="e.g., I am healthy and strong"
              style={{
                width: '100%',
                minHeight: '150px',
                padding: '1rem',
                fontSize: '16px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                resize: 'vertical',
                marginBottom: '1rem'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#666', fontSize: '14px' }}>
                Unique characters: <br />{getUniqueChars(intention)}
              </span>
              <button
                className="navbutton"
                onClick={handleNext}
                disabled={isProcessing}
                style={{
                  backgroundColor: isProcessing ? '#ccc' : '#9e38fd',
                  color: '#fff',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isProcessing ? 'not-allowed' : 'pointer'
                }}
              >
                {isProcessing ? "Processing..." : "Next"}
              </button>
            </div>
          </div>
        </div>         <BackButton name={'Go Back'} />
      </div>
    </div>
  )
}