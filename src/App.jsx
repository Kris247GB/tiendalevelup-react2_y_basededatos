import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

import Footer from './components/organisms/Footer';
import Registro from './components/page/Registro';
import Home from './components/page/Home';
import Login from './components/page/Login';
import Header from './components/organisms/Header';
import Carrito from './components/page/Carrito';
import Perfil from './components/page/Perfil';
import Play from './components/page/Play';


function App() {
  return (
    <Router>
      <div className="App">
        <Header/>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/carrito" element={<Carrito/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/perfil" element={<Perfil/>} />
          <Route path="/registro" element={<Registro/>} />
          <Route path="/detalles" element={<Play/>} />
          <Route path="/detalles" element={<Perfil/>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;