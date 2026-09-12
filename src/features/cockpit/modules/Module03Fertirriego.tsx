import React, { useState } from 'react';
import { Card, Row, Col, Alert, Button, ButtonGroup, Table } from 'react-bootstrap';
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

export const Module03Fertirriego: React.FC = () => {
  const {
    selectedCrop,
    waterEcDsM,
    setWaterParams,
    greenhouseLengthM,
    greenhouseWidthM,
  } = useAgroStore();

  const [activeTank, setActiveTank] = useState<'A' | 'B' | 'C'>('A');
  const [showSalinityFormulas, setShowSalinityFormulas] = useState<boolean>(false);
  const [showFaoFormulas, setShowFaoFormulas] = useState<boolean>(false);

  const crop = CROPS_CATALOG[selectedCrop];
  const salinityResult = calculateSalinityImpact(waterEcDsM, selectedCrop);

  // Dimensiones y marco de siembra
  const length = greenhouseLengthM || 50;
  const width = greenhouseWidthM || 20;
  const areaM2 = length * width;

  // Parámetros de Marco de Siembra (Línea Base Quíbor 1.000 m²)
  const camellonesCount = Math.max(1, Math.round(width / 2.0));
  const densityPlM2 = 2.50;
  const totalPlants = Math.round(areaM2 * densityPlM2); // 2.500 plantas

  // Sistema de riego por goteo autocompensante PC
  const totalMetersTape = camellonesCount * 2 * length;
  const spacingDrippersM = 0.40; // 40 cm
  const totalDrippers = Math.round(totalMetersTape / spacingDrippersM);
  const dripperFlowLh = 1.60;
  const totalFlowM3h = (totalDrippers * dripperFlowLh) / 1000;
  const sectorsCount = 2;
  const sectorFlowM3h = totalFlowM3h / sectorsCount;

  // Etapas de riego FAO-56
  const irrigationStages = calculateFao56IrrigationStages({
    surfaceM2: areaM2,
    totalPlants,
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

  // Semanas del ciclo (24 semanas)
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

    const grossLitersPlantWeek = Number((baseLitersPlantWeek * salinityResult.grossIrrigationFactor).toFixed(1));
    return { stage, kc: Number(kc.toFixed(2)), grossLitersPlantWeek };
  };

  const weeklySchedule = weeks.map(getWeekData);

  // 1. Gráfico de Balance Hídrico Quíbor (NASA MERRA-2 vs Demanda Bruta)
  const annualLabels = QUIBOR_CLIMATE_MONTHS.map((m) => m.mes);
  const annualRainData = QUIBOR_CLIMATE_MONTHS.map((m) => m.lluvia);
  const annualDemandData = QUIBOR_CLIMATE_MONTHS.map((m) => {
    const baseEt0 = m.eto * 30.4;
    const grossDemand = baseEt0 * 0.95 * salinityResult.grossIrrigationFactor;
    return Math.round(grossDemand);
  });

  const annualBalanceChartData = {
    labels: annualLabels,
    datasets: [
      {
        type: 'bar' as const,
        label: `Demanda Bruta Riego (${crop.name} + LF) [mm/mes]`,
        data: annualDemandData,
        backgroundColor: 'rgba(14, 165, 233, 0.75)',
        borderColor: '#0284c7',
        borderWidth: 1.5,
        borderRadius: 5,
      },
      {
        type: 'line' as const,
        label: 'Precipitación Quíbor (NASA MERRA-2) [mm/mes]',
        data: annualRainData,
        borderColor: '#16a34a',
        backgroundColor: 'rgba(34, 197, 94, 0.20)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#16a34a',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1.5,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const annualBalanceChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#1e293b',
          boxWidth: 14,
          padding: 12,
          font: { family: "'Plus Jakarta Sans', system-ui, sans-serif", size: 11, weight: '600' },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f8fafc',
        bodyColor: '#f1f5f9',
        titleFont: { family: "'Plus Jakarta Sans', system-ui, sans-serif", size: 12, weight: 'bold' },
        bodyFont: { family: "'JetBrains Mono', monospace", size: 11 },
        padding: 10,
        cornerRadius: 6,
      },
    },
    scales: {
      x: {
        ticks: { color: '#334155', font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 } },
        grid: { color: 'rgba(226, 232, 240, 0.7)' },
      },
      y: {
        ticks: { color: '#334155', font: { family: "'JetBrains Mono', monospace", size: 10 } },
        grid: { color: 'rgba(226, 232, 240, 0.7)' },
        title: {
          display: true,
          text: 'Lámina (mm/mes)',
          color: '#1e293b',
          font: { family: "'Plus Jakarta Sans', sans-serif", size: 11, weight: 'bold' },
        },
      },
    },
  };

  // 2. Gráfico de Curva Semanal de Riego y Kc
  const weeklyChartLabels = weeks.map((w) => `Sem ${w}`);
  const weeklyWaterData = weeklySchedule.map((d) => d.grossLitersPlantWeek);
  const weeklyKcData = weeklySchedule.map((d) => d.kc);

  const weeklyScheduleChartData = {
    labels: weeklyChartLabels,
    datasets: [
      {
        type: 'bar' as const,
        label: `Lámina Bruta (L/planta/semana con LF +${salinityResult.leachingFractionPct}%)`,
        data: weeklyWaterData,
        backgroundColor: 'rgba(2, 132, 199, 0.75)',
        borderColor: '#0284c7',
        borderWidth: 1.5,
        borderRadius: 4,
        yAxisID: 'yWater',
      },
      {
        type: 'line' as const,
        label: 'Coeficiente Kc FAO-56',
        data: weeklyKcData,
        borderColor: '#16a34a',
        backgroundColor: 'rgba(22, 163, 74, 0.15)',
        borderWidth: 3,
        pointBackgroundColor: '#16a34a',
        pointBorderColor: '#ffffff',
        pointRadius: 3.5,
        pointHoverRadius: 6,
        fill: false,
        tension: 0.3,
        yAxisID: 'yKc',
      },
    ],
  };

  const weeklyScheduleChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#1e293b',
          font: { family: "'Plus Jakarta Sans', system-ui, sans-serif", size: 11, weight: 'bold' },
          padding: 12,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#38bdf8',
        bodyColor: '#ffffff',
        borderColor: '#38bdf8',
        borderWidth: 1,
        padding: 10,
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 11 },
        callbacks: {
          afterTitle: (items: any[]) => {
            const index = items[0]?.dataIndex;
            return weeklySchedule[index] ? `Fase: ${weeklySchedule[index].stage}` : '';
          },
          label: (ctx: any) => {
            if (ctx.dataset.yAxisID === 'yWater') {
              return `💧 Riego Bruto: ${ctx.parsed.y} L/planta/sem`;
            }
            return `🌿 Coeficiente Kc: ${ctx.parsed.y}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#334155',
          font: { family: "'JetBrains Mono', monospace", size: 10, weight: '500' },
          maxRotation: 45,
        },
        grid: { color: 'rgba(226, 232, 240, 0.7)' },
      },
      yWater: {
        type: 'linear' as const,
        position: 'left' as const,
        title: {
          display: true,
          text: 'L / planta / sem',
          color: '#0284c7',
          font: { family: "'Plus Jakarta Sans', sans-serif", size: 11, weight: 'bold' },
        },
        ticks: { color: '#0284c7', font: { family: "'JetBrains Mono', monospace", size: 10 } },
        grid: { color: 'rgba(226, 232, 240, 0.7)' },
      },
      yKc: {
        type: 'linear' as const,
        position: 'right' as const,
        min: 0,
        max: 1.4,
        title: {
          display: true,
          text: 'Kc FAO-56',
          color: '#16a34a',
          font: { family: "'Plus Jakarta Sans', sans-serif", size: 11, weight: 'bold' },
        },
        ticks: { color: '#16a34a', font: { family: "'JetBrains Mono', monospace", size: 10 } },
        grid: { drawOnChartArea: false },
      },
    },
  };

  // Etapas Fenológicas Agrupadas
  const stagesSummary = [
    {
      id: '1',
      name: '01. Enraizamiento & Asentamiento',
      weeks: 'Semanas 1 a 3',
      kc: '0.45 – 0.60',
      waterPlWeek: '7.2 – 9.0 L/pl',
      dailyVolGreenhouse: '2.83 m³/día',
      pulses: '2 turnos de 12 min',
      notes: 'Raíz superficial exploratoria (0-15 cm). Prohibido saturar para inducir enraizamiento y evitar asfixia.',
      accent: 'border-info text-info',
    },
    {
      id: '2',
      name: '02. Crecimiento Vegetativo',
      weeks: 'Semanas 4 a 7',
      kc: '0.70 – 0.85',
      waterPlWeek: '12.0 – 15.0 L/pl',
      dailyVolGreenhouse: '4.71 m³/día',
      pulses: '2 turnos de 18 min',
      notes: 'Desarrollo de biomasa foliar y bifurcaciones. Guiado en Hortomalla 15x15 cm sin ataduras.',
      accent: 'border-primary text-primary',
    },
    {
      id: '3',
      name: '03. Floración & Cuajado',
      weeks: 'Semanas 8 a 11',
      kc: '0.95 – 1.05',
      waterPlWeek: '15.5 – 19.4 L/pl',
      dailyVolGreenhouse: '6.09 m³/día',
      pulses: '2 turnos de 23 min',
      notes: 'Etapa más crítica en Quíbor. Estrés hídrico o salino >32°C detona aborto floral irreversible.',
      accent: 'border-warning text-warning',
    },
    {
      id: '4',
      name: '04. Cosecha Pico & Fructificación',
      weeks: 'Semanas 12 a 22',
      kc: '1.15 sostenido',
      waterPlWeek: '18.5 – 23.1 L/pl',
      dailyVolGreenhouse: '7.26 – 9.25 m³/día',
      pulses: '2 turnos de 28 min',
      notes: 'Demanda pico en meses cálidos (marzo-abril). División en micropulsos para mitigar salinidad.',
      accent: 'border-success text-success',
    },
    {
      id: '5',
      name: '05. Cierre & Desmonte',
      weeks: 'Semanas 23 a 24',
      kc: '0.80 – 0.70',
      waterPlWeek: '11.0 – 13.8 L/pl',
      dailyVolGreenhouse: '4.33 m³/día',
      pulses: '2 turnos de 15 min',
      notes: 'Maduración de últimos frutos. Despunte apical ya realizado y cierre sanitario del ciclo.',
      accent: 'border-secondary text-secondary',
    },
  ];

  return (
    <div className="d-flex flex-column gap-4">
      {/* ====================================================================
         1. ENCABEZADO Y KPIS PRINCIPALES DE SIEMBRA Y RIEGO
         ==================================================================== */}
      <Card className="card-cockpit p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-success ms-md">water_drop</span>
              <h2 className="fs-5 fw-bold text-dark mb-0">
                03. Siembra, Riego & Fertirriego Hidrosoluble
              </h2>
            </div>
            <p className="text-secondary small mb-0 font-sans">
              Línea Base FAO-56 ajustada al Valle de Quíbor · Nutrición AIFA · Control de Salinidad y Balance Hídrico
            </p>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <span className="badge bg-success text-white px-2.5 py-1.5 font-monospace">
              {areaM2.toLocaleString()} m² ({length}m × {width}m)
            </span>
            <span className="badge bg-primary text-white px-2.5 py-1.5 font-monospace">
              {crop.name} ({totalPlants.toLocaleString()} pl)
            </span>
            <span className="badge bg-info text-white px-2.5 py-1.5 font-monospace">
              LF Lavado: +{salinityResult.leachingFractionPct}%
            </span>
          </div>
        </div>

        {/* Fila de Tarjetas KPI */}
        <div className="row g-3">
          <div className="col-6 col-md-3">
            <div className="p-3 bg-light rounded-4 border border-secondary-subtle h-100 d-flex flex-column justify-content-between">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-secondary text-xxs fw-bold text-uppercase">Población Total</span>
                <div className="kpi-icon-pill kpi-icon-green" style={{ width: '36px', height: '36px', borderRadius: '10px' }}>
                  <span className="material-symbols-outlined ms-sm">potted_plant</span>
                </div>
              </div>
              <div>
                <div className="display-6 fw-bold font-mono text-dark">
                  {totalPlants.toLocaleString()}
                  <span className="fs-6 fw-normal text-muted ms-1">pl</span>
                </div>
                <div className="text-muted small mt-1 font-sans">
                  Densidad: <span className="font-mono text-success fw-bold">{densityPlM2.toFixed(2)} pl/m²</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="p-3 bg-light rounded-4 border border-secondary-subtle h-100 d-flex flex-column justify-content-between">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-secondary text-xxs fw-bold text-uppercase">Camellones</span>
                <div className="kpi-icon-pill kpi-icon-green" style={{ width: '36px', height: '36px', borderRadius: '10px' }}>
                  <span className="material-symbols-outlined ms-sm">grid_view</span>
                </div>
              </div>
              <div>
                <div className="display-6 fw-bold font-mono text-dark">
                  {camellonesCount}
                  <span className="fs-6 fw-normal text-muted ms-1">mesas</span>
                </div>
                <div className="text-muted small mt-1 font-sans">
                  Lomo 0.80m + Pasillo 1.20m (Ejes 2.0m)
                </div>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="p-3 bg-light rounded-4 border border-secondary-subtle h-100 d-flex flex-column justify-content-between">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-secondary text-xxs fw-bold text-uppercase">Emisores de Riego</span>
                <div className="kpi-icon-pill kpi-icon-water" style={{ width: '36px', height: '36px', borderRadius: '10px' }}>
                  <span className="material-symbols-outlined ms-sm">water_drop</span>
                </div>
              </div>
              <div>
                <div className="display-6 fw-bold font-mono text-dark">
                  {totalDrippers.toLocaleString()}
                  <span className="fs-6 fw-normal text-muted ms-1">PC</span>
                </div>
                <div className="text-muted small mt-1 font-sans">
                  Goteros 1.6 L/h a 0.40m ({totalMetersTape}m)
                </div>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="p-3 bg-light rounded-4 border border-secondary-subtle h-100 d-flex flex-column justify-content-between">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-secondary text-xxs fw-bold text-uppercase">Proyección Cosecha</span>
                <div className="kpi-icon-pill kpi-icon-sun" style={{ width: '36px', height: '36px', borderRadius: '10px' }}>
                  <span className="material-symbols-outlined ms-sm">payments</span>
                </div>
              </div>
              <div>
                <div className="display-6 fw-bold font-mono text-dark">
                  12.5
                  <span className="fs-6 fw-normal text-muted ms-1">Ton</span>
                </div>
                <div className="text-muted small mt-1 font-sans">
                  ~625 cestas (20kg) · ~5.0 kg/pl
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ====================================================================
         2. CONTROL DE SALINIDAD DE POZO Y ETAPAS FAO-56
         ==================================================================== */}
      <Card className="card-cockpit p-4">
        <div className="row g-4">
          {/* Columna Izquierda: Slider de Salinidad y Fracción de Lavado */}
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

            {/* KaTeX Ecuación de Lavado Rhodes */}
            <button
              type="button"
              onClick={() => setShowSalinityFormulas(!showSalinityFormulas)}
              className="btn btn-sm btn-link text-info text-decoration-none p-0 d-flex align-items-center gap-1 font-monospace text-xs"
            >
              <span className="material-symbols-outlined ms-sm">
                {showSalinityFormulas ? 'expand_less' : 'functions'}
              </span>
              <span>{showSalinityFormulas ? 'Ocultar Ecuación Rhodes' : 'Ver Ecuación de Lavado FAO-29 (KaTeX)'}</span>
            </button>

            {showSalinityFormulas && (
              <div className="formula-box formula-box-water mt-2">
                <div className="text-secondary text-xs mb-1 font-sans">Ecuación de Fracción de Lixiviación:</div>
                <BlockMath math="LF = \frac{EC_w}{5(EC_e) - EC_w}" />
                <div className="text-secondary small mt-1 font-sans">
                  Para {crop.name} (<InlineMath math={`EC_e = ${crop.ecThreshold}\\ \\text{dS/m}`} />) con agua de pozo <InlineMath math={`EC_w = ${waterEcDsM}\\ \\text{dS/m}`} />.
                </div>
              </div>
            )}
          </div>

          {/* Columna Derecha: Consumo Hídrico Fenológico FAO-56 */}
          <div className="col-12 col-lg-7">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h3 className="fs-6 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                  <span className="material-symbols-outlined text-brand-bright ms-sm">water_drop</span>
                  <span>Consumo Hídrico Fenológico FAO-56</span>
                </h3>
                <span className="text-secondary small">Cultivo: {crop.name} · {totalPlants.toLocaleString()} plantas</span>
              </div>
              <span className="badge bg-success bg-opacity-15 text-success border border-success border-opacity-30 font-monospace">
                Penman-Monteith
              </span>
            </div>

            <div className="d-flex flex-column gap-2">
              {irrigationStages.map((stage) => (
                <div
                  key={stage.stageName}
                  className="bg-light border border-secondary-subtle rounded-3 p-2.5 d-flex justify-content-between align-items-center"
                >
                  <div>
                    <div className="fw-bold text-dark text-xs">{stage.stageName}</div>
                    <div className="text-secondary small font-monospace">{stage.weeks} · Kc = {stage.kc}</div>
                  </div>
                  <div className="text-end">
                    <div className="font-mono text-success fw-bold text-sm">
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
      </Card>

      {/* ====================================================================
         3. DOS GRÁFICOS ANALÍTICOS: BALANCE ANUAL & CURVA SEMANAL KC
         ==================================================================== */}
      <Row className="g-4">
        {/* Gráfico 1: Balance Hídrico Anual Quíbor */}
        <Col xs={12} xl={6}>
          <Card className="card-cockpit p-4 h-100">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
              <div>
                <h3 className="fs-6 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                  <span className="material-symbols-outlined text-info ms-sm">monitoring</span>
                  <span>Balance Anual: Demanda vs Lluvia</span>
                </h3>
                <span className="text-secondary small font-sans">
                  Precipitación NASA MERRA-2 Quíbor vs Demanda Riego
                </span>
              </div>
              <span className="badge bg-light border border-secondary-subtle text-secondary font-monospace text-xxs">
                Déficit Estival
              </span>
            </div>

            <div style={{ height: '280px' }}>
              <Chart type="bar" data={annualBalanceChartData as any} options={annualBalanceChartOptions} />
            </div>

            <div className="text-secondary small mt-3 p-2 bg-light rounded-3 border border-secondary-subtle text-xxs font-sans">
              <span className="fw-bold text-dark">Déficit Crítico Dic–Abr:</span> La precipitación no supera 30 mm/mes mientras la demanda supera 150 mm/mes. El pozo profundo de 60m es el 100% responsable de la nutrición hídrica.
            </div>
          </Card>
        </Col>

        {/* Gráfico 2: Curva de Riego y Kc Semanas 1 a 24 */}
        <Col xs={12} xl={6}>
          <Card className="card-cockpit p-4 h-100">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
              <div>
                <h3 className="fs-6 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                  <span className="material-symbols-outlined text-primary ms-sm">show_chart</span>
                  <span>Curva Semanal de Riego y Kc (Ciclo 24 Semanas)</span>
                </h3>
                <span className="text-secondary small font-sans">
                  Lámina bruta por planta ajustada por salinidad LF (+{salinityResult.leachingFractionPct}%)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowFaoFormulas(!showFaoFormulas)}
                className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 text-xxs"
              >
                <span className="material-symbols-outlined ms-sm">functions</span>
                <span>{showFaoFormulas ? 'Ocultar Ecuación' : 'Ver Ecuación FAO'}</span>
              </button>
            </div>

            {showFaoFormulas && (
              <div className="p-2.5 bg-light rounded-3 border border-secondary-subtle mb-3 text-xxs font-sans">
                <div className="fw-bold text-dark mb-1">Ecuación FAO-56 con Fracción de Lixiviación:</div>
                <BlockMath math={`\\text{Lámina Bruta} = \\frac{ET_0 \\times K_c \\times (1 + LF)}{E_u} = \\frac{5.60 \\times 1.15 \\times ${(salinityResult.grossIrrigationFactor).toFixed(2)}}{0.90}`} />
              </div>
            )}

            <div style={{ height: '280px' }}>
              <Chart type="bar" data={weeklyScheduleChartData as any} options={weeklyScheduleChartOptions} />
            </div>

            <div className="text-secondary small mt-3 p-2 bg-light rounded-3 border border-secondary-subtle text-xxs font-sans">
              <span className="fw-bold text-dark">Sectorización:</span> Nave dividida en {sectorsCount} sectores de {sectorFlowM3h.toFixed(2)} m³/h. Pulso pico de 28 min por sector (Bomba 1.5 HP).
            </div>
          </Card>
        </Col>
      </Row>

      {/* ====================================================================
         4. DESGLOSE OPERATIVO POR ETAPAS FENOLÓGICAS
         ==================================================================== */}
      <Card className="card-cockpit p-4">
        <h3 className="fs-6 fw-bold text-dark mb-3 d-flex align-items-center gap-2">
          <span className="material-symbols-outlined text-success ms-sm">format_list_numbered</span>
          <span>Desglose Operativo por Etapa Fenológica (2.500 Plantas de Pimentón)</span>
        </h3>

        <div className="row g-3">
          {stagesSummary.map((stage) => (
            <div className="col-12 col-lg-6 col-xl-4" key={stage.id}>
              <div className={`p-3 bg-light rounded-4 border ${stage.accent} h-100 d-flex flex-column justify-content-between`}>
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-bold text-dark text-sm">{stage.name}</span>
                    <span className="badge bg-secondary bg-opacity-15 text-dark font-monospace text-xxs">
                      {stage.weeks}
                    </span>
                  </div>

                  <div className="row g-2 my-2 py-2 border-top border-bottom border-secondary border-opacity-10 text-xs">
                    <div className="col-6">
                      <span className="text-muted d-block">Coeficiente Kc:</span>
                      <strong className="font-mono text-dark">{stage.kc}</strong>
                    </div>
                    <div className="col-6">
                      <span className="text-muted d-block">Lámina semanal:</span>
                      <strong className="font-mono text-primary">{stage.waterPlWeek}</strong>
                    </div>
                    <div className="col-6">
                      <span className="text-muted d-block">Volumen Nave:</span>
                      <strong className="font-mono text-info">{stage.dailyVolGreenhouse}</strong>
                    </div>
                    <div className="col-6">
                      <span className="text-muted d-block">Turno Riego:</span>
                      <strong className="font-mono text-success">{stage.pulses}</strong>
                    </div>
                  </div>
                </div>

                <p className="text-muted text-xxs mb-0 mt-2 font-sans">
                  {stage.notes}
                </p>
              </div>
            </div>
          ))}

          {/* Tarjeta Autonomía Reservorio 80m3 */}
          <div className="col-12 col-lg-6 col-xl-4">
            <div className="p-3 bg-light rounded-4 border border-info border-opacity-40 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fw-bold text-info text-sm d-flex align-items-center gap-1">
                    <span className="material-symbols-outlined ms-sm">valve</span>
                    <span>Blindaje Reservorio 80 m³</span>
                  </span>
                  <span className="badge bg-info text-white font-monospace text-xxs px-2 py-1">
                    Tanque Australiano
                  </span>
                </div>

                <div className="my-2 py-2 border-top border-bottom border-secondary border-opacity-10">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="text-muted text-xs">Autonomía en Cosecha Pico:</span>
                    <strong className="font-mono text-dark text-sm">8.65 días</strong>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted text-xs">Autonomía Media del Ciclo:</span>
                    <strong className="font-mono text-success text-sm">10.2 días</strong>
                  </div>
                </div>
              </div>

              <p className="text-muted text-xxs mb-0 mt-2 font-sans">
                El reservorio de 80 m³ absorbe el bombeo intermitente del pozo (18-22 m³/día) y garantiza riego ininterrumpido ante cortes de fluido eléctrico.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* ====================================================================
         5. NUTRICIÓN Y FERTIRRIEGO 100% HIDROSOLUBLE AIFA
         ==================================================================== */}
      <Card className="card-cockpit p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-warning ms-sm">science</span>
              <h3 className="fs-6 fw-bold text-dark mb-0">
                Nutrición y Fertirriego 100% Hidrosoluble AIFA (Solución Madre)
              </h3>
            </div>
            <span className="text-secondary small font-sans">
              Formulación balanceada comercializada en Quíbor/Barquisimeto · Tanques Concentrados A, B y C
            </span>
          </div>

          {/* Selector de Tanques A, B, C */}
          <ButtonGroup size="sm">
            <Button
              variant={activeTank === 'A' ? 'primary' : 'outline-secondary'}
              onClick={() => setActiveTank('A')}
              className="fw-bold px-3"
            >
              Tanque A (500L - Calcio &amp; Fe)
            </Button>
            <Button
              variant={activeTank === 'B' ? 'success' : 'outline-secondary'}
              onClick={() => setActiveTank('B')}
              className="fw-bold px-3"
            >
              Tanque B (500L - P, K, Mg &amp; Micros)
            </Button>
            <Button
              variant={activeTank === 'C' ? 'danger' : 'outline-secondary'}
              onClick={() => setActiveTank('C')}
              className="fw-bold px-3"
            >
              Tanque C (200L - Ácido Nítrico)
            </Button>
          </ButtonGroup>
        </div>

        {/* ALERTA CRÍTICA DE INCOMPATIBILIDAD QUÍMICA */}
        <Alert variant="warning" className="border border-warning border-opacity-40 rounded-3 p-3 mb-3 d-flex align-items-start gap-2 text-xs">
          <span className="material-symbols-outlined text-warning ms-sm mt-0.5">warning</span>
          <div>
            <strong>Regla Agronómica de Incompatibilidad Química:</strong> NUNCA mezclar el <strong>Nitrato de Calcio</strong> del Tanque A con los <strong>Sulfatos y Fosfatos</strong> del Tanque B en forma concentrada. Se formaría un precipitado insoluble de Yeso (<InlineMath math="CaSO_4" />) y Fosfato Tricálcico que colapsaría el cabezal de filtrado y taponaría los goteros autocompensantes.
          </div>
        </Alert>

        {/* TABLA O CONTENIDO SEGÚN TANQUE ACTIVO */}
        {activeTank === 'A' && (
          <div className="p-3 bg-light rounded-4 border border-secondary-subtle">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h4 className="fs-6 fw-bold text-dark mb-0">Tanque A — Volumen 500 Litros</h4>
                <span className="text-muted text-xs font-sans">Aporte de Calcio, Nitrógeno Nítrico y Hierro Quelado</span>
              </div>
              <span className="badge bg-primary text-white font-monospace px-2.5 py-1">
                Total: 26.05 kg / semana
              </span>
            </div>

            <Table responsive hover size="sm" className="align-middle mb-0 font-sans text-xs">
                <thead className="table-light">
                  <tr>
                    <th>Fertilizante AIFA Soluble</th>
                    <th>Fórmula Química</th>
                    <th>Dosis Semanal (2.500 plantas)</th>
                    <th>Función Agronómica Clave en Quíbor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Nitrato de Calcio AIFA</strong></td>
                    <td className="font-monospace text-muted">15.5-0-0 + 26% CaO</td>
                    <td className="font-monospace fw-bold text-primary">18.00 kg/semana</td>
                    <td>Aporte de calcio móvil. Previene necrosis apical ("culillo") inducida por salinidad.</td>
                  </tr>
                  <tr>
                    <td><strong>Nitrato de Potasio Soluble</strong></td>
                    <td className="font-monospace text-muted">13-0-46</td>
                    <td className="font-monospace fw-bold text-primary">7.50 kg/semana</td>
                    <td>Nitrógeno nítrico de asimilación rápida para calibre y peso de pimentón.</td>
                  </tr>
                  <tr>
                    <td><strong>Quelato de Hierro Fe-EDDHA 6%</strong></td>
                    <td className="font-monospace text-muted">orto-orto soluble</td>
                    <td className="font-monospace fw-bold text-primary">0.55 kg/semana (550 g)</td>
                    <td>Estable en pH alcalino (7.8 - 8.2) de los pozos de Quíbor. Evita clorosis férrica.</td>
                  </tr>
                </tbody>
              </Table>
          </div>
        )}

        {activeTank === 'B' && (
          <div className="p-3 bg-light rounded-4 border border-secondary-subtle">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h4 className="fs-6 fw-bold text-dark mb-0">Tanque B — Volumen 500 Litros</h4>
                <span className="text-muted text-xs font-sans">Fósforo, Potasio, Magnesio, Azufre y Microelementos</span>
              </div>
              <span className="badge bg-success text-white font-monospace px-2.5 py-1">
                Total: 40.45 kg / semana
              </span>
            </div>

            <Table responsive hover size="sm" className="align-middle mb-0 font-sans text-xs">
                <thead className="table-light">
                  <tr>
                    <th>Fertilizante AIFA Soluble</th>
                    <th>Fórmula Química</th>
                    <th>Dosis Semanal (2.500 plantas)</th>
                    <th>Función Agronómica Clave en Quíbor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Nitrato de Potasio Soluble</strong></td>
                    <td className="font-monospace text-muted">13-0-46</td>
                    <td className="font-monospace fw-bold text-success">15.00 kg/semana</td>
                    <td>Presión osmótica en frutos, azúcares (grados Brix) y firmeza de pared celular.</td>
                  </tr>
                  <tr>
                    <td><strong>Fosfato Monopotásico MKP AIFA</strong></td>
                    <td className="font-monospace text-muted">0-52-34</td>
                    <td className="font-monospace fw-bold text-success">5.00 kg/semana</td>
                    <td>Fósforo soluble sin amonio, induce floración profusa y elongación radicular.</td>
                  </tr>
                  <tr>
                    <td><strong>Sulfato de Potasio K₂SO₄</strong></td>
                    <td className="font-monospace text-muted">0-0-50 + 18% S</td>
                    <td className="font-monospace fw-bold text-success">12.00 kg/semana</td>
                    <td>Aporte de potasio libre de cloro. Mitiga toxicidad por cloruros del acuífero.</td>
                  </tr>
                  <tr>
                    <td><strong>Sulfato de Magnesio Heptahidratado</strong></td>
                    <td className="font-monospace text-muted">16% MgO + 13% S</td>
                    <td className="font-monospace fw-bold text-success">8.00 kg/semana</td>
                    <td>Núcleo de clorofila. Mantiene fotosíntesis en momentos de radiación pico.</td>
                  </tr>
                  <tr>
                    <td><strong>Boro Soluble (Octaborato Disódico)</strong></td>
                    <td className="font-monospace text-muted">20.5% B</td>
                    <td className="font-monospace fw-bold text-success">0.15 kg/semana (150 g)</td>
                    <td>Germinación del tubo polínico. Vital para evitar caída de flores por calor.</td>
                  </tr>
                  <tr>
                    <td><strong>Micronutrientes Quelatados Mezcla</strong></td>
                    <td className="font-monospace text-muted">Mn, Zn, Cu, Mo</td>
                    <td className="font-monospace fw-bold text-success">0.30 kg/semana (300 g)</td>
                    <td>Cofactores enzimáticos para amortiguar estrés térmico del valle.</td>
                  </tr>
                </tbody>
              </Table>
          </div>
        )}

        {activeTank === 'C' && (
          <div className="p-3 bg-light rounded-4 border border-secondary-subtle">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h4 className="fs-6 fw-bold text-dark mb-0">Tanque C — Volumen 200 Litros (Ácido Nítrico)</h4>
                <span className="text-muted text-xs font-sans">Neutralización de Bicarbonatos y Regulación de pH</span>
              </div>
              <span className="badge bg-danger bg-opacity-15 text-danger border border-danger border-opacity-30 font-monospace">
                Consumo: 11.0 – 12.5 L / semana
              </span>
            </div>

            <div className="row g-3">
              <div className="col-12 col-md-4">
                <div className="p-3 bg-white rounded-3 border border-secondary-subtle">
                  <span className="text-muted text-xxs fw-bold text-uppercase d-block mb-1">Inyección Diaria</span>
                  <div className="display-6 fw-bold font-mono text-danger">1.60 <span className="fs-6 fw-normal text-muted">L/día</span></div>
                  <span className="text-muted text-xxs">Ácido Nítrico Técnico 60% comercial</span>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="p-3 bg-white rounded-3 border border-secondary-subtle">
                  <span className="text-muted text-xxs fw-bold text-uppercase d-block mb-1">Bicarbonatos Neutralizados</span>
                  <div className="display-6 fw-bold font-mono text-dark">4.20 <span className="fs-6 fw-normal text-muted">meq/L</span></div>
                  <span className="text-muted text-xxs">Alcalinidad real del acuífero de Quíbor</span>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="p-3 bg-white rounded-3 border border-secondary-subtle">
                  <span className="text-muted text-xxs fw-bold text-uppercase d-block mb-1">pH Regulado en Gotero</span>
                  <div className="display-6 fw-bold font-mono text-success">5.8 – 6.2</div>
                  <span className="text-muted text-xxs">Solubilidad perfecta y absorción radicular</span>
                </div>
              </div>
            </div>

            <p className="text-muted text-xs mt-3 mb-0 font-sans">
              El ácido nítrico disuelve precipitados de carbonato de calcio en los laberintos de los goteros de 1.6 L/h, prolongando la uniformidad del sistema.
            </p>
          </div>
        )}
      </Card>

      {/* ====================================================================
         6. PROTOCOLOS OPERATIVOS: RIEGO POR PULSOS Y TUTORADO MECÁNICO
         ==================================================================== */}
      <Row className="g-4">
        <Col xs={12} lg={6}>
          <Card className="card-cockpit p-4 h-100">
            <h3 className="fs-6 fw-bold text-dark mb-2 d-flex align-items-center gap-2">
              <span className="material-symbols-outlined text-info ms-sm">timer</span>
              <span>Protocolo de Riego por Pulsos Fraccionados</span>
            </h3>
            <p className="text-secondary small font-sans mb-3">
              Técnica anti-salina para evitar acumulación osmótica en la zona radicular (0-30 cm) del pimentón:
            </p>

            <ul className="list-group list-group-flush text-xs font-sans">
              <li className="list-group-item px-0 py-2 d-flex align-items-start gap-2 bg-transparent">
                <span className="badge bg-primary text-white font-monospace px-2 py-1 flex-shrink-0">Pulso 1 (06:30 AM)</span>
                <span>Lavado matutino y restitución de turgencia celular post-nocturna.</span>
              </li>
              <li className="list-group-item px-0 py-2 d-flex align-items-start gap-2 bg-transparent">
                <span className="badge bg-primary text-white font-monospace px-2 py-1 flex-shrink-0">Pulso 2 (09:45 AM)</span>
                <span>Inicio de transpiración y primera inyección de fertirriego Tanque A + C.</span>
              </li>
              <li className="list-group-item px-0 py-2 d-flex align-items-start gap-2 bg-transparent">
                <span className="badge bg-primary text-white font-monospace px-2 py-1 flex-shrink-0">Pulso 3 (12:15 PM)</span>
                <span>Ventana térmica pico (30-31°C). Mantiene bulbo húmedo y amortigua temperatura radicular.</span>
              </li>
              <li className="list-group-item px-0 py-2 d-flex align-items-start gap-2 bg-transparent">
                <span className="badge bg-primary text-white font-monospace px-2 py-1 flex-shrink-0">Pulso 4 (02:45 PM)</span>
                <span>Segunda inyección nutricional Tanque B + C para sostenimiento fotosintético.</span>
              </li>
              <li className="list-group-item px-0 py-2 d-flex align-items-start gap-2 bg-transparent">
                <span className="badge bg-primary text-white font-monospace px-2 py-1 flex-shrink-0">Pulso 5 (04:30 PM)</span>
                <span>Enjuague final de cinta con agua acidificada para mantener conductividad baja en goteros.</span>
              </li>
            </ul>
          </Card>
        </Col>

        <Col xs={12} lg={6}>
          <Card className="card-cockpit p-4 h-100">
            <h3 className="fs-6 fw-bold text-dark mb-2 d-flex align-items-center gap-2">
              <span className="material-symbols-outlined text-success ms-sm">fence</span>
              <span>Tutorado Mecánico con Hortomalla 15×15 cm</span>
            </h3>
            <p className="text-secondary small font-sans mb-3">
              Ahorro del 88% en costos laborales frente a atado individual y blindaje estructural del pimentón:
            </p>

            <div className="row g-2 mb-3">
              <div className="col-6">
                <div className="p-2.5 bg-light rounded-3 border border-secondary-subtle">
                  <span className="text-muted text-xxs d-block">Malla Espaldera Biorientada</span>
                  <strong className="font-mono text-dark text-xs">500 m lineales</strong>
                  <span className="text-muted text-xxs d-block">10 camellones de 50 m</span>
                </div>
              </div>
              <div className="col-6">
                <div className="p-2.5 bg-light rounded-3 border border-secondary-subtle">
                  <span className="text-muted text-xxs d-block">Ahorro en Mano de Obra</span>
                  <strong className="font-mono text-success text-xs">-88% jornales</strong>
                  <span className="text-muted text-xxs d-block">1.0 a 1.25 jornales/mes</span>
                </div>
              </div>
            </div>

            <div className="alert alert-success bg-success bg-opacity-10 border-success border-opacity-25 rounded-3 p-2.5 text-xxs font-sans mb-0">
              <strong>Conducción y Tutorado de Pimentón:</strong> Conducción a 2-3 tallos principales guiados en hiladas horizontales de Hortomalla a 1.50 m. Previene el quebrado de ramas por peso de fruto (5 kg/planta) y asegura ventilación óptima del estrato medio.
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
