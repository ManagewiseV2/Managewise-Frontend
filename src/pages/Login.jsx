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
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const toggleAuth = (mode) => {
    setIsRegister(mode);
    setTimeout(() => {
      setShowContent(mode);
    }, 400);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/projects'); 
  };

  const handleRegister = (e) => {
    e.preventDefault();
    toggleAuth(false);
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
          {!showContent ? (
            <div className="animate-fade">
              <h2>Bienvenido</h2>
              <p className="auth-subtitle">Ingresa para continuar</p>
              
              <form onSubmit={handleLogin} style={{ width: '100%' }}>
                <div className="field-container">
                  <label>Correo Electrónico</label>
                  <InputText value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com" required />
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

                {/* BOTÓN INDESTRUCTIBLE 1 */}
                <Button 
                    label="Iniciar Sesión" 
                    type="submit" 
                    style={{ 
                        width: '100%', 
                        display: 'flex', 
                        justifyContent: 'center', 
                        padding: '1.2rem', 
                        backgroundColor: '#f97316', 
                        border: 'none', 
                        color: 'white', 
                        fontSize: '1.2rem', 
                        fontWeight: '900', 
                        borderRadius: '8px',
                        marginTop: '1.5rem'
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

                {/* BOTÓN INDESTRUCTIBLE 2 */}
                <Button 
                    label="Registrarse" 
                    type="submit" 
                    style={{ 
                        width: '100%', 
                        display: 'flex', 
                        justifyContent: 'center', 
                        padding: '1.2rem', 
                        backgroundColor: '#f97316', 
                        border: 'none', 
                        color: 'white', 
                        fontSize: '1.2rem', 
                        fontWeight: '900', 
                        borderRadius: '8px',
                        marginTop: '1.5rem'
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