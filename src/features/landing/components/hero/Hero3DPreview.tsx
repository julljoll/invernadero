import React from 'react';
import { WellViewer } from '../../../3d-viewers/WellViewer/WellViewer';

export const Hero3DPreview: React.FC = () => {
  return (
    <div className="card card-agro p-2 shadow-lg">
      <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center px-2 py-1">
        <span className="text-secondary small fw-bold text-uppercase d-flex align-items-center gap-1">
          <span className="material-symbols-outlined text-info ms-sm">layers</span>
          <span>Estratigrafía 3D Pozo (0–60m)</span>
        </span>
        <span className="badge bg-success bg-opacity-25 text-success rounded-pill font-monospace">Cuara</span>
      </div>
      <WellViewer totalDepthM={60} staticWaterLevelM={49.5} />
    </div>
  );
};
