import React, { useState, useEffect } from 'react';
import { Form, Button, Col, Row, Alert, Spinner } from 'react-bootstrap';
import { iAX } from "../ConfigAXIOS";
import { useNavigate } from 'react-router-dom'; // Para redireccionar
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const PaseadorForm = () => {
    const { state } = useLocation(); // Recuperar los datos pasados por el navigate
    const paseador = state?.paseador; // Desestructurar los datos del paseador

    const navigate = useNavigate(); // Hook para redireccionar
    const [isUploading, setIsUploading] = useState(false); // Para manejar el estado de carga

    // Nuevo estado para la vista previa de la imagen
    const [previewImage, setPreviewImage] = useState(null);

    const [loading, setLoading] = useState(false);

    const [formValues, setFormValues] = useState({
        //_id: '',
        nompas: '',
        Tipide: 'CC',
        Numide: '',
        Numcelpas: '',
        Email: '',
        Numcelemp: '',
        Diremp: '',
        Dirpas: '',
        Imgepas: null,
        Tarifa: '',
        Calpas: 1,
    });

    useEffect(() => {
        // Si hay datos en paseador, cargar en el estado del formulario
        if (paseador) {
            setFormValues({
                _id: paseador._id,
                nompas: paseador.nompas,
                Numide: paseador.Numide,
                Numcelpas: paseador.Numcelpas,
                Numcelemp: paseador.Numcelemp,
                Email: paseador.Email,
                Diremp: paseador.Diremp,
                Dirpas: paseador.Dirpas,
                Imgepas: paseador.Imgepas,
                Tarifa: paseador.Tarifa,
                Calpas: paseador.Calpas
            });
            // Si ya hay una imagen existente, úsala para la vista previa
            setPreviewImage(paseador.Imgepas);
        }
    }, [paseador]); // Solo se ejecuta cuando paseador cambia


    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!formValues.nompas) newErrors.nompas = 'El nombre es obligatorio';
        if (!formValues.Numide) newErrors.Numide = 'La identificación es obligatoria';
        if (!formValues.Numcelpas) newErrors.Numcelpas = 'El teléfono de contacto es obligatorio';
        if (!formValues.Email) newErrors.Email = 'El correo electrónico es obligatorio';
        if (!formValues.Numcelemp) newErrors.Numcelemp = 'El teléfono de la empresa es obligatorio';
        if (!formValues.Diremp) newErrors.Diremp = 'La dirección de la empresa es obligatoria';
        if (!formValues.Dirpas) newErrors.Dirpas = 'La dirección del paseador es obligatoria';
        // La imagen solo es obligatoria si no estamos en modo de edición (es decir, si no hay un _id)
        if (!formValues.Imgepas && !paseador) newErrors.Imgepas = 'La foto del paseador es obligatoria';

        if (!formValues.Tarifa) newErrors.Tarifa = 'La tarifa es obligatoria';
        if (!formValues.Calpas) newErrors.Calpas = 'La calificación es obligatoria';
        if (formValues.Email && !validateEmail(formValues.Email)) {
            newErrors.Email = 'El correo electrónico no es válido';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };


    const handleFileChange = (e) => {
        const file = e.target.files[0];

        // Validar el tipo de archivo
        if (file && !['image/png', 'image/jpeg'].includes(file.type)) {
            setErrors(prevErrors => ({
                ...prevErrors,
                Imgepas: 'Solo se permiten imágenes PNG o JPEG'
            }));
        } else {
            setErrors(prevErrors => {
                const { Imgepas, ...rest } = prevErrors;  // Eliminar error de imagen si existe
                return rest;
            });
            // Configura la vista previa de la imagen
            setPreviewImage(URL.createObjectURL(file));
            // Mostrar el loader
            setIsUploading(true);

            // Crear un objeto FormData
            const formData = new FormData();
            formData.append('image', file);  // 'image' es el nombre del campo que espera ImgBB

            // Hacer la solicitud POST a ImgBB
            axios.post('https://api.imgbb.com/1/upload?key=23b4fc83fc9fd249f8214e2d69dea34b', formData)
                .then(response => {
                    console.log('Imagen subida con éxito:', response.data.data.url);
                    // Cuando la imagen se sube con éxito, obtener la URL de la respuesta
                    const imageUrl = response.data.data.url;

                    // Guardar la URL en el campo Imgepas
                    setFormValues(prevFormValues => ({
                        ...prevFormValues,
                        Imgepas: imageUrl
                    }));
                })
                .catch(error => {
                    console.error('Error al subir la imagen:', error);
                    setErrors(prevErrors => ({
                        ...prevErrors,
                        Imgepas: 'Hubo un error al subir la imagen'
                    }));
                })
                .finally(() => {
                    // Ocultar el loader después de que termine el proceso
                    setIsUploading(false);
                });
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Formulario enviado', formValues);
        if (validateForm()) {
            console.log('Formulario válido, llamando a crearPaseador');
            handleSavePaseador(formValues);
        } else {
            console.log('Errores en el formulario', errors);
        }
    };
    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return regex.test(email);
    };

    const crearPaseador = async (data) => {
        setLoading(true);
        try {
            const payload = { info: { ...data } };
            const rta = await iAX.post("http://localhost:3001/api/insPas", payload);

            // Verificar la respuesta de la API
            console.log('Respuesta de la API:', rta);

            alert('Paseador guardado con éxito');
            onClose();
        } catch (error) {
            // Log el error completo
            console.error('Error al guardar el paseador:', error);

            // Mostrar un mensaje más informativo
            alert(`Hubo un error al guardar el paseador: ${error.response ? error.response.data.message : error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Función para actualizar paseador
    const updatePaseador = async (data) => {
        setLoading(true);
        try {
            const payload = { info: { ...data } };
            console.log('Payload:', payload);
            // Llamar a la URL de actualización (POST a /user/updUser/)
            const rta = await iAX.post("http://localhost:3001/api/updPas/", payload);

            // Verificar la respuesta de la API
            console.log('Respuesta de la API:', rta);

            alert('Paseador actualizado con éxito');
            onClose();
        } catch (error) {
            // Log el error completo
            console.error('Error al actualizar el paseador:', error);

            // Mostrar un mensaje más informativo
            alert(`Hubo un error al actualizar el paseador: ${error.response ? error.response.data.message : error.message}`);
        } finally {
            setLoading(false);
        }
    };



    const handleSavePaseador = (paseadorData) => {
        console.log('Guardando paseador:', paseadorData);

        // Verifica si el paseador tiene un ID (iid) para saber si es creación o actualización
        if (paseadorData._id) {
            updatePaseador(paseadorData);  // Si existe el iid, actualiza
        } else {
            crearPaseador(paseadorData);  // Si no existe el iid, crea uno nuevo
        }
    };

    // Limpiar el formulario y navegar
    const onClose = () => {
        setFormValues({
            nompas: '',
            Numide: '',
            Numcelpas: '',
            Email: '',
            Numcelemp: '',
            Diremp: '',
            Dirpas: '',
            Imgepas: null,
            Tarifa: '',
            Calpas: 1,
        });
        setErrors({});
        navigate('/Pages/PagPaseadores');
    };

    return (
        <Form onSubmit={handleSubmit}>
            <h2>{paseador ? "Actualizar Paseador" : "Crear Paseador"}</h2>

            <Form.Group as={Row} controlId="nompas">
                <Form.Label column sm="2">Nombre</Form.Label>
                <Col sm="6">
                    <Form.Control
                        type="text"
                        name="nompas"
                        value={formValues.nompas}
                        onChange={(e) => setFormValues({ ...formValues, nompas: e.target.value })}
                    />
                </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="Tipide">
                <Form.Label column sm="2">Tipo de Identificación</Form.Label>
                <Col sm="6">
                    <Form.Control
                        as="select"
                        name="Tipide"
                        value={formValues.Tipide}
                        onChange={handleChange}
                    >
                        <option value="CC">CC</option>
                        <option value="CE">CE</option>
                        <option value="TI">TI</option>
                    </Form.Control>
                </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="Numide">
                <Form.Label column sm="2">Número de Identificación</Form.Label>
                <Col sm="6">
                    <Form.Control
                        type="text"
                        name="Numide"
                        value={formValues.Numide}
                        onChange={handleChange}
                        maxLength="20"
                        isInvalid={!!errors.Numide}
                    />
                    <Form.Control.Feedback type="invalid">{errors.Numide}</Form.Control.Feedback>
                </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="Numcelpas">
                <Form.Label column sm="2">Teléfono de Contacto</Form.Label>
                <Col sm="6">
                    <Form.Control
                        type="text"
                        name="Numcelpas"
                        value={formValues.Numcelpas}
                        onChange={handleChange}
                        maxLength="20"
                        isInvalid={!!errors.Numcelpas}
                    />
                    <Form.Control.Feedback type="invalid">{errors.Numcelpas}</Form.Control.Feedback>
                </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="Email">
                <Form.Label column sm="2">Correo Electrónico</Form.Label>
                <Col sm="6">
                    <Form.Control
                        type="email"
                        name="Email"
                        value={formValues.Email}
                        //onChange={handleChange}
                        onChange={(e) => setFormValues({ ...formValues, Email: e.target.value })}
                        maxLength="50"
                        isInvalid={!!errors.Email}
                    />
                    <Form.Control.Feedback type="invalid">{errors.Email}</Form.Control.Feedback>
                </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formFile">
                <Form.Label column sm="2">
                    Foto del paseador
                </Form.Label>
                <Col sm="4">
                    <Form.Control type="file" accept="image/png, image/jpeg" onChange={handleFileChange} />
                    {isUploading && <Spinner animation="border" style={{ marginLeft: '10px' }} />}
                    {errors.Imgepas && <Alert variant="danger">{errors.Imgepas}</Alert>}
                </Col>

                {/* Imagen de vista previa */}
                {previewImage && (
                    <Col sm="6">
                        <Form.Label>Vista previa</Form.Label>
                        <div style={{ marginTop: '10px', border: '1px solid #ddd', padding: '10px', borderRadius: '5px', maxWidth: '220px' }}>
                            <img src={previewImage} alt="Vista previa de la imagen" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                        </div>
                    </Col>
                )}
            </Form.Group>

            <Form.Group as={Row} controlId="Dirpas">
                <Form.Label column sm="2">Dirección del Paseador</Form.Label>
                <Col sm="6">
                    <Form.Control
                        type="text"
                        name="Dirpas"
                        value={formValues.Dirpas}
                        onChange={handleChange}
                        maxLength="20"
                        isInvalid={!!errors.Dirpas}
                    />
                    <Form.Control.Feedback type="invalid">{errors.Dirpas}</Form.Control.Feedback>
                </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="Diremp">
                <Form.Label column sm="2">Dirección de la empresa</Form.Label>
                <Col sm="6">
                    <Form.Control
                        type="text"
                        name="Diremp"
                        value={formValues.Diremp}
                        onChange={handleChange}
                        maxLength="20"
                        isInvalid={!!errors.Diremp}
                    />
                    <Form.Control.Feedback type="invalid">{errors.Diremp}</Form.Control.Feedback>
                </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="Numcelemp">
                <Form.Label column sm="2">Celular de la empresa</Form.Label>
                <Col sm="6">
                    <Form.Control
                        type="text"
                        name="Numcelemp"
                        value={formValues.Numcelemp}
                        onChange={handleChange}
                        maxLength="20"
                        isInvalid={!!errors.Numcelemp}
                    />
                    <Form.Control.Feedback type="invalid">{errors.Numcelemp}</Form.Control.Feedback>
                </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="Tarifa">
                <Form.Label column sm="2">Tarifa por Hora</Form.Label>
                <Col sm="6">
                    <Form.Control
                        type="number"
                        name="Tarifa"
                        value={formValues.Tarifa}
                        onChange={handleChange}
                        min="0"
                        isInvalid={!!errors.Tarifa}
                    />
                    <Form.Control.Feedback type="invalid">{errors.Tarifa}</Form.Control.Feedback>
                </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="Calpas">
                <Form.Label column sm="2">Calificación</Form.Label>
                <Col sm="6">
                    <Form.Control
                        type="number"
                        name="Calpas"
                        value={formValues.Calpas}
                        onChange={handleChange}
                        min="1"
                        max="10"
                        isInvalid={!!errors.Calpas}
                    />
                    <Form.Control.Feedback type="invalid">{errors.Calpas}</Form.Control.Feedback>
                </Col>
            </Form.Group>

            <Row className="justify-content-center mt-4">
                <Col xs="auto">
                    <Button variant="primary" type="submit" className="me-2" disabled={loading}>
                        {paseador ? "Actualizar" : "Crear"} Paseador
                    </Button>

                    <Button variant="secondary" onClick={onClose} type="button">
                        Cancelar
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default PaseadorForm;
