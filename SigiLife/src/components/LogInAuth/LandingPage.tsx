import { Link } from 'react-router-dom';
import SigiLifeLogo from '../../assets/SigiLife Logo.png';

function LandingPage() {
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
          An Operation Spark Thesis project, 2026. All rights reserved.
          <br />
        </div>

        <Link to="/login">Login</Link>
        <Link to="/make-profile">Create Profile</Link>
      </section>
    </>
  );
}

export default LandingPage;
