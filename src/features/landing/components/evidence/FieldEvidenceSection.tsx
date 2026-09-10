import React from 'react';

export const FieldEvidenceSection: React.FC = () => {
  const evidences = [
    {
      title: 'Excavación Consolidada a 50m',
      desc: 'Brocal artesanal con encofrado de anillos de concreto armado in situ.',
      tag: '83% Ejecutado',
      icon: 'verified',
    },
    {
      title: 'Acuífero y Espejo de Agua',
      desc: 'Nivel estático en reposo verificado a 49.5 metros de profundidad en Cuara.',
      tag: 'Agua Dulce Libre',
      icon: 'water',
    },
    {
      title: 'Topografía y Cota 700 msnm',
      desc: 'Pendiente óptima del 1.2% para drenaje de escorrentías y vientos del Este.',
      tag: 'Valle de Quíbor',
      icon: 'terrain',
    },
  ];

  return (
    <section className="py-5 border-top border-secondary-subtle">
      <div className="container-xl">
        <div className="text-center max-w-2xl mx-auto mb-5">
          <span className="badge bg-success bg-opacity-10 border border-success border-opacity-25 text-success rounded-pill px-3 py-1 text-uppercase fw-bold mb-2">
            Inspección de Campo
          </span>
          <h2 className="display-6 fw-bold text-dark mb-2">
            Evidencias Técnicas en Finca La Cigarronera
          </h2>
          <p className="text-secondary small">
            Verificación física de perforación manual previa, coordenadas satelitales y régimen hidrogeológico.
          </p>
        </div>

        <div className="row row-cols-1 row-cols-md-3 g-4">
          {evidences.map((ev, index) => (
            <div className="col" key={index}>
              <div className="card card-agro p-4 h-100">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="badge bg-success bg-opacity-25 text-success rounded-pill font-monospace">
                    {ev.tag}
                  </span>
                  <span className="material-symbols-outlined text-success ms-md">
                    {ev.icon}
                  </span>
                </div>
                <h3 className="fs-5 fw-bold text-dark mb-2">{ev.title}</h3>
                <p className="text-secondary small mb-0">{ev.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
