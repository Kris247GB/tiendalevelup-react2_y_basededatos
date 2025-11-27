import axios from "axios";

const API_URL = "http://localhost:8081/api/boletas";

export async function registrarBoleta(data) {
  const res = await axios.post(API_URL, data);
  return res.data;
}

export async function obtenerBoleta(id) {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
}

export async function listarBoletas() {
  const res = await axios.get(API_URL);
  return res.data;
}

export async function obtenerBoletasUsuario(email) {
  const res = await axios.get(`http://localhost:8081/api/boletas/usuario/${email}`);
  return res.data;
}
