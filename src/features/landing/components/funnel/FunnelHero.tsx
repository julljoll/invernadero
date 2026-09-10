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
              <span>Embudo de Reactivación Hortícola · Quíbor, Lara</span>
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
                  Oportunidad Llave en Mano
                </span>
                <span className="badge bg-light text-secondary border border-secondary-subtle font-monospace">
                  Pimentón Quíbor
                </span>
              </div>

              <div className="display-5 fw-bold font-mono text-dark mb-1">
                $4.000 <span className="fs-6 text-secondary">USD</span>
              </div>
              <div className="text-secondary small mb-3">
                Presupuesto estimado para culminación de pozo, malla y siembra de pimentón
              </div>

              <div className="p-3 bg-light rounded-3 border border-secondary-subtle mb-3">
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
                    <span className="text-secondary">Tiempo Activación:</span>
                    <div className="fs-6 fw-bold font-mono text-dark">3 - 4 Semanas</div>
                  </div>
                  <div className="col-6">
                    <span className="text-secondary">Blindaje Virosis:</span>
                    <div className="fs-6 fw-bold font-mono text-info">100% Vectores</div>
                  </div>
                </div>
              </div>

              <a
                href="https://wa.me/584160000000?text=Hola%20Agrovenecua,%20deseo%20evaluar%20la%20reactivación%20de%20la%20nave%20de%201000m2%20en%20Quíbor"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-success w-100 touch-target-48 rounded-pill fw-bold py-2.5 d-flex align-items-center justify-content-center gap-2 shadow-sm text-white mb-2"
              >
                <span className="material-symbols-outlined ms-sm">handshake</span>
                <span>Contactar con el Agrónomo Responsable</span>
              </a>

              <div className="text-center">
                <Link to="/cockpit" className="text-secondary text-xxs font-mono text-decoration-none">
                  ¿Prefieres ver los cálculos técnicos? <span className="text-success fw-bold">Abrir Cockpit →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default FunnelHero;
