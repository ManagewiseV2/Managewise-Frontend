import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Avatar } from 'primereact/avatar';
import { Tag } from 'primereact/tag';
import './Projects.css';

export default function Projects() {
    const navigate = useNavigate();
    
    // --- ESTADOS DE MODALES ---
    const [isNewProjectModalOpen, setNewProjectModalOpen] = useState(false);
    const [isAiModalOpen, setAiModalOpen] = useState(false); // Modal de Planes PRO
    
    // --- ESTADOS DE DATOS ---
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectDesc, setNewProjectDesc] = useState('');
    const [projects, setProjects] = useState([
        { id: 1, name: 'E-Commerce App', role: 'Scrum Master', lastUpdated: 'Hace 2 horas' },
        { id: 2, name: 'Sistema de Ventas', role: 'Dev Team', lastUpdated: 'Hace 1 día' }
    ]);

    // CONFIGURACIÓN DE PLAN (Simulado)
    const PROJECT_LIMIT = 2; 

    const handleCreateProject = () => {
        if (projects.length >= PROJECT_LIMIT) {
            setNewProjectModalOpen(false);
            setAiModalOpen(true); // Bloqueo por plan superado
            return;
        }
        if (!newProjectName.trim()) return;

        const newProject = {
            id: Date.now(),
            name: newProjectName,
            role: 'Product Owner',
            lastUpdated: 'Justo ahora'
        };
        setProjects([...projects, newProject]);
        setNewProjectName('');
        setNewProjectDesc('');
        setNewProjectModalOpen(false);
    };

    const enterProject = () => navigate('/home');

    return (
        <div className="projects-wrapper">
            {/* BARRA DE NAVEGACIÓN SUPERIOR */}
            <nav className="projects-navbar">
                <div className="brand-logo">ManageWise</div>
                <div className="nav-right">
                    {/* Indicador de suscripción */}
                    <div className="plan-badge-container" onClick={() => setAiModalOpen(true)}>
                        <Tag value="Plan Light" severity="warning" icon="pi pi-bolt" className="plan-tag" />
                    </div>
                    <div className="user-nav-profile" onClick={() => navigate('/profile')}>
                        <span className="user-greeting">Hola, Sergio</span>
                        <Avatar label="SA" shape="circle" className="nav-avatar" />
                    </div>
                </div>
            </nav>

            <main className="projects-main">
                <div className="projects-header">
                    <div>
                        <h1>Tus Proyectos</h1>
                        <p>Gestiona tus espacios de trabajo. Límite de plan: <strong>{projects.length}/{PROJECT_LIMIT}</strong></p>
                    </div>
                    <Button 
                        label="Crear Proyecto" 
                        icon="pi pi-plus" 
                        className={projects.length >= PROJECT_LIMIT ? "p-button-secondary" : "p-button-orange"} 
                        onClick={() => setNewProjectModalOpen(true)} 
                    />
                </div>

                <div className="projects-grid">
                    {projects.map(project => (
                        <div key={project.id} className="project-card" onClick={enterProject}>
                            <div className="project-card-header">
                                <i className="pi pi-folder project-icon"></i>
                                <h3>{project.name}</h3>
                            </div>
                            <div className="project-card-body">
                                <span className="project-role"><i className="pi pi-user"></i> Rol: {project.role}</span>
                                <span className="project-date"><i className="pi pi-clock"></i> {project.lastUpdated}</span>
                            </div>
                            <div className="project-card-footer">
                                <span>Entrar al espacio de trabajo</span>
                                <i className="pi pi-arrow-right"></i>
                            </div>
                        </div>
                    ))}
                    
                    {/* Slot vacío para motivar creación o upgrade */}
                    {projects.length < PROJECT_LIMIT && (
                        <div className="project-card empty-card" onClick={() => setNewProjectModalOpen(true)}>
                            <i className="pi pi-plus-circle"></i>
                            <span>Crear nuevo proyecto</span>
                        </div>
                    )}
                </div>
            </main>

            {/* MODAL NUEVO PROYECTO */}
            <Dialog header="Crear Nuevo Proyecto" visible={isNewProjectModalOpen} style={{ width: '450px' }} onHide={() => setNewProjectModalOpen(false)}>
                <div className="modal-form">
                    <div className="field">
                        <label>Nombre del Proyecto</label>
                        <InputText value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} placeholder="Ej: App Móvil Finanzas" className="w-full" />
                    </div>
                    <div className="field">
                        <label>Descripción (Opcional)</label>
                        <InputText value={newProjectDesc} onChange={(e) => setNewProjectDesc(e.target.value)} placeholder="¿De qué trata este proyecto?" className="w-full" />
                    </div>
                    <Button label="Crear y Entrar" className="p-button-orange w-full" style={{ marginTop: '1.5rem' }} onClick={handleCreateProject} />
                </div>
            </Dialog>

           {/* MODAL EMERGENTE DE PLANES (POP-UP UNIFICADO) */}
            <Dialog 
                visible={isAiModalOpen} 
                style={{ width: '90vw', maxWidth: '1100px' }} 
                onHide={() => setAiModalOpen(false)}
                className="pricing-dialog"
                showHeader={false}
                dismissableMask={true}
            >
                <div className="pricing-popup-container">
                                    <div className="popup-close-btn" onClick={() => setAiModalOpen(false)}>
                                        <i className="pi pi-times"></i>
                                    </div>
                                    
                                    <div className="upgrade-header">
                                        <h1>Actualiza tu Plan</h1>
                                        <p>ManageWise AI y las exportaciones avanzadas requieren una suscripción activa.</p>
                                    </div>
                
                                    <div className="pricing-grid">
                                        {/* PLAN LIGHT */}
                                        <div className="pricing-card">
                                            <div className="pricing-header">
                                                <h3>Light</h3>
                                                <p>Get the basics</p>
                                                <div className="price">
                                                    <span className="currency">$</span><span className="amount">0</span><span className="period">/mo</span>
                                                </div>
                                            </div>
                                            <div className="pricing-features">
                                                <ul>
                                                    <li><i className="pi pi-check"></i> Hasta 2 Proyectos</li>
                                                    <li><i className="pi pi-check"></i> 5 Colaboradores</li>
                                                    <li className="disabled"><i className="pi pi-times"></i> Exportación de Reportes</li>
                                                    <li className="disabled"><i className="pi pi-times"></i> Asistente ManageWise AI</li>
                                                </ul>
                                            </div>
                                            <Button label="Tu Plan Actual" className="p-button-outlined p-button-secondary w-full" disabled />
                                        </div>
                
                                        {/* PLAN PRO BUSINESS (RECOMENDADO) */}
                                        <div className="pricing-card popular">
                                            <div className="recommended-badge">RECOMENDADO</div>
                                            <div className="pricing-header">
                                                <h3>Pro Business</h3>
                                                <p>Grow your brand</p>
                                                <div className="price">
                                                    <span className="currency">$</span><span className="amount">29</span><span className="period">/mo</span>
                                                </div>
                                            </div>
                                            <div className="pricing-features">
                                                <ul>
                                                    <li><i className="pi pi-check"></i> Proyectos Ilimitados</li>
                                                    <li><i className="pi pi-check"></i> Ilimitados Colaboradores</li>
                                                    <li><i className="pi pi-check"></i> Reportes PDF y Excel y Power Bi</li>
                                                    <li><i className="pi pi-check"></i> <strong>ManageWise AI</strong></li>
                                                </ul>
                                            </div>
                                            <Button label="Actualizar a Pro" className="p-button-orange w-full" onClick={() => alert('Redirigiendo a pasarela de pago...')} />
                                        </div>
                                    </div>
                                </div>
            </Dialog>
        </div>
    );
}