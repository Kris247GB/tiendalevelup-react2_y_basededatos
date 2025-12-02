import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // Verificar token
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  // Si no hay token -> enviar a login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si hay token -> permitir el acceso
  return children;
}
