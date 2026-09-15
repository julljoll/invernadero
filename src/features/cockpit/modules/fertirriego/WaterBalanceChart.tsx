import React from 'react';
import { Card, Badge, Alert } from 'react-bootstrap';
import { Chart } from 'react-chartjs-2';
import { QUIBOR_CLIMATE_MONTHS } from '../../../../core/constants/climateData';

interface WaterBalanceChartProps {
  grossFactor: number;
}

export const WaterBalanceChart: React.FC<WaterBalanceChartProps> = ({ grossFactor }) => {
  const months = QUIBOR_CLIMATE_MONTHS.map(m => m.mes.substring(0, 3));
  
  // Base Penman-Monteith ET0 y Kc promedio representativo
  const et0Values = [5.2, 5.8, 6.4, 6.1, 5.4, 4.9, 5.1, 5.3, 5.2, 4.8, 4.6, 4.9];
  const kcValues = [0.60, 0.75, 1.05, 1.15, 1.15, 1.10, 1.00, 0.90, 0.85, 0.75, 0.65, 0.60];

  const netWaterMmDay = et0Values.map((et0, i) => Number((et0 * kcValues[i]).toFixed(2)));
  const grossWaterMmDay = netWaterMmDay.map(net => Number((net * grossFactor).toFixed(2)));

  const chartData = {
    labels: months,
    datasets: [
      {
        type: 'bar' as const,
        label: 'Lámina Bruta Riego (mm/día)',
        data: grossWaterMmDay,
        backgroundColor: 'rgba(2, 132, 199, 0.65)',
        borderColor: '#0284c7',
        borderWidth: 1.5,
        borderRadius: 4,
        yAxisID: 'yMm',
      },
      {
        type: 'line' as const,
        label: 'Demanda Neta ETc (mm/día)',
        data: netWaterMmDay,
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.15)',
        borderWidth: 2,
        tension: 0.35,
        pointBackgroundColor: '#f59e0b',
        pointRadius: 4,
        yAxisID: 'yMm',
      },
      {
        type: 'line' as const,
        label: 'Kc FAO-56',
        data: kcValues,
        borderColor: '#10b981',
        borderWidth: 2,
        borderDash: [4, 4],
        pointRadius: 0,
        yAxisID: 'yKc',
      },
    ],
  };

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: { size: 11, weight: 'bold' },
          usePointStyle: true,
          padding: 10,
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 8,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: { font: { size: 10, weight: '600' } },
      },
      yMm: {
        type: 'linear' as const,
        position: 'left' as const,
        title: { display: true, text: 'Lámina (mm/día)', font: { size: 10, weight: 'bold' } },
        beginAtZero: true,
        max: 10,
      },
      yKc: {
        type: 'linear' as const,
        position: 'right' as const,
        title: { display: true, text: 'Kc FAO', font: { size: 10, weight: 'bold' } },
        beginAtZero: true,
        max: 1.5,
        grid: { drawOnChartArea: false },
      },
    },
  };

  return (
    <Card className="card-cockpit p-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3 pb-2 border-bottom border-secondary-subtle">
        <div>
          <h3 className="fs-6 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <span className="material-symbols-outlined text-info ms-sm">stacked_bar_chart</span>
            <span>Balance de Demanda Hídrica Anual: Lámina Bruta vs Neta Quíbor</span>
          </h3>
          <span className="text-secondary small font-sans">
            Penman-Monteith FAO-56 ajustado con Fracción de Lixiviación (LF) por salinidad de pozo
          </span>
        </div>
        <Badge bg="light" text="dark" className="border text-xs">
          Factor Bruto: ×{grossFactor.toFixed(2)}
        </Badge>
      </div>

      <div style={{ height: '260px', width: '100%' }} className="mb-3">
        <Chart type="bar" data={chartData as any} options={chartOptions} />
      </div>

      <Alert variant="info" className="mb-0 p-2.5 text-xs d-flex align-items-start gap-2 border bg-info bg-opacity-10 border-info border-opacity-25">
        <span className="material-symbols-outlined text-info fs-5 mt-0.5">wb_sunny</span>
        <div>
          <strong>Pico de Demanda Hídrica (Marzo - Abril):</strong> La evapotranspiración alcanza su máximo anual (ET₀ &gt; 6.0 mm/día). La lámina bruta supera los 7.5 mm/día en plena fructificación, demandando el encendido del pozo a 2.0 L/s durante ~1.04 a 1.25 horas/día.
        </div>
      </Alert>
    </Card>
  );
};
