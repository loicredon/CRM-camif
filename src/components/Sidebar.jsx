import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, HardHat, Users, CalendarDays, Contact, Building2 } from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { icon: LayoutDashboard, label: 'Tableau de Bord', path: '/' },
  { icon: HardHat, label: 'Chantiers', path: '/chantiers' },
  { icon: Users, label: 'Clients', path: '/clients' },
  { icon: Contact, label: 'Prospects', path: '/prospects' },
  { icon: CalendarDays, label: 'Rétroplanning', path: '/planning' },
  { icon: Building2, label: 'Annuaire', path: '/annuaire' },
];

export const Sidebar = () => {
  return (
    <aside className="sidebar signature-texture">
      <div className="sidebar-header">
        <h1 className="logo">NEXUS<span>CRM</span></h1>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <item.icon size={22} />
                <span className="nav-text">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <div className="user-profile glass-panel">
          <div className="avatar">L</div>
          <div className="user-info">
            <span className="label-sm" style={{color: 'var(--on-primary)'}}>Loïc Redon</span>
            <span className="label-sm" style={{color: 'var(--on-surface-variant)', fontSize: '0.6rem'}}>Architecte</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
