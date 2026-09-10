import React from 'react';
import { Link } from 'react-router-dom';

export const CtaBannerPozo: React.FC = () => {
  return (
    <section className="py-4">
      <div className="container-xl">
        <div className="card card-agro border-info border-opacity-50 p-4 p-md-5 bg-white shadow-sm overflow-hidden position-relative">
          <div className="row g-4 align-items-center">
            <div className="col-12 col-lg-8">
              <div className="d-inline-flex align-items-center gap-1.5 px-3 py-1 rounded-pill bg-info bg-opacity-10 text-info text-xs fw-bold text-uppercase mb-2">
                <span className="material-symbols-outlined ms-sm">water_ph</span>
                <span>Llamado a la Acción 01 · Ficha Hidrogeológica</span>
              </div>
              <h3 className="h2 fw-bold text-dark mb-2">
                ¿A qué profundidad exacta culminar el pozo artesanal?
              </h3>
              <p className="text-secondary small mb-0">
                Accede a nuestro simulador interactivo de terminación del pozo (50m a 60m). Calcula la columna de agua activa, volumen buffer en litros, potencia de electrobomba recomendada y costos de excavación por metro lineal en Cuara.
              </p>
            </div>

            <div className="col-12 col-lg-4 text-lg-end">
              <Link
                to="/calculo-pozo"
                className="btn btn-info btn-lg rounded-pill fw-bold text-white px-4 py-3 d-inline-flex align-items-center gap-2 shadow-sm"
              >
                <span>Simular Cálculos del Pozo</span>
                <span className="material-symbols-outlined ms-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
