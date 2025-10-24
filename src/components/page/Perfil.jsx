
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Perfil = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [preferencias, setPreferencias] = useState('consolas');
  const [mensaje, setMensaje] = useState('');
  const [userLevel, setUserLevel] = useState('Cargando...');
  const [userPoints, setUserPoints] = useState(0);
  const [userDiscount, setUserDiscount] = useState(0);
  const [codigoReferido, setCodigoReferido] = useState('Cargando...');
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar autenticación
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      if (typeof mostrarMensaje === 'function') {
        mostrarMensaje('Debes iniciar sesión para acceder a tu perfil', 'error');
      }
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }

    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    
    // Cargar información de gamificación
    const points = userData.levelUpPoints || 0;
    const level = (typeof gamification !== 'undefined' && typeof gamification.getUserLevel === 'function')
      ? gamification.getUserLevel(points)
      : { name: 'Nivel 0', level: 0, discount: 0 };
    
    setUserLevel(`${level.name} (Nivel ${level.level})`);
    setUserPoints(points);
    
    let totalDiscount = level.discount;
    if (userData.descuentoDuoc) {
      totalDiscount += userData.descuentoDuoc;
    }
    setUserDiscount(totalDiscount);
    
    // Mostrar código de referido
    setCodigoReferido(userData.codigoReferido || 'N/A');
    
    // Cargar datos del formulario
    setNombre(userData.nombre || '');
    setEmail(userData.email || '');
    setPreferencias(userData.preferencias || 'consolas');
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
    userData.nombre = nombre;
    userData.email = email;
    userData.preferencias = preferencias;
    
    sessionStorage.setItem('userData', JSON.stringify(userData));
    
    setMensaje('✅ Perfil actualizado correctamente');
    
    setTimeout(() => {
      setMensaje('');
    }, 3000);
  };

  const copiarCodigo = () => {
    navigator.clipboard.writeText(codigoReferido).then(() => {
      if (typeof mostrarMensaje === 'function') {
        mostrarMensaje('¡Código copiado al portapapeles!', 'success');
      }
    });
  };

  const cerrarSesion = () => {
    if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('userData');
      if (typeof mostrarMensaje === 'function') {
        mostrarMensaje('Sesión cerrada exitosamente', 'success');
      }
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }
  };

  return (
    <main className="wrap">
      {/* INFORMACIÓN DE GAMIFICACIÓN */}
      <section className="perfil" style={{ marginBottom: '2rem' }}>
        <h2>🏆 Tu Nivel y Puntos</h2>
        
        <div style={{
          textAlign: 'center',
          padding: '1.5rem',
          background: 'linear-gradient(135deg, #1E90FF, #39FF14)',
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <h3 style={{ fontSize: '2rem', margin: 0, color: '#000' }}>{userLevel}</h3>
          <p style={{ fontSize: '1.5rem', margin: '0.5rem 0', color: '#000', fontWeight: 'bold' }}>
            {userPoints} Puntos LevelUp
          </p>
          <p style={{ margin: 0, color: '#000', fontWeight: 600 }}>
            Descuento total: {userDiscount}%
          </p>
        </div>

        <div style={{
          background: '#1a1a1a',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <h3 style={{ color: '#39FF14', marginBottom: '1rem' }}>📊 Sistema de Niveles</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{
              padding: '1rem',
              background: '#111',
              borderRadius: '8px',
              borderLeft: '4px solid #666'
            }}>
              <strong style={{ color: '#666' }}>Nivel 1: Novato</strong> - 0-99 puntos (0% descuento)
            </div>
            <div style={{
              padding: '1rem',
              background: '#111',
              borderRadius: '8px',
              borderLeft: '4px solid #1E90FF'
            }}>
              <strong style={{ color: '#1E90FF' }}>Nivel 2: Jugador</strong> - 100-299 puntos (5% descuento)
            </div>
            <div style={{
              padding: '1rem',
              background: '#111',
              borderRadius: '8px',
              borderLeft: '4px solid #39FF14'
            }}>
              <strong style={{ color: '#39FF14' }}>Nivel 3: Veterano</strong> - 300-599 puntos (10% descuento)
            </div>
            <div style={{
              padding: '1rem',
              background: '#111',
              borderRadius: '8px',
              borderLeft: '4px solid #FFD54A'
            }}>
              <strong style={{ color: '#FFD54A' }}>Nivel 4: Experto</strong> - 600-999 puntos (15% descuento)
            </div>
            <div style={{
              padding: '1rem',
              background: '#111',
              borderRadius: '8px',
              borderLeft: '4px solid #FF6B6B'
            }}>
              <strong style={{ color: '#FF6B6B' }}>Nivel 5: Leyenda</strong> - 1000+ puntos (20% descuento)
            </div>
          </div>
        </div>

        <div style={{
          background: '#1a1a1a',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <h3 style={{ color: '#1E90FF', marginBottom: '1rem' }}>💰 Cómo Ganar Puntos</h3>
          <ul style={{ color: '#D3D3D3', lineHeight: 1.8 }}>
            <li>🛒 <strong>Compras:</strong> 1 punto por cada $1.000 gastados</li>
            <li>👥 <strong>Referencias:</strong> 100 puntos por cada amigo que registres con tu código</li>
            <li>⭐ <strong>Reseñas:</strong> 25 puntos por cada reseña publicada</li>
            <li>🎮 <strong>Eventos:</strong> Entre 150-300 puntos por asistir a eventos gamers</li>
          </ul>
        </div>

        <div style={{
          background: '#1a1a1a',
          padding: '1.5rem',
          borderRadius: '12px'
        }}>
          <h3 style={{ color: '#39FF14', marginBottom: '1rem' }}>🔗 Tu Código de Referido</h3>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <input 
              type="text" 
              readOnly 
              style={{
                flex: 1,
                minWidth: '150px',
                padding: '1rem',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                textAlign: 'center',
                background: '#111',
                border: '2px solid #1E90FF',
                borderRadius: '8px',
                color: '#39FF14'
              }}
              value={codigoReferido}
            />
            <button 
              onClick={copiarCodigo} 
              style={{
                padding: '1rem 1.5rem',
                background: '#1E90FF',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              📋 Copiar Código
            </button>
          </div>
          <p style={{
            marginTop: '1rem',
            color: '#D3D3D3',
            fontSize: '0.9rem'
          }}>
            ¡Comparte tu código con amigos! Ganan 50 puntos al registrarse y tú ganas 100 puntos por cada referido.
          </p>
        </div>
      </section>

      {/* FORMULARIO DE PERFIL */}
      <section className="perfil">
        <h2>📝 Editar Mi Perfil</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="nombre">Nombre completo</label>
          <input 
            type="text" 
            id="nombre" 
            name="nombre" 
            placeholder="Ingresa tu nombre" 
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <label htmlFor="email">Correo electrónico</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            placeholder="Ingresa tu correo" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="preferencias">Preferencias de compra</label>
          <select 
            id="preferencias" 
            name="preferencias"
            value={preferencias}
            onChange={(e) => setPreferencias(e.target.value)}
          >
            <option value="consolas">Consolas</option>
            <option value="pc">Computadores Gamers</option>
            <option value="accesorios">Accesorios</option>
            <option value="sillas">Sillas Gamers</option>
            <option value="ropa">Poleras/Polerones</option>
            <option value="juegos-mesa">Juegos de Mesa</option>
          </select>

          <button type="submit">Guardar cambios</button>
        </form>

        {mensaje && (
          <div 
            className="mensaje" 
            style={{
              display: 'block',
              color: '#39FF14',
              marginTop: '1rem',
              textAlign: 'center',
              fontWeight: 'bold'
            }}
          >
            {mensaje}
          </div>
        )}

        <div style={{
          marginTop: '2rem',
          paddingTop: '2rem',
          borderTop: '1px solid #222'
        }}>
          <button 
            onClick={cerrarSesion} 
            style={{
              width: '100%',
              padding: '1rem',
              background: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      </section>
    </main>
  );
};

export default Perfil;