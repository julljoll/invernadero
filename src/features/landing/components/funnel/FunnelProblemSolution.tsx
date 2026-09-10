import React from 'react';

export const FunnelProblemSolution: React.FC = () => {
  return (
    <section className="py-5 border-top border-secondary-subtle bg-light">
      <div className="container-xl">
        <div className="text-center max-w-2xl mx-auto mb-5">
          <span className="badge bg-warning bg-opacity-10 border border-warning border-opacity-25 text-warning rounded-pill px-3 py-1 text-uppercase fw-bold mb-2">
            Diagnóstico Comparativo
          </span>
          <h2 className="display-6 fw-bold text-dark mb-2">
            Campo Abierto Tradicional vs Invernadero Protegido 1.000 m²
          </h2>
          <p className="text-secondary small">
            Por qué reactivar una estructura protegida es la decisión agronómica más rentable y segura en el Municipio Jiménez.
          </p>
        </div>

        <div className="row g-4">
          {/* Campo Abierto (El Problema) */}
          <div className="col-12 col-md-6">
            <div className="card card-agro border-danger border-opacity-25 p-4 h-100">
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-danger ms-md">warning</span>
                <h3 className="fs-5 fw-bold text-danger mb-0">Riesgo en Campo Abierto (Quíbor)</h3>
              </div>

              <ul className="list-unstyled text-secondary small d-flex flex-column gap-3 mb-0">
                <li className="d-flex align-items-start gap-2">
                  <span className="material-symbols-outlined text-danger ms-sm mt-0.5">cancel</span>
                  <span><strong>Presión Extrema de Plagas:</strong> Mosca blanca y trips transmiten geminivirus y tospovirus de forma continua, arrasando hasta el 50% de las plantas antes de floración.</span>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <span className="material-symbols-outlined text-danger ms-sm mt-0.5">cancel</span>
                  <span><strong>Golpe de Sol y Aborto Floral:</strong> La radiación solar directa supera los 1.000 W/m² en marzo-abril, provocando necrosis apical y esterilidad del polen (&gt;32 °C).</span>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <span className="material-symbols-outlined text-danger ms-sm mt-0.5">cancel</span>
                  <span><strong>Deriva del Viento y Desgaste Químico:</strong> Ráfagas del Este de 27 km/h desvían aplicaciones foliares, requiriendo 3x más pesticidas con costos astronómicos.</span>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <span className="material-symbols-outlined text-danger ms-sm mt-0.5">cancel</span>
                  <span><strong>Rendimiento Mediocre:</strong> Difícilmente supera 3 a 4 kg/m², con alto porcentaje de fruto deforme o manchado de segunda categoría.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Horticultura Protegida 1.000 m² (La Solución) */}
          <div className="col-12 col-md-6">
            <div className="card card-agro border-success border-opacity-50 p-4 h-100 shadow-sm">
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-success ms-md">verified_user</span>
                <h3 className="fs-5 fw-bold text-success mb-0">Reactivación 1.000 m² Protegidos</h3>
              </div>

              <ul className="list-unstyled text-secondary small d-flex flex-column gap-3 mb-0">
                <li className="d-flex align-items-start gap-2">
                  <span className="material-symbols-outlined text-success ms-sm mt-0.5">check_circle</span>
                  <span><strong>Barrera Física 50 Mesh (≤192 µm):</strong> Bloqueo mecánico del 100% de vectores víricos sin necesidad de aplicaciones químicas de choque permanentes.</span>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <span className="material-symbols-outlined text-success ms-sm mt-0.5">check_circle</span>
                  <span><strong>Luz Solar Difusa &amp; Alivio Térmico:</strong> La malla blanca monofilamento atenúa el infrarrojo térmico, reduciendo la temperatura en hoja hasta en 2.0 °C.</span>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <span className="material-symbols-outlined text-success ms-sm mt-0.5">check_circle</span>
                  <span><strong>Eficiencia Hídrica con Pozo de 60m:</strong> Fertirriego por goteo autocompensante dosificando nutrientes exactos por etapa fenológica (FAO-56).</span>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <span className="material-symbols-outlined text-success ms-sm mt-0.5">check_circle</span>
                  <span><strong>Rendimiento Premium de 12.5 T:</strong> Más de 12.5 kg/m² con 92% de pimentón de calibre exportación / primera categoría, cotizado al precio pico de mercado.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
