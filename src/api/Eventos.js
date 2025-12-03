// src/api/eventos.js
import api from "./api";

// Obtener todos los eventos
export async function obtenerEventos() {
  const res = await api.get("/eventos");
  return res.data;
}

// Crear evento (ADMIN)
export async function crearEvento(evento) {
  const res = await api.post("/eventos", evento);
  return res.data;
}

// Eliminar evento (ADMIN)
export async function eliminarEvento(id) {
  const res = await api.delete(`/eventos/${id}`);
  return res.data;
}