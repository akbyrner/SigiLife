import BackButton from "../../../../Parts/BackButton"
import SigilThumb from "./SigilThumb"

export default function SigiLibrary({ user }: { user: any }) {
  console.log(user)
  return (
    <div className='maincontainer'>
      <div>
        <br />
        <h1>This is the SigiLibrary</h1>
            <SigilThumb />
        <br />
            <BackButton name={"Go Back"} />
      </div>
    </div>
    )
};