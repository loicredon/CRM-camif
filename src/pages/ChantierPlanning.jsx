import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Calendar as CalendarIcon, Filter, Layers, ArrowLeft, Download, Plus } from 'lucide-react';
import './Planning.css'; // Reuse general planning styles

const timelineWeeks = ['Semaine 14', 'Semaine 15', 'Semaine 16', 'Semaine 17', 'Semaine 18'];
// Remove hardcoded project tasks

export const ChantierPlanning = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/api/projects/${id}`)
      .then(res => res.json())
      .then(data => setProject(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!project) return <div className="animate-fade-in" style={{padding: 'var(--spacing-8)'}}>Chargement...</div>;

  return (
    <div className="planning-page animate-fade-in">
      <header className="editorial-header">
        <div>
          <div style={{display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center', marginBottom: 'var(--spacing-2)'}}>
            <Button variant="secondary" className="btn-icon" onClick={() => navigate('/chantiers')}>
              <ArrowLeft size={18}/> Retour
            </Button>
            <Badge status="active">En cours</Badge>
          </div>
          <h2 className="editorial-title">Rétroplanning Détaillé</h2>
          <p className="editorial-subtitle">{project.title} • Vue chronologique par semaine</p>
        </div>
        <div className="header-actions">
          <Button variant="secondary"><Download size={18}/> Exporter</Button>
          <Button variant="primary"><Plus size={18}/> Nouvelle Tâche</Button>
        </div>
      </header>

      {/* KPI row for this particular planning */}
      <div style={{display: 'flex', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-4)'}}>
        <Card level="lowest" style={{flex: 1, padding: 'var(--spacing-4)'}}>
          <span className="label-sm">Avancement Global</span>
          <div style={{display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)', marginTop: '8px'}}>
            <h3 style={{color: 'var(--primary)', margin: 0}}>{project.progress}%</h3>
            <div style={{flex: 1, height: '4px', background: 'var(--surface-container-high)', borderRadius: '4px'}}>
              <div style={{width: `${project.progress}%`, height: '100%', background: 'var(--secondary-container)', borderRadius: '4px'}}></div>
            </div>
          </div>
        </Card>
        <Card level="lowest" style={{flex: 1, padding: 'var(--spacing-4)'}}>
          <span className="label-sm">Date de livraison prévue</span>
          <h3 style={{color: 'var(--primary)', margin: '8px 0 0 0'}}>{project.date || 'Non définie'}</h3>
        </Card>
      </div>

      <Card level="lowest" className="gantt-container glass-panel">
        <div className="gantt-header">
          <div className="gantt-label-col">
            <span className="label-sm">Tâche / Assigné à</span>
          </div>
          <div className="gantt-timeline-header">
            {timelineWeeks.map((week, idx) => (
              <div key={idx} className="month-slot label-sm" style={{borderLeft: idx > 0 ? 'var(--ghost-border)' : 'none'}}>
                {week}
              </div>
            ))}
          </div>
        </div>

        <div className="gantt-body">
          {project.tasks && project.tasks.map((task) => (
            <div key={task.id} className="gantt-row">
              <div className="gantt-label-col">
                <span className="body-md" style={{color: 'var(--primary)', fontWeight: 600}}>{task.title}</span>
                <span className="label-sm">{task.team}</span>
              </div>
              <div className="gantt-timeline">
                <div className="rail-grid">
                  {timelineWeeks.map((_, i) => (
                    <div key={i} className="rail"></div>
                  ))}
                </div>
                
                <div 
                  className={`gantt-bar ${task.status}`}
                  style={{
                    left: `${task.start}%`,
                    width: `${task.duration}%`
                  }}
                >
                  <span className="bar-label">{task.duration / 5} sem.</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      <div className="gantt-legend">
        <div className="legend-item">
          <div className="legend-swatch good"></div>
          <span className="label-sm">Terminée / En cours</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch warning"></div>
          <span className="label-sm">Bloquante / Retard</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch upcoming"></div>
          <span className="label-sm">À venir</span>
        </div>
      </div>
    </div>
  );
};
