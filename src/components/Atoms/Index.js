import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';
import App from './App';
import { carrito, gamification } from './utils/validaciones';

// Inicializar el carrito cuando la app se carga
carrito.init();

// Hacer disponibles globalmente para compatibilidad con componentes
if (typeof window !== 'undefined') {
  window.carrito = carrito;
  window.gamification = gamification;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);