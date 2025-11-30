import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { obtenerProductoPorId } from "../../api/productos";
import carritoReal from "../Atoms/carritoReal";
import { mostrarMensaje } from "../Atoms/Validaciones";

const API_URL = "http://localhost:8081/api"; // 🔥 URL del backend correcta

const Detalles = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [comentarios, setComentarios] = useState([]);

  // Cargar producto
  useEffect(() => {
    obtenerProductoPorId(id)
      .then((data) => setProducto(data))
      .catch((err) => console.error("Error al cargar producto:", err))
      .finally(() => setLoading(false));

    // Cargar comentarios del backend
    fetch(`${API_URL}/productos/${id}/comentarios`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudieron cargar comentarios");
        return res.json();
      })
      .then((data) => setComentarios(data))
      .catch((err) => console.error("Error al cargar comentarios:", err));
  }, [id]);

  // Agregar al carrito REAL
  const agregarAlCarrito = () => {
    if (!producto) return;

    carritoReal.agregar({
      id: producto.id,
      codigo: producto.codigo,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
    });

    mostrarMensaje("Producto agregado al carrito", "success");
  };

  // Enviar reseña
  const handleSubmitReview = (e) => {
    e.preventDefault();

    if (!rating || !reviewText.trim()) {
      alert("Por favor completa la calificación y escribe tu reseña");
      return;
    }

    const comentario = {
      rating: rating,
      texto: reviewText,
    };

    fetch(`${API_URL}/productos/${producto.id}/comentarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comentario),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText);
        }
        return res.json();
      })
      .then((data) => {
        setComentarios((prev) => [...prev, data]);
        setRating(0);
        setReviewText("");
        alert("¡Gracias por tu reseña!");
      })
      .catch((err) => console.error("Error al enviar la reseña:", err));
  };

  if (loading) return <p style={{ textAlign: "center", color: "white" }}>Cargando…</p>;

  if (!producto)
    return <p style={{ textAlign: "center", color: "red" }}>Producto no encontrado</p>;

  return (
    <div style={{ width: "100%", minHeight: "100vh" }}>
      <main className="detalle-producto">

        <div className="imagen">
          <img src={producto.imagen} alt={producto.nombre} />
        </div>

        <div className="info">
          <h2>{producto.nombre}</h2>
          <p className="precio">
            ${producto.precio.toLocaleString("es-CL")} CLP
          </p>

          <div className="acciones">
            <button className="btn-agregar" onClick={agregarAlCarrito}>
              Agregar al carrito
            </button>
            <Link to="/#catalogo" className="btn-volver">
              ← Volver al catálogo
            </Link>
          </div>
        </div>

        <section id="reviews" className="reviews-card">
          <h2>Reseñas</h2>

          <form className="review-form" onSubmit={handleSubmitReview}>
            <label>Tu calificación</label>

            <div className="star-input">
              {[5, 4, 3, 2, 1].map((star) => (
                <React.Fragment key={star}>
                  <input
                    id={`rate-${star}`}
                    type="radio"
                    name="rating"
                    value={star}
                    checked={rating === star}
                    onChange={() => setRating(star)}
                  />
                  <label htmlFor={`rate-${star}`}>★</label>
                </React.Fragment>
              ))}
            </div>

            <textarea
              className="review-text"
              placeholder="Escribe tu reseña"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />

            <button type="submit" className="btn-resena">
              Publicar reseña
            </button>
          </form>

          <ul className="reviews-list">
            {comentarios.length === 0 ? (
              <p>No hay reseñas aún.</p>
            ) : (
              comentarios.map((c, index) => (
                <li className="review-item" key={index}>
                  <div className="review-head">
                    <span className="stars" style={{ "--value": c.rating }} />
                    <strong className="user">Usuario</strong>
                    <time className="date">{c.fecha || "Fecha no disponible"}</time>
                  </div>
                  <p className="review-body">{c.texto}</p>
                </li>
              ))
            )}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Detalles;
