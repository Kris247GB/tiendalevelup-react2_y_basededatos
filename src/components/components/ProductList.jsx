import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductService from '../../services/ProductService';

const ProductList = () => {
  const [items, setItems] = useState([]);

  const load = () => {
    ProductService.getAll()
      .then(r => setItems(r.data))
      .catch(e => console.error('Error loading products', e));
  };

  const handleDelete = (id) => {
    ProductService.remove(id)
      .then(load)
      .catch(e => console.error('Error deleting product', e));
  };

  useEffect(() => { load(); }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>Productos</h2>
      <div style={{ marginBottom: 12 }}>
        <Link to="/products/new">➕ Nuevo producto</Link>
      </div>

      <table border="1" cellPadding="8" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map(p => (
            <tr key={p.id}>
              <td>{p.name ?? p.nombre ?? p.title}</td>
              <td>{p.price ?? p.precio}</td>
              <td>{p.category ?? p.categoria ?? '-'}</td>
              <td>{p.stock ?? '-'}</td>
              <td>
                <Link to={`/products/edit/${p.id}`} style={{ marginRight: 8 }}>Editar</Link>
                <button onClick={() => handleDelete(p.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td colSpan="5">Sin productos aún.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
