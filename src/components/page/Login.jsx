
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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

  
    setTimeout(() => {
      
      const storedUsers = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const user = storedUsers.find(u => u.email === email && u.password === password);

      if (user) {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userData', JSON.stringify(user));
        
        if (rememberMe) {
          localStorage.setItem('rememberUser', email);
        }

        setMessage('¡Inicio de sesión exitoso! Redirigiendo...');
        setMessageType('success');

        setTimeout(() => {
          navigate('/perfil');
        }, 1500);
      } else {
        setMessage('Email o contraseña incorrectos');
        setMessageType('error');
      }

      setIsLoading(false);
    }, 1000);
  };

  return (
    <div>
      {/* Fondo animado */}
      <div className="animated-bg"></div>

      {/* Contenedor de login */}
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
            id="message" 
            className={`message ${messageType}`}
            style={{
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              textAlign: 'center',
              background: messageType === 'success' ? '#39FF14' : '#ff6b6b',
              color: messageType === 'success' ? '#000' : '#fff',
              fontWeight: 'bold'
            }}
          >
            {message}
          </div>
        )}

        {/* Formulario */}
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Email */}
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

          {/* Contraseña */}
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

          {/* Recordarme y olvidaste contraseña */}
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
              <label className="checkbox-label" htmlFor="rememberMe">Recordarme</label>
            </div>
            <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
          </div>

          {/* Botón de inicio de sesión */}
          <button 
            type="submit" 
            className="login-button" 
            disabled={isLoading}
          >
            <i className="fas fa-sign-in-alt"></i>
            <span>{isLoading ? 'Iniciando...' : 'Iniciar Sesión'}</span>
            {isLoading && <div className="loading"></div>}
          </button>
        </form>

        {/* Link de registro */}
        <div className="register-link">
          <p className="muted" style={{ marginTop: '1rem' }}>
            ¿Aún no tienes cuenta?
            {' '}
            <Link to="/registro">
              <strong>¡Únete a Level-Up Gamer!</strong>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;