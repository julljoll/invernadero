import React, { useState } from 'react';
import { Card, Row, Col, Alert, Badge, Button } from 'react-bootstrap';
import { Slider } from '../../../../shared/components/Slider';
import { BlockMath, InlineMath } from 'react-katex';
import { calculateSalinityImpact } from '../../../../core/agronomy/salinity';
import { CropType } from '../../../../core/types/agronomy';
import { CROPS_CATALOG } from '../../../../core/constants/crops';

interface SalinityPanelProps {
  waterEcDsM: number;
  selectedCrop: CropType;
  onEcChange: (val: number) => void;
}

export const SalinityPanel: React.FC<SalinityPanelProps> = ({
  waterEcDsM,
  selectedCrop,
  onEcChange
}) => {
  const [showSalinityFormulas, setShowSalinityFormulas] = useState<boolean>(false);
  const crop = CROPS_CATALOG[selectedCrop];
  const salinityResult = calculateSalinityImpact(waterEcDsM, selectedCrop);

  const alertClass: Record<string, string> = {
    optimum: 'alert-success text-success bg-success bg-opacity-10 border-success border-opacity-25',
    moderate: 'alert-info text-info bg-info bg-opacity-10 border-info border-opacity-25',
    high_salinity: 'alert-warning text-warning bg-warning bg-opacity-10 border-warning border-opacity-25',
    critical: 'alert-danger text-danger bg-danger bg-opacity-10 border-danger border-opacity-25',
  };

  return (
    <Card className="card-cockpit p-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3 pb-2 border-bottom border-secondary-subtle">
        <div>
          <h3 className="fs-6 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <span className="material-symbols-outlined text-warning-emphasis ms-sm">science</span>
            <span>Manejo de Salinidad del Pozo & Fracción de Lixiviación (Mass-Hoffman)</span>
          </h3>
          <span className="text-secondary small font-sans">
            Ajuste dinámico de lámina bruta para {crop.name} (Tolerancia CEe: {crop.ecThreshold} dS/m)
          </span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <Badge bg="light" text="dark" className="border font-monospace px-2.5 py-1 text-xs">
            CE Pozo: {waterEcDsM.toFixed(2)} dS/m
          </Badge>
          <Badge
            bg={
              salinityResult.riskLevel === 'optimum'
                ? 'success'
                : salinityResult.riskLevel === 'moderate'
                ? 'info'
                : salinityResult.riskLevel === 'high_salinity'
                ? 'warning'
                : 'danger'
            }
            className="text-xs px-2 py-1"
          >
            {salinityResult.riskLevel.toUpperCase()}
          </Badge>
        </div>
      </div>

      <Row className="g-4 align-items-center mb-3">
        <Col xs={12} lg={6}>
          <div className="p-3 bg-light rounded-3 border border-secondary-subtle">
            <Slider
              label="Conductividad Eléctrica del Agua de Pozo (CEw):"
              value={waterEcDsM}
              min={0.5}
              max={4.0}
              step={0.1}
              unit=" dS/m"
              onChange={onEcChange}
            />
            <span className="text-muted text-3xs d-block mt-1">
              Los pozos en Cuara y Valle de Quíbor promedian típicamente entre 1.2 y 2.2 dS/m.
            </span>
          </div>
        </Col>

        <Col xs={12} lg={6}>
          <div className="p-3 bg-white rounded-3 border border-secondary-subtle shadow-2xs">
            <Row className="g-2 text-center text-xs">
              <Col xs={6}>
                <div className="p-2 bg-light rounded">
                  <span className="text-muted d-block text-2xs">Fracción de Lavado (LF):</span>
                  <span className="fs-5 fw-bold text-primary font-monospace">
                    {salinityResult.leachingFractionPct}%
                  </span>
                  <span className="d-block text-3xs text-secondary mt-0.5">Sobreriego requerido</span>
                </div>
              </Col>
              <Col xs={6}>
                <div className="p-2 bg-light rounded">
                  <span className="text-muted d-block text-2xs">Pérdida Rendimiento:</span>
                  <span
                    className={`fs-5 fw-bold font-monospace ${
                      salinityResult.yieldLossPct > 10 ? 'text-danger' : 'text-success'
                    }`}
                  >
                    {salinityResult.yieldLossPct.toFixed(1)}%
                  </span>
                  <span className="d-block text-3xs text-secondary mt-0.5">Impacto osmótico</span>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      <Alert className={`mb-3 py-2 px-3 small d-flex align-items-start gap-2 ${alertClass[salinityResult.riskLevel]}`}>
        <span className="material-symbols-outlined fs-5 mt-0.5">info</span>
        <div>
          <strong>Diagnóstico Agronómico Quíbor:</strong>{' '}
          {salinityResult.riskLevel === 'optimum'
            ? 'Agua dentro del umbral de tolerancia. Cero pérdida de rendimiento potencial.'
            : salinityResult.riskLevel === 'moderate'
            ? `Salinidad moderada. Se requiere Fracción de Lavado del ${salinityResult.leachingFractionPct}% para mantener la salinidad radicular por debajo de ${crop.ecThreshold} dS/m.`
            : `Salinidad crítica de pozo. Pérdida proyectada del ${salinityResult.yieldLossPct.toFixed(1)}% de rendimiento sin sobreriego continuo de lixiviación.`}
        </div>
      </Alert>

      {/* KaTeX Toggle */}
      <div>
        <Button
          variant="link"
          size="sm"
          onClick={() => setShowSalinityFormulas(!showSalinityFormulas)}
          className="text-info text-decoration-none p-0 d-flex align-items-center gap-1 font-monospace text-xs"
        >
          <span className="material-symbols-outlined ms-sm">
            {showSalinityFormulas ? 'expand_less' : 'functions'}
          </span>
          <span>
            {showSalinityFormulas
              ? 'Ocultar Ecuaciones de Salinidad'
              : 'Ver Ecuaciones de Mass-Hoffman & Fracción de Lixiviación (KaTeX)'}
          </span>
        </Button>

        {showSalinityFormulas && (
          <div className="formula-box mt-2 p-3 rounded-3 border border-info border-opacity-25 bg-light">
            <Row className="g-3">
              <Col xs={12} md={6}>
                <div className="text-secondary text-xs mb-1 font-sans fw-bold">
                  1. Fracción de Lixiviación Requerida (FAO-29):
                </div>
                <BlockMath math="LF = \frac{EC_w}{5(EC_e) - EC_w}" />
                <div className="text-muted small mt-1 font-sans text-2xs">
                  Donde <InlineMath math={`EC_w = ${waterEcDsM.toFixed(2)}\\ \\text{dS/m}`} /> y{' '}
                  <InlineMath math={`EC_e = ${crop.ecThreshold}\\ \\text{dS/m}`} /> (tolerancia del cultivo sin merma).
                </div>
              </Col>
              <Col xs={12} md={6}>
                <div className="text-secondary text-xs mb-1 font-sans fw-bold">
                  2. Pérdida de Rendimiento según Mass-Hoffman:
                </div>
                <BlockMath math="Y = 100 - b(EC_e - a)" />
                <div className="text-muted small mt-1 font-sans text-2xs">
                  Donde <InlineMath math="a" /> es el umbral de salinidad ({crop.ecThreshold} dS/m) y{' '}
                  <InlineMath math="b" /> es la pendiente de reducción de biomasa por dS/m adicional.
                </div>
              </Col>
            </Row>
          </div>
        )}
      </div>
    </Card>
  );
};
