import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

function CompFooter() {
  return (
    <footer className="footer">
      <Container>
        <Row className="justify-content-center">
          <Col className="text-center">
            <Nav className="social-icons">
              <Nav.Link href="https://facebook.com" target="_blank" rel="noreferrer">
                <FontAwesomeIcon icon={faFacebook} size="2x" style={{ color: '#3b5998' }} /> {/* Color de Facebook */}
              </Nav.Link>
              <Nav.Link href="https://twitter.com" target="_blank" rel="noreferrer">
                <FontAwesomeIcon icon={faTwitter} size="2x" style={{ color: '#1DA1F2' }} /> {/* Color de Twitter */}
              </Nav.Link>
              <Nav.Link href="https://instagram.com" target="_blank" rel="noreferrer">
                <FontAwesomeIcon icon={faInstagram} size="2x" style={{ color: '#C13584' }} /> {/* Color de Instagram */}
              </Nav.Link>
            </Nav>
            <Nav.Link as={NavLink} to="/Ctt">Contacto</Nav.Link>
            <p>Dirección: Calle Falsa 123, Bogotá, Colombia</p>
            <p>Teléfono: +57 123 456 7890</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default CompFooter;
