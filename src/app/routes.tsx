import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AgroLoadingSpinner } from '../shared/components/AgroLoadingSpinner';

// Carga directa de la Landing Page para First Contentful Paint instantáneo
import { LandingPage } from '../pages/LandingPage';

// Code Splitting estratégico con React.lazy para naves de cálculo y visores 3D
const CockpitPage = React.lazy(() =>
  import('../pages/CockpitPage').then((m) => ({ default: m.CockpitPage }))
);
const PozoCalculatorPage = React.lazy(() =>
  import('../pages/PozoCalculatorPage').then((m) => ({ default: m.PozoCalculatorPage }))
);
const MallaSalesPage = React.lazy(() =>
  import('../pages/MallaSalesPage').then((m) => ({ default: m.MallaSalesPage }))
);
const GreenhouseSalesPage = React.lazy(() =>
  import('../pages/GreenhouseSalesPage').then((m) => ({ default: m.GreenhouseSalesPage }))
);
const LeaderCatalogPage = React.lazy(() =>
  import('../pages/LeaderCatalogPage').then((m) => ({ default: m.LeaderCatalogPage }))
);
const AdminControlPanel = React.lazy(() =>
  import('../pages/AdminControlPanel').then((m) => ({ default: m.AdminControlPanel }))
);
const FlatMeshSalesPage = React.lazy(() =>
  import('../pages/FlatMeshSalesPage').then((m) => ({ default: m.FlatMeshSalesPage }))
);
const ViveroCadPage = React.lazy(() =>
  import('../pages/ViveroCadPage').then((m) => ({ default: m.default }))
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<AgroLoadingSpinner message="Cargando Módulo Agronómico..." />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/cockpit" element={<CockpitPage />} />
        <Route path="/proyecto-pozo-profundo" element={<PozoCalculatorPage />} />
        <Route path="/calculo-pozo" element={<PozoCalculatorPage />} />
        <Route path="/malla-50mesh" element={<MallaSalesPage />} />
        <Route path="/venta-invernaderos" element={<GreenhouseSalesPage />} />
        <Route path="/casa-malla-plana" element={<FlatMeshSalesPage />} />
        <Route path="/vivero-cad" element={<ViveroCadPage />} />
        <Route path="/catalogo-invernaderos" element={<LeaderCatalogPage />} />
        <Route path="/catalogo" element={<Navigate to="/catalogo-invernaderos" replace />} />
        <Route path="/leader-greenhouse" element={<Navigate to="/catalogo-invernaderos" replace />} />

        {/* Panel de Control Administrativo SQLite */}
        <Route path="/admin" element={<AdminControlPanel />} />
        <Route path="/panel-control" element={<Navigate to="/admin" replace />} />

        {/* Redirecciones de compatibilidad */}
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="/cockpit.html" element={<Navigate to="/cockpit" replace />} />
        <Route path="/malla-50mesh.html" element={<Navigate to="/malla-50mesh" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};
