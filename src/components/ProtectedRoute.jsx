import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loadingUser } = useAuth();

  if (loadingUser) return <p>Cargando...</p>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
}
