import { createSlice } from "@reduxjs/toolkit";

const estadoIni = {
    ver: false,
    infoProducto: [],
    producto: [],  // Agregar la lista de episodios
    pagAct: 1
} ;

const reducers = createSlice( {
    name: 'lab2',
    initialState: estadoIni,
    reducers: {
        setVER: (state,action) => {
            state.ver = action.payload ;
        },
        setInfoProductos: (state,action) => {
            state.infoProducto=action.payload;
        },
        setProductos: (state,action) => {
            state.producto.producto = action.payload;
        },
        setPag: (state,action) => {
            state.pagAct = action.payload ;
        }
    }
} ) ;

export const {setVER, setInfoProductos, setProductos, setPag} = reducers.actions ;
export default reducers.reducer ;