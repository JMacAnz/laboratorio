import React, { useEffect } from 'react';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setInfoProductos } from "../Reducers/reducers";
import CompProducto from "../Componentes/CompProducto"; // Componente para mostrar un producto individual
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function PagGaleria() {
    
    const infoProductos = useSelector(state => state.lab2.infoProducto); // Obtén los productos del estado global   

    return (
        <div className="galeria-productos">
            <h1>Galería de Productos</h1>
            <Container>
                <Row>
                    {/* Itera sobre los productos y muestra un componente CompProducto por cada uno */}
                    {infoProductos && infoProductos.map((producto) => (
                        <Col md={3} key={producto.id} style={{ marginBottom: '20px' }}>
                            <CompProducto key={producto.id} {...producto} /> 
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
}