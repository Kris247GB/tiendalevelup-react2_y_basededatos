import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { obtenerProductoPorId } from "../../api/productos";
import carritoReal from "../Atoms/carritoReal";
import { mostrarMensaje } from "../Atoms/Validaciones";

const API_URL = "http://localhost:8081/api";

const Detalles = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [comentarios, setComentarios] = useState([]);

  const [respuestaActiva, setRespuestaActiva] = useState(null);
  const [textoRespuesta, setTextoRespuesta] = useState("");

  
  useEffect(() => {
    obtenerProductoPorId(id)
      .then((data) => setProducto(data))
      .catch((err) => console.error("Error al cargar producto:", err))
      .finally(() => setLoading(false));

    fetch(`${API_URL}/productos/${id}/comentarios`)
      .then((res) => res.json())
      .then((data) => setComentarios(data))
      .catch((err) => console.error("Error al cargar comentarios:", err));
  }, [id]);

  
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

  
  const handleSubmitReview = (e) => {
    e.preventDefault();

    if (!rating || !reviewText.trim()) {
      alert("Completa la calificación y escribe tu reseña");
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
      .then((res) => res.json())
      .then((nuevoComentario) => {
        setComentarios([...comentarios, nuevoComentario]);
        setRating(0);
        setReviewText("");
      });
  };


  const darLike = (comentarioId) => {
    fetch(`${API_URL}/productos/comentarios/${comentarioId}/like`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((comentarioActualizado) => {
        setComentarios(
          comentarios.map((c) =>
            c.id === comentarioActualizado.id ? comentarioActualizado : c
          )
        );
      });
  };


  const enviarRespuesta = (comentarioId) => {
    if (!textoRespuesta.trim()) return;

    fetch(`${API_URL}/productos/comentarios/${comentarioId}/respuesta`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(textoRespuesta),
    })
      .then((res) => res.json())
      .then((comentarioActualizado) => {
        setComentarios(
          comentarios.map((c) =>
            c.id === comentarioActualizado.id ? comentarioActualizado : c
          )
        );

        setRespuestaActiva(null);
        setTextoRespuesta("");
      });
  };

  if (loading) return <p style={{ color: "white" }}>Cargando…</p>;
  if (!producto) return <p style={{ color: "red" }}>Producto no encontrado</p>;

  return (
    <div style={{ width: "100%", minHeight: "100vh" }}>
      <main className="detalle-producto">
        
        {}
        <div className="imagen">
          <img src={producto.imagen} alt={producto.nombre} />
        </div>

        {}
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

        {}
        <section id="reviews" className="reviews-card">
          <h2>Reseñas</h2>

          {}
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

          {}
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

                  {}
                  <button
                    className="btn-like"
                    onClick={() => darLike(c.id)}
                  >
                    ❤️ {c.likes}
                  </button>

                  {}
                  <button
                    className="btn-responder"
                    onClick={() =>
                      setRespuestaActiva(respuestaActiva === c.id ? null : c.id)
                    }
                  >
                    💬 Responder
                  </button>

                  {}
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

                  {}
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
