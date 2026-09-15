import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Table, Tab, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const FunnelTechEvidence: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'espaldar' | 'fertirriego' | 'fao56' | 'plano'>('espaldar');

  const faoPhases = [
    {
      phase: '1. Trasplante & Enraizamiento',
      weeks: 'Semana 1 a 3',
      kc: '0.60',
      waterPerPlant: '7 – 9 L / planta',
      volumeWeekly: '18.8 – 22.5 m³ / sem',
      focus: 'Estimulación radicular (Fósforo + Ácido Fúlvico), protección contra damping-off y anclaje al camellón.'
    },
    {
      phase: '2. Vegetativo & Tutorado al Espaldar',
      weeks: 'Semana 4 a 7',
      kc: '0.80',
      waterPerPlant: '10 – 12 L / planta',
      volumeWeekly: '25.0 – 30.0 m³ / sem',
      focus: 'Guiado de ramas por cuadrícula Hortomalla 15×15 cm, asimilación de Nitrógeno y Calcio foliar (VPD 0.8-1.2 kPa).'
    },
    {
      phase: '3. Floración & Primer Cuajado',
      weeks: 'Semana 8 a 12',
      kc: '1.10',
      waterPerPlant: '15 – 17 L / planta',
      volumeWeekly: '37.5 – 42.5 m³ / sem',
      focus: 'Pico de demanda de Boro y Zinc para viabilidad del polen. Enfriamiento cenital para mantener T° < 31.5 °C.'
    },
    {
      phase: '4. Fructificación Plena & Cosechas',
      weeks: 'Semana 13 a 20',
      kc: '1.05',
      waterPerPlant: '17 – 20 L / planta',
      volumeWeekly: '42.5 – 50.0 m³ / sem',
      focus: 'Dosis alta de Nitrato de Potasio para engrose y pared gruesa (Lujo Grande >250g). Cosechas semanales continuas.'
    }
  ];

  return (
    <section id="evidencia-tecnica" className="py-5 bg-white border-top border-secondary border-opacity-15">
      <Container fluid="xl" className="py-3">
        {/* Encabezado */}
        <div className="text-center max-w-2xl mx-auto mb-5">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-success bg-opacity-10 border border-success border-opacity-25 text-success text-xs fw-bold text-uppercase mb-2">
            <span className="material-symbols-outlined ms-sm">precision_manufacturing</span>
            <span>Sistema Productivo Específico · Valle de Quíbor</span>
          </div>
          <h2 className="display-6 fw-bold text-dark mb-2">
            El Paquete Tecnológico del Pimentón Magistral
          </h2>
          <p className="text-secondary small max-w-xl mx-auto m-0">
            Diseño agronómico e ingenieril validado para 1.000 m² de casa de malla (3.0 m de altura) con 2.500 plantas y fertirriego hidrosoluble.
          </p>
        </div>

        {/* Pestañas Interactivas de Ingeniería */}
        <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab((k as any) || 'espaldar')}>
          <Nav variant="pills" className="justify-content-center gap-2 mb-4">
            <Nav.Item>
              <Nav.Link 
                eventKey="espaldar" 
                className="rounded-pill px-3 py-2 text-xs fw-bold d-flex align-items-center gap-1.5"
              >
                <span className="material-symbols-outlined fs-6">format_line_spacing</span>
                <span>Espaldar Hortomalla 15×15</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                eventKey="fertirriego" 
                className="rounded-pill px-3 py-2 text-xs fw-bold d-flex align-items-center gap-1.5"
              >
                <span className="material-symbols-outlined fs-6">science</span>
                <span>Nutrición Hidrosoluble (Tanques A-B-C)</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                eventKey="fao56" 
                className="rounded-pill px-3 py-2 text-xs fw-bold d-flex align-items-center gap-1.5"
              >
                <span className="material-symbols-outlined fs-6">water_drop</span>
                <span>Balance Hídrico FAO-56 Quíbor</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                eventKey="plano" 
                className="rounded-pill px-3 py-2 text-xs fw-bold d-flex align-items-center gap-1.5"
              >
                <span className="material-symbols-outlined fs-6">floorplan</span>
                <span>Plano Estructural 1.000 m²</span>
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            {/* PESTAÑA 1: ESPALDAR HORTOMALLA */}
            <Tab.Pane eventKey="espaldar">
              <Row className="g-4 align-items-center">
                <Col xs={12} lg={6}>
                  <Card className="card-agro p-4 border bg-light h-100 shadow-sm">
                    <Badge bg="success" className="align-self-start mb-3 font-mono text-xxs">
                      Sistema de Tutorado Biorientado
                    </Badge>
                    <h3 className="fs-5 fw-bold text-dark mb-2">
                      ¿Por Qué Usar Espaldar en Casa de Malla de 3 Metros?
                    </h3>
                    <p className="text-secondary text-xs mb-3">
                      La variedad de pimentón <strong>Magistral F1</strong> posee un hábito de crecimiento semi-determinado erecto (0.80 m a 1.20 m). Debido a su alta carga frutal (hasta 18 frutos simultáneos de pared gruesa), las plantas sin espaldar se vuelcan, quebrando ramas y pudriendo frutos en contacto con el acolchado.
                    </p>

                    <div className="p-3 bg-white rounded-3 border border-secondary-subtle mb-3">
                      <div className="d-flex align-items-start gap-2 mb-2">
                        <span className="material-symbols-outlined text-success fs-5">check_circle</span>
                        <div className="text-xs">
                          <strong className="text-dark">Reducción del 88% en Mano de Obra:</strong> La malla espaldera Hortomalla (cuadrícula 15×15 cm en polipropileno virgen a 2.20m) elimina el amarre manual planta por planta con rafia. Las ramas crecen guiándose de forma natural entre los cuadros.
                        </div>
                      </div>
                      <div className="d-flex align-items-start gap-2 mb-2">
                        <span className="material-symbols-outlined text-success fs-5">check_circle</span>
                        <div className="text-xs">
                          <strong className="text-dark">Ventilación Convectiva Vertical:</strong> Al mantener el dosel vegetal suspendido y erguido, el aire circula por los 3.0 m de altura, evitando focos de humedad estancada en el cuello de la raíz (cero *Phytophthora*).
                        </div>
                      </div>
                      <div className="d-flex align-items-start gap-2">
                        <span className="material-symbols-outlined text-success fs-5">check_circle</span>
                        <div className="text-xs">
                          <strong className="text-dark">Calidad Lujo Grande (200-280g):</strong> Frutos 100% aéreos, sin manchas de humedad, sin rozaduras de suelo y con maduración uniforme color rojo intenso o verde brillante.
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center text-xxs font-mono text-secondary pt-2 border-top">
                      <span>📏 Cuadrícula: 15 cm × 15 cm</span>
                      <span>🌿 Altura alambre portador: 2.20 m</span>
                      <span>🌱 2.500 Plántulas Guiadas</span>
                    </div>
                  </Card>
                </Col>

                <Col xs={12} lg={6}>
                  <Card className="card-agro p-4 border bg-white h-100 shadow-sm">
                    <h4 className="fs-6 fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                      <span className="material-symbols-outlined text-success">analytics</span>
                      <span>Ahorro Comparativo: Tutorado Tradicional vs Hortomalla</span>
                    </h4>

                    <div className="table-responsive">
                      <Table size="sm" bordered className="text-xs align-middle font-mono mb-3">
                        <thead className="table-light">
                          <tr>
                            <th>Concepto (1.000 m²)</th>
                            <th>Rafia Hilo a Hilo</th>
                            <th className="text-success fw-bold">Hortomalla 15×15</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="fw-semibold font-sans">Jornales de tutorado</td>
                            <td className="text-danger">36 jornales / ciclo</td>
                            <td className="text-success fw-bold">4 jornales / ciclo (-88%)</td>
                          </tr>
                          <tr>
                            <td className="fw-semibold font-sans">Gasto en insumo tutor</td>
                            <td>$180 (rafia desechable)</td>
                            <td className="text-success fw-bold">$120 (reutilizable 3-4 ciclos)</td>
                          </tr>
                          <tr>
                            <td className="fw-semibold font-sans">Riesgo de estrangulamiento</td>
                            <td className="text-warning">Alto en nudos manuales</td>
                            <td className="text-success fw-bold">Nulo (apoyo suave en cuadro)</td>
                          </tr>
                          <tr>
                            <td className="fw-semibold font-sans">Fruta de segunda / descarte</td>
                            <td className="text-danger">15% a 20%</td>
                            <td className="text-success fw-bold">&lt; 5% descarte comercial</td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>

                    <div className="p-3 rounded-3 bg-success bg-opacity-10 border border-success border-opacity-25 text-xs text-dark">
                      <div className="fw-bold text-success mb-1 d-flex align-items-center gap-1">
                        <span className="material-symbols-outlined fs-6">verified</span>
                        <span>Validación en Quíbor:</span>
                      </div>
                      En la nave de 20m × 50m se instalan 8 rollos de malla espaldera a lo largo de los 10 camellones dobles, tensados con guayas galvanizadas a los postes perimetrales y anclajes reforzados para soportar el viento del Este.
                    </div>
                  </Card>
                </Col>
              </Row>
            </Tab.Pane>

            {/* PESTAÑA 2: FERTIRRIEGO HIDROSOLUBLE */}
            <Tab.Pane eventKey="fertirriego">
              <Row className="g-4">
                <Col xs={12} lg={4}>
                  <Card className="card-agro p-4 border bg-white h-100 shadow-sm border-top border-4 border-success">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-success bg-opacity-15 text-success font-mono text-xxs">Tanque A</span>
                      <span className="text-xxs text-muted font-mono">Calcio + Quelatos</span>
                    </div>
                    <h4 className="fs-6 fw-bold text-dark mb-2">Tanque Calcio &amp; Nitrógeno</h4>
                    <p className="text-secondary text-xs mb-3">
                      Sales de máxima pureza sin sulfatos ni fósforo para impedir precipitación de yeso insoluble en los goteros.
                    </p>
                    <ul className="text-xs text-secondary ps-3 mb-3 font-mono">
                      <li><strong>Nitrato de Calcio AIFA:</strong> Previene la necrosis apical (Blossom End Rot).</li>
                      <li><strong>Nitrato de Potasio:</strong> Balance vigor y llenado inicial.</li>
                      <li><strong>Hierro Quelatado EDDHA:</strong> Asimilación garantizada en pH de Quíbor.</li>
                    </ul>
                    <div className="p-2 rounded bg-light border text-xxs text-muted font-mono">
                      Concentración: 100 g/L madre · Inyección 1:100
                    </div>
                  </Card>
                </Col>

                <Col xs={12} lg={4}>
                  <Card className="card-agro p-4 border bg-white h-100 shadow-sm border-top border-4 border-info">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-info bg-opacity-15 text-info font-mono text-xxs">Tanque B</span>
                      <span className="text-xxs text-muted font-mono">Fosfatos + Sulfatos</span>
                    </div>
                    <h4 className="fs-6 fw-bold text-dark mb-2">Tanque Fósforo, Magnesio &amp; Micros</h4>
                    <p className="text-secondary text-xs mb-3">
                      Aporte energético para floración abundante y clorofila intensa para máxima fotosíntesis bajo malla blanca.
                    </p>
                    <ul className="text-xs text-secondary ps-3 mb-3 font-mono">
                      <li><strong>Fosfato Monopotásico (MKP):</strong> Enraizamiento y cuajado floral.</li>
                      <li><strong>Sulfato de Magnesio:</strong> Motor central de la molécula de clorofila.</li>
                      <li><strong>Sulfato de Potasio:</strong> Calidad de pulpa y grados Brix.</li>
                      <li><strong>Micronutrientes (B, Zn, Mn, Mo):</strong> Fecundación del polen.</li>
                    </ul>
                    <div className="p-2 rounded bg-light border text-xxs text-muted font-mono">
                      Solubilidad completa 100% · Cero taponamientos
                    </div>
                  </Card>
                </Col>

                <Col xs={12} lg={4}>
                  <Card className="card-agro p-4 border bg-white h-100 shadow-sm border-top border-4 border-warning">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-warning bg-opacity-20 text-warning-emphasis font-mono text-xxs">Tanque C</span>
                      <span className="text-xxs text-muted font-mono">Control pH Quíbor</span>
                    </div>
                    <h4 className="fs-6 fw-bold text-dark mb-2">Corrección de Bicarbonatos</h4>
                    <p className="text-secondary text-xs mb-3">
                      El agua de pozo del acuífero aluvial de Quíbor presenta bicarbonatos alcalinos. Se neutralizan para liberar nutrientes:
                    </p>
                    <ul className="text-xs text-secondary ps-3 mb-3 font-mono">
                      <li><strong>Ácido Nítrico (HNO₃ 60%):</strong> Neutraliza HCO₃⁻ y aporta N nítrico.</li>
                      <li><strong>pH Objetivo del Bulbo:</strong> 5.8 a 6.2 (máxima solubilidad de fósforo).</li>
                      <li><strong>Fracción de Lavado (LF 15-20%):</strong> Evita concentración de sales en los primeros 40 cm de raíz.</li>
                    </ul>
                    <div className="p-2 rounded bg-light border text-xxs text-muted font-mono">
                      Garantía contra obturación física y química
                    </div>
                  </Card>
                </Col>
              </Row>
            </Tab.Pane>

            {/* PESTAÑA 3: BALANCE HÍDRICO FAO-56 */}
            <Tab.Pane eventKey="fao56">
              <Card className="card-agro p-4 border bg-white shadow-sm">
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                  <div>
                    <h4 className="fs-6 fw-bold text-dark m-0">
                      Régimen de Riego FAO-56 Calibrado para Pimentón en Quíbor
                    </h4>
                    <p className="text-secondary text-xs m-0">
                      Cálculo de lámina neta y bruta ajustada por evapotranspiración de referencia (ET₀ Quíbor = 4.8 – 6.2 mm/día).
                    </p>
                  </div>
                  <Badge bg="info" className="font-mono text-xs px-3 py-1.5 rounded-pill text-white">
                    Pozo Propio 60m · 2.5 L/s
                  </Badge>
                </div>

                <div className="table-responsive">
                  <Table bordered hover className="text-xs align-middle mb-3">
                    <thead className="table-light font-mono">
                      <tr>
                        <th>Fase Fenológica</th>
                        <th>Período</th>
                        <th>Coeficiente Kc</th>
                        <th>Demanda / Planta</th>
                        <th>Volumen Semanal (1.000 m²)</th>
                        <th>Manejo Nutricional Clave</th>
                      </tr>
                    </thead>
                    <tbody>
                      {faoPhases.map((phase, idx) => (
                        <tr key={idx}>
                          <td className="fw-bold text-dark font-sans">{phase.phase}</td>
                          <td className="font-mono text-secondary">{phase.weeks}</td>
                          <td className="font-mono fw-bold text-success">{phase.kc}</td>
                          <td className="font-mono text-dark">{phase.waterPerPlant}</td>
                          <td className="font-mono text-info fw-bold">{phase.volumeWeekly}</td>
                          <td className="text-secondary text-xxs">{phase.focus}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                <div className="p-3 rounded-3 bg-light border text-xs text-secondary d-flex flex-wrap justify-content-between align-items-center gap-2">
                  <div>
                    <strong className="text-dark">Volumen Total Ciclo (20 semanas):</strong> ~620 m³ de agua tecnificada por cada 2.500 plantas.
                  </div>
                  <Link to="/cockpit" className="btn btn-outline-success btn-sm rounded-pill font-mono text-xs fw-bold px-3">
                    Ver calculadora KaTeX en Cockpit →
                  </Link>
                </div>
              </Card>
            </Tab.Pane>

            {/* PESTAÑA 4: PLANO ESTRUCTURAL */}
            <Tab.Pane eventKey="plano">
              <Card className="card-agro p-4 border bg-white shadow-sm">
                <Row className="g-4 align-items-center">
                  <Col xs={12} lg={7}>
                    <div className="rounded-3 overflow-hidden border bg-light p-2 text-center position-relative">
                      <img
                        src="/plano_2d_invernadero_quibor.svg"
                        alt="Plano 2D Casa de Malla Quíbor 1.000 m²"
                        className="img-fluid rounded"
                        style={{ maxHeight: '320px', objectFit: 'contain' }}
                        loading="lazy"
                      />
                      <div className="position-absolute bottom-0 end-0 p-2">
                        <a
                          href="/plano_2d_invernadero_quibor.svg"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-dark btn-sm rounded-pill py-1 px-3 text-xxs d-flex align-items-center gap-1 shadow"
                        >
                          <span className="material-symbols-outlined ms-sm">fullscreen</span>
                          <span>Abrir Plano en Alta Resolución</span>
                        </a>
                      </div>
                    </div>
                  </Col>

                  <Col xs={12} lg={5}>
                    <h4 className="fs-6 fw-bold text-dark mb-3">Especificaciones de la Nave 1.000 m²</h4>
                    <ul className="text-xs text-secondary ps-3 mb-4 font-mono">
                      <li className="mb-1.5"><strong>Dimensiones:</strong> 20.00 m de frente × 50.00 m de fondo.</li>
                      <li className="mb-1.5"><strong>Altura Total:</strong> 3.00 m libre interior (óptima para pimentón 0.8-1.2m).</li>
                      <li className="mb-1.5"><strong>Distribución:</strong> 10 camellones dobles a 2.00 m entre centros.</li>
                      <li className="mb-1.5"><strong>Líneas de Riego:</strong> 20 hileras de 50 m con manguera 16mm y goteros PC a 40 cm.</li>
                      <li className="mb-1.5"><strong>Cubierta:</strong> Malla 50 mesh blanca (130 gsm) monofilamento virgen HDPE.</li>
                      <li className="mb-1.5"><strong>Carga Eólica:</strong> Anclajes Este reforzados con doble poste y tensores para 27 km/h.</li>
                    </ul>

                    <div className="p-3 bg-light rounded-3 border text-xs">
                      <span className="text-muted d-block text-xxs mb-1">AUDITORÍA TÉCNICA:</span>
                      <span className="text-dark fw-semibold">
                        Nave modulada para instalación rápida en 3 a 4 semanas sin obras civiles complejas.
                      </span>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
    </section>
  );
};
export default FunnelTechEvidence;
