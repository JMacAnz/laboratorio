import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './Componentes/AuthContext';
import Menu from './Pages/Menu';
import PagInicio from './Pages/PagInicio';
import PagContato from './Pages/PagContato';
import CompFooter from './Componentes/CompFooter';
import Login from './Pages/LoginPage';
import PrivateRoute from './Componentes/PrivateRoute';
import PagPaseadores from './Pages/PagPaseadores';
import PagPaseadorForm from './Pages/PagPaseadorForm';
import PagDuenos from './Pages/PagDuenos';
import PagMascota from './Pages/PagMascota';
import PagPaseo from './Pages/PagPaseo';

function PagPrincipal() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App">
          <Menu />
          <div className="main-content">
            <hr />
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/Log" element={<Login />} />
              <Route path="/Ctt" element={<PagContato />} />

              {/* Rutas protegidas */}
              <Route path="/Inic" element={<PrivateRoute><PagInicio /></PrivateRoute>} />
              <Route path="/Duen" element={<PrivateRoute><PagDuenos /></PrivateRoute>} />
              <Route path="/Masc" element={<PrivateRoute><PagMascota /></PrivateRoute>} />
              <Route path="/Pas" element={<PrivateRoute><PagPaseadores /></PrivateRoute>} />
              <Route path="/Pase" element={<PrivateRoute><PagPaseo /></PrivateRoute>} />

              <Route path="/Pages/PagPaseadores" element={<PagPaseadores />} />
              <Route path="/Pages/PaseadorForm" element={<PagPaseadorForm />} />
              
              {/* Redirigir a página de inicio si la ruta no existe */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <hr />
          </div>
          <CompFooter />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default PagPrincipal;
