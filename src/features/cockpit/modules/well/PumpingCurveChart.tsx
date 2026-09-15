import React, { useMemo } from 'react';
import { Card, Badge, Row, Col } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { generatePumpingCurve } from '../../../../core/agronomy/wellHydraulics';

interface PumpingCurveChartProps {
  scenario: '60m' | '120m';
}

export const PumpingCurveChart: React.FC<PumpingCurveChartProps> = ({ scenario }) => {
  const is60m = scenario === '60m';
  const operatingFlowLs = is60m ? 1.5 : 2.8;
  const maxFlowLs = is60m ? 4.0 : 6.0;

  const curvePoints = useMemo(() => {
    return generatePumpingCurve(scenario, operatingFlowLs, maxFlowLs, 12);
  }, [scenario, operatingFlowLs, maxFlowLs]);

  const chartData = useMemo(() => {
    const labels = curvePoints.map(p => `${p.qLs.toFixed(1)} L/s`);
    const drawdowns = curvePoints.map(p => p.drawdownM);
    const pointColors = curvePoints.map(p => {
      if (p.isOperatingPoint) return '#10b981'; // Green operating point
      if (p.zone === 'critical') return '#ef4444'; // Red critical
      if (p.zone === 'warning') return '#f59e0b'; // Amber warning
      return '#3b82f6'; // Blue normal
    });
    const pointRadii = curvePoints.map(p => (p.isOperatingPoint ? 8 : 4));

    return {
      labels,
      datasets: [
        {
          label: 'Abatimiento Estabilizado s (m)',
          data: drawdowns,
          borderColor: is60m ? '#0284c7' : '#6366f1',
          backgroundColor: is60m ? 'rgba(2, 132, 199, 0.12)' : 'rgba(99, 102, 241, 0.12)',
          fill: true,
          tension: 0.35,
          pointBackgroundColor: pointColors,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: pointRadii,
          pointHoverRadius: 9
        }
      ]
    };
  }, [curvePoints, is60m]);

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 10,
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 11 },
        callbacks: {
          label: function (context: any) {
            const pt = curvePoints[context.dataIndex];
            const zoneText =
              pt.zone === 'safe'
                ? '🟢 Régimen Seguro (Laminar)'
                : pt.zone === 'warning'
                ? '🟡 Zona de Alerta (Turbulencia Rejilla)'
                : '🔴 Caudal Crítico (Riesgo Achique)';
            return [
              `Abatimiento (s): ${context.parsed.y.toFixed(2)} m`,
              `Nivel Dinámico (ND): ${pt.dynamicLevelM.toFixed(1)} m`,
              `Estado: ${zoneText}`,
              pt.isOperatingPoint ? '⭐ PUNTO DE OPERACIÓN RECOMENDADO' : ''
            ].filter(Boolean);
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Caudal de Bombeo Q (L/s)',
          font: { size: 11, weight: '600' },
          color: '#475569'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Abatimiento s (metros)',
          font: { size: 11, weight: '600' },
          color: '#475569'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        beginAtZero: true
      }
    }
  };

  // Cálculos resumen del punto de trabajo
  const opPoint = curvePoints.find(p => p.isOperatingPoint) || curvePoints[4];
  const specificCapacity = opPoint.drawdownM > 0 ? (operatingFlowLs / opPoint.drawdownM).toFixed(2) : '0';
  const residualColumn = is60m ? (60.0 - opPoint.dynamicLevelM).toFixed(1) : (120.0 - opPoint.dynamicLevelM).toFixed(1);

  return (
    <Card className="border-0 shadow-sm bg-light">
      <Card.Body className="p-3">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-2">
          <div className="d-flex align-items-center gap-2">
            <span className="material-symbols-outlined text-info fs-5">show_chart</span>
            <span className="fw-bold text-dark small">Curva Característica de Bombeo: Q vs Abatimiento (Jacob)</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <Badge bg="light" text="dark" className="border font-monospace text-2xs">
              s = B·Q + C·Q²
            </Badge>
            <Badge bg="success" className="text-2xs">
              BEP: {operatingFlowLs} L/s (~5.4 m³/h)
            </Badge>
          </div>
        </div>

        <p className="text-secondary text-xs mb-3">
          Relación cuadrática entre el caudal extraído y el descenso del nivel dinámico según pérdidas en acuífero (B) y turbulencia en ranuras (C).
        </p>

        {/* Gráfico Chart.js */}
        <div style={{ height: '240px', width: '100%' }}>
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Leyenda de Zonas y Parámetros */}
        <Row className="g-2 mt-2 pt-2 border-top">
          <Col xs={6} md={3}>
            <div className="p-2 bg-white rounded border border-success border-opacity-50">
              <span className="text-muted text-2xs d-block">Punto de Operación:</span>
              <span className="fw-bold text-success font-monospace text-xs">
                {operatingFlowLs} L/s ({is60m ? '1.5"' : '2.0"'})
              </span>
            </div>
          </Col>
          <Col xs={6} md={3}>
            <div className="p-2 bg-white rounded border">
              <span className="text-muted text-2xs d-block">Abatimiento (s):</span>
              <span className="fw-bold text-dark font-monospace text-xs">
                {opPoint.drawdownM} metros
              </span>
            </div>
          </Col>
          <Col xs={6} md={3}>
            <div className="p-2 bg-white rounded border">
              <span className="text-muted text-2xs d-block">Columna sobre Bomba:</span>
              <span className="fw-bold text-primary font-monospace text-xs">
                {residualColumn} m residual
              </span>
            </div>
          </Col>
          <Col xs={6} md={3}>
            <div className="p-2 bg-white rounded border">
              <span className="text-muted text-2xs d-block">Capacidad Específica (Q/s):</span>
              <span className="fw-bold text-secondary font-monospace text-xs">
                {specificCapacity} L/s/m
              </span>
            </div>
          </Col>
        </Row>

        <div className="d-flex flex-wrap gap-3 mt-2 text-2xs text-secondary">
          <div className="d-flex align-items-center gap-1">
            <span className="badge rounded-circle p-1 bg-success"> </span>
            <span>Zona Óptima / Laminar (&lt; {is60m ? '2.2' : '3.2'} L/s)</span>
          </div>
          <div className="d-flex align-items-center gap-1">
            <span className="badge rounded-circle p-1 bg-warning"> </span>
            <span>Zona de Alerta (Turbulencia en rejilla)</span>
          </div>
          <div className="d-flex align-items-center gap-1">
            <span className="badge rounded-circle p-1 bg-danger"> </span>
            <span>Zona Crítica (&gt; {is60m ? '3.0' : '4.5'} L/s)</span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
