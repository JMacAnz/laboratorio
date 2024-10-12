import './App.css';
import { BrowserRouter, Routes, Route } from'react-router-dom';
import Menu from './Pages/Menu';
import PagInicio from './Pages/PagInicio';
import PagGaleria from './Pages/PagGaleria';
import PagContato from './Pages/PagContato';
import CompFooter from './Componentes/CompFooter';
import PagProducto from './Pages/PagProducto';
import PadTblProducto from './Pages/PadTblProducto';


//api https://fakestoreapi.com/products

function PagPrincipal() {
  return (
    <>
      <BrowserRouter>
        <Menu />
        <hr />
        <Routes>
          <Route path="/" element={<PagInicio />} />
          <Route path="/Inic" element={<PagInicio />} />
          <Route path="/Gal" element={<PagGaleria />} />
          <Route path="/Ctt" element={<PagContato />} />
          <Route path="/Prt"    element={<PagProducto />} />
          <Route path="/TblPrt" element={<PadTblProducto />} />
          {/* <Route path="*" element={<PagNF />} /> */}
        </Routes>
        <hr />
        <CompFooter />
      </BrowserRouter>
    </>
  );
}

export default PagPrincipal;
