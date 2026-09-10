import React from 'react';

export const FunnelEvidenceGeology: React.FC = () => {
  const points = [
    {
      title: 'Perforación Manual en 50 Metros',
      metric: '83% Consolidado',
      desc: 'Brocal artesanal de 1 metro de diámetro con encofrado in situ de anillos de concreto armado con malla electrosoldada.',
      icon: 'verified',
    },
    {
      title: 'Espejo de Agua Dulce Libre',
      metric: '49.5 m Estático',
      desc: 'Nivel freático comprobado en reposo en la formación aluvial de Cuara. Solo faltan 10 metros para activar la columna de 10.5 m.',
      icon: 'water',
    },
    {
      title: 'Caudal Estable para Fertirriego',
      metric: '2.5 L/s Constante',
      desc: 'Capacidad de recarga continua con electrobomba sumergible de 2.0 HP, suficiente para alimentar 3 naves protegidas simultáneas.',
      icon: 'electric_bolt',
    },
    {
      title: 'Georreferenciación Satelital',
      metric: 'Cota 700 msnm',
      desc: 'Coordenadas 9°53\'20.0"N, 69°35\'35.0"W (Municipio Jiménez). Pendiente de 1.2% para drenaje de escorrentías pluviales.',
      icon: 'location_on',
    },
  ];

  return (
    <section className="py-5 border-top border-secondary-subtle">
      <div className="container-xl">
        <div className="text-center max-w-2xl mx-auto mb-5">
          <span className="badge bg-info bg-opacity-10 border border-info border-opacity-25 text-info rounded-pill px-3 py-1 text-uppercase fw-bold mb-2">
            Inspección y Factibilidad Técnica
          </span>
          <h2 className="display-6 fw-bold text-dark mb-2">
            Evidencia Geológica y de Campo en Finca La Cigarronera
          </h2>
          <p className="text-secondary small">
            Verificación in situ de la infraestructura existente que permite reactivar la nave con una fracción del costo de un proyecto desde cero.
          </p>
        </div>

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {points.map((p, idx) => (
            <div className="col" key={idx}>
              <div className="card card-agro p-4 h-100 shadow-sm">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="badge bg-info bg-opacity-25 text-info rounded-pill font-monospace">
                    {p.metric}
                  </span>
                  <span className="material-symbols-outlined text-info ms-md">
                    {p.icon}
                  </span>
                </div>
                <h3 className="fs-5 fw-bold text-dark mb-2">{p.title}</h3>
                <p className="text-secondary small mb-0">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
