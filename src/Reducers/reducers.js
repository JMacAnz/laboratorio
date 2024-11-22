import { createSlice } from "@reduxjs/toolkit";

const estadoIni = {
    ver: false,
    infoProducto: [],
    producto: [],  // Agregar la lista de episodios
    pagAct: 1,
    token: '',
    infoDue:[],
    infoUsuario: [],
    infoPaseadores: [],  // Agregar la lista de paseadores
    infoMasc: [],  // Agregar la lista de mascotas
    infoPase: [],  // Agregar la lista de paseos
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
        },
        setToken: (state,action) => {
            state.token = action.payload ;
        },
        setInfoDue: (state,action) => {
            state.infoDue = action.payload ;
        },
        setInfoUsuario: (state,action) => {
            state.infoUsuario = action.payload ;
        },
        setInfoPaseadores: (state,action) => {
            state.infoPaseadores = action.payload ;
        },
        setInfoMasc: (state,action) => {
            state.infoMasc = action.payload ;
        },
        setInfoPase: (state,action) => {
            state.infoPase = action.payload ;
        }
    }
} ) ;

export const {setVER, setInfoProductos, setProductos, setPag, setToken, setInfoDue, setInfoUsuario, setInfoPaseadores, setInfoMasc, setInfoPase} = reducers.actions ;
export default reducers.reducer ;