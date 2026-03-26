import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import './Layout.css';

export const Layout = () => {
  return (
    <div className="layout-wrapper">
      <Sidebar />
      <main className="main-content animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
};
