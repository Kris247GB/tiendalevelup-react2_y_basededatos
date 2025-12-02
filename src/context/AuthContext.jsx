// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    localStorage.getItem("token") || sessionStorage.getItem("token") || null
  );

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // =========================================================
  //    CARGAR PERFIL DESDE LA API
  // =========================================================
  useEffect(() => {
    async function cargarPerfil() {
      if (!token) {
        setUser(null);
        setLoadingUser(false);
        return;
      }

      try {
        const response = await api.get("/usuario/perfil");
        setUser(response.data);
      } catch (error) {
        console.error("Error cargando perfil:", error);
        setUser(null);
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
      } finally {
        setLoadingUser(false);
      }
    }

    cargarPerfil();
  }, [token]);

  // =========================================================
  //               MÉTODO LOGIN
  // =========================================================
  const login = (tokenRecibido, remember) => {
    if (remember) {
      localStorage.setItem("token", tokenRecibido);
    } else {
      sessionStorage.setItem("token", tokenRecibido);
    }

    setToken(tokenRecibido);
  };

  // =========================================================
  //               MÉTODO LOGOUT
  // =========================================================
  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loadingUser,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
