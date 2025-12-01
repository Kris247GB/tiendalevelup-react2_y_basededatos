import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8081/api/eventos";

const Eventos = () => {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
  fetch(API_URL)
    .then((r) => {
      if (!r.ok) return []; // Si hay error 500 devolvemos lista vacía
      return r.json();
    })
    .then((data) => {
      if (Array.isArray(data)) {
        setEventos(data);
      } else {
        setEventos([]); // evita .map() error
      }
    })
    .catch(() => setEventos([]));
}, []);


  return (
    <div style={{ padding: "2rem", color: "white", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", color: "#39FF14" }}>🎮 Eventos Gamer</h1>

      {eventos.length === 0 && (
        <p style={{ textAlign: "center", marginTop: "2rem" }}>
          No hay eventos disponibles.
        </p>
      )}

      {eventos.map((ev) => (
        <div
          key={ev.id}
          style={{
            background: "rgba(255,255,255,0.05)",
            padding: "1.5rem",
            borderRadius: "15px",
            marginBottom: "1.5rem",
            borderLeft: "4px solid #39FF14",
          }}
        >
          <h2>{ev.titulo}</h2>
          <p>{ev.descripcion}</p>

          <p>
            <strong>📅 Fecha:</strong> {ev.fecha}
          </p>

          <p>
            <strong>📍 Lugar:</strong> {ev.lugar}
          </p>

          {ev.imagen && (
            <img
              src={ev.imagen}
              alt="evento"
              style={{ width: "100%", borderRadius: "10px", marginTop: "10px" }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Eventos;
