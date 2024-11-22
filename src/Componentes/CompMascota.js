import { useState, useEffect } from "react";
import { Button, Form, Table, Row, Col, Card, Alert, Container, ButtonGroup, Pagination } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { iAX } from "../ConfigAXIOS";
import { setInfoMasc, setPag } from '../Reducers/reducers';

function CompMascota() {
    const dispatch = useDispatch();
    const aMasc = useSelector(state => state.lab2.infoMasc) || [];
    const aDue = useSelector(state => state.lab2.infoDue);
    const pagAct = useSelector(state => state.lab2.pagAct);
    const [loading, setLoading] = useState(true); // Estado de carga
    const [isEditMode, setIsEditMode] = useState(false); // Estado para saber si estamos en modo edición
    const [formValues, setFormValues] = useState({
        id: "",
        nommas: "",
        edad: "",
        genero: "",
        raza: "",
        recomendaciones: "",
        duenoid: ""
    });
    const [message, setMessage] = useState("");

    // Definir el número máximo de personajes por página
    const numRegPorPag = 5;
    const ultReg = pagAct * numRegPorPag;
    const primerReg = ultReg - numRegPorPag;
    const regPorPag = aMasc.slice(primerReg, ultReg);

    // Llama a la API cuando el componente se monte
    useEffect(() => {
        fetchMasc();
    }, [dispatch]);

    // Función para obtener todos los mascotas
    const fetchMasc = async () => {
        try {
            const response = await iAX.get("http://127.0.0.1:3001/masc/getAllMascD");
            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            dispatch(setInfoMasc(response.data.info));
            setLoading(false); // Actualizar el estado de carga a false cuando los datos se han recibido
        } catch (error) {
            console.error("Error getting data:", error);
            setLoading(false); // Asegurarse de que el estado de carga se actualiza a false en caso de error también
        }
    };

    const validaForma = (event) => {
        event.preventDefault();
        const { nommas, edad, genero, duenoid } = formValues;
    
        if (!nommas || !edad || !genero || !duenoid) {
            setMessage("Por favor, completa todos los campos obligatorios.");
            return;
        }
    
        if (isEditMode) {
            updMasc(); // Cambiar nombres para consistencia
        } else {
            crearMasc(formValues); // Crear lógica específica para mascotas
        }
    };

    async function crearMasc(data) {
        try {
            const rta = await iAX.post("http://127.0.0.1:3001/masc/insMasc", { info: data });
            if (rta.status === 200) {
                setMessage("Mascota creada exitosamente.");
                setFormValues({
                    id: "",
                    nommas: "",
                    edad: "",
                    genero: "",
                    raza: "",
                    recomendaciones: "",
                    duenoid: ""
                });
                fetchMasc(); // Refrescar el listado después de crear
            } else {
                setMessage("ERR: No se pudo crear el registro");
            }
        } catch (error) {
            setMessage("ERR:" + error.message);
        }
    }

    const cargarMascEnFormulario = (masc) => {
        setIsEditMode(true); // Cambiar a modo edición
        setFormValues({
            id: masc._id,
            nommas: masc.nommas,
            edad: masc.edad,
            genero: masc.genero,
            raza: masc.raza,
            recomendaciones: masc.recomendaciones,
            duenoid: masc.duenoid           
        });
    }

    async function updMasc() {
        const data = { ...formValues };
        console.log('Data a enviar:', data);
        try {
            const rta = await iAX.post("http://127.0.0.1:3001/masc/updMasc", { info: data });
            console.log('Respuesta del servidor:', rta);
            if (rta.status === 200) {
                setMessage("Actualización exitosa.");
                setFormValues({
                    id: "",
                    nommas: "",
                    edad: "",
                    genero: "",
                    raza: "",
                    recomendaciones: "",
                    duenoid: ""
                });
                fetchMasc(); // Refrescar el listado después de actualizar
                setIsEditMode(false); // Volver a modo creación después de la actualización
            }
        } catch (error) {
            setMessage("ERR:" + error.message);
        }
    }

    async function eliMasc(id) {
        if (window.confirm("¿Estás seguro de que deseas eliminar esta mascota?")) {
            try {
                // Enviar la solicitud al servidor
                const rta = await iAX.post("http://127.0.0.1:3001/masc/eliMasc", { info: { id: id } });
    
                // Imprimir la respuesta completa en consola
                console.log('Respuesta del servidor:', rta);
    
                // Verificar si la respuesta es exitosa
                if (rta.status === 200 && rta.data.msg === 'OK') {
                    alert("Eliminación exitosa.");
                    fetchMasc(); // Refrescar el listado después de eliminar
                } else if (rta.status === 400 && rta.data.msg === 'ER') {
                    // Mostrar el mensaje enviado por el servidor en caso de error específico
                    alert(rta.data.info || 'No se pudo eliminar la mascota.');
                } else {
                    // Mensaje genérico para otros casos
                    alert('No se pudo eliminar la mascota. Intente nuevamente.');
                }
            } catch (error) {
                console.error('Error al eliminar la mascota:', error);
    
                // Manejo de errores detallado
                if (error.response && error.response.data) {
                    alert(error.response.data.info || 'Hubo un error inesperado al eliminar la mascota.');
                } else {
                    alert('Hubo un error al conectar con el servidor.');
                }
            }
        }
    }
    
    

    // Actualizar estado cuando los campos del formulario cambian
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    // Función para cancelar la edición y volver al modo de creación
    const cancelarEdicion = () => {
        setIsEditMode(false);  // Cambiar a modo creación
        setFormValues({
            id: "",
            nommas: "",
            edad: "",
            genero: "",
            raza: "",
            recomendaciones: "",
            duenoid: ""
        });
        setMessage(""); // Limpiar el mensaje
    }

    // Cerrar el mensaje de alerta automáticamente después de 5 segundos
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(""); // Limpiar el mensaje
            }, 5000); // 5 segundos

            return () => clearTimeout(timer); // Limpiar el timer cuando el componente se desmonte o el mensaje cambie
        }
    }, [message]);

    const paginar = (np) => {
        dispatch(setPag(np));
    };
    
    return (
        <Container>
            <Row className="mb-4">
                <Col md={4} sm={12}>
                    <Card>
                        <Card.Body>
                            <Form noValidate onSubmit={validaForma}>
                                {/* Formulario para Crear o Actualizar Mascota */}
                                <Form.Group>
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nommas"
                                        placeholder="Nombre de la mascota"
                                        required
                                        value={formValues.nommas}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Edad</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="edad"
                                        placeholder="Edad de la mascota"
                                        required
                                        value={formValues.edad}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Raza</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="raza"
                                        placeholder="Raza de la mascota"
                                        required
                                        value={formValues.raza}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Género</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="genero"
                                        required
                                        value={formValues.genero}
                                        onChange={handleChange}
                                    >
                                        <option value="">Seleccionar género</option>
                                        <option value="1">Macho</option>
                                        <option value="2">Hembra</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Recomendaciones</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="recomendaciones"
                                        placeholder="Recomendaciones para la mascota"
                                        required
                                        value={formValues.recomendaciones}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Dueño</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="duenoid"
                                        required
                                        value={formValues.duenoid}
                                        onChange={handleChange}
                                    >
                                        <option value="">Seleccionar dueño</option>
                                        {aDue.map((dueno) => (
                                            <option key={dueno._id} value={dueno._id}>
                                                {dueno.nomdue}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Button type="submit" variant="primary" className="mt-3 w-100">
                                    {isEditMode ? "Actualizar Mascota" : "Crear Mascota"}
                                </Button>
                                {isEditMode && (
                                    <Button variant="secondary" className="mt-2 w-100" onClick={cancelarEdicion}>
                                        Cancelar
                                    </Button>
                                )}
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={8} sm={12}>
                    <Card>
                        <Card.Body>
                            {/* Mostrar mensaje de error o éxito */}
                            {message && <Alert variant="info">{message}</Alert>}
                            
                            <Table bordered responsive>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Edad</th>
                                        <th>Raza</th>
                                        <th>Género</th>
                                        <th>Recomendaciones</th>
                                        <th>Dueño</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {regPorPag.map((mascota) => (
                                        <tr key={mascota._id}>
                                            <td>{mascota.nommas}</td>
                                            <td>{mascota.edad}</td>
                                            <td>{mascota.raza}</td>
                                            <td>{mascota.genero === 1 ? "Macho" : "Hembra"}</td>
                                            <td>{mascota.recomendaciones}</td>
                                            <td>{mascota.infDuen.nomdue}</td>
                                            <td>
                                                <ButtonGroup>
                                                    <Button variant="info" onClick={() => cargarMascEnFormulario(mascota)}>Editar</Button>
                                                    <Button variant="danger" onClick={() => eliMasc(mascota._id)}>Eliminar</Button>
                                                </ButtonGroup>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <Pagination className="d-flex justify-content-center mt-2">
                                    {/* Añadir los botones de paginación */}
                                    <Pagination.First onClick={() => paginar(1)} />
                                    <Pagination.Prev onClick={() => paginar(Math.max(pagAct - 1, 1))} />
                                    {/* <Pagination>{lstBtnPag}</Pagination> */}
                                    <Pagination.Next onClick={() => paginar(Math.min(pagAct + 1, Math.ceil(aMasc.length / numRegPorPag)))} />
                                    <Pagination.Last onClick={() => paginar(Math.ceil(aMasc.length / numRegPorPag))} />
                                </Pagination>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default CompMascota;
