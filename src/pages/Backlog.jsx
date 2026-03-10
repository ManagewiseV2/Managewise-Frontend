import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Avatar } from 'primereact/avatar';
import { useNavigate } from 'react-router-dom';
import './Backlog.css';

export default function Backlog() {
    const navigate = useNavigate();
    
    // --- ESTADOS DE LOS MODALES ---
    const [isStoryModalOpen, setStoryModalOpen] = useState(false);
    const [isSprintModalOpen, setSprintModalOpen] = useState(false);
    const [isEpicModalOpen, setEpicModalOpen] = useState(false);
    const [isConfirmCloseSprintOpen, setConfirmCloseSprintOpen] = useState(false);

    // NUEVO: ESTADO PARA EL MODAL EMERGENTE DE PRECIOS
    const [isAiModalOpen, setAiModalOpen] = useState(false);

    // --- ESTADOS DE DATOS DINÁMICOS ---
    
    // Lista simulada de miembros del equipo
    const usersList = [
        { label: 'Sergio (SA)', value: 'SA' },
        { label: 'Jose (JO)', value: 'JO' },
        { label: 'Maria (MA)', value: 'MA' },
    ];

    const [epics, setEpics] = useState([
        { label: 'Autenticación', value: 'Autenticación', color: 'warning' },
        { label: 'Panel de Usuario', value: 'Panel de Usuario', color: 'info' },
        { label: 'Base de Datos', value: 'Base de Datos', color: 'success' }
    ]);

    const [sprints, setSprints] = useState([
        {
            id: 1,
            name: 'Sprint 1 - MVP',
            dates: '10 Mar 2026 - 24 Mar 2026',
            status: 'Planning',
            stories: [
                { id: 'US-01', title: 'Diseñar esquema de base de datos', epic: 'Base de Datos', points: 5, user: 'SA' },
                { id: 'US-02', title: 'Crear login con JWT', epic: 'Autenticación', points: 8, user: 'JO' }
            ]
        }
    ]);

    const [productBacklog, setProductBacklog] = useState([
        { id: 'US-03', title: 'Implementar recuperación de contraseña por email', epic: 'Autenticación', points: 3, user: null },
        { id: 'US-04', title: 'Crear gráficos estadísticos en el Dashboard', epic: 'Panel de Usuario', points: 13, user: 'SA' },
        { id: 'US-05', title: 'Configurar permisos de roles (Admin/User)', epic: 'Autenticación', points: 5, user: null }
    ]);

    // --- ESTADOS DE FORMULARIOS ---
    const [editingStoryId, setEditingStoryId] = useState(null); 
    const [newStoryTitle, setNewStoryTitle] = useState('');
    const [newStoryEpic, setNewStoryEpic] = useState(null);
    const [newStoryPoints, setNewStoryPoints] = useState('');
    const [newStoryUser, setNewStoryUser] = useState(null); 
    
    const [newSprintName, setNewSprintName] = useState('');
    const [newSprintGoal, setNewSprintGoal] = useState('');
    const [newSprintEndDate, setNewSprintEndDate] = useState('');

    const [newEpicName, setNewEpicName] = useState('');
    const [newEpicColor, setNewEpicColor] = useState('info');

    const colorOptions = [
        { label: 'Azul (Info)', value: 'info' },
        { label: 'Naranja (Warning)', value: 'warning' },
        { label: 'Verde (Success)', value: 'success' },
        { label: 'Rojo (Danger)', value: 'danger' },
        { label: 'Gris (Secondary)', value: 'secondary' }
    ];

    // ==========================================
    // LÓGICA DE GESTIÓN (Crear, Editar, Eliminar)
    // ==========================================

    // --- ÉPICAS ---
    const crearEpica = () => {
        if (!newEpicName.trim()) return;
        const nuevaEpica = { label: newEpicName, value: newEpicName, color: newEpicColor };
        setEpics([...epics, nuevaEpica]);
        setNewEpicName('');
        setNewEpicColor('info');
    };

    const eliminarEpica = (epicValue) => {
        setEpics(epics.filter(e => e.value !== epicValue));
    };

    // --- HISTORIAS ---
    const abrirModalCrearHistoria = () => {
        setEditingStoryId(null);
        setNewStoryTitle('');
        setNewStoryEpic(null);
        setNewStoryPoints('');
        setNewStoryUser(null); 
        setStoryModalOpen(true);
    };

    const abrirModalEditarHistoria = (story) => {
        setEditingStoryId(story.id);
        setNewStoryTitle(story.title);
        setNewStoryEpic(story.epic);
        setNewStoryPoints(story.points);
        setNewStoryUser(story.user); 
        setStoryModalOpen(true);
    };

    const guardarHistoria = () => {
        if (!newStoryTitle.trim() || !newStoryEpic) return;

        const storyData = {
            title: newStoryTitle,
            epic: newStoryEpic,
            points: newStoryPoints,
            user: newStoryUser
        };

        if (editingStoryId) {
            const updatedBacklog = productBacklog.map(s => 
                s.id === editingStoryId ? { ...s, ...storyData } : s
            );
            const updatedSprints = sprints.map(sp => ({
                ...sp,
                stories: sp.stories.map(s => 
                    s.id === editingStoryId ? { ...s, ...storyData } : s
                )
            }));
            
            setProductBacklog(updatedBacklog);
            setSprints(updatedSprints);
        } else {
            const nuevaHistoria = {
                id: `US-${Math.floor(Math.random() * 1000)}`, 
                ...storyData,
                points: newStoryPoints || '?'
            };
            setProductBacklog([...productBacklog, nuevaHistoria]);
        }
        
        setStoryModalOpen(false);
    };

    const eliminarHistoria = (storyId) => {
        setProductBacklog(productBacklog.filter(s => s.id !== storyId));
        setSprints(sprints.map(sp => ({
            ...sp,
            stories: sp.stories.filter(s => s.id !== storyId)
        })));
    };

    // --- SPRINTS ---
    const crearSprint = () => {
        if (!newSprintName.trim()) return;
        const nuevoSprint = {
            id: Date.now(), 
            name: newSprintName,
            dates: `Finaliza: ${newSprintEndDate || 'Sin fecha'}`,
            status: 'PLANNING', 
            stories: [] 
        };
        setSprints([...sprints, nuevoSprint]);
        setNewSprintName('');
        setNewSprintGoal('');
        setNewSprintEndDate('');
        setSprintModalOpen(false);
    };

    // ==========================================
    // LÓGICA DE DRAG & DROP
    // ==========================================
    const handleDragStart = (e, storyId, sourceZone) => {
        e.dataTransfer.setData("storyId", storyId);
        e.dataTransfer.setData("sourceZone", sourceZone);
    };

    const handleDragOver = (e) => { e.preventDefault(); };

    const processDrop = (e, targetZone, targetIndex, targetSprintId = null) => {
        const storyId = e.dataTransfer.getData("storyId");
        const sourceZone = e.dataTransfer.getData("sourceZone");

        if (!storyId) return;

        let newBacklog = [...productBacklog];
        let newSprints = [...sprints];
        let movedStory;

        if (sourceZone === 'backlog') {
            const idx = newBacklog.findIndex(s => s.id === storyId);
            movedStory = newBacklog[idx];
            newBacklog.splice(idx, 1);
        } else if (sourceZone === 'sprint') {
            for (let i = 0; i < newSprints.length; i++) {
                const idx = newSprints[i].stories.findIndex(s => s.id === storyId);
                if (idx !== -1) {
                    movedStory = newSprints[i].stories[idx];
                    newSprints[i].stories.splice(idx, 1);
                    break;
                }
            }
        }

        if (!movedStory) return;

        if (targetZone === 'backlog') {
            if (targetIndex !== null) newBacklog.splice(targetIndex, 0, movedStory);
            else newBacklog.push(movedStory);
        } else if (targetZone === 'sprint' && targetSprintId) {
            const sprintIndex = newSprints.findIndex(s => s.id === targetSprintId);
            if (targetIndex !== null) newSprints[sprintIndex].stories.splice(targetIndex, 0, movedStory);
            else newSprints[sprintIndex].stories.push(movedStory);
        }

        setProductBacklog(newBacklog);
        setSprints(newSprints);
    };

    const handleDropOnCard = (e, targetZone, targetIndex, sprintId = null) => {
        e.preventDefault(); e.stopPropagation(); processDrop(e, targetZone, targetIndex, sprintId);
    };

    const handleDropOnZone = (e, targetZone, sprintId = null) => {
        e.preventDefault(); processDrop(e, targetZone, null, sprintId);
    };

    // --- FUNCIONES AUXILIARES ---
    const getEpicColor = (epicName) => {
        const foundEpic = epics.find(e => e.value === epicName);
        return foundEpic ? foundEpic.color : 'secondary';
    };

    const confirmFooter = (
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <Button label="Cancelar" icon="pi pi-times" onClick={() => setConfirmCloseSprintOpen(false)} className="p-button-text" style={{ color: '#64748b' }} />
            <Button label="Sí, Completar Sprint" icon="pi pi-check" onClick={() => setConfirmCloseSprintOpen(false)} className="p-button-orange" autoFocus />
        </div>
    );

    // --- RENDERIZADO DE LA TARJETA ---
    const renderStoryCard = (story, index, zone, sprintId = null) => (
        <div 
            key={story.id} 
            className="story-card draggable"
            draggable
            onDragStart={(e) => handleDragStart(e, story.id, zone)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDropOnCard(e, zone, index, sprintId)}
        >
            <div className="story-main">
                <span className="story-id">{story.id}</span>
                <span className="story-title">{story.title}</span>
                <Tag value={story.epic} severity={getEpicColor(story.epic)} className="epic-tag" />
            </div>
            <div className="story-meta">
                <div className="story-points">{story.points}</div>
                {story.user ? 
                    <Avatar label={story.user} shape="circle" className="user-avatar" /> : 
                    <Avatar icon="pi pi-user" shape="circle" className="user-avatar empty-avatar" />
                }
                <div className="story-actions">
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-secondary p-button-sm action-btn" onClick={() => abrirModalEditarHistoria(story)} />
                    <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-sm action-btn" onClick={() => eliminarHistoria(story.id)} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="dashboard-wrapper">
            <aside className="dashboard-sidebar">
                <div className="brand">ManageWise</div>
                
                {/* Menú Principal */}
                <nav className="nav-links">
                    <div className="nav-item" onClick={() => navigate('/home')}><i className="pi pi-chart-line"></i> DASHBOARD</div>
                    <div className="nav-item active" onClick={() => navigate('/backlog')}><i className="pi pi-list"></i> BACKLOG</div>
                    <div className="nav-item" onClick={() => navigate('/members')}><i className="pi pi-users"></i> TEAM</div>
                    <div className="nav-item" onClick={() => navigate('/meeting')}><i className="pi pi-video"></i> MEETINGS</div>
                    
                    {/* SECCIONES PREMIUM (ABREN MODAL) */}
                    <div className="nav-item" onClick={() => setAiModalOpen(true)}>
                        <i className="pi pi-history"></i> ACTIVITY FEED
                        <span className="pro-text">PRO</span>
                    </div>
                    
                    <div className="nav-item" onClick={() => setAiModalOpen(true)}>
                        <i className="pi pi-file-export"></i> REPORTES
                        <span className="pro-text">PRO</span>
                    </div>

                    <div className="nav-item ai-nav-item" onClick={() => setAiModalOpen(true)}>
                        <i className="pi pi-sparkles" style={{ color: '#fbbf24' }}></i> 
                        <div className="ai-text">
                            <span>ManageWise</span>
                            <span>AI</span>
                        </div>
                        <span className="pro-text">PRO</span>
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <div className="nav-item exit-item" onClick={() => navigate('/projects')}>
                        <i className="pi pi-arrow-left"></i> Ir a Proyectos
                    </div>
                </div>
            </aside>

            <main className="dashboard-content">
                <div className="content-inner backlog-inner">
                    
                    <header className="content-header backlog-header">
                        <div>
                            <h1>Product Backlog</h1>
                            <p>Gestiona tus Historias de Usuario, Épicas y planifica tus Sprints.</p>
                        </div>
                        <div className="action-buttons">
                            <Button label="Administrar Épicas" icon="pi pi-tags" className="btn-epic" onClick={() => setEpicModalOpen(true)} />
                            <Button label="Nuevo Sprint" icon="pi pi-box" className="btn-sprint" onClick={() => setSprintModalOpen(true)} />
                            <Button label="Nueva Historia" icon="pi pi-plus" className="p-button-orange" onClick={abrirModalCrearHistoria} />
                        </div>
                    </header>

                    <div className="sprints-container">
                        {sprints.map(sprint => (
                            <div 
                                key={sprint.id} 
                                className="sprint-block drop-zone"
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDropOnZone(e, 'sprint', sprint.id)}
                            >
                                <div className="sprint-header">
                                    <div className="sprint-title-group">
                                        <h2>{sprint.name}</h2>
                                        <span className="sprint-dates">{sprint.dates}</span>
                                        <Tag value={sprint.status} severity={sprint.status === 'ACTIVE' ? 'success' : 'info'} />
                                    </div>
                                    <Button 
                                        label="Completar Sprint" 
                                        className="btn-complete-sprint" 
                                        onClick={() => setConfirmCloseSprintOpen(true)}
                                    />
                                </div>
                                
                                <div className="story-list">
                                    {sprint.stories.length === 0 && <p className="empty-drop-msg">Arrastra historias aquí para planificar este Sprint</p>}
                                    {sprint.stories.map((story, index) => renderStoryCard(story, index, 'sprint', sprint.id))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div 
                        className="backlog-container drop-zone"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDropOnZone(e, 'backlog')}
                    >
                        <div className="backlog-header-bar">
                            <h2>Backlog General</h2>
                            <span className="story-count">{productBacklog.length} issues</span>
                        </div>
                        
                        <div className="story-list">
                            {productBacklog.length === 0 && <p className="empty-drop-msg">El Backlog está vacío. ¡Buen trabajo!</p>}
                            {productBacklog.map((story, index) => renderStoryCard(story, index, 'backlog'))}
                        </div>
                    </div>
                </div>
            </main>

            {/* ========================================== */}
            {/* MODALES FLOTANTES */}
            {/* ========================================== */}
            
            <Dialog header="Administrar Épicas" visible={isEpicModalOpen} style={{ width: '450px' }} onHide={() => setEpicModalOpen(false)}>
                <div className="modal-form">
                    <div className="epic-creation-zone">
                        <div className="field">
                            <label>Nombre de la Nueva Épica</label>
                            <InputText value={newEpicName} onChange={(e) => setNewEpicName(e.target.value)} placeholder="Ej: Pasarela de Pagos" className="w-full" />
                        </div>
                        <div className="field">
                            <label>Color de Etiqueta (Tag)</label>
                            <Dropdown value={newEpicColor} options={colorOptions} onChange={(e) => setNewEpicColor(e.value)} placeholder="Selecciona un color" className="w-full" />
                        </div>
                        <Button label="Guardar Épica" className="p-button-orange w-full" style={{ marginTop: '1.5rem' }} onClick={crearEpica} />
                    </div>

                    <hr style={{ margin: '1.5rem 0', borderColor: '#e2e8f0', opacity: 0.5 }} />

                    <div className="epics-list">
                        <label>Épicas Existentes</label>
                        {epics.length === 0 && <p style={{color: '#64748b', fontSize: '0.9rem'}}>No hay épicas creadas.</p>}
                        {epics.map(epic => (
                            <div key={epic.value} className="epic-list-item">
                                <Tag value={epic.label} severity={epic.color} />
                                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-sm action-btn" onClick={() => eliminarEpica(epic.value)} />
                            </div>
                        ))}
                    </div>
                </div>
            </Dialog>

            <Dialog header={editingStoryId ? "Editar Historia" : "Crear Nueva Historia"} visible={isStoryModalOpen} style={{ width: '450px' }} onHide={() => setStoryModalOpen(false)}>
                <div className="modal-form">
                    <div className="field">
                        <label>Título de la Historia</label>
                        <InputText value={newStoryTitle} onChange={(e) => setNewStoryTitle(e.target.value)} placeholder="Ej: Como usuario quiero..." className="w-full" />
                    </div>
                    <div className="field">
                        <label>Épica a la que pertenece</label>
                        <Dropdown value={newStoryEpic} options={epics} onChange={(e) => setNewStoryEpic(e.value)} placeholder={epics.length === 0 ? "Crea una épica primero" : "Selecciona una Épica"} className="w-full" disabled={epics.length === 0} />
                    </div>
                    <div className="field">
                        <label>Asignar a (Opcional)</label>
                        <Dropdown 
                            value={newStoryUser} 
                            options={usersList} 
                            onChange={(e) => setNewStoryUser(e.value)} 
                            placeholder="Selecciona un miembro" 
                            className="w-full" 
                            showClear
                        />
                    </div>
                    <div className="field">
                        <label>Puntos de Esfuerzo (Story Points)</label>
                        <InputText type="number" value={newStoryPoints} onChange={(e) => setNewStoryPoints(e.target.value)} placeholder="Ej: 5" className="w-full" />
                    </div>
                    <Button label={editingStoryId ? "Actualizar Historia" : "Guardar Historia"} className="p-button-orange w-full" style={{ marginTop: '1.5rem' }} onClick={guardarHistoria} />
                </div>
            </Dialog>

            <Dialog header="Planificar Nuevo Sprint" visible={isSprintModalOpen} style={{ width: '450px' }} onHide={() => setSprintModalOpen(false)}>
                <div className="modal-form">
                    <div className="field">
                        <label>Nombre del Sprint</label>
                        <InputText value={newSprintName} onChange={(e) => setNewSprintName(e.target.value)} placeholder="Ej: Sprint 3 - Pasarela de Pagos" className="w-full" />
                    </div>
                    <div className="field">
                        <label>Objetivo principal</label>
                        <InputText value={newSprintGoal} onChange={(e) => setNewSprintGoal(e.target.value)} placeholder="¿Qué queremos lograr?" className="w-full" />
                    </div>
                    <div className="field">
                        <label>Fecha de Fin del Sprint</label>
                        <InputText type="date" value={newSprintEndDate} onChange={(e) => setNewSprintEndDate(e.target.value)} className="w-full" />
                    </div>
                    <Button label="Crear Sprint" className="p-button-orange w-full" style={{ marginTop: '1.5rem' }} onClick={crearSprint} />
                </div>
            </Dialog>

            <Dialog header="Confirmar Acción" visible={isConfirmCloseSprintOpen} style={{ width: '400px' }} footer={confirmFooter} onHide={() => setConfirmCloseSprintOpen(false)}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem', color: '#f97316' }} />
                    <span>¿Estás seguro de que deseas completar este Sprint? Las tareas no finalizadas se moverán al Backlog General.</span>
                </div>
            </Dialog>

            {/* ========================================================= */}
            {/* MODAL EMERGENTE DE PRECIOS: DISEÑO ACTUALIZADO A 2 PLANES */}
            {/* ========================================================= */}
            <Dialog 
                visible={isAiModalOpen} 
                style={{ width: '90vw', maxWidth: '800px' }} /* Reducido a 800px para 2 tarjetas */
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