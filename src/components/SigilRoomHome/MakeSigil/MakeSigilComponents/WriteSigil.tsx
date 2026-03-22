import BackButton from "../../../Parts/BackButton"
import NextButton from "../../../Parts/NextButton"

export default function WriteSigil() {
  return (
    <div>
      <BackButton />
      <h1>Write Your Sigil</h1>
      <NextButton to="/make-sigil/draw"/>
    </div>
  )
}
