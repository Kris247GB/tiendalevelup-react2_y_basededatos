import { createContext, useContext, useEffect, useState } from "react";
import { getPerfil, logout } from "../services/AuthService";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      setLoadingUser(false);
      return;
    }

    getPerfil()
      .then((perfil) => setUser(perfil))
      .catch(() => {
        logout();
        setUser(null);
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
