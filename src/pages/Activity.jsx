import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from 'primereact/avatar';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import './Activity.css';

export default function Activity() {
    const navigate = useNavigate();
    const [isAiModalOpen, setAiModalOpen] = useState(false);
    
    // Estados de Filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState(null);

    const eventTypes = [
        { label: 'Todos los eventos', value: null },
        { label: 'Desarrollo (Tickets)', value: 'dev' },
        { label: 'Reuniones', value: 'meeting' },
        { label: 'Alertas de IA', value: 'ai' }
    ];

    // Datos extendidos y ricos (estilo Auditoría PRO Enterprise)
    const fullActivities = [
        { id: 1, user: 'Sergio Gómez', type: 'dev', action: 'movió la historia US-02 a Code Review', details: 'Status: In Progress ➔ Code Review', time: 'Hace 5 minutos', date: 'Hoy', icon: 'pi pi-arrows-h', color: '#0ea5e9' },
        { id: 2, user: 'Valeria Mendoza', type: 'meeting', action: 'subió la grabación "Sprint 1 Retrospective"', details: 'Duración: 45 min. Acceso: Público.', time: 'Hace 2 horas', date: 'Hoy', icon: 'pi pi-video', color: '#f97316' },
        { id: 3, user: 'Jose Saico', type: 'dev', action: 'resolvió 2 incidencias críticas (Bugs)', details: 'Bugs cerrados: BUG-102, BUG-105', time: 'Hace 4 horas', date: 'Hoy', icon: 'pi pi-check-circle', color: '#22c55e' },
        { id: 4, user: 'ManageWise AI', type: 'ai', action: 'sugiere reasignar 5 puntos de historia', details: 'Riesgo de retraso detectado en el perfil de Jose Saico.', time: 'Ayer', date: 'Ayer', icon: 'pi pi-sparkles', color: '#fbbf24' },
        { id: 5, user: 'Sergio Gómez', type: 'dev', action: 'modificó la estimación de US-04', details: 'Puntos: 8 ➔ 13', time: 'Ayer, 14:30', date: 'Ayer', icon: 'pi pi-sort-numeric-up-alt', color: '#8b5cf6' },
        { id: 6, user: 'Maria Lopez', type: 'dev', action: 'añadió un comentario en US-05', details: '"Falta confirmación del cliente para el diseño UI final."', time: 'Ayer, 10:15', date: 'Ayer', icon: 'pi pi-comment', color: '#64748b' }
    ];

    // Lógica de filtrado refactorizada para mayor claridad y seguridad
    const filteredActivities = fullActivities.filter(act => {
        const matchesSearch = act.user.toLowerCase().includes(searchTerm.toLowerCase()) || act.action.toLowerCase().includes(searchTerm.toLowerCase());
        
        let matchesType = false;
        if (filterType === null || filterType === undefined) {
            matchesType = true; // Por defecto o al seleccionar "Todos los eventos", todos pasan
        } else if (act.type === filterType) {
            matchesType = true;
        }

        return matchesSearch && matchesType;
    });

    return (
        <div className="dashboard-wrapper">
            {/* SIDEBAR UNIFICADO */}
            <aside className="dashboard-sidebar">
                <div className="brand">ManageWise</div>
                <nav className="nav-links">
                    <div className="nav-item" onClick={() => navigate('/home')}><i className="pi pi-chart-line"></i> DASHBOARD</div>
                    <div className="nav-item" onClick={() => navigate('/backlog')}><i className="pi pi-list"></i> BACKLOG</div>
                    <div className="nav-item" onClick={() => navigate('/members')}><i className="pi pi-users"></i> TEAM</div>
                    <div className="nav-item" onClick={() => navigate('/meeting')}><i className="pi pi-video"></i> MEETINGS</div>
                    
                    <div className="nav-item active" onClick={() => navigate('/activity')}>
                        <i className="pi pi-history"></i> ACTIVITY FEED
                        <span className="pro-text" style={{color: 'white'}}>PRO</span>
                    </div>
                    <div className="nav-item" onClick={() => navigate('/reports')}>
                        <i className="pi pi-file-export"></i> REPORTES
                        <span className="pro-text">PRO</span>
                    </div>
                    <div className="nav-item ai-nav-item" onClick={() => navigate('/ManageWiseAI')}>
                        <i className="pi pi-sparkles" style={{ color: '#fbbf24' }}></i> 
                        <div className="ai-text"><span>ManageWise</span><span>AI</span></div>
                        <span className="pro-text">PRO</span>
                    </div>
                </nav>
                <div className="sidebar-footer">
                    <div className="nav-item exit-item" onClick={() => navigate('/projects')}><i className="pi pi-arrow-left"></i> Ir a Proyectos</div>
                </div>
            </aside>

            <main className="dashboard-content">
                <div className="content-inner activity-inner">
                    
                    {/* CABECERA CON BOTÓN MEJORADO (SOLUCIÓN AL COLOR) */}
                    <header className="content-header">
                        <div>
                            <h1>Activity Feed & Audit Log</h1>
                            <p>Registro inmutable de eventos. Exclusivo del plan PRO.</p>
                        </div>
                        <div className="action-buttons">
                            {/* Botón solid dark para contraste perfecto */}
                            <Button label="Exportar Log (.CSV)" icon="pi pi-download" className="p-button p-button-secondary" onClick={() => alert('Generando exportación de log inmutable...')} />
                        </div>
                    </header>

                    {/* NUEVO: PANEL DE RESUMEN DE IA ✨ (Premium Feature) */}
                    <Card className="ai-summary-panel">
                        <div className="ai-summary-content">
                            <div className="ai-icon-pulse">
                                <i className="pi pi-sparkles"></i>
                            </div>
                            <div className="ai-summary-text">
                                <h3>Resumen Inteligente del Día</h3>
                                <p>Hoy se han registrado <strong>24 eventos</strong>. El 60% del esfuerzo del equipo se ha centrado en tareas de <em>Desarrollo</em> (US-02 y resolución de Bugs). La velocidad actual indica que el Sprint cerrará a tiempo. No se detectan bloqueos críticos.</p>
                            </div>
                        </div>
                    </Card>

                    {/* BARRA DE FILTROS AVANZADA CON SPACING MEJORADO */}
                    <div className="activity-filters-bar">
                        <span className="p-input-icon-left search-input-wrapper">
                            <i className="pi pi-search" />
                            <InputText value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar usuario, ticket o acción..." className="w-full" />
                        </span>
                        <Dropdown 
                            value={filterType} 
                            options={eventTypes} 
                            onChange={(e) => setFilterType(e.value)} 
                            placeholder="Filtrar por tipo" 
                            className="filter-dropdown"
                        />
                    </div>

                    {/* TIMELINE CON SPACING Y COLORES ENRIQUECIDOS */}
                    <div className="activity-timeline-container">
                        {filteredActivities.length === 0 ? <p className="empty-msg">No se encontraron actividades con estos filtros.</p> : null}
                        
                        {filteredActivities.map((act, index) => {
                            const showDateHeader = index === 0 || filteredActivities[index - 1].date !== act.date;

                            return (
                                <React.Fragment key={act.id}>
                                    {showDateHeader && <div className="timeline-date-divider"><i className="pi pi-calendar"></i> {act.date}</div>}
                                    {/* Data-date attribute to target for colors in CSS */}
                                    <div className="timeline-item" data-date={act.date}>
                                        <div className="timeline-icon" style={{ backgroundColor: `${act.color}20`, color: act.color }}>
                                            <i className={act.icon}></i>
                                        </div>
                                        <div className="timeline-content">
                                            <div className="timeline-main-info">
                                                <div className="timeline-text">
                                                    <Avatar label={act.user.substring(0, 2).toUpperCase()} shape="circle" size="small" className="timeline-avatar" />
                                                    <span className="t-user">{act.user}</span>
                                                    <span className="t-action">{act.action}</span>
                                                    {act.type === 'ai' && <Tag value="AI System" severity="warning" style={{marginLeft: '10px', fontSize: '0.7rem'}} />}
                                                </div>
                                                <span className="timeline-time">{act.time}</span>
                                            </div>
                                            {/* Detalles adicionales ricos (Auditoría PRO) */}
                                            {act.details && (
                                                <div className="timeline-details">
                                                    <i className="pi pi-info-circle"></i> {act.details}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            </main>

            {/* Modal de Pago Unificado */}
            <Dialog visible={isAiModalOpen} style={{ width: '90vw', maxWidth: '1100px' }} onHide={() => setAiModalOpen(false)} className="pricing-dialog" showHeader={false} dismissableMask={true}>
                {/* ... Contenido del modal de precios (el mismo que ya tienes) ... */}
            </Dialog>
        </div>
    );
}