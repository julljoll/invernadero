import React from 'react';
import { Link } from 'react-router-dom';

export const FunnelCockpitCTA: React.FC = () => {
  return (
    <section className="py-5 bg-dark text-white position-relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #0a1309 0%, #0c200c 50%, #071507 100%)',
      borderTop: '1px solid rgba(83, 201, 66, 0.25)',
      borderBottom: '1px solid rgba(83, 201, 66, 0.25)'
    }}>
      {/* Luz ambiental de fondo */}
      <div 
        className="position-absolute top-50 start-50 translate-middle pointer-events-none"
        style={{
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(83, 201, 66, 0.12) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(60px)',
          zIndex: 0
        }}
      />

      <div className="container-xl position-relative" style={{ zIndex: 1 }}>
        <div className="card border-0 bg-transparent text-white p-4 p-md-5">
          <div className="row g-4 align-items-center">
            {/* Columna de Texto y Propuesta Técnica */}
            <div className="col-12 col-lg-8">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill bg-success bg-opacity-20 border border-success border-opacity-40 text-success text-xs fw-bold text-uppercase mb-3">
                <span className="material-symbols-outlined ms-sm">biotech</span>
                <span>Ingeniería Avanzada &amp; Telemetría Quíbor</span>
              </div>

              <h2 className="display-6 fw-bold tracking-tight text-white mb-3">
                ¿Deseas Auditar la Ingeniería y Cálculos a Profundidad?
              </h2>

              <p className="lead text-light text-opacity-75 fs-6 mb-4">
                El proyecto cuenta con un <strong className="text-success">Cockpit Agronómico Integral</strong> calibrado para el Valle de Quíbor (9°53'20"N 69°35'35"W). Accede a los cálculos termodinámicos, simulador 3D de la nave, telemetría NASA MERRA-2, curvas de salinidad y formulaciones KaTeX de grado agronómico.
              </p>

              {/* Chips de Capacidades Técnicas del Cockpit */}
              <div className="d-flex flex-wrap gap-2 mb-2">
                <span className="badge bg-black bg-opacity-50 border border-white border-opacity-10 text-light py-2 px-3 rounded-pill text-xs d-inline-flex align-items-center gap-1.5 font-monospace">
                  <span className="material-symbols-outlined text-warning ms-sm">air</span>
                  <span>01. NASA MERRA-2 &amp; VPD</span>
                </span>
                <span className="badge bg-black bg-opacity-50 border border-white border-opacity-10 text-light py-2 px-3 rounded-pill text-xs d-inline-flex align-items-center gap-1.5 font-monospace">
                  <span className="material-symbols-outlined text-success ms-sm">cyclone</span>
                  <span>02. Ventilación &amp; RAH</span>
                </span>
                <span className="badge bg-black bg-opacity-50 border border-white border-opacity-10 text-light py-2 px-3 rounded-pill text-xs d-inline-flex align-items-center gap-1.5 font-monospace">
                  <span className="material-symbols-outlined text-success ms-sm">view_in_ar</span>
                  <span>03. Estructura 3D Malla 50 Mesh</span>
                </span>
                <span className="badge bg-black bg-opacity-50 border border-white border-opacity-10 text-light py-2 px-3 rounded-pill text-xs d-inline-flex align-items-center gap-1.5 font-monospace">
                  <span className="material-symbols-outlined text-info ms-sm">water_drop</span>
                  <span>04. Riego FAO-56 &amp; Lixiviación</span>
                </span>
                <span className="badge bg-black bg-opacity-50 border border-white border-opacity-10 text-light py-2 px-3 rounded-pill text-xs d-inline-flex align-items-center gap-1.5 font-monospace">
                  <span className="material-symbols-outlined text-info ms-sm">water_ph</span>
                  <span>05. Pozo Profundo 60m</span>
                </span>
                <span className="badge bg-black bg-opacity-50 border border-white border-opacity-10 text-light py-2 px-3 rounded-pill text-xs d-inline-flex align-items-center gap-1.5 font-monospace">
                  <span className="material-symbols-outlined text-danger ms-sm">pest_control</span>
                  <span>06. Fitosanidad IPM &amp; IRAC</span>
                </span>
              </div>
            </div>

            {/* Columna de Acción (Botón Principal) */}
            <div className="col-12 col-lg-4 text-lg-end">
              <div className="p-4 rounded-4 border border-success border-opacity-25 bg-black bg-opacity-40 shadow-lg text-center">
                <div className="text-muted text-xs text-uppercase tracking-wider fw-bold mb-2">
                  Panel Técnico en Tiempo Real
                </div>
                <div className="fs-5 fw-bold text-white mb-3">
                  Cockpit Agronómico Quíbor
                </div>
                
                <Link
                  to="/cockpit"
                  className="btn btn-success btn-lg touch-target-48 rounded-pill fw-bold text-white w-100 d-inline-flex align-items-center justify-content-center gap-2 shadow py-3 mb-2"
                  style={{
                    background: 'linear-gradient(135deg, #53C942 0%, #248a15 100%)',
                    borderColor: '#53C942'
                  }}
                >
                  <span className="material-symbols-outlined ms-md">speed</span>
                  <span>Explorar el Cockpit Técnico</span>
                  <span className="material-symbols-outlined ms-sm">arrow_forward</span>
                </Link>

                <div className="text-secondary text-xxs font-mono mt-2">
                  Telemetría satelital en vivo · Acceso libre para ingenieros e inversores
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default FunnelCockpitCTA;
