import React from 'react'
import { NavLink } from "react-router-dom";

export default function Menu() {
  return(
    <>
        <nav className="menu">
            <NavLink className={ ({isActive}) => ( isActive ? "activo" : null) } to='/Inic'>Inicio</NavLink>
            <NavLink className={ ({isActive}) => ( isActive ? "activo" : null) } to='/Gal'>Galería  </NavLink>
            {/* <NavLink className={ ({isActive}) => ( isActive ? "activo" : null) } to='/Prt'>Producto  </NavLink> */}
            <NavLink className={ ({isActive}) => ( isActive ? "activo" : null) } to='/Ctt'>Contacto  </NavLink>
        </nav>
    </>
  );
}
