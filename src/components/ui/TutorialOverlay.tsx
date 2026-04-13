import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

interface TutorialStep {
  targetId?: string;
  title: string;
  description: string;
}

const steps: TutorialStep[] = [
  {
    title: "Welcome to SigiLife",
    description: "Embrace the magic of sigils. Let's take a quick tour of your home room."
  },
  {
    targetId: 'makesigil-btn',
    title: "Make Sigil",
    description: "This is where your journey begins. Design and manifest your intentions into unique sigils."
  },
  {
    targetId: 'grimoire-btn',
    title: "Grimoire",
    description: "Your digital book of shadows. View your collection of sigils and their meanings here."
  },
  {
    targetId: 'charge-btn',
    title: "Charge Sigil",
    description: "Focus your energy. Use this to empower your sigils once they are created."
  },
  {
    targetId: 'destroy-btn',
    title: "Destroy Sigil",
    description: "Release the intention. When a sigil has served its purpose, returns it to the void."
  },
  {
    targetId: 'menu-btn',
    title: "Navigation Menu",
    description: "Access settings, the world map, and your sigil library anytime from here."
  }
];

export default function TutorialOverlay({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const { user, setUser } = useUser();
  const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const step = steps[currentStep];
    if (step.targetId) {
      const element = document.getElementById(step.targetId);
      if (element) {
        const rect = element.getBoundingClientRect();
        setHighlightStyle({
          top: rect.top - 8,
          left: rect.left - 8,
          width: rect.width + 16,
          height: rect.height + 16,
          opacity: 1,
        });
        element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      } else {
        setHighlightStyle({ opacity: 0 });
      }
    } else {
      setHighlightStyle({ opacity: 0 });
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hasCompletedTutorial: true }),
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        onComplete();
      }
    } catch (err) {
      console.error("Failed to mark tutorial as complete", err);
      onComplete(); // Still close overlay
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] overflow-hidden pointer-events-none">
      {/* Premium Backdrop: Radial gradient for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_40%,_rgba(0,0,0,0.8)_100%)] pointer-events-auto transition-opacity duration-1000" />
      
      {/* Spotlight highlight with multiple glows */}
      <div
        className="absolute rounded-2xl transition-all duration-700 ease-out pointer-events-none"
        style={highlightStyle}
      >
         <div className="absolute inset-0 border-2 border-yellow-400/80 rounded-2xl shadow-[0_0_30px_rgba(255,215,0,0.4),_inset_0_0_20px_rgba(255,215,0,0.2)]" />
         <div className="absolute -inset-2 animate-pulse bg-yellow-400/10 rounded-3xl blur-md" />
      </div>

      {/* Content Card: High-end glassmorphism */}
      <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] max-w-md w-full pointer-events-auto border border-white/20 transform transition-all duration-500 animate-in fade-in zoom-in slide-in-from-bottom-8">
          
          <div className="flex justify-between items-start mb-6">
            <button
              onClick={handleComplete}
              className="group flex items-center gap-2 text-white/60 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10"
              title="Skip Tutorial"
            >
              <span className="text-xs font-semibold uppercase tracking-wider">Skip</span>
              <X size={18} className="group-hover:rotate-90 transition-transform" />
            </button>
          </div>

          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-100 mb-3 font-[New Rocker] tracking-wide">
            {steps[currentStep].title}
          </h2>
          <p className="text-purple-50/80 leading-relaxed mb-10 text-lg font-[Figtree Variable]">
            {steps[currentStep].description}
          </p>

          <div className="flex justify-between items-center">
             <div className="flex gap-1.5">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === currentStep 
                        ? 'w-10 bg-gradient-to-r from-purple-400 to-pink-400' 
                        : 'w-2 bg-white/20'
                    }`}
                  />
                ))}
             </div>

             <div className="flex gap-3">
               {currentStep > 0 && (
                 <button
                   onClick={handlePrev}
                   className="p-3 rounded-2xl border border-white/10 text-white hover:bg-white/10 transition-all backdrop-blur-sm"
                 >
                   <ChevronLeft size={24} />
                 </button>
               )}
               <button
                 onClick={handleNext}
                 className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-[0_10px_20px_rgba(168,85,247,0.4)] hover:shadow-purple-500/60 hover:-translate-y-0.5 active:translate-y-0"
               >
                 {currentStep === steps.length - 1 ? "Begin Journey" : "Next Step"}
                 <ChevronRight size={20} />
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

