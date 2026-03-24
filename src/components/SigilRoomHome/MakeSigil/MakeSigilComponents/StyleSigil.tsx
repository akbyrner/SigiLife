import BackButton from "../../../Parts/BackButton"
import NextButton from "../../../Parts/NextButton"

export default function StyleSigil({ user }: { user: any }) {
  console.log(user)
  return (
    <div className='maincontainer'>
    <div>
      <h1>Style Your Sigil</h1>
      <BackButton name={"Go Back"} />
      <br />
      <NextButton to="/sigil-page" />
      <br />

    </div>
    </div>
  )
}
