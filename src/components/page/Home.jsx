
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import {carrito, mostrarMensaje} from '../Atoms/Validaciones';
import { getAllProducts } from '../../data/store';
const Home = () => {
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');
  const [precioFiltro, setPrecioFiltro] = useState('todos');
  const [carritoCount, setCarritoCount] = useState(0);

  useEffect(() => {
  
    if (typeof carrito !== 'undefined' && carrito.items) {
      setCarritoCount(carrito.items.reduce((sum, item) => sum + item.cantidad, 0));
    }
  }, []);

  
  const filtrarProductos = () => getAllProducts({ q: busqueda, category: categoriaFiltro, priceRange: precioFiltro });

  const agregarAlCarrito = (producto) => {
    if (typeof carrito !== 'undefined' && typeof carrito.agregar === 'function') {
      carrito.agregar(producto);
      setCarritoCount(carrito.items.reduce((sum, item) => sum + item.cantidad, 0));
      if (typeof mostrarMensaje === 'function') {
        mostrarMensaje('Producto agregado al carrito', 'success');
      }
    }
  };

  const formatearPrecio = (precio) => {
    return `$${precio.toLocaleString('es-CL')} CLP`;
  };

  return (
    <main>
     
      <section id="inicio">
        <h2>Bienvenido a Level-Up Gamer</h2>
        <p>Tu tienda online gamer en Chile 🚀</p>
        <p style={{ color: '#39FF14', marginTop: '1rem' }}>
          ¡Gana puntos LevelUp con cada compra y desbloquea descuentos exclusivos!
        </p>
      </section>

     
      <section id="catalogo">
        <h2>Nuestros Productos</h2>
        
       
        <div className="filtros-container" style={{
          maxWidth: '1200px',
          margin: '0 auto 2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          padding: '0 2rem'
        }}>
          
          
          <div>
            <label htmlFor="busqueda" style={{
              display: 'block',
              color: '#D3D3D3',
              marginBottom: '0.5rem',
              fontWeight: 600
            }}>
              🔍 Buscar productos
            </label>
            <input 
              type="text" 
              id="busqueda" 
              placeholder="Buscar por nombre..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '8px',
                border: '1px solid #222',
                background: '#1a1a1a',
                color: '#fff',
                fontSize: '1rem'
              }}
            />
          </div>

          
          <div>
            <label htmlFor="filtro-categoria" style={{
              display: 'block',
              color: '#D3D3D3',
              marginBottom: '0.5rem',
              fontWeight: 600
            }}>
              📦 Categoría
            </label>
            <select 
              id="filtro-categoria" 
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '8px',
                border: '1px solid #222',
                background: '#1a1a1a',
                color: '#fff',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              <option value="todas">Todas las categorías</option>
              <option value="juegos-mesa">Juegos de Mesa</option>
              <option value="accesorios">Accesorios</option>
              <option value="consolas">Consolas</option>
              <option value="computadores">Computadores Gamers</option>
              <option value="sillas">Sillas Gamers</option>
              <option value="mouse">Mouse</option>
              <option value="mousepad">Mousepad</option>
              <option value="poleras">Poleras Personalizadas</option>
              <option value="polerones">Polerones Gamers</option>
            </select>
          </div>

          {/* Filtro por precio */}
          <div>
            <label htmlFor="filtro-precio" style={{
              display: 'block',
              color: '#D3D3D3',
              marginBottom: '0.5rem',
              fontWeight: 600
            }}>
              💰 Rango de precio
            </label>
            <select 
              id="filtro-precio" 
              value={precioFiltro}
              onChange={(e) => setPrecioFiltro(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '8px',
                border: '1px solid #222',
                background: '#1a1a1a',
                color: '#fff',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              <option value="todos">Todos los precios</option>
              <option value="bajo">Menos de $50.000</option>
              <option value="medio">$50.000 - $200.000</option>
              <option value="alto">Más de $200.000</option>
            </select>
          </div>
        </div>

       
        <div className="productos">
          {filtrarProductos().map(producto => (
            <article 
              key={producto.codigo}
              className="producto" 
              data-categoria={producto.categoria} 
              data-precio={producto.precio} 
              data-codigo={producto.codigo}
            >
              <img src={producto.imagen} alt={producto.nombre} />
              <h3>{producto.nombre}</h3>
              <p className="precio">{formatearPrecio(producto.precio)}</p>
              <p className="descripcion">{producto.descripcion}</p>
              {producto.detalles && (
                <Link to="/play" className="btn-detalles">Ver detalles</Link>
              )}
              <button 
                className="btn-agregar"
                onClick={() => agregarAlCarrito(producto)}
              >
                Agregar al carrito
              </button>
            </article>
          ))}
        </div>
      </section>

      
      <section id="comunidad">
        <h2>Comunidad Gamer</h2>
        <p>Explora artículos, noticias y consejos para mejorar tu experiencia de juego.</p>
        
        <div style={{ maxWidth: '800px', margin: '2rem auto', textAlign: 'left', padding: '0 2rem' }}>
          <h3 style={{ color: '#39FF14', marginBottom: '1rem' }}>Últimas Noticias</h3>
          <div style={{
            background: '#111',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '1rem',
            borderLeft: '4px solid #1E90FF'
          }}>
            <h4 style={{ color: '#1E90FF', marginBottom: '0.5rem' }}>🎮 Próximos Lanzamientos 2025</h4>
            <p style={{ color: '#D3D3D3' }}>
              Descubre los juegos más esperados del año y prepárate para las mejores experiencias gaming.
            </p>
          </div>
          
          <div style={{
            background: '#111',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '1rem',
            borderLeft: '4px solid #39FF14'
          }}>
            <h4 style={{ color: '#39FF14', marginBottom: '0.5rem' }}>🏆 Consejos para Mejorar tu Setup</h4>
            <p style={{ color: '#D3D3D3' }}>
              Optimiza tu estación de juego con nuestras recomendaciones de expertos.
            </p>
          </div>
        </div>
      </section>

      {/* SECCIÓN EVENTOS */}
      <section id="eventos">
        <h2>Eventos Gamer en Chile</h2>
        <p style={{ marginBottom: '2rem' }}>¡Participa en eventos y gana puntos LevelUp!</p>
        
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            background: '#111',
            padding: '2rem',
            borderRadius: '16px',
            border: '1px solid #222'
          }}>
            <h3 style={{ color: '#1E90FF', marginBottom: '1.5rem' }}>📍 Próximos Eventos</h3>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{
                background: '#1a1a1a',
                padding: '1.5rem',
                borderRadius: '12px',
                borderLeft: '4px solid #1E90FF'
              }}>
                <h4 style={{ color: '#39FF14', marginBottom: '0.5rem' }}>🎮 Chile Gaming Expo 2025</h4>
                <p style={{ color: '#D3D3D3', margin: '0.5rem 0' }}>
                  <strong>Fecha:</strong> 15-17 Noviembre 2025
                </p>
                <p style={{ color: '#D3D3D3', margin: '0.5rem 0' }}>
                  <strong>Lugar:</strong> Centro de Eventos Movistar Arena, Santiago
                </p>
                <p style={{ color: '#D3D3D3', margin: '0.5rem 0' }}>
                  <strong>Puntos:</strong> 200 LevelUp por asistencia
                </p>
              </div>

              <div style={{
                background: '#1a1a1a',
                padding: '1.5rem',
                borderRadius: '12px',
                borderLeft: '4px solid #39FF14'
              }}>
                <h4 style={{ color: '#39FF14', marginBottom: '0.5rem' }}>🏆 Torneo League of Legends Regional</h4>
                <p style={{ color: '#D3D3D3', margin: '0.5rem 0' }}>
                  <strong>Fecha:</strong> 5 Diciembre 2025
                </p>
                <p style={{ color: '#D3D3D3', margin: '0.5rem 0' }}>
                  <strong>Lugar:</strong> Centro Cultural Gabriela Mistral, Santiago
                </p>
                <p style={{ color: '#D3D3D3', margin: '0.5rem 0' }}>
                  <strong>Puntos:</strong> 300 LevelUp por participación
                </p>
              </div>

              <div style={{
                background: '#1a1a1a',
                padding: '1.5rem',
                borderRadius: '12px',
                borderLeft: '4px solid #1E90FF'
              }}>
                <h4 style={{ color: '#39FF14', marginBottom: '0.5rem' }}>🎯 Meetup Gamers Valparaíso</h4>
                <p style={{ color: '#D3D3D3', margin: '0.5rem 0' }}>
                  <strong>Fecha:</strong> 20 Diciembre 2025
                </p>
                <p style={{ color: '#D3D3D3', margin: '0.5rem 0' }}>
                  <strong>Lugar:</strong> Puerto Valparaíso
                </p>
                <p style={{ color: '#D3D3D3', margin: '0.5rem 0' }}>
                  <strong>Puntos:</strong> 150 LevelUp por asistencia
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    
      <section id="contacto">
        <h2>Contacto</h2>
        <p>¿Necesitas ayuda? Estamos aquí para ti.</p>
        
        <div style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'left', padding: '0 2rem' }}>
          <div style={{
            background: '#111',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid #222'
          }}>
            <p style={{ marginBottom: '1rem' }}>
              📧 Email: <a href="mailto:soporte@levelupgamer.cl" style={{ color: '#1E90FF' }}>
                soporte@levelupgamer.cl
              </a>
            </p>
            <p style={{ marginBottom: '1rem' }}>
              📱 WhatsApp: <a href="https://wa.me/56912345678" target="_blank" rel="noopener noreferrer" style={{ color: '#39FF14' }}>
                +56 9 1234 5678
              </a>
            </p>
            <p style={{ marginBottom: '1rem' }}>
              🕐 Horario de atención: Lunes a Viernes, 9:00 - 18:00 hrs
            </p>
            
            <a 
              href="https://wa.me/56912345678" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: '#25D366',
                color: 'white',
                padding: '0.8rem 1.5rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                marginTop: '1rem'
              }}
            >
              💬 Chat con Soporte Técnico
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;