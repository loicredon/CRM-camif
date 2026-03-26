import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Building2, Phone, Mail, MapPin, Download, CheckCircle, Clock } from 'lucide-react';
import './DetailEntreprise.css';

export const DetailEntreprise = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/api/companies/${id}`)
      .then(res => res.json())
      .then(data => setCompany(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!company) {
    return <div className="detail-page"><p>Chargement...</p></div>;
  }

  return (
    <div className="detail-page animate-fade-in">
      <header className="editorial-header">
        <div>
          <div style={{display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center', marginBottom: 'var(--spacing-2)'}}>
            <Button variant="secondary" className="btn-icon" onClick={() => navigate('/annuaire')}>← Retour</Button>
            <Badge status={company.active ? 'active' : 'neutral'}>
              {company.active ? 'Partenaire' : 'Inactif'}
            </Badge>
          </div>
          <h2 className="editorial-title">{company.name}</h2>
          <p className="editorial-subtitle">{company.type} • {company.city} • SIRET: {company.id.toString().padStart(12, '0')}00012</p>
        </div>
        <div className="header-actions">
          <Button variant="secondary">Modifier</Button>
          <Button variant="primary">Nouveau Contrat</Button>
        </div>
      </header>

      <div className="detail-grid">
        {/* Left Column: Contact & Info */}
        <div className="detail-col">
          <Card level="lowest" className="info-card">
            <h3>Informations de Contact</h3>
            <div className="info-list">
              <div className="info-item">
                <Building2 size={16}/>
                <div>
                  <span className="label-sm">Responsable</span>
                  <p>Direction {company.name}</p>
                </div>
              </div>
              <div className="info-item">
                <Phone size={16}/>
                <div>
                  <span className="label-sm">Téléphone</span>
                  <p>04 {Math.floor(Math.random() * 90 + 10)} {Math.floor(Math.random() * 90 + 10)} {Math.floor(Math.random() * 90 + 10)} {Math.floor(Math.random() * 90 + 10)}</p>
                </div>
              </div>
              <div className="info-item">
                <Mail size={16}/>
                <div>
                  <span className="label-sm">Email</span>
                  <p>contact@{company.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.fr</p>
                </div>
              </div>
              <div className="info-item">
                <MapPin size={16}/>
                <div>
                  <span className="label-sm">Adresse</span>
                  <p>Siège social<br/>{company.city}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card level="lowest" className="info-card mt-6">
            <h3>Documents Administratifs</h3>
            <div className="doc-list">
              <div className="doc-item">
                <CheckCircle size={16} color="var(--secondary)"/>
                <span>Assurance Décennale</span>
                <Button className="btn-icon-sm" variant="outline"><Download size={14}/></Button>
              </div>
              <div className="doc-item">
                <CheckCircle size={16} color="var(--secondary)"/>
                <span>Extrait Kbis (2025)</span>
                <Button className="btn-icon-sm" variant="outline"><Download size={14}/></Button>
              </div>
              <div className="doc-item warning">
                <Clock size={16} color="var(--on-tertiary-container)"/>
                <span style={{color: 'var(--on-tertiary-container)'}}>Attestation URSSAF expirée</span>
                <Button className="btn-sm" variant="secondary">Demander</Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Chantiers & Historique */}
        <div className="main-col">
          <h3>Chantiers en commun</h3>
          <Card level="lowest" className="history-card mt-4">
            <table className="editorial-table">
              <thead>
                <tr>
                  <th className="label-sm">Projet</th>
                  <th className="label-sm">Date</th>
                  <th className="label-sm">Montant</th>
                  <th className="label-sm">Statut</th>
                </tr>
              </thead>
              <tbody>
                {company.projects && company.projects.length > 0 ? (
                  company.projects.map((project, index) => (
                    <tr key={project.id} className={index % 2 === 0 ? "row-base" : "row-alt"}>
                      <td className="body-md" style={{color: 'var(--primary)'}}>{project.title}</td>
                      <td>{project.date || '-'}</td>
                      <td>-</td>
                      <td>
                        <Badge status={project.status === 'inProgress' ? 'active' : project.status === 'done' ? 'neutral' : 'prospect'}>
                          {project.status === 'inProgress' ? 'En Cours' : project.status === 'done' ? 'Terminé' : 'À démarrer'}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="row-base">
                    <td colSpan="4" style={{textAlign: 'center', padding: 'var(--spacing-4)', color: 'var(--on-surface-variant)'}}>
                      Aucun chantier en commun pour le moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
  );
};
