import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Checkbox } from 'primereact/checkbox';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import './Reports.css';

export default function Reports() {
    const navigate = useNavigate();
    const [isAiModalOpen, setAiModalOpen] = useState(false);

    // --- ESTADOS DEL GENERADOR DE REPORTES ---
    const [reportType, setReportType] = useState('velocity');
    const [dateRange, setDateRange] = useState('last_30');
    const [includeAI, setIncludeAI] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false); // Estado para simular carga

    const reportOptions = [
        { label: 'Rendimiento General (Executive)', value: 'velocity' },
        { label: 'Auditoría de Calidad y Bugs', value: 'bugs' },
        { label: 'Análisis de Cuellos de Botella', value: 'bottleneck' },
        { label: 'Productividad por Desarrollador', value: 'team' }
    ];

    const dateOptions = [
        { label: 'Últimos 30 días', value: 'last_30' },
        { label: 'Sprint Actual', value: 'sprint' },
        { label: 'Último Trimestre (Q1)', value: 'q1' }
    ];

    // --- ESTADOS DE API ---
    const apiKey = "mw_live_sk_9f8a7d6b5e4c3b2a1";
    const [copied, setCopied] = useState(false);

    const copyApiKey = () => {
        navigator.clipboard.writeText(apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // --- FUNCIÓN DE ACTUALIZACIÓN SIMULADA ---
    const handleUpdatePreview = () => {
        setIsUpdating(true);
        // Simula un tiempo de carga de 1.5 segundos
        setTimeout(() => {
            setIsUpdating(false);
        }, 1500);
    };

    // --- FUNCIÓN MÁGICA FRONTEND PARA PDF ---
    const handleExportPDF = () => {
        // Esto abre la ventana de impresión nativa del navegador.
        // Con el CSS "@media print" que pusimos, solo imprimirá el reporte.
        window.print(); 
    };

    // ==========================================
    // DATOS PARA EL REPORTE PRO 
    // ==========================================
    const velocityData = {
        labels: ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4', 'Sprint 5'],
        datasets: [
            { label: 'Puntos Planeados', backgroundColor: '#e2e8f0', data: [40, 45, 50, 48, 55], borderRadius: 4 },
            { label: 'Puntos Completados', backgroundColor: '#f97316', data: [38, 45, 42, 48, 50], borderRadius: 4 }
        ]
    };

    const distributionData = {
        labels: ['Nuevos Features', 'Resolución de Bugs', 'Deuda Técnica', 'Soporte'],
        datasets: [{
            data: [55, 20, 15, 10],
            backgroundColor: ['#0ea5e9', '#ef4444', '#f97316', '#8b5cf6'],
            borderWidth: 0
        }]
    };

    const doughnutOptions = {
        maintainAspectRatio: false,
        plugins: { legend: { position: 'right', labels: { usePointStyle: true } } },
        cutout: '70%'
    };

    const rawData = [
        { id: 'US-102', type: 'Feature', status: 'Done', time: '3.2 días', owner: 'Sergio G.' },
        { id: 'BUG-45', type: 'Bug', status: 'Done', time: '0.8 días', owner: 'Jose S.' },
        { id: 'US-105', type: 'Feature', status: 'In Review', time: '4.5 días', owner: 'Maria L.' },
        { id: 'TECH-12', type: 'Refactor', status: 'Done', time: '2.1 días', owner: 'Valeria M.' },
    ];

    const typeBodyTemplate = (rowData) => {
        let severity = 'info';
        if (rowData.type === 'Bug') severity = 'danger';
        if (rowData.type === 'Refactor') severity = 'warning';
        return <Tag value={rowData.type} severity={severity} />;
    };

    return (
        <div className="dashboard-wrapper">
            {/* SIDEBAR UNIFICADO */}
            <aside className="dashboard-sidebar hide-on-print">
                <div className="brand">ManageWise</div>
                <nav className="nav-links">
                    <div className="nav-item" onClick={() => navigate('/home')}><i className="pi pi-chart-line"></i> DASHBOARD</div>
                    <div className="nav-item" onClick={() => navigate('/backlog')}><i className="pi pi-list"></i> BACKLOG</div>
                    <div className="nav-item" onClick={() => navigate('/members')}><i className="pi pi-users"></i> TEAM</div>
                    <div className="nav-item" onClick={() => navigate('/meeting')}><i className="pi pi-video"></i> MEETINGS</div>
                    
                    <div className="nav-item" onClick={() => navigate('/activity')}>
                        <i className="pi pi-history"></i> ACTIVITY FEED
                        <span className="pro-text">PRO</span>
                    </div>
                    <div className="nav-item active" onClick={() => navigate('/reports')}>
                        <i className="pi pi-file-export"></i> REPORTES
                        <span className="pro-text" style={{color: 'white'}}>PRO</span>
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

            <main className="dashboard-content print-full-width">
                <div className="content-inner reports-inner">
                    
                    <header className="content-header reports-header hide-on-print">
                        <div>
                            <h1>Reportes & Integraciones</h1>
                            <p>Exporta datos estructurados y conecta ManageWise con tus herramientas empresariales.</p>
                        </div>
                        
                        <div className="export-zone-pro">
                            <span className="export-title-pro">EXPORTACIÓN RÁPIDA:</span>
                            <div className="export-btn-group-pro">
                                {/* BOTÓN PDF CORREGIDO CON SU ÍCONO */}
                                <button className="export-btn-pro btn-pdf" onClick={handleExportPDF} title="Exportar a PDF">
                                    <i className="pi pi-file-pdf icon-pdf"></i>
                                </button>
                                <button className="export-btn-pro btn-excel" onClick={() => alert('Solo disponible en el plan Business Elite')} title="Exportar a Excel">
                                    <i className="pi pi-file-excel icon-excel"></i>
                                </button>
                                <button className="export-btn-pro btn-powerbi" onClick={() => alert('Conectando a Power BI...')} title="Power BI API">
                                    <i className="pi pi-chart-bar icon-powerbi"></i>
                                </button>
                            </div>
                        </div>
                    </header>

                    <div className="reports-top-grid hide-on-print">
                        <Card className="config-card" title="Generador de Reportes">
                            <div className="report-form">
                                <div className="field">
                                    <label>Tipo de Métrica</label>
                                    <Dropdown value={reportType} options={reportOptions} onChange={(e) => setReportType(e.value)} className="w-full" />
                                </div>
                                <div className="field">
                                    <label>Rango de Fechas</label>
                                    <Dropdown value={dateRange} options={dateOptions} onChange={(e) => setDateRange(e.value)} className="w-full" />
                                </div>
                                <div className="field-checkbox-custom">
                                    <Checkbox inputId="includeAI" checked={includeAI} onChange={e => setIncludeAI(e.checked)} />
                                    <label htmlFor="includeAI">Incluir Análisis Predictivo de IA</label>
                                </div>
                                {/* BOTÓN CON ESTADO DE CARGA */}
                                <Button 
                                    label={isUpdating ? "Actualizando..." : "Actualizar Vista Previa"} 
                                    icon={isUpdating ? "pi pi-spin pi-spinner" : "pi pi-sync"} 
                                    className="p-button-orange w-full mt-3" 
                                    onClick={handleUpdatePreview}
                                    disabled={isUpdating}
                                />
                            </div>
                        </Card>

                        <div className="api-panel-wrapper">
                            <Card className="api-card">
                                <h3><i className="pi pi-database"></i> Conexión API REST</h3>
                                <p>Utiliza esta clave para extraer los datos de tu proyecto en tiempo real hacia PowerBI, Tableau o herramientas internas.</p>
                                <div className="api-key-container">
                                    <InputText value={apiKey} readOnly className="api-key-input" />
                                    <Button icon={copied ? "pi pi-check" : "pi pi-copy"} className={`copy-btn ${copied ? 'p-button-success' : 'p-button-secondary'}`} onClick={copyApiKey} tooltip="Copiar API Key" />
                                </div>
                                <div className="api-status">
                                    <Tag severity="success" value="Conexión Activa" rounded />
                                    <span className="api-docs-link">Ver Documentación de API <i className="pi pi-external-link"></i></span>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* ESTE ES EL CONTENEDOR QUE SE IMPRIMIRÁ COMO PDF */}
                    <div className="preview-section printable-area">
                        <div className="preview-header hide-on-print">
                            <h2>Vista Previa del Documento</h2>
                            <span className="preview-badge">MODO PRO ACTIVADO</span>
                        </div>
                        
                        <div className="report-canvas">
                            <div className="canvas-header">
                                <div className="canvas-title-group">
                                    <h2>Reporte Ejecutivo: Rendimiento General</h2>
                                    <p>Proyecto: <strong>ManageWise SaaS</strong> | Rango: <strong>Últimos 30 días</strong></p>
                                </div>
                                <div className="canvas-logo">MW PRO</div>
                            </div>

                            <div className="canvas-kpi-grid">
                                <div className="kpi-box">
                                    <span className="kpi-label">Velocidad Promedio</span>
                                    <div className="kpi-value-group">
                                        <span className="kpi-value">44 <small>pts</small></span>
                                        <span className="kpi-trend positive"><i className="pi pi-arrow-up"></i> 12%</span>
                                    </div>
                                </div>
                                <div className="kpi-box">
                                    <span className="kpi-label">Cycle Time (Tiempo Medio)</span>
                                    <div className="kpi-value-group">
                                        <span className="kpi-value">3.2 <small>días</small></span>
                                        <span className="kpi-trend positive"><i className="pi pi-arrow-down"></i> 0.5d</span>
                                    </div>
                                </div>
                                <div className="kpi-box">
                                    <span className="kpi-label">Índice de Calidad</span>
                                    <div className="kpi-value-group">
                                        <span className="kpi-value">94 <small>%</small></span>
                                        <span className="kpi-trend negative"><i className="pi pi-arrow-down"></i> 2%</span>
                                    </div>
                                </div>
                                <div className="kpi-box">
                                    <span className="kpi-label">Bloqueos Activos</span>
                                    <div className="kpi-value-group">
                                        <span className="kpi-value">1</span>
                                        <span className="kpi-trend positive"><i className="pi pi-arrow-down"></i> 2</span>
                                    </div>
                                </div>
                            </div>

                            <div className="canvas-charts-grid">
                                <div className="canvas-chart-box chart-wrapper">
                                    <h3>Historial de Velocidad vs Planeación</h3>
                                    <div className="chart-container-relative">
                                        <Chart type="bar" data={velocityData} options={{ maintainAspectRatio: false }} style={{ height: '250px' }} />
                                    </div>
                                </div>
                                <div className="canvas-chart-box chart-wrapper">
                                    <h3>Distribución del Esfuerzo</h3>
                                    <div className="chart-container-relative">
                                        <Chart type="doughnut" data={distributionData} options={doughnutOptions} style={{ height: '250px' }} />
                                    </div>
                                </div>
                            </div>

                            {includeAI && (
                                <div className="canvas-ai-conclusion">
                                    <div className="ai-c-header">
                                        <i className="pi pi-sparkles"></i> Conclusión Automática de IA
                                    </div>
                                    <p>El equipo mantiene una velocidad estable y el <em>Cycle Time</em> ha mejorado. Sin embargo, la distribución muestra un 20% de esfuerzo en resolución de Bugs, causando una caída en la calidad. Se sugiere dedicar el Sprint 6 a reducir deuda técnica.</p>
                                </div>
                            )}

                            <div className="canvas-table-box">
                                <h3>Muestra de Datos de Exportación (Raw Data)</h3>
                                <DataTable value={rawData} size="small" stripedRows className="p-datatable-sm">
                                    <Column field="id" header="Ticket ID" style={{ fontWeight: 'bold' }}></Column>
                                    <Column field="type" header="Tipo" body={typeBodyTemplate}></Column>
                                    <Column field="status" header="Estado Actual"></Column>
                                    <Column field="owner" header="Asignado a"></Column>
                                    <Column field="time" header="Lead Time"></Column>
                                </DataTable>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Dialog visible={isAiModalOpen} style={{ width: '90vw', maxWidth: '1100px' }} onHide={() => setAiModalOpen(false)} className="pricing-dialog" showHeader={false} dismissableMask={true}>
                 {/* Aquí va el contenido de tus planes de siempre */}
            </Dialog>
        </div>
    );
}