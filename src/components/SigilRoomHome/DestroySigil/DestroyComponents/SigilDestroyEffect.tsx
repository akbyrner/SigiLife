import { useLocation } from "react-router-dom"
import EvilEye from './EvilEye';

export default function SigilDestroyEffect() {
  const { state } = useLocation();
  const { sigilData } = state;

  console.log(sigilData)

  return (
    <div className="evileye">
      <EvilEye
        eyeColor="#2e0fa9"
        intensity={3.1}
        pupilSize={0.75}
        irisWidth={0.25}
        glowIntensity={0.65}
        scale={0.5}
        noiseScale={1}
        pupilFollow={1.6}
        flameSpeed={2.5}
        backgroundColor="#06000f"
      />

    </div>
  )
};