import React, { useEffect, useState } from "react";

import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from "../../api/productos";

import { listarBoletas } from "../../api/boletas";
import { useNavigate } from "react-router-dom";

// Normalizamos producto de backend → frontend
function normalize(p = {}) {
  return {
    id: p.id ?? "",
    code: p.codigo ?? "",
    name: p.nombre ?? "",
    priceCLP: p.precio ?? 0,
    category: p.categoria ?? "",
    image: p.imagen ?? "",
    description: p.descripcion ?? "",
    stock: p.stock ?? 0,
    onOffer: p.destacado ?? false,
  };
}

function fmtCLP(n) {
  const num = Number(n || 0);
  try { return num.toLocaleString("es-CL"); } catch { return String(num); }
}

const EMPTY = {
  id: "",
  code: "",
  name: "",
  priceCLP: "",
  category: "",
  image: "",
  description: "",
  stock: "",
  onOffer: false,
};

export default function AdminPanel() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [q, setQ] = useState("");

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  // NUEVO: ventas del backend
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    const ok = sessionStorage.getItem("isLoggedIn") === "true";
    const admin = sessionStorage.getItem("isAdmin") === "true";
    setIsAdmin(ok && admin);
    if (!(ok && admin)) {
      navigate("/login");
      return;
    }

    refresh();

    // Cargar boletas para dashboard
    listarBoletas()
      .then((data) => setVentas(data))
      .catch((err) => console.error("Error cargando ventas:", err));

  }, []);

  const refresh = () => {
    obtenerProductos().then(data => {
      const items = data.map(normalize);

      // Categorías dinámicas según productos
      const categories = [...new Set(items.map(p => p.category).filter(Boolean))];
      setCats(categories);

      // Filtrado por búsqueda
      setProducts(
        items.filter(p =>
          p.name.toLowerCase().includes(q.toLowerCase()) ||
          p.category.toLowerCase().includes(q.toLowerCase()) ||
          p.code.toLowerCase().includes(q.toLowerCase())
        )
      );
    });
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const startCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startEdit = (p) => {
    const n = normalize(p);
    setEditing(n.id);
    setForm({
      id: n.id,
      code: n.code,
      name: n.name,
      priceCLP: n.priceCLP,
      category: n.category,
      image: n.image,
      description: n.description,
      stock: n.stock,
      onOffer: n.onOffer,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      codigo: form.code,
      nombre: form.name,
      precio: Number(form.priceCLP),
      categoria: form.category,
      imagen: form.image,
      descripcion: form.description,
      stock: Number(form.stock),
      destacado: form.onOffer,
    };

    try {
      if (editing) {
        await actualizarProducto(editing, payload);
      } else {
        await crearProducto(payload);
      }

      refresh();
      setForm(EMPTY);
      setEditing(null);
      alert("✅ Guardado correctamente");

    } catch (err) {
      alert("❌ Error: " + err.message);
    }
  };

  const onDelete = async (id) => {
    if (confirm("¿Eliminar producto?")) {
      await eliminarProducto(id);
      refresh();
    }
  };

  if (!isAdmin) return null;

  return (
    <main className="wrap" style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem" }}>

      <h2>⚙️ Panel Admin — Productos</h2>

      {/* BUSCADOR */}
      <div style={{ margin: "1rem 0", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <input
          className="form-input"
          placeholder="Buscar por nombre/código/categoría…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ flex: 1, minWidth: 240 }}
        />
        <button className="btn" onClick={refresh}>Buscar</button>
        <button className="btn btn-secondary" onClick={startCreate}>Nuevo</button>
      </div>

      {/* FORMULARIO */}
      <form onSubmit={onSubmit} className="review-form" style={{ marginTop: "1rem" }}>
        <div className="label">Código</div>
        <input name="code" value={form.code} onChange={onChange} className="form-input" />

        <div className="label">Nombre</div>
        <input name="name" value={form.name} onChange={onChange} required className="form-input" />

        <div className="label">Precio CLP</div>
        <input type="number" name="priceCLP" value={form.priceCLP} onChange={onChange} required className="form-input" />

        <div className="label">Categoría</div>
        <input
          name="category"
          list="cats"
          value={form.category}
          onChange={onChange}
          required
          className="form-input"
        />
        <datalist id="cats">
          {cats.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>

        <div className="label">Stock</div>
        <input type="number" name="stock" value={form.stock} onChange={onChange} className="form-input" />

        <div className="label">URL Imagen</div>
        <input name="image" value={form.image} onChange={onChange} className="form-input" />

        <div className="label">Descripción</div>
        <textarea name="description" value={form.description} onChange={onChange} className="review-text" />

        <label className="checkline" style={{ marginTop: "0.5rem" }}>
          <input type="checkbox" name="onOffer" checked={form.onOffer} onChange={onChange} />
          <span>En oferta</span>
        </label>

        <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.8rem", flexWrap: "wrap" }}>
          <button className="btn" type="submit">
            {editing ? "💾 Guardar cambios" : "➕ Crear producto"}
          </button>
          {editing && (
            <button className="btn btn-secondary" type="button" onClick={() => {
              setEditing(null);
              setForm(EMPTY);
            }}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* LISTADO DE PRODUCTOS */}
      <div className="carrito-items" style={{ marginTop: "2rem" }}>
        {products.length === 0 ? (
          <p className="muted">Sin resultados…</p>
        ) : (
          products.map((p) => (
            <div key={p.id} className="carrito-item"
              style={{ display: "grid", gridTemplateColumns: "80px 1fr auto", gap: "1rem" }}>
              <img
                src={p.image || "https://via.placeholder.com/80?text=IMG"}
                alt={p.name}
                style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }}
              />
              <div style={{ textAlign: "left" }}>
                <strong>{p.name}</strong> {p.code && <span className="muted">({p.code})</span>}
                <div className="muted">{p.category}</div>
                <div>${fmtCLP(p.priceCLP)} CLP</div>
                {p.onOffer && <div style={{ color: "#39FF14" }}>En oferta</div>}
              </div>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                <button className="btn" onClick={() => startEdit(p)}>✏️ Editar</button>
                <button className="btn btn-secondary" onClick={() => onDelete(p.id)}>🗑️ Eliminar</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DASHBOARD DE VENTAS */}
      <h2 style={{ marginTop: "3rem" }}>📊 Ventas Registradas</h2>

      <div style={{ marginTop: "1rem" }}>
        {ventas.length === 0 ? (
          <p className="muted">Aún no hay ventas registradas.</p>
        ) : (
          ventas.map((v) => (
            <div
              key={v.id}
              style={{
                background: "rgba(255,255,255,0.05)",
                padding: "1.5rem",
                borderRadius: "12px",
                marginBottom: "1rem",
                borderLeft: "4px solid #39FF14",
              }}
            >
              <h3>🧾 Boleta #{v.id}</h3>

              <p><strong>Cliente:</strong> {v.emailUsuario}</p>
              <p><strong>Total:</strong> ${v.total.toLocaleString("es-CL")}</p>
              <p><strong>Fecha:</strong> {v.fecha.replace("T", " a las ")}</p>

              <details style={{ marginTop: "1rem" }}>
                <summary style={{ cursor: "pointer", color: "#39FF14" }}>
                  Ver detalles ▼
                </summary>

                <div style={{ marginTop: "1rem", paddingLeft: "1rem" }}>
                  {v.detalles.map((d) => (
                    <div
                      key={d.id}
                      style={{
                        marginBottom: "1rem",
                        padding: "0.8rem",
                        background: "rgba(255,255,255,0.03)",
                        borderRadius: "8px",
                      }}
                    >
                      <p><strong>{d.nombre}</strong></p>
                      <p>Precio: ${d.precio.toLocaleString("es-CL")}</p>
                      <p>Cantidad: {d.cantidad}</p>
                      <p>Subtotal: ${d.subtotal.toLocaleString("es-CL")}</p>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          ))
        )}
      </div>

    </main>
  );
}
