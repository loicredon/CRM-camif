import React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Building2, Phone, Mail, MapPin, Download, CheckCircle, Clock } from 'lucide-react';
import './DetailEntreprise.css';

export const DetailEntreprise = () => {
  return (
    <div className="detail-page animate-fade-in">
      <header className="editorial-header">
        <div>
          <div style={{display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center', marginBottom: 'var(--spacing-2)'}}>
            <Button variant="secondary" className="btn-icon">← Retour</Button>
            <Badge status="active">Partenaire</Badge>
          </div>
          <h2 className="editorial-title">BTP Durand Frères</h2>
          <p className="editorial-subtitle">Spécialistes Gros Œuvre et Maçonnerie • SIRET: 123 456 789 00010</p>
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
                  <p>M. Jacques Durand</p>
                </div>
              </div>
              <div className="info-item">
                <Phone size={16}/>
                <div>
                  <span className="label-sm">Téléphone</span>
                  <p>04 78 12 34 56</p>
                </div>
              </div>
              <div className="info-item">
                <Mail size={16}/>
                <div>
                  <span className="label-sm">Email</span>
                  <p>contact@durand-btp.fr</p>
                </div>
              </div>
              <div className="info-item">
                <MapPin size={16}/>
                <div>
                  <span className="label-sm">Adresse</span>
                  <p>12 Avenue des Chantiers<br/>69000 Lyon</p>
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
                <tr className="row-base">
                  <td className="body-md" style={{color: 'var(--primary)'}}>Rénovation Haussmannien</td>
                  <td>15/04/2026</td>
                  <td>85 000 €</td>
                  <td><Badge status="active">En Cours</Badge></td>
                </tr>
                <tr className="row-alt">
                  <td className="body-md" style={{color: 'var(--primary)'}}>Construction Garage Lyon</td>
                  <td>10/11/2025</td>
                  <td>32 000 €</td>
                  <td><Badge status="neutral">Terminé</Badge></td>
                </tr>
                <tr className="row-base">
                  <td className="body-md" style={{color: 'var(--primary)'}}>Extension Villa Palmeraie</td>
                  <td>-</td>
                  <td>45 000 €</td>
                  <td><Badge status="prospect">Devis en attente</Badge></td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
  );
};
