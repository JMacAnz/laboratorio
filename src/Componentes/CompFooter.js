import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { Container, Row, Col, Nav, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

function CompFooter() {
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Ir a {props.title}
    </Tooltip>
  );

  return (
    <footer className="footer py-4" style={{ backgroundColor: '#333', color: '#fff' }}>
      <Container>
        <Row className="text-center text-md-start align-items-center">
          {/* Social Icons */}
          <Col xs={12} md={6} className="mb-3 mb-md-0">
            <Nav className="justify-content-center justify-content-md-start social-icons">
              {[
                { href: "https://facebook.com", icon: faFacebook, color: '#3b5998', title: 'Facebook' },
                { href: "https://twitter.com", icon: faTwitter, color: '#1DA1F2', title: 'Twitter' },
                { href: "https://instagram.com", icon: faInstagram, color: '#C13584', title: 'Instagram' },
              ].map(({ href, icon, color, title }, index) => (
                <OverlayTrigger key={index} placement="top" overlay={renderTooltip({ title })}>
                  <Nav.Link href={href} target="_blank" rel="noreferrer" className="mx-2">
                    <FontAwesomeIcon icon={icon} size="2x" style={{ color }} />
                  </Nav.Link>
                </OverlayTrigger>
              ))}
              <OverlayTrigger placement="top" overlay={renderTooltip({ title: 'Contacto' })}>
                <Nav.Link as={NavLink} to="/Ctt" className="mx-2">
                  <FontAwesomeIcon icon={faEnvelope} size="2x" style={{ color: '#fff' }} />
                </Nav.Link>
              </OverlayTrigger>
            </Nav>
          </Col>
          {/* Contact Information */}
          <Col xs={12} md={6} className="text-center text-md-end">
            <p className="mb-1">Dirección: Calle Falsa 123, Bogotá, Colombia</p>
            <p>Teléfono: +57 123 456 7890</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default CompFooter;
