import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <p>&copy; 2025 Level-Up Gamer – Despachos a todo Chile</p>
        <nav className="footer-nav">
          <Link to="/#inicio">Inicio</Link> ·
          <Link to="/#catalogo">Catálogo</Link> ·
          <Link to="/#comunidad">Comunidad</Link> ·
          <Link to="/#eventos">Eventos</Link> ·
          <Link to="/#contacto">Contacto</Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;