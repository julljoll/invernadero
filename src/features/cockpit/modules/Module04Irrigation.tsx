import React, { useState } from 'react';
import { useAgroStore } from '../../../shared/store/useAgroStore';
import { CROPS_CATALOG } from '../../../core/constants/crops';
import { calculateSalinityImpact } from '../../../core/agronomy/salinity';
import { calculateFao56IrrigationStages } from '../../../core/agronomy/fao56';
import { QUIBOR_CLIMATE_MONTHS } from '../../../core/constants/climateData';
import { Slider } from '../../../shared/components/Slider';
import { BlockMath, InlineMath } from 'react-katex';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const Module04Irrigation: React.FC = () => {
  const {
    selectedCrop,
    waterEcDsM,
    setWaterParams,
    greenhouseLengthM,
    greenhouseWidthM,
  } = useAgroStore();

  const [showFaoFormulas, setShowFaoFormulas] = useState<boolean>(false);

  const crop = CROPS_CATALOG[selectedCrop];
  const salinityResult = calculateSalinityImpact(waterEcDsM, selectedCrop);

  // Densidad biológica recomendada: ~2.2 a 2.5 plantas/m² para Quíbor
  const totalPlantsCount = Math.round(greenhouseLengthM * greenhouseWidthM * 2.2);

  const irrigationStages = calculateFao56IrrigationStages({
    surfaceM2: greenhouseLengthM * greenhouseWidthM,
    totalPlants: totalPlantsCount,
    et0MmDay: 5.6,
    leachingFactor: salinityResult.grossIrrigationFactor,
    uniformityEfficiency: 0.90,
  });

  const alertClass: Record<string, string> = {
    optimum: 'alert-success text-success bg-success bg-opacity-10 border-success border-opacity-25',
    moderate: 'alert-info text-info bg-info bg-opacity-10 border-info border-opacity-25',
    high_salinity: 'alert-warning text-warning bg-warning bg-opacity-10 border-warning border-opacity-25',
    critical: 'alert-danger text-danger bg-danger bg-opacity-10 border-danger border-opacity-25',
  };

  // Datos para el gráfico Chart.js: Precipitación NASA MERRA-2 vs Demanda Hídrica Bruta Mensual
  const labels = QUIBOR_CLIMATE_MONTHS.map((m) => m.mes);
  const rainData = QUIBOR_CLIMATE_MONTHS.map((m) => m.lluvia);
  // Demanda hídrica mensual ajustada por salinidad y Kc medio del cultivo (~0.95)
  const irrigationDemandData = QUIBOR_CLIMATE_MONTHS.map((m) => {
    // ETo mensual real basada en NASA MERRA-2 Quíbor (mm/mes = eto diario * 30.4 días)
    const baseEt0 = m.eto * 30.4; 
    const grossDemand = baseEt0 * 0.95 * salinityResult.grossIrrigationFactor;
    return Math.round(grossDemand);
  });

  const chartData = {
    labels,
    datasets: [
      {
        type: 'bar' as const,
        label: `Demanda Riego (${crop.name} + Lavado LF) [mm/mes]`,
        data: irrigationDemandData,
        backgroundColor: 'rgba(14, 165, 233, 0.70)',
        borderColor: '#0284c7',
        borderWidth: 1.5,
        borderRadius: 6,
      },
      {
        type: 'line' as const,
        label: 'Precipitación Quíbor (NASA MERRA-2) [mm/mes]',
        data: rainData,
        borderColor: '#16a34a',
        backgroundColor: 'rgba(34, 197, 94, 0.20)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#16a34a',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1.5,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#1e293b',
          boxWidth: 14,
          boxHeight: 14,
          padding: 16,
          font: { family: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif", size: 12, weight: '600' },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f8fafc',
        bodyColor: '#f1f5f9',
        titleFont: { family: "'Plus Jakarta Sans', system-ui, sans-serif", size: 13, weight: 'bold' },
        bodyFont: { family: "'JetBrains Mono', monospace", size: 12 },
        padding: 12,
        cornerRadius: 8,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#334155',
          font: { family: "'Plus Jakarta Sans', system-ui, sans-serif", size: 12, weight: '500' },
          padding: 6,
        },
        grid: { color: 'rgba(226, 232, 240, 0.8)' },
      },
      y: {
        ticks: {
          color: '#334155',
          font: { family: "'JetBrains Mono', monospace", size: 11, weight: '500' },
          padding: 6,
        },
        grid: { color: 'rgba(226, 232, 240, 0.8)' },
        title: {
          display: true,
          text: 'Lámina de Agua (mm/mes)',
          color: '#1e293b',
          font: { family: "'Plus Jakarta Sans', system-ui, sans-serif", size: 12, weight: 'bold' },
          padding: { bottom: 8 },
        },
      },
    },
  };

  return (
    <div className="space-y-4">
      <div className="card-cockpit p-4">
        <div className="row g-4">
          {/* Columna Salinidad & Manejo Quíbor */}
          <div className="col-12 col-lg-5">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h3 className="fs-6 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <span className="material-symbols-outlined text-info ms-sm">water_ph</span>
                <span>Control de Salinidad de Pozo</span>
              </h3>
              <span className="badge bg-info bg-opacity-15 text-info border border-info border-opacity-30 font-monospace">
                FAO-29 Rhodes
              </span>
            </div>

            <Slider
              label="Conductividad Eléctrica Pozo (dS/m):"
              value={waterEcDsM}
              min={0.5}
              max={3.5}
              step={0.05}
              unit="dS/m"
              accentColor="info"
              iconName="opacity"
              onChange={(val) => setWaterParams({ waterEcDsM: val })}
            />

            <div className="p-3 bg-light rounded-4 border border-secondary-subtle mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="text-secondary text-xs fw-bold text-uppercase">Fracción de Lavado (LF):</span>
                <span className="agro-chip agro-chip-water font-monospace text-xs">Aumento de Lámina</span>
              </div>
              <div className="display-6 fw-bold font-mono text-info">
                +{salinityResult.leachingFractionPct}%
                <span className="fs-6 fw-normal text-secondary font-monospace ms-2">sobre lámina neta</span>
              </div>
              <div className="text-secondary small mt-1 font-sans">
                Factor corrector bruto: <span className="font-mono text-dark fw-bold">×{salinityResult.grossIrrigationFactor.toFixed(2)}</span>
              </div>
            </div>

            <div className={`alert ${alertClass[salinityResult.riskLevel]} small d-flex align-items-start gap-2 mb-3 rounded-3`} role="alert">
              <span className="material-symbols-outlined ms-sm mt-0.5">info</span>
              <div>{salinityResult.warningMessage}</div>
            </div>

            {/* KaTeX Formula Button */}
            <button
              type="button"
              onClick={() => setShowFaoFormulas(!showFaoFormulas)}
              className="btn btn-sm btn-link text-info text-decoration-none p-0 d-flex align-items-center gap-1 font-monospace text-xs"
            >
              <span className="material-symbols-outlined ms-sm">
                {showFaoFormulas ? 'expand_less' : 'functions'}
              </span>
              <span>{showFaoFormulas ? 'Ocultar Ecuación Rhodes' : 'Ver Ecuación de Lavado FAO-29 (KaTeX)'}</span>
            </button>

            {showFaoFormulas && (
              <div className="formula-box formula-box-water mt-2">
                <div className="text-secondary text-xs mb-1 font-sans">Ecuación de Fracción de Lixiviación:</div>
                <BlockMath math="LF = \frac{EC_w}{5(EC_e) - EC_w}" />
                <div className="text-secondary small mt-1 font-sans">
                  Para {crop.name} (<InlineMath math={`EC_e = ${crop.ecThreshold}\\ \\text{dS/m}`} />) con agua de pozo <InlineMath math={`EC_w = ${waterEcDsM}\\ \\text{dS/m}`} />.
                </div>
              </div>
            )}
          </div>

          {/* Columna Etapas Fenológicas FAO-56 */}
          <div className="col-12 col-lg-7">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h3 className="fs-6 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                  <span className="material-symbols-outlined text-brand-bright ms-sm">water_drop</span>
                  <span>Consumo Hídrico Fenológico FAO-56</span>
                </h3>
                <span className="text-secondary small">Cultivo: {crop.name} ({crop.scientificName}) · {totalPlantsCount.toLocaleString()} plantas</span>
              </div>
              <span className="badge bg-success bg-opacity-15 text-success border border-success border-opacity-30 font-monospace">
                Penman-Monteith
              </span>
            </div>

            <div className="d-flex flex-column gap-2">
              {irrigationStages.map((stage) => (
                <div
                  key={stage.stageName}
                  className="bg-light border border-secondary-subtle rounded-3 p-3 d-flex justify-content-between align-items-center transition-all"
                >
                  <div>
                    <div className="fw-bold text-dark text-xs">{stage.stageName}</div>
                    <div className="text-secondary small font-monospace">{stage.weeks} · Kc = {stage.kc}</div>
                  </div>
                  <div className="text-end">
                    <div className="font-mono text-success fw-bold fs-6">
                      {stage.grossMmDay} mm/día
                    </div>
                    <div className="text-info small font-mono">
                      {stage.litersPerPlantWeek} L/planta/sem
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico Dinámico Chart.js de Balance Hídrico Quíbor */}
      <div className="card-cockpit p-4 mt-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div>
            <h3 className="fs-6 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
              <span className="material-symbols-outlined text-info ms-sm">monitoring</span>
              <span>Balance Hídrico Anual: Demanda Bruta vs Precipitación (Valle de Quíbor)</span>
            </h3>
            <span className="text-secondary small">
              Visualización interactiva reactiva a salinidad ({waterEcDsM} dS/m) y cultivo ({crop.name})
            </span>
          </div>
          <span className="badge bg-light border border-secondary-subtle text-secondary font-monospace">
            Déficit Semiárido Estival
          </span>
        </div>

        <div style={{ height: '320px' }}>
          <Chart type="bar" data={chartData as any} options={chartOptions as any} />
        </div>

        <div className="text-secondary small mt-2 d-flex align-items-center gap-2">
          <span className="material-symbols-outlined text-warning ms-sm">lightbulb</span>
          <span>
            Nótese el déficit pronunciado de <strong>diciembre a abril</strong> (Precipitación &lt; 30 mm vs Demanda &gt; 150 mm), donde el pozo profundo de 60m es el 100% responsable del sustento vegetal.
          </span>
        </div>
      </div>
    </div>
  );
};
