// src/api/productos.js
import api from "./api";

// Obtener todos los productos
export async function obtenerProductos() {
  const res = await api.get("/productos");
  return res.data;
}

// Obtener producto por ID
export async function obtenerProductoPorId(id) {
  const res = await api.get(`/productos/${id}`);
  return res.data;
}

// Obtener producto por código
export async function obtenerProductoPorCodigo(codigo) {
  const res = await api.get(`/productos/codigo/${codigo}`);
  return res.data;
}

// Crear producto (ADMIN)
export async function crearProducto(producto) {
  const res = await api.post("/productos", producto);
  return res.data;
}

// Actualizar producto (ADMIN)
export async function actualizarProducto(id, producto) {
  const res = await api.put(`/productos/${id}`, producto);
  return res.data;
}

// Eliminar producto (ADMIN)
export async function eliminarProducto(id) {
  const res = await api.delete(`/productos/${id}`);
  return res.data;
}

// Categorías dinámicas
export async function obtenerCategorias() {
  const res = await api.get("/productos/categorias");
  return res.data;
}
