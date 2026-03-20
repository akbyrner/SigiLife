import { useState } from 'react'
import SigiLifeLogo from './assets/SigiLife Logo.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={SigiLifeLogo} className="logo" width="75%" height="75%" alt="Sigil-Life-Logo" />

        </div>
        <div>
          <h1>Coming Soon, SigiLife!</h1>

        </div>
        <button
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}, & is also something silly.
        </button>
        <div className='info'style={{fontSize:'large'}}> An app for creating and sharing magically imbued sigils.<br/>
        </div>
        <div className='more- info' style={{fontSize:'small'}}> An Operation Spark Thesis project, 2026. All rights reserved.<br/>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>

    </>
  )
}

export default App
