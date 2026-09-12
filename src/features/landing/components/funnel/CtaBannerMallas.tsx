import React from 'react';
import { Link } from 'react-router-dom';

export const CtaBannerMallas: React.FC = () => {
  return (
    <section className="py-4">
      <div className="container-xl">
        <div className="card card-agro border-success border-opacity-50 p-4 p-md-5 bg-white shadow-sm overflow-hidden position-relative">
          <div className="row g-4 align-items-center">
            <div className="col-12 col-lg-8">
              <div className="d-inline-flex align-items-center gap-1.5 px-3 py-1 rounded-pill bg-success bg-opacity-10 text-success text-xs fw-bold text-uppercase mb-2">
                <span className="material-symbols-outlined ms-sm">grid_view</span>
                <span>Llamado a la Acción 02 · Insumos Críticos</span>
              </div>
              <h3 className="h2 fw-bold text-dark mb-2">
                ¿Necesitas Blindar tu Cultivo con Malla Antiáfido 50 Mesh?
              </h3>
              <p className="text-secondary small mb-0">
                Disponemos de rollos comerciales (4m × 100m) en <strong>110 gsm (óptimo flujo térmico)</strong> y <strong>130 gsm (alta tenacidad mecánica para pimentón)</strong>. 100% HDPE monofilamento virgen, poro ≤192 µm y 5 años de garantía UV contra el sol de Quíbor.
              </p>
            </div>

            <div className="col-12 col-lg-4 text-lg-end">
              <Link
                to="/malla-50mesh"
                className="btn btn-success btn-lg rounded-pill fw-bold text-white px-4 py-3 d-inline-flex align-items-center gap-2 shadow-sm"
              >
                <span>Ver Catálogo y Cotizar Malla</span>
                <span className="material-symbols-outlined ms-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
