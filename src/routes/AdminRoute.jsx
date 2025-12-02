import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loadingUser } = useAuth();

  if (loadingUser) return null;

  if (!user || user.rol !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}
