import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Avatar } from 'primereact/avatar';
import { useNavigate } from 'react-router-dom';
import './Members.css';

export default function Members() {
    const navigate = useNavigate();
    
    // --- ESTADOS DE MODALES ---
    const [isMemberModalOpen, setMemberModalOpen] = useState(false);
    const [isRoleModalOpen, setRoleModalOpen] = useState(false);
    const [editingMemberId, setEditingMemberId] = useState(null);

    // NUEVO: ESTADO PARA EL MODAL EMERGENTE DE PRECIOS
    const [isAiModalOpen, setAiModalOpen] = useState(false);

    // --- DATOS DINÁMICOS CON COLORES HEXADECIMALES EXACTOS ---
    const [roles, setRoles] = useState([
        { label: 'Development Team', value: 'DEVELOPMENT_TEAM', color: '#0ea5e9' }, // Azul claro
        { label: 'Scrum Master', value: 'SCRUM_MASTER', color: '#f97316' },       // Naranja
        { label: 'Product Owner', value: 'PRODUCT_OWNER', color: '#22c55e' },      // Verde
        { label: 'UI/UX Designer', value: 'UI_UX_DESIGNER', color: '#8b5cf6' }     // Morado
    ]);

    const [members, setMembers] = useState([
        { 
            id: 1, 
            name: 'Sergio André Gómez Vallejos', 
            role: 'DEVELOPMENT_TEAM', 
            email: 'sergioandregomezvallejos@gmail.com', 
            address: 'Av. Belaunde Oeste 1303, Comas' 
        },
        { 
            id: 2, 
            name: 'Jose Saico', 
            role: 'DEVELOPMENT_TEAM', 
            email: 'JoseSaico@gmail.com', 
            address: 'CarabaYork' 
        },
        { 
            id: 3, 
            name: 'Valeria Mendoza', 
            role: 'SCRUM_MASTER', 
            email: 'vmendoza@managewise.com', 
            address: 'Los Olivos, Lima' 
        }
    ]);

    // --- ESTADOS DE FORMULARIOS ---
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');

    const [newRoleName, setNewRoleName] = useState('');
    const [newRoleColor, setNewRoleColor] = useState('#0ea5e9'); // Azul por defecto

    // Opciones de colores con HEX real
    const colorOptions = [
        { label: 'Azul', value: '#0ea5e9' },
        { label: 'Naranja', value: '#f97316' },
        { label: 'Verde', value: '#22c55e' },
        { label: 'Rojo', value: '#ef4444' },
        { label: 'Morado', value: '#8b5cf6' },
        { label: 'Gris Oscuro', value: '#475569' }
    ];

    // ==========================================
    // TEMPLATES VISUALES PARA EL DROPDOWN
    // ==========================================
    const colorItemTemplate = (option) => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: option.value, border: '1px solid #cbd5e1' }}></div>
                <span>{option.label}</span>
            </div>
        );
    };

    const colorValueTemplate = (option, props) => {
        if (option) {
            return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: option.value, border: '1px solid #cbd5e1' }}></div>
                    <span>{option.label}</span>
                </div>
            );
        }
        return <span>{props.placeholder}</span>;
    };

    // ==========================================
    // LÓGICA DE GESTIÓN
    // ==========================================
    const crearRol = () => {
        if (!newRoleName.trim()) return;
        const safeValue = newRoleName.trim().toUpperCase().replace(/\s+/g, '_');
        const nuevoRol = { label: newRoleName, value: safeValue, color: newRoleColor };
        
        setRoles([...roles, nuevoRol]);
        setNewRoleName('');
        setNewRoleColor('#0ea5e9');
    };

    const eliminarRol = (roleValue) => {
        setRoles(roles.filter(r => r.value !== roleValue));
    };

    const openAddModal = () => {
        setEditingMemberId(null);
        setName('');
        setRole('');
        setEmail('');
        setAddress('');
        setMemberModalOpen(true);
    };

    const openEditModal = (member) => {
        setEditingMemberId(member.id);
        setName(member.name);
        setRole(member.role);
        setEmail(member.email);
        setAddress(member.address);
        setMemberModalOpen(true);
    };

    const saveMember = () => {
        if (!name.trim() || !role) return;

        const memberData = {
            name,
            role,
            email: email || 'Sin especificar',
            address: address || 'Sin especificar'
        };

        if (editingMemberId) {
            setMembers(members.map(m => m.id === editingMemberId ? { ...m, ...memberData } : m));
        } else {
            const newMember = { id: Date.now(), ...memberData };
            setMembers([...members, newMember]);
        }
        
        setMemberModalOpen(false);
    };

    const deleteMember = (id) => {
        setMembers(members.filter(m => m.id !== id));
    };

    // Funciones auxiliares
    const getRoleColor = (roleValue) => {
        const foundRole = roles.find(r => r.value === roleValue);
        return foundRole ? foundRole.color : '#64748b';
    };

    const formatRoleLabel = (roleValue) => {
        const foundRole = roles.find(r => r.value === roleValue);
        return foundRole ? foundRole.label : roleValue;
    };

    const getInitials = (fullName) => {
        const names = fullName.trim().split(' ');
        if (names.length >= 2) {
            return (names[0][0] + names[1][0]).toUpperCase();
        }
        return fullName.substring(0, 2).toUpperCase();
    };

    return (
        <div className="dashboard-wrapper">
            <aside className="dashboard-sidebar">
                <div className="brand">ManageWise</div>
                
                {/* Menú Principal */}
                <nav className="nav-links">
                    <div className="nav-item" onClick={() => navigate('/home')}><i className="pi pi-chart-line"></i> DASHBOARD</div>
                    <div className="nav-item" onClick={() => navigate('/backlog')}><i className="pi pi-list"></i> BACKLOG</div>
                    <div className="nav-item active" onClick={() => navigate('/members')}><i className="pi pi-users"></i> TEAM</div>
                    <div className="nav-item" onClick={() => navigate('/meeting')}><i className="pi pi-video"></i> MEETINGS</div>
                    
                    {/* BOTONES PREMIUM QUE ABREN EL MODAL */}
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
                <div className="content-inner team-inner">
                    <header className="content-header team-header">
                        <div>
                            <h1>Project Team</h1>
                            <p>Gestiona los miembros del equipo y sus roles en el proyecto.</p>
                        </div>
                        <div className="action-buttons">
                            <Button label="Administrar Roles" icon="pi pi-tags" className="btn-role" onClick={() => setRoleModalOpen(true)} />
                            <Button label="Nuevo Miembro" icon="pi pi-user-plus" className="p-button-orange" onClick={openAddModal} />
                        </div>
                    </header>

                    <div className="members-grid">
                        {members.length === 0 && <p className="empty-msg">No hay miembros en el equipo aún.</p>}
                        
                        {members.map(member => (
                            <div key={member.id} className="member-card">
                                <div className="member-header">
                                    <Avatar label={getInitials(member.name)} size="xlarge" shape="circle" className="member-avatar" />
                                    <div className="member-title">
                                        <h3>{member.name}</h3>
                                        <Tag value={formatRoleLabel(member.role)} style={{ backgroundColor: getRoleColor(member.role), color: '#ffffff' }} className="role-tag" />
                                    </div>
                                </div>

                                <hr className="member-divider" />

                                <div className="member-details">
                                    <div className="detail-row">
                                        <i className="pi pi-envelope"></i>
                                        <span>{member.email}</span>
                                    </div>
                                    <div className="detail-row">
                                        <i className="pi pi-map-marker"></i>
                                        <span>{member.address}</span>
                                    </div>
                                </div>

                                <div className="member-actions">
                                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-secondary action-btn" onClick={() => openEditModal(member)} tooltip="Editar" tooltipOptions={{ position: 'top' }} />
                                    <Button icon="pi pi-trash" className="p-button-rounded p-button-danger action-btn" onClick={() => deleteMember(member.id)} tooltip="Eliminar" tooltipOptions={{ position: 'top' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* MODAL MIEMBRO */}
            <Dialog header={editingMemberId ? "Editar Miembro" : "Añadir Nuevo Miembro"} visible={isMemberModalOpen} style={{ width: '450px' }} onHide={() => setMemberModalOpen(false)}>
                <div className="modal-form">
                    <div className="field">
                        <label>Nombre Completo</label>
                        <InputText value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Maria Lopez" className="w-full" />
                    </div>
                    <div className="field">
                        <label>Rol en el Proyecto</label>
                        <Dropdown value={role} options={roles} onChange={(e) => setRole(e.value)} placeholder="Selecciona un rol" className="w-full" disabled={roles.length === 0} />
                    </div>
                    <div className="field">
                        <label>Correo Electrónico (Opcional)</label>
                        <InputText type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Ej: correo@empresa.com" className="w-full" />
                    </div>
                    <div className="field">
                        <label>Dirección / Ubicación (Opcional)</label>
                        <InputText value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Ej: Lima, Peru" className="w-full" />
                    </div>
                    
                    <Button label={editingMemberId ? "Actualizar Miembro" : "Guardar Miembro"} className="p-button-orange w-full" style={{ marginTop: '1.5rem' }} onClick={saveMember} />
                </div>
            </Dialog>

            {/* MODAL ROLES */}
            <Dialog header="Administrar Roles" visible={isRoleModalOpen} style={{ width: '450px' }} onHide={() => setRoleModalOpen(false)}>
                <div className="modal-form">
                    <div className="role-creation-zone">
                        <div className="field">
                            <label>Nombre del Nuevo Rol</label>
                            <InputText value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} placeholder="Ej: QA Tester" className="w-full" />
                        </div>
                        <div className="field">
                            <label>Color Real (Hex)</label>
                            <Dropdown 
                                value={newRoleColor} 
                                options={colorOptions} 
                                onChange={(e) => setNewRoleColor(e.value)} 
                                itemTemplate={colorItemTemplate}
                                valueTemplate={colorValueTemplate}
                                placeholder="Selecciona un color exacto" 
                                className="w-full" 
                            />
                        </div>
                        <Button label="Guardar Rol" className="p-button-orange w-full" style={{ marginTop: '1.5rem' }} onClick={crearRol} />
                    </div>

                    <hr style={{ margin: '1.5rem 0', borderColor: '#e2e8f0', opacity: 0.5 }} />

                    <div className="roles-list">
                        <label>Roles Existentes</label>
                        {roles.length === 0 && <p style={{color: '#64748b', fontSize: '0.9rem'}}>No hay roles creados.</p>}
                        {roles.map(r => (
                            <div key={r.value} className="role-list-item">
                                <Tag value={r.label} style={{ backgroundColor: r.color, color: '#ffffff' }} />
                                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-sm action-btn" onClick={() => eliminarRol(r.value)} />
                            </div>
                        ))}
                    </div>
                </div>
            </Dialog>

            {/* ========================================================= */}
            {/* MODAL EMERGENTE DE PRECIOS (COPIADO DESDE HOME) */}
            {/* ========================================================= */}
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