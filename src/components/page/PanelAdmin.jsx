import React, { useEffect, useState } from "react";
import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../../api/productos";

import { listarBoletas } from "../../api/boletas";
import { obtenerEventos, crearEvento, eliminarEvento } from "../../api/Eventos";
import { useAuth } from "../../context/AuthContext";

const normalize = (p = {}) => ({
  id: p.id ?? "",
  code: p.codigo ?? "",
  name: p.nombre ?? "",
  priceCLP: p.precio ?? 0,
  category: p.categoria ?? "",
  image: p.imagen ?? "",
  description: p.descripcion ?? "",
  stock: p.stock ?? 0,
  onOffer: p.destacado ?? false,
});

const fmtCLP = (n) =>
  Number(n || 0).toLocaleString("es-CL", { minimumFractionDigits: 0 });

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

const EMPTY_EVENTO = {
  titulo: "",
  descripcion: "",
  fecha: "",
  lugar: "",
  imagen: "",
};

export default function AdminPanel() {
  const { user } = useAuth();

  // Estados de Productos
  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  // Estados de Ventas
  const [ventas, setVentas] = useState([]);

  // Estados de Eventos
  const [eventos, setEventos] = useState([]);
  const [formEvento, setFormEvento] = useState(EMPTY_EVENTO);

  // Tab activa
  const [activeTab, setActiveTab] = useState("productos");

  useEffect(() => {
    if (!user) return;

    refresh();
    listarBoletas().then(setVentas);
    refreshEventos();
  }, [user]);

  const refresh = () => {
    obtenerProductos().then((data) => {
      const items = data.map(normalize);

      setCats([...new Set(items.map((p) => p.category).filter(Boolean))]);

      setProducts(
        items.filter(
          (p) =>
            p.name.toLowerCase().includes(q.toLowerCase()) ||
            p.category.toLowerCase().includes(q.toLowerCase()) ||
            p.code.toLowerCase().includes(q.toLowerCase())
        )
      );
    });
  };

  const refreshEventos = () => {
    obtenerEventos().then(setEventos);
  };

  // ============ PRODUCTOS ============
  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const startCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startEdit = (p) => {
    const n = normalize(p);
    setEditing(n.id);
    setForm(n);
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
      alert("❌ Error: " + (err.response?.data?.error || err.message));
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("¿Eliminar producto?")) return;

    try {
      await eliminarProducto(id);
      refresh();
    } catch (err) {
      alert("Error eliminando producto");
    }
  };

  // ============ EVENTOS ============
  const onChangeEvento = (e) => {
    const { name, value } = e.target;
    setFormEvento((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmitEvento = async (e) => {
    e.preventDefault();

    try {
      await crearEvento(formEvento);
      refreshEventos();
      setFormEvento(EMPTY_EVENTO);
      alert("✅ Evento creado correctamente");
    } catch (err) {
      alert("❌ Error: " + (err.response?.data?.error || err.message));
    }
  };

  const onDeleteEvento = async (id) => {
    if (!window.confirm("¿Eliminar evento?")) return;

    try {
      await eliminarEvento(id);
      refreshEventos();
    } catch (err) {
      alert("Error eliminando evento");
    }
  };

  return (
    <main className="wrap" style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem" }}>
      <h2>⚙️ Panel Admin</h2>

      {/* TABS */}
      <div style={{ 
        display: "flex", 
        gap: "1rem", 
        marginBottom: "2rem",
        borderBottom: "2px solid rgba(255,255,255,0.1)"
      }}>
        <button
          onClick={() => setActiveTab("productos")}
          style={{
            padding: "1rem 2rem",
            background: activeTab === "productos" ? "#39FF14" : "transparent",
            color: activeTab === "productos" ? "#000" : "#fff",
            border: "none",
            borderBottom: activeTab === "productos" ? "3px solid #39FF14" : "none",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1rem"
          }}
        >
          📦 Productos
        </button>
        <button
          onClick={() => setActiveTab("eventos")}
          style={{
            padding: "1rem 2rem",
            background: activeTab === "eventos" ? "#39FF14" : "transparent",
            color: activeTab === "eventos" ? "#000" : "#fff",
            border: "none",
            borderBottom: activeTab === "eventos" ? "3px solid #39FF14" : "none",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1rem"
          }}
        >
          🎮 Eventos
        </button>
        <button
          onClick={() => setActiveTab("ventas")}
          style={{
            padding: "1rem 2rem",
            background: activeTab === "ventas" ? "#39FF14" : "transparent",
            color: activeTab === "ventas" ? "#000" : "#fff",
            border: "none",
            borderBottom: activeTab === "ventas" ? "3px solid #39FF14" : "none",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1rem"
          }}
        >
          📊 Ventas
        </button>
      </div>

      {/* ============ TAB PRODUCTOS ============ */}
      {activeTab === "productos" && (
        <>
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

          <form onSubmit={onSubmit} className="review-form" style={{ marginTop: "1rem" }}>
            <div className="label">Código</div>
            <input name="code" value={form.code} onChange={onChange} className="form-input" />

            <div className="label">Nombre</div>
            <input name="name" value={form.name} onChange={onChange} required className="form-input" />

            <div className="label">Precio CLP</div>
            <input
              type="number"
              name="priceCLP"
              value={form.priceCLP}
              onChange={onChange}
              required
              className="form-input"
            />

            <div className="label">Categoría</div>
            <input name="category" list="cats" value={form.category} onChange={onChange} required className="form-input" />
            <datalist id="cats">{cats.map((c) => <option key={c} value={c} />)}</datalist>

            <div className="label">Stock</div>
            <input type="number" name="stock" value={form.stock} onChange={onChange} className="form-input" />

            <div className="label">URL Imagen</div>
            <input name="image" value={form.image} onChange={onChange} className="form-input" />

            {form.image && (
              <img
                src={form.image}
                alt="preview"
                style={{ width: 120, marginTop: 10, borderRadius: 8 }}
                onError={(e) => (e.target.src = "https://via.placeholder.com/120")}
              />
            )}

            <div className="label">Descripción</div>
            <textarea name="description" value={form.description} onChange={onChange} className="review-text" />

            <label className="checkline">
              <input type="checkbox" name="onOffer" checked={form.onOffer} onChange={onChange} />
              <span>En oferta</span>
            </label>

            <div style={{ display: "flex", gap: "0.6rem", marginTop: 10 }}>
              <button className="btn" type="submit">
                {editing ? "💾 Guardar cambios" : "➕ Crear producto"}
              </button>

              {editing && (
                <button className="btn btn-secondary" type="button" onClick={() => setForm(EMPTY)}>
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <div style={{ marginTop: "2rem" }}>
            {products.length === 0 ? (
              <p className="muted">Sin resultados…</p>
            ) : (
              products.map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "80px 1fr auto",
                    gap: "1rem",
                    padding: "1rem",
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: "8px",
                    marginBottom: "1rem",
                  }}
                >
                  <img
                    src={p.image || "https://via.placeholder.com/80"}
                    alt={p.name}
                    style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }}
                  />

                  <div>
                    <strong>{p.name}</strong> {p.code && <span className="muted">({p.code})</span>}
                    <div className="muted">{p.category}</div>
                    <div>${fmtCLP(p.priceCLP)} CLP</div>
                    {p.onOffer && <div style={{ color: "#39FF14" }}>En oferta</div>}
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button className="btn" onClick={() => startEdit(p)}>✏️ Editar</button>
                    <button className="btn btn-secondary" onClick={() => onDelete(p.id)}>🗑️ Eliminar</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* ============ TAB EVENTOS ============ */}
      {activeTab === "eventos" && (
        <>
          <h2>🎮 Gestión de Eventos</h2>

          <form onSubmit={onSubmitEvento} className="review-form" style={{ marginTop: "1rem" }}>
            <div className="label">Título</div>
            <input 
              name="titulo" 
              value={formEvento.titulo} 
              onChange={onChangeEvento} 
              required 
              className="form-input" 
            />

            <div className="label">Descripción</div>
            <textarea 
              name="descripcion" 
              value={formEvento.descripcion} 
              onChange={onChangeEvento} 
              className="review-text" 
            />

            <div className="label">Fecha</div>
            <input 
              type="date" 
              name="fecha" 
              value={formEvento.fecha} 
              onChange={onChangeEvento} 
              required 
              className="form-input" 
            />

            <div className="label">Lugar</div>
            <input 
              name="lugar" 
              value={formEvento.lugar} 
              onChange={onChangeEvento} 
              required 
              className="form-input" 
            />

            <div className="label">URL Imagen</div>
            <input 
              name="imagen" 
              value={formEvento.imagen} 
              onChange={onChangeEvento} 
              className="form-input" 
            />

            {formEvento.imagen && (
              <img
                src={formEvento.imagen}
                alt="preview"
                style={{ width: 120, marginTop: 10, borderRadius: 8 }}
                onError={(e) => (e.target.src = "https://via.placeholder.com/120")}
              />
            )}

            <button className="btn" type="submit" style={{ marginTop: 10 }}>
              ➕ Crear Evento
            </button>
          </form>

          <div style={{ marginTop: "2rem" }}>
            {eventos.length === 0 ? (
              <p className="muted">No hay eventos creados</p>
            ) : (
              eventos.map((ev) => (
                <div
                  key={ev.id}
                  style={{
                    padding: "1.5rem",
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: "12px",
                    marginBottom: "1rem",
                    borderLeft: "4px solid #39FF14",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                    <div style={{ flex: 1 }}>
                      <h3>{ev.titulo}</h3>
                      <p>{ev.descripcion}</p>
                      <p><strong>📅 Fecha:</strong> {ev.fecha}</p>
                      <p><strong>📍 Lugar:</strong> {ev.lugar}</p>
                    </div>
                    {ev.imagen && (
                      <img
                        src={ev.imagen}
                        alt={ev.titulo}
                        style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 8 }}
                      />
                    )}
                  </div>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => onDeleteEvento(ev.id)}
                    style={{ marginTop: "1rem" }}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* ============ TAB VENTAS ============ */}
      {activeTab === "ventas" && (
        <>
          <h2>📊 Ventas Registradas</h2>

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
        </>
      )}
    </main>
  );
}