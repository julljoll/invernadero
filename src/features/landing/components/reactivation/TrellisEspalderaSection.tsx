import React from 'react';

export const TrellisEspalderaSection: React.FC = () => {
  return (
    <section id="tutorado-espaldera" className="py-5 py-lg-6 section-agro-white">
      <div className="container-xl">
        <div className="text-center max-w-2xl mx-auto mb-5">
          <span className="section-kicker mb-2">
            <span className="material-symbols-outlined ms-sm">table_rows</span>
            MÓDULO 03 · TUTORADO MECÁNICO HORTOMALLA (15×15 CM)
          </span>
          <h2 className="display-6 fw-bold text-dark mb-2">
            Tutorado Mecánico con Malla Espaldera en Pimentón (Hortomalla 15×15 cm)
          </h2>
          <p className="text-secondary small">
            Soporte continuo para 2.500 plantas de pimentón que erradica el desgajado de ramas por sobrepeso de frutos y elimina el atado manual.
          </p>
        </div>

        <div className="row g-4 mb-4">
          {/* Tarjeta Especificación Técnica de Montaje */}
          <div className="col-12 col-lg-6">
            <div className="card card-agro p-4 h-100 shadow-sm">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="badge bg-success bg-opacity-25 text-success rounded-pill font-monospace">
                  500 Metros Lineales (10 Camellones)
                </span>
                <span className="material-symbols-outlined text-success ms-md">table_rows</span>
              </div>

              <h3 className="fs-5 fw-bold text-dark mb-2">Montaje Tipo Cajón en 20 Hileras de Pimentón</h3>
              <p className="text-secondary small mb-3">
                La malla espaldera de polipropileno se tensa a lo largo de las 20 hileras apoyada en la retícula de 108 pilares Sch 40:
              </p>

              <div className="p-3 bg-light rounded-3 border border-secondary-subtle font-monospace text-xs text-secondary mb-3">
                <div className="d-flex justify-content-between py-1 border-bottom border-secondary-subtle">
                  <span>Material Tutelado:</span>
                  <strong className="text-dark">Polipropileno Biorientado UV (15×15 cm)</strong>
                </div>
                <div className="d-flex justify-content-between py-1 border-bottom border-secondary-subtle">
                  <span>Líneas Guía de Alambre:</span>
                  <strong className="text-dark">Calibre 12 galvanizado a 0.50m y 1.00m</strong>
                </div>
                <div className="d-flex justify-content-between py-1 border-bottom border-secondary-subtle">
                  <span>Prevención de Rajado:</span>
                  <strong className="text-success">0% ramas partidas en bifurcación ("Y")</strong>
                </div>
                <div className="d-flex justify-content-between py-1 border-bottom border-secondary-subtle">
                  <span>Carga Viva de Frutos Soportada:</span>
                  <strong className="text-success">Hasta 12.500 kg de carga vegetal</strong>
                </div>
                <div className="d-flex justify-content-between pt-1">
                  <span>Porte Final de Planta:</span>
                  <strong className="text-info">1.00 a 1.20 m (porte semideterminado)</strong>
                </div>
              </div>

              <div className="alert alert-success bg-success bg-opacity-10 border-success border-opacity-25 small mb-0 text-dark">
                <strong>Colchón Térmico de 1.80 Metros:</strong> Dado que el dosel del pimentón alcanza 1.20 m de altura y el alero de la casa de cultivo se ubica a 3.00 m, queda un <strong>colchón térmico superior de 1.80 metros de aire ventilado</strong>. El calor convectivo asciende libremente sin tocar las flores, impidiendo el aborto por temperaturas &gt; 32 °C.
              </div>
            </div>
          </div>

          {/* Tarjeta Ahorro Laboral y Bioseguridad Viral */}
          <div className="col-12 col-lg-6">
            <div className="card card-agro p-4 h-100 shadow-sm border-success border-opacity-50">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="badge bg-success bg-opacity-25 text-success rounded-pill font-monospace">
                  Ahorro del 85% en Mano de Obra
                </span>
                <span className="material-symbols-outlined text-success ms-md">verified_user</span>
              </div>

              <h3 className="fs-5 fw-bold text-dark mb-2">Blindaje Sanitario &amp; Cero Contacto Manual</h3>
              <p className="text-secondary small mb-3">
                El amarre constante con rafia y el uso de estacas de madera es el foco primario de dispersión de patógenos bacterianos y virosis:
              </p>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <div className="p-3 bg-light rounded-3 border border-secondary-subtle">
                    <div className="text-secondary text-xs">Jornales Requeridos</div>
                    <div className="fs-3 fw-bold font-mono text-success">1.0 / mes</div>
                    <div className="text-secondary text-xs">Vs 8 jornales/mes tradicional</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-light rounded-3 border border-secondary-subtle">
                    <div className="text-secondary text-xs">Ahorro en Jornales</div>
                    <div className="fs-3 fw-bold font-mono text-success">-$140 USD</div>
                    <div className="text-secondary text-xs">Ahorro mensual directo</div>
                  </div>
                </div>
              </div>

              <ul className="list-unstyled text-secondary small d-flex flex-column gap-2 mb-0">
                <li className="d-flex align-items-start gap-2">
                  <span className="material-symbols-outlined text-success ms-sm mt-0.5">check_circle</span>
                  <span><strong>Blindaje contra Virosis y Bacterias:</strong> Las ramas descansan por gravedad en las ventanas de 15×15 cm sin manipulación humana, cortando la diseminación mecánica de TMV y <em>Xanthomonas</em>.</span>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <span className="material-symbols-outlined text-success ms-sm mt-0.5">check_circle</span>
                  <span><strong>Frutos Limpios Fuera del Suelo:</strong> Los pimentones cuelgan protegidos de la radiación solar directa bajo el follaje y sin tocar el suelo, reduciendo las manchas por golpe de sol y pudriciones fúngicas.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Cuadro Resumen Comparativo de Sistemas de Tutorado */}
        <div className="card card-agro p-4 shadow-sm">
          <h4 className="fs-6 fw-bold text-dark mb-3">Comparativa Operativa de Soporte en Pimentón (2.500 Plantas / 1.000 m²)</h4>
          <div className="table-responsive">
            <table className="table table-sm align-middle small mb-0 font-monospace">
              <thead className="table-light font-sans">
                <tr>
                  <th>Método de Entutorado</th>
                  <th>Jornales Mensuales</th>
                  <th>Costo Mano de Obra (Ciclo)</th>
                  <th>Riesgo de Desgajado de Ramas</th>
                  <th>Complejidad Operativa</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-sans text-secondary">Estacas de Madera + Rafia Manual</td>
                  <td>7 – 8 jornales/mes</td>
                  <td>~$650 USD</td>
                  <td className="text-danger fw-bold">40% (Rotura de ramas con fruta pesada)</td>
                  <td className="text-danger">Alta (Amarres continuos)</td>
                </tr>
                <tr>
                  <td className="font-sans text-secondary">Hilos Individuales Colgantes</td>
                  <td>5 – 6 jornales/mes</td>
                  <td>~$480 USD</td>
                  <td className="text-warning">25% (Ahorcamiento de tallos tiernos)</td>
                  <td className="text-secondary">Media</td>
                </tr>
                <tr className="table-success fw-bold">
                  <td className="font-sans text-success">Malla Espaldera Hortomalla 15×15 cm</td>
                  <td className="text-success">1.0 jornal/mes</td>
                  <td className="text-success">~$90 USD</td>
                  <td className="text-success">0% (Soporte pasivo continuo)</td>
                  <td className="text-success">Mínima (Autosostenible)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
export default TrellisEspalderaSection;
