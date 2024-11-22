import { useState, useEffect } from "react";
import { Button, Form, Table, Row, Col, Card, Alert, Container, ButtonGroup } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { setInfoDue } from "../Reducers/reducers";
import { iAX } from "../ConfigAXIOS";
import { setPag } from '../Reducers/reducers';
import { Pagination } from 'react-bootstrap';

function CompDueno() {
    const dispatch = useDispatch();
    const aDue = useSelector(state => state.lab2.infoDue);  // Obtener el listado desde Redux
    const [loading, setLoading] = useState(true); // Estado de carga
    const [isEditMode, setIsEditMode] = useState(false); // Estado para saber si estamos en modo edición

    const pagAct = useSelector(state => state.lab2.pagAct);
    //console.log(infoProductos); // Mostrar los productos en la consola  
  
    var numRegPorPag = 3; // Definir el número máximo de personajes por página
    var ultReg = pagAct * numRegPorPag;
    var primerReg = ultReg - numRegPorPag;
    const regPorPag = aDue.slice(primerReg, ultReg);

    const [formValues, setFormValues] = useState({
        id: "",
        nomdue: "",
        teldue: "",
        dirdue: "",
        cordue: ""
    });
    const [message, setMessage] = useState("");

    // Llama a la API cuando el componente se monte
    useEffect(() => {
        fetchDueno();
    }, [dispatch]);

    // Función para obtener todos los dueños
    const fetchDueno = async () => {
        try {
            const response = await iAX.get("http://127.0.0.1:3001/due/getAllDue");
            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log("Data: ", response.data);
            dispatch(setInfoDue(response.data.info));
            setLoading(false); // Actualizar el estado de carga a false cuando los datos se han recibido
        } catch (error) {
            console.error("Error getting data:", error);
            setLoading(false); // Asegurarse de que el estado de carga se actualiza a false en caso de error también
        }
    };

    const validaForma = (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            setMessage("Formulario presenta errores");
        } else {
            setMessage("");
            if (isEditMode) {
                updDue(); // Si estamos en modo edición, actualizar el dueño
            } else {
                crearDue(formValues); // Si estamos en modo creación, crear un nuevo dueño
            }
        }
    }

    async function crearDue(data) {
        try {
            const rta = await iAX.post("http://127.0.0.1:3001/due/insDue", { info: data });
            if (rta.status === 200) {
                setMessage("Dueño creado exitosamente.");
                setFormValues({
                    id: "",
                    nomdue: "",
                    teldue: "",
                    dirdue: "",
                    cordue: ""
                });
                fetchDueno(); // Refrescar el listado después de crear
            } else {
                setMessage("ERR: No se pudo crear el registro");
            }
        } catch (error) {
            setMessage("ERR:" + error.message);
        }
    }

    const cargarDueEnFormulario = (due) => {
        setIsEditMode(true); // Cambiar a modo edición
        setFormValues({
            id: due._id,
            nomdue: due.nomdue,
            teldue: due.teldue,
            dirdue: due.dirdue,
            cordue: due.cordue
        });
    }

    async function updDue() {
        const data = { ...formValues };

        try {
            const rta = await iAX.post("http://127.0.0.1:3001/due/updDue", { info: data });
            if (rta.status === 200) {
                setMessage("Actualización exitosa.");
                setFormValues({
                    id: "",
                    nomdue: "",
                    teldue: "",
                    dirdue: "",
                    cordue: ""
                });
                fetchDueno(); // Refrescar el listado después de actualizar
                setIsEditMode(false); // Volver a modo creación después de la actualización
            }
        } catch (error) {
            setMessage("ERR:" + error.message);
        }
    }

    async function eliDue(id) {
        if (window.confirm("¿Estás seguro de que deseas eliminar este dueño?")) {
            try {
                // Enviar la solicitud al servidor
                const rta = await iAX.post("http://127.0.0.1:3001/due/eliDue", { info: { id: id } });
    
                // Imprimir la respuesta completa en consola
                console.log('Respuesta del servidor:', rta);
    
                // Verificar si la respuesta es exitosa
                if (rta.status === 200 && rta.data.msg === 'OK') {
                    alert("Eliminación exitosa.");
                    fetchDueno(); // Refrescar el listado después de eliminar
                } else if (rta.status === 400 && rta.data.msg === 'ER') {
                    // Mostrar el mensaje del servidor si no se pudo eliminar
                    alert(rta.data.info || 'No se pudo eliminar al dueño.');
                } else {
                    alert('No se pudo eliminar al dueño. Intente nuevamente.');
                }
            } catch (error) {
                console.error('Error al eliminar el dueño:', error);
    
                // Mensaje detallado si el error contiene más información
                if (error.response && error.response.data) {
                    alert(error.response.data.info || 'Hubo un error inesperado al eliminar el dueño.');
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
            nomdue: "",
            teldue: "",
            dirdue: "",
            cordue: ""
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
                                {/* Formulario para Crear o Actualizar Dueño */}
                                <Form.Group>
                                    <Form.Label hidden={!isEditMode}>_id</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="id"
                                        placeholder="_id"
                                        value={formValues.id}
                                        onChange={handleChange}
                                        disabled={isEditMode} // Deshabilitar el campo id en modo edición
                                        hidden={!isEditMode}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nomdue"
                                        placeholder="Nombre del dueño"
                                        required
                                        value={formValues.nomdue}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Teléfono</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="teldue"
                                        placeholder="Teléfono del dueño"
                                        required
                                        value={formValues.teldue}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Dirección</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="dirdue"
                                        placeholder="Dirección del dueño"
                                        required
                                        value={formValues.dirdue}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="cordue"
                                        placeholder="Email del dueño"
                                        required
                                        value={formValues.cordue}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Button type="submit" variant="primary" className="mt-3 w-100">
                                    {isEditMode ? "Actualizar Dueño" : "Crear Dueño"}
                                </Button>
                                {isEditMode && (
                                    <Button variant="secondary" className="mt-3 w-100" onClick={cancelarEdicion}>
                                        Cancelar
                                    </Button>
                                )}
                            </Form>
                        </Card.Body>
                    </Card>
                    {message && <Alert variant={message.includes("ERR") ? "danger" : "success"} className="mt-3">{message}</Alert>}
                </Col>
                <Col md={8} sm={12}>
                    <Card>
                        <Card.Body>
                            <h4 className="mb-3">Dueños</h4>
                            <div className="table-responsive">
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre</th>
                                            <th>Teléfono</th>
                                            <th>Dirección</th>
                                            <th>Email</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr><td colSpan="6" className="text-center">Cargando...</td></tr>
                                        ) : aDue.length === 0 ? (
                                            <tr><td colSpan="6" className="text-center">No se encontraron dueños.</td></tr>
                                        ) : (
                                            regPorPag.map((due) => (
                                                <tr key={due._id}>
                                                    <td>{due._id}</td>
                                                    <td>{due.nomdue}</td>
                                                    <td>{due.teldue}</td>
                                                    <td>{due.dirdue}</td>
                                                    <td>{due.cordue}</td>
                                                    <td>
                                                        <ButtonGroup>
                                                            <Button variant="info" onClick={() => cargarDueEnFormulario(due)}>Editar</Button>
                                                            <Button variant="danger" onClick={() => eliDue(due._id)}>Eliminar</Button>
                                                        </ButtonGroup>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </Table>
                                <Pagination className="d-flex justify-content-center mt-2">
                                    {/* Añadir los botones de paginación */}
                                    <Pagination.First onClick={() => paginar(1)} />
                                    <Pagination.Prev onClick={() => paginar(Math.max(pagAct - 1, 1))} />
                                    {/* <Pagination>{lstBtnPag}</Pagination> */}
                                    <Pagination.Next onClick={() => paginar(Math.min(pagAct + 1, Math.ceil(aDue.length / numRegPorPag)))} />
                                    <Pagination.Last onClick={() => paginar(Math.ceil(aDue.length / numRegPorPag))} />
                                </Pagination>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default CompDueno;
