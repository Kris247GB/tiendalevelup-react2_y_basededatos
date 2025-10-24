
const DB_KEY = "lug_db_v1";

const DEFAULT_PRODUCTS = [
  { codigo: 'JM001', nombre: 'Catan', precio: 29990, categoria: 'juegos-mesa',
    imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVZG1G_ZdkpPVHE9O8kqSNWPRHjKC3Vz9Sag&s',
    descripcion: 'Un clásico juego de estrategia para 3-4 jugadores.', stock: 15, destacado: true },
  { codigo: 'JM002', nombre: 'Carcassonne', precio: 24990, categoria: 'juegos-mesa',
    imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUNb5P5Cj9UCEVmLua1VI7Z81P79V4DtMu0Q&s',
    descripcion: 'Juego de fichas y construcción de paisajes medievales.', stock: 10, destacado: true },
  { codigo: 'CO001', nombre: 'PlayStation 5', precio: 549990, categoria: 'consolas',
    imagen: 'https://gsmpro.cl/cdn/shop/articles/16991bf65a7a52901d78b55fa36bddc8.jpg?v=1737343320',
    descripcion: 'Consola de nueva generación con gráficos impresionantes.', stock: 6 },
  { codigo: 'CG001', nombre: 'PC Gamer ASUS ROG Strix', precio: 1299990, categoria: 'computadores',
    imagen: 'https://dlcdnwebimgs.asus.com/files/media/6C1CAB30-D5C6-4D6E-90DC-B6A088360E12/V1/img/frame/01.jpg',
    descripcion: 'Potente equipo para los gamers más exigentes.', stock: 4 },
  { codigo: 'SG001', nombre: 'Silla Gamer Secretlab Titan', precio: 349990, categoria: 'sillas',
    imagen: 'https://http2.mlstatic.com/D_NQ_NP_2X_914372-MLC74645525288_022024-F.webp',
    descripcion: 'Soporte ergonómico y alta personalización.', stock: 9 },
  { codigo: 'MS001', nombre: 'Logitech G502 HERO', precio: 49990, categoria: 'mouse',
    imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx8x3VgC1Qy3HweVn7y0Iqk2rEPqnjKMBSTw&s',
    descripcion: 'Sensor de alta precisión y botones personalizables.', stock: 25 },
  { codigo: 'MP001', nombre: 'Razer Goliathus Extended Chroma', precio: 29990, categoria: 'mousepad',
    imagen: 'https://http2.mlstatic.com/D_NQ_NP_2X_977961-MLC53493427440_012023-F.webp',
    descripcion: 'Área de juego amplia con iluminación RGB personalizable.', stock: 22 },
  { codigo: 'PP001', nombre: 'Polera Gamer "Level-Up"', precio: 14990, categoria: 'poleras',
    imagen: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop',
    descripcion: 'Personaliza con tu gamer tag o diseño favorito.', stock: 40 }
];

function loadDB() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) {
      const seeded = { products: DEFAULT_PRODUCTS, lastUpdated: Date.now() };
      localStorage.setItem(DB_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw);
  } catch {
    return { products: [...DEFAULT_PRODUCTS], lastUpdated: Date.now(), volatile: true };
  }
}

function saveDB(db) {
  if (db?.volatile) return;
  const next = { ...db, lastUpdated: Date.now() };
  localStorage.setItem(DB_KEY, JSON.stringify(next));
}

export function listCategories() {
  const db = loadDB();
  const set = new Set(db.products.map(p => p.categoria));
  return ['todas', ...Array.from(set)];
}

export function getAllProducts({ q = '', category = 'todas', priceRange = 'todos' } = {}) {
  const db = loadDB();
  return db.products.filter(producto => {
    const cumpleBusqueda = q ? (
      producto.nombre.toLowerCase().includes(q.toLowerCase()) ||
      (producto.descripcion || '').toLowerCase().includes(q.toLowerCase()) ||
      producto.codigo.toLowerCase().includes(q.toLowerCase())
    ) : true;

    const cumpleCategoria = category === 'todas' || producto.categoria === category;

    let cumplePrecio = true;
    if (priceRange === 'bajo') cumplePrecio = producto.precio < 50000;
    else if (priceRange === 'medio') cumplePrecio = producto.precio >= 50000 && producto.precio <= 200000;
    else if (priceRange === 'alto') cumplePrecio = producto.precio > 200000;

    return cumpleBusqueda && cumpleCategoria && cumplePrecio;
  });
}

export function getByCode(codigo) {
  const db = loadDB();
  return db.products.find(p => p.codigo === codigo) || null;
}

export function createProduct(p) {
  const required = ['nombre', 'precio', 'categoria'];
  for (const k of required) if (p[k] == null || p[k] === '') throw new Error('Falta ' + k);

  const db = loadDB();
  const code = p.codigo && !db.products.some(x => x.codigo === p.codigo)
    ? p.codigo
    : generateNextCode(p.categoria, db.products);

  const nuevo = {
    codigo: code,
    nombre: p.nombre,
    precio: Number(p.precio),
    categoria: p.categoria,
    descripcion: p.descripcion || '',
    imagen: p.imagen || 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop',
    stock: p.stock ?? 0,
    destacado: !!p.destacado
  };
  db.products.push(nuevo);
  saveDB(db);
  return nuevo;
}

export function updateProduct(codigo, patch = {}) {
  const db = loadDB();
  const i = db.products.findIndex(p => p.codigo === codigo);
  if (i === -1) throw new Error('Producto no existe');
  db.products[i] = { ...db.products[i], ...patch };
  saveDB(db);
  return db.products[i];
}

export function deleteProduct(codigo) {
  const db = loadDB();
  const before = db.products.length;
  db.products = db.products.filter(p => p.codigo !== codigo);
  saveDB(db);
  return db.products.length < before;
}

export function resetToDefaults() {
  const seeded = { products: DEFAULT_PRODUCTS, lastUpdated: Date.now() };
  try { localStorage.setItem(DB_KEY, JSON.stringify(seeded)); } catch {}
  return seeded.products;
}

function generateNextCode(category, products) {
  const map = {
    'juegos-mesa': 'JM',
    'accesorios': 'AC',
    'consolas': 'CO',
    'computadores': 'CG',
    'sillas': 'SG',
    'mouse': 'MS',
    'mousepad': 'MP',
    'poleras': 'PP'
  };
  const prefix = map[category] || 'PR';
  const same = products.filter(p => (p.codigo || '').startsWith(prefix));
  const max = same.map(p => Number(String(p.codigo).replace(prefix, ''))).filter(n => !Number.isNaN(n)).reduce((a,b)=>Math.max(a,b), 0);
  return prefix + String(max + 1).padStart(3, '0');
}

export function formatPriceCLP(v) {
  return `$${Number(v).toLocaleString('es-CL')} CLP`;
}

export default {
  listCategories,
  getAllProducts,
  getByCode,
  createProduct,
  updateProduct,
  deleteProduct,
  resetToDefaults,
  formatPriceCLP
};
