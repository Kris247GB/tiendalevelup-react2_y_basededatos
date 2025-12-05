import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  obtenerCarrito,
  eliminar,
  modificarCantidad,
  vaciar,
  calcularTotal
} from '../Atoms/carritoReal';

import { mostrarMensaje } from '../Atoms/Validaciones';
import { scroller } from 'react-scroll';

import { registrarBoleta } from '../../api/boletas';
import api from "../../api/api";

const Carrito = () => {
  const [items, setItems] = useState([]);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = sessionStorage.getItem("userData");

    if (!saved) {
      mostrarMensaje("Debes iniciar sesión para ver el carrito", "error");
      navigate("/login");
      return;
    }

    setUserData(JSON.parse(saved));
    setItems(obtenerCarrito());
  }, []);

  const handleEliminar = (codigo) => {
    const nuevo = eliminar(codigo);
    setItems(nuevo);
    mostrarMensaje('Producto eliminado del carrito', 'success');
  };

  const handleCantidad = (codigo, cantidad) => {
    const nuevo = modificarCantidad(codigo, Number(cantidad));
    setItems(nuevo);
  };

  const handleVaciar = () => {
    if (window.confirm("¿Seguro deseas vaciar el carrito?")) {
      vaciar();
      setItems([]);
      mostrarMensaje("Carrito vaciado", "success");
    }
  };

  const handleComprar = async () => {
    if (items.length === 0) {
      mostrarMensaje("El carrito está vacío", "error");
      return;
    }

    const subtotal = calcularTotal();
    const descuentoLevel = userData.levelUpPoints || 0;
    const descuentoDuoc = userData.descuentoDuoc || 0;

    const totalFinal = Math.round(
      subtotal * (1 - descuentoLevel / 100) * (1 - descuentoDuoc / 100)
    );

    const puntosGanados = Math.floor(totalFinal / 1000);

    try {
      const nuevaBoleta = await registrarBoleta({
        emailUsuario: userData.email,
        total: totalFinal,
        detalles: items.map(i => ({
          productoId: i.id,
          nombre: i.nombre,
          precio: i.precio,
          cantidad: i.cantidad,
          subtotal: i.precio * i.cantidad
        }))
      });

      // 🔥 ACTUALIZAR PUNTOS EN BACKEND
      const nuevosPuntos = (userData.levelUpPoints || 0) + puntosGanados;

      await api.put(`/usuario/${userData.email}/actualizar-puntos`, {
        levelUpPoints: nuevosPuntos
      });

      // 🔥 GUARDAR NUEVO PERFIL EN FRONTEND
      const actualizado = {
        ...userData,
        levelUpPoints: nuevosPuntos
      };

      sessionStorage.setItem("userData", JSON.stringify(actualizado));
      setUserData(actualizado);

      mostrarMensaje(
        `¡Compra realizada! 🎉 Ganaste ${puntosGanados} puntos`,
        'success'
      );

      vaciar();
      setItems([]);

      setTimeout(() => navigate("/perfil"), 1500);

    } catch (err) {
      console.error("Error al comprar:", err);
      mostrarMensaje("No se pudo completar la compra", "error");
    }
  };

  const continuarComprando = () => {
    navigate("/");
    setTimeout(() => {
      scroller.scrollTo("catalogo", {
        duration: 500,
        smooth: true,
        offset: -100,
      });
    }, 300);
  };

  const subtotal = calcularTotal();

  return (
    <main className="wrap" style={{ maxWidth: "1200px", padding: "2rem" }}>
      <section>
        <h2>🛒 Mi Carrito de Compras</h2>

        {userData && (
          <div style={{
            background: "rgba(57,255,20,0.1)",
            padding: "1rem",
            borderRadius: "8px",
            border: "1px solid #39FF14",
            marginBottom: "1rem"
          }}>
            <p><strong>Puntos actuales:</strong> {userData.levelUpPoints}</p>
            <p><strong>Descuento DUOC:</strong> {userData.descuentoDuoc}%</p>
          </div>
        )}

        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <p style={{ fontSize: "1.5rem" }}>Tu carrito está vacío</p>
            <button className="btn" onClick={continuarComprando}>Ir a comprar</button>
          </div>
        ) : (
          <>
            <div className="carrito-items">
              {items.map(item => (
                <div key={item.id} className="carrito-item"
                  style={{
                    display: "flex",
                    gap: "1rem",
                    padding: "1rem",
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "8px",
                    marginBottom: "1rem"
                  }}>
                  <img src={item.imagen} style={{ width: "100px", borderRadius: "8px" }} />
                  <div style={{ flex: 1 }}>
                    <h3>{item.nombre}</h3>
                    <p>${item.precio.toLocaleString("es-CL")}</p>
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={item.cantidad}
                    onChange={e => handleCantidad(item.codigo, e.target.value)}
                    style={{ width: "60px" }}
                  />
                  <p style={{ fontWeight: "bold" }}>
                    ${(item.precio * item.cantidad).toLocaleString("es-CL")}
                  </p>
                  <button className="btn btn-danger" onClick={() => handleEliminar(item.codigo)}>
                    🗑️ Eliminar
                  </button>
                </div>
              ))}
            </div>

            <div style={{ padding: "2rem", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}>
              <h3>Resumen de compra</h3>
              <p>Subtotal: ${subtotal.toLocaleString("es-CL")}</p>

              <button className="btn" onClick={handleComprar}>💳 Finalizar Compra</button>
              <button className="btn btn-secondary" onClick={handleVaciar}>Vaciar Carrito</button>
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default Carrito;
