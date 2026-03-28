import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import SigiLifeLogo from '../../assets/SigiLifeLogo.png';

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/api/auth/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => { if (data.user) navigate('/home'); });
  }, []);

  return (
    <>
      <section id="center">
        <div className="hero">
          <img
            src={SigiLifeLogo}
            className="logo"
            width="75%"
            height="75%"
            alt="Sigil-Life-Logo"
          />
        </div>
        <div>
          <h1>Coming Soon, SigiLife!</h1>
        </div>
        <div className="info" style={{ fontSize: 'large' }}>
          An app for creating and sharing magically imbued sigils.
          <br />
        </div>
        <div className="more-info" style={{ fontSize: 'small' }}>
          An Operation Spark Thesis project, by Stack-Mates, cohort tango, 2026. All rights reserved.
          <br />
        </div>

        <Link className="navbutton" to="/login">Login</Link>
        <br />
        <Link className="navbutton" to="/make-profile">Create Profile</Link>
      </section>
    </>
  );
}
