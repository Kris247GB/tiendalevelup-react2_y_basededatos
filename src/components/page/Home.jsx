import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// ❌ eliminar carrito viejo
// import { carrito, mostrarMensaje } from '../Atoms/Validaciones';

// ✔ usar carritoReal
import { agregar, obtenerCarritoReal } from '../Atoms/carritoReal';
import { mostrarMensaje } from '../Atoms/Validaciones';

import { obtenerProductos, obtenerCategorias } from '../../api/productos';

const Home = () => {
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');
  const [precioFiltro, setPrecioFiltro] = useState('todos');
  const [carritoCount, setCarritoCount] = useState(0);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    // Cargar productos
    obtenerProductos()
      .then(setProductos)
      .catch(() => console.error("Error cargando productos desde la API"));

    // Cargar categorías dinámicas
    obtenerCategorias()
      .then(setCategorias)
      .catch(() => console.error("Error cargando categorías"));

    // ✔ obtener carritoReal
    const carrito = obtenerCarritoReal();
    if (Array.isArray(carrito)) {
      setCarritoCount(
        carrito.reduce((sum, item) => sum + (Number(item.cantidad) || 0), 0)
      );
    }
  }, []);

  const filtrarProductos = () => {
    return productos.filter(producto => {
      const coincideBusqueda =
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase());

      const coincideCategoria =
        categoriaFiltro === "todas" ||
        producto.categoria === categoriaFiltro;

      const coincidePrecio =
        precioFiltro === "todos" ||
        (precioFiltro === "bajo" && producto.precio < 50000) ||
        (precioFiltro === "medio" && producto.precio >= 50000 && producto.precio <= 200000) ||
        (precioFiltro === "alto" && producto.precio > 200000);

      return coincideBusqueda && coincideCategoria && coincidePrecio;
    });
  };

  // 🟢 Nuevo agregar al carrito usando carritoReal
  const agregarAlCarrito = (producto) => {
    agregar(producto);

    // actualizar contador local
    const carritoActual = obtenerCarritoReal();
    setCarritoCount(
      carritoActual.reduce((sum, item) => sum + (Number(item.cantidad) || 0), 0)
    );

    mostrarMensaje("Producto agregado al carrito", "success");
  };

  const formatearPrecio = (precio) =>
    `$${Number(precio).toLocaleString('es-CL')} CLP`;

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

        {/* FILTROS */}
        <div className="filtros-container" style={{
          maxWidth: '1200px',
          margin: '0 auto 2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          padding: '0 2rem'
        }}>

          {/* BUSQUEDA */}
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
                width: '100%', padding: '0.8rem',
                borderRadius: '8px', background: '#1a1a1a',
                color: '#fff', border: '1px solid #222'
              }}
            >
              <option value="todas">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
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
                width: '100%', padding: '0.8rem', borderRadius: '8px',
                background: '#1a1a1a', color: '#fff', border: '1px solid #222'
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
            <article key={producto.id} className="producto">

              <img src={producto.imagen} alt={producto.nombre} />
              <h3>{producto.nombre}</h3>
              <p className="precio">{formatearPrecio(producto.precio)}</p>
              <p className="descripcion">{producto.descripcion}</p>

              <Link to={`/detalles/${producto.id}`} className="btn-detalles">
                Ver detalles
              </Link>

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

    </main>
  );
};

export default Home;
