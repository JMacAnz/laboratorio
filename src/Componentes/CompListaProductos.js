import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Table from 'react-bootstrap/Table';
import { setPag } from '../Reducers/reducers';
import { Pagination } from 'react-bootstrap';


export default function CompListaProductos() {
  const disp = useDispatch();
  const infoProductos = useSelector(state => state.lab2.infoProducto); // Obtén los productos del estado global 
  const pagAct = useSelector(state => state.lab2.pagAct);
  //console.log(infoProductos); // Mostrar los productos en la consola  

  var numRegPorPag = 5; // Definir el número máximo de personajes por página
  var ultReg = pagAct * numRegPorPag;
  var primerReg = ultReg - numRegPorPag;
  const regPorPag = infoProductos.slice(primerReg, ultReg);

  const paginar = (np) => {
    disp(setPag(np));
  };

  return (
    <>
      <div>
        <Table striped bordered hover className='w-75 m-auto' >
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Precio</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Imágenes</th>
            </tr>
          </thead>
          <tbody>
            {regPorPag.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.title}</td>
                <td>{product.price}</td>
                <td>{product.description}</td>
                <td>{product.category}</td>
                {/* <td>
                {product.image.map((image, index) => (
                  <img key={index} src={image} alt={product.title} width="50" />
                ))}
              </td> */}
                <td><img src={product.image} alt={product.title} width="50" /></td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Pagination className="d-flex justify-content-center mt-2">
          {/* Añadir los botones de paginación */}
          <Pagination.First onClick={() => paginar(1)} />
          <Pagination.Prev onClick={() => paginar(Math.max(pagAct - 1, 1))} />
          {/* <Pagination>{lstBtnPag}</Pagination> */}
          <Pagination.Next onClick={() => paginar(Math.min(pagAct + 1, Math.ceil(infoProductos.length / numRegPorPag)))} />
          <Pagination.Last onClick={() => paginar(Math.ceil(infoProductos.length / numRegPorPag))} />
        </Pagination>
      </div>

    </>
  )
}
