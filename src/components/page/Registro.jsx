
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Registro = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mayor18, setMayor18] = useState(false);
  const [codigoReferido, setCodigoReferido] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  const generateReferralCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!nombre || !email || !password) {
      setMessage('Por favor completa todos los campos obligatorios');
      setMessageType('error');
      return;
    }

    if (!mayor18) {
      setMessage('Debes ser mayor de 18 años para registrarte');
      setMessageType('error');
      return;
    }

    if (password.length < 6) {
      setMessage('La contraseña debe tener al menos 6 caracteres');
      setMessageType('error');
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Por favor ingresa un email válido');
      setMessageType('error');
      return;
    }

    // Obtener usuarios existentes
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');

    // Verificar si el email ya existe
    if (usuarios.some(u => u.email === email)) {
      setMessage('Este email ya está registrado');
      setMessageType('error');
      return;
    }

    // Crear nuevo usuario
    const nuevoUsuario = {
      nombre,
      email,
      password,
      codigoReferido: generateReferralCode(),
      levelUpPoints: 0,
      descuentoDuoc: 0,
      preferencias: 'consolas',
      fechaRegistro: new Date().toISOString()
    };

    // Si ingresó un código de referido válido, darle puntos
    if (codigoReferido) {
      const referidor = usuarios.find(u => u.codigoReferido === codigoReferido.toUpperCase());
      if (referidor) {
        nuevoUsuario.levelUpPoints = 50; // Puntos de bienvenida por usar código
        referidor.levelUpPoints = (referidor.levelUpPoints || 0) + 100; // Puntos para quien refirió
        
        // Actualizar el referidor en el array
        const indexReferidor = usuarios.findIndex(u => u.codigoReferido === codigoReferido.toUpperCase());
        usuarios[indexReferidor] = referidor;
      }
    }

    // Verificar si es estudiante DUOC
    if (email.toLowerCase().includes('duoc') || email.toLowerCase().includes('@duocuc.cl')) {
      nuevoUsuario.descuentoDuoc = 20; // 20% de descuento
    }

    // Guardar usuario
    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    setMessage('¡Cuenta creada exitosamente! Redirigiendo al login...');
    setMessageType('success');

    // Usar la función de validaciones.js si está disponible
    if (typeof mostrarMensaje === 'function') {
      mostrarMensaje('¡Cuenta creada exitosamente!', 'success');
    }

    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  return (
    <main className="wrap">
      <section className="auth-box">
        <h2>Crear nueva cuenta</h2>

        {message && (
          <div 
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

          <label htmlFor="reg-ref">Código de referido (opcional)</label>
          <input 
            id="reg-ref" 
            type="text" 
            placeholder="Ej: AB12CD"
            value={codigoReferido}
            onChange={(e) => setCodigoReferido(e.target.value)}
          />

          <button className="btn" type="submit">Crear cuenta</button>
        </form>

        <p className="muted" style={{ marginTop: '1rem' }}>
          ¿Ya tienes una cuenta?
          {' '}
          <Link to="/login"><strong>Log in</strong></Link>
        </p>
      </section>
    </main>
  );
};

export default Registro;