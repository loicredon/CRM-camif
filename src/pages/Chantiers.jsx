import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Plus, MoreHorizontal, Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Chantiers.css';

export const Chantiers = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState({ todo: [], inProgress: [], done: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    date: '',
    contactId: '',
    status: 'todo',
    progress: 0,
    companyIds: []
  });

  const fetchProjects = () => {
    fetch('http://localhost:3001/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects({
          todo: data.filter(p => p.status === 'todo'),
          inProgress: data.filter(p => p.status === 'inProgress'),
          done: data.filter(p => p.status === 'done')
        });
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchProjects();
    fetch('http://localhost:3001/api/contacts')
      .then(res => res.json())
      .then(data => setContacts(data))
      .catch(err => console.error(err));
      
    fetch('http://localhost:3001/api/companies')
      .then(res => res.json())
      .then(data => setCompanies(data))
      .catch(err => console.error(err));
  }, []);

  const toggleCompany = (id) => {
    setFormData(prev => ({
      ...prev, 
      companyIds: prev.companyIds.includes(id) 
        ? prev.companyIds.filter(c => c !== id) 
        : [...prev.companyIds, id]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData, contactId: formData.contactId ? parseInt(formData.contactId) : null };
    
    fetch('http://localhost:3001/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(() => {
      setIsModalOpen(false);
      setFormData({ title: '', location: '', date: '', contactId: '', status: 'todo', progress: 0, companyIds: [] });
      fetchProjects();
    })
    .catch(err => console.error(err));
  };

  const handleDragStart = (e, projectId, sourceColumn) => {
    e.dataTransfer.setData('projectId', projectId.toString());
    e.dataTransfer.setData('sourceColumn', sourceColumn);
    setTimeout(() => {
      e.target.style.opacity = '0.5';
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetColumn) => {
    e.preventDefault();
    const projectId = e.dataTransfer.getData('projectId');
    const sourceColumn = e.dataTransfer.getData('sourceColumn');
    
    if (sourceColumn === targetColumn || !projectId) return;

    const projectToMove = projects[sourceColumn].find(p => p.id === parseInt(projectId));
    if (!projectToMove) return;

    setProjects(prev => ({
      ...prev,
      [sourceColumn]: prev[sourceColumn].filter(p => p.id !== parseInt(projectId)),
      [targetColumn]: [...prev[targetColumn], { ...projectToMove, status: targetColumn }]
    }));

    fetch(`http://localhost:3001/api/projects/${projectId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: targetColumn })
    })
    .catch(err => {
      console.error("Failed to update status", err);
      fetchProjects();
    });
  };

  return (
    <div className="chantiers-page animate-fade-in">
      <header className="editorial-header">
        <div>
          <h2 className="editorial-title">Liste des Chantiers</h2>
          <p className="editorial-subtitle">Vue Kanban de vos projets et état d'avancement</p>
        </div>
        <div className="header-actions">
          <Button variant="secondary" className="btn-icon"><MoreHorizontal size={20}/></Button>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            Créer
          </Button>
        </div>
      </header>

      <div className="kanban-board">
        {/* Column 1: À faire */}
        <div className="kanban-column">
          <div className="kanban-header">
            <h3>À Démarrer</h3>
            <Badge status="neutral">{projects.todo.length}</Badge>
          </div>
          <div className="kanban-cards" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'todo')}>
            {projects.todo.map(task => (
              <Card 
                key={task.id} 
                level="lowest" 
                className="kanban-card" 
                draggable={true}
                onDragStart={(e) => handleDragStart(e, task.id, 'todo')}
                onDragEnd={handleDragEnd}
                onClick={(e) => {
                  // Prevent navigation if we are dragging
                  navigate(`/chantiers/${task.id}/planning`);
                }}
              >
                <div className="card-top">
                  <h4>{task.title}</h4>
                  <Badge status="prospect">À démarrer</Badge>
                </div>
                <div className="card-meta">
                  <span className="label-sm"><MapPin size={12}/> {task.location}</span>
                  <span className="label-sm"><Calendar size={12}/> {task.date}</span>
                </div>
                <div className="card-footer">
                  <div className="client-avatar">{task.contact ? task.contact.name.charAt(0) : '?'}</div>
                  <span className="label-sm">{task.contact ? task.contact.name : 'Pas de client'}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Column 2: En cours */}
        <div className="kanban-column">
          <div className="kanban-header">
            <h3>En Cours</h3>
            <Badge status="active">{projects.inProgress.length}</Badge>
          </div>
          <div className="kanban-cards" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'inProgress')}>
            {projects.inProgress.map(task => (
              <Card 
                key={task.id} 
                level="lowest" 
                className={`kanban-card ${task.selected ? 'selected' : ''}`}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, task.id, 'inProgress')}
                onDragEnd={handleDragEnd}
                onClick={() => navigate(`/chantiers/${task.id}/planning`)}
              >
                <div className="card-top">
                  <h4>{task.title}</h4>
                  <Badge status="active">En cours</Badge>
                </div>
                <div className="card-meta">
                  <span className="label-sm"><MapPin size={12}/> {task.location}</span>
                </div>
                <div className="card-progress">
                  <div className="progress-info">
                    <span className="label-sm">Avancement</span>
                    <span className="label-sm">{task.progress}%</span>
                  </div>
                  <div className="progress-bar-sm">
                    <div className="progress-fill-sm" style={{width: `${task.progress}%`}}></div>
                  </div>
                </div>
                <div className="card-footer">
                  <div className="client-avatar">{task.contact ? task.contact.name.charAt(0) : '?'}</div>
                  <span className="label-sm">{task.contact ? task.contact.name : 'Pas de client'}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Column 3: Terminés */}
        <div className="kanban-column">
          <div className="kanban-header">
            <h3>Terminés</h3>
            <Badge status="neutral">{projects.done.length}</Badge>
          </div>
          <div className="kanban-cards" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'done')}>
            {projects.done.map(task => (
              <Card 
                key={task.id} 
                level="lowest" 
                className="kanban-card done"
                draggable={true}
                onDragStart={(e) => handleDragStart(e, task.id, 'done')}
                onDragEnd={handleDragEnd}
                onClick={() => navigate(`/chantiers/${task.id}/planning`)}
              >
                <div className="card-top">
                  <h4>{task.title}</h4>
                  <Badge status="neutral">Terminé</Badge>
                </div>
                <div className="card-meta">
                  <span className="label-sm"><MapPin size={12}/> {task.location}</span>
                  <span className="label-sm"><Calendar size={12}/> {task.date}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Créer un Chantier">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Titre du chantier *</label>
            <input 
              required
              type="text" 
              className="form-input" 
              placeholder="ex: Rénovation Cuisine" 
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Localisation</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="ex: Paris 15ème" 
              value={formData.location} 
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Client / Prospect Associé</label>
            <select 
              className="form-select" 
              value={formData.contactId} 
              onChange={(e) => setFormData({...formData, contactId: e.target.value})}
            >
              <option value="">Sélectionner un contact...</option>
              {contacts.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.status})</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Entreprises Intervenantes</label>
            <div className="company-selector">
              {companies.map(c => (
                <button 
                  type="button" 
                  key={c.id} 
                  className={`company-badge ${formData.companyIds.includes(c.id) ? 'selected' : ''}`}
                  onClick={() => toggleCompany(c.id)}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Date prévisionnelle</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="ex: Début prévu le 12 Mai" 
              value={formData.date} 
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
          </div>
          <div className="form-actions">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Annuler</Button>
            <Button type="submit" variant="primary">Créer le projet</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
