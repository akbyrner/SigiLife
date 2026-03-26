import { useNavigate } from 'react-router-dom'

export default function GoogleAuth({ setUser }: { setUser: (user: any) => void }) {

  const ApiGetLogin = async (request = null) => {
    try {
      const options: RequestInit = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
      };
      if (request) {
        options.body = JSON.stringify(request)
      }
      const response = await fetch('http://localhost:3000/auth', options);
      if (!response.ok) {
        throw new Error(`🚨 SigiLife apiCall error status 📢:${response.status}`)
      }
      return await response.json();
    }
    catch (error) {
      console.error(`🚨 SigiLife apiCall fail reason 📢:${error}❗👀`);
      throw error;
    }
  };

  const navigate = useNavigate();

  const handleLogin = async () => {
    const user = await ApiGetLogin();
    setUser(user);
    navigate('/home');
  }

  return (
    <div>
      <button onClick={handleLogin}>Sign in with Google</button>
    </div>
  )
};