import React, { useEffect, useState } from "react";
import { obtenerBoletasUsuario } from "../../api/boletas";
import { gamification } from "../Atoms/Validaciones";

const Perfil = () => {
  const [user, setUser] = useState(null);
  const [boletas, setBoletas] = useState([]);  // Inicializamos como array vacío

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
    setUser(userData);

    if (userData.email) {
      obtenerBoletasUsuario(userData.email)
        .then((data) => {
          if (Array.isArray(data)) {
            setBoletas(data);  // Solo setea boletas si es un array
          } else {
            console.error("La respuesta no es un array:", data);
          }
        })
        .catch((err) => console.error("Error cargando boletas", err));
    }
  }, []);

  if (!user) return <p>Cargando…</p>;

  const level = gamification.getUserLevel(user.levelUpPoints || 0);

  return (
    <main style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <h2>👤 Mi Perfil</h2>

      <section
        style={{
          background: "rgba(255,255,255,0.05)",
          padding: "1.5rem",
          borderRadius: "12px",
          marginBottom: "2rem",
        }}
      >
        <p><strong>Nombre:</strong> {user.nombre}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Puntos Level-Up:</strong> {user.levelUpPoints}</p>
        <p><strong>Nivel:</strong> {level.name}</p>
        <p><strong>Descuento nivel:</strong> {level.discount}%</p>

        {user.descuentoDuoc > 0 && (
          <p><strong>Descuento DUOC:</strong> {user.descuentoDuoc}%</p>
        )}
      </section>

      <h2>🧾 Historial de Compras</h2>

      {boletas.length === 0 ? (
        <p style={{ opacity: 0.7 }}>Aún no tienes compras registradas.</p>
      ) : (
        boletas.map((b) => (
          <div
            key={b.id}
            style={{
              background: "rgba(255,255,255,0.05)",
              padding: "1.5rem",
              borderRadius: "12px",
              marginBottom: "1rem",
              borderLeft: "4px solid #39FF14",
            }}
          >
            <h3>Boleta #{b.id}</h3>
            <p><strong>Fecha:</strong> {b.fecha}</p>
            <p><strong>Total:</strong> ${b.total.toLocaleString("es-CL")}</p>

            <details style={{ marginTop: "1rem" }}>
              <summary style={{ cursor: "pointer", color: "#39FF14" }}>
                Ver detalles ▼
              </summary>

              {b.detalles.map((d) => (
                <div key={d.id} style={{ marginTop: "0.8rem", paddingLeft: "1rem" }}>
                  <p><strong>{d.nombre}</strong></p>
                  <p>Precio: ${d.precio.toLocaleString("es-CL")}</p>
                  <p>Cantidad: {d.cantidad}</p>
                  <p>Subtotal: ${d.subtotal.toLocaleString("es-CL")}</p>
                </div>
              ))}
            </details>
          </div>
        ))
      )}
    </main>
  );
};

export default Perfil;
