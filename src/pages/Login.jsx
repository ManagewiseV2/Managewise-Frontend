import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import './Login.css';

export default function Auth() {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [showContent, setShowContent] = useState(false);
  
  // Estados para los datos del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState(''); // 🚨 NUEVO: El nombre de usuario único

  // Estados para UX (Errores y Carga)
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleAuth = (mode) => {
    setError(''); // Limpiamos errores al cambiar de pantalla
    setIsRegister(mode);
    setTimeout(() => {
      setShowContent(mode);
    }, 400);
  };

  // 🚨 LÓGICA DE LOGIN REAL
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8090/api/v1/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        // 🔐 ¡MAGIA! Guardamos el Token VIP en el navegador
        localStorage.setItem('jwt_token', data.token);
        localStorage.setItem('current_username', username); // Para saludar al usuario en el header
        
        navigate('/projects'); 
      } else {
        setError(data.error || 'Credenciales inválidas');
      }
    } catch (err) {
      setError('Error de conexión con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  // 🚨 LÓGICA DE REGISTRO REAL
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8090/api/v1/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fullName: name, 
          username: username, 
          email: email, 
          password: password 
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Cuenta creada exitosamente. Por favor, inicia sesión.');
        // Usamos tu animación para volver al Login automáticamente
        toggleAuth(false);
      } else {
        setError(data.error || 'Error al crear la cuenta. Verifica los datos.');
      }
    } catch (err) {
      setError('Error de conexión con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`auth-page ${isRegister ? 'is-register' : ''}`}>
      
      {/* SECCIÓN DE LA IMAGEN */}
      <div className="visual-section">
        <div className="visual-overlay"></div>
        <div className="visual-content">
          <h1>ManageWise</h1>
          <p>Acelera la colaboración y mantén el control total de tus proyectos de desarrollo de software.</p>
        </div>
      </div>

      {/* SECCIÓN DEL FORMULARIO */}
      <div className="form-section">
        <div className="auth-card">
          
          {/* 🚨 Mensaje de error global */}
          {error && (
            <div style={{ padding: '10px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center', fontWeight: 'bold' }}>
              {error}
            </div>
          )}

          {!showContent ? (
            <div className="animate-fade">
              <h2>Bienvenido</h2>
              <p className="auth-subtitle">Ingresa para continuar</p>
              
              <form onSubmit={handleLogin} style={{ width: '100%' }}>
                <div className="field-container">
                  <label>Nombre de Usuario</label>
                  <InputText value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Ej: Tekilez" required />
                </div>

                <div className="field-container">
                  <label>Contraseña</label>
                  <Password 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    toggleMask 
                    feedback={false} 
                    placeholder="••••••••"
                    required
                  />
                </div>

                <Button 
                    label={isLoading ? "Iniciando..." : "Iniciar Sesión"} 
                    icon={isLoading ? "pi pi-spin pi-spinner" : ""}
                    disabled={isLoading}
                    type="submit" 
                    style={{ 
                        width: '100%', display: 'flex', justifyContent: 'center', 
                        padding: '1.2rem', backgroundColor: '#f97316', border: 'none', 
                        color: 'white', fontSize: '1.2rem', fontWeight: '900', 
                        borderRadius: '8px', marginTop: '1.5rem'
                    }} 
                />
              </form>
              
              <p className="switch-text">
                ¿No tienes cuenta? <span className="switch-btn" onClick={() => toggleAuth(true)}>Regístrate aquí</span>
              </p>
            </div>
          ) : (
            <div className="animate-fade">
              <h2>Crear Cuenta</h2>
              <p className="auth-subtitle">Únete a ManageWise hoy</p>
              
              <form onSubmit={handleRegister} style={{ width: '100%' }}>
                <div className="field-container">
                  <label>Nombre Completo</label>
                  <InputText value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" required />
                </div>

                <div className="field-container">
                  <label>Nombre de Usuario</label>
                  <InputText value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Ej: Tekilez" required />
                </div>

                <div className="field-container">
                  <label>Correo Electrónico</label>
                  <InputText value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com" required type="email" />
                </div>

                <div className="field-container">
                  <label>Contraseña</label>
                  <Password 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      toggleMask 
                      placeholder="••••••••"
                      promptLabel="Elige una contraseña segura"
                      weakLabel="Débil"
                      mediumLabel="Media"
                      strongLabel="Fuerte"
                      required
                  />
                </div>

                <Button 
                    label={isLoading ? "Registrando..." : "Registrarse"} 
                    icon={isLoading ? "pi pi-spin pi-spinner" : ""}
                    disabled={isLoading}
                    type="submit" 
                    style={{ 
                        width: '100%', display: 'flex', justifyContent: 'center', 
                        padding: '1.2rem', backgroundColor: '#f97316', border: 'none', 
                        color: 'white', fontSize: '1.2rem', fontWeight: '900', 
                        borderRadius: '8px', marginTop: '1.5rem'
                    }} 
                />
              </form>
              
              <p className="switch-text">
                ¿Ya tienes cuenta? <span className="switch-btn" onClick={() => toggleAuth(false)}>Inicia sesión</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}