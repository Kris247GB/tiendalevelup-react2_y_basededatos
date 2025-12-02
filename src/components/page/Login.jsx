import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../services/AuthService';   // ← Usa tu AuthService
import api from '../../api/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (!email || !password) {
      setMessage('Por favor completa todos los campos');
      setMessageType('error');
      setIsLoading(false);
      return;
    }

    try {
      // 📌 1. LOGIN → backend
      const data = await login(email, password);
      const { token, email: emailFromApi } = data;

      // 📌 2. Guardar token
      if (rememberMe) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }

      // 📌 3. Obtener perfil del usuario
      const perfilRes = await api.get("/usuario/perfil");
      const perfil = perfilRes.data;

      // 📌 4. Guardar datos del perfil (sessionStorage)
      sessionStorage.setItem("userData", JSON.stringify(perfil));
      sessionStorage.setItem("isLoggedIn", "true");

      setMessage('¡Inicio de sesión exitoso! Redirigiendo...');
      setMessageType('success');

      setTimeout(() => navigate('/perfil'), 1500);

    } catch (error) {
      console.error("Error login:", error);

      const backendMessage =
        error?.error ||
        error?.message ||
        "Error al iniciar sesión";

      setMessage(backendMessage);
      setMessageType('error');

      // limpiar tokens inválidos
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("isLoggedIn");
      sessionStorage.removeItem("userData");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="animated-bg"></div>

      <div className="login-container">

        {/* Logo */}
        <div className="login-logo">
          <i className="fas fa-gamepad logo-icon"></i>
          <h1 className="login-title">LEVEL-UP GAMER</h1>
          <p className="login-subtitle">Accede a tu cuenta gamer</p>
        </div>

        {/* Mensaje */}
        {message && (
          <div
            className={`message ${messageType}`}
            style={{
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              textAlign: 'center',
              background: messageType === 'success' ? '#39FF14' : '#ff6b6b',
              color: messageType === 'success' ? '#000' : '#fff',
              fontWeight: 'bold',
            }}
          >
            {message}
          </div>
        )}

        {/* Formulario */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <div className="input-container">
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="tu@email.com"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <i className="fas fa-envelope input-icon"></i>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Contraseña</label>
            <div className="input-container">
              <input
                type="password"
                id="password"
                className="form-input"
                placeholder="Tu contraseña"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <i className="fas fa-lock input-icon"></i>
            </div>
          </div>

          {/* Recordarme */}
          <div className="remember-container">
            <div className="checkbox-group">
              <div className="custom-checkbox">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="checkmark"></span>
              </div>
              <label className="checkbox-label" htmlFor="rememberMe">
                Recordarme
              </label>
            </div>
            <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            <i className="fas fa-sign-in-alt"></i>
            <span>{isLoading ? 'Iniciando...' : 'Iniciar Sesión'}</span>
            {isLoading && <div className="loading"></div>}
          </button>
        </form>

        <div className="register-link">
          <p className="muted" style={{ marginTop: '1rem' }}>
            ¿Aún no tienes cuenta?{' '}
            <Link to="/registro"><strong>¡Únete a Level-Up Gamer!</strong></Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
