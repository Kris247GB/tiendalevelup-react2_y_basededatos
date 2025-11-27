import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { carrito, mostrarMensaje } from '../Atoms/Validaciones';
import { obtenerProductos } from '../../api/productos';  // <-- NUEVO

const Home = () => {
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');
  const [precioFiltro, setPrecioFiltro] = useState('todos');
  const [carritoCount, setCarritoCount] = useState(0);
  const [productos, setProductos] = useState([]);   // <-- NUEVO

  // Cargar productos desde el backend
  useEffect(() => {
    obtenerProductos()
      .then(data => {
        setProductos(data);
      })
      .catch(() => {
        console.error("Error cargando productos desde la API");
      });

    if (typeof carrito !== 'undefined' && carrito.items) {
      setCarritoCount(carrito.items.reduce((sum, item) => sum + item.cantidad, 0));
    }
  }, []);

  // Filtrado avanzado usando productos traídos del backend
  const filtrarProductos = () => {
    return productos.filter(producto => {
      // Filtro por búsqueda
      const coincideBusqueda = producto.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase());

      // Filtro por categoría
      const coincideCategoria =
        categoriaFiltro === "todas" || producto.categoria === categoriaFiltro;

      // Filtro por precio
      const coincidePrecio =
        precioFiltro === "todos" ||
        (precioFiltro === "bajo" && producto.precio < 50000) ||
        (precioFiltro === "medio" && producto.precio >= 50000 && producto.precio <= 200000) ||
        (precioFiltro === "alto" && producto.precio > 200000);

      return coincideBusqueda && coincideCategoria && coincidePrecio;
    });
  };

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

      {/* CATÁLOGO */}
      <section id="catalogo">
        <h2>Nuestros Productos</h2>

        {/* FILTROS */}
        <div className="filtros-container" style={{
          maxWidth: '1200px',
          margin: '0 auto 2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          padding: '0 2rem'
        }}>
          <div>
            <label style={{ color: '#D3D3D3', marginBottom: '0.5rem', fontWeight: 600 }}>
              🔍 Buscar productos
            </label>
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{
                width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #222',
                background: '#1a1a1a', color: '#fff'
              }}
            />
          </div>

          {/* CATEGORÍA */}
          <div>
            <label style={{ color: '#D3D3D3', marginBottom: '0.5rem', fontWeight: 600 }}>
              📦 Categoría
            </label>
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              style={{
                width: '100%', padding: '0.8rem', borderRadius: '8px', background: '#1a1a1a',
                color: '#fff', border: '1px solid #222'
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

          {/* PRECIO */}
          <div>
            <label style={{ color: '#D3D3D3', marginBottom: '0.5rem', fontWeight: 600 }}>
              💰 Rango de precio
            </label>
            <select
              value={precioFiltro}
              onChange={(e) => setPrecioFiltro(e.target.value)}
              style={{
                width: '100%', padding: '0.8rem', borderRadius: '8px', background: '#1a1a1a',
                color: '#fff', border: '1px solid #222'
              }}
            >
              <option value="todos">Todos los precios</option>
              <option value="bajo">Menos de $50.000</option>
              <option value="medio">$50.000 - $200.000</option>
              <option value="alto">Más de $200.000</option>
            </select>
          </div>
        </div>

        {/* LISTA DE PRODUCTOS */}
        <div className="productos">
          {filtrarProductos().map(producto => (
            <article
              key={producto.id}
              className="producto"
              data-categoria={producto.categoria}
              data-precio={producto.precio}
            >
              <img src={producto.imagen} alt={producto.nombre} />
              <h3>{producto.nombre}</h3>
              <p className="precio">{formatearPrecio(producto.precio)}</p>
              <p className="descripcion">{producto.descripcion}</p>

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

      {/* Aquí continúa TU sección comunidad, eventos y contacto sin cambios */}
      {/* ... */}
    </main>
  );
};

export default Home;
