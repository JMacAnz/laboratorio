import React from 'react';
import Card from 'react-bootstrap/Card';
import { Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';


export default function PagProducto() {
  const location = useLocation();
  const producto = location.state.product; // Obtener el producto de la ubicación

  if (!producto) {
    return <div>No se encontró información del producto.</div>;
  }

  return (
    <Card style={{ width: '30rem', margin: '20px auto' }}>
      <Card.Img variant="top" src={producto.image} />
      <Card.Body>
        <Card.Title>{producto.title}</Card.Title>
        <Card.Text>
          <strong>Precio:</strong> ${producto.price.toFixed(2)}<br />
          <strong>Descripción:</strong> {producto.description}<br />
          <strong>Categoría:</strong> {producto.category}<br />
          <strong>Calificación:</strong> {producto.rating.rate} ({producto.rating.count} votos)<br />
        </Card.Text>
        <Button variant="secondary" onClick={() => window.history.back()}>
          Regresar
        </Button>
      </Card.Body>
    </Card>
  );
}
