import React from 'react';

export const ReactivationHero: React.FC = () => {
  return (
    <section className="py-5 py-lg-6 section-agro-alt">
      <div className="container-xl">
        <div className="row g-5 align-items-center">
          <div className="col-12 col-lg-7">
            <div className="section-kicker mb-3">
              <span className="material-symbols-outlined ms-sm">verified</span>
              <span>Memoria Agronómica Oficial · Valle de Quíbor, Lara (700 msnm)</span>
            </div>

            <h1 className="display-4 fw-black text-dark tracking-tight lh-1 mb-3">
              Reactivación Agronómica de Casa de Malla <span className="text-success">1.000 m²</span>
            </h1>

            <p className="lead text-secondary fs-6 mb-4">
              Ingeniería hortícola de precisión para <strong className="text-dark">2.500 plantas de pimentón grande (Semilla Magistral F1)</strong> en estructura de parral tensado con <strong className="text-dark">108 pilares Sch 40</strong>. Cero pérdidas por virosis (TSWV) y picadura de trips gracias al blindaje de <strong className="text-success">Malla 50 Mesh (130 gsm)</strong>, fertirriego 100% hidrosoluble AIFA y regulador de pH activo.
            </p>

            <div className="d-flex flex-wrap gap-3 mb-4">
              <a
                href="#calculadora-reactivacion"
                className="btn btn-success btn-lg rounded-pill fw-bold px-4 d-inline-flex align-items-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined ms-sm">calculate</span>
                <span>Calculadora de Inversión (2.500 Pl.)</span>
              </a>

              <a
                href="#plan-fertilizacion"
                className="btn btn-outline-dark btn-lg rounded-pill fw-bold px-4 d-inline-flex align-items-center gap-2"
              >
                <span className="material-symbols-outlined ms-sm">science</span>
                <span>Plan AIFA Semilla Magistral</span>
              </a>
            </div>

            {/* Micro-especificaciones técnicas de la nave */}
            <div className="d-flex flex-wrap align-items-center gap-4 text-xs text-secondary font-monospace border-top border-secondary-subtle pt-3">
              <div className="d-flex align-items-center gap-1.5">
                <span className="material-symbols-outlined text-success ms-sm">straighten</span>
                <span>20.00m × 50.00m × 3.00m</span>
              </div>
              <div className="d-flex align-items-center gap-1.5">
                <span className="material-symbols-outlined text-success ms-sm">grid_4x4</span>
                <span>10 Camellones · 2.500 Goteros PC</span>
              </div>
              <div className="d-flex align-items-center gap-1.5">
                <span className="material-symbols-outlined text-success ms-sm">air</span>
                <span>Resistencia 27 km/h Este</span>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-5">
            <div className="card card-agro p-4 shadow-sm border-success border-opacity-50">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="badge bg-success bg-opacity-25 text-success rounded-pill font-monospace">
                  Meta del Ciclo Magistral (20 Semanas)
                </span>
                <span className="badge bg-light text-secondary border border-secondary-subtle font-monospace">
                  Finca La Cigarronera
                </span>
              </div>

              <div className="display-5 fw-bold font-mono text-dark mb-1">
                13.0 <span className="fs-5 text-secondary font-sans fw-normal">Toneladas</span>
              </div>
              <div className="text-secondary small mb-3">650 cestas de 20 kg (rendimiento de 5.20 kg/planta)</div>

              <div className="p-3 bg-light rounded-3 border border-secondary-subtle mb-3">
                <div className="row g-2 text-xs">
                  <div className="col-6">
                    <span className="text-secondary">Población Activa:</span>
                    <div className="fs-6 fw-bold font-mono text-dark">2.500 plantas (2.5 pl/m²)</div>
                  </div>
                  <div className="col-6">
                    <span className="text-secondary">Calibre Grande (&gt;220g):</span>
                    <div className="fs-6 fw-bold font-mono text-success">88% de cosecha</div>
                  </div>
                  <div className="col-6">
                    <span className="text-secondary">Sectores de Riego:</span>
                    <div className="fs-6 fw-bold font-mono text-info">2 sectores (2.00 m³/h)</div>
                  </div>
                  <div className="col-6">
                    <span className="text-secondary">Ahorro en Tutorado:</span>
                    <div className="fs-6 fw-bold font-mono text-success">-85% en Mano de Obra</div>
                  </div>
                </div>
              </div>

              <a
                href="#tutorado-espaldera"
                className="btn btn-outline-success w-100 rounded-pill fw-bold py-2 d-flex align-items-center justify-content-center gap-2"
              >
                <span className="material-symbols-outlined ms-sm">table_rows</span>
                <span>Auditar Marco y Tutorado Mecánico</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default ReactivationHero;
