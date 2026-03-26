import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Chantiers } from './pages/Chantiers';
import { Prospects } from './pages/Prospects';
import { Clients } from './pages/Clients';
import { Planning } from './pages/Planning';
import { Annuaire } from './pages/Annuaire';
import { DetailEntreprise } from './pages/DetailEntreprise';
import { ChantierPlanning } from './pages/ChantierPlanning';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="chantiers" element={<Chantiers />} />
          <Route path="clients" element={<Clients />} />
          <Route path="prospects" element={<Prospects />} />
          <Route path="planning" element={<Planning />} />
          <Route path="annuaire" element={<Annuaire />} />
          <Route path="entreprise/:id" element={<DetailEntreprise />} />
          <Route path="chantiers/:id/planning" element={<ChantierPlanning />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
