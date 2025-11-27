import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { obtenerProductoPorId } from "../../api/productos";
import { carrito, mostrarMensaje } from "../Atoms/Validaciones";

const Detalles = () => {
  const { id } = useParams();              // ← ID desde la URL
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    obtenerProductoPorId(id)
      .then((data) => {
        setProducto(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar producto:", err);
        setLoading(false);
      });
  }, [id]);

  const agregarAlCarrito = () => {
    if (!producto) return;

    const item = {
      codigo: producto.codigo,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1,
    };

    if (typeof carrito !== "undefined" && typeof carrito.agregar === "function") {
      carrito.agregar(item);
      mostrarMensaje?.("Producto agregado al carrito", "success");
    } else {
      alert("Producto agregado");
    }
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();

    if (!rating || !reviewText.trim()) {
      alert("Por favor completa la calificación y escribe tu reseña");
      return;
    }

    alert("¡Gracias por tu reseña!");
    setRating(0);
    setReviewText("");
  };

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "2rem", color: "white" }}>Cargando producto...</p>;
  }

  if (!producto) {
    return <p style={{ textAlign: "center", marginTop: "2rem", color: "red" }}>Producto no encontrado</p>;
  }

  return (
    <div style={{ width: "100%", minHeight: "100vh" }}>
      <main className="detalle-producto">
        {/* IMAGEN */}
        <div className="imagen">
          <img src={producto.imagen} alt={producto.nombre} />
        </div>

        {/* INFORMACIÓN */}
        <div className="info">
          <h2>{producto.nombre}</h2>
          <p className="precio">${producto.precio.toLocaleString("es-CL")} CLP</p>
          <p>{producto.descripcion}</p>

          <ul>
            <li><strong>Categoría:</strong> {producto.categoria}</li>
            <li><strong>Stock disponible:</strong> {producto.stock}</li>
            {producto.destacado && <li style={{ color: "#39FF14" }}>🔥 Producto destacado</li>}
          </ul>

          <div className="acciones">
            <button 
              className="btn-agregar"
              onClick={agregarAlCarrito}
              type="button"
            >
              Agregar al carrito
            </button>

            <Link to="/#catalogo" className="btn-volver">← Volver al catálogo</Link>
          </div>
        </div>

        {/* RESEÑAS */}
        <section id="reviews" className="reviews-card" aria-label="Reseñas del producto">
          <h2>Reseñas</h2>

          <form className="review-form" onSubmit={handleSubmitReview}>
            <label className="label">Tu calificación</label>

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
              maxLength={600}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />

            <button type="submit" className="btn-resena">
              Publicar reseña
            </button>
          </form>

          {/* Reseñas estáticas por ahora */}
          <ul className="reviews-list">
            <li className="review-item">
              <div className="review-head">
                <span className="stars" style={{ "--value": 5 }} />
                <strong className="user">Camila R.</strong>
                <time className="date">28/08/2025</time>
              </div>
              <p className="review-body">Excelente producto.</p>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Detalles;
