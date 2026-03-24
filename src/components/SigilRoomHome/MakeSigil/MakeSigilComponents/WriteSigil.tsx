import BackButton from "../../../Parts/BackButton"
import NextButton from "../../../Parts/NextButton"

export default function WriteSigil({ user }: { user: any }) {
  console.log(user)
  return (
    <div>
      <BackButton name={'Go Back'}/>
      <h1>Write Your Sigil</h1>
      <NextButton to="/make-sigil/draw"/>
    </div>
  )
}
