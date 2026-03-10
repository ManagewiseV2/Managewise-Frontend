import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { useNavigate } from 'react-router-dom';
import './Meeting.css';

export default function Meeting() {
    const navigate = useNavigate();
    
    // --- OBTENER FECHA LOCAL REAL ---
    const getLocalTodayString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    const todayStr = getLocalTodayString();

    // --- ESTADOS DE MODALES ---
    const [isMeetingModalOpen, setMeetingModalOpen] = useState(false);
    const [editingMeetingId, setEditingMeetingId] = useState(null);
    
    const [isRecordModalOpen, setRecordModalOpen] = useState(false);
    const [editingRecordId, setEditingRecordId] = useState(null);

    // NUEVO: ESTADO PARA EL MODAL EMERGENTE DE PRECIOS
    const [isAiModalOpen, setAiModalOpen] = useState(false);

    // --- DATOS SIMULADOS ---
    const [meetings, setMeetings] = useState([
        {
            id: 1,
            title: 'Daily Standup - Sprint 2',
            date: todayStr,
            time: '10:00',
            link: 'https://meet.google.com/abc-defg-hij'
        },
        {
            id: 2,
            title: 'Sprint Planning',
            date: '2026-02-28',
            time: '15:30',
            link: 'https://zoom.us/j/123456789'
        }
    ]);

    const [recordings, setRecordings] = useState([
        { id: 1, title: 'Sprint 1 Retrospective', date: '2026-02-10', duration: '00:45:20', access: 'Público', link: '#' },
        { id: 2, title: 'EJEMPLO_TINOCO / recording_1', date: '2026-02-05', duration: '00:58:28', access: 'Privado', link: '#' }
    ]);

    // --- ESTADOS DE REUNIÓN ---
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [link, setLink] = useState('');

    // --- ESTADOS DE GRABACIÓN ---
    const [recTitle, setRecTitle] = useState('');
    const [recDate, setRecDate] = useState('');
    const [recDuration, setRecDuration] = useState('');
    const [recAccess, setRecAccess] = useState('Público');
    const [recLink, setRecLink] = useState('');
    const [globalFilter, setGlobalFilter] = useState('');

    const accessOptions = [
        { label: 'Público', value: 'Público' },
        { label: 'Privado', value: 'Privado' }
    ];

    // ==========================================
    // LÓGICA DE REUNIONES
    // ==========================================
    const getMeetingStatus = (meetingDate) => {
        if (meetingDate === todayStr) return { label: 'HOY', severity: 'danger' };
        if (meetingDate < todayStr) return { label: 'PASADA', severity: 'secondary' };
        return { label: 'PRÓXIMA', severity: 'info' };
    };

    const openAddMeetingModal = () => {
        setEditingMeetingId(null);
        setTitle(''); setDate(''); setTime(''); setLink('');
        setMeetingModalOpen(true);
    };

    const openEditMeetingModal = (meeting) => {
        setEditingMeetingId(meeting.id);
        setTitle(meeting.title); setDate(meeting.date); setTime(meeting.time); setLink(meeting.link);
        setMeetingModalOpen(true);
    };

    const saveMeeting = () => {
        if (!title.trim() || !date || !time) return;
        const meetingData = { title, date, time, link: link || '#' };

        if (editingMeetingId) {
            setMeetings(meetings.map(m => m.id === editingMeetingId ? { ...m, ...meetingData } : m));
        } else {
            setMeetings([...meetings, { id: Date.now(), ...meetingData }]);
        }
        setMeetingModalOpen(false);
    };

    const deleteMeeting = (id) => setMeetings(meetings.filter(m => m.id !== id));

    // ==========================================
    // LÓGICA DE GRABACIONES
    // ==========================================
    const openAddRecordModal = () => {
        setEditingRecordId(null);
        setRecTitle(''); setRecDate(todayStr); setRecDuration(''); setRecAccess('Público'); setRecLink('');
        setRecordModalOpen(true);
    };

    const openEditRecordModal = (rec) => {
        setEditingRecordId(rec.id);
        setRecTitle(rec.title); setRecDate(rec.date); setRecDuration(rec.duration); setRecAccess(rec.access); setRecLink(rec.link);
        setRecordModalOpen(true);
    };

    const saveRecording = () => {
        if (!recTitle.trim() || !recDate) return;
        const recData = { title: recTitle, date: recDate, duration: recDuration || '--:--:--', access: recAccess, link: recLink || '#' };

        if (editingRecordId) {
            setRecordings(recordings.map(r => r.id === editingRecordId ? { ...r, ...recData } : r));
        } else {
            setRecordings([...recordings, { id: Date.now(), ...recData }]);
        }
        setRecordModalOpen(false);
    };

    const deleteRecording = (id) => setRecordings(recordings.filter(r => r.id !== id));

    // --- TEMPLATES DE TABLA ---
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="table-actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-secondary action-btn-small" onClick={() => openEditRecordModal(rowData)} tooltip="Editar" tooltipOptions={{ position: 'top' }} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger action-btn-small" onClick={() => deleteRecording(rowData.id)} tooltip="Eliminar" tooltipOptions={{ position: 'top' }} />
            </div>
        );
    };

    const linkBodyTemplate = (rowData) => (
        <a href={rowData.link} target="_blank" rel="noopener noreferrer" className="table-link-btn">
            <i className="pi pi-external-link"></i> Abrir Link
        </a>
    );

    const accessBodyTemplate = (rowData) => (
        <Tag value={rowData.access} severity={rowData.access === 'Público' ? 'success' : 'warning'} />
    );

    const header = (
        <div className="table-header">
            <div className="custom-search-container">
                <i className="pi pi-search custom-search-icon"></i>
                <InputText className="custom-search-input" type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar grabación..." />
            </div>
            <div className="table-header-actions">
                <Button label="Añadir Grabación" icon="pi pi-video" className="btn-add-record" onClick={openAddRecordModal} />
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
                    <div className="nav-item" onClick={() => navigate('/backlog')}><i className="pi pi-list"></i> BACKLOG</div>
                    <div className="nav-item" onClick={() => navigate('/members')}><i className="pi pi-users"></i> TEAM</div>
                    <div className="nav-item active" onClick={() => navigate('/meeting')}><i className="pi pi-video"></i> MEETINGS</div>
                    
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
                <div className="content-inner meetings-inner">
                    
                    <header className="content-header meetings-header">
                        <div>
                            <h1>Reuniones</h1>
                            <p>Planifica tus sesiones y accede a las grabaciones del proyecto.</p>
                        </div>
                        <div className="action-buttons">
                            <Button label="Nueva Reunión" icon="pi pi-plus" className="p-button-orange" onClick={openAddMeetingModal} />
                        </div>
                    </header>

                    <div className="meetings-grid">
                        {meetings.length === 0 && <p className="empty-msg">No hay reuniones programadas.</p>}
                        
                        {meetings.map(meeting => {
                            const status = getMeetingStatus(meeting.date);
                            return (
                                <div key={meeting.id} className="meeting-card">
                                    <div className="meeting-content">
                                        <div className="meeting-info-header">
                                            <h3>{meeting.title}</h3>
                                            <Tag value={status.label} severity={status.severity} />
                                        </div>
                                        
                                        <div className="meeting-time-block">
                                            <div className="time-row">
                                                <i className="pi pi-calendar"></i>
                                                <span>{meeting.date}</span>
                                            </div>
                                            <div className="time-row">
                                                <i className="pi pi-clock"></i>
                                                <span>{meeting.time} Hrs</span>
                                            </div>
                                        </div>

                                        <div className="meeting-footer">
                                            <a href={meeting.link} target="_blank" rel="noopener noreferrer" className="join-btn">
                                                <i className="pi pi-video"></i> Entrar a la Reunión
                                            </a>
                                            <div className="meeting-actions">
                                                <Button icon="pi pi-pencil" className="p-button-rounded p-button-secondary action-btn" onClick={() => openEditMeetingModal(meeting)} />
                                                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger action-btn" onClick={() => deleteMeeting(meeting.id)} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <hr className="section-divider" />

                    <div className="recordings-section">
                        <h2>Grabaciones Anteriores</h2>
                        <div className="table-container">
                            <DataTable value={recordings} header={header} globalFilter={globalFilter} emptyMessage="No se encontraron grabaciones." className="custom-datatable" responsiveLayout="scroll">
                                <Column field="title" header="Título de Grabación" sortable style={{ minWidth: '14rem' }}></Column>
                                <Column field="date" header="Fecha" sortable style={{ minWidth: '8rem' }}></Column>
                                <Column field="duration" header="Duración" style={{ minWidth: '8rem' }}></Column>
                                <Column body={accessBodyTemplate} header="Acceso" style={{ minWidth: '8rem' }}></Column>
                                <Column body={linkBodyTemplate} header="Enlace" style={{ minWidth: '10rem' }}></Column>
                                <Column body={actionBodyTemplate} header="Acciones" style={{ minWidth: '8rem', textAlign: 'right' }}></Column>
                            </DataTable>
                        </div>
                    </div>

                </div>
            </main>

            {/* MODAL REUNIÓN */}
            <Dialog header={editingMeetingId ? "Editar Reunión" : "Programar Nueva Reunión"} visible={isMeetingModalOpen} style={{ width: '450px' }} onHide={() => setMeetingModalOpen(false)}>
                <div className="modal-form">
                    <div className="field">
                        <label>Título de la Reunión</label>
                        <InputText value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Daily Standup" className="w-full" />
                    </div>
                    <div className="form-row">
                        <div className="field half-width">
                            <label>Fecha</label>
                            <InputText type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full" />
                        </div>
                        <div className="field half-width">
                            <label>Hora</label>
                            <InputText type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full" />
                        </div>
                    </div>
                    <div className="field">
                        <label>Enlace (URL)</label>
                        <InputText type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://meet.google.com/..." className="w-full" />
                    </div>
                    <Button label={editingMeetingId ? "Actualizar Reunión" : "Guardar Reunión"} className="p-button-orange w-full" style={{ marginTop: '1.5rem' }} onClick={saveMeeting} />
                </div>
            </Dialog>

            {/* MODAL GRABACIÓN */}
            <Dialog header={editingRecordId ? "Editar Grabación" : "Añadir Grabación"} visible={isRecordModalOpen} style={{ width: '450px' }} onHide={() => setRecordModalOpen(false)}>
                <div className="modal-form">
                    <div className="field">
                        <label>Título de la Grabación</label>
                        <InputText value={recTitle} onChange={(e) => setRecTitle(e.target.value)} placeholder="Ej: Review Sprint 1" className="w-full" />
                    </div>
                    <div className="form-row">
                        <div className="field half-width">
                            <label>Fecha</label>
                            <InputText type="date" value={recDate} onChange={(e) => setRecDate(e.target.value)} className="w-full" />
                        </div>
                        <div className="field half-width">
                            <label>Duración</label>
                            <InputText value={recDuration} onChange={(e) => setRecDuration(e.target.value)} placeholder="Ej: 01:20:00" className="w-full" />
                        </div>
                    </div>
                    <div className="field">
                        <label>Nivel de Acceso</label>
                        <Dropdown value={recAccess} options={accessOptions} onChange={(e) => setRecAccess(e.value)} className="w-full" />
                    </div>
                    <div className="field">
                        <label>Enlace del Video (URL)</label>
                        <InputText type="url" value={recLink} onChange={(e) => setRecLink(e.target.value)} placeholder="https://drive.google.com/..." className="w-full" />
                    </div>
                    <Button label={editingRecordId ? "Actualizar Grabación" : "Guardar Grabación"} className="p-button-orange w-full" style={{ marginTop: '1.5rem' }} onClick={saveRecording} />
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