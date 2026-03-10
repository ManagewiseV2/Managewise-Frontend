import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Avatar } from 'primereact/avatar';
import { Dialog } from 'primereact/dialog';
import './Profile.css';

export default function Profile() {
    const navigate = useNavigate();

    // --- ESTADOS ---
    const [name, setName] = useState('Sergio André Gómez Vallejos');
    const [email, setEmail] = useState('sergio@gmail.com');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    // --- ACCIONES ---
    const handleSave = () => {
        alert("Perfil actualizado correctamente");
    };

    const handleLogout = () => {
        navigate('/login');
    };

    const confirmAccountDeletion = () => {
        alert("Tu cuenta ha sido eliminada. Serás redirigido al inicio.");
        setDeleteModalOpen(false);
        navigate('/login');
    };

    // ==========================================
    // FOOTER DEL MODAL CORREGIDO (Alineación y Color)
    // ==========================================
    const deleteModalFooter = (
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Button 
                label="Cancelar Eliminación" 
                icon="pi pi-times" 
                onClick={() => setDeleteModalOpen(false)} 
                className="p-button-text" 
                style={{ color: '#64748b', fontWeight: 'bold', padding: '0.8rem 1rem' }} 
            />
            <Button 
                label="Sí, Eliminar Permanentemente" 
                icon="pi pi-check" 
                onClick={confirmAccountDeletion} 
                className="p-button-danger" 
                style={{ padding: '0.8rem 1.5rem' }}
                autoFocus 
            />
        </div>
    );

    return (
        <div className="profile-wrapper">
            <nav className="projects-navbar">
                <div className="brand-logo" style={{cursor:'pointer'}} onClick={() => navigate('/projects')}>ManageWise</div>
                <Button label="Volver a Proyectos" icon="pi pi-arrow-left" className="p-button-text p-button-plain text-white" onClick={() => navigate('/projects')} />
            </nav>

            <main className="profile-main">
                <div className="profile-container">
                    <div className="profile-header-card">
                        <div className="avatar-section">
                            <Avatar label="SA" size="xlarge" shape="circle" className="profile-big-avatar" />
                            <Button label="Cambiar Foto" icon="pi pi-camera" className="p-button-outlined p-button-secondary p-button-sm" />
                        </div>
                        <div className="profile-title-info">
                            <h2>Mi Perfil</h2>
                            <p>Administra tu información personal y la seguridad de tu cuenta.</p>
                        </div>
                    </div>

                    <div className="profile-body-grid">
                        {/* DATOS PERSONALES */}
                        <div className="settings-card">
                            <h3>Información Básica</h3>
                            <hr />
                            <div className="form-group">
                                <label>Nombre Completo</label>
                                <InputText value={name} onChange={(e) => setName(e.target.value)} className="w-full" />
                            </div>
                            <div className="form-group">
                                <label>Correo Electrónico</label>
                                <InputText type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full" />
                            </div>
                            <Button label="Guardar Cambios" className="p-button-orange mt-3" onClick={handleSave} />
                        </div>

                        {/* SEGURIDAD */}
                        <div className="settings-card">
                            <h3>Seguridad</h3>
                            <hr />
                            <div className="form-group">
                                <label>Contraseña Actual</label>
                                <Password value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} toggleMask className="w-full" inputClassName="w-full" feedback={false} />
                            </div>
                            <div className="form-group">
                                <label>Nueva Contraseña</label>
                                <Password value={newPassword} onChange={(e) => setNewPassword(e.target.value)} toggleMask className="w-full" inputClassName="w-full" />
                            </div>
                            <Button label="Actualizar Contraseña" className="btn-dark mt-3" />
                        </div>

                        {/* ZONA DE PELIGRO Y LOGOUT */}
                        <div className="settings-card danger-zone">
                            <h3>Gestión de Cuenta</h3>
                            <hr />
                            <div className="danger-actions">
                                <Button label="Cerrar Sesión" icon="pi pi-sign-out" className="btn-dark" onClick={handleLogout} />
                                <div className="danger-divider"></div>
                                
                                <div className="delete-warning">
                                    <strong>Zona de Peligro:</strong> Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, asegúrate de estar seguro.
                                </div>
                                <Button label="Eliminar mi cuenta permanentemente" icon="pi pi-trash" className="p-button-danger" onClick={() => setDeleteModalOpen(true)} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
            <Dialog header="¿Eliminar cuenta?" visible={isDeleteModalOpen} style={{ width: '480px' }} footer={deleteModalFooter} onHide={() => setDeleteModalOpen(false)}>
                <div className="confirmation-content" style={{ display: 'flex', alignItems: 'flex-start', gap: '1.2rem', marginTop: '1rem' }}>
                    <i className="pi pi-exclamation-triangle" style={{ fontSize: '2.5rem', color: '#ef4444', marginTop: '0.2rem' }} />
                    <span style={{ fontSize: '1.1rem', lineHeight: '1.5', color: '#334155' }}>
                        Estás a punto de borrar tu cuenta en <strong>ManageWise</strong>. Todos tus datos, proyectos y configuraciones se perderán de forma irrecuperable.<br/><br/>¿Deseas continuar?
                    </span>
                </div>
            </Dialog>

        </div>
    );
}