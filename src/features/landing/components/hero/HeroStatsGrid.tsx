import React from 'react';

export const HeroStatsGrid: React.FC = () => {
  return (
    <div className="row g-3 my-4">
      <div className="col-6 col-sm-4">
        <div className="card card-agro p-3 h-100">
          <div className="d-flex align-items-center justify-content-between mb-1">
            <span className="text-secondary small fw-semibold">Avance Pozo</span>
            <span className="material-symbols-outlined text-success ms-sm">water_ph</span>
          </div>
          <div className="fs-3 fw-bold font-mono text-success">83%</div>
          <div className="text-secondary" style={{ fontSize: '0.75rem' }}>50m ya consolidados</div>
        </div>
      </div>

      <div className="col-6 col-sm-4">
        <div className="card card-agro card-agro-water p-3 h-100">
          <div className="d-flex align-items-center justify-content-between mb-1">
            <span className="text-secondary small fw-semibold">Rendimiento</span>
            <span className="material-symbols-outlined text-info ms-sm">agriculture</span>
          </div>
          <div className="fs-3 fw-bold font-mono text-info">12.5 T</div>
          <div className="text-secondary" style={{ fontSize: '0.75rem' }}>Pimentón por ciclo</div>
        </div>
      </div>

      <div className="col-12 col-sm-4">
        <div className="card card-agro card-agro-sun p-3 h-100">
          <div className="d-flex align-items-center justify-content-between mb-1">
            <span className="text-secondary small fw-semibold">Garantía UV</span>
            <span className="material-symbols-outlined text-warning ms-sm">shield</span>
          </div>
          <div className="fs-3 fw-bold font-mono text-warning">5 Años</div>
          <div className="text-secondary" style={{ fontSize: '0.75rem' }}>Malla 50 Mesh virgen</div>
        </div>
      </div>
    </div>
  );
};
