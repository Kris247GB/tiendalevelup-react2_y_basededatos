
export const gamification = {
  levels: [
    { level: 1, name: "Novato", minPoints: 0, maxPoints: 99, discount: 0 },
    { level: 2, name: "Jugador", minPoints: 100, maxPoints: 299, discount: 5 },
    { level: 3, name: "Veterano", minPoints: 300, maxPoints: 599, discount: 10 },
    { level: 4, name: "Experto", minPoints: 600, maxPoints: 999, discount: 15 },
    { level: 5, name: "Leyenda", minPoints: 1000, maxPoints: Infinity, discount: 20 }
  ],

  getUserLevel(points) {
    for (let level of this.levels) {
      if (points >= level.minPoints && points <= level.maxPoints) {
        return level;
      }
    }
    return this.levels[0];
  },

  addPoints(userId, points) {
    const currentPoints = parseInt(this.getPoints(userId)) || 0;
    const newPoints = currentPoints + points;
    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    userData.levelUpPoints = newPoints;
    sessionStorage.setItem('userData', JSON.stringify(userData));
    return newPoints;
  },

  getPoints(userId) {
    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    return userData.levelUpPoints || 0;
  }
};


export function generarCodigoReferido() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let codigo = '';
  for (let i = 0; i < 6; i++) {
    codigo += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return codigo;
}


export const carrito = {
  items: [],

  init() {
    const carritoGuardado = sessionStorage.getItem('carrito');
    if (carritoGuardado) {
      try {
        this.items = JSON.parse(carritoGuardado);
      } catch (e) {
        console.error('Error al cargar carrito:', e);
        this.items = [];
      }
    }
  },

  agregar(producto) {
    const existente = this.items.find(item => item.codigo === producto.codigo);
    
    if (existente) {
      existente.cantidad++;
    } else {
      this.items.push({
        codigo: producto.codigo,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen || '',
        cantidad: 1
      });
    }
    
    this.guardar();
    return this.items.length;
  },

  eliminar(codigo) {
    this.items = this.items.filter(item => item.codigo !== codigo);
    this.guardar();
  },

  modificarCantidad(codigo, cantidad) {
    const item = this.items.find(i => i.codigo === codigo);
    if (item) {
      item.cantidad = parseInt(cantidad);
      if (item.cantidad <= 0) {
        this.eliminar(codigo);
      } else {
        this.guardar();
      }
    }
  },

  calcularTotal() {
    return this.items.reduce((total, item) => {
      return total + (item.precio * item.cantidad);
    }, 0);
  },

  aplicarDescuentos() {
    let total = this.calcularTotal();
    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    
    // Descuento DUOC
    if (userData.descuentoDuoc) {
      total *= (1 - userData.descuentoDuoc / 100);
    }
    
    // Descuento por nivel
    const level = gamification.getUserLevel(userData.levelUpPoints || 0);
    if (level.discount > 0) {
      total *= (1 - level.discount / 100);
    }
    
    return Math.max(0, total);
  },

  vaciar() {
    this.items = [];
    this.guardar();
  },

  guardar() {
    sessionStorage.setItem('carrito', JSON.stringify(this.items));
  },

  obtenerCantidadTotal() {
    return this.items.reduce((total, item) => total + item.cantidad, 0);
  }
};


export function mostrarMensaje(texto, tipo = 'info') {
  // Crear elemento de mensaje
  const mensaje = document.createElement('div');
  mensaje.className = `toast-message toast-${tipo}`;
  mensaje.textContent = texto;
  
  mensaje.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    z-index: 9999;
    max-width: 400px;
    font-weight: 600;
    animation: slideInRight 0.5s ease-out;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  `;

  // Aplicar colores según tipo
  if (tipo === 'success') {
    mensaje.style.background = 'rgba(57, 255, 20, 0.2)';
    mensaje.style.border = '1px solid #39FF14';
    mensaje.style.color = '#39FF14';
  } else if (tipo === 'error') {
    mensaje.style.background = 'rgba(255, 107, 107, 0.2)';
    mensaje.style.border = '1px solid #ff6b6b';
    mensaje.style.color = '#ff6b6b';
  } else {
    mensaje.style.background = 'rgba(30, 144, 255, 0.2)';
    mensaje.style.border = '1px solid #1E90FF';
    mensaje.style.color = '#1E90FF';
  }

  document.body.appendChild(mensaje);

  // Remover después de 5 segundos
  setTimeout(() => {
    mensaje.style.animation = 'slideOutRight 0.5s ease-out';
    setTimeout(() => mensaje.remove(), 500);
  }, 5000);
}


export function verificarAutenticacion() {
  return sessionStorage.getItem('isLoggedIn') === 'true';
}


export function validarEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validarPassword(password) {
  return password.length >= 6;
}

export function validarNombre(nombre) {
  return nombre.trim().length >= 3;
}


if (typeof window !== 'undefined') {
  window.carrito = carrito;
  window.gamification = gamification;
  window.mostrarMensaje = mostrarMensaje;
  window.verificarAutenticacion = verificarAutenticacion;
}


export default {
  carrito,
  gamification,
  mostrarMensaje,
  verificarAutenticacion,
  generarCodigoReferido,
  validarEmail,
  validarPassword,
  validarNombre
};