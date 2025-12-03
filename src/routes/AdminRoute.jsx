import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loadingUser } = useAuth();

  // 🔍 DEBUG - Quita esto después de probar
  console.log("AdminRoute - Loading:", loadingUser);
  console.log("AdminRoute - User:", user);
  console.log("AdminRoute - Rol:", user?.rol);

  if (loadingUser) return null;

  if (!user || user.rol !== "ADMIN") {
    console.log("❌ Acceso denegado - Redirigiendo a home");
    return <Navigate to="/" replace />;
  }

  console.log("✅ Acceso permitido al admin");
  return children;
}