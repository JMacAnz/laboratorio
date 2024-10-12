import React from 'react';
import { NavLink } from "react-router-dom";
import { Navbar, Nav } from 'react-bootstrap';

export default function Menu() {
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <NavLink
              className={({ isActive }) => (isActive ? "nav-link activo" : "nav-link")}
              to='/Inic'
            >
              Inicio
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? "nav-link activo" : "nav-link")}
              to='/Gal'
            >
              Galería
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? "nav-link activo" : "nav-link")}
              to='/TblPrt'
            >
              Producto
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? "nav-link activo" : "nav-link")}
              to='/Ctt'
            >
              Contacto
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}
