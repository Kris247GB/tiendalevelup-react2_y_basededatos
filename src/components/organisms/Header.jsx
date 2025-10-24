import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { scroller } from 'react-scroll';
import { carrito, mostrarMensaje } from '../Atoms/Validaciones'; // ⬅️ importa carrito

const Header = () => {
  const [carritoCount, setCarritoCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const actualizarCarrito = () => {
 
      if (carrito && Array.isArray(carrito.items)) {
        const total = carrito.items.reduce((sum, item) => sum + (Number(item.cantidad) || 0), 0);
        setCarritoCount(total);
      } else {
        setCarritoCount(0);
      }
    };

    const verificarSesion = () => {
      const logged = sessionStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(logged);
    };

    actualizarCarrito();
    verificarSesion();

    const interval = setInterval(() => {
      actualizarCarrito();
      verificarSesion();
    }, 1000);

    return () => clearInterval(interval);
  }, [location]);

  const go = (anchor) => {
    const opts = { duration: 500, smooth: true, offset: -80 };
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => scroller.scrollTo(anchor, opts), 300);
    } else {
      scroller.scrollTo(anchor, opts);
    }
  };

  const handleCarritoClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      mostrarMensaje('Debes iniciar sesión para ver el carrito', 'error');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    }
  };

  const isAdmin = isLoggedIn && sessionStorage.getItem('isAdmin') === 'true';

  return (
    <header>
      <div className="logo">
        <h1>🎮 Level-Up Gamer</h1>
      </div>

      <nav>
        <ul>
          {/* Scroll interno */}
          <li><button className="linklike" onClick={() => go('inicio')}>Inicio</button></li>
          <li><button className="linklike" onClick={() => go('catalogo')}>Catálogo</button></li>
          <li><button className="linklike" onClick={() => go('comunidad')}>Comunidad</button></li>
          <li><button className="linklike" onClick={() => go('eventos')}>Eventos</button></li>
          <li><button className="linklike" onClick={() => go('contacto')}>Contacto</button></li>

          {/* Rutas reales */}
          {isLoggedIn ? (
            <li><RouterLink to="/perfil">Mi Perfil</RouterLink></li>
          ) : (
            <li><RouterLink to="/login">Login</RouterLink></li>
          )}

          {/* Enlace Admin (solo si es admin) */}
          {isAdmin && (
            <li><RouterLink to="/admin">Admin</RouterLink></li>
          )}

          <li>
            <RouterLink to="/carrito" onClick={handleCarritoClick}>
              🛒 Carrito (<span id="carrito-count">{carritoCount}</span>)
            </RouterLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
