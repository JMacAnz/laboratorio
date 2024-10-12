import React from 'react';
import { Form, Button, Container } from 'react-bootstrap';

export default function PagContato() {
  return (
    <Container className="mt-5">
      <h1>Contacto</h1>
      <p>Si tienes alguna consulta o inquietud, por favor llena el siguiente formulario y te responderemos a la brevedad.</p>
      <Form>
        <Form.Group className="mb-3" controlId="formName">
          <Form.Label>Nombre</Form.Label>
          <Form.Control type="text" placeholder="Ingresa tu nombre" required/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control type="email" placeholder="Ingresa tu correo" required/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPhone">
          <Form.Label>Teléfono</Form.Label>
          <Form.Control type="text" placeholder="Ingresa tu teléfono" required/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formMessage">
          <Form.Label>Mensaje</Form.Label>
          <Form.Control as="textarea" rows={3} placeholder="Escribe tu mensaje aquí" required/>
        </Form.Group>

        <Button variant="primary" type="submit">
          Enviar
        </Button>
      </Form>
    </Container>
  );
}
