import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../../api/api";  // <--- USAR API CENTRALIZADO
import carritoReal from "../Atoms/carritoReal";
import { mostrarMensaje } from "../Atoms/Validaciones";
import { obtenerProductoPorId } from "../../api/productos";

const Detalles = () => {
  const { id } = useParams();

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [comentarios, setComentarios] = useState([]);

  const [respuestaActiva, setRespuestaActiva] = useState(null);
  const [textoRespuesta, setTextoRespuesta] = useState("");

  // Cargar producto + comentarios
  useEffect(() => {
    obtenerProductoPorId(id)
      .then((data) => setProducto(data))
      .catch((err) => console.error("Error al cargar producto:", err))
      .finally(() => setLoading(false));

    api.get(`/productos/${id}/comentarios`)
      .then((res) => setComentarios(res.data))
      .catch((err) => console.error("Error cargando comentarios:", err));

  }, [id]);

  // Carrito
  const agregarAlCarrito = () => {
    carritoReal.agregar({
      id: producto.id,
      codigo: producto.codigo,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
    });

    mostrarMensaje("Producto agregado al carrito", "success");
  };

  // Crear comentario
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!rating || !reviewText.trim()) {
      alert("Completa la calificación y escribe tu reseña");
      return;
    }

    const comentario = {
      rating,
      texto: reviewText,
    };

    try {
      const res = await api.post(`/productos/${producto.id}/comentarios`, comentario);
      setComentarios([...comentarios, res.data]);

      setRating(0);
      setReviewText("");

    } catch (err) {
      console.error("Error publicando reseña:", err);
    }
  };

  // Dar like
  const darLike = async (comentarioId) => {
    try {
      const res = await api.post(`/productos/comentarios/${comentarioId}/like`);
      const actualizado = res.data;

      setComentarios(
        comentarios.map((c) => (c.id === actualizado.id ? actualizado : c))
      );
    } catch (err) {
      console.error("Error dando like:", err);
    }
  };

  // Responder comentario
  const enviarRespuesta = async (comentarioId) => {
    if (!textoRespuesta.trim()) return;

    try {
      const res = await api.post(
        `/productos/comentarios/${comentarioId}/respuesta`,
        textoRespuesta,
        { headers: { "Content-Type": "application/json" } }
      );

      const actualizado = res.data;

      setComentarios(
        comentarios.map((c) => (c.id === actualizado.id ? actualizado : c))
      );

      setRespuestaActiva(null);
      setTextoRespuesta("");

    } catch (err) {
      console.error("Error enviando respuesta:", err);
    }
  };

  if (loading) return <p style={{ color: "white" }}>Cargando…</p>;
  if (!producto) return <p style={{ color: "red" }}>Producto no encontrado</p>;

  return (
    <div style={{ width: "100%", minHeight: "100vh" }}>
      <main className="detalle-producto">

        {/* Imagen */}
        <div className="imagen">
          <img src={producto.imagen} alt={producto.nombre} />
        </div>

        {/* Info */}
        <div className="info">
          <h2>{producto.nombre}</h2>
          <p className="precio">
            ${producto.precio.toLocaleString("es-CL")} CLP
          </p>

          <button className="btn-agregar" onClick={agregarAlCarrito}>
            Agregar al carrito
          </button>

          <Link to="/#catalogo" className="btn-volver">
            ← Volver al catálogo
          </Link>
        </div>

        {/* Comentarios */}
        <section id="reviews" className="reviews-card">
          <h2>Reseñas</h2>

          {/* Formulario nueva reseña */}
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

          {/* Lista de comentarios */}
          <ul className="reviews-list">
            {comentarios.length === 0 ? (
              <p>No hay reseñas aún.</p>
            ) : (
              comentarios.map((c) => (
                <li className="review-item" key={c.id}>
                  <div className="review-head">
                    <span className="stars" style={{ "--value": c.rating }} />
                    <strong className="user">Usuario</strong>
                    <time className="date">{c.fecha}</time>
                  </div>

                  <p className="review-body">{c.texto}</p>

                  <button className="btn-like" onClick={() => darLike(c.id)}>
                    ❤️ {c.likes}
                  </button>

                  <button
                    className="btn-responder"
                    onClick={() =>
                      setRespuestaActiva(respuestaActiva === c.id ? null : c.id)
                    }
                  >
                    💬 Responder
                  </button>

                  {respuestaActiva === c.id && (
                    <div className="respuesta-form">
                      <textarea
                        placeholder="Escribe una respuesta..."
                        value={textoRespuesta}
                        onChange={(e) => setTextoRespuesta(e.target.value)}
                      />
                      <button onClick={() => enviarRespuesta(c.id)}>
                        Enviar respuesta
                      </button>
                    </div>
                  )}

                  {c.respuestas.length > 0 && (
                    <ul className="respuestas-list">
                      {c.respuestas.map((r, idx) => (
                        <li key={idx} className="respuesta-item">
                          <p>↳ {r}</p>
                        </li>
                      ))}
                    </ul>
                  )}
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
