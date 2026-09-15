import React, { useState } from 'react';
import { Card, Row, Col, Badge, Button, Table } from 'react-bootstrap';
import { BlockMath, InlineMath } from 'react-katex';

interface StageSummaryItem {
  id: string;
  name: string;
  weeks: string;
  kc: string;
  waterPlWeek: string;
  dailyVolGreenhouse: string;
  pulses: string;
  notes: string;
  accent: string;
}

interface IrrigationScheduleProps {
  stagesSummary: StageSummaryItem[];
  areaM2: number;
  totalPlants: number;
  grossFactor: number;
  onOpenSheetsModal: (sheetId: string) => void;
}

export const IrrigationSchedule: React.FC<IrrigationScheduleProps> = ({
  stagesSummary,
  areaM2,
  totalPlants,
  grossFactor,
  onOpenSheetsModal,
}) => {
  const [selectedWeek, setSelectedWeek] = useState<number>(12);
  const [showFaoFormulas, setShowFaoFormulas] = useState<boolean>(false);

  const weeks = Array.from({ length: 24 }, (_, i) => i + 1);

  const getWeekData = (w: number) => {
    let stage = '';
    let kc = 0.50;
    let baseLitersPlantWeek = 7.0;

    if (w <= 3) {
      stage = '01. Trasplante y Enraizamiento';
      kc = 0.45 + (w - 1) * 0.075;
      baseLitersPlantWeek = 7.2 + (w - 1) * 0.9;
    } else if (w <= 7) {
      stage = '02. Crecimiento Vegetativo';
      kc = 0.70 + (w - 4) * 0.05;
      baseLitersPlantWeek = 11.5 + (w - 4) * 1.0;
    } else if (w <= 11) {
      stage = '03. Floración & Cuajado';
      kc = 0.95 + (w - 8) * 0.05;
      baseLitersPlantWeek = 15.5 + (w - 8) * 1.3;
    } else if (w <= 20) {
      stage = '04. Cosecha Pico & Fructificación';
      kc = 1.15;
      baseLitersPlantWeek = 22.5;
    } else {
      stage = '05. Cierre & Desmonte';
      kc = 1.00 - (w - 20) * 0.08;
      baseLitersPlantWeek = 17.0 - (w - 20) * 2.0;
    }

    const adjustedLitersPlantWeek = baseLitersPlantWeek * grossFactor;
    const weeklyVolM3 = (adjustedLitersPlantWeek * totalPlants) / 1000;
    const dailyVolM3 = weeklyVolM3 / 7;
    const dailyMm = (dailyVolM3 * 1000) / areaM2;

    return {
      stage,
      kc: Number(kc.toFixed(2)),
      litersPlantWeek: Number(adjustedLitersPlantWeek.toFixed(1)),
      dailyVolM3: Number(dailyVolM3.toFixed(2)),
      dailyMm: Number(dailyMm.toFixed(2)),
    };
  };

  const currentWeekData = getWeekData(selectedWeek);

  return (
    <Card className="card-cockpit p-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3 pb-2 border-bottom border-secondary-subtle">
        <div>
          <h3 className="fs-6 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <span className="material-symbols-outlined text-primary ms-sm">calendar_month</span>
            <span>Programa de Riego FAO-56 por Etapas & Calendario Semanal</span>
          </h3>
          <span className="text-secondary small font-sans">
            Curva dinámica de Kc y lámina bruta para el ciclo de 24 semanas en Quíbor
          </span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <Button
            variant="outline-success"
            size="sm"
            className="d-flex align-items-center gap-1.5 fw-bold text-xs"
            onClick={() => onOpenSheetsModal('02_Plan_Riego_FAO56')}
          >
            <span className="material-symbols-outlined text-xs">table_view</span>
            <span>Exportar Plan a Sheets</span>
          </Button>
        </div>
      </div>

      {/* Tabla de Etapas Fenológicas Agrupadas */}
      <div className="table-responsive mb-4 rounded-3 border border-secondary-subtle bg-white shadow-2xs">
        <Table hover size="sm" className="align-middle small mb-0 font-sans">
          <thead className="table-light">
            <tr className="text-secondary text-xs">
              <th>Fase Fenológica</th>
              <th>Periodo</th>
              <th className="text-center">Kc FAO</th>
              <th className="text-center">L/planta/semana</th>
              <th className="text-center">Volumen Nave</th>
              <th>Pulsos Diarios</th>
              <th>Estrategia Quíbor</th>
            </tr>
          </thead>
          <tbody>
            {stagesSummary.map(s => (
              <tr key={s.id} className="border-bottom border-secondary-subtle">
                <td className="fw-bold text-dark">{s.name}</td>
                <td className="text-secondary">{s.weeks}</td>
                <td className="text-center font-monospace fw-bold text-success">{s.kc}</td>
                <td className="text-center font-monospace">{s.waterPlWeek}</td>
                <td className="text-center font-monospace fw-bold text-primary">{s.dailyVolGreenhouse}</td>
                <td className="font-monospace text-xs text-secondary">{s.pulses}</td>
                <td className="text-xs text-muted font-sans">{s.notes}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Selector de Semanas Interactivo */}
      <div className="p-3 bg-light rounded-3 border border-secondary-subtle mb-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="fw-bold text-dark text-xs">Navegador Semanal de Riego (Ciclo 1 a 24):</span>
          <Badge bg="primary" className="text-xs">
            Semana {selectedWeek} seleccionada
          </Badge>
        </div>

        <div className="d-flex flex-wrap gap-1 mb-3">
          {weeks.map(w => (
            <button
              key={w}
              type="button"
              className={`btn btn-sm ${
                selectedWeek === w ? 'btn-primary fw-bold' : 'btn-white border text-secondary'
              }`}
              style={{ width: '36px', height: '32px', fontSize: '11px', padding: 0 }}
              onClick={() => setSelectedWeek(w)}
            >
              {w}
            </button>
          ))}
        </div>

        {/* Resumen de la Semana Seleccionada */}
        <div className="p-3 bg-white rounded border shadow-2xs">
          <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
            <h6 className="fw-bold text-dark mb-0 text-xs">
              Semana {selectedWeek} · {currentWeekData.stage}
            </h6>
            <Badge bg="success" className="font-monospace text-xs">
              Kc = {currentWeekData.kc}
            </Badge>
          </div>
          <Row className="g-2 text-center text-xs">
            <Col xs={4}>
              <div className="p-2 bg-light rounded">
                <span className="text-muted d-block text-2xs">Agua / Planta:</span>
                <strong className="fs-6 text-dark font-monospace">{currentWeekData.litersPlantWeek}</strong>
                <span className="text-muted text-3xs ms-1">L/pl/sem</span>
              </div>
            </Col>
            <Col xs={4}>
              <div className="p-2 bg-light rounded">
                <span className="text-muted d-block text-2xs">Volumen Diario Nave:</span>
                <strong className="fs-6 text-primary font-monospace">{currentWeekData.dailyVolM3}</strong>
                <span className="text-muted text-3xs ms-1">m³/día</span>
              </div>
            </Col>
            <Col xs={4}>
              <div className="p-2 bg-light rounded">
                <span className="text-muted d-block text-2xs">Lámina Bruta:</span>
                <strong className="fs-6 text-success font-monospace">{currentWeekData.dailyMm}</strong>
                <span className="text-muted text-3xs ms-1">mm/día</span>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* KaTeX Ecuaciones FAO-56 */}
      <div>
        <Button
          variant="link"
          size="sm"
          onClick={() => setShowFaoFormulas(!showFaoFormulas)}
          className="text-info text-decoration-none p-0 d-flex align-items-center gap-1 font-monospace text-xs"
        >
          <span className="material-symbols-outlined ms-sm">
            {showFaoFormulas ? 'expand_less' : 'functions'}
          </span>
          <span>{showFaoFormulas ? 'Ocultar Fórmulas FAO-56' : 'Ver Fórmulas de Evapotranspiración & Lámina Bruta (KaTeX)'}</span>
        </Button>

        {showFaoFormulas && (
          <div className="formula-box mt-2 p-3 rounded-3 border border-info border-opacity-25 bg-light">
            <Row className="g-3">
              <Col xs={12} md={6}>
                <div className="text-secondary text-xs mb-1 font-sans fw-bold">
                  1. Demanda Hídrica Neta del Cultivo (ETc):
                </div>
                <BlockMath math="ET_c = ET_0 \times K_c" />
                <div className="text-muted small mt-1 font-sans text-2xs">
                  Donde <InlineMath math="ET_0 \approx 5.6\ \text{mm/día}" /> (Penman-Monteith Quíbor) y{' '}
                  <InlineMath math="K_c" /> es el coeficiente de cultivo por fase.
                </div>
              </Col>
              <Col xs={12} md={6}>
                <div className="text-secondary text-xs mb-1 font-sans fw-bold">
                  2. Lámina Bruta de Riego con Lixiviación y Eficiencia:
                </div>
                <BlockMath math="LB = \frac{ET_c \times (1 + LF)}{EU}" />
                <div className="text-muted small mt-1 font-sans text-2xs">
                  Donde <InlineMath math="EU = 0.90" /> (eficiencia de uniformidad en goteros autocompensantes) y{' '}
                  <InlineMath math="LF" /> es la fracción de lavado.
                </div>
              </Col>
            </Row>
          </div>
        )}
      </div>
    </Card>
  );
};
