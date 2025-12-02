// src/services/AuthService.js
import api from "../api/api";

export async function register(data) {
  return api.post("/auth/register", data)
    .then(res => res.data)
    .catch(err => {
      throw err.response?.data || { error: "Error en registro" };
    });
}

export async function login(email, password) {
  return api.post("/auth/login", { email, password })
    .then(res => {
      const data = res.data;

      // Guardar token
      localStorage.setItem("token", data.token);

      // Guardar info del usuario (se usará como fallback para el contexto)
      localStorage.setItem("userEmail", data.email);
      localStorage.setItem("userNombre", data.nombre);
      localStorage.setItem("userRol", data.rol);

      return data; // <-- SE PASA AL AuthContext
    })
    .catch(err => {
      throw err.response?.data || { error: "Error al iniciar sesión" };
    });
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userNombre");
  localStorage.removeItem("userRol");
}

export function getToken() {
  return localStorage.getItem("token");
}

export async function getPerfil() {
  return api.get("/usuario/perfil")
    .then(res => res.data)
    .catch(err => {
      throw err.response?.data || { error: "No se pudo obtener el perfil" };
    });
}
