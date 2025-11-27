import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import carritoReal from '../Atoms/carritoReal';
import { gamification, mostrarMensaje } from '../Atoms/Validaciones';
import { scroller } from 'react-scroll';

const Carrito = () => {
  const [items, setItems] = useState([]);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      mostrarMensaje('Debes iniciar sesión para ver el carrito', 'error');
      navigate('/login');
      return;
    }

    const user = JSON.parse(sessionStorage.getItem('userData') || '{}');
    setUserData(user);

    setItems(carritoReal.obtenerCarrito());
  }, [navigate]);

  const handleEliminar = (codigo) => {
    setItems(carritoReal.eliminar(codigo));
    mostrarMensaje('Producto eliminado del carrito', 'success');
  };

  const handleCantidad = (codigo, cantidad) => {
    setItems(carritoReal.modificarCantidad(codigo, Number(cantidad)));
  };

  const handleVaciar = () => {
    if (window.confirm('¿Estás seguro de vaciar el carrito?')) {
      carritoReal.vaciar();
      setItems([]);
      mostrarMensaje('Carrito vaciado', 'success');
    }
  };

  const handleComprar = () => {
    if (items.length === 0) {
      mostrarMensaje('El carrito está vacío', 'error');
      return;
    }

    const subtotal = carritoReal.calcularTotal();
    const descuentoDuoc = userData?.descuentoDuoc || 0;
    const descuentoLevel = gamification.getUserLevel(userData?.levelUpPoints || 0)?.discount || 0;

    // Aplicar descuentos combinados
    const totalConNivel = subtotal * (1 - descuentoLevel / 100);
    const totalFinal = totalConNivel * (1 - descuentoDuoc / 100);

    const puntosGanados = Math.floor(totalFinal / 1000);

    if (userData) {
      gamification.addPoints(userData.email, puntosGanados);
    }

    mostrarMensaje(`¡Compra realizada! Ganaste ${puntosGanados} puntos Level-Up`, 'success');
    carritoReal.vaciar();
    setItems([]);

    setTimeout(() => {
      navigate('/perfil');
    }, 2000);
  };

  const continuarComprando = () => {
    navigate('/');
    setTimeout(() => {
      scroller.scrollTo('catalogo', { duration: 500, smooth: true, offset: -100 });
    }, 300);
  };

  const subtotal = carritoReal.calcularTotal();
  const descuentoLevel = userData ? gamification.getUserLevel(userData.levelUpPoints || 0)?.discount : 0;
  const descuentoDuoc = userData?.descuentoDuoc || 0;
  const totalConDescuento = subtotal * (1 - descuentoLevel / 100) * (1 - descuentoDuoc / 100);
  const descuento = subtotal - totalConDescuento;

  return (
    <main className="wrap" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <section>
        <h2>🛒 Mi Carrito de Compras</h2>

        {userData && (
          <div
            style={{
              background: 'rgba(57, 255, 20, 0.1)',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '2rem',
              border: '1px solid #39FF14',
            }}
          >
            <p><strong>Nivel:</strong> {gamification.getUserLevel(userData.levelUpPoints || 0)?.name}</p>
            <p><strong>Descuento por nivel:</strong> {descuentoLevel}%</p>
            {userData.descuentoDuoc > 0 && (
              <p><strong>Descuento DUOC:</strong> {descuentoDuoc}%</p>
            )}
          </div>
        )}

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
              Tu carrito está vacío
            </p>
            <button className="btn" onClick={continuarComprando}>
              Ir a comprar
            </button>
          </div>
        ) : (
          <>
            <div className="carrito-items">
              {items.map((item) => (
                <div
                  key={item.codigo}
                  className="carrito-item"
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '1rem',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    alignItems: 'center',
                  }}
                >
                  {item.imagen && (
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <h3>{item.nombre}</h3>
                    <p>Precio: ${item.precio.toLocaleString('es-CL')}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <label>Cantidad:</label>
                    <input
                      type="number"
                      min="1"
                      value={item.cantidad}
                      onChange={(e) => handleCantidad(item.codigo, e.target.value)}
                      style={{ width: '60px', padding: '0.5rem' }}
                    />
                  </div>
                  <p style={{ fontWeight: 'bold' }}>
                    ${(item.precio * item.cantidad).toLocaleString('es-CL')}
                  </p>
                  <button className="btn btn-danger" onClick={() => handleEliminar(item.codigo)}>
                    🗑️ Eliminar
                  </button>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: '2rem',
                padding: '2rem',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
              }}
            >
              <h3>Resumen de compra</h3>
              <p>Subtotal: ${subtotal.toLocaleString('es-CL')}</p>

              {descuento > 0 && (
                <p style={{ color: '#39FF14' }}>
                  Descuento total: -${descuento.toLocaleString('es-CL')}
                </p>
              )}

              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#39FF14' }}>
                Total: ${totalConDescuento.toLocaleString('es-CL')}
              </p>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                <button className="btn" onClick={handleComprar}>
                  💳 Finalizar Compra
                </button>
                <button className="btn btn-secondary" onClick={handleVaciar}>
                  🗑️ Vaciar Carrito
                </button>
                <button className="btn btn-secondary" onClick={continuarComprando}>
                  ← Seguir comprando
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default Carrito;
