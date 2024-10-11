import { configureStore } from "@reduxjs/toolkit";
import reducers from "./reducers";

const store = configureStore( {
    reducer: {
        lab2: reducers
    }
} ) ;

export default store ;