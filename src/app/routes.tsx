import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from '../features/landing/LandingPage';
import { CockpitPage } from '../features/cockpit/CockpitPage';
import { MallaSalesPage } from '../features/malla-sales/MallaSalesPage';
import { PozoCalculatorPage } from '../features/pozo-calculator/PozoCalculatorPage';
import { GreenhouseSalesPage } from '../features/greenhouse-sales/GreenhouseSalesPage';
import { LeaderCatalogPage } from '../features/leader-catalog/LeaderCatalogPage';
import { AdminControlPanel } from '../features/admin/AdminControlPanel';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/cockpit" element={<CockpitPage />} />
      <Route path="/proyecto-pozo-profundo" element={<PozoCalculatorPage />} />
      <Route path="/calculo-pozo" element={<PozoCalculatorPage />} />
      <Route path="/malla-50mesh" element={<MallaSalesPage />} />
      <Route path="/venta-invernaderos" element={<GreenhouseSalesPage />} />
      <Route path="/catalogo-invernaderos" element={<LeaderCatalogPage />} />
      <Route path="/catalogo" element={<Navigate to="/catalogo-invernaderos" replace />} />
      <Route path="/leader-greenhouse" element={<Navigate to="/catalogo-invernaderos" replace />} />
      
      {/* Panel de Control para Actualización de Base de Datos SQLite */}
      <Route path="/admin" element={<AdminControlPanel />} />
      <Route path="/panel-control" element={<Navigate to="/admin" replace />} />
      {/* Redirección para URLs antiguas si las hubiera */}
      <Route path="/index.html" element={<Navigate to="/" replace />} />
      <Route path="/cockpit.html" element={<Navigate to="/cockpit" replace />} />
      <Route path="/malla-50mesh.html" element={<Navigate to="/malla-50mesh" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

