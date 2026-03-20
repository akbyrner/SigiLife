import { useState } from 'react'
import SigiLifeLogo from './SigiLife Logo.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={SigiLifeLogo} className="base" width="100%" height="100%" alt="Sigil-Life-Logo" />

        </div>
        <div>
          <h1>Coming Soon, SigiLife</h1>

        </div>
        <button
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
      <div className='trademarks'></div>
    </>
  )
}

export default App
