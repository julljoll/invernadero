import React, { useState } from 'react';

export const FertigationPlanSection: React.FC = () => {
  const [matrixView, setMatrixView] = useState<'visual' | 'tabla'>('visual');

  return (
    <section id="plan-fertilizacion" className="py-5 py-lg-6 section-agro-alt">
      <div className="container-xl">
        {/* Cabecera Técnica */}
        <div className="text-center max-w-3xl mx-auto mb-5">
          <span className="section-kicker mb-2">
            <span className="material-symbols-outlined ms-sm">science</span>
            MÓDULO 02 · NUTRICIÓN AIFA &amp; SEMILLA MAGISTRAL F1
          </span>
          <h2 className="display-6 fw-bold text-dark mb-2">
            Plan de Fertirriego AIFA para Pimentón Grande (<span className="text-success">Semilla Magistral F1</span>)
          </h2>
          <p className="text-secondary small">
            Programa de precisión para 2.500 plantas enfocado exclusivamente en maximizar el <strong>Calibre Extra Grande / Jumbo (&gt;220g por fruto)</strong>, integrando semilla híbrida Magistral, nutrición 100% soluble AIFA y regulador de pH para aguas duras de Quíbor.
          </p>
        </div>

        {/* Banner de Especificación Magistral F1 & Regulador de pH */}
        <div className="card card-agro p-4 mb-4 shadow-sm border-success border-opacity-50 bg-light">
          <div className="row g-4 align-items-center">
            <div className="col-12 col-lg-8">
              <div className="d-flex align-items-center gap-2 text-xs text-success fw-bold text-uppercase mb-1">
                <span className="material-symbols-outlined ms-sm">workspace_premium</span>
                <span>Objetivo Comercial: Fruto Primera Selección Jumbo</span>
              </div>
              <h3 className="h4 fw-bold text-dark mb-2">
                Híbrido Magistral F1: Pared Celular de 8–10 mm y 4 Lóbulos Definidos
              </h3>
              <p className="text-secondary small mb-0">
                La genética de <strong>Magistral F1</strong> exige una disponibilidad continua de Calcio soluble (CaO) y Potasio sin cloruros (K₂O) en relación 1:2.8. Para que el fruto supere los 220–250 gramos sin rajado ni podredumbre apical ("culillo"), es <strong>estrictamente indispensable inyectar Regulador de pH (Ácido Nítrico 60%)</strong> en cada riego, neutralizando la alcalinidad del pozo y desbloqueando los nutrientes.
              </p>
            </div>
            <div className="col-12 col-lg-4 text-lg-end">
              <div className="p-3 bg-white rounded-3 border border-success border-opacity-50 shadow-xs text-center">
                <div className="text-secondary text-xs text-uppercase fw-semibold">Garantía de Calibre</div>
                <div className="display-6 fw-bold font-mono text-success">88%</div>
                <div className="text-secondary text-xs font-monospace">Pimentones Grandes (&gt;220g)</div>
              </div>
            </div>
          </div>
        </div>

        {/* CLASIFICACIÓN DE MERCADO DE LA CESTA EN VENEZUELA: GRANDE, MEDIANO Y MARAÑA */}
        <div className="card card-agro p-3 p-md-4 mb-5 shadow-sm border-2 border-primary border-opacity-25 bg-white">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3 pb-2 border-bottom border-secondary-subtle">
            <div className="d-flex align-items-center gap-2">
              <span className="material-symbols-outlined text-primary fs-5">shopping_basket</span>
              <h3 className="h6 fw-bold text-dark text-uppercase mb-0">
                Sistema de Pago al Productor en Venezuela: Las 3 Categorías de Cesta (20 kg)
              </h3>
            </div>
            <span className="badge bg-primary bg-opacity-10 text-primary text-xs font-sans px-3 py-1.5 rounded-pill fw-semibold">
              Mercado Mayorista Quíbor · Mercabar · Coche
            </span>
          </div>

          <p className="text-secondary text-xs mb-3">
            En Venezuela, el pimentón se liquida al productor según la clasificación de la cesta en tres calibres: <strong>Grande</strong>, <strong>Mediano</strong> y el descarte o <strong>"Maraña"</strong>. La rentabilidad real depende exclusivamente de concentrar la cosecha en Pimentón Grande y erradicar la maraña.
          </p>

          <div className="row g-3">
            {/* 1. Pimentón Grande */}
            <div className="col-12 col-md-4">
              <div className="p-3 rounded-3 border-2 border-success bg-agro-success-soft shadow-xs h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="badge bg-success text-white text-xs text-uppercase fw-bold px-2 py-0.5">
                      1. Pimentón Grande (Primera)
                    </span>
                    <span className="material-symbols-outlined text-success fs-6">star</span>
                  </div>
                  <div className="fs-3 fw-bold font-mono text-success my-1">
                    $14.00 USD <span className="fs-6 fw-normal text-secondary font-sans">/ cesta</span>
                  </div>
                  <div className="text-2xs text-secondary font-mono mb-2">($0.70 USD / kg · Calibre &gt;220g)</div>
                  <div className="text-xs text-dark">
                    Frutos tipo bloque de 4 lóbulos, pared carnosa de 8–10 mm, color intenso y máxima firmeza en transporte.
                  </div>
                </div>
                <div className="mt-3 pt-2 border-top border-success border-opacity-25">
                  <div className="text-xs text-success fw-bold d-flex align-items-center gap-1">
                    <span className="material-symbols-outlined fs-6">check_circle</span>
                    <span>Meta Plan AIFA: 88% de la cosecha</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Pimentón Mediano */}
            <div className="col-12 col-md-4">
              <div className="p-3 rounded-3 border border-secondary-subtle bg-white shadow-xs h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="badge bg-secondary text-white text-xs text-uppercase fw-bold px-2 py-0.5">
                      2. Pimentón Mediano (Segunda)
                    </span>
                    <span className="material-symbols-outlined text-secondary fs-6">remove</span>
                  </div>
                  <div className="fs-3 fw-bold font-mono text-dark my-1">
                    $8.00 USD <span className="fs-6 fw-normal text-secondary font-sans">/ cesta</span>
                  </div>
                  <div className="text-2xs text-secondary font-mono mb-2">($0.40 USD / kg · Calibre 140–180g)</div>
                  <div className="text-xs text-secondary">
                    Frutos de 3 lóbulos o ligeramente alargados, pared más delgada (4–5 mm) y menor aguante postcosecha.
                  </div>
                </div>
                <div className="mt-3 pt-2 border-top border-secondary-subtle">
                  <div className="text-xs text-secondary d-flex align-items-center gap-1">
                    <span>Plan AIFA: Solo 12% · Granulado: 45%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Pimentón Pequeño / Maraña */}
            <div className="col-12 col-md-4">
              <div className="p-3 rounded-3 border-2 border-danger border-opacity-50 bg-agro-danger-soft shadow-xs h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="badge bg-danger text-white text-xs text-uppercase fw-bold px-2 py-0.5">
                      3. Pequeño / "Maraña" (Descarte)
                    </span>
                    <span className="material-symbols-outlined text-danger fs-6">warning</span>
                  </div>
                  <div className="fs-3 fw-bold font-mono text-danger my-1">
                    $3.50 USD <span className="fs-6 fw-normal text-secondary font-sans">/ cesta</span>
                  </div>
                  <div className="text-2xs text-danger font-mono mb-2">($0.17 USD / kg · Calibre &lt;120g o Deforme)</div>
                  <div className="text-xs text-dark">
                    Frutos arrugados, con culillo negro por agua salina o picados por trips/ácaros. A veces ni paga el flete.
                  </div>
                </div>
                <div className="mt-3 pt-2 border-top border-danger border-opacity-25">
                  <div className="text-xs text-danger fw-bold d-flex align-items-center gap-1">
                    <span className="material-symbols-outlined fs-6">do_not_disturb_on</span>
                    <span>Plan AIFA: 0% (ERRADICADA) · Granulado: 30%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-light rounded-2 border border-secondary-subtle mt-3 text-xs text-dark d-flex align-items-center gap-2">
            <span className="material-symbols-outlined text-success fs-5">tips_and_updates</span>
            <div>
              <strong>Objetivo Agronómico Supremo:</strong> Con el Plan AIFA + Semilla Magistral F1 en Casa de Malla, <strong>eliminamos la Maraña al 100%</strong> y concentramos los nutrientes para cosechar casi exclusivamente Cestas Grandes a <strong>$14.0 USD</strong>.
            </div>
          </div>
        </div>

        {/* Grilla de Tanques de Fertirriego */}
        <div className="row g-4 mb-5">
          {/* Tanque A: Calcio y Hierro */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card card-agro p-3 h-100 shadow-sm border-success border-opacity-25 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="badge bg-success bg-opacity-10 text-success text-xs font-mono">TANQUE A · 1.000 L</span>
                  <span className="material-symbols-outlined text-success ms-md">shield</span>
                </div>
                <h4 className="fs-6 fw-bold text-dark mb-1">Nitrato de Calcio AIFA</h4>
                <div className="fs-4 fw-bold font-mono text-success mb-2">12 sacos <span className="fs-6 fw-normal text-secondary font-sans">(300 kg)</span></div>

                <ul className="list-unstyled text-secondary text-xs d-flex flex-column gap-1.5 mb-3 font-monospace">
                  <li className="d-flex justify-content-between border-bottom border-secondary-subtle pb-1">
                    <span>Nitrato Calcio (15.5-0-0 + 26 CaO):</span>
                    <strong className="text-dark">$360 USD</strong>
                  </li>
                  <li className="d-flex justify-content-between border-bottom border-secondary-subtle pb-1">
                    <span>Quelato de Hierro EDDHA 6%:</span>
                    <strong className="text-dark">$140 USD</strong>
                  </li>
                  <li className="d-flex justify-content-between pb-1">
                    <span>Subtotal Tanque A:</span>
                    <strong className="text-success">$500 USD</strong>
                  </li>
                </ul>
              </div>
              <div className="text-xs text-secondary bg-light p-2 rounded-2 border border-secondary-subtle">
                <strong className="text-dark font-sans">Efecto en Fruto:</strong> Pared celular gruesa de 8–10 mm, cero culillo negro y máxima resistencia al transporte en cesta.
              </div>
            </div>
          </div>

          {/* Tanque B: NPK Soluble y Sulfato de Magnesio */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card card-agro p-3 h-100 shadow-sm border-success border-opacity-25 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="badge bg-primary bg-opacity-10 text-primary text-xs font-mono">TANQUE B · 1.000 L</span>
                  <span className="material-symbols-outlined text-primary ms-md">biotech</span>
                </div>
                <h4 className="fs-6 fw-bold text-dark mb-1">NPK Soluble + Magnesio</h4>
                <div className="fs-4 fw-bold font-mono text-primary mb-2">18 sacos <span className="fs-6 fw-normal text-secondary font-sans">(450 kg)</span></div>

                <ul className="list-unstyled text-secondary text-xs d-flex flex-column gap-1.5 mb-3 font-monospace">
                  <li className="d-flex justify-content-between border-bottom border-secondary-subtle pb-1">
                    <span>Nitrato de Potasio 13-0-46 AIFA:</span>
                    <strong className="text-dark">$460 USD</strong>
                  </li>
                  <li className="d-flex justify-content-between border-bottom border-secondary-subtle pb-1">
                    <span>Fosfato Monopotásico 0-52-34:</span>
                    <strong className="text-dark">$260 USD</strong>
                  </li>
                  <li className="d-flex justify-content-between border-bottom border-secondary-subtle pb-1">
                    <span>Sulfato de Magnesio Hepta AIFA:</span>
                    <strong className="text-dark">$160 USD</strong>
                  </li>
                  <li className="d-flex justify-content-between pb-1">
                    <span>Subtotal Tanque B:</span>
                    <strong className="text-primary">$880 USD</strong>
                  </li>
                </ul>
              </div>
              <div className="text-xs text-secondary bg-light p-2 rounded-2 border border-secondary-subtle">
                <strong className="text-dark font-sans">Efecto en Fruto:</strong> Llenado acelerado de 4 lóbulos, peso superior a 220g y brillo ceroso de primera exportación.
              </div>
            </div>
          </div>

          {/* Tanque C: Regulador de pH (Ácido Nítrico) */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card card-agro p-3 h-100 shadow-sm border-warning border-opacity-50 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="badge bg-warning bg-opacity-25 text-warning-emphasis text-xs font-mono">TANQUE C · REGULADOR</span>
                  <span className="material-symbols-outlined text-warning ms-md">tune</span>
                </div>
                <h4 className="fs-6 fw-bold text-dark mb-1">Regulador de pH (Ácido Nítrico)</h4>
                <div className="fs-4 fw-bold font-mono text-warning-emphasis mb-2">224 Litros <span className="fs-6 fw-normal text-secondary font-sans">(60%)</span></div>

                <ul className="list-unstyled text-secondary text-xs d-flex flex-column gap-1.5 mb-3 font-monospace">
                  <li className="d-flex justify-content-between border-bottom border-secondary-subtle pb-1">
                    <span>Consumo en 20 semanas:</span>
                    <strong className="text-dark">224 L</strong>
                  </li>
                  <li className="d-flex justify-content-between border-bottom border-secondary-subtle pb-1">
                    <span>Costo Unitario ($0.98/L):</span>
                    <strong className="text-dark">$220 USD</strong>
                  </li>
                  <li className="d-flex justify-content-between border-bottom border-secondary-subtle pb-1">
                    <span>pH Meta de Riego:</span>
                    <strong className="text-success">5.8 – 6.2</strong>
                  </li>
                  <li className="d-flex justify-content-between pb-1">
                    <span>Protección Goteros:</span>
                    <strong className="text-primary">100% Antisarro</strong>
                  </li>
                </ul>
              </div>
              <div className="text-xs text-secondary bg-light p-2 rounded-2 border border-secondary-subtle">
                <strong className="text-dark font-sans">Indispensable en Quíbor:</strong> Neutraliza carbonatos del pozo (pH 8.0), permitiendo que la planta absorba el 100% del Calcio.
              </div>
            </div>
          </div>

          {/* Inversión en Semilla Magistral F1 */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card card-agro p-3 h-100 shadow-sm border-primary border-opacity-25 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="badge bg-info bg-opacity-10 text-info-emphasis text-xs font-mono">GENÉTICA ÉLITE</span>
                  <span className="material-symbols-outlined text-primary ms-md">psychiatry</span>
                </div>
                <h4 className="fs-6 fw-bold text-dark mb-1">Semilla Magistral F1</h4>
                <div className="fs-4 fw-bold font-mono text-primary mb-2">3.000 <span className="fs-6 fw-normal text-secondary font-sans">semillas</span></div>

                <ul className="list-unstyled text-secondary text-xs d-flex flex-column gap-1.5 mb-3 font-monospace">
                  <li className="d-flex justify-content-between border-bottom border-secondary-subtle pb-1">
                    <span>3 Sobres × 1.000 sem:</span>
                    <strong className="text-dark">$450 USD</strong>
                  </li>
                  <li className="d-flex justify-content-between border-bottom border-secondary-subtle pb-1">
                    <span>Bandejas 128 + Peat Moss:</span>
                    <strong className="text-dark">$150 USD</strong>
                  </li>
                  <li className="d-flex justify-content-between border-bottom border-secondary-subtle pb-1">
                    <span>Total Inversión Semillero:</span>
                    <strong className="text-primary">$600 USD</strong>
                  </li>
                  <li className="d-flex justify-content-between pb-1">
                    <span>Población Campo Lista:</span>
                    <strong className="text-success">2.500 plantas</strong>
                  </li>
                </ul>
              </div>
              <div className="text-xs text-secondary bg-light p-2 rounded-2 border border-secondary-subtle">
                <strong className="text-dark font-sans">Potencial Genético:</strong> Híbrido líder en Quíbor por resistencia a virus, vigor radicular y frutos cuadrados tipo blocky pesados.
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN PRINCIPAL: Matriz de Rentabilidad Mejorada (Agri-UX) */}
        <div className="card card-agro p-3 p-md-4 shadow-sm border-success border-opacity-50">
          {/* Cabecera Interactiva con Selector de Vista */}
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4 pb-3 border-bottom border-secondary-subtle">
            <div>
              <div className="d-flex align-items-center gap-2 text-xs text-success fw-bold text-uppercase mb-1">
                <span className="material-symbols-outlined ms-sm">analytics</span>
                <span>Análisis Económico Comparativo · 2.500 Plantas en 1.000 m² (Ciclo 20 Semanas)</span>
              </div>
              <h3 className="h4 fw-bold text-dark mb-1">
                Matriz de Rentabilidad: <span className="text-secondary fw-normal">Fertilizante Granulado</span> vs <span className="text-success">Plan AIFA + Semilla Magistral F1</span>
              </h3>
              <p className="text-secondary text-xs mb-0">
                Comparativa real en Quíbor según clasificación venezolana: <strong>Cesta Grande ($14 USD)</strong>, <strong>Mediana ($8 USD)</strong> y <strong>Maraña ($3.5 USD)</strong>.
              </p>
            </div>

            {/* Selector de Modos: Visual Cara a Cara vs Tabla Detallada */}
            <div className="d-flex flex-wrap align-items-center gap-2">
              <div className="btn-group p-1 bg-light rounded-pill border border-secondary-subtle shadow-2xs" role="group">
                <button
                  type="button"
                  onClick={() => setMatrixView('visual')}
                  className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold d-inline-flex align-items-center gap-1.5 transition-all ${
                    matrixView === 'visual'
                      ? 'btn-success text-white shadow-xs'
                      : 'btn-light text-secondary hover-text-dark'
                  }`}
                >
                  <span className="material-symbols-outlined fs-6">compare_arrows</span>
                  <span>Comparativa Cara a Cara</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMatrixView('tabla')}
                  className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold d-inline-flex align-items-center gap-1.5 transition-all ${
                    matrixView === 'tabla'
                      ? 'btn-success text-white shadow-xs'
                      : 'btn-light text-secondary hover-text-dark'
                  }`}
                >
                  <span className="material-symbols-outlined fs-6">table_chart</span>
                  <span>Tabla Detallada</span>
                </button>
              </div>

              <span className="badge bg-success bg-opacity-25 text-success rounded-pill font-mono px-3 py-2 fs-6">
                Retorno: $3.19 x $1.00
              </span>
            </div>
          </div>

          {/* 3 Tarjetas de Resumen Ejecutivo (Escaneo Visual Inmediato en 3 Segundos) */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-4">
              <div className="p-3 bg-white rounded-3 border border-secondary-subtle h-100 shadow-2xs">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="text-secondary text-xs text-uppercase fw-bold">1. Inversión Extra en Insumos</span>
                  <span className="badge bg-secondary text-white font-mono">+$1.260 USD</span>
                </div>
                <div className="fs-3 fw-bold font-mono text-dark mb-1">
                  $2.740 <span className="fs-6 fw-normal text-secondary font-sans">vs $1.480 granulado</span>
                </div>
                <div className="text-xs text-secondary font-sans">
                  Semilla Magistral F1 ($600) + Fertirriego AIFA ($1.380) + Ácido Nítrico ($220).
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="p-3 bg-white rounded-3 border border-secondary-subtle h-100 shadow-2xs">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="text-secondary text-xs text-uppercase fw-bold">2. Calidad de Cesta &amp; Maraña</span>
                  <span className="badge bg-success text-white font-mono">0% MARAÑA</span>
                </div>
                <div className="d-flex align-items-baseline gap-2 mb-1">
                  <span className="fs-3 fw-bold font-mono text-success">88%</span>
                  <span className="text-secondary text-xs">Cestas Grande ($14/cesta)</span>
                </div>
                <div className="text-xs text-secondary font-sans">
                  <strong>650 cestas totales (+53%)</strong> · Granulado sufre 30% en Maraña ($3.50/cesta).
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="p-3 bg-agro-success-soft rounded-3 border-2 border-success border-opacity-50 h-100 shadow-2xs">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="text-success text-xs text-uppercase fw-black">3. Dinero Neto Libre en Mano</span>
                  <span className="badge bg-success text-white font-mono">+171% GANANCIA</span>
                </div>
                <div className="d-flex align-items-baseline gap-2 mb-1">
                  <span className="fs-3 fw-bold font-mono text-success">+$4.015</span>
                  <span className="text-success fw-bold text-xs">USD NETOS LIBRES</span>
                </div>
                <div className="text-xs text-dark font-sans fw-medium">
                  <strong>$6.360 USD</strong> AIFA vs <strong>$2.345 USD</strong> granulado (2.7 veces más ganancia).
                </div>
              </div>
            </div>
          </div>

          {/* VISTA 1: COMPARATIVA VISUAL CARA A CARA (Ultra Entendible para Productores e Inversionistas) */}
          {matrixView === 'visual' && (
            <div className="animate-fade-in">
              <div className="row g-4 mb-4">
                {/* Columna 1: Manejo Tradicional con Granulado */}
                <div className="col-12 col-lg-6">
                  <div className="h-100 p-4 rounded-3 border border-secondary-subtle bg-white shadow-2xs d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="badge bg-secondary bg-opacity-25 text-secondary text-xs text-uppercase fw-bold px-2.5 py-1">
                          Práctica Común en Quíbor
                        </span>
                        <span className="material-symbols-outlined text-secondary">trending_down</span>
                      </div>
                      <h4 className="h5 fw-bold text-dark mb-1">Manejo Tradicional (Granulado)</h4>
                      <p className="text-secondary text-xs mb-3">
                        Abono granulado al suelo, semilla genérica y sin control de pH. Alto volumen de fruta abortada.
                      </p>

                      <div className="d-flex flex-column gap-3 mb-4">
                        {/* Cosecha y Clasificación */}
                        <div className="p-3 rounded-2 bg-light border border-secondary-subtle">
                          <div className="text-secondary text-xs fw-semibold mb-1">🌾 Volumen Cosechado &amp; Clasificación</div>
                          <div className="d-flex align-items-baseline gap-2 mb-2">
                            <span className="fs-4 fw-bold font-mono text-dark">425 cestas</span>
                            <span className="text-secondary text-xs">(8.500 kg · 3.40 kg/planta)</span>
                          </div>

                          {/* Desglose de Cestas */}
                          <div className="d-flex flex-column gap-1.5 text-2xs font-sans">
                            <div className="d-flex justify-content-between align-items-center p-1.5 bg-white rounded border border-secondary-subtle">
                              <span>🟢 Grande (&gt;220g): <strong>25%</strong> (106 cestas @ $14)</span>
                              <span className="font-mono fw-bold text-dark">$1.484</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center p-1.5 bg-white rounded border border-secondary-subtle">
                              <span>🟡 Mediano (140-180g): <strong>45%</strong> (191 cestas @ $8)</span>
                              <span className="font-mono fw-bold text-dark">$1.528</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center p-1.5 bg-danger bg-opacity-10 rounded border border-danger border-opacity-25">
                              <span className="text-danger fw-bold">🔴 Maraña (&lt;120g): 30% (128 cestas @ $3.5)</span>
                              <span className="font-mono fw-bold text-danger">$448</span>
                            </div>
                          </div>
                        </div>

                        {/* Facturación Ponderada */}
                        <div className="p-3 rounded-2 bg-light border border-secondary-subtle">
                          <div className="text-secondary text-xs fw-semibold mb-1">💵 Facturación Real en Finca</div>
                          <div className="d-flex align-items-baseline justify-content-between">
                            <div>
                              <span className="fs-5 fw-bold font-mono text-dark">$9.00 USD</span>
                              <span className="text-secondary text-xs font-sans"> / cesta prom.</span>
                            </div>
                            <div className="text-end">
                              <div className="text-2xs text-secondary">Ingreso Bruto Total:</div>
                              <div className="fs-5 fw-bold font-mono text-dark">$3.825 USD</div>
                            </div>
                          </div>
                          <div className="text-2xs text-danger mt-1">
                            *El 30% de fruta en "Maraña" desploma el valor promedio de la cosecha.
                          </div>
                        </div>

                        {/* Costo Insumos */}
                        <div className="p-3 rounded-2 bg-light border border-secondary-subtle">
                          <div className="d-flex justify-content-between align-items-center text-xs">
                            <span className="text-secondary fw-semibold">🧪 Costo en Insumos:</span>
                            <strong className="font-mono text-dark fs-6">$1.480 USD</strong>
                          </div>
                          <div className="text-2xs text-secondary mt-1">
                            Semilla común ($180) + Abono granulado ($820) + Sin ácido ($0) + Químicos ($480).
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Resultado Neto Granulado */}
                    <div className="p-3 rounded-3 bg-secondary bg-opacity-10 border border-secondary border-opacity-25 text-center">
                      <div className="text-secondary text-xs text-uppercase fw-bold mb-1">
                        Dinero Libre en Mano (Margen Neto)
                      </div>
                      <div className="fs-2 fw-black font-mono text-secondary mb-1">
                        $2.345 USD
                      </div>
                      <div className="text-2xs text-secondary">
                        Ingreso $3.825 - Insumos $1.480 = $2.345 libres
                      </div>
                      <div className="text-2xs text-danger mt-2 pt-2 border-top border-secondary-subtle">
                        ⚠️ 128 cestas perdidas en Maraña y goteros tapados por agua de pozo sin tratar.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Columna 2: Plan AIFA + Semilla Magistral F1 */}
                <div className="col-12 col-lg-6">
                  <div className="h-100 p-4 rounded-3 border-2 border-success bg-white shadow-sm d-flex flex-column justify-content-between position-relative">
                    <span className="position-absolute top-0 end-0 translate-middle-y me-3 badge bg-success text-white px-3 py-1.5 rounded-pill shadow-xs text-xs font-sans fw-bold">
                      RECOMENDADO · CERO MARAÑA
                    </span>

                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="badge bg-success bg-opacity-10 text-success text-xs text-uppercase fw-bold px-2.5 py-1">
                          Solución Técnica Óptima
                        </span>
                        <span className="material-symbols-outlined text-success">verified</span>
                      </div>
                      <h4 className="h5 fw-bold text-success mb-1">Plan AIFA + Semilla Magistral F1</h4>
                      <p className="text-secondary text-xs mb-3">
                        Nutrición de precisión soluble, pH a 5.8 y genética diseñada para producir <strong>solo Pimentón Grande</strong>.
                      </p>

                      <div className="d-flex flex-column gap-3 mb-4">
                        {/* Cosecha y Clasificación */}
                        <div className="p-3 rounded-2 bg-agro-success-soft border border-success border-opacity-50 shadow-2xs">
                          <div className="text-success text-xs fw-semibold mb-1">🌾 Volumen Cosechado &amp; Clasificación</div>
                          <div className="d-flex align-items-baseline gap-2 mb-2">
                            <span className="fs-4 fw-bold font-mono text-success">650 cestas</span>
                            <span className="text-success fw-bold text-xs">(13.000 kg · 5.20 kg/planta)</span>
                          </div>

                          {/* Desglose de Cestas */}
                          <div className="d-flex flex-column gap-1.5 text-2xs font-sans">
                            <div className="d-flex justify-content-between align-items-center p-1.5 bg-white rounded border border-success border-opacity-50 shadow-2xs">
                              <span className="text-success fw-bold">🟢 Grande (&gt;220g): 88% (572 cestas @ $14)</span>
                              <span className="font-mono fw-bold text-success">$8.008</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center p-1.5 bg-white rounded border border-secondary-subtle shadow-2xs">
                              <span>🟡 Mediano (140-180g): <strong>12%</strong> (78 cestas @ $8.5)</span>
                              <span className="font-mono fw-bold text-dark">$663</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center p-1.5 bg-white rounded border border-success border-opacity-50 shadow-2xs">
                              <span className="text-success fw-bold">✨ Maraña (&lt;120g): 0% (ERRADICADA AL 100%)</span>
                              <span className="font-mono fw-bold text-success">$0 (Cero pérdida)</span>
                            </div>
                          </div>
                        </div>

                        {/* Facturación Ponderada */}
                        <div className="p-3 rounded-2 bg-agro-success-soft border border-success border-opacity-50 shadow-2xs">
                          <div className="text-success text-xs fw-semibold mb-1">💵 Facturación Real en Finca</div>
                          <div className="d-flex align-items-baseline justify-content-between">
                            <div>
                              <span className="fs-5 fw-bold font-mono text-success">$14.00 USD</span>
                              <span className="text-secondary text-xs font-sans"> / cesta prom.</span>
                            </div>
                            <div className="text-end">
                              <div className="text-2xs text-secondary">Ingreso Bruto Total:</div>
                              <div className="fs-5 fw-bold font-mono text-success">$9.100 USD</div>
                            </div>
                          </div>
                          <div className="text-2xs text-success mt-1">
                            *Al erradicar la maraña, cada cesta sale al camión con cotización de primera.
                          </div>
                        </div>

                        {/* Costo Insumos */}
                        <div className="p-3 rounded-2 bg-agro-success-soft border border-success border-opacity-50 shadow-2xs">
                          <div className="d-flex justify-content-between align-items-center text-xs">
                            <span className="text-secondary fw-semibold">🧪 Inversión en Insumos:</span>
                            <strong className="font-mono text-success fs-6">$2.740 USD</strong>
                          </div>
                          <div className="text-2xs text-secondary mt-1">
                            Magistral F1 ($600) + AIFA Soluble ($1.380) + Ácido Nítrico ($220) + Fitosanitario ($540).
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Resultado Neto AIFA */}
                    <div className="p-3 rounded-3 bg-success text-white text-center shadow-xs">
                      <div className="text-white text-opacity-90 text-xs text-uppercase fw-bold mb-1">
                        Dinero Libre en Mano (Margen Neto)
                      </div>
                      <div className="fs-2 fw-black font-mono text-white mb-1">
                        $6.360 USD
                      </div>
                      <div className="text-2xs text-white text-opacity-90 font-sans">
                        Ingreso $9.100 - Insumos $2.740 = <strong>$6.360 USD netos libres</strong>
                      </div>
                      <div className="text-2xs text-white text-opacity-90 mt-2 pt-2 border-top border-white border-opacity-25">
                        ✅ Cero cestas de Maraña, 100% de nutrición asimilada y máxima rentabilidad.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Banner Central de Ganancia Neta Extra */}
              <div className="p-3 p-md-4 rounded-3 bg-agro-success-soft border-2 border-success border-opacity-50 text-center mb-4 shadow-2xs">
                <div className="row align-items-center g-3">
                  <div className="col-12 col-md-4 text-md-start">
                    <div className="text-xs text-secondary text-uppercase fw-bold">Inversión Adicional Requerida</div>
                    <div className="fs-4 fw-bold font-mono text-dark">+$1.260 USD</div>
                    <div className="text-2xs text-secondary">Semilla élite + Fertirriego AIFA + Regulador pH</div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="badge bg-success text-white text-xs px-3 py-1.5 rounded-pill mb-1">
                      BENEFICIO NETO DIRECTO
                    </div>
                    <div className="display-6 fw-black font-mono text-success">
                      +$4.015 USD
                    </div>
                    <div className="text-xs fw-bold text-success">
                      Más Ganancia Neta Libre en el Bolsillo (+171%)
                    </div>
                  </div>
                  <div className="col-12 col-md-4 text-md-end">
                    <div className="text-xs text-secondary text-uppercase fw-bold">Retorno sobre Inversión Extra</div>
                    <div className="fs-4 fw-bold font-mono text-success">3.19 : 1</div>
                    <div className="text-2xs text-secondary">Recuperas $3.19 USD netos por cada $1.00 adicional</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VISTA 2: TABLA DETALLADA PASO A PASO (Para Auditoría Agronómica y Financiera) */}
          {matrixView === 'tabla' && (
            <div className="table-responsive animate-fade-in mb-4">
              <table className="table table-bordered table-hover align-middle small mb-0">
                <thead>
                  <tr className="text-center align-middle">
                    <th className="bg-light text-start text-dark fw-bold py-3" style={{ width: '34%' }}>
                      Variable / Concepto Analizado
                    </th>
                    <th className="bg-agro-success-soft text-success fw-bold border-success py-3" style={{ width: '26%' }}>
                      <div className="d-inline-flex align-items-center gap-1">
                        <span className="material-symbols-outlined ms-sm">verified</span>
                        <span>Plan AIFA + Semilla Magistral</span>
                      </div>
                      <div className="badge bg-success text-white text-xs mt-1">Recomendado · Cero Maraña</div>
                    </th>
                    <th className="bg-light text-secondary fw-bold py-3" style={{ width: '22%' }}>
                      <div>Manejo con Granulado</div>
                      <div className="badge bg-secondary bg-opacity-25 text-secondary text-xs mt-1">Convencional Edáfico</div>
                    </th>
                    <th className="bg-light text-success fw-bold py-3" style={{ width: '18%' }}>
                      Ventaja para el Productor
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* SECCIÓN 1: RENDIMIENTO AGRONÓMICO & CALIDAD */}
                  <tr className="table-light">
                    <td colSpan={4} className="fw-bold text-dark text-uppercase py-2 px-3 bg-secondary bg-opacity-10">
                      <span className="d-flex align-items-center gap-1.5 text-xs text-dark">
                        <span className="material-symbols-outlined ms-sm text-success">agriculture</span>
                        <span>1. Rendimiento Físico &amp; Calidad de Fruto (2.500 Plantas en 1.000 m²)</span>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-dark fw-semibold">
                      <div>Genética &amp; Potencial Fisiológico</div>
                      <div className="text-secondary text-xs fw-normal">Vigor híbrido, resistencia viral y carga frutal</div>
                    </td>
                    <td className="text-success fw-bold">
                      <div>Magistral F1 Certificado</div>
                      <div className="text-secondary text-xs fw-normal">Pared gruesa de 8–10 mm, 4 lóbulos definidos</div>
                    </td>
                    <td className="text-secondary">
                      <div>Semilla común / convencional</div>
                      <div className="text-muted text-xs">Pared delgada (4–5 mm), fruto desparejo</div>
                    </td>
                    <td className="text-success">
                      <span className="badge bg-success bg-opacity-10 text-success">Firmeza &amp; Larga Vida</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-dark fw-semibold">
                      <div>Cestas de Pimentón Grande (&gt;220g)</div>
                      <div className="text-secondary text-xs fw-normal">Calibre Jumbo cotizado a $14.00 USD / cesta</div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="progress flex-grow-1" style={{ height: '8px' }}>
                          <div className="progress-bar bg-success" style={{ width: '88%' }}></div>
                        </div>
                        <strong className="text-success font-mono fs-6">88% (572 cestas)</strong>
                      </div>
                      <div className="text-secondary text-xs">Calibre Jumbo garantizado</div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="progress flex-grow-1" style={{ height: '8px' }}>
                          <div className="progress-bar bg-secondary" style={{ width: '25%' }}></div>
                        </div>
                        <span className="text-danger font-mono fw-bold">25% (106 cestas)</span>
                      </div>
                      <div className="text-secondary text-xs">Poca fruta de primera</div>
                    </td>
                    <td className="text-success">
                      <strong className="text-success">+466 Cestas Grandes</strong>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-dark fw-semibold">
                      <div>Cestas de Fruto Pequeño / "Maraña"</div>
                      <div className="text-secondary text-xs fw-normal">Fruto deforme o culillo cotizado a castigo ($3.50 USD)</div>
                    </td>
                    <td className="text-success fw-bold">
                      <span className="badge bg-success text-white font-mono px-2 py-1">0% (0 cestas)</span>
                      <div className="text-secondary text-xs mt-1">Maraña totalmente erradicada</div>
                    </td>
                    <td className="text-danger fw-bold">
                      <span className="badge bg-danger text-white font-mono px-2 py-1">30% (128 cestas)</span>
                      <div className="text-muted text-xs mt-1">Pérdida severa en flete y mano de obra</div>
                    </td>
                    <td className="text-success">
                      <strong className="text-success">Cero Descarte</strong>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-dark fw-semibold">
                      <div>Cosecha Total en 20 Semanas</div>
                      <div className="text-secondary text-xs fw-normal">Volumen comercializable acumulado</div>
                    </td>
                    <td className="text-success fw-bold">
                      <div className="font-mono fs-6">650 cestas (13.0 Ton)</div>
                      <div className="text-secondary text-xs">5.20 kg / planta promedio</div>
                    </td>
                    <td className="text-secondary">
                      <div className="font-mono">425 cestas (8.5 Ton)</div>
                      <div className="text-muted text-xs">3.40 kg / planta promedio</div>
                    </td>
                    <td className="text-success">
                      <strong className="text-success">+225 cestas (+53%)</strong>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-dark fw-semibold">
                      <div>Regulación de pH &amp; Goteros</div>
                      <div className="text-secondary text-xs fw-normal">Protección contra aguas alcalinas de pozo en Quíbor</div>
                    </td>
                    <td className="text-success">
                      <div>Ácido Nítrico 60% (Tanque C)</div>
                      <div className="text-secondary text-xs">pH 5.8–6.2 estable · Goteros 100% limpios</div>
                    </td>
                    <td className="text-danger">
                      <div>Sin regulación de pH</div>
                      <div className="text-muted text-xs">pH 8.0 alcalino · Caliza tapa goteros</div>
                    </td>
                    <td className="text-success">
                      <span className="badge bg-success bg-opacity-10 text-success">Cero Bloqueo de Calcio</span>
                    </td>
                  </tr>

                  {/* SECCIÓN 2: COMERCIALIZACIÓN & FACTURACIÓN */}
                  <tr className="table-light">
                    <td colSpan={4} className="fw-bold text-dark text-uppercase py-2 px-3 bg-secondary bg-opacity-10">
                      <span className="d-flex align-items-center gap-1.5 text-xs text-dark">
                        <span className="material-symbols-outlined ms-sm text-success">payments</span>
                        <span>2. Comercialización &amp; Facturación en Puerta de Finca</span>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-dark fw-semibold">
                      <div>Precio Promedio Ponderado por Cesta</div>
                      <div className="text-secondary text-xs fw-normal">Liquidación final del camión según clasificación de cestas</div>
                    </td>
                    <td className="text-dark fw-bold">
                      <span className="fs-6 font-mono text-success">$14.00 USD</span> <span className="text-secondary text-xs">($0.70 / kg)</span>
                    </td>
                    <td className="text-secondary">
                      <span className="font-mono text-muted">$9.00 USD</span> <span className="text-secondary text-xs">($0.45 / kg - castigado por maraña)</span>
                    </td>
                    <td className="text-success">
                      <strong className="text-success">+$5.00 / cesta (+56%)</strong>
                    </td>
                  </tr>
                  <tr className="table-light border-2 border-dark border-opacity-10">
                    <td className="text-dark fw-bold">
                      <div>INGRESO BRUTO DE COSECHA</div>
                      <div className="text-secondary text-xs fw-normal">(Cestas cosechadas × Precio ponderado en puerta)</div>
                    </td>
                    <td className="text-success fw-bold font-mono fs-5">
                      $9.100 USD
                    </td>
                    <td className="text-secondary font-mono fs-6">
                      $3.825 USD
                    </td>
                    <td className="text-success fw-bold fs-6">
                      +$5.275 USD (+138%)
                    </td>
                  </tr>

                  {/* SECCIÓN 3: COSTO DE INSUMOS */}
                  <tr className="table-light">
                    <td colSpan={4} className="fw-bold text-dark text-uppercase py-2 px-3 bg-secondary bg-opacity-10">
                      <span className="d-flex align-items-center gap-1.5 text-xs text-dark">
                        <span className="material-symbols-outlined ms-sm text-success">inventory_2</span>
                        <span>3. Gasto Operativo en Insumos del Ciclo (20 Semanas)</span>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-secondary ps-4">• Semilla Híbrida + Semillero (3.000 sem)</td>
                    <td className="text-dark font-mono">$600 USD <span className="text-secondary text-xs font-sans">(Magistral F1)</span></td>
                    <td className="text-secondary font-mono">$180 USD <span className="text-secondary text-xs font-sans">(Genérica)</span></td>
                    <td className="text-secondary text-xs">+$420 USD genética élite</td>
                  </tr>
                  <tr>
                    <td className="text-secondary ps-4">• Fertilizantes (20 semanas de nutrición)</td>
                    <td className="text-dark font-mono">$1.380 USD <span className="text-secondary text-xs font-sans">(AIFA soluble A+B)</span></td>
                    <td className="text-secondary font-mono">$820 USD <span className="text-secondary text-xs font-sans">(NPK granulado)</span></td>
                    <td className="text-secondary text-xs">+$560 USD sales solubles</td>
                  </tr>
                  <tr>
                    <td className="text-secondary ps-4">• Regulador de pH (Ácido Nítrico 60% 224L)</td>
                    <td className="text-dark font-mono">$220 USD <span className="text-secondary text-xs font-sans">(Tanque C activo)</span></td>
                    <td className="text-secondary font-mono">$0 USD <span className="text-secondary text-xs font-sans">(Sin tratar)</span></td>
                    <td className="text-secondary text-xs">+$220 USD neutralización sales</td>
                  </tr>
                  <tr>
                    <td className="text-secondary ps-4">• Plan Fitosanitario (Plagas y Hongos)</td>
                    <td className="text-dark font-mono">$540 USD <span className="text-secondary text-xs font-sans">(Trips, ácaros, bio)</span></td>
                    <td className="text-secondary font-mono">$480 USD <span className="text-secondary text-xs font-sans">(Químicos estándar)</span></td>
                    <td className="text-secondary text-xs">+$60 USD control biológico</td>
                  </tr>
                  <tr className="table-secondary">
                    <td className="text-dark fw-bold">
                      COSTO TOTAL DE INSUMOS
                    </td>
                    <td className="text-dark fw-bold font-mono fs-6">
                      $2.740 USD
                    </td>
                    <td className="text-secondary font-mono fs-6">
                      $1.480 USD
                    </td>
                    <td className="text-secondary fw-bold">
                      +$1.260 USD inversión extra
                    </td>
                  </tr>

                  {/* SECCIÓN 4: RESULTADO NETO FINAL */}
                  <tr className="table-success border-top border-3 border-success">
                    <td className="text-dark fw-black py-3">
                      <div className="fs-6 text-success fw-bold text-uppercase d-flex align-items-center gap-1">
                        <span className="material-symbols-outlined text-success ms-sm">savings</span>
                        <span>MARGEN NETO OPERATIVO</span>
                      </div>
                      <div className="text-secondary text-xs fw-normal">
                        (Ingreso Bruto de Venta menos Costo Total de Insumos)
                      </div>
                    </td>
                    <td className="bg-agro-success-soft border-success text-success fw-black font-mono fs-4 text-center py-3">
                      $6.360 USD
                    </td>
                    <td className="text-secondary font-mono fs-5 text-center py-3">
                      $2.345 USD
                    </td>
                    <td className="text-success fw-black text-center py-3">
                      <div className="badge bg-success text-white fs-6 px-2.5 py-1.5 font-mono">
                        +$4.015 USD LIBRES
                      </div>
                      <div className="text-success text-xs mt-1 fw-bold">+171% MÁS GANANCIA</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Callout Explicativo: La Lógica en 3 Pasos Simples */}
          <div className="p-3 p-md-4 bg-light rounded-3 border border-success border-opacity-25">
            <div className="d-flex align-items-center gap-2 mb-3 text-success fw-bold font-sans">
              <span className="material-symbols-outlined ms-sm">lightbulb</span>
              <span className="fs-6">¿Por qué el Plan AIFA + Semilla Magistral F1 deja $4.015 USD más en el bolsillo?</span>
            </div>
            <div className="row g-3 text-xs text-secondary">
              <div className="col-12 col-md-4">
                <div className="p-3 bg-white rounded-2 border border-secondary-subtle h-100 shadow-2xs">
                  <div className="fw-bold text-dark mb-1 d-flex align-items-center gap-1.5">
                    <span className="badge bg-success rounded-circle text-white px-2 py-0.5 font-mono">1</span>
                    <span className="fs-6">Inversión Extra Controlada</span>
                  </div>
                  <div className="text-secondary mt-1">
                    Inviertes <strong>$1.260 USD adicionales</strong> en genética híbrida Magistral F1, sales 100% solubles y Ácido Nítrico para estabilizar el pH a 5.8.
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="p-3 bg-white rounded-2 border border-secondary-subtle h-100 shadow-2xs">
                  <div className="fw-bold text-dark mb-1 d-flex align-items-center gap-1.5">
                    <span className="badge bg-success rounded-circle text-white px-2 py-0.5 font-mono">2</span>
                    <span className="fs-6">Más Kilos y CERO Maraña</span>
                  </div>
                  <div className="text-secondary mt-1">
                    Cosechas <strong>225 cestas más (+53%)</strong> y el <strong>88%</strong> es Cesta Grande Jumbo a <strong>$14 USD/cesta</strong>, erradicando al 100% el descarte de Maraña ($3.50/cesta).
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="p-3 bg-white rounded-2 border border-success border-opacity-50 h-100 shadow-2xs">
                  <div className="fw-bold text-success mb-1 d-flex align-items-center gap-1.5">
                    <span className="badge bg-success rounded-circle text-white px-2 py-0.5 font-mono">3</span>
                    <span className="fs-6">Retorno Neto Limpio</span>
                  </div>
                  <div className="text-secondary mt-1">
                    Facturas <strong>$5.275 USD adicionales</strong>. Tras deducir los insumos extra, te quedan <strong>+$4.015 USD netos libres adicionales</strong> (ganancia 2.7 veces mayor).
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default FertigationPlanSection;
