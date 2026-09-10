import React from 'react';

export const HydrogeologySection: React.FC = () => {
  const strata = [
    { depth: '0 a 15 metros', type: 'Limos y Arcillas Superficiales', icon: 'landscape', color: 'text-warning' },
    { depth: '15 a 35 metros', type: 'Gravas Aluviales y Cantos Rodados', icon: 'grain', color: 'text-secondary' },
    { depth: '35 a 50 metros', type: 'Arenas Cuarcíferas Acuíferas', icon: 'waves', color: 'text-info' },
    { depth: '50 a 60 metros', type: 'Acuífero Productivo Consolidado (T = 180 m²/día)', icon: 'water_ph', color: 'text-success' },
  ];

  return (
    <section className="py-5 border-top border-secondary-subtle">
      <div className="container-xl">
        <div className="row g-5 align-items-center">
          <div className="col-12 col-lg-6">
            <span className="badge bg-info bg-opacity-10 border border-info border-opacity-25 text-info rounded-pill px-3 py-1 text-uppercase fw-bold mb-2">
              Hidrogeología Cuara
            </span>
            <h2 className="display-6 fw-bold text-dark mb-3">
              Estratigrafía Geológica del Aljibe a 60 Metros
            </h2>
            <p className="text-secondary small mb-4">
              El acuífero libre de Quíbor presenta una alta permeabilidad en la formación aluvial profunda. La finalización de los últimos 10 metros garantiza una recarga constante de <strong>2.5 L/s</strong> suficiente para fertirrigar hasta <strong>3 naves protegidas</strong>.
            </p>

            <div className="d-flex flex-column gap-2">
              {strata.map((st, index) => (
                <div key={index} className="p-3 rounded-3 bg-light border border-secondary-subtle d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <span className={`material-symbols-outlined ms-sm ${st.color}`}>{st.icon}</span>
                    <span className="text-dark text-xs fw-semibold">{st.type}</span>
                  </div>
                  <span className="badge bg-white border border-secondary-subtle text-secondary font-monospace">
                    {st.depth}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="card card-agro card-agro-water p-4 shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-bold text-info text-xs text-uppercase d-flex align-items-center gap-1">
                  <span className="material-symbols-outlined ms-sm">balance</span>
                  <span>Aljibe Artesanal vs Pozo Perforado</span>
                </span>
                <span className="badge bg-success bg-opacity-25 text-success rounded-pill font-monospace">
                  Ahorro 70%
                </span>
              </div>

              <div className="table-responsive">
                <table className="table table-sm small mb-0">
                  <thead>
                    <tr className="text-secondary border-bottom border-secondary-subtle">
                      <th>Parámetro</th>
                      <th>Aljibe Manual (60m)</th>
                      <th>Perforación Industrial</th>
                    </tr>
                  </thead>
                  <tbody className="font-monospace">
                    <tr>
                      <td className="text-dark font-sans">Costo Total</td>
                      <td className="text-success fw-bold">$4.000 USD</td>
                      <td className="text-danger">$15.000 - $22.000 USD</td>
                    </tr>
                    <tr>
                      <td className="text-dark font-sans">Diámetro Efectivo</td>
                      <td className="text-info">1.0 m (Mayor Reserva)</td>
                      <td>0.15 - 0.20 m (6-8")</td>
                    </tr>
                    <tr>
                      <td className="text-dark font-sans">Capacidad Buffer</td>
                      <td className="text-success">8.200 Litros en pozo</td>
                      <td>Menor volumen en columna</td>
                    </tr>
                    <tr>
                      <td className="text-dark font-sans">Tiempo Activación</td>
                      <td className="text-warning">3 - 4 Semanas</td>
                      <td>2 - 3 Meses</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
