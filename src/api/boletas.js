// src/api/boletas.js
import api from "./api"; // <-- usa tu instancia con JWT

const API_URL = "/boletas"; 
// api ya tiene baseURL: http://localhost:8081/api

export async function registrarBoleta(data) {
  const res = await api.post(API_URL, data);
  return res.data;
}

export async function obtenerBoleta(id) {
  const res = await api.get(`${API_URL}/${id}`);
  return res.data;
}

export async function listarBoletas() {
  const res = await api.get(API_URL);
  return res.data;
}

export async function obtenerBoletasUsuario(email) {
  const res = await api.get(`${API_URL}/usuario/${email}`);
  return res.data;
}
