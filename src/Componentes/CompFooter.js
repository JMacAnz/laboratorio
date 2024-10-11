// Footer.jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

import { NavLink } from'react-router-dom';

function CompFooter() {
    return (
        <footer className="footer">
        {/* <p>Contacto:</p> */}
        <div className="social-icons">
          <a href="https://facebook.com" target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={faFacebook} size="2x" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={faTwitter} size="2x" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={faInstagram} size="2x" />
          </a>
          <NavLink className="" to='/Ctt'>Contacto  </NavLink>
        </div>
        <p>Dirección: Calle Falsa 123, Bogotá, Colombia</p>
        <p>Teléfono: +57 123 456 7890</p>
      </footer>
    );
  }
  
  export default CompFooter;
  