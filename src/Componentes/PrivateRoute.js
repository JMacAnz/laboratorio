import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();

  // Si no está autenticado, redirige a /login, si está autenticado, renderiza el componente
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
