import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Play = () => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const handleSubmitReview = (e) => {
    e.preventDefault();
    
    if (!rating || !reviewText.trim()) {
      alert('Por favor completa la calificación y escribe tu reseña');
      return;
    }

    alert('¡Gracias por tu reseña!');
    setRating(0);
    setReviewText('');
  };

  const agregarAlCarrito = () => {
    const producto = {
      codigo: 'CO001',
      nombre: 'PlayStation 5',
      precio: 549990,
      cantidad: 1
    };
    
    if (typeof window !== 'undefined' && window.carrito && typeof window.carrito.agregar === 'function') {
      window.carrito.agregar(producto);
      if (typeof window.mostrarMensaje === 'function') {
        window.mostrarMensaje('Producto agregado al carrito', 'success');
      } else {
        alert('Producto agregado al carrito');
      }
    } else {
      console.log('Producto agregado:', producto);
      alert('Producto agregado al carrito');
    }
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh' }}>
      <main className="detalle-producto" id="play-ps5">
        <div className="imagen">
          <img 
            src="https://gsmpro.cl/cdn/shop/articles/16991bf65a7a52901d78b55fa36bddc8.jpg?v=1737343320"
            alt="Consola PlayStation 5"
          />
        </div>

        <div className="info">
          <h2>PlayStation 5</h2>
          <p className="precio">$549.990 CLP</p>
          <p>
            La PlayStation 5 es la consola de última generación de Sony,
            que ofrece gráficos impresionantes y tiempos de carga ultrarápidos
            gracias a su disco SSD. Disfruta de una experiencia de juego inmersiva,
            soporte para Ray Tracing, retrocompatibilidad con PS4 y un mando DualSense
            con vibración háptica avanzada.
          </p>
          <ul>
            <li>CPU: AMD Ryzen Zen 2 (8 núcleos, 3.5GHz)</li>
            <li>GPU: 10.28 TFLOPs, arquitectura RDNA 2</li>
            <li>RAM: 16 GB GDDR6</li>
            <li>Almacenamiento: SSD ultra rápido 825 GB</li>
            <li>Resolución: 4K UHD / Hasta 120 FPS</li>
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

        <section id="reviews" className="reviews-card" aria-label="Reseñas del producto">
          <h2>Reseñas</h2>

          <div className="reviews-meta">
            <span className="stars" style={{ '--value': 4.5 }} aria-label="4.5 de 5"></span>
            <strong className="avg">4.5</strong>
            <span className="of">/5</span>
            <span className="count">· 128 reseñas</span>
          </div>

          <form className="review-form" onSubmit={handleSubmitReview}>
            <label className="label">Tu calificación</label>

            <div className="star-input" aria-label="Selecciona tu calificación">
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
                  <label htmlFor={`rate-${star}`} title={`${star} estrella${star > 1 ? 's' : ''}`}>
                    ★
                  </label>
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
            <button type="submit" className="btn-resena">Publicar reseña</button>
          </form>

          <ul className="reviews-list">
            <li className="review-item">
              <div className="review-head">
                <span className="stars" style={{ '--value': 5 }} aria-label="5 de 5"></span>
                <strong className="user">Camila R.</strong>
                <time className="date" dateTime="2025-08-28">28/08/2025</time>
              </div>
              <p className="review-body">
                Excelente calidad y entrega rápida. El control se siente sólido y la respuesta es precisa.
              </p>
            </li>

            <li className="review-item">
              <div className="review-head">
                <span className="stars" style={{ '--value': 4 }} aria-label="4 de 5"></span>
                <strong className="user">Matías G.</strong>
                <time className="date" dateTime="2025-08-21">21/08/2025</time>
              </div>
              <p className="review-body">
                Todo bien, aunque el empaque llegó un poco abollado. El producto funciona perfecto.
              </p>
            </li>

            <li className="review-item">
              <div className="review-head">
                <span className="stars" style={{ '--value': 4.5 }} aria-label="4.5 de 5"></span>
                <strong className="user">Valentina S.</strong>
                <time className="date" dateTime="2025-08-12">12/08/2025</time>
              </div>
              <p className="review-body">
                Muy buen precio y atención. Volvería a comprar aquí sin dudarlo.
              </p>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Play;