import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from './AuthContext';  // Importa el hook de autenticación
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap'; 
import { useDispatch, useSelector } from 'react-redux'; 
import { setToken, setInfoUsuario } from "../Reducers/reducers"; 
import { iAX } from "../ConfigAXIOS"; 

const Login = () => {
    const infoUsuario = useSelector(state => state.lab2.infoUsuario);
    console.log(infoUsuario);  // Verifica que esté llegando correctamente
        
    const [message, setMessage] = useState("");
    const { login } = useAuth();  // Accede a la función de login del AuthContext
    const disp = useDispatch(); 
    const navigate = useNavigate(); 

    const [formValues, setFormValues] = useState({
        usuario: "",
        password: ""
    });

    const [error, setError] = useState(''); 
    const [isLogin, setIsLogin] = useState(true); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    // Función para obtener el token (login)
    async function getToken(e) {
        e.preventDefault(); 
        try {
            const infoUsuarioForm = {
                usuario: formValues.usuario,
                password: formValues.password,
            };
    
            const rta = await iAX.post("http://127.0.0.1:3001/user/login/", {
                usuario: formValues.usuario,
                password: formValues.password,
            });
    
            console.log("Respuesta de login:", rta.data);
    
            if (rta.status === 200 && rta.data.msg === "OK" && rta.data.info) {
                const { accessToken, refreshToken } = rta.data.info;
    
                // Guardamos los tokens en el Redux y localStorage
                disp(setToken(accessToken)); 
                disp(setInfoUsuario(infoUsuarioForm)); 
    
                setMessage("Login exitoso. Token recibido.");
                
                // Realizamos el login con los tokens
                login(accessToken, refreshToken);  
    
                navigate('/Inic');  // Redirige a la página de inicio
            } else {
                setMessage(rta.data.info || "Error en la autenticación.");
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setMessage("Credenciales inválidas. Por favor, verifica tu usuario y contraseña.");
            } else {
                console.error("ERROR:", error.message);
                setMessage("Error al iniciar sesión: " + error.message);
            }            
        }
    }
    

    // Función para crear el usuario
    async function crearUser(e) {
        e.preventDefault();
    
        if (!formValues.usuario || !formValues.password) {
            setMessage("ERR: Todos los campos son obligatorios.");
            return;
        }

        try {
            const rta = await iAX.post("http://127.0.0.1:3001/user/insUser", { info: formValues });

            if (rta.status === 200) {
                setMessage("Usuario creado exitosamente.");
                setFormValues({ usuario: "", password: "" });

                setTimeout(() => {
                    setIsLogin(true);
                    navigate('/login');
                }, 1000);
            } else if (rta.status === 400 || rta.message === "Request failed with status code 400") {
                setMessage("ERR: El nombre de usuario ya está en uso.");
            } else {
                setMessage("ERR: No se pudo crear el usuario");
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setMessage("El nombre de usuario ya está en uso.");
            } else {
                console.error("ERROR:", error.message);
                setMessage("Error al crear la cuenta: " + error.message);
            }
        }
    }

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
            <Row className="w-100">
                <Col md={6} lg={4} className="mx-auto">
                    <Card>
                        <Card.Body>
                            <h2 className="text-center mb-4">{isLogin ? "Iniciar sesión" : "Crear cuenta"}</h2>

                            <Form onSubmit={isLogin ? getToken : crearUser}>
                                <Form.Group controlId="formUser" className="mb-3">
                                    <Form.Label>Usuario</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="usuario"
                                        placeholder="Introduce tu usuario"
                                        value={formValues.usuario}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group controlId="formPassword" className="mb-3">
                                    <Form.Label>Contraseña</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        placeholder="Introduce tu contraseña"
                                        value={formValues.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                {message && <div className="mb-3">{message}</div>} 

                                <Button variant="primary" type="submit" className="w-100">
                                    {isLogin ? "Iniciar sesión" : "Crear cuenta"}
                                </Button>
                            </Form>

                            <div className="text-center mt-3">
                                <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
                                    {isLogin ? "¿No tienes cuenta? Regístrate aquí" : "¿Ya tienes cuenta? Inicia sesión"}
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
