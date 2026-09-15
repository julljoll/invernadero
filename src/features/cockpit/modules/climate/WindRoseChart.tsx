import React from 'react';
import { Card, Badge, Row, Col } from 'react-bootstrap';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export const WindRoseChart: React.FC = () => {
  // Datos climatológicos reales NASA MERRA-2 Valle de Quíbor
  // 11 meses del año con viento dominante absoluto del ESTE (hasta 88% en enero)
  // 4 semanas en septiembre viento dominante del SUR (~53%)
  const radarData = {
    labels: ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'],
    datasets: [
      {
        label: 'Frecuencia Anual Dominante (%)',
        data: [2.5, 8.0, 88.0, 12.0, 18.0, 3.0, 2.0, 1.5],
        backgroundColor: 'rgba(2, 132, 199, 0.25)',
        borderColor: '#0284c7',
        borderWidth: 2,
        pointBackgroundColor: '#0284c7',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#0284c7',
      },
      {
        label: 'Mes Atípico Septiembre (%)',
        data: [4.0, 6.0, 28.0, 15.0, 53.0, 8.0, 3.0, 2.0],
        backgroundColor: 'rgba(245, 158, 11, 0.25)',
        borderColor: '#f59e0b',
        borderWidth: 2,
        pointBackgroundColor: '#f59e0b',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#f59e0b',
      }
    ]
  };

  const radarOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: { size: 11, weight: 'bold' },
          usePointStyle: true,
          padding: 8
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleFont: { size: 11, weight: 'bold' },
        bodyFont: { size: 10 }
      }
    },
    scales: {
      r: {
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.08)'
        },
        pointLabels: {
          font: { size: 11, weight: 'bold' },
          color: '#334155'
        },
        ticks: {
          backdropColor: 'transparent',
          font: { size: 9 },
          stepSize: 20
        },
        suggestedMin: 0,
        suggestedMax: 100
      }
    }
  };

  return (
    <Card className="border-0 shadow-sm bg-light h-100">
      <Card.Body className="p-3 d-flex flex-column justify-content-between">
        <div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="d-flex align-items-center gap-2">
              <span className="material-symbols-outlined text-primary fs-5">explore</span>
              <span className="fw-bold text-dark small">Rosa de Vientos & Cargas Eólicas (NASA MERRA-2)</span>
            </div>
            <Badge bg="primary" className="text-2xs">
              Dominancia ESTE (88%)
            </Badge>
          </div>

          <p className="text-secondary text-2xs mb-2">
            Distribución direccional del viento en el Valle de Quíbor. El viento proviene del <strong>ESTE</strong> durante 11 meses del año.
          </p>

          <div style={{ height: '230px', width: '100%' }}>
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>

        <div className="mt-3 pt-2 border-top">
          <Row className="g-2 text-2xs">
            <Col xs={6}>
              <div className="p-2 bg-white rounded border border-primary border-opacity-25">
                <strong className="text-primary d-block">Velocidad Típica:</strong>
                <span>7.0 a 10.4 km/h (Pico en Junio)</span>
              </div>
            </Col>
            <Col xs={6}>
              <div className="p-2 bg-white rounded border border-warning border-opacity-50">
                <strong className="text-warning-emphasis d-block">Ráfaga de Diseño:</strong>
                <span>27 km/h (Factor seg. ≥ 1.5)</span>
              </div>
            </Col>
          </Row>

          <div className="p-2 bg-primary-subtle text-primary-emphasis rounded mt-2 text-3xs">
            🛡️ <strong>Regla Estructural Quíbor:</strong> Las fachadas y anclajes orientados al <strong>ESTE</strong> reciben la máxima solicitación dinámica. Deben llevar doble poste, guayas de acero galvanizado con tensores ojo-ojo y muertos de concreto.
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
