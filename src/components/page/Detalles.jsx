import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { obtenerProductoPorId } from "../../api/productos";
import carritoReal from "../Atoms/carritoReal";
import { mostrarMensaje } from "../Atoms/Validaciones";

const Detalles = () => {
  const { id } = useParams(); 
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [comentarios, setComentarios] = useState([]);  // Estado para los comentarios

  // Cargar producto del backend
  useEffect(() => {
    obtenerProductoPorId(id)
      .then((data) => {
        setProducto(data);
      })
      .catch((err) => {
        console.error("Error al cargar producto:", err);
      })
      .finally(() => setLoading(false));

    // Obtener los comentarios del producto
    fetch(`/api/productos/${id}/comentarios`)
      .then((res) => res.json())
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

  // Enviar reseña (mock)
  const handleSubmitReview = (e) => {
    e.preventDefault();

    if (!rating || !reviewText.trim()) {
      alert("Por favor completa la calificación y escribe tu reseña");
      return;
    }

    const comentario = {
      productoId: producto.id,
      rating: rating,
      texto: reviewText,
    };

    // Enviar comentario al backend
    fetch(`/api/productos/${producto.id}/comentarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comentario),
    })
      .then((res) => res.json())
      .then((data) => {
        // Actualiza la lista de comentarios
        setComentarios((prevComentarios) => [...prevComentarios, data]);
        setRating(0);
        setReviewText("");
        alert("¡Gracias por tu reseña!");
      })
      .catch((err) => console.error("Error al enviar la reseña:", err));
  };

  // Estado de carga
  if (loading) {
    return (
      <p style={{ textAlign: "center", marginTop: "2rem", color: "white" }}>
        Cargando producto...
      </p>
    );
  }

  // Producto no encontrado
  if (!producto) {
    return (
      <p style={{ textAlign: "center", marginTop: "2rem", color: "red" }}>
        Producto no encontrado
      </p>
    );
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
          <p className="precio">
            ${producto.precio.toLocaleString("es-CL")} CLP
          </p>
          <p>{producto.descripcion}</p>

          <ul>
            <li><strong>Categoría:</strong> {producto.categoria}</li>
            <li><strong>Stock disponible:</strong> {producto.stock}</li>
            {producto.destacado && (
              <li style={{ color: "#39FF14" }}>🔥 Producto destacado</li>
            )}
          </ul>

          <div className="acciones">
            <button 
              className="btn-agregar"
              onClick={agregarAlCarrito}
              type="button"
            >
              Agregar al carrito
            </button>

            <Link to="/#catalogo" className="btn-volver">
              ← Volver al catálogo
            </Link>
          </div>
        </div>

        {/* RESEÑAS */}
        <section id="reviews" className="reviews-card">
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

          {/* Mostrar los comentarios existentes */}
          <ul className="reviews-list">
            {comentarios.length === 0 ? (
              <p>No hay reseñas aún.</p>
            ) : (
              comentarios.map((comentario, index) => (
                <li className="review-item" key={index}>
                  <div className="review-head">
                    <span className="stars" style={{ "--value": comentario.rating }} />
                    <strong className="user">Usuario</strong>
                    <time className="date">{comentario.fecha}</time>
                  </div>
                  <p className="review-body">{comentario.texto}</p>
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
