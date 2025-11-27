import { api } from "./api";

export async function obtenerProductos() {
  const res = await api.get("/productos");
  return res.data;
}

export async function obtenerProductoPorId(id) {
  const res = await api.get(`/productos/${id}`);
  return res.data;
}

export async function crearProducto(producto) {
  const res = await api.post("/productos", producto);
  return res.data;
}

export async function actualizarProducto(id, producto) {
  const res = await api.put(`/productos/${id}`, producto);
  return res.data;
}

export async function eliminarProducto(id) {
  await api.delete(`/productos/${id}`);
}
