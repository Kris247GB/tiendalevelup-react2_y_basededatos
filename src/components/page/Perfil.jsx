import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const Perfil = () => {
  const [perfil, setPerfil] = useState(null);
  const [boletas, setBoletas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        // 1) Obtener perfil normal
        const perfilRes = await api.get("/usuario/perfil");
        const data = perfilRes.data;

        setPerfil(data);

        // 2) Obtener boletas — NO BLOQUEA PERFIL SI FALLA
        const emailCodificado = encodeURIComponent(data.email);

        try {
          const boletasRes = await api.get(`/boletas/usuario/${emailCodificado}`);
          setBoletas(boletasRes.data);
        } catch (errBoletas) {
          if (errBoletas.response?.status === 404) {
            // Usuario sin compras — NO ES ERROR
            setBoletas([]);
          } else {
            console.error("Error boletas:", errBoletas);
          }
        }

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

    cargarPerfil();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <p style={{ textAlign: "center" }}>Cargando perfil...</p>;

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
            <p><strong>Puntos LevelUp:</strong> {perfil.levelUpPoints}</p>
            <p><strong>Código referido:</strong> {perfil.codigoReferido}</p>
            <p><strong>Referente:</strong> {perfil.codigoReferente || "Nadie"}</p>
            <p><strong>Descuento DUOC:</strong> {perfil.descuentoDuoc}%</p>
            <p><strong>Fecha registro:</strong> {perfil.fechaRegistro?.replace("T", " a las ")}</p>
          </div>
        )}

        <h3 style={{ marginTop: "2rem" }}>🧾 Historial de Compras</h3>

        {boletas.length === 0 ? (
          <p className="muted">Aún no tienes compras registradas.</p>
        ) : (
          boletas.map((b) => (
            <div
              key={b.id}
              style={{
                background: "rgba(255,255,255,0.05)",
                padding: "1rem",
                borderRadius: "10px",
                marginBottom: "1rem",
                borderLeft: "4px solid #39FF14",
              }}
            >
              <h4>Boleta #{b.id}</h4>
              <p><strong>Total:</strong> ${b.total.toLocaleString("es-CL")}</p>
              <p><strong>Fecha:</strong> {b.fecha.replace("T", " a las ")}</p>

              <details style={{ marginTop: "1rem" }}>
                <summary style={{ cursor: "pointer", color: "#39FF14" }}>
                  Ver detalles ▼
                </summary>

                <div style={{ marginTop: "1rem", paddingLeft: "1rem" }}>
                  {b.detalles.map((d) => (
                    <div
                      key={d.id}
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        padding: "0.8rem",
                        marginBottom: "0.8rem",
                        borderRadius: "8px",
                      }}
                    >
                      <p><strong>{d.nombre}</strong></p>
                      <p>Precio: ${d.precio.toLocaleString("es-CL")}</p>
                      <p>Cantidad: {d.cantidad}</p>
                      <p>Subtotal: ${d.subtotal.toLocaleString("es-CL")}</p>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          ))
        )}

        <button className="btn" style={{ marginTop: "1.5rem" }} onClick={logout}>
          Cerrar Sesión
        </button>
      </section>
    </main>
  );
};

export default Perfil;
