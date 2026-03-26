import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Search, Filter, Mail, Phone, MoreVertical, Plus, UserCheck, Trash2 } from 'lucide-react';
import './Prospects.css';

export const Prospects = () => {
  const [prospectsData, setProspectsData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [prospectToConvert, setProspectToConvert] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [prospectToDelete, setProspectToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    project: '',
    value: '',
    date: 'Aujourd\'hui',
    status: 'prospect',
    description: '',
    channel: ''
  });

  const fetchContacts = () => {
    fetch('http://localhost:3001/api/contacts')
      .then(res => res.json())
      .then(data => setProspectsData(data.filter(c => c.status !== 'client')))
      .catch(err => console.error(err));
  };

  const handleConvertToClient = () => {
    if (!prospectToConvert) return;
    
    fetch(`http://localhost:3001/api/contacts/${prospectToConvert.id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'client' })
    })
    .then(res => res.json())
    .then(() => {
      setConfirmModalOpen(false);
      setProspectToConvert(null);
      fetchContacts();
    })
    .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = () => {
    if (!prospectToDelete) return;
    fetch(`http://localhost:3001/api/contacts/${prospectToDelete.id}`, {
      method: 'DELETE'
    })
    .then(() => {
      setDeleteModalOpen(false);
      setProspectToDelete(null);
      fetchContacts();
    })
    .catch(err => console.error(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3001/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(() => {
      setIsModalOpen(false);
      setFormData({ name: '', project: '', value: '', date: 'Aujourd\'hui', status: 'prospect', description: '', channel: '' });
      fetchContacts();
    })
    .catch(err => console.error(err));
  };

  return (
    <div className="prospects-page animate-fade-in">
      <header className="editorial-header">
        <div>
          <h2 className="editorial-title">Prospects</h2>
          <p className="editorial-subtitle">Gérez vos opportunités commerciales</p>
        </div>
        <div className="header-actions">
          <Button variant="secondary" className="btn-icon"><Filter size={20}/></Button>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            Ajouter un prospect
          </Button>
        </div>
      </header>

      {/* Tool bar */}
      <div className="toolbar glass-panel">
        <div className="search-bar">
          <Search size={18} className="search-icon"/>
          <input 
            type="text" 
            placeholder="Rechercher par nom, entreprise ou projet..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="toolbar-filters">
          <Badge 
            status="prospect" 
            className={`clickable ${activeFilter === 'prospect' ? '' : 'faded'}`}
            onClick={() => setActiveFilter(activeFilter === 'prospect' ? 'all' : 'prospect')}
          >
            En Cours ({prospectsData.filter(p => p.status === 'prospect').length})
          </Badge>
          <Badge 
            status="risk" 
            className={`clickable ${activeFilter === 'lost' ? '' : 'faded'}`}
            onClick={() => setActiveFilter(activeFilter === 'lost' ? 'all' : 'lost')}
          >
            Perdus ({prospectsData.filter(p => p.status === 'lost').length})
          </Badge>
          <Badge 
            status="neutral" 
            className={`clickable ${activeFilter === 'all' ? '' : 'faded'}`}
            onClick={() => setActiveFilter('all')}
          >
            Tous ({prospectsData.length})
          </Badge>
        </div>
      </div>

      {/* Data Table */}
      <Card className="data-table-container">
        <table className="editorial-table">
          <thead>
            <tr>
              <th className="label-sm">Contact</th>
              <th className="label-sm">Projet & Valeur</th>
              <th className="label-sm">Statut</th>
              <th className="label-sm">Dernière action</th>
              <th className="label-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {prospectsData
              .filter(row => {
                const q = searchQuery.toLowerCase();
                const matchesSearch = !q || row.name.toLowerCase().includes(q) || (row.project && row.project.toLowerCase().includes(q)) || (row.value && row.value.toLowerCase().includes(q));
                const matchesFilter = activeFilter === 'all' || row.status === activeFilter;
                return matchesSearch && matchesFilter;
              })
              .map((row, index) => (
              <tr key={row.id} className={index % 2 === 0 ? 'row-alt' : 'row-base'}>
                <td>
                  <div className="contact-cell">
                    <div className="client-avatar">{row.name.charAt(0)}</div>
                    <span className="body-md" style={{fontWeight: 500, color: 'var(--primary)'}}>{row.name}</span>
                  </div>
                </td>
                <td>
                  <div className="project-cell">
                    <span className="body-md">{row.project}</span>
                    <span className="label-sm">{row.value}</span>
                  </div>
                </td>
                <td>
                  {row.status === 'client' && <Badge status="active">Client</Badge>}
                  {row.status === 'prospect' && <Badge status="prospect">Prospect</Badge>}
                  {row.status === 'lost' && <Badge status="risk">Perdu</Badge>}
                </td>
                <td>
                  <span className="body-md">{row.date}</span>
                </td>
                <td className="text-right">
                  <div className="action-buttons">
                    {row.status !== 'client' && (
                      <button 
                        className="icon-action" 
                        title="Convertir en client" 
                        onClick={() => {
                          setProspectToConvert({ id: row.id, name: row.name });
                          setConfirmModalOpen(true);
                        }}
                      >
                        <UserCheck size={18} color="#10b981" />
                      </button>
                    )}
                    <button className="icon-action"><Phone size={16}/></button>
                    <button className="icon-action"><Mail size={16}/></button>
                    <button 
                      className="icon-action" 
                      title="Supprimer"
                      onClick={() => {
                        setProspectToDelete({ id: row.id, name: row.name });
                        setDeleteModalOpen(true);
                      }}
                    >
                      <Trash2 size={16} color="#ef4444" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nouveau prospect">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nom du contact / Entreprise *</label>
            <input 
              required
              type="text" 
              className="form-input" 
              placeholder="ex: M. Dupont ou Entreprise X" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Projet envisagé</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="ex: Rénovation cuisine" 
              value={formData.project} 
              onChange={(e) => setFormData({...formData, project: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Valeur du devis / Budget</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="ex: 45k €" 
              value={formData.value} 
              onChange={(e) => setFormData({...formData, value: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Canal d'acquisition</label>
            <select 
              className="form-select" 
              value={formData.channel} 
              onChange={(e) => setFormData({...formData, channel: e.target.value})}
            >
              <option value="">Sélectionner un canal...</option>
              <option value="Bouche-à-oreille">Bouche-à-oreille</option>
              <option value="Site web">Site web</option>
              <option value="Réseaux sociaux">Réseaux sociaux</option>
              <option value="Recommandation partenaire">Recommandation partenaire</option>
              <option value="Salon / Événement">Salon / Événement</option>
              <option value="Publicité">Publicité</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Description / Commentaires</label>
            <textarea 
              className="form-input" 
              placeholder="Notes, contexte du projet, remarques..." 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              style={{ height: '100px', paddingTop: '0.75rem', resize: 'vertical' }}
            />
          </div>
          <div className="form-actions">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Annuler</Button>
            <Button type="submit" variant="primary">Enregistrer</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={confirmModalOpen} onClose={() => setConfirmModalOpen(false)} title="Confirmer la signature">
        <div style={{ padding: 'var(--spacing-4) 0', color: 'var(--on-surface)', lineHeight: '1.5' }}>
          Avez-vous signé le projet avec <strong>{prospectToConvert?.name}</strong> ?<br/><br/>
          En confirmant, ce contact sera officiellement transféré dans votre liste de Clients.
        </div>
        <div className="form-actions" style={{ marginTop: 'var(--spacing-6)' }}>
          <Button type="button" variant="outline" onClick={() => setConfirmModalOpen(false)}>Annuler</Button>
          <Button type="button" variant="primary" style={{ backgroundColor: '#10b981', color: 'white' }} onClick={handleConvertToClient}>
            Confirmer la signature
          </Button>
        </div>
      </Modal>

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Supprimer le contact">
        <div style={{ padding: 'var(--spacing-4) 0', color: 'var(--on-surface)', lineHeight: '1.5' }}>
          Êtes-vous sûr de vouloir supprimer <strong>{prospectToDelete?.name}</strong> ?<br/><br/>
          Cette action est irréversible. Toutes les données associées à ce contact seront définitivement supprimées.
        </div>
        <div className="form-actions" style={{ marginTop: 'var(--spacing-6)' }}>
          <Button type="button" variant="outline" onClick={() => setDeleteModalOpen(false)}>Annuler</Button>
          <Button type="button" variant="primary" style={{ backgroundColor: '#ef4444', color: 'white' }} onClick={handleDelete}>
            Supprimer définitivement
          </Button>
        </div>
      </Modal>
    </div>
  );
};
