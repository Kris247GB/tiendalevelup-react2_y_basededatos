import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8081/api/comunidad";

const Comunidad = () => {
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [posts, setPosts] = useState([]);
  const [respuestasTexto, setRespuestasTexto] = useState({});

  // 🔥 Cargar todos los posts al iniciar
  useEffect(() => {
    fetch(`${API_URL}/posts`)
      .then((r) => r.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Error cargando posts:", err));
  }, []);

  // 📝 Publicar nuevo post
  const enviarPost = () => {
    const user = sessionStorage.getItem("userName") || "Usuario Anónimo";

    const nuevoPost = {
      autor: user,
      titulo,
      contenido,
    };

    fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoPost),
    })
      .then((r) => r.json())
      .then((data) => {
        setPosts([data, ...posts]);
        setTitulo("");
        setContenido("");
      })
      .catch((err) => console.error("Error enviando post:", err));
  };

  // ❤️ Dar like al post
  const likePost = (postId) => {
    fetch(`${API_URL}/posts/${postId}/like`, { method: "POST" })
      .then((r) => r.json())
      .then((data) => {
        setPosts(posts.map((p) => (p.id === postId ? data : p)));
      });
  };

  // 💬 Comentar un post
  const comentarPost = (postId) => {
    const texto = respuestasTexto[postId];
    const user = sessionStorage.getItem("userName") || "Usuario";

    fetch(`${API_URL}/posts/${postId}/comentarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        autor: user,
        texto,
      }),
    })
      .then((r) => r.json())
      .then((nuevoComentario) => {
        setPosts(
          posts.map((p) =>
            p.id === postId
              ? { ...p, comentarios: [...p.comentarios, nuevoComentario] }
              : p
          )
        );
        setRespuestasTexto({ ...respuestasTexto, [postId]: "" });
      });
  };

  // ❤️ Like a un comentario
  const likeComentario = (commentId, postId) => {
    fetch(`${API_URL}/comentarios/${commentId}/like`, {
      method: "POST",
    })
      .then((r) => r.json())
      .then((updatedComment) => {
        setPosts(
          posts.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  comentarios: p.comentarios.map((c) =>
                    c.id === commentId ? updatedComment : c
                  ),
                }
              : p
          )
        );
      });
  };

  return (
    <div className="comunidad-container" style={{ padding: "2rem", color: "white" }}>
      <h1 style={{ textAlign: "center", color: "#39FF14" }}>💬 Comunidad Gamer</h1>

      {/* FORM NUEVO POST */}
      <div className="post-creator" style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Título del post"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "10px",
          }}
        />

        <textarea
          placeholder="Escribe tu experiencia gamer..."
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          style={{
            width: "100%",
            height: "120px",
            borderRadius: "8px",
            padding: "10px",
          }}
        />

        <button
          onClick={enviarPost}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            borderRadius: "8px",
            background: "#39FF14",
            color: "#000",
            fontWeight: "bold",
          }}
        >
          Publicar
        </button>
      </div>

      {/* POSTS LISTADOS */}
      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            background: "rgba(255,255,255,0.05)",
            padding: "1.5rem",
            borderRadius: "15px",
            marginBottom: "1.5rem",
            borderLeft: "4px solid #39FF14",
          }}
        >
          <h2 style={{ marginBottom: "5px" }}>{post.titulo}</h2>
          <p>{post.contenido}</p>
          <small style={{ opacity: 0.7 }}>
            Publicado por <strong>{post.autor}</strong> — {post.fecha}
          </small>

          <div style={{ marginTop: "10px" }}>
            <button
              onClick={() => likePost(post.id)}
              style={{
                background: "none",
                border: "none",
                color: "#39FF14",
                cursor: "pointer",
                fontSize: "18px",
              }}
            >
              ❤️ {post.likes}
            </button>
          </div>

          <hr style={{ margin: "15px 0", opacity: 0.2 }} />

          <h4>Comentarios</h4>

          {post.comentarios &&
            post.comentarios.map((c) => (
              <div
                key={c.id}
                style={{
                  background: "rgba(0,0,0,0.3)",
                  padding: "10px",
                  borderRadius: "8px",
                  marginTop: "10px",
                }}
              >
                <strong>{c.autor}</strong>
                <p>{c.texto}</p>

                <button
                  onClick={() => likeComentario(c.id, post.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#39FF14",
                  }}
                >
                  ❤️ {c.likes}
                </button>
              </div>
            ))}

          {/* NUEVO COMENTARIO */}
          <div style={{ marginTop: "10px" }}>
            <textarea
              placeholder="Responder..."
              value={respuestasTexto[post.id] || ""}
              onChange={(e) =>
                setRespuestasTexto({
                  ...respuestasTexto,
                  [post.id]: e.target.value,
                })
              }
              style={{
                width: "100%",
                height: "60px",
                borderRadius: "8px",
                padding: "8px",
              }}
            />

            <button
              onClick={() => comentarPost(post.id)}
              style={{
                marginTop: "5px",
                padding: "6px 15px",
                borderRadius: "8px",
                background: "#39FF14",
                color: "#000",
              }}
            >
              Comentar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Comunidad;
