
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { UserProvider } from './context/UserContext.tsx'

const rootElement = document.getElementById('root')!
createRoot(rootElement).render(

    <UserProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter></UserProvider>

)