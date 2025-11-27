const CARRITO_KEY = "carrito_levelup";

export function obtenerCarrito() {
  const data = localStorage.getItem(CARRITO_KEY);
  return data ? JSON.parse(data) : [];
}

export function guardarCarrito(carrito) {
  localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
}

export function agregar(producto) {
  const carrito = obtenerCarrito();
  const item = carrito.find(p => p.id === producto.id);

  if (item) {
    item.cantidad += 1;
  } else {
    carrito.push({
      id: producto.id,
      codigo: producto.codigo,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad: 1
    });
  }

  guardarCarrito(carrito);
  return carrito;
}

export function eliminar(codigo) {
  let carrito = obtenerCarrito();
  carrito = carrito.filter(item => item.codigo !== codigo);
  guardarCarrito(carrito);
  return carrito;
}

export function modificarCantidad(codigo, cantidad) {
  const carrito = obtenerCarrito();
  const item = carrito.find(p => p.codigo === codigo);
  if (item) {
    item.cantidad = cantidad;
    if (item.cantidad < 1) {
      return eliminar(codigo);
    }
  }
  guardarCarrito(carrito);
  return carrito;
}

export function vaciar() {
  guardarCarrito([]);
}

export function calcularTotal() {
  const carrito = obtenerCarrito();
  return carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
}

export function aplicarDescuentos(descuento = 0) {
  const total = calcularTotal();
  const final = total * (1 - descuento / 100);
  return Math.round(final);
}

export default {
  agregar,
  eliminar,
  modificarCantidad,
  vaciar,
  obtenerCarrito,
  calcularTotal,
  aplicarDescuentos
};
