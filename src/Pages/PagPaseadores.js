import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { iAX } from "../ConfigAXIOS"; 
import { useDispatch, useSelector } from "react-redux";
import { setInfoPaseadores } from "../Reducers/reducers";
import CompPaseadorCard from "../Componentes/CompPaseadorCard";


export default function PagPaseadores() {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate('/Pages/PaseadorForm');
    };

    const dispatch = useDispatch();
    const infoPaseadores = useSelector(state => state.lab2.infoPaseadores);

    // Función para obtener todos los paseadores
    const fetchPaseadores = async () => {
        try {
            const response = await iAX.get("http://localhost:3001/api/getAllPaseadores");
            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log("Data: ", response.data);
            dispatch(setInfoPaseadores(response.data.info));
        } catch (error) {
            console.error("Error getting data:", error);
        }
    };

    // Llama a la API cuando el componente se monte
    useEffect(() => {
        fetchPaseadores();
    }, [dispatch]);

    // Función para manejar la eliminación de un paseador
    const handleDelete = (id) => {
        const updatedPaseadores = infoPaseadores.filter(paseador => paseador._id !== id);
        dispatch(setInfoPaseadores(updatedPaseadores));
    };

    return (
        <Container>
            <Row className="justify-content-left">
                <Col xs="auto">
                    <Button variant="primary" onClick={handleNavigate}>
                        Crear un paseador
                    </Button>
                </Col>
            </Row>
            <Row>
                {infoPaseadores && infoPaseadores.map(paseador => (
                    <Col md={3} key={paseador._id} style={{ marginBottom: '20px' }}>
                        <CompPaseadorCard {...paseador} onDelete={handleDelete} /> {/* Pasar handleDelete como prop */}
                    </Col>
                ))}
            </Row>
        </Container>
    );
}
