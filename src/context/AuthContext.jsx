import { createContext, useContext, useEffect, useState } from "react";
import { getPerfil, logout } from "../services/AuthService";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      setLoadingUser(false);
      return;
    }

    getPerfil()
      .then((perfil) => {
        // Buscar el rol en ambos lugares
        const rol = localStorage.getItem("userRol") || sessionStorage.getItem("userRol") || "USER";

        setUser({
          ...perfil,
          rol,
        });
      })
      .catch(() => {
        // Fallback al storage si /perfil falla
        const email = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");
        const nombre = localStorage.getItem("userNombre") || sessionStorage.getItem("userNombre");
        const rol = localStorage.getItem("userRol") || sessionStorage.getItem("userRol");

        if (email && rol) {
          setUser({ email, nombre, rol });
        } else {
          logout();
          setUser(null);
        }
      })
      .finally(() => setLoadingUser(false));

  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loadingUser,
      setUser,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);