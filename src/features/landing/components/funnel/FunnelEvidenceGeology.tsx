import React from 'react';

export const FunnelEvidenceGeology: React.FC = () => {
  const points = [
    {
      title: 'Excavación Manual a 50 Metros',
      metric: '83% Ejecutado',
      desc: 'Fuste vertical a pico Ø 80 cm en arcillas masivas autoportantes (Su > 120 kPa). Camisa de anillos de concreto Ø 70 cm ext. (Ø útil 60 cm).',
      icon: 'verified',
    },
    {
      title: 'Espejo de Agua & Gravas de Lidita',
      metric: '49.5 m Estático',
      desc: 'Techo del acuífero cortado a 49.5 m. Profundizar 10 m capta el 100% del espesor saturado del Sector Sur documentado por Jégat & Mora (2012).',
      icon: 'water',
    },
    {
      title: 'Caudal Continuo Anti-Achique',
      metric: '1.5 a 2.0 L/s Continuo',
      desc: 'Recarga radial del paleocauce ~33.2 L/s (K ≈ 10⁻³ m/s). Electrobomba de 2.0 HP abastece la nave de 1.000 m² en solo 1 hora al día.',
      icon: 'electric_bolt',
    },
    {
      title: 'Georreferenciación y Acometida',
      metric: 'Cota 732–734 msnm',
      desc: 'Coordenadas 9°53\'15.8"N, 69°35\'37.3"W (La Cigarronera, Cuara). Poste con tendido eléctrico de baja tensión y tablero a pie de pozo.',
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
