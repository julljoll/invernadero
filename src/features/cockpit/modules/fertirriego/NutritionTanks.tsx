import React, { useState } from 'react';
import { Card, ButtonGroup, Button, Alert, Table, Row, Col } from 'react-bootstrap';
import { InlineMath } from 'react-katex';

export const NutritionTanks: React.FC = () => {
  const [activeTank, setActiveTank] = useState<'A' | 'B' | 'C'>('A');

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

        <ButtonGroup size="sm">
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
        </ButtonGroup>
      </div>

      {/* Alerta de Incompatibilidad Química */}
      <Alert variant="warning" className="border border-warning border-opacity-40 rounded-3 p-3 mb-3 d-flex align-items-start gap-2 text-xs">
        <span className="material-symbols-outlined text-warning ms-sm mt-0.5">warning</span>
        <div>
          <strong>Regla Agronómica de Incompatibilidad Química:</strong> NUNCA mezclar el <strong>Nitrato de Calcio</strong> del Tanque A con los <strong>Sulfatos y Fosfatos</strong> del Tanque B en forma concentrada. Se formaría un precipitado insoluble de Yeso (<InlineMath math="CaSO_4" />) y Fosfato Tricálcico que colapsaría el cabezal de filtrado y taponaría los goteros autocompensantes.
        </div>
      </Alert>

      {/* Tanque A */}
      {activeTank === 'A' && (
        <div className="p-3 bg-light rounded-3 border border-secondary-subtle">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <h5 className="fs-6 fw-bold text-dark mb-0">Tanque A — Volumen 500 Litros</h5>
              <span className="text-muted text-xs">Aporte de Calcio, Nitrógeno Nítrico y Hierro Quelado</span>
            </div>
            <span className="badge bg-primary text-white font-monospace px-2.5 py-1 text-xs">
              Total: 26.05 kg / semana (2.500 pl)
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
                  <td className="font-monospace fw-bold text-primary">18.00 kg/sem</td>
                  <td>Calcio móvil. Previene pudrición apical ("culillo") inducida por estrés salino.</td>
                </tr>
                <tr>
                  <td><strong>Nitrato de Potasio Soluble</strong></td>
                  <td className="font-monospace text-muted">13-0-46</td>
                  <td className="font-monospace fw-bold text-primary">7.50 kg/sem</td>
                  <td>Nitrógeno nítrico de asimilación rápida para calibre y grosor de pericarpio.</td>
                </tr>
                <tr>
                  <td><strong>Quelato de Hierro Fe-EDDHA 6%</strong></td>
                  <td className="font-monospace text-muted">orto-orto soluble</td>
                  <td className="font-monospace fw-bold text-primary">0.55 kg/sem (550 g)</td>
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
              Total: 40.45 kg / semana (2.500 pl)
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
                  <td className="font-monospace fw-bold text-success">15.00 kg/sem</td>
                  <td>Presión osmótica en frutos, grados Brix y consistencia de pared celular.</td>
                </tr>
                <tr>
                  <td><strong>Fosfato Monopotásico MKP</strong></td>
                  <td className="font-monospace text-muted">0-52-34</td>
                  <td className="font-monospace fw-bold text-success">5.00 kg/sem</td>
                  <td>Fósforo sin amonio libre, induce floración profusa y arquitectura radicular.</td>
                </tr>
                <tr>
                  <td><strong>Sulfato de Potasio K₂SO₄</strong></td>
                  <td className="font-monospace text-muted">0-0-50 + 18% S</td>
                  <td className="font-monospace fw-bold text-success">12.00 kg/sem</td>
                  <td>Potasio libre de cloro. Antagonista para reducir absorción de cloruros del pozo.</td>
                </tr>
                <tr>
                  <td><strong>Sulfato de Magnesio</strong></td>
                  <td className="font-monospace text-muted">16% MgO + 13% S</td>
                  <td className="font-monospace fw-bold text-success">8.00 kg/sem</td>
                  <td>Átomo central de clorofila. Mantiene fotosíntesis en insolación máxima.</td>
                </tr>
                <tr>
                  <td><strong>Boro Soluble (Octaborato)</strong></td>
                  <td className="font-monospace text-muted">20.5% B</td>
                  <td className="font-monospace fw-bold text-success">0.15 kg/sem (150 g)</td>
                  <td>Tubo polínico. Vital para cuajado y evitar caída de botones florales.</td>
                </tr>
                <tr>
                  <td><strong>Micronutrientes Quelatados</strong></td>
                  <td className="font-monospace text-muted">Mn, Zn, Cu, Mo</td>
                  <td className="font-monospace fw-bold text-success">0.30 kg/sem (300 g)</td>
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
              Consumo: 11.0 – 12.5 L / semana
            </span>
          </div>

          <Row className="g-3">
            <Col xs={12} md={4}>
              <div className="p-3 bg-white rounded border text-center">
                <span className="text-muted text-2xs d-block mb-1">Inyección Diaria:</span>
                <span className="fs-4 fw-bold font-monospace text-danger">1.60</span>
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
    </Card>
  );
};
