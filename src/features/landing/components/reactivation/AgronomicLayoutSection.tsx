import React from 'react';

export const AgronomicLayoutSection: React.FC = () => {
  return (
    <section className="py-5 py-lg-6 section-agro-white">
      <div className="container-xl">
        <div className="text-center max-w-2xl mx-auto mb-5">
          <span className="section-kicker mb-2">
            <span className="material-symbols-outlined ms-sm">grid_view</span>
            MÓDULO 01 · MARCO DE SIEMBRA &amp; DISTRIBUCIÓN (2.500 PIMENTONES)
          </span>
          <h2 className="display-6 fw-bold text-dark mb-2">
            Marco de Siembra y Sectorización Hidráulica (2.500 Pimentones)
          </h2>
          <p className="text-secondary small">
            Aprovechamiento del 100% de la nave (20.00 m × 50.00 m) con simetría 1:1 entre plantas y goteros para electrobomba de 1.5 HP.
          </p>
        </div>

        <div className="row g-4 align-items-stretch">
          {/* Tarjeta Marco de Siembra */}
          <div className="col-12 col-lg-6">
            <div className="card card-agro p-4 h-100 shadow-sm">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="badge bg-success bg-opacity-25 text-success rounded-pill font-monospace">
                  10 Camellones Dobles (20 Hileras)
                </span>
                <span className="material-symbols-outlined text-success ms-md">grid_view</span>
              </div>

              <h3 className="fs-5 fw-bold text-dark mb-2">Distribución Geométrica en 20 m de Ancho</h3>
              <p className="text-secondary small mb-3">
                10 camas trapezoidales elevadas a 0.25 m para drenaje y oxigenación radicular del pimentón, con pasillos de 1.20 m:
              </p>

              <div className="p-3 bg-light rounded-3 border border-secondary-subtle mb-3 font-monospace text-xs text-secondary">
                <div className="d-flex justify-content-between py-1 border-bottom border-secondary-subtle">
                  <span>Ancho de Mesa Superior:</span>
                  <strong className="text-dark">0.80 m (base de camellón)</strong>
                </div>
                <div className="d-flex justify-content-between py-1 border-bottom border-secondary-subtle">
                  <span>Pasillo de Tránsito y Cosecha:</span>
                  <strong className="text-dark">1.20 m (paso libre de carretillas)</strong>
                </div>
                <div className="d-flex justify-content-between py-1 border-bottom border-secondary-subtle">
                  <span>Distancia Entre Ejes:</span>
                  <strong className="text-dark">0.80m + 1.20m = 2.00 m modular</strong>
                </div>
                <div className="d-flex justify-content-between py-1 border-bottom border-secondary-subtle">
                  <span>Hileras por Camellón:</span>
                  <strong className="text-dark">2 hileras a 0.50m (20 hileras de 50m)</strong>
                </div>
                <div className="d-flex justify-content-between py-1 border-bottom border-secondary-subtle">
                  <span>Distancia Entre Plantas en Hilera:</span>
                  <strong className="text-success">0.40 m (125 plantas / hilera)</strong>
                </div>
                <div className="d-flex justify-content-between pt-1">
                  <span>Población y Densidad Total:</span>
                  <strong className="text-success">2.500 plantas (2.50 plantas/m²)</strong>
                </div>
              </div>

              <div className="alert alert-success bg-success bg-opacity-10 border-success border-opacity-25 small mb-0 text-dark">
                <strong>Sincronía 1:1 Planta-Gotero:</strong> Cada una de las 2.500 plantas de pimentón cuenta con su propio gotero autocompensante de 1.60 L/h a 0.40 m, garantizando un bulbo de humedad uniforme sin déficit hídrico ni zonas secas en la hilera.
              </div>
            </div>
          </div>

          {/* Tarjeta Hidráulica y Goteo */}
          <div className="col-12 col-lg-6">
            <div className="card card-agro p-4 h-100 shadow-sm border-info border-opacity-25">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="badge bg-info bg-opacity-25 text-info rounded-pill font-monospace">
                  Hidráulica Balanceada (BEP)
                </span>
                <span className="material-symbols-outlined text-info ms-md">water_drop</span>
              </div>

              <h3 className="fs-5 fw-bold text-dark mb-2">Red de Goteo Autocompensante PC/AS</h3>
              <p className="text-secondary small mb-3">
                Cinta de calibre pesado (12-15 mil) con goteros autocompensantes y antisucción, inmunes a variaciones de presión topográfica:
              </p>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <div className="p-3 bg-light rounded-3 border border-secondary-subtle">
                    <div className="text-secondary text-xs">Goteros Totales</div>
                    <div className="fs-4 fw-bold font-mono text-dark">2.500 PC</div>
                    <div className="text-secondary text-xs">Caudal 1.60 L/h a 0.40m</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-light rounded-3 border border-secondary-subtle">
                    <div className="text-secondary text-xs">División en 2 Sectores</div>
                    <div className="fs-4 fw-bold font-mono text-info">2.00 m³/h</div>
                    <div className="text-secondary text-xs">1.250 goteros / sector</div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-light rounded-3 border border-secondary-subtle font-monospace text-xs text-secondary">
                <div className="d-flex justify-content-between py-1 border-bottom border-secondary-subtle">
                  <span>Electrobomba de Riego:</span>
                  <strong className="text-dark">1.5 HP (Monofásica/Bifásica 220V)</strong>
                </div>
                <div className="d-flex justify-content-between py-1 border-bottom border-secondary-subtle">
                  <span>Presión en Cabezal de Riego:</span>
                  <strong className="text-dark">2.5 a 2.8 bar (36–40 PSI)</strong>
                </div>
                <div className="d-flex justify-content-between py-1 border-bottom border-secondary-subtle">
                  <span>Presión Regulada en Gotero:</span>
                  <strong className="text-success">1.4 a 1.8 bar constante</strong>
                </div>
                <div className="d-flex justify-content-between pt-1">
                  <span>Turnos de Riego Pico (Etapa 4):</span>
                  <strong className="text-info">2 turnos de 28 min (56 min/día)</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default AgronomicLayoutSection;
