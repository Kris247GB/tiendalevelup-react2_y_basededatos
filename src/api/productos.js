import axios from "axios";

const API_URL = "http://localhost:8081/api/productos";

// Obtener todos los productos
export async function obtenerProductos() {
  const response = await axios.get(API_URL);
  return response.data;
}

// Obtener un producto por ID
export async function obtenerProductoPorId(id) {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
}

// Obtener un producto por código (si lo necesitas)
export async function obtenerProductoPorCodigo(codigo) {
  const response = await axios.get(`${API_URL}/codigo/${codigo}`);
  return response.data;
}

// Crear producto
export async function crearProducto(producto) {
  const response = await axios.post(API_URL, producto);
  return response.data;
}

// Actualizar producto
export async function actualizarProducto(id, producto) {
  const response = await axios.put(`${API_URL}/${id}`, producto);
  return response.data;
}

// Eliminar producto
export async function eliminarProducto(id) {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
}

export async function obtenerCategorias() {
  const res = await axios.get("http://localhost:8081/api/productos/categorias");
  return res.data;
}
