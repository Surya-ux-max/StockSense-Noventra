import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';

import LandingPage from './pages/LandingPage';
import CustomerPortal from './pages/CustomerPortal';
import ManagerPortal from './pages/ManagerPortal';
import CommandCenter from './pages/CommandCenter';
import InventoryRisk from './pages/InventoryRisk';
import ItemIntelligence from './pages/ItemIntelligence';
import DemandForecast from './pages/DemandForecast';
import Replenishment from './pages/Replenishment';
import StoreIntelligence from './pages/StoreIntelligence';
import SystemIntelligence from './pages/SystemIntelligence';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page as First Screen */}
        <Route path="/" element={<LandingPage />} />

        {/* Dedicated Portals */}
        <Route path="/store" element={<CustomerPortal />} />
        <Route path="/portal/store" element={<Navigate to="/store" replace />} />
        <Route path="/manager" element={<ManagerPortal />} />
        <Route path="/portal/manager" element={<Navigate to="/manager" replace />} />

        {/* Operational Dashboard & Subpages with Persistent Layout */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<CommandCenter />} />
          <Route path="/command" element={<Navigate to="/dashboard" replace />} />
          <Route path="/risk" element={<InventoryRisk />} />
          <Route path="/item/:id" element={<ItemIntelligence />} />
          <Route path="/forecast" element={<DemandForecast />} />
          <Route path="/replenishment" element={<Replenishment />} />
          <Route path="/stores" element={<StoreIntelligence />} />
          <Route path="/intelligence" element={<SystemIntelligence />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
