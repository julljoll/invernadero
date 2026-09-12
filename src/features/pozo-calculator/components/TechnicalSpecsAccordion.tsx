import React from 'react';
import { Accordion, Table, Row, Col } from 'react-bootstrap';

export const TechnicalSpecsAccordion: React.FC = () => {
  return (
    <div className="mb-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <div className="d-flex align-items-center gap-2">
          <span className="material-symbols-outlined text-info fs-4">menu_book</span>
          <h4 className="fs-5 fw-bold text-dark mb-0">
            Fundamentación Técnica &amp; Memoria Hidrogeológica Oficial
          </h4>
        </div>
        <span className="badge bg-agro-info-soft text-info border border-info border-opacity-30 rounded-pill px-3 py-1 font-mono text-xxs">
          Cuara 2026 · Certificación de Fuste
        </span>
      </div>

      <Accordion defaultActiveKey="budget" className="shadow-sm card-cockpit border-0 p-1">
        {/* Item 1: Presupuesto Itemizado */}
        <Accordion.Item eventKey="budget" className="border-0 border-bottom">
          <Accordion.Header>
            <div className="d-flex align-items-center gap-2">
              <span className="material-symbols-outlined text-success fs-5">receipt_long</span>
              <span className="fw-bold">1. Presupuesto Itemizado de Culminación ($4.000 USD Llave en Mano)</span>
              <span className="badge bg-agro-success-soft text-success border border-success border-opacity-30 ms-2 font-mono text-xxs px-2 py-0.5 rounded-pill">
                11 Partidas Certificadas
              </span>
            </div>
          </Accordion.Header>
          <Accordion.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="small mb-0 align-middle">
                <thead className="table-light text-secondary text-xxs text-uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Ítem</th>
                    <th className="py-2.5 px-3">Rubro / Partida</th>
                    <th className="py-2.5 px-3">Descripción Técnica</th>
                    <th className="py-2.5 px-3 text-end">Costo (USD)</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  <tr>
                    <td className="px-3 fw-bold">1.0</td>
                    <td className="px-3 font-sans fw-semibold">Mano de Obra Excavación</td>
                    <td className="px-3 font-sans text-secondary">Cuadrilla de poceros calificados: 10 metros restantes en grava saturada bajo agua (@ $100/m).</td>
                    <td className="px-3 text-end fw-bold text-dark">$1.000.00</td>
                  </tr>
                  <tr className="bg-agro-warning-soft bg-opacity-40">
                    <td className="px-3 fw-bold">2.0</td>
                    <td className="px-3 font-sans fw-semibold text-warning-emphasis">
                      Martillo Eléctrico Industrial
                      <span className="badge bg-agro-warning-soft text-warning-emphasis border border-warning border-opacity-30 ms-1.5 text-xxs rounded-pill font-mono">
                        ACTIVO FIJO
                      </span>
                    </td>
                    <td className="px-3 font-sans text-secondary">Martillo demoledor industrial 2.200W, 45-60J de impacto para servicio continuo. Activo capitalizable en finca.</td>
                    <td className="px-3 text-end fw-bold text-warning-emphasis">$1.000.00</td>
                  </tr>
                  <tr>
                    <td className="px-3 fw-bold">3.0</td>
                    <td className="px-3 font-sans fw-semibold">Ventilación Forzada de Seguridad</td>
                    <td className="px-3 font-sans text-secondary">Soplador centrífugo industrial 1/2 HP + 60m manguera corrugada 4" para inyección continua de O₂ a fondo.</td>
                    <td className="px-3 text-end fw-bold text-dark">$320.00</td>
                  </tr>
                  <tr>
                    <td className="px-3 fw-bold">4.0</td>
                    <td className="px-3 font-sans fw-semibold">Bomba de Achique de Obra</td>
                    <td className="px-3 font-sans text-secondary">Electrobomba sumergible de lodos 1 HP (descarga 2", sólidos 20mm) para drenaje durante avance.</td>
                    <td className="px-3 text-end fw-bold text-dark">$220.00</td>
                  </tr>
                  <tr>
                    <td className="px-3 fw-bold">5.0</td>
                    <td className="px-3 font-sans fw-semibold">Encamisado y Empaque de Grava</td>
                    <td className="px-3 font-sans text-secondary">Tubería PVC sanitaria ranurada tipo puente (12m) + 1.5 m³ grava cuarzosa lavada de río 1/4".</td>
                    <td className="px-3 text-end fw-bold text-dark">$420.00</td>
                  </tr>
                  <tr>
                    <td className="px-3 fw-bold">6.0</td>
                    <td className="px-3 font-sans fw-semibold">Bomba Sumergible Definitiva 2 HP</td>
                    <td className="px-3 font-sans text-secondary">Bomba tipo bala multietapas AISI 304 (220V, HMT 75-90 mca, caudal 2.0 L/s sostenidos).</td>
                    <td className="px-3 text-end fw-bold text-dark">$380.00</td>
                  </tr>
                  <tr>
                    <td className="px-3 fw-bold">7.0</td>
                    <td className="px-3 font-sans fw-semibold">Caja Control con Relé de Nivel</td>
                    <td className="px-3 font-sans text-secondary">Arrancador con guardamotor térmico + relé electrónico anti-marcha en seco con electrodos de nivel.</td>
                    <td className="px-3 text-end fw-bold text-dark">$160.00</td>
                  </tr>
                  <tr>
                    <td className="px-3 fw-bold">8.0</td>
                    <td className="px-3 font-sans fw-semibold">Cableado Mixto (70 m)</td>
                    <td className="px-3 font-sans text-secondary">20m cable plano sumergible con empalme vulcanizado epoxi + 50m cable vulcanizado TTU fuste seco.</td>
                    <td className="px-3 text-end fw-bold text-dark">$150.00</td>
                  </tr>
                  <tr>
                    <td className="px-3 fw-bold">9.0</td>
                    <td className="px-3 font-sans fw-semibold">Tubería PEAD 1.5" PN12.5 (65 m)</td>
                    <td className="px-3 font-sans text-secondary">Tubería vertical continua sin uniones bajo agua + válvula de retención check vertical de bronce 1.5".</td>
                    <td className="px-3 text-end fw-bold text-dark">$180.00</td>
                  </tr>
                  <tr>
                    <td className="px-3 fw-bold">10.0</td>
                    <td className="px-3 font-sans fw-semibold">Guaya de Sostenimiento (1.400 kgf)</td>
                    <td className="px-3 font-sans text-secondary">65m guaya de acero de alta resistencia Ø 3/16" + 4 perros prensacables inox y anclaje a brocal.</td>
                    <td className="px-3 text-end fw-bold text-dark">$90.00</td>
                  </tr>
                  <tr>
                    <td className="px-3 fw-bold">11.0</td>
                    <td className="px-3 font-sans fw-semibold">Acometida Poste Eléctrico</td>
                    <td className="px-3 font-sans text-secondary">Breaker bipolar termomagnético de protección, tubería de canalización y conexión a poste existente.</td>
                    <td className="px-3 text-end fw-bold text-dark">$80.00</td>
                  </tr>
                  <tr className="bg-agro-success-soft fw-bold fs-6">
                    <td colSpan={3} className="px-3 text-end font-sans text-dark">
                      TOTAL INVERSIÓN LLAVE EN MANO:
                    </td>
                    <td className="px-3 text-end font-mono text-success">$4.000.00 USD</td>
                  </tr>
                </tbody>
              </Table>
            </div>
            <div className="p-3 bg-light text-xxs text-secondary">
              * Nota: El martillo eléctrico industrial de $1.000 USD es un activo capitalizable permanente que conserva un valor residual de $750+ USD para reventa o uso en infraestructura de la finca.
            </div>
          </Accordion.Body>
        </Accordion.Item>

        {/* Item 2: Geología del Paleocauce (Sweet Spot) */}
        <Accordion.Item eventKey="geology" className="border-0 border-bottom">
          <Accordion.Header>
            <div className="d-flex align-items-center gap-2">
              <span className="material-symbols-outlined text-info fs-5">layers</span>
              <span className="fw-bold">2. Análisis Hidrogeológico: El Paleocauce Exclusivo de Cuara</span>
            </div>
          </Accordion.Header>
          <Accordion.Body className="small text-secondary">
            <h6 className="fw-bold text-dark mb-2">¿Por qué a 300 metros hacia el frente un vecino resultó seco a 50 metros?</h6>
            <p className="mb-2">
              En el Valle de Quíbor, el agua subterránea no forma un manto horizontal uniforme. El acuífero de Cuara está configurado por <strong>paleocauces aluviales entrelazados</strong> (antiguos ríos torrenciales cuaternarios):
            </p>
            <Row className="g-3 my-2">
              <Col xs={12} md={6}>
                <div className="p-3 bg-agro-success-soft border border-success border-opacity-30 rounded-3 h-100">
                  <div className="fw-bold text-success d-flex align-items-center gap-1.5 mb-1.5">
                    <span className="material-symbols-outlined fs-6">check_circle</span>
                    <span>Canal Activo (Tu Pozo en La Cigarronera)</span>
                  </div>
                  <p className="mb-0 text-xxs lh-base text-secondary">
                    El pozo penetró exactamente el eje colector donde la alta corriente lavó las arcillas y acumuló gravas pesadas de lidita y cuarzo limpio. El ancho de este paleocauce es de 50 a 100 metros. Garantiza agua activa y libre de interferencia de bombeo cercano.
                  </p>
                </div>
              </Col>
              <Col xs={12} md={6}>
                <div className="p-3 bg-white border border-secondary-subtle rounded-3 h-100">
                  <div className="fw-bold text-secondary d-flex align-items-center gap-1.5 mb-1.5">
                    <span className="material-symbols-outlined fs-6">cancel</span>
                    <span>Intercanal / Llanura de Desborde (Vecino a 300 m)</span>
                  </div>
                  <p className="mb-0 text-xxs lh-base text-secondary">
                    Al estar fuera del cauce torrencial, en esa cota solo se depositaron limos y arcillas masivas impermeables (acuitardo). La ausencia de agua en el vecino confirma que tu pozo goza de <strong>exclusividad hidráulica sin conos de depresión mutuos</strong>.
                  </p>
                </div>
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>

        {/* Item 3: Ingeniería de Anillos y Barbacanas */}
        <Accordion.Item eventKey="casing" className="border-0 border-bottom">
          <Accordion.Header>
            <div className="d-flex align-items-center gap-2">
              <span className="material-symbols-outlined text-primary fs-5">foundation</span>
              <span className="fw-bold">3. Ingeniería de Encofrado: Anillos Prefabricados In-Situ (ASTM C76)</span>
            </div>
          </Accordion.Header>
          <Accordion.Body className="small text-secondary">
            <p className="mb-2">
              Para blindar los 60 metros del fuste, se prefabricarán anillos de concreto armado de <strong>Ø 60 cm interior × 1.0 m de alto</strong> (espesor 7.5 cm) en patio, ahorrando un 67% respecto al tubo comercial:
            </p>
            <ul className="mb-2 ps-3 lh-base">
              <li className="mb-1"><strong>Anillos Ciegos (0 a 48 m):</strong> Concreto f'c = 250 kg/cm² con impermeabilizante integral para sellar arcillas y aguas de escorrentía superficiales. Factor de seguridad axial: FS = 17.3.</li>
              <li className="mb-1"><strong>Anillos Filtrantes Reforzados (48 a 60 m):</strong> Concreto de alta resistencia f'c = 280-300 kg/cm² con <strong>doble malla electrosoldada Ø 5.5 mm + 4 aros de 3/8"</strong>. Soportan las 22.9 toneladas de la columna.</li>
              <li><strong>240 Barbacanas Inclinadas a 15°:</strong> Orificios al tresbolillo con pendiente descendente hacia afuera para evitar entrada de grava del empaque y facilitar el ingreso laminar de más de 18 L/s.</li>
            </ul>
          </Accordion.Body>
        </Accordion.Item>

        {/* Item 4: Reservorio Regulador de 80 m³ */}
        <Accordion.Item eventKey="reservoir" className="border-0">
          <Accordion.Header>
            <div className="d-flex align-items-center gap-2">
              <span className="material-symbols-outlined text-info fs-5">water_voc</span>
              <span className="fw-bold">4. Bombeo en Tandas al Achique &amp; Reservorio Regulador de 80 m³</span>
            </div>
          </Accordion.Header>
          <Accordion.Body className="small text-secondary">
            <p className="mb-2">
              En lugar de forzar bombeos directos continuos que desgastan motores, el pozo opera en <strong>régimen de tandas al achique</strong> directo hacia un reservorio regulador:
            </p>
            <div className="p-3 bg-agro-info-soft rounded-3 border border-info border-opacity-20">
              <div className="row g-2 text-dark font-mono text-xs">
                <div className="col-12 col-md-4">
                  <span className="text-secondary text-xxs font-sans d-block">Columna Útil por Tanda:</span>
                  <strong className="text-info">4.5 m (~2.200 L)</strong>
                </div>
                <div className="col-12 col-md-4">
                  <span className="text-secondary text-xxs font-sans d-block">Duración de Extracción:</span>
                  <strong className="text-dark">15 a 18 minutos</strong>
                </div>
                <div className="col-12 col-md-4">
                  <span className="text-secondary text-xxs font-sans d-block">Recarga Aluvial Completa:</span>
                  <strong className="text-success">40 a 50 minutos</strong>
                </div>
              </div>
            </div>
            <p className="mt-2 mb-0 text-xxs">
              Con 8 a 10 tandas automáticas diarias se transfieren <strong>18 a 22 m³/día</strong> al reservorio de 80.000 litros, otorgando más de <strong>8 días de autonomía de fertirriego</strong> ante interrupciones de suministro eléctrico de Corpoelec.
            </p>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};
