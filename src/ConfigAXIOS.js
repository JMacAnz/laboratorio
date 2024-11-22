import axios from "axios";

const iAX = axios.create({
    baseURL: "https://rickandmortyapi.com/api",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    }
});

// Interceptor para las solicitudes (Request)
iAX.interceptors.request.use(
    config => {
        // Obtener el token de acceso del localStorage
        const accessToken = localStorage.getItem('auth_token');
        console.log("Token de acceso:", accessToken);
        // Si hay un token de acceso, agregarlo a las cabeceras
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        // También podrías agregar otros encabezados aquí si es necesario
        // config.headers["Custom-Header"] = "value";

        return config; // Asegúrate de retornar la configuración modificada
    },
    error => {
        // Si ocurre algún error antes de que la solicitud se realice
        return Promise.reject(error);
    }
);

// Interceptor para las respuestas (Response)
iAX.interceptors.response.use(
    response => response, // Si la respuesta es exitosa, se pasa como está
    async (error) => {
        if (error.response && error.response.status === 401) {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const response = await iAX.post('http://localhost:3001/user/refresh-token', { refreshToken });
                    const { accessToken, refreshToken: newRefreshToken } = response.data;
                    localStorage.setItem('accessToken', accessToken);
                    if (newRefreshToken) {
                        localStorage.setItem('refreshToken', newRefreshToken);
                    }
                    error.config.headers['Authorization'] = `Bearer ${accessToken}`;
                    return iAX(error.config); // Reintentar la solicitud original con el nuevo token
                } catch (err) {
                    console.error("No se pudo renovar el token:", err);
                    // Si no se pudo renovar el token, redirigir al login
                }
            }
        }
        return Promise.reject(error);
    }
);

export { iAX };
