import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    google: any;
    handleCredentialResponse: (response: any) => void;
  }
}

export default function GoogleAuth({ setUser, formData }: { setUser: (user: any) => void, formData: any }) {
  const navigate = useNavigate();

  useEffect(() => {
    window.handleCredentialResponse = async (response: any) => {
//      console.log('data being sent', formData, formData.username)
      try {
        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential: response.credential, ...formData})
        });



        if (!res.ok) {
          throw new Error('google auth failed!')
        }

        const data = await res.json();
//        console.log(' backend response:', data);
        setUser(data.user);
        if (data.needsProfile){
          navigate('/login');
        } else {
        navigate('/home');
        }
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
  }, [formData]);

  return (
    <div>
      <div id="google-signin-button">
      </div>
    </div>
  );
}



