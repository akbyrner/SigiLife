import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    google: any;
    handleCredentialResponse: (response: any) => void;
  }
}

export default function GoogleAuth({ setUser }: { setUser: (user: any) => void }) {
  const navigate = useNavigate();

  useEffect(() => {
    window.handleCredentialResponse = async (response: any) => {
      try {
        const res = await fetch('http://localhost:3000/api/auth/google', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential: response.credential })
        });



        if (!res.ok) {
          throw new Error('google auth failed!')
        }

        const data = await res.json();
        setUser(data.user);
        navigate('/home');

      } catch (error) {
        console.error('Login error:', error)
      }
    };

    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: window.handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { theme: 'outline', size: 'large' }
      );
    }
  }, []);

  return (
    <div>
      <div id="google-signin-button">
      </div>
    </div>
  );
}






// import { useNavigate } from 'react-router-dom'

// export default function GoogleAuth({ setUser }: { setUser: (user: any) => void }) {

//   const ApiGetLogin = async (request = null) => {
//     try {
//       const options: RequestInit = {
//         method: 'POST',
//         headers: {
//           "Content-Type": "application/json"
//         },
//       };
//       if (request) {
//         options.body = JSON.stringify(request)
//       }
//       const response = await fetch('http://localhost:3000/auth', options);
//       if (!response.ok) {
//         throw new Error(`🚨 SigiLife apiCall error status 📢:${response.status}`)
//       }
//       return await response.json();
//     }
//     catch (error) {
//       console.error(`🚨 SigiLife apiCall fail reason 📢:${error}❗👀`);
//       throw error;
//     }
//   };

//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     const user = await ApiGetLogin();
//     setUser(user);
//     navigate('/home');
//   }

//   return (
//     <div>
//       <button className="navbutton" onClick={handleLogin}>Sign in with Google</button>
//     </div>
//   )
// };
