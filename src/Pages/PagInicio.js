import React, { useEffect } from 'react';
import CompProducto from '../Componentes/CompProducto'; // Componente que ya tienes para mostrar un producto
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setInfoProductos } from "../Reducers/reducers";


export default function PagInicio() {
    const dispatch = useDispatch();
  // Obtener los productos del estado global (de la galería)
  const infoProductos = useSelector(state => state.lab2.infoProducto);
  // Llama a la API cuando el componente se monte
  useEffect(() => {
    async function getData() {
        try {
            const response = await axios.get("https://fakestoreapi.com/products");
            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log("Data: ", response.data); // Mostrar los datos obtenidos de la API en consola
            dispatch(setInfoProductos(response.data)); // Actualiza el estado con los productos obtenidos
        } catch (error) {
            console.error("Error getting data:", error);
        }
    }
    getData();
}, [dispatch]);

  // Tomar los primeros 5 productos
  const productosInicio = infoProductos.slice(0, 4);

  return (
    <div className="inicio-container">
      <h1>Productos Destacados</h1>
      <p>
        Estos son algunos de nuestros productos más populares. ¡Descubre más en la galería!
      </p>

      {/* Mostrar los primeros 5 productos */}
      <Container>
        <Row>
          {productosInicio && productosInicio.map(producto => (
            <Col md={3} key={producto.id} style={{ marginBottom: '20px' }}>
              <CompProducto {...producto} /> {/* Usamos el componente de producto */}
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}
