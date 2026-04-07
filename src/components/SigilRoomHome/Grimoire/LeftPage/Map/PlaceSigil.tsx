import { useNavigate } from 'react-router-dom';

export default function PlaceSigil() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center mt-4">
      <button 
        onClick={() => navigate('/place-sigil-world')}
        className="px-6 py-3 bg-purple-700 text-white font-bold rounded-lg shadow-lg hover:bg-purple-600 border-2 border-purple-400 transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]"
        style={{ fontFamily: 'New Rocker' }}
      >
        View Surrounding AR Magic
      </button>
    </div>
  )
};