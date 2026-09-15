import React, { useState } from 'react';
import { Card, Row, Col, Badge, ProgressBar, Form } from 'react-bootstrap';
import { calculateDailyWaterBalance } from '../../../../core/agronomy/wellHydraulics';

interface WaterBalanceFlowProps {
  scenario: '60m' | '120m';
}

export const WaterBalanceFlow: React.FC<WaterBalanceFlowProps> = ({ scenario }) => {
  const is60m = scenario === '60m';
  const pumpFlowLs = is60m ? 2.0 : 2.8;

  // Sliders reactivos
  const [reservoirCapacityM3, setReservoirCapacityM3] = useState<number>(80);
  const [demandStage, setDemandStage] = useState<'estab' | 'veg' | 'flor' | 'pico'>('pico');
  const [surfaceAreaM2, setSurfaceAreaM2] = useState<number>(1000);

  // Demanda diaria según etapa
  const stageDailyLiters = {
    estab: 3000 * (surfaceAreaM2 / 1000),  // 3.0 mm/día
    veg: 4500 * (surfaceAreaM2 / 1000),    // 4.5 mm/día
    flor: 6000 * (surfaceAreaM2 / 1000),   // 6.0 mm/día
    pico: 7500 * (surfaceAreaM2 / 1000)    // 7.5 mm/día (Pico de calor en Quíbor con LF=25%)
  };

  const dailyDemandL = stageDailyLiters[demandStage];
  const dailyDemandM3 = dailyDemandL / 1000;

  const balance = calculateDailyWaterBalance({
    pumpFlowLs,
    dailyDemandM3,
    reservoirCapacityM3
  });

  return (
    <Card className="border-0 shadow-sm bg-light">
      <Card.Body className="p-3">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <span className="material-symbols-outlined text-primary fs-5">sync_alt</span>
            <span className="fw-bold text-dark small">Balance Hídrico Diario: Pozo ➔ Bombeo ➔ Reservorio ➔ Nave</span>
          </div>
          <Badge bg="primary" className="text-xs">
            Demanda Actual: {dailyDemandM3.toFixed(1)} m³/día ({dailyDemandL.toLocaleString()} L/día)
          </Badge>
        </div>

        {/* Controles interactivos */}
        <div className="bg-white p-3 rounded border mb-3 shadow-xs">
          <Row className="g-3 align-items-center text-xs">
            <Col xs={12} md={4}>
              <Form.Label className="fw-bold text-dark d-flex justify-content-between mb-1">
                <span>Capacidad Reservorio:</span>
                <span className="text-primary font-monospace">{reservoirCapacityM3} m³</span>
              </Form.Label>
              <Form.Range
                min={20}
                max={150}
                step={5}
                value={reservoirCapacityM3}
                onChange={e => setReservoirCapacityM3(Number(e.target.value))}
              />
              <div className="d-flex justify-content-between text-2xs text-muted">
                <span>20 m³</span>
                <span>80 m³ (Diseño)</span>
                <span>150 m³</span>
              </div>
            </Col>

            <Col xs={12} md={4}>
              <Form.Label className="fw-bold text-dark mb-1">Etapa Fenológica & Demanda:</Form.Label>
              <Form.Select
                size="sm"
                value={demandStage}
                onChange={e => setDemandStage(e.target.value as any)}
                className="font-sans"
              >
                <option value="estab">01. Establecimiento (Kc=0.60 | 3.0 m³/día)</option>
                <option value="veg">02. Vegetativo (Kc=0.80 | 4.5 m³/día)</option>
                <option value="flor">03. Floración (Kc=1.05 | 6.0 m³/día)</option>
                <option value="pico">04. Plena Cosecha / Calor Pico (Kc=1.15 | 7.5 m³/día)</option>
              </Form.Select>
            </Col>

            <Col xs={12} md={4}>
              <Form.Label className="fw-bold text-dark mb-1">Área de Producción:</Form.Label>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className={`btn btn-sm flex-fill ${surfaceAreaM2 === 1000 ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setSurfaceAreaM2(1000)}
                >
                  1.000 m² (Nave 1)
                </button>
                <button
                  type="button"
                  className={`btn btn-sm flex-fill ${surfaceAreaM2 === 2000 ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setSurfaceAreaM2(2000)}
                >
                  2.000 m² (2 Naves)
                </button>
              </div>
            </Col>
          </Row>
        </div>

        {/* Diagrama de Flujo Tipo Sankey Simplificado */}
        <Row className="g-2 text-center text-xs font-sans">
          {/* Nodo 1: Pozo */}
          <Col xs={12} md={3}>
            <div className="p-3 bg-white rounded border h-100 shadow-xs d-flex flex-column justify-content-between">
              <div>
                <span className="material-symbols-outlined text-info fs-4">water_drop</span>
                <h6 className="fw-bold text-dark mb-1">1. Pozo Fuste</h6>
                <span className="badge bg-info-subtle text-info border border-info-subtle">
                  Q = {pumpFlowLs} L/s ({balance.pumpFlowM3H} m³/h)
                </span>
              </div>
              <div className="mt-3 pt-2 border-top text-2xs text-secondary">
                <div>Capacidad 24h: <strong>{balance.pozoDailyCapacityM3} m³</strong></div>
                <div>Buffer inmediato: <strong>~3.800 L</strong></div>
              </div>
            </div>
          </Col>

          {/* Nodo 2: Bombeo Diario */}
          <Col xs={12} md={3}>
            <div className="p-3 bg-white rounded border h-100 shadow-xs d-flex flex-column justify-content-between">
              <div>
                <span className="material-symbols-outlined text-success fs-4">timer</span>
                <h6 className="fw-bold text-dark mb-1">2. Tiempo de Bombeo</h6>
                <span className="badge bg-success-subtle text-success border border-success-subtle fs-6">
                  {balance.pumpingHoursNeeded} h/día
                </span>
                <div className="text-2xs text-muted mt-1">({balance.pumpingMinutesNeeded} minutos continuos)</div>
              </div>
              <div className="mt-3 pt-2 border-top text-2xs text-secondary">
                <div>Uso diario pozo: <strong>{balance.utilizationPercent}%</strong></div>
                <div>Reposo acuífero: <strong>{balance.restHoursPerDay} h/día</strong></div>
              </div>
            </div>
          </Col>

          {/* Nodo 3: Reservorio */}
          <Col xs={12} md={3}>
            <div className="p-3 bg-white rounded border h-100 shadow-xs d-flex flex-column justify-content-between">
              <div>
                <span className="material-symbols-outlined text-primary fs-4">database</span>
                <h6 className="fw-bold text-dark mb-1">3. Reservorio Pulmón</h6>
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle fs-6">
                  {balance.autonomyDays} días
                </span>
                <div className="text-2xs text-muted mt-1">de autonomía total sin bombeo</div>
              </div>
              <div className="mt-3 pt-2 border-top">
                <ProgressBar
                  now={Math.min(100, (balance.autonomyDays / 15) * 100)}
                  variant={balance.autonomyDays >= 5 ? 'success' : balance.autonomyDays >= 3 ? 'warning' : 'danger'}
                  style={{ height: '6px' }}
                  className="mb-1"
                />
                <span className="text-2xs text-secondary">
                  Capacidad de diseño: {reservoirCapacityM3} m³
                </span>
              </div>
            </div>
          </Col>

          {/* Nodo 4: Riego por Goteo */}
          <Col xs={12} md={3}>
            <div className="p-3 bg-white rounded border h-100 shadow-xs d-flex flex-column justify-content-between">
              <div>
                <span className="material-symbols-outlined text-warning fs-4">agriculture</span>
                <h6 className="fw-bold text-dark mb-1">4. Goteo de Nave</h6>
                <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle">
                  2 Sectores de Riego
                </span>
                <div className="text-2xs text-muted mt-1">Goteros autocompensantes 1.6 L/h</div>
              </div>
              <div className="mt-3 pt-2 border-top text-2xs text-secondary">
                <div>Gasto sector: <strong>~3.75 m³/h</strong></div>
                <div>Tiempo de riego: <strong>~1.0 h/sector</strong></div>
              </div>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};
