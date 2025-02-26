import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './Reducers/store';
import './index.css';
import PagPrincipal from './PagPrincipal';
import 'bootstrap/dist/css/bootstrap.min.css' 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <PagPrincipal />
  </Provider>
);


