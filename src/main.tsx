import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('No se encontró el elemento #root en el documento.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
