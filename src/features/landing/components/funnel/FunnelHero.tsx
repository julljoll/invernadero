import React from 'react';
import { Link } from 'react-router-dom';

export const FunnelHero: React.FC = () => {
  return (
    <section className="py-5 position-relative overflow-hidden">
      <div className="container-xl">
        <div className="row g-5 align-items-center">
          <div className="col-12 col-lg-7">
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill bg-success bg-opacity-10 border border-success border-opacity-30 text-success text-xs fw-bold text-uppercase mb-3">
              <span className="material-symbols-outlined ms-sm">verified</span>
              <span>Programa de Reactivación Hortícola · Quíbor, Lara</span>
            </div>

            <h1 className="display-4 fw-black text-dark tracking-tight lh-sm mb-3">
              Multiplica tu Rendimiento Activando la Nave de <span className="text-success">1.000 m²</span> con Pimentón
            </h1>

            <p className="lead text-secondary fs-6 mb-4">
              En el Valle de Quíbor, sembrar a campo abierto significa arriesgar hasta el <strong className="text-danger">60% de tu cosecha</strong> por virosis y bochorno. Reactivar esta estructura protegida con fertirriego tecnificado y pozo a 60m asegura cosechar <strong className="text-dark">12.500 kg de pimentón de primera calidad</strong> (o hasta 22.800 kg de tomate) por ciclo con retorno acelerado.
            </p>

            <div className="d-flex flex-wrap gap-3 mb-4">
              <a
                href="#financiero"
                className="btn btn-success btn-lg touch-target-48 rounded-pill fw-bold px-4 d-inline-flex align-items-center gap-2 shadow-sm text-white"
              >
                <span className="material-symbols-outlined ms-sm">trending_up</span>
                <span>Ver Retorno Financiero (Pimentón)</span>
              </a>

              <Link
                to="/cockpit"
                className="btn btn-outline-dark btn-lg touch-target-48 rounded-pill fw-bold px-4 d-inline-flex align-items-center gap-2"
              >
                <span className="material-symbols-outlined ms-sm">speed</span>
                <span>Cockpit Técnico Quíbor</span>
              </Link>
            </div>

            {/* Micro métricas de Quíbor */}
            <div className="d-flex flex-wrap align-items-center gap-3 text-xs text-secondary font-monospace border-top border-secondary-subtle pt-3">
              <div className="d-flex align-items-center gap-1.5">
                <span className="material-symbols-outlined text-success ms-sm">check_circle</span>
                <span>9°53'20"N 69°35'35"W</span>
              </div>
              <div className="d-flex align-items-center gap-1.5">
                <span className="material-symbols-outlined text-success ms-sm">check_circle</span>
                <span>Cota 700 msnm</span>
              </div>
              <div className="d-flex align-items-center gap-1.5">
                <span className="material-symbols-outlined text-success ms-sm">check_circle</span>
                <span>Pozo 60m Propio</span>
              </div>
              <div className="d-flex align-items-center gap-1.5">
                <span className="material-symbols-outlined text-success ms-sm">check_circle</span>
                <span>Malla 50 Mesh Virgen</span>
              </div>
            </div>
          </div>

          {/* Tarjeta de Resumen Ejecutivo / Ticket de Inversión */}
          <div className="col-12 col-lg-5">
            <div className="card card-agro p-4 shadow-sm border-success border-opacity-50 position-relative overflow-hidden">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="badge bg-success bg-opacity-25 text-success rounded-pill font-monospace">
                  Calculo total
                </span>
                <span className="badge bg-light text-secondary border border-secondary-subtle font-monospace">
                  Pimentón Quíbor · 1.000 m²
                </span>
              </div>

              <div className="display-5 fw-bold font-mono text-dark mb-1">
                $10.575 <span className="fs-6 text-secondary">USD</span>
              </div>
              <div className="text-secondary small mb-3">
                Costo total integrado: Reactivación casa de cultivo 1.000 m² + Culminación pozo a 60 metros
              </div>

              {/* Desglose visual de los 2 grandes rubros */}
              <div className="p-2.5 bg-success bg-opacity-10 rounded-3 border border-success border-opacity-25 mb-3 text-xs">
                <div className="d-flex justify-content-between align-items-center py-1 border-bottom border-success border-opacity-20">
                  <span className="text-dark fw-semibold d-flex align-items-center gap-1">
                    <span className="material-symbols-outlined text-success fs-6">agriculture</span>
                    <span>Casa de Cultivo (1.000 m²):</span>
                  </span>
                  <strong className="font-mono text-dark">$6.575 USD</strong>
                </div>
                <div className="text-muted text-xxs pb-1 pt-0.5">
                  Malla 50 mesh 130 gsm + Hortomalla + riego 1:1 + semilla Magistral F1 y nutrición AIFA
                </div>
                <div className="d-flex justify-content-between align-items-center py-1 border-top border-success border-opacity-20">
                  <span className="text-dark fw-semibold d-flex align-items-center gap-1">
                    <span className="material-symbols-outlined text-info fs-6">water_drop</span>
                    <span>Pozo a 60 Metros:</span>
                  </span>
                  <strong className="font-mono text-dark">$4.000 USD</strong>
                </div>
                <div className="text-muted text-xxs pt-0.5">
                  10m excavación grava + anillos concreto Ø 70cm + bomba sumergible 2 HP y tablero
                </div>
              </div>

              <div className="p-3 bg-light rounded-3 border border-secondary-subtle mb-0">
                <div className="row g-2 text-xs">
                  <div className="col-6">
                    <span className="text-secondary">Producción Ciclo:</span>
                    <div className="fs-6 fw-bold font-mono text-success">12.500 kg (12.5 T)</div>
                  </div>
                  <div className="col-6">
                    <span className="text-secondary">Retorno Inversor:</span>
                    <div className="fs-6 fw-bold font-mono text-success">60% a 70% ROI</div>
                  </div>
                  <div className="col-6">
                    <span className="text-secondary">Autosuficiencia Hídrica:</span>
                    <div className="fs-6 fw-bold font-mono text-info">100% Agua Propia</div>
                  </div>
                  <div className="col-6">
                    <span className="text-secondary">Tiempo Activación:</span>
                    <div className="fs-6 fw-bold font-mono text-dark">3 - 4 Semanas</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default FunnelHero;
