import React, { useEffect, useState } from "react";
import { obtenerEventos } from "../../api/Eventos";

// Coordenadas de ciudades de Chile para el mapa
const CIUDADES = {
  "Santiago": { lat: -33.4489, lng: -70.6693 },
  "Valparaíso": { lat: -33.0472, lng: -71.6127 },
  "Concepción": { lat: -36.8201, lng: -73.0444 },
  "La Serena": { lat: -29.9027, lng: -71.2519 },
  "Antofagasta": { lat: -23.6509, lng: -70.3975 },
  "Temuco": { lat: -38.7359, lng: -72.5904 },
  "Rancagua": { lat: -34.1708, lng: -70.7406 },
  "Talca": { lat: -35.4264, lng: -71.6554 },
  "Arica": { lat: -18.4746, lng: -70.2979 },
  "Iquique": { lat: -20.2307, lng: -70.1355 },
  "Puerto Montt": { lat: -41.4693, lng: -72.9424 },
  "Punta Arenas": { lat: -53.1638, lng: -70.9171 }
};

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [filteredEventos, setFilteredEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [filterLocation, setFilterLocation] = useState("");
  const [selectedEvento, setSelectedEvento] = useState(null);

  useEffect(() => {
    obtenerEventos()
      .then((data) => {
        if (Array.isArray(data)) {
          setEventos(data);
          setFilteredEventos(data);
        } else {
          setEventos([]);
          setFilteredEventos([]);
        }
      })
      .catch(() => {
        setEventos([]);
        setFilteredEventos([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filtered = eventos;
    
    if (filterLocation) {
      filtered = filtered.filter(ev => 
        ev.lugar.toLowerCase().includes(filterLocation.toLowerCase())
      );
    }
    
    setFilteredEventos(filtered);
  }, [filterLocation, eventos]);

  const getCityCoords = (lugar) => {
    const ciudad = Object.keys(CIUDADES).find(c => 
      lugar.toLowerCase().includes(c.toLowerCase())
    );
    return ciudad ? CIUDADES[ciudad] : null;
  };

  const formatDate = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CL', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#000", 
      color: "#fff",
      paddingTop: "2rem"
    }}>
      {/* Header */}
      <div style={{ 
        maxWidth: "1400px", 
        margin: "0 auto", 
        padding: "0 2rem 2rem" 
      }}>
        <h1 style={{ 
          fontSize: "3rem", 
          fontWeight: "bold", 
          textAlign: "center",
          background: "linear-gradient(135deg, #39FF14 0%, #1E90FF 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "0.5rem"
        }}>
          🎮 Eventos Gamer
        </h1>
        <p style={{ 
          textAlign: "center", 
          color: "#D3D3D3", 
          fontSize: "1.1rem" 
        }}>
          Participa en eventos y gana puntos LevelUp
        </p>
      </div>

      {/* Filtros y Vista */}
      <div style={{ 
        maxWidth: "1400px", 
        margin: "0 auto 2rem", 
        padding: "0 2rem",
        display: "flex",
        gap: "1rem",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", gap: "1rem", flex: 1 }}>
          <div style={{ position: "relative", flex: 1, maxWidth: "300px" }}>
            <span style={{ 
              position: "absolute", 
              left: "12px", 
              top: "50%", 
              transform: "translateY(-50%)",
              color: "#39FF14",
              fontSize: "1.2rem"
            }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Filtrar por ubicación..."
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 0.75rem 0.75rem 2.5rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(57,255,20,0.3)",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "1rem"
              }}
            />
          </div>
        </div>

        <div style={{ 
          display: "flex", 
          gap: "0.5rem",
          background: "rgba(255,255,255,0.05)",
          padding: "0.25rem",
          borderRadius: "8px"
        }}>
          <button
            onClick={() => setViewMode("grid")}
            style={{
              padding: "0.5rem 1rem",
              background: viewMode === "grid" ? "#39FF14" : "transparent",
              color: viewMode === "grid" ? "#000" : "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            📊 Cuadrícula
          </button>
          <button
            onClick={() => setViewMode("list")}
            style={{
              padding: "0.5rem 1rem",
              background: viewMode === "list" ? "#39FF14" : "transparent",
              color: viewMode === "list" ? "#000" : "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            📋 Lista
          </button>
        </div>
      </div>

      {/* Mapa de Chile */}
      <div style={{ 
        maxWidth: "1400px", 
        margin: "0 auto 3rem", 
        padding: "0 2rem" 
      }}>
        <div style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: "16px",
          padding: "2rem",
          border: "1px solid rgba(57,255,20,0.2)"
        }}>
          <h2 style={{ 
            fontSize: "1.5rem", 
            marginBottom: "1.5rem",
            color: "#39FF14"
          }}>
            📍 Mapa de Eventos en Chile
          </h2>
          
          <div style={{
            position: "relative",
            width: "100%",
            height: "500px",
            background: "linear-gradient(135deg, rgba(30,144,255,0.1) 0%, rgba(57,255,20,0.1) 100%)",
            borderRadius: "12px",
            overflow: "hidden",
            border: "2px solid rgba(57,255,20,0.3)"
          }}>
            {/* Mapa simplificado de Chile */}
            <svg viewBox="0 0 800 1200" style={{ width: "100%", height: "100%" }}>
              {/* Forma simplificada de Chile */}
              <path
                d="M 400 50 L 450 100 L 480 200 L 470 350 L 460 500 L 450 650 L 430 800 L 400 950 L 370 1050 L 350 1150 L 320 1050 L 300 950 L 280 800 L 270 650 L 280 500 L 290 350 L 310 200 L 350 100 Z"
                fill="rgba(57,255,20,0.1)"
                stroke="#39FF14"
                strokeWidth="2"
              />
              
              {/* Marcadores de eventos */}
              {filteredEventos.map((ev) => {
                const coords = getCityCoords(ev.lugar);
                if (!coords) return null;
                
                // Convertir coordenadas reales a coordenadas SVG
                const x = 400 + (coords.lng + 70) * 15;
                const y = 600 + (coords.lat + 33) * 20;
                
                return (
                  <g 
                    key={ev.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedEvento(ev)}
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r="8"
                      fill="#1E90FF"
                      stroke="#39FF14"
                      strokeWidth="2"
                    >
                      <animate
                        attributeName="r"
                        values="8;12;8"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle
                      cx={x}
                      cy={y}
                      r="15"
                      fill="none"
                      stroke="#39FF14"
                      strokeWidth="1"
                      opacity="0.3"
                    >
                      <animate
                        attributeName="r"
                        values="15;25;15"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                );
              })}
            </svg>

            {/* Evento seleccionado */}
            {selectedEvento && (
              <div style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "rgba(0,0,0,0.95)",
                padding: "1.5rem",
                borderRadius: "12px",
                maxWidth: "300px",
                border: "2px solid #39FF14",
                boxShadow: "0 0 20px rgba(57,255,20,0.3)"
              }}>
                <button
                  onClick={() => setSelectedEvento(null)}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "transparent",
                    border: "none",
                    color: "#39FF14",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    padding: "0",
                    width: "30px",
                    height: "30px"
                  }}
                >
                  ×
                </button>
                <h3 style={{ color: "#39FF14", marginBottom: "0.5rem" }}>
                  {selectedEvento.titulo}
                </h3>
                <p style={{ fontSize: "0.9rem", color: "#D3D3D3", marginBottom: "0.5rem" }}>
                  {selectedEvento.descripcion}
                </p>
                <p style={{ fontSize: "0.9rem", color: "#fff" }}>
                  📍 {selectedEvento.lugar}
                </p>
                <p style={{ fontSize: "0.9rem", color: "#fff" }}>
                  📅 {formatDate(selectedEvento.fecha)}
                </p>
              </div>
            )}
          </div>

          <p style={{ 
            marginTop: "1rem", 
            color: "#D3D3D3", 
            fontSize: "0.9rem",
            textAlign: "center"
          }}>
            👥 {filteredEventos.length} evento{filteredEventos.length !== 1 ? "s" : ""} disponible{filteredEventos.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Lista de Eventos */}
      <div style={{ 
        maxWidth: "1400px", 
        margin: "0 auto", 
        padding: "0 2rem 4rem" 
      }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <div style={{
              width: "50px",
              height: "50px",
              border: "3px solid rgba(57,255,20,0.3)",
              borderTop: "3px solid #39FF14",
              borderRadius: "50%",
              margin: "0 auto",
              animation: "spin 1s linear infinite"
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
          </div>
        ) : filteredEventos.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "3rem",
            background: "rgba(255,255,255,0.03)",
            borderRadius: "16px"
          }}>
            <p style={{ fontSize: "1.2rem", color: "#D3D3D3" }}>
              No hay eventos disponibles.
            </p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: viewMode === "grid" 
              ? "repeat(auto-fill, minmax(350px, 1fr))" 
              : "1fr",
            gap: "1.5rem"
          }}>
            {filteredEventos.map((ev) => (
              <div
                key={ev.id}
                style={{
                  background: "linear-gradient(135deg, rgba(30,144,255,0.1) 0%, rgba(57,255,20,0.05) 100%)",
                  padding: "1.5rem",
                  borderRadius: "16px",
                  border: "1px solid rgba(57,255,20,0.3)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(57,255,20,0.2)";
                  e.currentTarget.style.borderColor = "#39FF14";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "rgba(57,255,20,0.3)";
                }}
              >
                {/* Decoración */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "4px",
                  height: "100%",
                  background: "linear-gradient(180deg, #39FF14 0%, #1E90FF 100%)"
                }} />

                {ev.imagen && (
                  <img
                    src={ev.imagen}
                    alt={ev.titulo}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      marginBottom: "1rem"
                    }}
                  />
                )}

                <h2 style={{
                  fontSize: "1.5rem",
                  color: "#39FF14",
                  marginBottom: "0.75rem",
                  fontWeight: "bold"
                }}>
                  {ev.titulo}
                </h2>

                <p style={{
                  color: "#D3D3D3",
                  marginBottom: "1rem",
                  lineHeight: "1.6"
                }}>
                  {ev.descripcion}
                </p>

                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  marginTop: "1rem"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "#fff"
                  }}>
                    <span style={{ color: "#1E90FF" }}>📅</span>
                    <span>{formatDate(ev.fecha)}</span>
                  </div>

                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "#fff"
                  }}>
                    <span style={{ color: "#39FF14" }}>📍</span>
                    <span>{ev.lugar}</span>
                  </div>
                </div>

                <button style={{
                  marginTop: "1rem",
                  width: "100%",
                  padding: "0.75rem",
                  background: "linear-gradient(135deg, #39FF14 0%, #1E90FF 100%)",
                  color: "#000",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 5px 20px rgba(57,255,20,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}>
                  🎮 Participar y Ganar Puntos
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Eventos;