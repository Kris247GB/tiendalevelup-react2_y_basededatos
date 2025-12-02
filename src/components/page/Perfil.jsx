import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const Perfil = () => {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const response = await api.get("/usuario/perfil");
        setPerfil(response.data);
      } catch (err) {
        console.error("Error al cargar perfil:", err);

        if (err.response?.status === 401) {
          setError("Token inválido o expirado. Inicia sesión nuevamente.");

          setTimeout(() => {
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
            navigate("/login");
          }, 1500);
        } else {
          setError("No se pudo cargar el perfil.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  if (loading)
    return <p style={{ textAlign: "center" }}>Cargando perfil...</p>;

  if (error)
    return (
      <p
        style={{
          textAlign: "center",
          padding: "1rem",
          background: "#ff6b6b",
          color: "white",
          borderRadius: "8px",
        }}
      >
        {error}
      </p>
    );

  return (
    <main className="wrap">
      <section className="auth-box">
        <h2>Mi Perfil</h2>

        {perfil && (
          <div className="perfil-data">
            <p><strong>Nombre:</strong> {perfil.nombre}</p>
            <p><strong>Email:</strong> {perfil.email}</p>
            <p><strong>Rol:</strong> {perfil.rol}</p>
            <p><strong>Mayor de 18:</strong> {perfil.mayor18 ? "Sí" : "No"}</p>
            <p><strong>Mis puntos LevelUp:</strong> {perfil.levelUpPoints}</p>
            <p><strong>Mi código referido:</strong> {perfil.codigoReferido}</p>
            <p><strong>Fui referido por:</strong> {perfil.codigoReferente || "Nadie"}</p>
            <p><strong>Descuento DUOC:</strong> {perfil.descuentoDuoc}%</p>
            <p><strong>Fecha registro:</strong> {perfil.fechaRegistro?.replace("T", " a las ")}</p>
          </div>
        )}

        <button className="btn" style={{ marginTop: "1.5rem" }} onClick={logout}>
          Cerrar Sesión
        </button>
      </section>
    </main>
  );
};

export default Perfil;
