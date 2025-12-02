import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  // ❌ No hay token → lo saco a login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✔ Sí hay token → dejo pasar
  return children;
};

export default ProtectedRoute;
