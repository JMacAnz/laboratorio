import React from 'react';
import Card from 'react-bootstrap/Card';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

export default function CompProducto({ id, title, image, category, description, price, rating }) {
  const navigate = useNavigate(); // Crear una instancia de useNavigate

  // Limitar la longitud de la descripción
  const truncatedDescription = description.length > 100
    ? description.substring(0, 100) + "..."
    : description;

  // Manejar la redirección al hacer clic en el botón
  const handleViewDetails = () => {
    navigate("/Prt", { state: { product: { id, title, image, category, description, price, rating } } });
  };

  return (
    <Card className="product-card" style={{ width: '18rem', margin: '10px' }}>
      <div className="image-container">
        <Card.Img variant="top" src={image} className="product-image" />
      </div>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>
          <strong>Categoría:</strong> {category} <br />
          {/* <strong>Descripción:</strong> {truncatedDescription}<br /> */}
          <strong>Precio:</strong> ${price.toFixed(2)}<br />
          <strong>Calificación:</strong> {rating.rate} ({rating.count} votos)<br />
        </Card.Text>
        <Button variant="primary" onClick={handleViewDetails}>
          Ver Detalles
        </Button>
      </Card.Body>
    </Card>
  );
}