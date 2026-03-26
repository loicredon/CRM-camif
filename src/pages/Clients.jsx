import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Search, Filter, Mail, Phone, MoreVertical, FileText, Plus } from 'lucide-react';
import './Prospects.css'; // Reusing the same grid layout and table styling

export const Clients = () => {
  const [clientsData, setClientsData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    project: '',
    value: '',
    date: 'Aujourd\'hui',
    status: 'client'
  });

  const fetchContacts = () => {
    fetch('http://localhost:3001/api/contacts')
      .then(res => res.json())
      .then(data => setClientsData(data.filter(c => c.status === 'client')))
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
      setFormData({ name: '', project: '', value: '', date: 'Aujourd\'hui', status: 'client' });
      fetchContacts();
    })
    .catch(err => console.error(err));
  };

  return (
    <div className="prospects-page animate-fade-in">
      <header className="editorial-header">
        <div>
          <h2 className="editorial-title">Clients</h2>
          <p className="editorial-subtitle">Répertoire des clients ayant signé un contrat</p>
        </div>
        <div className="header-actions">
          <Button variant="secondary" className="btn-icon"><Filter size={20}/></Button>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            Nouveau Client
          </Button>
        </div>
      </header>

      {/* Tool bar */}
      <div className="toolbar glass-panel">
        <div className="header-actions">
          <div className="search-bar">
            <Search size={18} />
            <input type="text" placeholder="Rechercher un client..." />
          </div>
          <Button variant="outline"><Filter size={18}/> Filtrer</Button>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            Ajouter un client
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <Card>
        <div className="data-table-container">
          <table className="editorial-table">
            <thead>
              <tr>
                <th className="label-sm">Client</th>
                <th className="label-sm">Projet & Valeur</th>
                <th className="label-sm">Contrat</th>
                <th className="label-sm">Date de signature</th>
                <th className="label-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clientsData.map((row, index) => (
                <tr key={row.id} className={index % 2 === 0 ? 'row-alt' : 'row-base'}>
                  <td>
                    <div className="contact-cell">
                      <div className="client-avatar" style={{backgroundColor: 'var(--secondary-container)', color: 'var(--on-secondary-container)'}}>
                        {row.name.charAt(0)}
                      </div>
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
                    <Badge status="active">Signé</Badge>
                  </td>
                  <td>
                    <span className="body-md">{row.date}</span>
                  </td>
                  <td className="text-right">
                    <div className="action-buttons">
                      <button className="icon-action"><FileText size={16}/></button>
                      <button className="icon-action"><Phone size={16}/></button>
                      <button className="icon-action"><MoreVertical size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nouveau client">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nom du client / Entreprise *</label>
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
            <label className="form-label">Projet associé</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="ex: Rénovation totale" 
              value={formData.project} 
              onChange={(e) => setFormData({...formData, project: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Valeur du contrat</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="ex: 145k €" 
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
