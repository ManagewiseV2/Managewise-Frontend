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

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Meeting() {
    const navigate = useNavigate();
    const currentProjectId = localStorage.getItem('current_project_id');

    // --- ESTADOS DE MODALES ---
    const [isMeetingModalOpen, setMeetingModalOpen] = useState(false);
    const [isRecordModalOpen, setRecordModalOpen] = useState(false);
    const [isAiModalOpen, setAiModalOpen] = useState(false); // Modal de Planes
    const [editingMeetingId, setEditingMeetingId] = useState(null);
    const [editingRecordId, setEditingRecordId] = useState(null);

    // --- ESTADOS DE DATOS ---
    const [meetings, setMeetings] = useState([]);
    const [recordings, setRecordings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [globalFilter, setGlobalFilter] = useState('');

    // --- ESTADOS DE FORMULARIO ---
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState(''); 
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [link, setLink] = useState('');
    const [recTitle, setRecTitle] = useState('');
    const [recDate, setRecDate] = useState('');
    const [recDuration, setRecDuration] = useState('');
    const [recAccess, setRecAccess] = useState('Público');
    const [recLink, setRecLink] = useState('');

    const accessOptions = [{ label: 'Público', value: 'Público' }, { label: 'Privado', value: 'Privado' }];

    // 🚨 MANEJADOR DE CLICS PRO
    const handleProClick = (e) => {
        e.preventDefault();
        setAiModalOpen(true); // Abre el modal de upgrade
    };

    const getAuthHeaders = () => {
        const token = localStorage.getItem('jwt_token');
        if (!token) { navigate('/login'); throw new Error("No token"); }
        return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
    };

    const fetchMeetingsAndRecordings = async () => {
        if (!currentProjectId) { navigate('/projects'); return; }
        setIsLoading(true);
        try {
            const headers = getAuthHeaders();
            const [meetingsRes, recordingsRes] = await Promise.all([
                fetch(`${API_BASE}/meetings/project/${currentProjectId}`, { headers }),
                fetch(`${API_BASE}/recordings/project/${currentProjectId}`, { headers })
            ]);
            if (meetingsRes.ok) setMeetings(await meetingsRes.json());
            if (recordingsRes.ok) setRecordings(await recordingsRes.json());
        } catch (error) { console.error("Error cargando datos", error); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchMeetingsAndRecordings(); }, []);

    // --- HELPERS FECHAS ---
    const extractDateFromISO = (iso) => iso ? iso.split('T')[0] : '';
    const extractTimeFromISO = (iso) => iso ? iso.split('T')[1]?.substring(0, 5) : '';
    const createISOString = (d, t) => `${d}T${t}:00.000Z`;

    const getMeetingStatus = (isoDate) => {
        const todayStr = new Date().toISOString().split('T')[0];
        const meetingDate = extractDateFromISO(isoDate);
        if (meetingDate === todayStr) return { label: 'HOY', severity: 'danger' };
        if (meetingDate < todayStr) return { label: 'PASADA', severity: 'secondary' };
        return { label: 'PRÓXIMA', severity: 'info' };
    };

    const saveMeeting = async () => {
        const payload = { title, description: description || 'Revisión', scheduledAt: createISOString(date, time), meetingUrl: link, projectId: currentProjectId };
        const method = editingMeetingId ? 'PUT' : 'POST';
        const url = editingMeetingId ? `${API_BASE}/meetings/${editingMeetingId}` : `${API_BASE}/meetings`;
        
        await fetch(url, { method, headers: getAuthHeaders(), body: JSON.stringify(payload) });
        setMeetingModalOpen(false);
        fetchMeetingsAndRecordings();
    };

    const deleteMeeting = async (id) => {
        await fetch(`${API_BASE}/meetings/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
        fetchMeetingsAndRecordings();
    };

    // --- RENDER ---
    return (
        <div className="dashboard-wrapper">
            <aside className="dashboard-sidebar">
                <div className="brand">ManageWise</div>
                <nav className="nav-links">
                    <div className="nav-item" onClick={() => navigate('/home')}><i className="pi pi-chart-line"></i> DASHBOARD</div>
                    <div className="nav-item" onClick={() => navigate('/backlog')}><i className="pi pi-list"></i> BACKLOG</div>
                    <div className="nav-item" onClick={() => navigate('/members')}><i className="pi pi-users"></i> TEAM</div>
                    <div className="nav-item active" onClick={() => navigate('/meeting')}><i className="pi pi-video"></i> MEETINGS</div>
                    
                    {/* BLOQUEADOS CON MODAL PLANES */}
                    <div className="nav-item" onClick={handleProClick}>
                        <i className="pi pi-history"></i> ACTIVITY FEED
                        <span className="pro-text">PRO</span>
                    </div>
                    <div className="nav-item" onClick={handleProClick}>
                        <i className="pi pi-file-export"></i> REPORTES
                        <span className="pro-text">PRO</span>
                    </div>
                    <div className="nav-item ai-nav-item" onClick={handleProClick}>
                        <i className="pi pi-sparkles" style={{ color: '#fbbf24' }}></i> 
                        <div className="ai-text"><span>ManageWise AI</span></div>
                        <span className="pro-text">PRO</span>
                    </div>
                </nav>
                <div className="sidebar-footer">
                    <div className="nav-item exit-item" onClick={() => navigate('/projects')}><i className="pi pi-arrow-left"></i> Proyectos</div>
                </div>
            </aside>

            <main className="dashboard-content">
                <div className="content-inner">
                    <header className="content-header">
                        <h1>Reuniones</h1>
                        <Button label="Nueva Reunión" icon="pi pi-plus" className="p-button-orange" onClick={() => setMeetingModalOpen(true)} />
                    </header>

                    {isLoading ? <p>Cargando...</p> : (
                        <div className="meetings-grid">
                            {meetings.map(m => (
                                <div key={m.id} className="meeting-card">
                                    <h3>{m.title} <Tag value={getMeetingStatus(m.scheduledAt).label} severity={getMeetingStatus(m.scheduledAt).severity} /></h3>
                                    <p><i className="pi pi-calendar"></i> {extractDateFromISO(m.scheduledAt)}</p>
                                    <div className="meeting-actions">
                                        <Button icon="pi pi-trash" className="p-button-danger" onClick={() => deleteMeeting(m.id)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* MODAL PLANES (POPUPEADO) */}
            <Dialog visible={isAiModalOpen} onHide={() => setAiModalOpen(false)} showHeader={false} dismissableMask style={{ width: '90vw', maxWidth: '800px' }}>
                <div className="pricing-popup-container">
                    <div className="upgrade-header">
                        <h1>Actualiza tu Plan</h1>
                        <p>Las funciones Pro requieren una suscripción activa.</p>
                    </div>
                    <div className="pricing-grid">
                        <div className="pricing-card">
                            <h3>Plan Light</h3>
                            <div className="price"><span>$0</span></div>
                            <Button label="Tu Plan Actual" disabled className="w-full" />
                        </div>
                        <div className="pricing-card popular">
                            <h3>Pro Business</h3>
                            <div className="price"><span>$29</span></div>
                            <Button label="Actualizar a Pro" className="p-button-orange w-full" />
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}