// src/api/api.js
import axios from "axios";
import { logout } from "../services/AuthService";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8081/api",
  withCredentials: false, // JWT va por header, no cookies
});

// Interceptor para agregar el token
api.interceptors.request.use((config) => {
  // 🔧 BUSCAR TOKEN EN AMBOS LUGARES
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Interceptor para manejar errores globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el token expiró o es inválido → cerrar sesión
    if (error.response && error.response.status === 401) {
      logout();
      window.location.href = "/login";
    }

    // Pasar error al frontend
    return Promise.reject(
      error.response?.data || { error: "Error de conexión con el servidor" }
    );
  }
);

export default api;