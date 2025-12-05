import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/AuthService";

const Registro = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mayor18, setMayor18] = useState(false);
  const [codigoReferente, setCodigoReferente] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones del front
    if (!nombre || !email || !password) {
      setMessage("Por favor completa todos los campos obligatorios");
      setMessageType("error");
      return;
    }

    if (!mayor18) {
      setMessage("Debes confirmar que eres mayor de 18 años");
      setMessageType("error");
      return;
    }

    if (password.length < 6) {
      setMessage("La contraseña debe tener al menos 6 caracteres");
      setMessageType("error");
      return;
    }

    try {
      const registroData = {
        nombre,
        email,
        password,
        mayor18,
        codigoReferente: codigoReferente || null,
        preferencias: "consolas"
      };

      const resp = await register(registroData);

      setMessage(
        `¡Cuenta creada exitosamente! Tu código de referido es: ${resp.codigoReferido}`
      );
      setMessageType("success");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const msg = err.error || "Error al registrar usuario";
      setMessage(msg);
      setMessageType("error");
    }
  };

  return (
    <main className="wrap">
      <section className="auth-box">
        <h2>Crear nueva cuenta</h2>

        {message && (
          <div
            style={{
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              textAlign: "center",
              background: messageType === "success" ? "#39FF14" : "#ff6b6b",
              color: messageType === "success" ? "#000" : "#fff",
              fontWeight: "bold",
            }}
          >
            {message}
          </div>
        )}

        <form className="form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="reg-nombre">Nombre completo</label>
          <input
            id="reg-nombre"
            type="text"
            placeholder="Tu nombre y apellido"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <label htmlFor="reg-email">Correo electrónico</label>
          <input
            id="reg-email"
            type="email"
            placeholder="tucorreo@ejemplo.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="reg-pass">Contraseña</label>
          <input
            id="reg-pass"
            type="password"
            placeholder="Mínimo 6 caracteres"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="checkline">
            <input
              id="reg-18"
              type="checkbox"
              checked={mayor18}
              onChange={(e) => setMayor18(e.target.checked)}
            />
            <label htmlFor="reg-18">Declaro ser mayor de 18 años</label>
          </div>

          <label htmlFor="reg-ref">Código de referente (opcional)</label>
          <input
            id="reg-ref"
            type="text"
            placeholder="Ej: AB12CD"
            value={codigoReferente}
            onChange={(e) => setCodigoReferente(e.target.value)}
          />

          <button className="btn" type="submit">
            Crear cuenta
          </button>
        </form>

        <p className="muted" style={{ marginTop: "1rem" }}>
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login">
            <strong>Log in</strong>
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Registro;
