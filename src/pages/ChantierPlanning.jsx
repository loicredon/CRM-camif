import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { ArrowLeft, Download, Plus, Trash2 } from 'lucide-react';
import './Planning.css';

const emptyTaskForm = {
  title: '',
  team: '',
  startDate: '',
  endDate: '',
  status: 'upcoming'
};

// Helper: generate week columns between two dates
function generateWeeks(minDate, maxDate) {
  const weeks = [];
  const start = new Date(minDate);
  // Align to Monday
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  const end = new Date(maxDate);
  
  while (start <= end) {
    const weekStart = new Date(start);
    const weekEnd = new Date(start);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const day = weekStart.getDate();
    const month = weekStart.toLocaleString('fr-FR', { month: 'short' });
    weeks.push({
      label: `${day} ${month}`,
      start: weekStart.getTime(),
      end: weekEnd.getTime()
    });
    
    start.setDate(start.getDate() + 7);
  }
  return weeks;
}

function formatDateFr(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function daysDiff(d1, d2) {
  return Math.round((new Date(d2) - new Date(d1)) / (1000 * 60 * 60 * 24));
}

export const ChantierPlanning = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({ ...emptyTaskForm });

  const fetchProject = () => {
    fetch(`http://localhost:3001/api/projects/${id}`)
      .then(res => res.json())
      .then(data => {
        setProject(data);
        setTasks(data.tasks || []);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  // Compute the timeline range from tasks
  const { weeks, timelineStart, timelineEnd, totalDays } = useMemo(() => {
    const dated = tasks.filter(t => t.startDate && t.endDate);
    if (dated.length === 0) {
      // Default: next 4 weeks from today
      const today = new Date();
      const future = new Date(today);
      future.setDate(future.getDate() + 28);
      const w = generateWeeks(today, future);
      return { weeks: w, timelineStart: today.getTime(), timelineEnd: future.getTime(), totalDays: 28 };
    }
    
    const allStarts = dated.map(t => new Date(t.startDate).getTime());
    const allEnds = dated.map(t => new Date(t.endDate).getTime());
    const minDate = new Date(Math.min(...allStarts));
    const maxDate = new Date(Math.max(...allEnds));
    
    // Ensure minimum 3-week span for readability
    const spanDays = daysDiff(minDate, maxDate);
    if (spanDays < 21) {
      const extraDays = Math.ceil((21 - spanDays) / 2);
      minDate.setDate(minDate.getDate() - extraDays);
      maxDate.setDate(maxDate.getDate() + extraDays);
    } else {
      // Add 3-day padding
      minDate.setDate(minDate.getDate() - 3);
      maxDate.setDate(maxDate.getDate() + 3);
    }
    
    const w = generateWeeks(minDate, maxDate);
    const tStart = w[0]?.start || minDate.getTime();
    const tEnd = w[w.length - 1]?.end || maxDate.getTime();
    const td = Math.max(1, daysDiff(new Date(tStart), new Date(tEnd)));
    
    return { weeks: w, timelineStart: tStart, timelineEnd: tEnd, totalDays: td };
  }, [tasks]);

  // Compute position/width of a task bar
  const getBarStyle = (task) => {
    if (!task.startDate || !task.endDate) return { left: '0%', width: '0%' };
    const taskStart = new Date(task.startDate).getTime();
    const taskEnd = new Date(task.endDate).getTime();
    const left = ((taskStart - timelineStart) / (timelineEnd - timelineStart)) * 100;
    const width = ((taskEnd - taskStart) / (timelineEnd - timelineStart)) * 100;
    return {
      left: `${Math.max(0, left)}%`,
      width: `${Math.min(100 - Math.max(0, left), Math.max(4, width))}%`
    };
  };

  const openAddModal = () => {
    setEditingTask(null);
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setTaskForm({ ...emptyTaskForm, startDate: today, endDate: nextWeek });
    setIsTaskModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      team: task.team || '',
      startDate: task.startDate || '',
      endDate: task.endDate || '',
      status: task.status
    });
    setIsTaskModalOpen(true);
  };

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    const payload = {
      title: taskForm.title,
      team: taskForm.team,
      startDate: taskForm.startDate,
      endDate: taskForm.endDate,
      start: 0,
      duration: 20,
      status: taskForm.status,
      projectId: parseInt(id)
    };

    const url = editingTask 
      ? `http://localhost:3001/api/tasks/${editingTask.id}` 
      : 'http://localhost:3001/api/tasks';
    const method = editingTask ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(() => {
      setIsTaskModalOpen(false);
      fetchProject();
    })
    .catch(err => console.error(err));
  };

  const handleDeleteTask = () => {
    if (!editingTask) return;
    fetch(`http://localhost:3001/api/tasks/${editingTask.id}`, { method: 'DELETE' })
    .then(() => {
      setIsDeleteModalOpen(false);
      setIsTaskModalOpen(false);
      setEditingTask(null);
      fetchProject();
    })
    .catch(err => console.error(err));
  };

  if (!project) return <div className="animate-fade-in" style={{padding: 'var(--spacing-8)'}}>Chargement...</div>;

  return (
    <div className="planning-page animate-fade-in">
      <header className="editorial-header">
        <div>
          <div style={{display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center', marginBottom: 'var(--spacing-2)'}}>
            <Button variant="secondary" className="btn-icon" onClick={() => navigate('/chantiers')}>
              <ArrowLeft size={18}/> Retour
            </Button>
            <Badge status={project.status === 'inProgress' ? 'active' : project.status === 'done' ? 'neutral' : 'prospect'}>
              {project.status === 'inProgress' ? 'En cours' : project.status === 'done' ? 'Terminé' : 'À démarrer'}
            </Badge>
          </div>
          <h2 className="editorial-title">Rétroplanning Détaillé</h2>
          <p className="editorial-subtitle">{project.title} • Vue chronologique</p>
        </div>
        <div className="header-actions">
          <Button variant="secondary"><Download size={18}/> Exporter</Button>
          <Button variant="primary" onClick={openAddModal}><Plus size={18}/> Nouvelle Tâche</Button>
        </div>
      </header>

      {/* KPI row */}
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
          <span className="label-sm">Tâches planifiées</span>
          <h3 style={{color: 'var(--primary)', margin: '8px 0 0 0'}}>{tasks.length}</h3>
        </Card>
        <Card level="lowest" style={{flex: 1, padding: 'var(--spacing-4)'}}>
          <span className="label-sm">Date de livraison prévue</span>
          <h3 style={{color: 'var(--primary)', margin: '8px 0 0 0'}}>{project.date || 'Non définie'}</h3>
        </Card>
      </div>

      {/* Gantt Chart */}
      <Card level="lowest" className="gantt-container glass-panel">
        <div className="gantt-header">
          <div className="gantt-label-col">
            <span className="label-sm">Tâche / Assigné à</span>
          </div>
          <div className="gantt-timeline-header">
            {weeks.map((week, idx) => (
              <div key={idx} className="month-slot label-sm" style={{
                borderLeft: idx > 0 ? 'var(--ghost-border)' : 'none',
                minWidth: `${100 / weeks.length}%`,
                flex: `0 0 ${100 / weeks.length}%`
              }}>
                {week.label}
              </div>
            ))}
          </div>
        </div>

        <div className="gantt-body">
          {tasks.length === 0 && (
            <div style={{padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--on-surface-variant)'}}>
              Aucune tâche planifiée. Cliquez sur "Nouvelle Tâche" pour commencer.
            </div>
          )}
          {tasks.map((task) => {
            const barStyle = getBarStyle(task);
            const durationDays = task.startDate && task.endDate ? daysDiff(task.startDate, task.endDate) : 0;
            
            return (
              <div key={task.id} className="gantt-row">
                <div className="gantt-label-col">
                  <span className="body-md" style={{color: 'var(--primary)', fontWeight: 600}}>{task.title}</span>
                  <span className="label-sm">{task.team}</span>
                </div>
                <div className="gantt-timeline">
                  <div className="rail-grid">
                    {weeks.map((_, i) => (
                      <div key={i} className="rail" style={{
                        minWidth: `${100 / weeks.length}%`,
                        flex: `0 0 ${100 / weeks.length}%`
                      }}></div>
                    ))}
                  </div>
                  
                  <div 
                    className={`gantt-bar ${task.status}`}
                    style={{
                      ...barStyle,
                      cursor: 'pointer'
                    }}
                    onClick={() => openEditModal(task)}
                    title={`${formatDateFr(task.startDate)} → ${formatDateFr(task.endDate)} (${durationDays}j)`}
                  >
                    <span className="bar-label">{durationDays}j</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      
      {/* Legend */}
      <div className="gantt-legend">
        <div className="legend-item">
          <div className="legend-swatch done"></div>
          <span className="label-sm">Terminée</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch inProgress"></div>
          <span className="label-sm">En cours</span>
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

      {/* Task Create/Edit Modal */}
      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title={editingTask ? 'Modifier la tâche' : 'Nouvelle tâche'}>
        <form onSubmit={handleTaskSubmit}>
          <div className="form-group">
            <label className="form-label">Titre de la tâche *</label>
            <input 
              required
              type="text" 
              className="form-input" 
              placeholder="ex: Dépose plomberie" 
              value={taskForm.title} 
              onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Entreprise / Assigné à</label>
            <select 
              className="form-select" 
              value={taskForm.team} 
              onChange={(e) => setTaskForm({...taskForm, team: e.target.value})}
            >
              <option value="">Sélectionner une entreprise...</option>
              {project.companies && project.companies.map(c => (
                <option key={c.id} value={c.name}>{c.name} — {c.type}</option>
              ))}
              <option value="__custom__">✏️ Autre (saisie libre)</option>
            </select>
            {taskForm.team === '__custom__' && (
              <input 
                type="text" 
                className="form-input" 
                style={{marginTop: '0.5rem'}}
                placeholder="ex: Sous-traitant, Equipe interne..." 
                onChange={(e) => setTaskForm({...taskForm, team: e.target.value})}
              />
            )}
          </div>
          <div style={{display: 'flex', gap: '1rem'}}>
            <div className="form-group" style={{flex: 1}}>
              <label className="form-label">Date de début *</label>
              <input 
                required
                type="date" 
                className="form-input" 
                value={taskForm.startDate} 
                onChange={(e) => setTaskForm({...taskForm, startDate: e.target.value})}
              />
            </div>
            <div className="form-group" style={{flex: 1}}>
              <label className="form-label">Date de fin *</label>
              <input 
                required
                type="date" 
                className="form-input" 
                value={taskForm.endDate} 
                min={taskForm.startDate}
                onChange={(e) => setTaskForm({...taskForm, endDate: e.target.value})}
              />
            </div>
          </div>
          {taskForm.startDate && taskForm.endDate && (
            <div style={{
              padding: '0.75rem 1rem', 
              background: 'var(--surface-container-low)', 
              borderRadius: '12px', 
              marginBottom: '1.25rem',
              fontSize: '0.875rem',
              color: 'var(--on-surface-variant)'
            }}>
              📅 Durée : <strong>{daysDiff(taskForm.startDate, taskForm.endDate)} jours</strong> 
              &nbsp;({formatDateFr(taskForm.startDate)} → {formatDateFr(taskForm.endDate)})
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Statut</label>
            <select 
              className="form-select" 
              value={taskForm.status} 
              onChange={(e) => setTaskForm({...taskForm, status: e.target.value})}
            >
              <option value="upcoming">À venir</option>
              <option value="inProgress">En cours</option>
              <option value="done">Terminée</option>
              <option value="warning">Bloquante / Retard</option>
            </select>
          </div>
          <div className="form-actions" style={{justifyContent: editingTask ? 'space-between' : 'flex-end'}}>
            {editingTask && (
              <Button 
                type="button" 
                variant="outline" 
                style={{color: '#ef4444', borderColor: '#ef4444'}}
                onClick={() => setIsDeleteModalOpen(true)}
              >
                <Trash2 size={16}/> Supprimer
              </Button>
            )}
            <div style={{display: 'flex', gap: '0.75rem'}}>
              <Button type="button" variant="outline" onClick={() => setIsTaskModalOpen(false)}>Annuler</Button>
              <Button type="submit" variant="primary">{editingTask ? 'Enregistrer' : 'Créer la tâche'}</Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Supprimer la tâche">
        <div style={{ padding: 'var(--spacing-4) 0', color: 'var(--on-surface)', lineHeight: '1.5' }}>
          Êtes-vous sûr de vouloir supprimer la tâche <strong>{editingTask?.title}</strong> ?<br/><br/>
          Cette action est irréversible.
        </div>
        <div className="form-actions" style={{ marginTop: 'var(--spacing-6)' }}>
          <Button type="button" variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Annuler</Button>
          <Button type="button" variant="primary" style={{ backgroundColor: '#ef4444', color: 'white' }} onClick={handleDeleteTask}>
            Supprimer définitivement
          </Button>
        </div>
      </Modal>
    </div>
  );
};
