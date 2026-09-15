import React, { useState } from 'react';
import { Card, Row, Col, Badge, Form, ProgressBar } from 'react-bootstrap';
import { calculateVentilation } from '../../../../core/engineering/ventilation';

export const VentilationRahCalculator: React.FC = () => {
  const [baseWindKmH, setBaseWindKmH] = useState<number>(10.4);
  const [ridgeHeightM, setRidgeHeightM] = useState<number>(5.5);
  const [numTurbines, setNumTurbines] = useState<number>(8);
  const [turbineDiameter, setTurbineDiameter] = useState<24 | 30 | 36>(24);

  const ventResult = calculateVentilation({
    ridgeHeightM,
    lengthM: 40,
    widthM: 25,
    gutterHeightM: 3.5,
    baseWindSpeed10mKmH: baseWindKmH,
    numWindTurbines: numTurbines,
    turbineDiameterInches: turbineDiameter
  });

  const isOptimal = ventResult.airChangesPerHour >= 45;
  const isModerate = ventResult.airChangesPerHour >= 25 && ventResult.airChangesPerHour < 45;

  return (
    <Card className="border-0 shadow-sm bg-light h-100">
      <Card.Body className="p-3 d-flex flex-column justify-content-between">
        <div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="d-flex align-items-center gap-2">
              <span className="material-symbols-outlined text-success fs-5">air</span>
              <span className="fw-bold text-dark small">Calculadora de Renovación de Aire (RAH) & Hellmann</span>
            </div>
            <Badge
              bg={isOptimal ? 'success' : isModerate ? 'warning' : 'danger'}
              className="text-2xs px-2"
            >
              {isOptimal ? 'RAH Óptimo (≥45 h⁻¹)' : isModerate ? 'RAH Aceptable' : 'Peligro Sobrecalentamiento'}
            </Badge>
          </div>

          <p className="text-secondary text-2xs mb-3">
            Simulador de ventilación convectiva natural con malla 50 mesh (Cd=0.24) y extractores eólicos de cumbrera.
          </p>

          {/* Sliders Interactivos */}
          <div className="bg-white p-3 rounded border shadow-xs mb-3">
            <Row className="g-3 text-xs">
              <Col xs={12} sm={6}>
                <Form.Label className="d-flex justify-content-between mb-1 fw-bold text-dark">
                  <span>Viento a 10m:</span>
                  <span className="text-primary font-monospace">{baseWindKmH.toFixed(1)} km/h</span>
                </Form.Label>
                <Form.Range
                  min={5}
                  max={27}
                  step={0.5}
                  value={baseWindKmH}
                  onChange={e => setBaseWindKmH(Number(e.target.value))}
                />
                <div className="d-flex justify-content-between text-3xs text-muted">
                  <span>Calma (5)</span>
                  <span>Promedio Quíbor (10.4)</span>
                  <span>Ráfaga (27)</span>
                </div>
              </Col>

              <Col xs={12} sm={6}>
                <Form.Label className="d-flex justify-content-between mb-1 fw-bold text-dark">
                  <span>Altura Cumbrera:</span>
                  <span className="text-primary font-monospace">{ridgeHeightM.toFixed(1)} m</span>
                </Form.Label>
                <Form.Range
                  min={2.5}
                  max={7.0}
                  step={0.5}
                  value={ridgeHeightM}
                  onChange={e => setRidgeHeightM(Number(e.target.value))}
                />
                <div className="d-flex justify-content-between text-3xs text-muted">
                  <span>2.5m (Inviable)</span>
                  <span>5.5m (Recomendada)</span>
                  <span>7.0m</span>
                </div>
              </Col>

              <Col xs={6}>
                <Form.Label className="fw-bold text-dark mb-1">Extractores Eólicos:</Form.Label>
                <Form.Select
                  size="sm"
                  value={numTurbines}
                  onChange={e => setNumTurbines(Number(e.target.value))}
                  className="font-monospace text-xs"
                >
                  <option value={0}>0 extractores (Solo malla lateral)</option>
                  <option value={4}>4 unidades</option>
                  <option value={8}>8 unidades (Estándar Quíbor)</option>
                  <option value={10}>10 unidades (Refuerzo térmico)</option>
                </Form.Select>
              </Col>

              <Col xs={6}>
                <Form.Label className="fw-bold text-dark mb-1">Diámetro Turbina:</Form.Label>
                <Form.Select
                  size="sm"
                  value={turbineDiameter}
                  onChange={e => setTurbineDiameter(Number(e.target.value) as any)}
                  className="font-monospace text-xs"
                >
                  <option value={24}>24 pulgadas (2.200 m³/h)</option>
                  <option value={30}>30 pulgadas (3.300 m³/h)</option>
                  <option value={36}>36 pulgadas (4.800 m³/h)</option>
                </Form.Select>
              </Col>
            </Row>
          </div>

          {/* Resultados de Ventilación */}
          <div className="p-3 bg-white rounded border shadow-xs">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="text-xs fw-bold text-dark">Tasa de Renovación (RAH):</span>
              <span className="fs-5 fw-bold font-monospace text-success">
                {ventResult.airChangesPerHour} <span className="text-xs">h⁻¹</span>
              </span>
            </div>

            <ProgressBar
              now={Math.min(100, (ventResult.airChangesPerHour / 60) * 100)}
              variant={isOptimal ? 'success' : isModerate ? 'warning' : 'danger'}
              style={{ height: '8px' }}
              className="mb-2"
            />

            <Row className="g-2 text-2xs pt-1 border-top">
              <Col xs={6}>
                <span className="text-muted d-block">Viento en Cumbrera:</span>
                <strong className="text-dark font-monospace">{ventResult.windSpeedAtRidgeKmH} km/h</strong>
                <span className="text-muted text-3xs ms-1">(Hellmann z={ridgeHeightM}m)</span>
              </Col>
              <Col xs={6}>
                <span className="text-muted d-block">Gradiente Térmico ΔT:</span>
                <strong className="text-primary font-monospace">+{ventResult.thermalGradientDeltaT} °C interior</strong>
              </Col>
              <Col xs={6}>
                <span className="text-muted d-block">Flujo Malla Convectivo:</span>
                <strong className="text-secondary font-monospace">{ventResult.convectiveFlowM3H.toLocaleString()} m³/h</strong>
              </Col>
              <Col xs={6}>
                <span className="text-muted d-block">Aporte Extractores:</span>
                <strong className="text-secondary font-monospace">{ventResult.ridgeFansFlowM3H.toLocaleString()} m³/h</strong>
              </Col>
            </Row>
          </div>
        </div>

        {ridgeHeightM < 3.5 && (
          <div className="p-2 bg-danger-subtle text-danger-emphasis rounded mt-2 text-3xs border border-danger-subtle">
            ⚠️ <strong>Alerta Agronómica RAG:</strong> Alturas de cumbrera &lt; 3.5 m reducen el tiro térmico en un 23% y elevan el calor a &gt; 34 °C al mediodía, provocando aborto floral en tomate y pimentón.
          </div>
        )}
      </Card.Body>
    </Card>
  );
};
