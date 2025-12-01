import React from "react";

const Contacto = () => {
  const telefono = "+56942611974"; // cámbialo si quieres
  const correo = "crist.tapiap@duocuc.cl"; // cámbialo si quieres

  return (
    <div style={{ color: "white", padding: "2rem", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", color: "#39FF14" }}>
        📞 Contacto Level-Up Gamer
      </h1>

      {/* Información */}
      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          padding: "1.5rem",
          borderRadius: "15px",
          marginBottom: "2rem",
          borderLeft: "4px solid #39FF14",
        }}
      >
        <h2>Información de Contacto</h2>

        <p>
          📍 <strong>Dirección:</strong> Plaza de Armas, Santiago, Chile
        </p>

        <p>
          📞 <strong>Teléfono:</strong>
          <a href={`tel:${telefono}`} style={{ color: "#39FF14", marginLeft: "5px" }}>
            {telefono}
          </a>
        </p>

        <p>
          📧 <strong>Correo:</strong>
          <a href={`mailto:${correo}`} style={{ color: "#39FF14", marginLeft: "5px" }}>
            {correo}
          </a>
        </p>

        {/* Botones */}
        <div style={{ marginTop: "1rem" }}>
          <a
            href={`tel:${telefono}`}
            style={{
              background: "#39FF14",
              color: "black",
              padding: "10px 15px",
              borderRadius: "8px",
              marginRight: "10px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Llamar
          </a>

          <a
            href={`mailto:${correo}`}
            style={{
              background: "#39FF14",
              color: "black",
              padding: "10px 15px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Enviar Email
          </a>
        </div>
      </div>

      {/* Mapa */}
      <div>
        <h2 style={{ marginBottom: "1rem" }}>📍 Ubicación en el mapa</h2>

        <iframe
          width="100%"
          height="350"
          frameBorder="0"
          style={{ border: 0, borderRadius: "10px" }}
          src="https://www.google.com/maps?q=Serrano+1105,+Melipilla&output=embed"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default Contacto;
