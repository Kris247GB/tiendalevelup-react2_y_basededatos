// src/services/UserService.js
import api from "../api/api";

export async function getPerfil() {
  const response = await api.get("/usuario/perfil");
  return response.data;
}
