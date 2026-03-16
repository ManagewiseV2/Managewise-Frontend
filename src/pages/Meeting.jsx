import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { useNavigate } from 'react-router-dom';
import './Meeting.css';

const API_BASE = 'http://localhost:8090/api/v1';

export default function Meeting() {
    const navigate = useNavigate();
    
    // 🚀 MAGIA: Sacamos el ID del proyecto actual de la memoria
    const currentProjectId = localStorage.getItem('current_project_id');

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
    const [isAiModalOpen, setAiModalOpen] = useState(false);

    // --- ESTADOS DE DATOS DINÁMICOS ---
    const [meetings, setMeetings] = useState([]);
    const [recordings, setRecordings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // --- ESTADOS DE FORMULARIOS DE REUNIÓN ---
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState(''); 
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [link, setLink] = useState('');

    // --- ESTADOS DE FORMULARIOS DE GRABACIÓN ---
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
    // 1. CARGAR DATOS DESDE SPRING BOOT (FILTRADOS)
    // ==========================================
    const fetchMeetingsAndRecordings = async () => {
        if (!currentProjectId) {
            navigate('/projects');
            return;
        }

        setIsLoading(true);
        try {
            // 🚨 AHORA PEDIMOS SOLO LAS REUNIONES Y GRABACIONES DEL PROYECTO ACTUAL
            const [meetingsRes, recordingsRes] = await Promise.all([
                fetch(`${API_BASE}/meetings/project/${currentProjectId}`),
                fetch(`${API_BASE}/recordings/project/${currentProjectId}`)
            ]);

            if (meetingsRes.ok) {
                const mData = await meetingsRes.json();
                setMeetings(mData);
            }
            if (recordingsRes.ok) {
                const rData = await recordingsRes.json();
                setRecordings(rData);
            }
        } catch (error) {
            console.error("Error al cargar datos:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMeetingsAndRecordings();
    }, []);

    // ==========================================
    // FUNCIONES AUXILIARES PARA FECHAS (ISO-8601 a Texto)
    // ==========================================
    const extractDateFromISO = (isoString) => {
        if (!isoString) return '';
        return isoString.split('T')[0]; 
    };

    const extractTimeFromISO = (isoString) => {
        if (!isoString) return '';
        const timePart = isoString.split('T')[1]; 
        if (!timePart) return '';
        return timePart.substring(0, 5); 
    };

    const createISOString = (d, t) => {
        if (!d || !t) return new Date().toISOString();
        return `${d}T${t}:00.000Z`;
    };

    const getMeetingStatus = (isoDate) => {
        if (!isoDate) return { label: 'SIN FECHA', severity: 'info' };
        const meetingDate = extractDateFromISO(isoDate);
        if (meetingDate === todayStr) return { label: 'HOY', severity: 'danger' };
        if (meetingDate < todayStr) return { label: 'PASADA', severity: 'secondary' };
        return { label: 'PRÓXIMA', severity: 'info' };
    };

    // ==========================================
    // 2. LÓGICA DE REUNIONES
    // ==========================================
    const openAddMeetingModal = () => {
        setEditingMeetingId(null);
        setTitle(''); setDescription(''); setDate(''); setTime(''); setLink('');
        setMeetingModalOpen(true);
    };

    const openEditMeetingModal = (meeting) => {
        setEditingMeetingId(meeting.id);
        setTitle(meeting.title);
        setDescription(meeting.description || '');
        setDate(extractDateFromISO(meeting.scheduledAt)); 
        setTime(extractTimeFromISO(meeting.scheduledAt)); 
        setLink(meeting.meetingUrl); 
        setMeetingModalOpen(true);
    };

    const saveMeeting = async () => {
        if (!title.trim() || !date || !time) {
            alert("El título, fecha y hora son obligatorios.");
            return;
        }

        // 🚨 AGREGAMOS EL PROJECT ID REAL PARA QUE JAVA LO GUARDE BIEN
        const meetingPayload = { 
            title: title.trim(), 
            description: description || 'Revisión de avances',
            scheduledAt: createISOString(date, time), 
            meetingUrl: link || 'https://meet.google.com/', 
            projectId: currentProjectId 
        };

        try {
            if (editingMeetingId) {
                const res = await fetch(`${API_BASE}/meetings/${editingMeetingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(meetingPayload)
                });
                if (res.ok) fetchMeetingsAndRecordings();
            } else {
                const res = await fetch(`${API_BASE}/meetings`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(meetingPayload)
                });
                if (res.ok) fetchMeetingsAndRecordings();
            }
        } catch (error) {
            console.error("Error al guardar la reunión", error);
        }
        
        setMeetingModalOpen(false);
    };

    const deleteMeeting = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/meetings/${id}`, { method: 'DELETE' });
            if (res.ok || res.status === 204) fetchMeetingsAndRecordings();
        } catch (error) {
            console.error("Error al eliminar la reunión", error);
        }
    };

    // ==========================================
    // 3. LÓGICA DE GRABACIONES
    // ==========================================
    const openAddRecordModal = () => {
        setEditingRecordId(null);
        setRecTitle(''); setRecDate(todayStr); setRecDuration(''); setRecAccess('Público'); setRecLink('');
        setRecordModalOpen(true);
    };

    const openEditRecordModal = (rec) => {
        setEditingRecordId(rec.id);
        setRecTitle(rec.title); 
        setRecDate(extractDateFromISO(rec.recordedAt) || rec.date); 
        setRecDuration(rec.duration); 
        setRecAccess(rec.access || 'Público'); 
        setRecLink(rec.videoUrl || rec.link); 
        setRecordModalOpen(true);
    };

    const saveRecording = async () => {
        if (!recTitle.trim() || !recDate) {
            alert("El título y la fecha son obligatorios.");
            return;
        }

        // 🚨 AGREGAMOS EL PROJECT ID REAL PARA LA GRABACIÓN
        const recPayload = { 
            title: recTitle.trim(), 
            recordedAt: createISOString(recDate, "12:00"), 
            duration: recDuration || '--:--:--', 
            access: recAccess, 
            videoUrl: recLink || 'https://drive.google.com/',
            projectId: currentProjectId
        };

        try {
            if (editingRecordId) {
                const res = await fetch(`${API_BASE}/recordings/${editingRecordId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(recPayload)
                });
                if (res.ok) fetchMeetingsAndRecordings();
            } else {
                const res = await fetch(`${API_BASE}/recordings`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(recPayload)
                });
                if (res.ok) fetchMeetingsAndRecordings();
            }
        } catch (error) {
            console.error("Error al guardar la grabación", error);
        }
        
        setRecordModalOpen(false);
    };

    const deleteRecording = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/recordings/${id}`, { method: 'DELETE' });
            if (res.ok || res.status === 204) fetchMeetingsAndRecordings();
        } catch (error) {
            console.error("Error al eliminar la grabación", error);
        }
    };

    // --- TEMPLATES DE TABLA ---
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="table-actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-secondary action-btn-small" onClick={() => openEditRecordModal(rowData)} tooltip="Editar" tooltipOptions={{ position: 'top' }} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger action-btn-small" onClick={() => deleteRecording(rowData.id)} tooltip="Eliminar" tooltipOptions={{ position: 'top' }} />
            </div>
        );
    };

    const linkBodyTemplate = (rowData) => {
        const linkStr = rowData.videoUrl || rowData.link || '#';
        return (
            <a href={linkStr} target="_blank" rel="noopener noreferrer" className="table-link-btn">
                <i className="pi pi-external-link"></i> Abrir Link
            </a>
        );
    };

    const accessBodyTemplate = (rowData) => {
        const acc = rowData.access || 'Público';
        return <Tag value={acc} severity={acc === 'Público' ? 'success' : 'warning'} />;
    };

    const dateBodyTemplate = (rowData) => {
        return <span>{extractDateFromISO(rowData.recordedAt) || rowData.date}</span>;
    };

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
                <nav className="nav-links">
                    <div className="nav-item" onClick={() => navigate('/home')}><i className="pi pi-chart-line"></i> DASHBOARD</div>
                    <div className="nav-item" onClick={() => navigate('/backlog')}><i className="pi pi-list"></i> BACKLOG</div>
                    <div className="nav-item" onClick={() => navigate('/members')}><i className="pi pi-users"></i> TEAM</div>
                    <div className="nav-item active" onClick={() => navigate('/meeting')}><i className="pi pi-video"></i> MEETINGS</div>
                    
                    <div className="nav-item" onClick={() => navigate('/activity')}>
                        <i className="pi pi-history"></i> ACTIVITY FEED
                        <span className="pro-text">PRO</span>
                    </div>
                    <div className="nav-item" onClick={() => navigate('/reports')}>
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

                    {isLoading ? (
                        <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
                            <i className="pi pi-spin pi-spinner" style={{ fontSize: '3rem', marginBottom: '1rem', color: '#f97316' }}></i>
                            <h2>Cargando Reuniones...</h2>
                        </div>
                    ) : (
                        <>
                            <div className="meetings-grid">
                                {meetings.length === 0 && <p className="empty-msg">No hay reuniones programadas.</p>}
                                
                                {meetings.map(meeting => {
                                    const status = getMeetingStatus(meeting.scheduledAt);
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
                                                        <span>{extractDateFromISO(meeting.scheduledAt)}</span>
                                                    </div>
                                                    <div className="time-row">
                                                        <i className="pi pi-clock"></i>
                                                        <span>{extractTimeFromISO(meeting.scheduledAt)} Hrs</span>
                                                    </div>
                                                </div>

                                                <div className="meeting-footer">
                                                    <a href={meeting.meetingUrl} target="_blank" rel="noopener noreferrer" className="join-btn">
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
                                        <Column body={dateBodyTemplate} header="Fecha" sortable style={{ minWidth: '8rem' }}></Column>
                                        <Column field="duration" header="Duración" style={{ minWidth: '8rem' }}></Column>
                                        <Column body={accessBodyTemplate} header="Acceso" style={{ minWidth: '8rem' }}></Column>
                                        <Column body={linkBodyTemplate} header="Enlace" style={{ minWidth: '10rem' }}></Column>
                                        <Column body={actionBodyTemplate} header="Acciones" style={{ minWidth: '8rem', textAlign: 'right' }}></Column>
                                    </DataTable>
                                </div>
                            </div>
                        </>
                    )}
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

            {/* MODAL PREMIUM */}
            <Dialog 
                visible={isAiModalOpen} 
                style={{ width: '90vw', maxWidth: '800px' }} 
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