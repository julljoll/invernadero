import React, { useState } from 'react';
import { Card, ButtonGroup, Button, Alert, Table, Row, Col, Badge } from 'react-bootstrap';
import { InlineMath } from 'react-katex';

type TankView = 'A' | 'B' | 'C' | 'GRAN';

export const NutritionTanks: React.FC = () => {
  const [activeTank, setActiveTank] = useState<TankView>('A');

  return (
    <Card className="card-cockpit p-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3 pb-2 border-bottom border-secondary-subtle">
        <div>
          <h3 className="fs-6 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <span className="material-symbols-outlined text-primary ms-sm">science</span>
            <span>Tanques de Solución Nutritiva Madre (A, B y C) — Formulación AIFA</span>
          </h3>
          <span className="text-secondary small font-sans">
            Preparación concentrada 100:1 para inyección mediante Venturi / Dosatron en Quíbor
          </span>
        </div>

        <ButtonGroup size="sm" className="flex-wrap">
          <Button
            variant={activeTank === 'A' ? 'primary' : 'outline-secondary'}
            onClick={() => setActiveTank('A')}
            className="fw-bold px-3 text-xs"
          >
            Tanque A (500L · Ca & Fe)
          </Button>
          <Button
            variant={activeTank === 'B' ? 'success' : 'outline-secondary'}
            onClick={() => setActiveTank('B')}
            className="fw-bold px-3 text-xs"
          >
            Tanque B (500L · P, K, Mg & Micros)
          </Button>
          <Button
            variant={activeTank === 'C' ? 'danger' : 'outline-secondary'}
            onClick={() => setActiveTank('C')}
            className="fw-bold px-3 text-xs"
          >
            Tanque C (200L · Ácido Nítrico)
          </Button>
          <Button
            variant={activeTank === 'GRAN' ? 'warning' : 'outline-secondary'}
            onClick={() => setActiveTank('GRAN')}
            className="fw-bold px-3 text-xs"
          >
            ⚖️ Equivalencia Granulada VE
          </Button>
        </ButtonGroup>
      </div>

      {/* Alerta de Incompatibilidad Química — Solo en vistas de tanques AIFA */}
      {activeTank !== 'GRAN' && (
        <Alert variant="warning" className="border border-warning border-opacity-40 rounded-3 p-3 mb-3 d-flex align-items-start gap-2 text-xs">
          <span className="material-symbols-outlined text-warning ms-sm mt-0.5">warning</span>
          <div>
            <strong>Regla Agronómica de Incompatibilidad Química:</strong> NUNCA mezclar el <strong>Nitrato de Calcio</strong> del Tanque A con los <strong>Sulfatos y Fosfatos</strong> del Tanque B en forma concentrada. Se formaría un precipitado insoluble de Yeso (<InlineMath math="CaSO_4" />) y Fosfato Tricálcico que colapsaría el cabezal de filtrado y taponaría los goteros autocompensantes.
          </div>
        </Alert>
      )}

      {/* Tanque A */}
      {activeTank === 'A' && (
        <div className="p-3 bg-light rounded-3 border border-secondary-subtle">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <h5 className="fs-6 fw-bold text-dark mb-0">Tanque A — Volumen 500 Litros</h5>
              <span className="text-muted text-xs">Aporte de Calcio, Nitrógeno Nítrico y Hierro Quelado</span>
            </div>
            <span className="badge bg-primary text-white font-monospace px-2.5 py-1 text-xs">
              Total: 36.47 kg / semana (3.500 pl)
            </span>
          </div>

          <div className="table-responsive bg-white rounded border">
            <Table hover size="sm" className="align-middle mb-0 font-sans text-xs">
              <thead className="table-light">
                <tr>
                  <th>Fertilizante AIFA Soluble</th>
                  <th>Fórmula / Composición</th>
                  <th>Dosis Semanal</th>
                  <th>Función Agronómica Clave en Quíbor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Nitrato de Calcio AIFA</strong></td>
                  <td className="font-monospace text-muted">15.5-0-0 + 26% CaO</td>
                  <td className="font-monospace fw-bold text-primary">25.20 kg/sem</td>
                  <td>Calcio móvil. Previene pudrición apical ("culillo") inducida por estrés salino.</td>
                </tr>
                <tr>
                  <td><strong>Nitrato de Potasio Soluble</strong></td>
                  <td className="font-monospace text-muted">13-0-46</td>
                  <td className="font-monospace fw-bold text-primary">10.50 kg/sem</td>
                  <td>Nitrógeno nítrico de asimilación rápida para calibre y grosor de pericarpio.</td>
                </tr>
                <tr>
                  <td><strong>Quelato de Hierro Fe-EDDHA 6%</strong></td>
                  <td className="font-monospace text-muted">orto-orto soluble</td>
                  <td className="font-monospace fw-bold text-primary">0.77 kg/sem (770 g)</td>
                  <td>Estable en pH alcalino (7.4 - 7.8) de Quíbor. Previene clorosis férrica.</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      )}

      {/* Tanque B */}
      {activeTank === 'B' && (
        <div className="p-3 bg-light rounded-3 border border-secondary-subtle">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <h5 className="fs-6 fw-bold text-dark mb-0">Tanque B — Volumen 500 Litros</h5>
              <span className="text-muted text-xs">Fósforo, Potasio, Magnesio, Azufre y Microelementos</span>
            </div>
            <span className="badge bg-success text-white font-monospace px-2.5 py-1 text-xs">
              Total: 56.63 kg / semana (3.500 pl)
            </span>
          </div>

          <div className="table-responsive bg-white rounded border">
            <Table hover size="sm" className="align-middle mb-0 font-sans text-xs">
              <thead className="table-light">
                <tr>
                  <th>Fertilizante AIFA Soluble</th>
                  <th>Fórmula / Composición</th>
                  <th>Dosis Semanal</th>
                  <th>Función Agronómica Clave en Quíbor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Nitrato de Potasio Soluble</strong></td>
                  <td className="font-monospace text-muted">13-0-46</td>
                  <td className="font-monospace fw-bold text-success">21.00 kg/sem</td>
                  <td>Presión osmótica en frutos, grados Brix y consistencia de pared celular.</td>
                </tr>
                <tr>
                  <td><strong>Fosfato Monopotásico MKP</strong></td>
                  <td className="font-monospace text-muted">0-52-34</td>
                  <td className="font-monospace fw-bold text-success">7.00 kg/sem</td>
                  <td>Fósforo sin amonio libre, induce floración profusa y arquitectura radicular.</td>
                </tr>
                <tr>
                  <td><strong>Sulfato de Potasio K₂SO₄</strong></td>
                  <td className="font-monospace text-muted">0-0-50 + 18% S</td>
                  <td className="font-monospace fw-bold text-success">16.80 kg/sem</td>
                  <td>Potasio libre de cloro. Antagonista para reducir absorción de cloruros del pozo.</td>
                </tr>
                <tr>
                  <td><strong>Sulfato de Magnesio</strong></td>
                  <td className="font-monospace text-muted">16% MgO + 13% S</td>
                  <td className="font-monospace fw-bold text-success">11.20 kg/sem</td>
                  <td>Átomo central de clorofila. Mantiene fotosíntesis en insolación máxima.</td>
                </tr>
                <tr>
                  <td><strong>Boro Soluble (Octaborato)</strong></td>
                  <td className="font-monospace text-muted">20.5% B</td>
                  <td className="font-monospace fw-bold text-success">0.21 kg/sem (210 g)</td>
                  <td>Tubo polínico. Vital para cuajado y evitar caída de botones florales.</td>
                </tr>
                <tr>
                  <td><strong>Micronutrientes Quelatados</strong></td>
                  <td className="font-monospace text-muted">Mn, Zn, Cu, Mo</td>
                  <td className="font-monospace fw-bold text-success">0.42 kg/sem (420 g)</td>
                  <td>Cofactores enzimáticos para amortiguar estrés de bochorno y calor.</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      )}

      {/* Tanque C */}
      {activeTank === 'C' && (
        <div className="p-3 bg-light rounded-3 border border-secondary-subtle">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="fs-6 fw-bold text-dark mb-0">Tanque C — Volumen 200 Litros (Ácido Nítrico)</h5>
              <span className="text-muted text-xs">Neutralización de Bicarbonatos y Calibración de pH a 5.8 - 6.2</span>
            </div>
            <span className="badge bg-danger text-white font-monospace px-2.5 py-1 text-xs">
              Consumo: 15.4 – 17.5 L / semana
            </span>
          </div>

          <Row className="g-3">
            <Col xs={12} md={4}>
              <div className="p-3 bg-white rounded border text-center">
                <span className="text-muted text-2xs d-block mb-1">Inyección Diaria:</span>
                <span className="fs-4 fw-bold font-monospace text-danger">2.24</span>
                <span className="text-muted text-xs ms-1">L/día</span>
                <span className="d-block text-3xs text-secondary mt-1">HNO₃ 55% comercial</span>
              </div>
            </Col>
            <Col xs={12} md={4}>
              <div className="p-3 bg-white rounded border text-center">
                <span className="text-muted text-2xs d-block mb-1">Bicarbonatos a Neutralizar:</span>
                <span className="fs-4 fw-bold font-monospace text-dark">3.5</span>
                <span className="text-muted text-xs ms-1">meq/L</span>
                <span className="d-block text-3xs text-secondary mt-1">Deja 0.5 meq/L tampón buffer</span>
              </div>
            </Col>
            <Col xs={12} md={4}>
              <div className="p-3 bg-white rounded border text-center">
                <span className="text-muted text-2xs d-block mb-1">pH Solución Gotero:</span>
                <span className="fs-4 fw-bold font-monospace text-success">5.8 – 6.2</span>
                <span className="text-muted text-xs ms-1">pH</span>
                <span className="d-block text-3xs text-secondary mt-1">Máxima solubilidad P y micros</span>
              </div>
            </Col>
          </Row>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          VISTA: EQUIVALENCIA GRANULADA VENEZOLANA (K₂SO₄ como fuente de K)
          ══════════════════════════════════════════════════════════ */}
      {activeTank === 'GRAN' && (
        <div className="animate-fade-in">
          {/* Banner informativo */}
          <Alert variant="info" className="border border-info border-opacity-40 rounded-3 p-3 mb-3 d-flex align-items-start gap-2 text-xs">
            <span className="material-symbols-outlined text-info ms-sm mt-0.5">info</span>
            <div>
              <strong>Equivalencia de Campo — Fertilizantes Granulados Venezuela (Fuente K: K₂SO₄ sin Cloro):</strong>{' '}
              Esta tabla muestra los productos granulados disponibles en agropecuarias de Lara / Barquisimeto que sustituyen parcialmente a la formulación AIFA. El{' '}
              <strong>Sulfato de Potasio (K₂SO₄)</strong> se usa como fuente de K porque, a diferencia del KCl, <strong>no aporta Cloro</strong> que agrevaría la salinidad del agua de pozo de Quíbor (CE<sub>w</sub> &gt; 1.5 dS/m). Su limitación principal es la{' '}
              <strong>baja eficiencia en suelos básicos (pH &gt; 7.0)</strong> para P y microelementos.
            </div>
          </Alert>

          {/* Tabla Comparativa de Equivalencias */}
          <div className="mb-4">
            <h5 className="fs-6 fw-bold text-dark mb-2 d-flex align-items-center gap-2">
              <span className="material-symbols-outlined text-warning ms-sm">compare_arrows</span>
              Tabla de Equivalencias: AIFA Soluble vs Granulado Venezolano
            </h5>
            <div className="table-responsive bg-white rounded border">
              <Table hover size="sm" className="align-middle mb-0 font-sans text-xs">
                <thead className="table-warning">
                  <tr>
                    <th>Función Nutricional</th>
                    <th>Producto AIFA Soluble</th>
                    <th>Equivalente Granulado Venezuela</th>
                    <th>Composición</th>
                    <th>Precio Ref.</th>
                    <th>Observación Quíbor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><Badge bg="primary" className="text-xs">Ca + N</Badge></td>
                    <td><strong>Nitrato de Calcio AIFA</strong> <span className="text-muted font-monospace text-xs">15.5-0-0 + 26% CaO</span></td>
                    <td>Nitrato de Calcio granulado (import. re-envasado)</td>
                    <td className="font-monospace text-muted">15-0-0 + 25% Ca</td>
                    <td className="font-monospace">$0.55/kg</td>
                    <td>
                      <Badge bg="success" className="text-xs">✓ Compatible</Badge>{' '}
                      Soluble en agua. Disponible en Agropecuarias Lara.
                    </td>
                  </tr>
                  <tr>
                    <td><Badge bg="secondary" className="text-xs">N orgánico</Badge></td>
                    <td><em className="text-muted">No aplica AIFA</em></td>
                    <td><strong>Urea granulada 46-0-0</strong></td>
                    <td className="font-monospace text-muted">46-0-0</td>
                    <td className="font-monospace">$0.28/kg</td>
                    <td>
                      <Badge bg="warning" text="dark" className="text-xs">⚠ Riesgo</Badge>{' '}
                      Volatiliza N como NH₃ &gt;28 °C. Aplicar al atardecer y regar de inmediato.
                    </td>
                  </tr>
                  <tr>
                    <td><Badge bg="warning" text="dark" className="text-xs">P</Badge></td>
                    <td><strong>MKP AIFA</strong> <span className="text-muted font-monospace text-xs">0-52-34</span></td>
                    <td><strong>DAP (Fosfato Diamónico)</strong></td>
                    <td className="font-monospace text-muted">18-46-0</td>
                    <td className="font-monospace">$0.65/kg</td>
                    <td>
                      <Badge bg="danger" className="text-xs">✗ Limitado</Badge>{' '}
                      P se fija en suelos básicos (pH 7.4+). Requiere acidificación previa. DAP aporta NH₄ que compete con Ca.
                    </td>
                  </tr>
                  <tr className="table-success">
                    <td><Badge bg="success" className="text-xs">K (sin Cl)</Badge></td>
                    <td><strong>K₂SO₄ AIFA</strong> <span className="text-muted font-monospace text-xs">0-0-50+18%S</span></td>
                    <td>
                      <strong>Sulfato de Potasio K₂SO₄</strong>
                      <Badge bg="success" className="ms-1 text-xs">⭐ Selección</Badge>
                    </td>
                    <td className="font-monospace text-muted">0-0-50 + 18% S</td>
                    <td className="font-monospace">$0.85/kg</td>
                    <td>
                      <Badge bg="success" className="text-xs">✓ Recomendado</Badge>{' '}
                      Sin Cloro. Compatible con agua salina de Quíbor. Aporta S beneficioso. Menos disponible pero preferible.
                    </td>
                  </tr>
                  <tr>
                    <td><Badge bg="info" text="dark" className="text-xs">Mg</Badge></td>
                    <td><strong>Sulfato Mg Hepta AIFA</strong> <span className="text-muted font-monospace text-xs">16% MgO</span></td>
                    <td><strong>Sulfato de Magnesio granulado (Sal de Epsom)</strong></td>
                    <td className="font-monospace text-muted">16% MgO + 13% S</td>
                    <td className="font-monospace">$0.30/kg</td>
                    <td>
                      <Badge bg="success" className="text-xs">✓ Compatible</Badge>{' '}
                      Soluble. Mismo compuesto que la versión AIFA. Disponible en tiendas agropecuarias.
                    </td>
                  </tr>
                  <tr>
                    <td><Badge bg="danger" className="text-xs">Fe</Badge></td>
                    <td><strong>Quelato Fe-EDDHA 6% AIFA</strong></td>
                    <td>Sulfato Ferroso 20% + aplicación foliar ácida</td>
                    <td className="font-monospace text-muted">20% Fe</td>
                    <td className="font-monospace">$0.40/kg</td>
                    <td>
                      <Badge bg="danger" className="text-xs">✗ Ineficiente</Badge>{' '}
                      El Fe se precipita en pH &gt; 6.5. Sin quelato EDTA/EDDHA, la absorción cae &gt;70% en Quíbor.
                    </td>
                  </tr>
                  <tr>
                    <td><Badge bg="secondary" className="text-xs">B</Badge></td>
                    <td><strong>Octaborato Soluble AIFA</strong> <span className="text-muted font-monospace text-xs">20.5% B</span></td>
                    <td>Bórax granulado o solución foliar de Boro</td>
                    <td className="font-monospace text-muted">11% B</td>
                    <td className="font-monospace">$2.50/kg</td>
                    <td>
                      <Badge bg="warning" text="dark" className="text-xs">⚠ Parcial</Badge>{' '}
                      El Bórax es menos soluble. Aplicar foliar en floración pico (sem 8-12).
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </div>

          {/* Programa de Dosificación Granulado por Etapa Fenológica */}
          <div className="mb-4">
            <h5 className="fs-6 fw-bold text-dark mb-2 d-flex align-items-center gap-2">
              <span className="material-symbols-outlined text-warning ms-sm">schedule</span>
              Programa de Dosificación Granulado — 3.500 Plantas / 1.000 m²
            </h5>
            <div className="table-responsive bg-white rounded border">
              <Table hover size="sm" className="align-middle mb-0 font-sans text-xs">
                <thead className="table-dark">
                  <tr>
                    <th>Etapa</th>
                    <th>Semanas</th>
                    <th>Urea 46% (kg)</th>
                    <th>DAP 18-46-0 (kg)</th>
                    <th>K₂SO₄ 0-0-50 (kg)</th>
                    <th>Sul. Mg (kg)</th>
                    <th>Modo de Aplicación</th>
                    <th>Riesgo Principal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><Badge bg="info" text="dark">Enraizamiento</Badge></td>
                    <td className="font-monospace">1 – 3</td>
                    <td className="font-monospace fw-bold">6.3</td>
                    <td className="font-monospace fw-bold">8.4</td>
                    <td className="font-monospace fw-bold">7.0</td>
                    <td className="font-monospace fw-bold">4.2</td>
                    <td>Banda lateral a 10 cm del tallo. Regar inmediato.</td>
                    <td><Badge bg="warning" text="dark" className="text-xs">Quema radicular si lluvia</Badge></td>
                  </tr>
                  <tr>
                    <td><Badge bg="success">Vegetativo</Badge></td>
                    <td className="font-monospace">4 – 7</td>
                    <td className="font-monospace fw-bold">12.6</td>
                    <td className="font-monospace fw-bold">11.2</td>
                    <td className="font-monospace fw-bold">11.2</td>
                    <td className="font-monospace fw-bold">5.6</td>
                    <td>Incorporar en banda. 2 aplicaciones / semana.</td>
                    <td><Badge bg="warning" text="dark" className="text-xs">Salinidad superficial acumulada</Badge></td>
                  </tr>
                  <tr>
                    <td><Badge bg="warning" text="dark">Floración</Badge></td>
                    <td className="font-monospace">8 – 12</td>
                    <td className="font-monospace fw-bold">11.2</td>
                    <td className="font-monospace fw-bold">5.6</td>
                    <td className="font-monospace fw-bold">14.0</td>
                    <td className="font-monospace fw-bold">7.0</td>
                    <td>Reducir N, elevar K₂SO₄. Foliar de Boro 0.3 g/L.</td>
                    <td><Badge bg="danger" className="text-xs">P fijado en pH 7.4+: aborto floral</Badge></td>
                  </tr>
                  <tr>
                    <td><Badge bg="primary">Cosecha Pico</Badge></td>
                    <td className="font-monospace">13 – 20</td>
                    <td className="font-monospace fw-bold">14.0</td>
                    <td className="font-monospace fw-bold">2.8</td>
                    <td className="font-monospace fw-bold">19.6</td>
                    <td className="font-monospace fw-bold">8.4</td>
                    <td>Énfasis en K₂SO₄. Monitorear CE con conductímetro.</td>
                    <td><Badge bg="warning" text="dark" className="text-xs">Maduración desuniforme por exceso N tardío</Badge></td>
                  </tr>
                  <tr>
                    <td><Badge bg="secondary">Cierre / Pos-cosecha</Badge></td>
                    <td className="font-monospace">21 – 24</td>
                    <td className="font-monospace fw-bold">4.2</td>
                    <td className="font-monospace fw-bold">1.4</td>
                    <td className="font-monospace fw-bold">8.4</td>
                    <td className="font-monospace fw-bold">2.8</td>
                    <td>Reducir dosis. Lavar suelo con agua limpia (lixiviación).</td>
                    <td><Badge bg="secondary" className="text-xs">Acumulación de sales en cama</Badge></td>
                  </tr>
                  <tr className="table-light fw-bold">
                    <td colSpan={2}><strong>TOTAL CICLO</strong></td>
                    <td className="font-monospace text-danger">48.3 kg</td>
                    <td className="font-monospace text-danger">29.4 kg</td>
                    <td className="font-monospace text-success">60.2 kg</td>
                    <td className="font-monospace">28.0 kg</td>
                    <td colSpan={2} className="text-secondary text-xs">Costo estimado: $670 – $860 USD (sin M.O.)</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </div>

          {/* Comparativa de Resultado Agronómico y Económico */}
          <Row className="g-3 mb-3">
            <Col xs={12} md={6}>
              <div className="p-3 bg-white rounded-3 border border-secondary-subtle h-100">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-secondary ms-md">trending_down</span>
                  <h6 className="fw-bold text-dark mb-0 text-xs text-uppercase">Plan Granulado Venezolano (K₂SO₄)</h6>
                </div>
                <ul className="list-unstyled text-xs text-secondary d-flex flex-column gap-1 mb-2">
                  <li>• Inversión fertilizantes: <strong className="text-dark">$670 – $860 USD / ciclo</strong></li>
                  <li>• Control de CE radicular: <strong className="text-danger">❌ No controlado</strong></li>
                  <li>• Rendimiento proy.: <strong className="text-dark">2.5 – 3.5 kg/planta</strong></li>
                  <li>• % Cesta Grande (&gt;220g): <strong className="text-warning">35 – 50%</strong></li>
                  <li>• % Maraña (&lt;100g): <strong className="text-danger">25 – 35%</strong></li>
                  <li>• Fe disponible en pH 7.4: <strong className="text-danger">❌ Clorosis frecuente</strong></li>
                  <li>• Mano de obra extra aplicación: <strong className="text-warning">+2 jornales/semana</strong></li>
                  <li>• Ingreso neto estimado: <strong className="text-secondary">$4.000 USD / ciclo</strong></li>
                </ul>
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className="p-3 bg-success bg-opacity-10 rounded-3 border border-success border-opacity-40 h-100">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-success ms-md">trending_up</span>
                  <h6 className="fw-bold text-dark mb-0 text-xs text-uppercase">Plan AIFA Hidrosoluble (Referencia)</h6>
                </div>
                <ul className="list-unstyled text-xs text-secondary d-flex flex-column gap-1 mb-2">
                  <li>• Inversión fertilizantes: <strong className="text-dark">$1.930 USD / ciclo (A+B)</strong></li>
                  <li>• Control de CE radicular: <strong className="text-success">✅ Preciso 1.5–2.5 dS/m</strong></li>
                  <li>• Rendimiento proy.: <strong className="text-dark">5.0 kg/planta</strong></li>
                  <li>• % Cesta Grande (&gt;220g): <strong className="text-success">75 – 80%</strong></li>
                  <li>• % Maraña (&lt;100g): <strong className="text-success">0% (Erradicada)</strong></li>
                  <li>• Fe disponible: <strong className="text-success">✅ Quelato EDDHA activo pH 7.8</strong></li>
                  <li>• Mano de obra aplicación: <strong className="text-success">Automatizado — goteo</strong></li>
                  <li>• Ingreso neto estimado: <strong className="text-success">$8.892 USD / ciclo</strong></li>
                </ul>
                <div className="mt-2 p-2 bg-success bg-opacity-10 rounded border border-success border-opacity-30 text-center">
                  <span className="fs-5 fw-bold font-monospace text-success">+$4.892 USD</span>
                  <span className="text-success text-xs d-block">más ganancia vs granulado · ROI: 2.8×</span>
                </div>
              </div>
            </Col>
          </Row>

          {/* Nota sobre mano de obra */}
          <Alert variant="secondary" className="rounded-3 p-3 text-xs d-flex align-items-start gap-2">
            <span className="material-symbols-outlined text-secondary ms-sm mt-0.5">person</span>
            <div>
              <strong>Consideración Económica Real:</strong> El plan granulado requiere <strong>+2 jornales adicionales por semana</strong> para aplicación manual en banda (distribución, incorporación y riego posterior). A $8 USD/jornal y 24 semanas, esto agrega ~$384 USD al costo operativo, reduciendo aún más la ventaja económica aparente del granulado.
            </div>
          </Alert>
        </div>
      )}

      {/* Referencia Técnica UF/IFAS — Solo en vistas de tanques AIFA */}
      {activeTank !== 'GRAN' && (
        <div className="mt-3 p-3 bg-white rounded-3 border border-info border-opacity-30">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-info text-dark font-sans text-3xs fw-bold">REF. UF/IFAS HS228</span>
              <span className="fw-bold text-dark text-xs">Parámetros Canónicos de Fertirriego en Pimentón Protegido</span>
            </div>
            <span className="text-muted text-3xs">Doc. RAG: PROD-003</span>
          </div>

          <Row className="g-2 text-xs">
            <Col xs={12} md={6}>
              <div className="p-2.5 bg-light rounded border border-secondary-subtle">
                <span className="fw-bold text-dark d-block mb-1 text-2xs">Concentraciones Elementales Objetivo (Plena Producción):</span>
                <div className="d-flex flex-wrap gap-2 text-3xs font-monospace">
                  <span className="badge bg-white text-dark border">N: 160 ppm</span>
                  <span className="badge bg-white text-dark border">P: 50 ppm</span>
                  <span className="badge bg-white text-dark border">K: 200 ppm</span>
                  <span className="badge bg-white text-dark border">Ca: 190 ppm</span>
                  <span className="badge bg-white text-dark border">Mg: 48 ppm</span>
                  <span className="badge bg-white text-dark border">S: 65 ppm</span>
                </div>
                <span className="text-muted text-3xs d-block mt-1">
                  Conductividad eléctrica objetivo: 1.5 a 2.5 dS/m | Drenaje / Lixiviación: 15% – 20%
                </span>
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className="p-2.5 bg-light rounded border border-secondary-subtle">
                <span className="fw-bold text-dark d-block mb-1 text-2xs">Protocolo Clave: Prevención de "Elephant's Foot" (Pie de Elefante):</span>
                <ul className="mb-0 ps-3 text-3xs text-secondary">
                  <li>Trasplantar plántula (35 días) enterrando el cepellón hasta el 1er nudo foliar verdadero.</li>
                  <li>Alejar los emisores de gotero a 5 – 8 cm (2-3") del tallo durante las primeras 3 semanas para evitar acumulación de sales y encharcamiento basal que atrae <em>Fusarium</em>.</li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>
      )}
    </Card>
  );
};
