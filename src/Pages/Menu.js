import React from 'react';
import { NavLink } from "react-router-dom";
import { Navbar, Nav, Container, Button, Image } from 'react-bootstrap';
import { useAuth } from '../Componentes/AuthContext'; // Importamos el contexto de autenticación
import { useDispatch, useSelector } from "react-redux";

export default function Menu() {
  const { isAuthenticated, logout, user } = useAuth(); // Usamos el hook useAuth
  const infoUsuario = useSelector(state => state.lab2.infoUsuario); 

  return (
    <Navbar bg="dark" expand="lg" variant="dark" className="mb-4">
      <Container>
        {/* Logo o nombre de la marca */}
        <Navbar.Brand as={NavLink} to='/Inic'>
          <img
            src={`${process.env.PUBLIC_URL}/Resources/LogoPaseador.png`}
            alt="Logo Paseador"
            width="40" // Ajusta el ancho según lo que necesites
            height="40" // Ajusta el alto según lo que necesites
            className="d-inline-block align-top"
          />
          {' '}
          <span className="brand-text">PuppyWalker</span>
        </Navbar.Brand>

        {/* Toggle para colapsar en pantallas pequeñas */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Menú */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            {[{ to: '/Inic', label: 'Inicio' },
              // { to: '/Gal', label: 'Galería' },
              { to: '/Pas', label: 'Paseadores' },
              { to: '/Duen', label: 'Dueno' },
              { to: '/Masc', label: 'Mascota' },
              { to: '/Pase', label: 'Paseo' },
              { to: '/Ctt', label: 'Contacto' }]
              .map((item, index) => (
                <NavLink
                  key={index}
                  className={({ isActive }) => 
                    `nav-link ${isActive ? "activo text-white fw-bold" : "text-light"}`}
                  to={item.to}
                >
                  {item.label}
                </NavLink>
            ))}
          </Nav>

          {/* Menú de autenticación a la derecha */}
          <Nav className="ms-auto">
            {isAuthenticated ? (
              <>
                {/* Foto de perfil y nombre */}
                <div className="d-flex align-items-center">
                  {/* Icono de Font Awesome */}
                  <i className="fa fa-user-circle text-white me-2" style={{ fontSize: '30px' }}></i>
                  <span className="text-white me-2">{infoUsuario.usuario}</span>
                  <Button variant="outline-light" onClick={logout}>Cerrar sesión</Button>
                </div>
              </>
            ) : (
              <NavLink
                className={({ isActive }) => 
                  `nav-link ${isActive ? "activo text-white fw-bold" : "text-light"}`}
                to="/Log"
              >
                
              </NavLink>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
