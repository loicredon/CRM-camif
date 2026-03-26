import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Plus, ArrowRight, Activity, TrendingUp, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const ProgressBar = ({ percent }) => {
  // Couleur selon l'avancement
  let color = 'var(--tertiary-fixed-dim)'; // Low (orange/red)
  if (percent >= 30) color = 'var(--primary-fixed-dim)'; // Medium (blue)
  if (percent >= 70) color = 'var(--secondary-container)'; // High (green) - changed to secondary-container to match "active" theme

  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percent}%`, backgroundColor: color }}></div>
      </div>
      <span className="progress-text label-sm">{percent}%</span>
    </div>
  );
};

export const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ activeProjects: 0, warmProspects: 0, atRiskTasks: 0 });
  const [projects, setProjects] = useState([]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    // Fetch Dashboard Stats
    fetch('http://localhost:3001/api/dashboard')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));

    // Fetch Projects
    fetch('http://localhost:3001/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data.slice(0, 3))) // Top 3
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="dashboard animate-fade-in">
      <header className="editorial-header">
        <div>
          <h2 className="editorial-title">Tableau de Bord</h2>
          <p className="editorial-subtitle">Vue globale des opérations et statut des chantiers</p>
        </div>
      </header>

      <div className="dashboard-grid">
        {/* KPI Cards */}
        <div className="kpi-group">
          <Card level="lowest" className="kpi-card">
            <div className="kpi-icon"><Activity size={24}/></div>
            <div className="kpi-data">
              <span className="label-sm">Chantiers Actifs</span>
              <h3>{stats.activeProjects}</h3>
            </div>
          </Card>
          <Card level="lowest" className="kpi-card">
            <div className="kpi-icon"><TrendingUp size={24}/></div>
            <div className="kpi-data">
              <span className="label-sm">Prospects Chauds</span>
              <h3>{stats.warmProspects}</h3>
            </div>
          </Card>
          <Card level="lowest" className="kpi-card">
            <div className="kpi-icon alert"><AlertCircle size={24}/></div>
            <div className="kpi-data">
              <span className="label-sm">À Risque (Retard)</span>
              <h3>{stats.atRiskTasks}</h3>
            </div>
          </Card>
        </div>

        {/* Main Content Areas */}
        <div className="dashboard-content">
          <div className="main-col">
            <section className="dashboard-section">
              <div className="section-header">
                <h3>Chantiers Prioritaires</h3>
                <Button variant="secondary" className="btn-sm">Voir tout</Button>
              </div>
              
              <Card level="low" className="list-card">
                <div className="list-header label-sm">
                  <span>Projet</span>
                  <span>Statut</span>
                  <span>Progression</span>
                </div>
                
                {projects.map(project => (
                  <Card key={project.id} level="lowest" className="list-item">
                    <div className="project-info">
                      <h4>{project.title}</h4>
                      <span className="label-sm">{project.location} {project.contact ? `- Client: ${project.contact.name}` : ''}</span>
                    </div>
                    {project.status === 'inProgress' && <Badge status="active">Actif</Badge>}
                    {project.status === 'todo' && <Badge status="prospect">À démarrer</Badge>}
                    {project.status === 'done' && <Badge status="neutral">Terminé</Badge>}
                    <ProgressBar percent={project.progress} />
                  </Card>
                ))}
              </Card>
            </section>
          </div>

          <div className="side-col">
            <section className="dashboard-section">
              <div className="section-header">
                <h3>Actions Requises</h3>
              </div>
              <Card level="high" className="action-card">
                <div className="action-item">
                  <div className="action-dot risk"></div>
                  <div>
                     <h5>Validation Plans Architecte</h5>
                     <span className="label-sm">Rénovation Haussmannien</span>
                  </div>
                  <Button variant="outline" className="btn-icon"><ArrowRight size={16}/></Button>
                </div>
                <div className="action-item">
                  <div className="action-dot"></div>
                  <div>
                     <h5>Relance Devis</h5>
                     <span className="label-sm">Extension Villa</span>
                  </div>
                  <Button variant="outline" className="btn-icon"><ArrowRight size={16}/></Button>
                </div>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
