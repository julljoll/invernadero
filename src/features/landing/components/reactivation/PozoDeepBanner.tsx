import React from 'react';
import { Link } from 'react-router-dom';

export const PozoDeepBanner: React.FC = () => {
  return (
    <section className="py-5 section-agro-alt">
      <div className="container-xl">
        <div className="card card-agro border-info border-opacity-50 p-4 p-md-5 bg-white shadow-sm overflow-hidden position-relative">
          <div className="row g-4 align-items-center">
            <div className="col-12 col-lg-8">
              <span className="section-kicker section-kicker-info mb-2">
                <span className="material-symbols-outlined ms-sm">water_drop</span>
                MÓDULO 06 · INFRAESTRUCTURA HÍDRICA ESTRATÉGICA
              </span>
              <h3 className="h2 fw-bold text-dark mb-2">
                Proyecto de Reactivación de Pozo Profundo
              </h3>
              <p className="text-secondary small mb-0">
                Audita la memoria hidrogeológica oficial: culminación de los últimos 10 metros en formación aluvial consolidada (cota 60m), columna activa de 10.5 m (8.240 Litros en pozo), electrobomba industrial de 5.5 HP con VFD y reservorio regulador de 80 m³ para 10 días de autonomía.
              </p>
            </div>

            <div className="col-12 col-lg-4 text-lg-end">
              <Link
                to="/proyecto-pozo-profundo"
                className="btn btn-info btn-lg rounded-pill fw-bold text-white px-4 py-3 d-inline-flex align-items-center gap-2 shadow-sm"
              >
                <span>Ver Proyecto Hidrogeológico Completo</span>
                <span className="material-symbols-outlined ms-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default PozoDeepBanner;
