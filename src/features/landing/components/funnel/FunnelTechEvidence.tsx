import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Table, Tab, Nav, ButtonGroup, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const FunnelTechEvidence: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'espaldar' | 'fertirriego' | 'fao56' | 'plano'>('espaldar');
  const [nutritionMode, setNutritionMode] = useState<'aifa' | 'granulado_ve' | 'comparativa'>('comparativa');

  const faoPhases = [
    {
      phase: '1. Trasplante & Enraizamiento',
      weeks: 'Semana 1 a 3 (3 sem)',
      kc: '0.60',
      litersPerPlantWeek: '7 – 9 L / planta / semana',
      litersPerPlantDay: '1.0 – 1.3 L / día',
      volumeWeeklyLiters: '17.500 – 22.500 L / sem',
      volumeWeeklyM3: '17.5 – 22.5 m³ / sem',
      cisternsWeekly: '2 cisternas de 10.000 L / sem',
      cisternsPhaseTotal: '6 cisternas (60.000 L)',
      pulses: '3 pulsos / día (10 min c/u)',
      pulseLiters: '0.35 – 0.43 L / pulso',
      focus: 'Estimulación radicular con Nitrato de Calcio + MKP + Ácido Fúlvico por goteo. Pulsos cortos que impiden asfixia radicular y evaporación solar.'
    },
    {
      phase: '2. Vegetativo & Tutorado al Espaldar',
      weeks: 'Semana 4 a 7 (4 sem)',
      kc: '0.80',
      litersPerPlantWeek: '10 – 12 L / planta / semana',
      litersPerPlantDay: '1.4 – 1.7 L / día',
      volumeWeeklyLiters: '25.000 – 30.000 L / sem',
      volumeWeeklyM3: '25.0 – 30.0 m³ / sem',
      cisternsWeekly: '2.5 a 3 cisternas / sem',
      cisternsPhaseTotal: '11 cisternas (110.000 L)',
      pulses: '4 pulsos / día (12 min c/u)',
      pulseLiters: '0.35 – 0.42 L / pulso',
      focus: 'Inyección continua N-K hidrosoluble en cada pulso. Guiado en Hortomalla 15×15 cm y VPD 0.8-1.2 kPa para calibre uniforme.'
    },
    {
      phase: '3. Floración & Primer Cuajado',
      weeks: 'Semana 8 a 12 (5 sem)',
      kc: '1.10',
      litersPerPlantWeek: '15 – 17 L / planta / semana',
      litersPerPlantDay: '2.1 – 2.4 L / día',
      volumeWeeklyLiters: '37.500 – 42.500 L / sem',
      volumeWeeklyM3: '37.5 – 42.5 m³ / sem',
      cisternsWeekly: '4 cisternas / sem',
      cisternsPhaseTotal: '20 cisternas (200.000 L)',
      pulses: '5 pulsos / día (14 min c/u)',
      pulseLiters: '0.42 – 0.48 L / pulso',
      focus: 'Pulsos en pico solar (10:00-14:00) con Calcio y Boro soluble. Mantiene CE radicular estable para erradicar la necrosis apical.'
    },
    {
      phase: '4. Fructificación Plena & Cosechas',
      weeks: 'Semana 13 a 20 (8 sem)',
      kc: '1.05',
      litersPerPlantWeek: '17 – 20 L / planta / semana',
      litersPerPlantDay: '2.4 – 2.9 L / día',
      volumeWeeklyLiters: '42.500 – 50.000 L / sem',
      volumeWeeklyM3: '42.5 – 50.0 m³ / sem',
      cisternsWeekly: '4.5 a 5 cisternas / sem',
      cisternsPhaseTotal: '37 cisternas (370.000 L)',
      pulses: '6 pulsos / día (14 min c/u)',
      pulseLiters: '0.40 – 0.48 L / pulso',
      focus: 'Micro-dosis cada 1.8h en horas de máxima insolación. Absorción activa de Nitrato de Potasio para peso >250g y 4 lóbulos gruesos.'
    }
  ];

  return (
    <section id="evidencia-tecnica" className="py-5 bg-white border-top border-secondary border-opacity-15">
      <Container fluid="xl" className="py-3">
        {/* Encabezado */}
        <div className="text-center max-w-2xl mx-auto mb-5">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-success bg-opacity-10 border border-success border-opacity-25 text-success text-xs fw-bold text-uppercase mb-2">
            <span className="material-symbols-outlined ms-sm">precision_manufacturing</span>
            <span>Paquete Tecnológico Integral · Valle de Quíbor</span>
          </div>
          <h2 className="display-6 fw-bold text-dark mb-2">
            Ingeniería de Cultivo: Magistral F1 en 1.000 m²
          </h2>
          <p className="text-secondary small max-w-xl mx-auto m-0">
            Diseño agronómico e ingenieril validado para 2.500 plantas: protocolo de siembra, fertirriego comparativo (AIFA vs Granulados Venezuela con K₂SO₄) y balance hídrico por cisternas.
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
                <span className="material-symbols-outlined fs-6">potted_plant</span>
                <span>Siembra &amp; Espaldar Español (2.500 Pl)</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                eventKey="fertirriego" 
                className="rounded-pill px-3 py-2 text-xs fw-bold d-flex align-items-center gap-1.5"
              >
                <span className="material-symbols-outlined fs-6">science</span>
                <span>Nutrición: AIFA Soluble vs Granulados VE</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                eventKey="fao56" 
                className="rounded-pill px-3 py-2 text-xs fw-bold d-flex align-items-center gap-1.5"
              >
                <span className="material-symbols-outlined fs-6">water_drop</span>
                <span>Fertirriego FAO-56 &amp; Cisternas</span>
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
            {/* PESTAÑA 1: SIEMBRA, DENSIDAD & ESPALDAR HORTOMALLA */}
            <Tab.Pane eventKey="espaldar">
              <Row className="g-4 mb-4">
                <Col xs={12} lg={6}>
                  <Card className="card-agro p-4 border bg-light h-100 shadow-sm">
                    <Badge bg="success" className="align-self-start mb-3 font-mono text-xxs">
                      Marco de Siembra de Alta Densidad (2.500 Plantas / 1.000 m²)
                    </Badge>
                    <h3 className="fs-5 fw-bold text-dark mb-2">
                      Protocolo de Siembra y Trasplante en Valle de Quíbor
                    </h3>
                    <p className="text-secondary text-xs mb-3">
                      La semilla híbrida <strong>Magistral F1</strong> se trasplanta con cepellón a los <strong>35 días de semillero</strong> en bandejas de 128 alvéolos, con sanidad estricta libre de trips para entrar en la casa de malla con 0% virus.
                    </p>

                    <div className="p-3 bg-white rounded-3 border border-secondary-subtle mb-3">
                      <div className="d-flex align-items-start gap-2 mb-2">
                        <span className="material-symbols-outlined text-success fs-5">grid_view</span>
                        <div className="text-xs">
                          <strong className="text-dark">Distribución Espacial en la Nave (20m × 50m):</strong> 10 camellones dobles a 2.00 m entre centros. Cada camellón aloja 2 hileras a 50 cm y 40 cm entre plantas (250 plantas por camellón = <strong>2.500 plantas totales</strong>).
                        </div>
                      </div>
                      <div className="d-flex align-items-start gap-2 mb-2">
                        <span className="material-symbols-outlined text-success fs-5">vertical_align_bottom</span>
                        <div className="text-xs">
                          <strong className="text-dark">Profundidad Anti-Vuelco:</strong> Se entierra el cepellón hasta el primer nudo foliar verdadero para estimular emisión adventicia de raíces y brindar firmeza mecánica al tallo principal.
                        </div>
                      </div>
                      <div className="d-flex align-items-start gap-2">
                        <span className="material-symbols-outlined text-warning fs-5">warning</span>
                        <div className="text-xs">
                          <strong className="text-dark">Separación del Gotero (Prevención "Pie de Elefante"):</strong> El gotero autocompensante de 1.6 L/h se coloca a <strong>5 – 8 cm (2-3")</strong> del cuello del tallo durante las primeras 3 semanas. Esto impide el encharcamiento basal que atrae <em>Fusarium solani</em> y <em>Phytophthora capsici</em>.
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center text-xxs font-mono text-secondary pt-2 border-top">
                      <span>🌱 2.500 Plántulas Magistral F1</span>
                      <span>📐 Camellones: 10 dobles (50m)</span>
                      <span>💧 Goteros: 1.6 L/h cada 40 cm</span>
                    </div>
                  </Card>
                </Col>

                <Col xs={12} lg={6}>
                  <Card className="card-agro p-4 border bg-white h-100 shadow-sm">
                    <Badge bg="primary" className="align-self-start mb-3 font-mono text-xxs">
                      Sistema Español en Espalderas Hortomalla (15×15 cm)
                    </Badge>
                    <h4 className="fs-5 fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                      <span>Entutorado Libre sin Poda para Fruto Jumbo</span>
                    </h4>
                    <p className="text-secondary text-xs mb-3">
                      En lugar del amarre manual con rafia hilo a hilo (lento y lesivo), el Sistema Español sostiene las ramas erectas dentro de la cuadrícula de la malla. Las ramas cargan hasta 18 frutos simultáneos sin quebrar tallos.
                    </p>

                    <div className="table-responsive">
                      <Table size="sm" bordered className="text-xs align-middle font-mono mb-3">
                        <thead className="table-light">
                          <tr>
                            <th>Parámetro de Siembra y Tutorado</th>
                            <th>Manejo Tradicional (Rafia)</th>
                            <th className="text-success fw-bold">Sistema Español Hortomalla</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="fw-semibold font-sans">Jornales de tutorado</td>
                            <td className="text-danger">36 jornales / ciclo</td>
                            <td className="text-success fw-bold">4 jornales / ciclo (-88%)</td>
                          </tr>
                          <tr>
                            <td className="fw-semibold font-sans">Insumo de amarre</td>
                            <td>$180 (rafia descartable)</td>
                            <td className="text-success fw-bold">$120 (reutilizable 3-4 ciclos)</td>
                          </tr>
                          <tr>
                            <td className="fw-semibold font-sans">Arranque radicular inicial</td>
                            <td className="text-warning">Granulado al fondo (riesgo quema)</td>
                            <td className="text-success fw-bold">Microdosis Ca+MKP soluble (0 estrés)</td>
                          </tr>
                          <tr>
                            <td className="fw-semibold font-sans">Fruto en contacto con suelo</td>
                            <td className="text-danger">15% a 20% (podredumbre)</td>
                            <td className="text-success fw-bold">0% (100% aéreo y ventilado)</td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>

                    <div className="p-2.5 rounded-3 bg-success bg-opacity-10 border border-success border-opacity-25 text-xs text-dark">
                      <strong className="text-success font-sans d-block mb-1">Impacto en la Cesta:</strong>
                      Al mantener los frutos suspendidos bajo la altura de 3.0 m de la casa de malla, se asegura un <strong>88% de Cesta Grande (&gt;220g) a $14–$15 USD</strong>, reduciendo el descarte a menos del 5%.
                    </div>
                  </Card>
                </Col>
              </Row>
            </Tab.Pane>

            {/* PESTAÑA 2: NUTRICIÓN HIDROSOLUBLE AIFA VS GRANULADOS DE VENEZUELA */}
            <Tab.Pane eventKey="fertirriego">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3 pb-2 border-bottom border-secondary-subtle">
                <div>
                  <h4 className="fs-6 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                    <span className="material-symbols-outlined text-primary fs-5">science</span>
                    <span>Programa Nutricional para 2.500 Plantas: AIFA Soluble vs Granulados de Venezuela</span>
                  </h4>
                  <span className="text-secondary small font-sans">
                    Formulación balanceada para 1.000 m² con fuente de Potasio sin cloro (K₂SO₄) para las aguas de Quíbor
                  </span>
                </div>

                <ButtonGroup size="sm">
                  <Button
                    variant={nutritionMode === 'comparativa' ? 'success' : 'outline-secondary'}
                    onClick={() => setNutritionMode('comparativa')}
                    className="fw-bold px-3 text-xs"
                  >
                    ⚖️ Cara a Cara &amp; Rentabilidad
                  </Button>
                  <Button
                    variant={nutritionMode === 'aifa' ? 'primary' : 'outline-secondary'}
                    onClick={() => setNutritionMode('aifa')}
                    className="fw-bold px-3 text-xs"
                  >
                    Tanques AIFA (A, B, C)
                  </Button>
                  <Button
                    variant={nutritionMode === 'granulado_ve' ? 'warning' : 'outline-secondary'}
                    onClick={() => setNutritionMode('granulado_ve')}
                    className="fw-bold px-3 text-xs"
                  >
                    Granulados Venezuela (K₂SO₄)
                  </Button>
                </ButtonGroup>
              </div>

              {/* VISTA COMPARATIVA: CARA A CARA */}
              {nutritionMode === 'comparativa' && (
                <div className="animate-fade-in">
                  {/* Alert Contextual Potasio sin cloro */}
                  <Alert variant="success" className="border border-success border-opacity-40 rounded-3 p-3 mb-3 text-xs">
                    <div className="d-flex align-items-start gap-2">
                      <span className="material-symbols-outlined text-success fs-5 mt-0.5">verified</span>
                      <div>
                        <strong>Selección Técnica de Potasio para Quíbor:</strong> Para la comparativa con productos granulados disponibles en Venezuela, se establece el <strong>Sulfato de Potasio (K₂SO₄ 0-0-50 + 18% S)</strong> como fuente de K. El Cloruro de Potasio (KCl 0-0-60) —aunque más barato— está <strong>desaconsejado</strong> porque el agua de pozo de Quíbor ya contiene cloruros elevados (CE<sub>w</sub> &gt; 1.5 dS/m), y agregar KCl provocaría intoxicación salina, aborto floral y necrosis foliar marginal.
                      </div>
                    </div>
                  </Alert>

                  {/* Tabla de Equivalencias de Productos */}
                  <div className="table-responsive bg-white rounded border mb-4">
                    <Table hover size="sm" className="align-middle mb-0 font-sans text-xs">
                      <thead className="table-light">
                        <tr>
                          <th>Nutriente / Función</th>
                          <th>Sistema AIFA 100% Soluble (Gotero)</th>
                          <th>Equivalente Granulado en Venezuela</th>
                          <th>Eficiencia en Quíbor (pH 7.4+)</th>
                          <th>Efecto Directo en Cesta</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><strong>Calcio + Nitrógeno</strong></td>
                          <td className="font-mono text-primary fw-bold">Nitrato de Calcio AIFA (15.5-0-0 + 26% CaO)</td>
                          <td className="font-mono text-secondary">Nitrato de Calcio granulado (re-envasado)</td>
                          <td><Badge bg="success">95% asimilable</Badge> por bulbo húmedo</td>
                          <td>Pared celular 8-10 mm. Cero necrosis apical ("culillo").</td>
                        </tr>
                        <tr>
                          <td><strong>Fósforo (P)</strong></td>
                          <td className="font-mono text-primary fw-bold">MKP Soluble AIFA (0-52-34)</td>
                          <td className="font-mono text-danger">DAP 18-46-0 granulado al suelo</td>
                          <td><Badge bg="danger">Bloqueo &gt;60%</Badge> en suelo alcalino sin ácido</td>
                          <td>AIFA asegura floración continua; DAP sufre aborto de botones.</td>
                        </tr>
                        <tr>
                          <td><strong>Potasio (K)</strong></td>
                          <td className="font-mono text-primary fw-bold">KNO₃ (13-0-46) + K₂SO₄ soluble</td>
                          <td className="font-mono text-success fw-bold">Sulfato de Potasio (K₂SO₄ 0-0-50) ⭐</td>
                          <td><Badge bg="success">Libre de Cloro</Badge> · Seguro para Quíbor</td>
                          <td>Fruto pesado (&gt;220g), 4 lóbulos gruesos y brillo comercial.</td>
                        </tr>
                        <tr>
                          <td><strong>Magnesio &amp; Azufre</strong></td>
                          <td className="font-mono text-primary fw-bold">Sulfato de Magnesio Hepta AIFA</td>
                          <td className="font-mono text-secondary">Sal de Epsom granulada (16% MgO)</td>
                          <td><Badge bg="info" text="dark">Buena solubilidad</Badge> incorporada</td>
                          <td>Fotosíntesis activa bajo radiación y bochorno de Quíbor.</td>
                        </tr>
                        <tr>
                          <td><strong>Hierro (Fe)</strong></td>
                          <td className="font-mono text-primary fw-bold">Quelato Fe-EDDHA 6% (estable pH 7.8)</td>
                          <td className="font-mono text-danger">Sulfato Ferroso foliar común</td>
                          <td><Badge bg="danger">Precipita a pH &gt;6.5</Badge> en suelo</td>
                          <td>AIFA previene clorosis férrica; granulado causa amarillamiento.</td>
                        </tr>
                        <tr>
                          <td><strong>Control de Alcalinidad</strong></td>
                          <td className="font-mono text-primary fw-bold">Tanque C: Ácido Nítrico (pH 5.8-6.2)</td>
                          <td className="font-mono text-muted">Sin regulación de pH en riego</td>
                          <td><Badge bg="warning" text="dark">Salinidad sin control</Badge></td>
                          <td>AIFA disuelve precipitados; sin ácido se taponan raíces y goteros.</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>

                  {/* Panel Resumen Económico */}
                  <Row className="g-3 mb-3">
                    <Col xs={12} md={6}>
                      <div className="p-3 bg-light rounded-3 border border-secondary-subtle h-100">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="badge bg-secondary text-white font-mono text-xxs">PLAN B · GRANULADO VENEZUELA</span>
                          <span className="text-secondary font-mono text-xs fw-bold">$480 – $620 USD insumos</span>
                        </div>
                        <h5 className="fs-6 fw-bold text-dark mb-1">Manejo Tradicional con Granulados (K₂SO₄)</h5>
                        <p className="text-secondary text-xs mb-2">
                          Abonado manual en banda al suelo, sin regulación de pH en agua salina.
                        </p>
                        <ul className="text-xs text-secondary ps-3 mb-2 font-mono">
                          <li>Rendimiento comercial: <strong>2.5 – 3.5 kg / planta</strong></li>
                          <li>Cesta Grande (&gt;220g a $14): <strong>Solo 35% – 50%</strong></li>
                          <li>Fruta Maraña (&lt;100g a $3.5): <strong>25% – 35% de la cosecha</strong></li>
                          <li>Mano de obra extra en abonado: <strong>+$384 USD (2 jornales/sem)</strong></li>
                          <li>Ganancia neta del ciclo: <strong className="text-dark font-sans">$2.345 USD</strong></li>
                        </ul>
                      </div>
                    </Col>

                    <Col xs={12} md={6}>
                      <div className="p-3 bg-success bg-opacity-10 rounded-3 border border-success border-opacity-40 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="badge bg-success text-white font-mono text-xxs">PLAN A · AIFA SOLUBLE + REGULADOR pH</span>
                          <span className="text-success font-mono text-xs fw-bold">$1.380 USD insumos A+B</span>
                        </div>
                        <h5 className="fs-6 fw-bold text-dark mb-1">Fertirriego Tecnificado AIFA (Alta Precisión)</h5>
                        <p className="text-secondary text-xs mb-2">
                          Inyección Venturi en cada pulso de riego con pH calibrado a 5.8-6.2.
                        </p>
                        <ul className="text-xs text-secondary ps-3 mb-2 font-mono">
                          <li>Rendimiento comercial: <strong className="text-success">4.5 – 5.5 kg / planta</strong></li>
                          <li>Cesta Grande (&gt;220g a $14): <strong className="text-success">88% de la cosecha</strong></li>
                          <li>Fruta Maraña (&lt;100g a $3.5): <strong className="text-success">0% (ERRADICADA)</strong></li>
                          <li>Mano de obra en abonado: <strong className="text-success">$0 (automatizado con goteo)</strong></li>
                          <li>Ganancia neta del ciclo: <strong className="text-success font-sans fs-6 fw-bold">$6.360 USD (+171%)</strong></li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <div className="p-2.5 rounded-3 bg-agro-success-soft border border-success border-opacity-30 d-flex justify-content-between align-items-center text-xs">
                    <div>
                      <strong className="text-success">Conclusión Financiera:</strong> Invertir en el Plan AIFA requiere $900 USD adicionales en fertilizantes, pero genera <strong>+$4.015 USD netos libres en el bolsillo</strong> por eliminación de la maraña y 88% de calibres grandes.
                    </div>
                    <Link to="/cockpit" className="btn btn-sm btn-success rounded-pill px-3 font-mono text-xxs fw-bold flex-shrink-0 ms-2">
                      Ver Tanques en Cockpit →
                    </Link>
                  </div>
                </div>
              )}

              {/* VISTA TANQUES AIFA */}
              {nutritionMode === 'aifa' && (
                <div className="animate-fade-in">
                  <Row className="g-4 mb-3">
                    <Col xs={12} lg={4}>
                      <Card className="card-agro p-3 border bg-white h-100 shadow-sm border-top border-4 border-primary">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="badge bg-primary bg-opacity-15 text-primary font-mono text-xxs">Tanque A · 500 L</span>
                          <span className="text-xxs text-muted font-mono">26.05 kg / sem</span>
                        </div>
                        <h5 className="fs-6 fw-bold text-dark mb-1">Calcio, Nitrato &amp; Quelato Fe</h5>
                        <p className="text-secondary text-xs mb-2">
                          Sales puras sin sulfatos ni fósforo para evitar precipitados insolubles de yeso en goteros.
                        </p>
                        <ul className="text-xs text-secondary ps-3 mb-2 font-mono">
                          <li><strong>Nitrato Calcio AIFA:</strong> 18.00 kg/sem (15.5-0-0 + 26% CaO).</li>
                          <li><strong>Nitrato Potasio AIFA:</strong> 7.50 kg/sem (13-0-46).</li>
                          <li><strong>Hierro Fe-EDDHA 6%:</strong> 0.55 kg/sem (estable pH 7.8).</li>
                        </ul>
                        <div className="p-2 bg-light rounded text-xxs font-mono text-muted">
                          Previene necrosis apical ("culillo") y clorosis férrica.
                        </div>
                      </Card>
                    </Col>

                    <Col xs={12} lg={4}>
                      <Card className="card-agro p-3 border bg-white h-100 shadow-sm border-top border-4 border-success">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="badge bg-success bg-opacity-15 text-success font-mono text-xxs">Tanque B · 500 L</span>
                          <span className="text-xxs text-muted font-mono">40.45 kg / sem</span>
                        </div>
                        <h5 className="fs-6 fw-bold text-dark mb-1">Fósforo, Potasio, Mg &amp; Micros</h5>
                        <p className="text-secondary text-xs mb-2">
                          Aporte estequiométrico para cuajado floral masivo, grados Brix y grosor de pericarpio.
                        </p>
                        <ul className="text-xs text-secondary ps-3 mb-2 font-mono">
                          <li><strong>Nitrato Potasio AIFA:</strong> 15.00 kg/sem.</li>
                          <li><strong>MKP 0-52-34 Soluble:</strong> 5.00 kg/sem.</li>
                          <li><strong>Sulfato Potasio K₂SO₄:</strong> 12.00 kg/sem (sin cloro).</li>
                          <li><strong>Sulfato Magnesio Hepta:</strong> 8.00 kg/sem.</li>
                          <li><strong>Boro Soluble (Octaborato):</strong> 0.15 kg/sem.</li>
                          <li><strong>Micronutrientes Quelatados:</strong> 0.30 kg/sem.</li>
                        </ul>
                        <div className="p-2 bg-light rounded text-xxs font-mono text-muted">
                          Solubilidad 100% · Cero taponamientos en goteros PC.
                        </div>
                      </Card>
                    </Col>

                    <Col xs={12} lg={4}>
                      <Card className="card-agro p-3 border bg-white h-100 shadow-sm border-top border-4 border-danger">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="badge bg-danger bg-opacity-15 text-danger font-mono text-xxs">Tanque C · 200 L</span>
                          <span className="text-xxs text-muted font-mono">11 – 12.5 L / sem</span>
                        </div>
                        <h5 className="fs-6 fw-bold text-dark mb-1">Regulador de pH (Ácido Nítrico)</h5>
                        <p className="text-secondary text-xs mb-2">
                          Neutraliza bicarbonatos alcalinos del agua de pozo de Quíbor (3.5 meq/L a neutralizar).
                        </p>
                        <ul className="text-xs text-secondary ps-3 mb-2 font-mono">
                          <li><strong>Inyección Diaria:</strong> 1.60 L/día HNO₃ 55-60%.</li>
                          <li><strong>pH Solución Gotero:</strong> Calibrado a 5.8 – 6.2.</li>
                          <li><strong>Aporte Nutricional:</strong> N nítrico asimilable directo.</li>
                          <li><strong>Efecto Anti-Sarro:</strong> Disuelve incrustaciones de carbonatos.</li>
                        </ul>
                        <div className="p-2 bg-light rounded text-xxs font-mono text-muted">
                          Desbloquea el fósforo y micronutrientes al 100%.
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </div>
              )}

              {/* VISTA DOSIFICACIÓN GRANULADOS VENEZUELA */}
              {nutritionMode === 'granulado_ve' && (
                <div className="animate-fade-in">
                  <div className="table-responsive bg-white rounded border mb-3">
                    <Table hover size="sm" className="align-middle mb-0 font-sans text-xs">
                      <thead className="table-dark">
                        <tr>
                          <th>Etapa Fenológica</th>
                          <th>Semanas</th>
                          <th>Urea 46% (kg)</th>
                          <th>DAP 18-46-0 (kg)</th>
                          <th>K₂SO₄ 0-0-50 (kg)</th>
                          <th>Sulfato Mg (kg)</th>
                          <th>Forma de Aplicación en Campo</th>
                          <th>Riesgo Agronómico en Quíbor</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><Badge bg="info" text="dark">Enraizamiento</Badge></td>
                          <td className="font-mono">1 – 3</td>
                          <td className="font-mono fw-bold">4.5</td>
                          <td className="font-mono fw-bold">6.0</td>
                          <td className="font-mono fw-bold text-success">5.0</td>
                          <td className="font-mono fw-bold">3.0</td>
                          <td>Banda a 10 cm del tallo. Riego inmediato.</td>
                          <td><span className="text-warning">Quema de pelos absorbentes</span></td>
                        </tr>
                        <tr>
                          <td><Badge bg="success">Vegetativo</Badge></td>
                          <td className="font-mono">4 – 7</td>
                          <td className="font-mono fw-bold">9.0</td>
                          <td className="font-mono fw-bold">8.0</td>
                          <td className="font-mono fw-bold text-success">8.0</td>
                          <td className="font-mono fw-bold">4.0</td>
                          <td>Incorporado lateral. 2 aplicaciones / sem.</td>
                          <td><span className="text-warning">Salinización superficial</span></td>
                        </tr>
                        <tr>
                          <td><Badge bg="warning" text="dark">Floración</Badge></td>
                          <td className="font-mono">8 – 12</td>
                          <td className="font-mono fw-bold">8.0</td>
                          <td className="font-mono fw-bold">4.0</td>
                          <td className="font-mono fw-bold text-success">10.0</td>
                          <td className="font-mono fw-bold">5.0</td>
                          <td>Banda + aplicación foliar Boro 0.3 g/L.</td>
                          <td><span className="text-danger">P bloqueado en pH 7.4+: aborto floral</span></td>
                        </tr>
                        <tr>
                          <td><Badge bg="primary">Cosecha Pico</Badge></td>
                          <td className="font-mono">13 – 20</td>
                          <td className="font-mono fw-bold">10.0</td>
                          <td className="font-mono fw-bold">2.0</td>
                          <td className="font-mono fw-bold text-success">14.0</td>
                          <td className="font-mono fw-bold">6.0</td>
                          <td>Énfasis K₂SO₄. Monitorear CE radicular.</td>
                          <td><span className="text-warning">Maduración dispareja por exceso N</span></td>
                        </tr>
                        <tr className="table-light fw-bold font-mono">
                          <td colSpan={2}>TOTAL CONSUMO CICLO</td>
                          <td className="text-danger">34.5 kg</td>
                          <td className="text-danger">21.0 kg</td>
                          <td className="text-success">43.0 kg</td>
                          <td>20.0 kg</td>
                          <td colSpan={2} className="text-secondary font-sans font-normal">Costo total insumos: $480 – $620 USD</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                  <div className="p-2.5 rounded-3 bg-warning bg-opacity-10 border border-warning border-opacity-30 text-xs text-dark">
                    <strong>Advertencia de Mano de Obra:</strong> La aplicación de abonos granulados requiere 2 jornales adicionales semanales para voleo, aporque e incorporación manual, representando ~$384 USD adicionales en 24 semanas.
                  </div>
                </div>
              )}
            </Tab.Pane>

            {/* PESTAÑA 3: BALANCE HÍDRICO FAO-56 & CISTERNAS */}
            <Tab.Pane eventKey="fao56">
              <Card className="card-agro p-4 border bg-white shadow-sm">
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                  <div>
                    <h4 className="fs-6 fw-bold text-dark m-0">
                      Régimen de Riego FAO-56 &amp; Fertirriego por Pulsos Cortos en Quíbor
                    </h4>
                    <p className="text-secondary text-xs m-0">
                      Cálculo de lámina neta y bruta ajustada por evapotranspiración de referencia (ET₀ Quíbor = 4.8 – 6.2 mm/día).
                    </p>
                  </div>
                  <Badge bg="info" className="font-mono text-xs px-3 py-1.5 rounded-pill text-white">
                    Abastecimiento por Cisternas (10.000 L)
                  </Badge>
                </div>

                {/* Resumen Rápido de Litros y Cisternas por Fase */}
                <Row className="g-2 mb-3">
                  {faoPhases.map((phase, idx) => (
                    <Col xs={6} md={3} key={idx}>
                      <div className="p-2.5 rounded-3 bg-light border border-secondary-subtle text-center">
                        <span className="text-secondary text-3xs font-mono d-block text-truncate mb-1">{phase.weeks}</span>
                        <div className="fw-bold text-dark font-mono fs-6 text-primary">
                          {phase.volumeWeeklyLiters.split(' ')[0]}
                        </div>
                        <span className="text-muted text-3xs font-mono d-block">Litros / sem (nave)</span>
                        <span className="badge bg-white text-success border font-mono text-3xs mt-1 d-block">
                          {phase.litersPerPlantWeek.split(' ')[0]} L/pl/sem
                        </span>
                        <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 font-mono text-3xs mt-1 d-block">
                          {phase.cisternsPhaseTotal}
                        </span>
                      </div>
                    </Col>
                  ))}
                </Row>

                <div className="table-responsive">
                  <Table bordered hover className="text-xs align-middle mb-3">
                    <thead className="table-light font-mono">
                      <tr>
                        <th>Fase Fenológica</th>
                        <th>Período</th>
                        <th>Kc</th>
                        <th>Litros / Planta / Sem</th>
                        <th>Pulsos Diarios (Anti-Evaporación)</th>
                        <th>Cisternas de 10.000 L Requeridas</th>
                        <th>Litros Totales Nave (1.000 m²)</th>
                        <th>Estrategia & Nutrición Clave</th>
                      </tr>
                    </thead>
                    <tbody>
                      {faoPhases.map((phase, idx) => (
                        <tr key={idx}>
                          <td className="fw-bold text-dark font-sans">{phase.phase}</td>
                          <td className="font-mono text-secondary">{phase.weeks}</td>
                          <td className="font-mono fw-bold text-success">{phase.kc}</td>
                          <td className="font-mono text-dark">
                            <span className="fw-bold text-primary">{phase.litersPerPlantWeek}</span>
                            <span className="text-muted text-3xs d-block">({phase.litersPerPlantDay})</span>
                          </td>
                          <td className="font-mono">
                            <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 d-block mb-1">
                              {phase.pulses}
                            </span>
                            <span className="text-muted text-3xs font-mono">{phase.pulseLiters}</span>
                          </td>
                          <td className="font-mono text-center">
                            <strong className="text-dark d-block">{phase.cisternsPhaseTotal}</strong>
                            <span className="text-muted text-3xs font-mono">({phase.cisternsWeekly})</span>
                          </td>
                          <td className="font-mono">
                            <span className="fw-bold text-info">{phase.volumeWeeklyLiters}</span>
                            <span className="text-muted text-3xs d-block">({phase.volumeWeeklyM3})</span>
                          </td>
                          <td className="text-secondary text-xxs">{phase.focus}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                {/* Banner Técnico de Riego por Pulsos y Logística de Agua */}
                <div className="p-3 mb-3 rounded-3 bg-success bg-opacity-10 border border-success border-opacity-25 d-flex align-items-start gap-2 text-xs">
                  <span className="material-symbols-outlined text-success fs-5 mt-0.5">water_drop</span>
                  <div>
                    <strong className="text-success d-block mb-0.5 font-sans">
                      Sincronización de Riego de Alta Frecuencia con Fertirriego Hidrosoluble:
                    </strong>
                    <span className="text-dark opacity-90 font-sans">
                      En el clima semiárido de Quíbor (ET₀ 4.8 – 6.2 mm/día), la demanda neta total del ciclo de 20 semanas es de <strong>~740.000 Litros</strong> para las 2.500 plantas. Esto equivale a <strong>74 camiones cisterna de 10.000 L (+ 1 de reserva y purga de cabezal = 75 tanques cisternas en total)</strong> con un costo operativo consolidado de <strong>$1.850 USD ($25/cisterna)</strong>. El fraccionamiento en <strong>3 a 6 pulsos cortos (10–14 min)</strong> con goteros autocompensantes de 1.6 L/h inyecta simultáneamente las micro-dosis de sales AIFA solubles en el momento de máxima absorción transpiratoria, impidiendo la evaporación superficial o percolación profunda que arruinaría un abonado granulado tradicional.
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-3 bg-light border text-xs text-secondary d-flex flex-wrap justify-content-between align-items-center gap-2">
                  <div>
                    <strong className="text-dark">Balance Hídrico del Ciclo (20 semanas):</strong> ~740.000 Litros de agua tecnificada · <strong>74 a 75 cisternas de 10.000 L</strong> ($1.850 USD total de gasto de agua).
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
