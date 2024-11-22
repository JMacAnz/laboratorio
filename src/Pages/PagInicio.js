import React, { useEffect } from 'react';
import CompPaseo from "../Componentes/CompPaseo"; // 
import { iAX } from "../ConfigAXIOS"; 
import { useDispatch, useSelector } from "react-redux";
import { setInfoProductos } from "../Reducers/reducers";


export default function PagInicio() {
    const dispatch = useDispatch();
  // Obtener los productos del estado global (de la galería)
  const infoProductos = useSelector(state => state.lab2.infoProducto);
  // Llama a la API cuando el componente se monte
  useEffect(() => {
    async function getData() {
        try {
            const response = await iAX.get("https://fakestoreapi.com/products");
            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log("Data: ", response.data); // Mostrar los datos obtenidos de la API en consola
            dispatch(setInfoProductos(response.data)); // Actualiza el estado con los productos obtenidos
        } catch (error) {
            console.error("Error getting data:", error);
        }
    }
    getData();
}, [dispatch]);

  // Tomar los primeros 5 productos
  const productosInicio = infoProductos.slice(0, 4);

  return (
    <div className="inicio-container">
      <h1>Crea el paseo de hoy!</h1>
      <p>
        {/* Estos son algunos de nuestros productos más populares. ¡Descubre más en la galería! */}
      </p>

      <CompPaseo/>
    </div>
  );
}
