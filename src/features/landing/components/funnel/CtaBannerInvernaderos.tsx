import React from 'react';
import { Link } from 'react-router-dom';

export const CtaBannerInvernaderos: React.FC = () => {
  return (
    <section className="py-4">
      <div className="container-xl">
        <div className="card card-agro border-success border-opacity-50 p-4 p-md-5 bg-white shadow-sm overflow-hidden position-relative">
          <div className="row g-4 align-items-center">
            <div className="col-12 col-lg-8">
              <div className="d-inline-flex align-items-center gap-1.5 px-3 py-1 rounded-pill bg-success bg-opacity-10 text-success text-xs fw-bold text-uppercase mb-2">
                <span className="material-symbols-outlined ms-sm">domain</span>
                <span>Llamado a la Acción 03 · Proyectos Nuevos</span>
              </div>
              <h3 className="h2 fw-bold text-dark mb-2">
                ¿Planeas Construir un Invernadero o Casa de Malla Llave en Mano?
              </h3>
              <p className="text-secondary small mb-0">
                Diseñamos y montamos estructuras agrícolas de 1.000 m² con cálculo eólico real para Quíbor: pilares Sch 40 galvanizados, cumbreras de hasta 5.5 m optimizadas para pimentón de alta densidad, ventilación convectiva antiahogo térmico y 10 años de garantía estructural.
              </p>
            </div>

            <div className="col-12 col-lg-4 text-lg-end">
              <Link
                to="/venta-invernaderos"
                className="btn btn-success btn-lg rounded-pill fw-bold text-white px-4 py-3 d-inline-flex align-items-center gap-2 shadow-sm"
              >
                <span>Ver Modelos y Cotizar Invernadero</span>
                <span className="material-symbols-outlined ms-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
