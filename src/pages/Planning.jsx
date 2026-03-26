import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Calendar as CalendarIcon, Filter, Layers } from 'lucide-react';
import './Planning.css';

const timelineMonths = ['Avril', 'Mai', 'Juin', 'Juillet'];
export const Planning = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="planning-page animate-fade-in">
      <header className="editorial-header">
        <div>
          <h2 className="editorial-title">Rétroplanning</h2>
          <p className="editorial-subtitle">Vue globale des durées et dépendances des chantiers</p>
        </div>
        <div className="header-actions">
          <Button variant="outline"><Filter size={18}/> Filtrer</Button>
          <Button variant="secondary"><Layers size={18}/> Phases</Button>
          <Button variant="primary"><CalendarIcon size={18}/> Aujourd'hui</Button>
        </div>
      </header>

      <Card level="lowest" className="gantt-container glass-panel">
        <div className="gantt-header">
          <div className="gantt-label-col">
            <span className="label-sm">Chantier / Phase</span>
          </div>
          <div className="gantt-timeline-header">
            {timelineMonths.map((m, idx) => (
              <div key={idx} className="month-slot label-sm">{m}</div>
            ))}
          </div>
        </div>

        <div className="gantt-body">
          {tasks.map((task) => (
            <div key={task.id} className="gantt-row">
              <div className="gantt-label-col">
                <span className="body-md" style={{color: 'var(--primary)', fontWeight: 600}}>{task.project ? task.project.title : 'Chantier'}</span>
                <span className="label-sm">{task.title}</span>
              </div>
              <div className="gantt-timeline">
                {/* Timeline rails (20% opacity simulated by background choice) */}
                <div className="rail-grid">
                  <div className="rail"></div>
                  <div className="rail"></div>
                  <div className="rail"></div>
                  <div className="rail"></div>
                </div>
                
                {/* Task Bar */}
                <div 
                  className={`gantt-bar ${task.status}`}
                  style={{
                    left: `${task.start}%`,
                    width: `${task.duration}%`
                  }}
                >
                  <span className="bar-label">{task.duration} j</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Legend */}
      <div className="gantt-legend">
        <div className="legend-item">
          <div className="legend-swatch good"></div>
          <span className="label-sm">Dans les temps</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch warning"></div>
          <span className="label-sm">Risque de retard</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch upcoming"></div>
          <span className="label-sm">Planifié</span>
        </div>
      </div>
    </div>
  );
};
