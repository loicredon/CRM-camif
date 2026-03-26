import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Building2, MapPin, Search, Star, MessageSquare } from 'lucide-react';
import './Annuaire.css';

export const Annuaire = () => {
  const [directory, setDirectory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/api/companies')
      .then(res => res.json())
      .then(data => setDirectory(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="annuaire-page animate-fade-in">
      <header className="editorial-header">
        <div>
          <h2 className="editorial-title">Annuaire Entreprises</h2>
          <p className="editorial-subtitle">Répertoire de vos partenaires et sous-traitants</p>
        </div>
      </header>
      
      <div className="toolbar glass-panel" style={{marginBottom: 'var(--spacing-8)'}}>
        <div className="search-bar">
          <Search size={18} className="search-icon"/>
          <input type="text" placeholder="Rechercher une entreprise, un corps d'état..." />
        </div>
      </div>

      <div className="directory-grid">
        {directory.map(company => (
          <Card 
            key={company.id} 
            level="lowest" 
            className="company-card"
            onClick={() => navigate(`/entreprise/${company.id}`)}
            style={{ cursor: 'pointer' }}
          >
            <div className="company-header">
              <div className="company-icon">
                <Building2 size={24}/>
              </div>
              <Badge status={company.active ? 'active' : 'neutral'}>
                {company.active ? 'Partenaire' : 'Inactif'}
              </Badge>
            </div>
            
            <div className="company-info">
              <h3>{company.name}</h3>
              <span className="label-sm" style={{color: 'var(--primary)'}}>{company.type}</span>
            </div>
            
            <div className="company-meta">
              <span className="label-sm"><MapPin size={14}/> {company.city}</span>
              <span className="label-sm"><Star size={14} fill="var(--tertiary-fixed-dim)" color="var(--tertiary-fixed-dim)"/> {company.rating}/5</span>
            </div>
            
            <div className="company-actions" style={{ justifyContent: 'flex-end' }}>
              <Button 
                variant="secondary" 
                className="btn-icon"
                onClick={(e) => e.stopPropagation()}
              >
                <MessageSquare size={16}/>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
