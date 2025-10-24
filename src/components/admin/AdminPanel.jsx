
import React, { useEffect, useState } from "react";
import {
  getAllProducts,
  listCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../data/store";
import { useNavigate } from "react-router-dom";

function normalize(p = {}) {
  return {
    code: p.code ?? p.codigo ?? "",
    name: p.name ?? p.nombre ?? "",
    priceCLP: p.priceCLP ?? p.precio ?? 0,
    category: p.category ?? p.categoria ?? "",
    image: p.image ?? p.imagen ?? "",
    description: p.description ?? p.descripcion ?? "",
    stock: p.stock ?? p.cantidad ?? 0,
    onOffer: p.onOffer ?? p.destacado ?? false,
    offerPriceCLP: p.offerPriceCLP ?? p.precioOferta ?? undefined,
  };
}


function fmtCLP(n) {
  const num = Number(n || 0);
  try { return num.toLocaleString("es-CL"); } catch { return String(num); }
}

const EMPTY = {
  code: "",
  name: "",
  priceCLP: "",
  category: "",
  image: "",
  description: "",
  stock: "",
  onOffer: false,
  offerPriceCLP: "",
};

export default function AdminPanel() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState(null); 
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    const ok = sessionStorage.getItem("isLoggedIn") === "true";
    const admin = sessionStorage.getItem("isAdmin") === "true";
    setIsAdmin(ok && admin);
    if (!(ok && admin)) {
      navigate("/login");
      return;
    }
    try { setCats((listCategories() || []).filter(c => c !== "Todas")); } catch {}
    refresh();
  }, []);

  const refresh = () => {
    const all = getAllProducts({ q }) || [];
    setProducts(all.map(normalize));
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
    setEditing(n.code || p.codigo || ""); 
    setForm({
      code: n.code,
      name: n.name,
      priceCLP: n.priceCLP || "",
      category: n.category,
      image: n.image,
      description: n.description,
      stock: n.stock || "",
      onOffer: !!n.onOffer,
      offerPriceCLP: n.offerPriceCLP || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const payload = {

      code: form.code || undefined,
      codigo: form.code || undefined,

      name: (form.name || "").trim(),
      nombre: (form.name || "").trim(),

      priceCLP: Number(form.priceCLP || 0),
      precio: Number(form.priceCLP || 0),

      category: (form.category || "").trim(),
      categoria: (form.category || "").trim(),

      image: (form.image || "").trim(),
      imagen: (form.image || "").trim(),

      description: (form.description || "").trim(),
      descripcion: (form.description || "").trim(),

      stock: Number(form.stock || 0),

      onOffer: !!form.onOffer,
      destacado: !!form.onOffer, // compat
      offerPriceCLP: form.onOffer ? Number(form.offerPriceCLP || 0) : undefined,
      precioOferta: form.onOffer ? Number(form.offerPriceCLP || 0) : undefined,
    };

    if (!payload.nombre) {
      alert("❌ Falta nombre");
      return;
    }
    if (!payload.categoria) {
      alert("❌ Falta categoría");
      return;
    }
    if (payload.precio <= 0) {
      alert("❌ El precio debe ser mayor a 0");
      return;
    }
    if (form.onOffer && payload.precioOferta >= payload.precio) {
      alert("❌ El precio de oferta debe ser menor al precio normal");
      return;
    }

    try {
      if (editing) {
        updateProduct(editing, payload);
      } else {
        createProduct(payload);
      }
      refresh();
      setForm(EMPTY);
      setEditing(null);
      alert("✅ Guardado");
    } catch (err) {
      alert("❌ " + err.message);
    }
  };
  // ⬆️ ⬆️ FIN PATCH SUBMIT ⬆️ ⬆️

  const onDelete = (code) => {
    if (confirm(`¿Eliminar producto ${code}?`)) {
      deleteProduct(code);
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
        <div className="label">Código (opcional)</div>
        <input name="code" value={form.code} onChange={onChange} placeholder="Ej: JM010" className="form-input" />

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
          placeholder="Ej: Juegos de Mesa"
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

        {form.onOffer && (
          <>
            <div className="label">Precio Oferta CLP</div>
            <input type="number" name="offerPriceCLP" value={form.offerPriceCLP} onChange={onChange} className="form-input" />
          </>
        )}

        <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.8rem", flexWrap: "wrap" }}>
          <button className="btn" type="submit">{editing ? "💾 Guardar cambios" : "➕ Crear producto"}</button>
          {editing && (
            <button className="btn btn-secondary" type="button" onClick={() => { setEditing(null); setForm(EMPTY); }}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* LISTADO */}
      <div className="carrito-items" style={{ marginTop: "2rem" }}>
        {products.length === 0 ? (
          <p className="muted">Sin resultados…</p>
        ) : (
          products.map((p) => {
            const price = p.onOffer && p.offerPriceCLP != null ? p.offerPriceCLP : p.priceCLP;
            return (
              <div key={p.code || p.name} className="carrito-item" style={{ display: "grid", gridTemplateColumns: "80px 1fr auto", gap: "1rem" }}>
                <img src={p.image || "https://via.placeholder.com/80x80?text=IMG"} alt={p.name} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }} />
                <div style={{ textAlign: "left" }}>
                  <strong>{p.name}</strong> {p.code && <span className="muted">({p.code})</span>}
                  <div className="muted">{p.category}</div>
                  <div>${fmtCLP(price)} CLP</div>
                  {p.onOffer && <div style={{ color: "#39FF14" }}>En oferta</div>}
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                  <button className="btn" onClick={() => startEdit(p)}>✏️ Editar</button>
                  <button className="btn btn-secondary" onClick={() => onDelete(p.code)}>🗑️ Eliminar</button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
