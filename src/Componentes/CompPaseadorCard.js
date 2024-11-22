import React from 'react';
import Card from 'react-bootstrap/Card';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { iAX } from "../ConfigAXIOS"; 

export default function CompPaseadorCard({ _id, nompas, Numide, Numcelpas, Numcelemp, Email, Diremp, Dirpas, Imgepas, Tarifa, Calpas, onDelete }) {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        navigate("/Pages/PaseadorForm", {
            state: { paseador: { _id, nompas, Numide, Numcelpas, Numcelemp, Email, Diremp, Dirpas, Imgepas, Tarifa, Calpas } }
        });
    };

    const handleDelete = async () => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este paseador?")) {
            try {
                // Realizar la solicitud al servidor
                const response = await iAX.post(`http://localhost:3001/api/eliPas`, { info: { iid: _id } });
    
                // Validar si la eliminación fue exitosa
                if (response.status === 200 && response.data.msg === "OK") {
                    alert('Paseador eliminado exitosamente');
                    onDelete(_id); // Actualizar la lista después de eliminar
                } else {
                    alert('Error inesperado al eliminar el paseador.');
                }
            } catch (error) {
                // Manejar errores específicos según el código de estado
                if (error.response) {
                    if (error.response.status === 400) {
                        alert(`Error: ${error.response.data.info}`);
                    } else if (error.response.status === 404) {
                        alert('El paseador no fue encontrado.');
                    } else if (error.response.status === 500) {
                        alert('Error interno del servidor. Por favor, inténtalo nuevamente más tarde.');
                    } else {
                        alert(`Error desconocido: ${error.response.data.info || "Sin información adicional."}`);
                    }
                } else {
                    // Error de red u otros problemas
                    console.error('Error al intentar eliminar el paseador:', error);
                    alert('Hubo un error de red o conexión. Por favor, inténtalo nuevamente.');
                }
            }
        }
    };
    
    

    return (
        <Card className="product-card" style={{ width: '18rem', margin: '10px' }}>
            <div className="image-container">
                <Card.Img variant="top" src={Imgepas ? Imgepas : "default_image.jpg"} className="product-image" />
            </div>
            <Card.Body>
                <Card.Title>{nompas}</Card.Title>
                <Card.Text>
                    <strong>Email:</strong> {Email} <br />
                    <strong>Teléfono:</strong> {Numcelpas} <br />
                    <strong>Dirección:</strong> {Dirpas} <br />
                    <strong>Tarifa:</strong> ${Tarifa}<br />
                    <strong>Calificación:</strong> {Calpas} <br />
                </Card.Text>
                <Button variant="primary" onClick={handleViewDetails}>
                    Ver Detalles
                </Button>
                <Button variant="danger" onClick={handleDelete} style={{ marginLeft: '10px' }}>
                    Eliminar
                </Button>
            </Card.Body>
        </Card>
    );
}
