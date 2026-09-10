import React from 'react';

interface RoiSummaryCardProps {
  investmentAmount: number;
  grossRevenue: number;
  investorReturn: number;
  roiPercentage: number;
}

export const RoiSummaryCard: React.FC<RoiSummaryCardProps> = ({
  investmentAmount,
  grossRevenue,
  investorReturn,
  roiPercentage,
}) => {
  const waUrl = `https://wa.me/584160000000?text=Hola%20Agrovenecua,%20me%20interesa%20la%20propuesta%20de%20inversi%C3%B3n%20de%20$${investmentAmount}%20USD%20en%20el%20pozo%20de%20Qu%C3%ADbor`;

  return (
    <div className="card card-agro border-success border-opacity-50 p-4 p-md-5 shadow-lg position-relative overflow-hidden">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <span className="text-secondary text-xs fw-bold text-uppercase d-flex align-items-center gap-1">
          <span className="material-symbols-outlined text-success ms-sm">analytics</span>
          <span>Proyección Económica (Ciclo 5 Meses)</span>
        </span>
        <span className="badge bg-success text-dark font-monospace fw-bold">1.000 m²</span>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6">
          <div className="p-3 bg-light rounded-3 border border-secondary-subtle">
            <div className="text-secondary text-xs mb-1">Ingreso Bruto Nave</div>
            <div className="fs-4 fw-bold font-mono text-dark">${grossRevenue.toLocaleString()} USD</div>
          </div>
        </div>

        <div className="col-6">
          <div className="p-3 bg-light rounded-3 border border-secondary-subtle">
            <div className="text-secondary text-xs mb-1">Retorno Neto Inversor</div>
            <div className="fs-4 fw-bold font-mono text-success">${investorReturn.toFixed(0)} USD</div>
          </div>
        </div>
      </div>

      <div className="p-3 rounded-3 bg-success bg-opacity-10 border border-success border-opacity-25 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">
        <div>
          <div className="text-success text-xs fw-bold text-uppercase">Rentabilidad Estimada</div>
          <div className="display-6 fw-bold font-mono text-success lh-1">
            {roiPercentage.toFixed(0)}% ROI
          </div>
        </div>

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-success fw-bold rounded-pill px-4 d-flex align-items-center gap-2 shadow"
        >
          <span className="material-symbols-outlined ms-sm">handshake</span>
          <span>Postular Inversión</span>
        </a>
      </div>
    </div>
  );
};
