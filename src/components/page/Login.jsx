import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../services/AuthService';
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
      // 1) Login backend
      const data = await login(email, password);
      const { token } = data;

      // 2) Obtener perfil real
      const perfilRes = await api.get("/usuario/perfil", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const perfil = perfilRes.data;

      const rol = perfil.rol || "USER";

      // 3) Guardar token y rol
      if (rememberMe) {
        localStorage.setItem("token", token);
        localStorage.setItem("userRol", rol);
        localStorage.setItem("userEmail", perfil.email);
        localStorage.setItem("userNombre", perfil.nombre || "");
      } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("userRol", rol);
        sessionStorage.setItem("userEmail", perfil.email);
        sessionStorage.setItem("userNombre", perfil.nombre || "");
      }

      sessionStorage.setItem("userData", JSON.stringify(perfil));
      sessionStorage.setItem("isLoggedIn", "true");

      setMessage('¡Inicio de sesión exitoso! Redirigiendo...');
      setMessageType('success');

      // 4) Redirigir
      setTimeout(() => {
        navigate('/perfil', { replace: true });
        window.location.reload(); // Forzar recarga para que AuthContext se actualice
      }, 500);

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
      localStorage.removeItem("userRol");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userNombre");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userRol");
      sessionStorage.removeItem("userEmail");
      sessionStorage.removeItem("userNombre");
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

        <div className="login-logo">
          <i className="fas fa-gamepad logo-icon"></i>
          <h1 className="login-title">LEVEL-UP GAMER</h1>
          <p className="login-subtitle">Accede a tu cuenta gamer</p>
        </div>

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
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            <i className="fas fa-sign-in-alt"></i>
            <span>{isLoading ? 'Iniciando...' : 'Iniciar Sesión'}</span>
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