import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Search, Filter, Mail, Phone, MoreVertical, Plus } from 'lucide-react';
import './Prospects.css';

export const Prospects = () => {
  const [prospectsData, setProspectsData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    project: '',
    value: '',
    date: 'Aujourd\'hui',
    status: 'prospect'
  });

  const fetchContacts = () => {
    fetch('http://localhost:3001/api/contacts')
      .then(res => res.json())
      .then(data => setProspectsData(data.filter(c => c.status !== 'client')))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchContacts();
  }, []);

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
      setFormData({ name: '', project: '', value: '', date: 'Aujourd\'hui', status: 'prospect' });
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
          <input type="text" placeholder="Rechercher par nom, entreprise ou projet..." />
        </div>
        <div className="toolbar-filters">
          <Badge status="prospect" className="clickable">En Cours (2)</Badge>
          <Badge status="risk" className="clickable">Perdus (1)</Badge>
          <Badge status="neutral" className="clickable">Tous (3)</Badge>
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
            {prospectsData.map((row, index) => (
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
                    <button className="icon-action"><Phone size={16}/></button>
                    <button className="icon-action"><Mail size={16}/></button>
                    <button className="icon-action"><MoreVertical size={16}/></button>
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
          <div className="form-actions">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Annuler</Button>
            <Button type="submit" variant="primary">Enregistrer</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
