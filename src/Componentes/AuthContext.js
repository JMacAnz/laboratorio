import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken } from "../Reducers/reducers"; 
import { iAX } from "../ConfigAXIOS"; 

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Valor inicial que se obtiene de localStorage directamente
    const token = localStorage.getItem('auth_token');
    const refreshToken = localStorage.getItem('refreshToken');
    return token && refreshToken ? true : false;
  });

  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const disp = useDispatch();

  useEffect(() => {
    // Este useEffect asegura que el estado de autenticación se revisa cada vez que se monta el componente
    const token = localStorage.getItem('auth_token');
    const refreshToken = localStorage.getItem('refreshToken');
    console.log('token en localStorage:', token);
    console.log('refreshToken en localStorage:', refreshToken);

    if (token && refreshToken) {
      setIsAuthenticated(true);
      console.log('Tokens encontrados, usuario autenticado');
    } else {
      setIsAuthenticated(false);
      console.log('No se encontraron tokens, usuario no autenticado');
    }
  }, []); // Solo se ejecuta al montarse el componente

  // Logear al usuario, guardar los tokens y redirigir
  const login = (token, refreshToken) => {
    console.log('Iniciando sesión');
    localStorage.setItem('auth_token', token); // Guardamos el token
    localStorage.setItem('refreshToken', refreshToken); // Guardamos el refresh token
    setIsAuthenticated(true);
    console.log('Tokens guardados, redirigiendo...');
    navigate('/'); // Redirigimos a la página principal o al dashboard
  };

  // Cerrar sesión, limpiar los tokens y redirigir al login
  const logout = () => {
    console.log('Cerrando sesión');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    disp(setToken(null)); // Limpiar Redux
    setUser(null); // Limpiar datos del usuario
    navigate('/login'); // Redirigir al login
  };

  const refreshToken = async () => {
    const refreshTokenFromStorage = localStorage.getItem('refreshToken');
    console.log('refreshToken recuperado para refrescar:', refreshTokenFromStorage);

    if (refreshTokenFromStorage) {
      try {
        const response = await iAX.post('http://127.0.0.1:3001/user/refresh-token', {
          refreshToken: refreshTokenFromStorage,
        });

        if (response.status === 200 && response.data.msg === 'OK') {
          const newAccessToken = response.data.info.accessToken;
          localStorage.setItem('auth_token', newAccessToken); // Guardar el nuevo token
          disp(setToken(newAccessToken)); // Actualizar el token en Redux
          console.log('Nuevo token de acceso recibido:', newAccessToken);
          return newAccessToken;
        }
      } catch (error) {
        console.error("Error al refrescar el token", error);
        logout(); // Si falla el refresh token, cerrar sesión
      }
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
