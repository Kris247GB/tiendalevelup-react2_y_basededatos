import api from "./api";  

// Registrar nueva boleta
export async function registrarBoleta(data) {
  const res = await api.post("/boletas", data);
  return res.data;
}

// Obtener boleta individual
export async function obtenerBoleta(id) {
  const res = await api.get(`/boletas/${id}`);
  return res.data;
}

// Listar todas las boletas (admin)
export async function listarBoletas() {
  const res = await api.get(`/boletas`);
  return res.data;
}

// Obtener boletas por usuario
export async function obtenerBoletasUsuario(email) {
  const res = await api.get(`/boletas/usuario/${email}`);
  return res.data;
}
