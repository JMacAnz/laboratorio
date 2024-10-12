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
    <footer className="footer">
      <Container>
        <Row className="justify-content-center">
          <Col className="text-center">
            <Nav className="social-icons">
              <OverlayTrigger placement="top" overlay={renderTooltip({ title: 'Facebook' })}>
                <Nav.Link href="https://facebook.com" target="_blank" rel="noreferrer">
                  <FontAwesomeIcon icon={faFacebook} size="2x" style={{ color: '#3b5998' }} />
                </Nav.Link>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={renderTooltip({ title: 'Twitter' })}>
                <Nav.Link href="https://twitter.com" target="_blank" rel="noreferrer">
                  <FontAwesomeIcon icon={faTwitter} size="2x" style={{ color: '#1DA1F2' }} />
                </Nav.Link>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={renderTooltip({ title: 'Instagram' })}>
                <Nav.Link href="https://instagram.com" target="_blank" rel="noreferrer">
                  <FontAwesomeIcon icon={faInstagram} size="2x" style={{ color: '#C13584' }} />
                </Nav.Link>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={renderTooltip({ title: 'Contacto' })}>
                <Nav.Link as={NavLink} to="/Ctt">
                  <FontAwesomeIcon icon={faEnvelope} size="2x" style={{ color: 'White' }} />                  
                </Nav.Link>
              </OverlayTrigger>
            </Nav>
            <p>Dirección: Calle Falsa 123, Bogotá, Colombia</p>
            <p>Teléfono: +57 123 456 7890</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default CompFooter;
