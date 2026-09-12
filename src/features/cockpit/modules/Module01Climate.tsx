import React, { useState } from 'react';
import { Card, Row, Col, Badge, Table, Alert, Button } from 'react-bootstrap';
import { calculateVpd } from '../../../core/agronomy/vpd';
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

export const Module01Climate: React.FC = () => {
  const [simTemp, setSimTemp] = useState<number>(29.5);
  const [simHr, setSimHr] = useState<number>(65);
  const [showFormulas, setShowFormulas] = useState<boolean>(false);

  const vpdResult = calculateVpd(simTemp, simHr);

  const statusBadgeVariant: Record<string, string> = {
    danger_low: 'danger',
    optimum: 'success',
    warning_high: 'warning',
    danger_high: 'danger',
  };

  // Datos para el Climograma Dual NASA MERRA-2 Quíbor
  const climateLabels = QUIBOR_CLIMATE_MONTHS.map((m) => m.mes.substring(0, 3));
  const maxTemps = QUIBOR_CLIMATE_MONTHS.map((m) => m.max);
  const minTemps = QUIBOR_CLIMATE_MONTHS.map((m) => m.min);
  const rainfall = QUIBOR_CLIMATE_MONTHS.map((m) => m.lluvia);

  const climogramChartData = {
    labels: climateLabels,
    datasets: [
      {
        type: 'line' as const,
        label: 'T. Máxima (°C)',
        data: maxTemps,
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.12)',
        borderWidth: 2.5,
        tension: 0.35,
        pointBackgroundColor: '#f59e0b',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: 'yTemp',
      },
      {
        type: 'line' as const,
        label: 'T. Mínima (°C)',
        data: minTemps,
        borderColor: '#0284c7',
        backgroundColor: 'rgba(2, 132, 199, 0.08)',
        borderWidth: 2.5,
        tension: 0.35,
        pointBackgroundColor: '#0284c7',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: 'yTemp',
      },
      {
        type: 'bar' as const,
        label: 'Precipitación NASA (mm)',
        data: rainfall,
        backgroundColor: 'rgba(83, 201, 66, 0.65)',
        borderColor: '#248a15',
        borderWidth: 1.2,
        borderRadius: 5,
        yAxisID: 'yRain',
      },
    ],
  };

  const climogramChartOptions: any = {
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
        titleColor: '#f8fafc',
        bodyColor: '#f1f5f9',
        titleFont: { family: "'Plus Jakarta Sans', sans-serif", size: 12, weight: 'bold' },
        bodyFont: { family: "'JetBrains Mono', monospace", size: 11 },
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        ticks: { color: '#475569', font: { family: "'Plus Jakarta Sans', sans-serif", size: 11, weight: '600' } },
        grid: { color: 'rgba(226, 232, 240, 0.6)' },
      },
      yTemp: {
        type: 'linear' as const,
        position: 'left' as const,
        min: 12,
        max: 36,
        title: {
          display: true,
          text: 'Temperatura (°C)',
          color: '#b45309',
          font: { family: "'Plus Jakarta Sans', sans-serif", size: 11, weight: 'bold' },
        },
        ticks: { color: '#b45309', font: { family: "'JetBrains Mono', monospace", size: 10 } },
        grid: { color: 'rgba(226, 232, 240, 0.6)' },
      },
      yRain: {
        type: 'linear' as const,
        position: 'right' as const,
        min: 0,
        max: 130,
        title: {
          display: true,
          text: 'Precipitación (mm)',
          color: '#16a34a',
          font: { family: "'Plus Jakarta Sans', sans-serif", size: 11, weight: 'bold' },
        },
        ticks: { color: '#16a34a', font: { family: "'JetBrains Mono', monospace", size: 10 } },
        grid: { drawOnChartArea: false },
      },
    },
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* ====================================================================
         SECCIÓN 1: SIMULADOR PSICROMÉTRICO & DÉFICIT DE PRESIÓN DE VAPOR (VPD)
         ==================================================================== */}
      <Card className="card-cockpit p-4">
        {/* Encabezado del Simulador */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4 pb-2 border-bottom border-secondary-subtle">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-brand-bright ms-sm">psychology</span>
              <h2 className="fs-5 fw-bold text-dark mb-0">
                01. Clima &amp; Déficit de Presión de Vapor (VPD)
              </h2>
            </div>
            <p className="text-secondary small mb-0 font-sans">
              Simulador psicrométrico interactivo según ecuación de Tetens y corrección foliar FAO para 2.500 plantas de pimentón.
            </p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="agro-chip agro-chip-sun font-monospace text-xs">
              Transpiración &amp; Cuajado
            </span>
            <Badge bg="success" className="bg-opacity-20 text-success border border-success border-opacity-30 font-monospace text-xs px-2.5 py-1">
              Tetens / FAO-56
            </Badge>
          </div>
        </div>

        {/* Sliders Interactivos Distribuidos en Grid */}
        <Row className="g-4 mb-4">
          <Col xs={12} md={6}>
            <div className="p-3 bg-light rounded-4 border border-secondary-subtle h-100">
              <Slider
                label="Temperatura Interior (°C):"
                value={simTemp}
                min={18}
                max={40}
                step={0.5}
                unit="°C"
                accentColor="warning"
                iconName="device_thermostat"
                onChange={setSimTemp}
              />
              <div className="text-muted text-xxs mt-2 font-sans">
                Rango óptimo para pimentón en Quíbor: <strong>22 °C a 30 °C</strong> (aborto floral &gt; 32 °C).
              </div>
            </div>
          </Col>

          <Col xs={12} md={6}>
            <div className="p-3 bg-light rounded-4 border border-secondary-subtle h-100">
              <Slider
                label="Humedad Relativa (%):"
                value={simHr}
                min={20}
                max={95}
                step={1}
                unit="%"
                accentColor="info"
                iconName="humidity_mid"
                onChange={setSimHr}
              />
              <div className="text-muted text-xxs mt-2 font-sans">
                Rango óptimo para pimentón: <strong>55% a 70%</strong> (menor a 50% detona estrés hídrico y ácaros).
              </div>
            </div>
          </Col>
        </Row>

        {/* Panel de Resultados de VPD */}
        <div className="p-3.5 bg-light rounded-4 border border-secondary-subtle mb-3">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <span className="text-secondary text-xs fw-bold text-uppercase d-flex align-items-center gap-1.5">
              <span className="material-symbols-outlined text-success ms-sm">monitoring</span>
              <span>Lecturas de Transpiración y Balances Psicrométricos:</span>
            </span>
            <Badge bg={statusBadgeVariant[vpdResult.status] || 'secondary'} className="rounded-pill px-3 py-1.5 font-monospace text-xs shadow-sm">
              {vpdResult.statusLabel}
            </Badge>
          </div>

          <Row className="g-3 mb-3">
            <Col xs={12} sm={6} lg={3}>
              <div className="p-3 bg-white rounded-3 border border-secondary-subtle h-100">
                <div className="text-secondary text-xs font-sans mb-1">VPD Aire (Atm)</div>
                <div className="display-6 fw-bold font-mono text-dark">
                  {vpdResult.vpdAir} <span className="fs-6 fw-normal text-secondary font-monospace">kPa</span>
                </div>
                <span className="text-secondary text-xs font-monospace">T_aire = {simTemp}°C</span>
              </div>
            </Col>

            <Col xs={12} sm={6} lg={3}>
              <div className="p-3 bg-white rounded-3 border border-success border-opacity-30 h-100">
                <div className="text-success text-xs font-sans fw-bold mb-1">VPD Foliar (Canopy)</div>
                <div className="display-6 fw-bold font-mono text-success">
                  {vpdResult.vpdCanopy} <span className="fs-6 fw-normal text-secondary font-monospace">kPa</span>
                </div>
                <span className="text-secondary text-xs font-monospace">T_hoja = {(simTemp - 1.8).toFixed(1)}°C (ΔT -1.8)</span>
              </div>
            </Col>

            <Col xs={12} lg={6}>
              <div className="p-3 bg-white rounded-3 border border-secondary-subtle h-100 d-flex flex-column justify-content-center">
                <div className="text-secondary text-xs fw-bold text-uppercase mb-1 d-flex align-items-center gap-1">
                  <span className="material-symbols-outlined text-success ms-sm">tips_and_updates</span>
                  <span>Diagnóstico Agronómico para Pimentón</span>
                </div>
                <p className="text-dark small mb-0 lh-base">
                  {vpdResult.recommendation}
                </p>
              </div>
            </Col>
          </Row>
        </div>

        {/* Desglose Matemático KaTeX (Progressive Disclosure) */}
        <div>
          <Button
            variant="link"
            size="sm"
            onClick={() => setShowFormulas(!showFormulas)}
            className="text-success text-decoration-none p-0 d-flex align-items-center gap-1 font-monospace text-xs"
          >
            <span className="material-symbols-outlined ms-sm">
              {showFormulas ? 'expand_less' : 'calculate'}
            </span>
            <span>{showFormulas ? 'Ocultar Ecuaciones Psicrométricas' : 'Ver Ecuaciones Tetens & Canopy (KaTeX)'}</span>
          </Button>

          {showFormulas && (
            <div className="formula-box mt-3 p-3 bg-light rounded-3 border border-secondary-subtle">
              <div className="text-secondary text-xs mb-1 font-sans fw-bold">Presión Saturada (Tetens) y Déficit de Presión de Vapor:</div>
              <BlockMath math="e_s(T) = 0.61078 \exp\left(\frac{17.27 \cdot T}{T + 237.3}\right)\ \text{[kPa]}" />
              <BlockMath math="e_a = e_s(T_{aire}) \cdot \left(\frac{HR\%}{100}\right)\ \text{[kPa]}" />
              <BlockMath math="VPD_{aire} = e_s(T_{aire}) - e_a \quad \vert \quad VPD_{canopy} = e_s(T_{hoja}) - e_a" />
              <div className="text-secondary text-xs mt-2 pt-2 border-top border-secondary-subtle font-sans">
                Cálculo instantáneo a {simTemp}°C y {simHr}% HR:
                <div className="mt-1 font-monospace text-dark">
                  <InlineMath math={`e_s = ${vpdResult.esAir}\\ \\text{kPa}`} /> &nbsp;·&nbsp;
                  <InlineMath math={`e_a = ${vpdResult.eaAir}\\ \\text{kPa}`} /> &nbsp;·&nbsp;
                  <InlineMath math={`VPD_{canopy} = ${vpdResult.vpdCanopy}\\ \\text{kPa}`} />
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* ====================================================================
         SECCIÓN 2: CLIMOGRAMA & TABLA LÍNEA BASE QUÍBOR 20 AÑOS (NASA MERRA-2)
         ==================================================================== */}
      <Card className="card-cockpit p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3 pb-2 border-bottom border-secondary-subtle">
          <div>
            <h3 className="fs-5 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
              <span className="material-symbols-outlined text-info ms-sm">satellite_alt</span>
              <span>Línea Base Quíbor (NASA MERRA-2 · 20 Años)</span>
            </h3>
            <span className="text-secondary small font-sans">
              Cota 695 – 710 msnm · Clasificación Köppen BSh (Semiárido cálido / Bosque seco premontano)
            </span>
          </div>
          <div className="text-end">
            <Badge bg="light" text="info" className="border border-info-subtle font-monospace px-2.5 py-1">
              9°53'20.0"N · 69°35'35.0"W (Valle de Quíbor, Lara)
            </Badge>
          </div>
        </div>

        {/* Gráfico Climograma Visual */}
        <div className="p-3 bg-light rounded-4 border border-secondary-subtle mb-4">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="text-xs fw-bold text-uppercase text-secondary d-flex align-items-center gap-1">
              <span className="material-symbols-outlined text-success ms-sm">stacked_line_chart</span>
              <span>Climograma Anual Quíbor: Régimen Térmico vs Pluviometría</span>
            </span>
            <Badge bg="white" text="secondary" className="border font-mono text-xxs">
              12 Meses NASA
            </Badge>
          </div>
          <div style={{ height: '280px', width: '100%' }}>
            <Chart type="bar" data={climogramChartData as any} options={climogramChartOptions} />
          </div>
        </div>

        {/* Tabla Detallada */}
        <Table responsive hover size="sm" className="align-middle small mb-0 font-sans border-secondary-subtle">
          <thead className="table-light">
            <tr className="text-secondary border-bottom border-secondary-subtle text-xs">
              <th>Mes</th>
              <th>T. Máx (°C)</th>
              <th>T. Mín (°C)</th>
              <th>Precipitación (mm)</th>
              <th>Viento Medio (km/h)</th>
              <th>Días Bochorno</th>
              <th>Dirección Dominante</th>
            </tr>
          </thead>
          <tbody className="font-monospace">
            {QUIBOR_CLIMATE_MONTHS.map((m) => {
              const isWindDominant = m.dir.includes('ESTE');
              return (
                <tr key={m.mes} className="border-bottom border-secondary-subtle">
                  <td className="fw-bold text-dark font-sans">{m.mes}</td>
                  <td className="text-danger fw-bold">{m.max}°C</td>
                  <td className="text-info">{m.min}°C</td>
                  <td>{m.lluvia} mm</td>
                  <td>{m.viento} km/h</td>
                  <td>
                    <span className={m.bochorno >= 25 ? 'text-warning fw-bold' : 'text-muted'}>
                      {m.bochorno} d
                    </span>
                  </td>
                  <td>
                    <Badge pill bg={isWindDominant ? 'warning-subtle' : 'light'} text={isWindDominant ? 'warning-emphasis' : 'secondary'} className={`px-2.5 py-1 ${isWindDominant ? 'border border-warning-subtle' : 'border'}`}>
                      {m.dir}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>

        <Alert variant="warning" className="mt-3 p-3 bg-warning bg-opacity-10 border-warning border-opacity-25 d-flex align-items-start gap-2 mb-0">
          <span className="material-symbols-outlined text-warning ms-sm mt-0.5">warning</span>
          <div className="text-dark small">
            <strong className="text-warning-emphasis">Regla de Viento y Cargas Estructurales Quíbor:</strong> Viento del <strong>ESTE</strong> 11 meses del año (hasta 88% frecuencia). Ráfagas registradas de <strong>27 km/h (17 mph)</strong>. Toda fachada Este de la casa de malla para pimentón requiere refuerzo estructural de doble tensor y anclajes con factor de seguridad $\ge 1.5$.
          </div>
        </Alert>
      </Card>
    </div>
  );
};
