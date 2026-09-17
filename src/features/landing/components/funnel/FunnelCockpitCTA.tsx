import React from 'react';
import { Link } from 'react-router-dom';

export const FunnelCockpitCTA: React.FC = () => {
  return (
    <section className="py-5 bg-dark text-white position-relative overflow-hidden" style={{
      background: 'radial-gradient(circle at 50% 50%, rgba(83, 201, 66, 0.15) 0%, transparent 70%), linear-gradient(135deg, #071507 0%, #0a200a 50%, #051005 100%)',
      borderTop: '1px solid rgba(83, 201, 66, 0.3)',
      borderBottom: '1px solid rgba(83, 201, 66, 0.3)'
    }}>
      {/* Luz ambiental sutil */}
      <div 
        className="position-absolute top-50 start-50 translate-middle pointer-events-none"
        style={{
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(83, 201, 66, 0.12) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(70px)',
          zIndex: 0
        }}
      />

      <div className="container-xl position-relative" style={{ zIndex: 1 }}>
        <div className="card border-0 bg-transparent text-white p-4 p-md-5">
          <div className="row g-5 align-items-center">
            {/* Columna de Autoridad Agronómica */}
            <div className="col-12 col-lg-8">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill bg-success bg-opacity-20 border border-success border-opacity-40 text-xs fw-bold text-uppercase mb-3" style={{ color: '#53C942' }}>
                <span className="material-symbols-outlined ms-sm">biotech</span>
                <span>Ingeniería Agronómica Verificada · Finca La Cigarronera, Quíbor</span>
              </div>

              <h2 className="display-6 fw-bold tracking-tight text-white mb-3">
                Invierte con Respaldo Científico en el Centro Hortícola de Venezuela
              </h2>

              <p className="lead text-light text-opacity-80 fs-6 mb-4">
                La siembra de <strong className="text-white">2.500 plántulas de Pimentón Magistral</strong> en este módulo de <strong className="text-white">1.000 m²</strong> no es una estimación teórica: cada parámetro está sustentado en la telemetría satelital <strong className="text-success">NASA MERRA-2</strong>, aforos hídricos de la zona, y los modelos micrometeorológicos del <strong className="text-white">Cockpit Agronómico AGROVENECUA</strong>.
              </p>

              {/* Chips de los 6 Módulos del Cockpit */}
              <div className="d-flex flex-wrap gap-2 mb-4">
                <span className="badge bg-black bg-opacity-60 border border-white border-opacity-15 text-light py-2 px-3 rounded-pill text-xs d-inline-flex align-items-center gap-1.5 font-monospace">
                  <span className="material-symbols-outlined text-warning ms-sm">thermostat</span>
                  <span>01. Clima Quíbor &amp; VPD Tetens</span>
                </span>
                <span className="badge bg-black bg-opacity-60 border border-white border-opacity-15 text-light py-2 px-3 rounded-pill text-xs d-inline-flex align-items-center gap-1.5 font-monospace">
                  <span className="material-symbols-outlined text-success ms-sm">cyclone</span>
                  <span>02. Ventilación &amp; Extractores Cenitales</span>
                </span>
                <span className="badge bg-black bg-opacity-60 border border-white border-opacity-15 text-light py-2 px-3 rounded-pill text-xs d-inline-flex align-items-center gap-1.5 font-monospace">
                  <span className="material-symbols-outlined text-success ms-sm">grid_4x4</span>
                  <span>03. Estructura 3.0 m &amp; Malla 50 Mesh</span>
                </span>
                <span className="badge bg-black bg-opacity-60 border border-white border-opacity-15 text-light py-2 px-3 rounded-pill text-xs d-inline-flex align-items-center gap-1.5 font-monospace">
                  <span className="material-symbols-outlined text-info ms-sm">water_drop</span>
                  <span>04. Riego FAO-56 &amp; Lixiviación LF</span>
                </span>
                <span className="badge bg-black bg-opacity-60 border border-white border-opacity-15 text-light py-2 px-3 rounded-pill text-xs d-inline-flex align-items-center gap-1.5 font-monospace">
                  <span className="material-symbols-outlined text-info ms-sm">water_ph</span>
                  <span>05. Viabilidad de Pozo</span>
                </span>
                <span className="badge bg-black bg-opacity-60 border border-white border-opacity-15 text-light py-2 px-3 rounded-pill text-xs d-inline-flex align-items-center gap-1.5 font-monospace">
                  <span className="material-symbols-outlined text-danger ms-sm">pest_control</span>
                  <span>06. Manejo Fitosanitario IPM &amp; IRAC</span>
                </span>
              </div>

              <div className="d-flex flex-wrap align-items-center gap-3 text-xs text-light text-opacity-70 font-mono">
                <span>📍 Coordenadas: 9°53'20.0"N 69°35'35.0"W</span>
                <span>•</span>
                <span>Cota 700 msnm</span>
                <span>•</span>
                <span>Municipio Jiménez, Lara</span>
              </div>
            </div>

            {/* Columna de Acción y Contacto Directo */}
            <div className="col-12 col-lg-4">
              <div className="p-4 rounded-4 border border-success border-opacity-30 bg-black bg-opacity-60 shadow-lg text-center">
                <div className="text-muted text-xs text-uppercase tracking-wider fw-bold mb-2">
                  Participación en el Módulo
                </div>
                <div className="fs-5 fw-bold text-white mb-2">
                  Reunión Técnica &amp; Visita a Finca
                </div>
                <p className="text-light text-opacity-75 text-xs mb-4">
                  Coordina con el equipo agronómico la visita técnica a la nave de 1.000 m² o solicita el dossier completo de inversión.
                </p>
                
                <a
                  href="https://wa.me/584160000000?text=Hola%20Agrovenecua,%20deseo%20agendar%20una%20reunión%20técnica%20o%20visita%20a%20la%20finca%20La%20Cigarronera%20en%20Quíbor%20para%20la%20inversión%20en%20pimentón%20Magistral%20en%20casa%20de%20malla%20de%201.000m2."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success btn-lg touch-target-48 rounded-pill fw-bold text-white w-100 d-inline-flex align-items-center justify-content-center gap-2 shadow py-3 mb-2.5"
                  style={{
                    background: 'linear-gradient(135deg, #53C942 0%, #248a15 100%)',
                    border: 'none'
                  }}
                >
                  <span className="material-symbols-outlined ms-md">chat</span>
                  <span>Contactar por WhatsApp</span>
                </a>

                <Link
                  to="/cockpit"
                  className="btn btn-outline-light btn-sm touch-target-48 rounded-pill fw-bold w-100 d-inline-flex align-items-center justify-content-center gap-2"
                >
                  <span className="material-symbols-outlined ms-sm">speed</span>
                  <span>Explorar Cockpit Técnico Completo</span>
                </Link>

                <div className="text-secondary text-xxs font-mono mt-3">
                  Respaldo formal con contratos agrícolas y garantías en campo
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
