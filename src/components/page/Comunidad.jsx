import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8081/api/comunidad";

const Comunidad = () => {
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [posts, setPosts] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState({});

  // 🔥 Cargar todos los posts + sus comentarios
  useEffect(() => {
    fetch(`${API_URL}/posts`)
      .then((r) => r.json())
      .then(async (data) => {
        // cargar comentarios por cada post
        const postsConComentarios = await Promise.all(
          data.map(async (post) => {
            const res = await fetch(`${API_URL}/posts/${post.id}/comentarios`);
            const comentarios = await res.json();
            return { ...post, comentarios };
          })
        );

        setPosts(postsConComentarios);
      })
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
        setPosts([{ ...data, comentarios: [] }, ...posts]);
        setTitulo("");
        setContenido("");
      });
  };

  // 💬 Comentar un post
  const comentarPost = (postId) => {
    const contenido = nuevoComentario[postId];
    const user = sessionStorage.getItem("userName") || "Usuario";

    if (!contenido || contenido.trim() === "") return;

    fetch(`${API_URL}/posts/${postId}/comentarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        autor: user,
        texto: contenido,
      }),
    })
      .then((r) => r.json())
      .then((comentarioNuevo) => {
        setPosts(
          posts.map((p) =>
            p.id === postId
              ? { ...p, comentarios: [...p.comentarios, comentarioNuevo] }
              : p
          )
        );

        setNuevoComentario({ ...nuevoComentario, [postId]: "" });
      });
  };

  // ❤️ Like comentario
  const likeComentario = (commentId, postId) => {
    fetch(`${API_URL}/comentarios/${commentId}/like`, { method: "POST" })
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

  // 💬 Responder a un comentario
  const responderComentario = (commentId, postId, texto) => {
    if (texto.trim() === "") return;

    fetch(`${API_URL}/comentarios/${commentId}/respuesta`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(texto),
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
      <h1 style={{ textAlign: "center", color: "#39FF14" }}>
        💬 Comunidad Gamer
      </h1>

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

      {/* POSTS */}
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
          <h2>{post.titulo}</h2>
          <p>{post.contenido}</p>
          <small style={{ opacity: 0.7 }}>
            Publicado por <strong>{post.autor}</strong>
          </small>

          <hr style={{ margin: "15px 0", opacity: 0.2 }} />

          <h4>Comentarios</h4>

          {post.comentarios.map((c) => (
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

              {/* RESPUESTAS */}
              {c.respuestas.map((r, index) => (
                <div
                  key={index}
                  style={{
                    marginLeft: "15px",
                    marginTop: "5px",
                    padding: "5px",
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "5px",
                  }}
                  >
                  ↪️ {r}
                </div>
              ))}

              {/* FORM RESPUESTA */}
              <input
                type="text"
                placeholder="Responder..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    responderComentario(c.id, post.id, e.target.value);
                    e.target.value = "";
                  }
                }}
                style={{
                  marginTop: "5px",
                  width: "100%",
                  padding: "6px",
                  borderRadius: "8px",
                }}
              />
            </div>
          ))}

          {/* NUEVO COMENTARIO */}
          <textarea
            placeholder="Escribe un comentario..."
            value={nuevoComentario[post.id] || ""}
            onChange={(e) =>
              setNuevoComentario({ ...nuevoComentario, [post.id]: e.target.value })
            }
            style={{
              width: "100%",
              height: "60px",
              borderRadius: "8px",
              padding: "8px",
              marginTop: "10px",
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
      ))}
    </div>
  );
};

export default Comunidad;
