import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Footer from './components/organisms/Footer';
import Registro from './components/page/Registro';
import Home from './components/page/Home';
import Login from './components/page/Login';
import Header from './components/organisms/Header';
import Carrito from './components/page/Carrito';
import Perfil from './components/page/Perfil';
import Detalles from './components/page/Detalles';
import AdminPanel from './components/admin/AdminPanel';
import Comunidad from "./components/page/Comunidad";
import Eventos from './components/page/Eventos';
import Contacto from "./components/page/Contacto";

// Protectores
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute"; // <-- NUEVO

function App() {
  return (
    <Router>
      <div className="App">
        <Header />

        <Routes>

          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/comunidad" element={<Comunidad />} />
          <Route path="/detalles/:id" element={<Detalles />} />

          {/* Rutas privadas (requiere estar logueado) */}
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            }
          />

          <Route
            path="/carrito"
            element={
              <ProtectedRoute>
                <Carrito />
              </ProtectedRoute>
            }
          />

          {/* RUTA SOLO PARA ADMIN */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />

        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
