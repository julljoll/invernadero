import React from 'react';

export const BioclimaticMeshSection: React.FC = () => {
  return (
    <section className="py-5 py-lg-6 section-agro-alt">
      <div className="container-xl">
        <div className="text-center max-w-2xl mx-auto mb-5">
          <span className="section-kicker mb-2">
            <span className="material-symbols-outlined ms-sm">shield</span>
            MÓDULO 04 · CUBIERTA &amp; AERODINÁMICA NASA (MALLA 50 MESH)
          </span>
          <h2 className="display-6 fw-bold text-dark mb-2">
            Malla 50 Mesh 130 gsm: Modulación de 4 Rollos (Desperdicio Cero)
          </h2>
          <p className="text-secondary small">
            Especificación oficial de alta tenacidad (130 gsm) en monofilamento blanco virgen HDPE con poro ≤ 192 µm. Precio en Venezuela: $560 USD en efectivo por rollo ($2.240 USD total para 1.000 m²).
          </p>
        </div>

        <div className="row g-4 mb-4">
          {/* Despiece de los 4 rollos */}
          <div className="col-12 col-lg-7">
            <div className="card card-agro p-4 h-100 shadow-sm">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="badge bg-success bg-opacity-25 text-success rounded-pill font-monospace">
                  4 Rollos de 4.00 m × 100.00 m · $560 USD c/u en Efectivo
                </span>
                <span className="badge bg-light text-dark border border-secondary-subtle font-monospace">
                  130 gsm · 97.5% Eficiencia de Corte
                </span>
              </div>

              <h3 className="fs-5 fw-bold text-dark mb-2">Plan de Despiece Oficial de la Nave de 1.000 m²</h3>
              <p className="text-secondary small mb-3">
                La geometría de 20 m de ancho por 50 m de largo encaja exactamente con el formato industrial de 4m × 100m:
              </p>

              <div className="list-group list-group-flush gap-2 font-monospace text-xs mb-3">
                <div className="list-group-item bg-light border border-secondary-subtle rounded-3 p-2.5 d-flex justify-content-between align-items-center">
                  <div>
                    <strong className="text-dark">Rollos 1 y 2 (200 m lineales):</strong>
                    <div className="text-secondary">4 paños enteros de 50 m para Techo (Franjas 0 a 16 m)</div>
                  </div>
                  <span className="badge bg-success bg-opacity-25 text-success">100% Útil</span>
                </div>

                <div className="list-group-item bg-light border border-secondary-subtle rounded-3 p-2.5 d-flex justify-content-between align-items-center">
                  <div>
                    <strong className="text-dark">Rollo 3 (100 m lineales):</strong>
                    <div className="text-secondary">1 paño de 50m (Techo Franja 16-20m) + 1 paño de 50m (Pared Norte)</div>
                  </div>
                  <span className="badge bg-success bg-opacity-25 text-success">100% Útil</span>
                </div>

                <div className="list-group-item bg-light border border-secondary-subtle rounded-3 p-2.5 d-flex justify-content-between align-items-center">
                  <div>
                    <strong className="text-dark">Rollo 4 (100 m lineales):</strong>
                    <div className="text-secondary">Pared Sur (50m) + Cabecera Este (20m) + Cabecera Oeste (20m) + Esclusa (10m)</div>
                  </div>
                  <span className="badge bg-success bg-opacity-25 text-success">90% Útil (10m Reserva)</span>
                </div>
              </div>

              <div className="p-3 bg-light rounded-3 border border-secondary-subtle text-xs text-secondary">
                <span className="fw-semibold text-dark">Enterramiento Sanitario:</span> Todos los paños de pared contemplan 20 cm de faldón enterrado en zanja perimetral continua compactada con grava, impidiendo el paso de larvas y trips por el nivel del suelo.
              </div>
            </div>
          </div>

          {/* Aerodinámica y Vientos de Quíbor */}
          <div className="col-12 col-lg-5">
            <div className="card card-agro p-4 h-100 shadow-sm border-success border-opacity-25 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="badge bg-success bg-opacity-25 text-success rounded-pill font-monospace">
                    NASA MERRA-2 Quíbor
                  </span>
                  <span className="material-symbols-outlined text-success ms-md">air</span>
                </div>

                <h3 className="fs-5 fw-bold text-dark mb-2">Comportamiento Bioclimático &amp; Eólico</h3>
                <p className="text-secondary small mb-3">
                  Parámetros meteorológicos del Municipio Jiménez integrados en el diseño estructural:
                </p>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <div className="p-3 bg-light rounded-3 border border-secondary-subtle">
                      <div className="text-secondary text-xs">Viento Dominante</div>
                      <div className="fs-5 fw-bold font-mono text-dark">ESTE (11 meses)</div>
                      <div className="text-secondary text-xs">Ráfagas a 27 km/h</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 bg-light rounded-3 border border-secondary-subtle">
                      <div className="text-secondary text-xs">Abatimiento Térmico</div>
                      <div className="fs-5 fw-bold font-mono text-success">ΔT &lt; 1.8 °C</div>
                      <div className="text-secondary text-xs">Anti-aborto floral (&lt;31.5°C)</div>
                    </div>
                  </div>
                </div>

                <ul className="list-unstyled text-secondary small d-flex flex-column gap-2 mb-0">
                  <li className="d-flex align-items-start gap-2">
                    <span className="material-symbols-outlined text-success ms-sm mt-0.5">check_circle</span>
                    <span><strong>Malla 130 gsm de Alta Tenacidad (1.530 N / 5cm):</strong> Calibre reforzado para pimentón en Quíbor. Soporta la fricción sobre postes Sch 40 y ráfagas de 27 km/h con garantía UV de 5 años.</span>
                  </li>
                  <li className="d-flex align-items-start gap-2">
                    <span className="material-symbols-outlined text-success ms-sm mt-0.5">check_circle</span>
                    <span><strong>Barrera Física Anti-Trips (Poro ≤ 192 µm):</strong> Blinda las 2.500 plantas de pimentón contra <em>Frankliniella occidentalis</em> y mosca blanca, vector primario del virus de la peste negra (TSWV).</span>
                  </li>
                  <li className="d-flex align-items-start gap-2">
                    <span className="material-symbols-outlined text-success ms-sm mt-0.5">check_circle</span>
                    <span><strong>108 Pilares Sch 40:</strong> Cuadrícula de 4.00m × 2.94m con dados de concreto ciclópeo y tirantes a 45° con guayas de 3/8".</span>
                  </li>
                  <li className="d-flex align-items-start gap-2">
                    <span className="material-symbols-outlined text-success ms-sm mt-0.5">check_circle</span>
                    <span><strong>Factor de Seguridad &gt; 40:</strong> Tensión por tirante ante empuje eólico de barlovento es de ~75 kgf frente a 4.200 kgf de rotura del cable.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default BioclimaticMeshSection;
