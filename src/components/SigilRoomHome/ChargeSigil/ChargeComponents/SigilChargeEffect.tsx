import { useLocation } from "react-router-dom"

export default function SigilChargeEffect() {
  const { state } = useLocation();
  const { sigilData } = state;

  console.log(sigilData)
  return (
    <div>
      <br />
      <h1>Sigil Charge Effect Goes Here</h1>

      <br />
      <br />
      <br />

    </div>
  )
};