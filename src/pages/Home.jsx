import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
    const navigate = useNavigate();
    const [activeSprint, setActiveSprint] = useState(1);
    
    // ESTADO PARA EL MODAL EMERGENTE DE PRECIOS
    const [isAiModalOpen, setAiModalOpen] = useState(false);

    const sprintStats = {
        1: { points: 120, bugs: 2, progress: 85, status: 'ACTIVE', data: [100, 95, 80, 80, 50, 45, 20, 5] },
        2: { points: 150, bugs: 5, progress: 100, status: 'CLOSED', data: [150, 130, 110, 90, 70, 40, 10, 0] },
        3: { points: 90, bugs: 0, progress: 10, status: 'PLANNING', data: [90, 88, 88, 85, 85, 82, 80, 80] }
    };

    const burndownData = {
        labels: ['Día 1', 'Día 3', 'Día 5', 'Día 7', 'Día 9', 'Día 11', 'Día 13', 'Día 15'],
        datasets: [
            {
                label: 'Línea Ideal',
                data: [100, 85, 70, 55, 40, 25, 10, 0],
                borderColor: '#cbd5e1',
                borderWidth: 3,
                borderDash: [5, 5],
                fill: false,
                tension: 0
            },
            {
                label: `Trabajo Real - Sprint ${activeSprint}`,
                data: sprintStats[activeSprint].data,
                borderColor: '#f97316',
                borderWidth: 5, 
                backgroundColor: 'rgba(249, 115, 22, 0.1)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    const burndownOptions = {
        maintainAspectRatio: false,
        plugins: { legend: { labels: { font: { size: 16, weight: 'bold' } } } },
        scales: {
            y: { ticks: { font: { size: 14, weight: 'bold' } } },
            x: { ticks: { font: { size: 14, weight: 'bold' } } }
        }
    };

    // DATOS DE ACTIVIDAD
    const activities = [
        { id: 1, user: 'Sergio Gómez', action: 'movió la historia US-02 a Code Review', time: 'Hace 5 minutos', icon: 'pi pi-arrows-h', color: '#0ea5e9' },
        { id: 2, user: 'Valeria Mendoza', action: 'subió la grabación "Sprint 1 Retrospective"', time: 'Hace 2 horas', icon: 'pi pi-video', color: '#f97316' },
        { id: 3, user: 'Jose Saico', action: 'resolvió 2 incidencias críticas (Bugs)', time: 'Hace 4 horas', icon: 'pi pi-check-circle', color: '#22c55e' },
        { id: 4, user: 'ManageWise AI', action: 'sugiere reasignar 5 puntos de historia por riesgo de retraso', time: 'Ayer', icon: 'pi pi-sparkles', color: '#fbbf24' }
    ];

    return (
        <div className="dashboard-wrapper">
            <aside className="dashboard-sidebar">
                <div className="brand">ManageWise</div>
                
                {/* MENU PRINCIPAL */}
                <nav className="nav-links">
                    <div className="nav-item active" onClick={() => navigate('/home')}><i className="pi pi-chart-line"></i> DASHBOARD</div>
                    <div className="nav-item" onClick={() => navigate('/backlog')}><i className="pi pi-list"></i> BACKLOG</div>
                    <div className="nav-item" onClick={() => navigate('/members')}><i className="pi pi-users"></i> TEAM</div>
                    <div className="nav-item" onClick={() => navigate('/meeting')}><i className="pi pi-video"></i> MEETINGS</div>
                    
                    {/* Abre el Modal de Precios */}
                    <div className="nav-item" onClick={() => navigate('/activity')}>
                        <i className="pi pi-history"></i> ACTIVITY FEED
                        <span className="pro-text">PRO</span>
                    </div>
                    
                    {/* Abre el Modal de Precios */}
                    <div className="nav-item" onClick={() => navigate('/reports')}>
                        <i className="pi pi-file-export"></i> REPORTES
                        <span className="pro-text">PRO</span>
                    </div>

                    {/* Abre el Modal de Precios */}
                    <div className="nav-item ai-nav-item" onClick={() => navigate('/ManageWiseAI')}>
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
                <div className="content-inner">
                    <header className="content-header">
                        <div>
                            <h1>Panel de Control del Proyecto</h1>
                            <p>Gestión avanzada de rendimiento para <strong>ManageWise</strong>.</p>
                        </div>
                        
                        {/* Botones de Exportación */}
                        <div className="export-actions">
                            <span className="export-label">Exportar Reportes:</span>
                            <div className="export-buttons-group">
                                {/* OJO AQUÍ: Quité "p-button-outlined" para que sea rojo sólido */}
                                <Button icon="pi pi-file-pdf" className="p-button-danger action-btn-sm" tooltip="Exportar a PDF" tooltipOptions={{position: 'top'}} onClick={() => setAiModalOpen(true)} />
                                <Button icon="pi pi-file-excel" className="p-button-outlined p-button-success action-btn-sm" tooltip="Exportar a Excel" tooltipOptions={{position: 'top'}} onClick={() => setAiModalOpen(true)} />
                                <Button icon="pi pi-chart-bar" className="p-button-outlined p-button-help action-btn-sm" tooltip="Conectar con Power BI" tooltipOptions={{position: 'top'}} onClick={() => setAiModalOpen(true)} />
                            </div>
                        </div>
                    </header>

                    <div className="main-grid-layout">
                        {/* Sprints */}
                        <div className="sprint-navigation">
                            <h2 className="section-label">Sprints del Proyecto</h2>
                            <div className="sprint-list">
                                {[1, 2, 3].map(num => (
                                    <div 
                                        key={num} 
                                        className={`sprint-hero-card ${activeSprint === num ? 'active' : ''}`}
                                        onClick={() => setActiveSprint(num)}
                                    >
                                        <div className="sprint-main-info">
                                            <span className="sprint-number">SPRINT 0{num}</span>
                                            <Tag value={sprintStats[num].status} severity={num === 1 ? 'success' : 'secondary'} />
                                        </div>
                                        <i className="pi pi-chevron-right"></i>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Gráficos */}
                        <div className="graphics-section">
                            <Card className="grid-full main-card-chart" title={`BURNDOWN: SPRINT ${activeSprint}`}>
                                <div className="chart-container">
                                    <Chart type="line" data={burndownData} options={burndownOptions} style={{ height: '450px', width: '100%' }} />
                                </div>
                            </Card>

                            <div className="lower-grid">
                                <Card className="grid-half" title="Distribución">
                                    <Chart type="pie" data={{
                                        labels: ['Features', 'Bugs', 'Refactor'],
                                        datasets: [{ data: [65, 20, 15], backgroundColor: ['#f97316', '#0f172a', '#ef4444'] }]
                                    }} style={{ height: '280px', width: '100%' }} />
                                </Card>

                                <Card className="grid-half" title="Esfuerzo del Equipo">
                                    <Chart type="bar" data={{
                                        labels: ['Sergio', 'Jose', 'Luni'],
                                        datasets: [{ label: 'Puntos', backgroundColor: '#f97316', data: [12, 19, 8] }]
                                    }} style={{ height: '280px', width: '100%' }} />
                                </Card>
                            </div>

                            {/* Métricas */}
                            <Card className="grid-full metrics-footer">
                                <div className="giant-stats">
                                    <div className="g-stat">
                                        <span className="g-label">PUNTOS TOTALES</span>
                                        <h2 className="g-value">{sprintStats[activeSprint].points}</h2>
                                    </div>
                                    <div className="g-stat">
                                        <span className="g-label">PROGRESO</span>
                                        <h2 className="g-value text-orange">{sprintStats[activeSprint].progress}%</h2>
                                    </div>
                                    <div className="g-stat">
                                        <span className="g-label">INCIDENCIAS</span>
                                        <h2 className="g-value text-red">{sprintStats[activeSprint].bugs}</h2>
                                    </div>
                                </div>
                            </Card>

                            
                        </div>
                    </div>
                </div>
            </main>

            {/* MODAL EMERGENTE DE PRECIOS */}
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
                                    <li><i className="pi pi-check"></i> 20 Colaboradores</li>
                                    <li><i className="pi pi-check"></i> Reportes PDF y Excel</li>
                                    <li><i className="pi pi-check"></i> <strong>ManageWise AI (Básico)</strong></li>
                                </ul>
                            </div>
                            <Button label="Actualizar a Pro" className="p-button-orange w-full" onClick={() => alert('Redirigiendo a pasarela de pago...')} />
                        </div>

                        <div className="pricing-card elite">
                            <div className="pricing-header">
                                <h3>Gold Elite</h3>
                                <p>Scale your business</p>
                                <div className="price">
                                    <span className="currency">$</span><span className="amount">99</span><span className="period">/mo</span>
                                </div>
                            </div>
                            <div className="pricing-features">
                                <ul>
                                    <li><i className="pi pi-check"></i> Todo en Pro Business</li>
                                    <li><i className="pi pi-check"></i> Colaboradores Ilimitados</li>
                                    <li><i className="pi pi-check"></i> Integración Power BI</li>
                                    <li><i className="pi pi-check"></i> <strong>ManageWise AI (Ilimitado)</strong></li>
                                </ul>
                            </div>
                            <Button label="Actualizar a Gold Elite" className="p-button-outlined p-button-help w-full" onClick={() => alert('Abriendo chat...')} />
                        </div>
                    </div>
                </div>
            </Dialog>

        </div>
    );
}