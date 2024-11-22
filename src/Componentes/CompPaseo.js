import { useState, useEffect } from "react";
import { Button, Form, Table, Row, Col, Card, Alert, Container, ButtonGroup, Pagination } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { iAX } from "../ConfigAXIOS";
import { setInfoPase, setPag } from '../Reducers/reducers';

function CompPaseo() {
    const dispatch = useDispatch();
const aPase = useSelector(state => state.lab2.infoPase) || [];
const aPaseadores = useSelector(state => state.lab2.infoPaseadores);
const aMasc = useSelector(state => state.lab2.infoMasc);
const pagAct = useSelector(state => state.lab2.pagAct);
const [loading, setLoading] = useState(true); // Estado de carga
const [isEditMode, setIsEditMode] = useState(false); // Estado para saber si estamos en modo edición
const [formValues, setFormValues] = useState({
    id: "",
    fecpas: "",
    horpas: "",
    tiepas: "",
    mascid: "",
    paseadoreid: "",
    novpas: "",
});
const [message, setMessage] = useState("");

// Definir el número máximo de registros por página
const numRegPorPag = 5;
const ultReg = pagAct * numRegPorPag;
const primerReg = ultReg - numRegPorPag;
const regPorPag = aPase.slice(primerReg, ultReg);

// Llama a la API cuando el componente se monte
useEffect(() => {
    fetchPase();
}, [dispatch]);

// Función para obtener todos los paseos
const fetchPase = async () => {
    try {
        const response = await iAX.get("http://127.0.0.1:3001/pase/getAllPascD");
        console.log("Paseos obtenidos:", response.data.info);
        if (response.status !== 200) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        dispatch(setInfoPase(response.data.info));
        setLoading(false); // Actualizar el estado de carga a false cuando los datos se han recibido
    } catch (error) {
        console.error("Error obteniendo datos:", error);
        setLoading(false); // Asegurarse de que el estado de carga se actualiza a false en caso de error también
    }
};

const validaForma = (event) => {
    event.preventDefault();
    const { fecpas, horpas, tiepas, mascid, paseadoreid } = formValues;

    if (!fecpas || !horpas || !tiepas || !mascid || !paseadoreid) {
        setMessage("Por favor, completa todos los campos obligatorios.");
        return;
    }

    if (isEditMode) {
        updPase(); // Actualizar paseo
    } else {
        crearPase(formValues); // Crear un nuevo paseo
    }
};

async function crearPase(data) {
    try {
        const rta = await iAX.post("http://127.0.0.1:3001/pase/insPase", { info: data });
        if (rta.status === 200) {
            setMessage("Paseo creado exitosamente.");
            resetFormulario();
            fetchPase(); // Refrescar el listado después de crear
        } else {
            setMessage("ERR: No se pudo crear el registro");
        }
    } catch (error) {
        setMessage("ERR:" + error.message);
    }
}

const cargarPaseEnFormulario = (pase) => {
    setIsEditMode(true); // Cambiar a modo edición
    setFormValues({
        id: pase._id,
        fecpas: pase.fecpas,
        horpas: pase.horpas,
        tiepas: pase.tiepas,
        mascid: pase.mascid,
        paseadoreid: pase.paseadoreid,
        novpas: pase.novpas
    });
};

async function updPase() {
    const data = { ...formValues };
    try {
        const rta = await iAX.post("http://127.0.0.1:3001/pase/updPase", { info: data });
        if (rta.status === 200) {
            setMessage("Actualización exitosa.");
            resetFormulario();
            fetchPase(); // Refrescar el listado después de actualizar
            setIsEditMode(false); // Volver a modo creación después de la actualización
        }
    } catch (error) {
        setMessage("ERR:" + error.message);
    }
}

async function eliPaseo(id) {
    if (window.confirm("¿Estás seguro de que deseas eliminar este paseo?")) {
        try {
            const rta = await iAX.post("http://127.0.0.1:3001/pase/eliPase", { info: { id: id } });
            if (rta.status === 200 && rta.data.msg === 'OK') {
                alert("Eliminación exitosa.");
                fetchPase(); // Refrescar el listado después de eliminar
            } else {
                alert('No se pudo eliminar el paseo.');
            }
        } catch (error) {
            console.error('Error al eliminar el paseo:', error);
            alert('Hubo un error al eliminar el paseo.');
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
    resetFormulario();
    setMessage(""); // Limpiar el mensaje
};

// Función para resetear los valores del formulario
const resetFormulario = () => {
    setFormValues({
        id: "",
        fecpas: "",
        horpas: "",
        tiepas: "",
        mascid: "",
        paseadoreid: "",
        novpas: ""
    });
};

// Cerrar el mensaje de alerta automáticamente después de 5 segundos
useEffect(() => {
    if (message) {
        const timer = setTimeout(() => {
            setMessage(""); // Limpiar el mensaje
        }, 5000); // 5 segundos

        return () => clearTimeout(timer); // Limpiar el timer cuando el componente se desmonte o el mensaje cambie
    }
}, [message]);
const cargarPaseoEnFormulario = (pase) => {
    setIsEditMode(true); // Cambiar a modo edición
    setFormValues({
        id: pase._id,
        fecpas: pase.fecpas,
        horpas: pase.horpas,
        tiepas: pase.tiepas,
        mascid: pase.mascid,
        paseadoreid: pase.paseadoreid,
        novpas: pase.novpas         
    });
}
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
                                {/* Formulario para Crear o Actualizar Paseo */}
                                <Form.Group>
                                    <Form.Label>Fecha Paseo</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="fecpas"
                                        required
                                        value={formValues.fecpas}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Hora del Paseo</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="horpas"
                                        placeholder="Hora en formato 24 horas (ej: 15 para 3 PM)"
                                        required
                                        value={formValues.horpas}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Tiempo del Paseo</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="tiepas"
                                        placeholder="Duración del paseo (ej: 1 hora)"
                                        required
                                        value={formValues.tiepas}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Mascota</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="mascid"
                                        required
                                        value={formValues.mascid}
                                        onChange={handleChange}
                                    >
                                        <option value="">Seleccionar mascota</option>
                                        {aMasc.map((mascota) => (
                                            <option key={mascota._id} value={mascota._id}>
                                                {mascota.nommas}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Paseador</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="paseadoreid"
                                        required
                                        value={formValues.paseadoreid}
                                        onChange={handleChange}
                                    >
                                        <option value="">Seleccionar paseador</option>
                                        {aPaseadores.map((paseador) => (
                                            <option key={paseador._id} value={paseador._id}>
                                                {paseador.nompas}
                                            </option>
                                        ))}
                                    </Form.Control>                                    
                                </Form.Group>
                                <Form.Group>
                                        <Form.Label>Novedades del paseo</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="novpas"
                                            placeholder="Novedades adicionales al paseo"
                                            required
                                            value={formValues.novpas}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                <Button type="submit" variant="primary" className="mt-3 w-100">
                                    {isEditMode ? "Actualizar Paseo" : "Crear Paseo"}
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
                                        <th>Fecha</th>
                                        <th>Hora</th>
                                        <th>Tiempo</th>
                                        <th>Mascota</th>
                                        <th>Paseador</th>
                                        <th>Novedades</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {regPorPag.map((paseo) => (
                                        <tr key={paseo._id}>
                                            <td>{paseo.fecpas}</td>
                                            <td>{paseo.horpas}:00</td>
                                            <td>{paseo.tiepas}</td>
                                            <td>{paseo.infMasco.nommas}</td>
                                            <td>{paseo.infPaseador.nompas}</td>
                                             <td>{paseo.novpas}</td>
                                            <td>
                                                <ButtonGroup>
                                                    <Button variant="info" onClick={() => cargarPaseoEnFormulario(paseo)}>Editar</Button>
                                                    <Button variant="danger" onClick={() => eliPaseo(paseo._id)}>Eliminar</Button>
                                                </ButtonGroup>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <Pagination className="d-flex justify-content-center mt-2">
                                <Pagination.First onClick={() => paginar(1)} />
                                <Pagination.Prev onClick={() => paginar(Math.max(pagAct - 1, 1))} />
                                <Pagination.Next onClick={() => paginar(Math.min(pagAct + 1, Math.ceil(aPase.length / numRegPorPag)))} />
                                <Pagination.Last onClick={() => paginar(Math.ceil(aPase.length / numRegPorPag))} />
                            </Pagination>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>

    );
}

export default CompPaseo;
