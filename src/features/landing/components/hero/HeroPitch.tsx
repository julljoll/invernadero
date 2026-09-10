import React from 'react';
import { Link } from 'react-router-dom';

export const HeroPitch: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="d-inline-flex align-items-center gap-1.5 px-3 py-1 rounded-pill bg-success bg-opacity-10 border border-success border-opacity-25 text-success text-xs fw-bold text-uppercase mb-3">
        <span className="material-symbols-outlined ms-sm">verified</span>
        <span>Oportunidad Agroproductiva Llave en Mano · Quíbor, Lara</span>
      </div>

      <h1 className="display-4 fw-black text-dark tracking-tight lh-1 mb-3">
        Finca <span className="text-success">La Cigarronera</span>
      </h1>

      <p className="lead text-secondary fs-6 mb-4">
        Propuesta de inversión de <strong className="text-dark">$4.000 USD</strong> para culminar los últimos 10 metros del pozo artesanal (actualmente en <strong className="text-info">50m con 83% ya excavado</strong>) y activar la primera nave de <strong className="text-dark">1.000 m² de horticultura protegida</strong> con pimentón de alta densidad en el Valle de Quíbor.
      </p>

      {/* Botones CTA */}
      <div className="d-flex flex-wrap gap-3">
        <a
          href="#calculadora-roi"
          className="btn btn-success btn-lg rounded-pill fw-bold px-4 d-inline-flex align-items-center gap-2 shadow-sm"
        >
          <span className="material-symbols-outlined ms-sm">trending_up</span>
          <span>Simular Retorno (ROI)</span>
        </a>

        <Link
          to="/cockpit"
          className="btn btn-outline-dark btn-lg rounded-pill fw-bold px-4 d-inline-flex align-items-center gap-2"
        >
          <span className="material-symbols-outlined ms-sm">biotech</span>
          <span>Auditar Cockpit Técnico</span>
        </Link>
      </div>
    </div>
  );
};

