import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:8081/api/comunidad";

export default function Comunidad() {
  const [posts, setPosts] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");

  useEffect(() => {
    cargarPosts();
  }, []);

  const cargarPosts = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setPosts(data);
  };

  const publicar = async (e) => {
    e.preventDefault();

    const usuario = JSON.parse(sessionStorage.getItem("userData"));

    if (!usuario) {
      alert("Debes iniciar sesión para publicar.");
      return;
    }

    const nuevoPost = {
      autor: usuario.nombre,
      titulo,
      contenido
    };

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoPost)
    });

    setTitulo("");
    setContenido("");
    cargarPosts();
  };

  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
      <h2>💬 Comunidad Gamer</h2>

      <form onSubmit={publicar} style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Título del post"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "1rem" }}
        />
        <textarea
          placeholder="Escribe tu experiencia gamer..."
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", height: "150px" }}
        />
        <button className="btn-agregar" type="submit">
          Publicar
        </button>
      </form>

      <section>
        {posts.length === 0 ? (
          <p>No hay publicaciones aún.</p>
        ) : (
          posts.map((p) => (
            <article key={p.id} style={{
              background: "rgba(255,255,255,0.05)",
              padding: "1rem",
              borderRadius: "10px",
              marginBottom: "1rem"
            }}>
              <h3>{p.titulo}</h3>
              <p>{p.contenido}</p>
              <small>Publicado por {p.autor} — {p.fecha}</small>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
