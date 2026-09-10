import React, { useState } from 'react';
import { useAgroStore } from '../../../shared/store/useAgroStore';
import { calculateVentilation } from '../../../core/engineering/ventilation';
import { Slider } from '../../../shared/components/Slider';
import { KpiCard } from '../../../shared/components/KpiCard';
import { BlockMath, InlineMath } from 'react-katex';

export const Module02Ventilation: React.FC = () => {
  const {
    greenhouseLengthM,
    greenhouseWidthM,
    gutterHeightM,
    ridgeHeightM,
    numWindTurbines,
    setGreenhouseDimensions,
  } = useAgroStore();

  const [showHellmann, setShowHellmann] = useState<boolean>(false);

  const ventResult = calculateVentilation({
    ridgeHeightM,
    lengthM: greenhouseLengthM,
    widthM: greenhouseWidthM,
    gutterHeightM,
    baseWindSpeed10mKmH: 8.8,
    numWindTurbines,
    turbineDiameterInches: 30,
  });

  // Cálculo de velocidad de viento a cumbrera con Hellmann (alpha = 0.16)
  const v10 = 8.8; // km/h
  const alpha = 0.16;
  const vRidge = (v10 * Math.pow(ridgeHeightM / 10, alpha)).toFixed(2);
  const vLow = (v10 * Math.pow(2.5 / 10, alpha)).toFixed(2);
  const flowPenaltyPct = Math.round((1 - Number(vLow) / Number(vRidge)) * 100);

  return (
    <div className="card-cockpit p-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <div>
          <h3 className="fs-6 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <span className="material-symbols-outlined text-brand-bright ms-sm">cyclone</span>
            <span>Dinámica Eólica &amp; Renovaciones de Aire (Ley de Hellmann)</span>
          </h3>
          <p className="text-secondary small mb-0">
            Valle de Quíbor · Coeficiente de fricción aerodinámica $\alpha = 0.16$ · Altura cumbrera activa: {ridgeHeightM}m
          </p>
        </div>
        <span className="badge bg-success bg-opacity-15 text-success border border-success border-opacity-30 rounded-pill font-monospace px-3 py-1">
          Hellmann &alpha; = 0.16
        </span>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <KpiCard
            label="Tasa de Renovación (RAH)"
            value={ventResult.airChangesPerHour}
            unit="RAH"
            subtext={ventResult.isAdequate ? 'Óptimo (≥ 45 RAH para Valle de Quíbor)' : 'Atención: Ventilación insuficiente'}
            iconName="speed"
            variant={ventResult.isAdequate ? 'success' : 'danger'}
          />
        </div>

        <div className="col-12 col-md-4">
          <KpiCard
            label="Flujo Convectivo Malla 50 Mesh"
            value={ventResult.convectiveFlowM3H.toLocaleString()}
            unit="m³/h"
            subtext="Ventilación pasiva continua perimetral"
            iconName="air"
            variant="info"
          />
        </div>

        <div className="col-12 col-md-4">
          <KpiCard
            label="Extractores Eólicos Cumbrera"
            value={ventResult.ridgeFansFlowM3H.toLocaleString()}
            unit="m³/h"
            subtext={`${numWindTurbines} extractores eólicos de 30"`}
            iconName="wind_power"
            variant="warning"
          />
        </div>
      </div>

      {/* Sliders de Dimensiones Estructurales */}
      <div className="row g-4 pt-3 border-top border-secondary-subtle">
        <div className="col-12 col-md-6">
          <Slider
            label="Altura a Cumbrera (m):"
            value={ridgeHeightM}
            min={3.0}
            max={7.0}
            step={0.5}
            unit="metros"
            accentColor="success"
            iconName="height"
            onChange={(val) => setGreenhouseDimensions({ ridgeHeightM: val })}
          />
        </div>

        <div className="col-12 col-md-6">
          <Slider
            label="Extractores Eólicos de 30 pulgadas:"
            value={numWindTurbines}
            min={2}
            max={14}
            step={1}
            unit="unidades"
            accentColor="info"
            iconName="mode_fan"
            onChange={(val) => setGreenhouseDimensions({ numWindTurbines: val })}
          />
        </div>
      </div>

      {/* Desglose Físico Ley de Hellmann KaTeX */}
      <div className="mt-3 pt-3 border-top border-secondary-subtle">
        <button
          type="button"
          onClick={() => setShowHellmann(!showHellmann)}
          className="btn btn-sm btn-link text-success text-decoration-none p-0 d-flex align-items-center gap-1 font-monospace text-xs"
        >
          <span className="material-symbols-outlined ms-sm">
            {showHellmann ? 'expand_less' : 'functions'}
          </span>
          <span>{showHellmann ? 'Ocultar Ecuación de Hellmann' : 'Ver Fundamento Termodinámico y Ley de Hellmann (KaTeX)'}</span>
        </button>

        {showHellmann && (
          <div className="formula-box formula-box-sun mt-2">
            <div className="text-secondary text-xs mb-1 font-sans">
              Ley Exponencial de Hellmann para Gradiente Eólico en Quíbor:
            </div>
            <BlockMath math="v(z) = v_{10} \cdot \left(\frac{z}{10}\right)^\alpha" />
            <div className="text-secondary small mt-2 font-sans">
              Donde <InlineMath math="v_{10} = 8.8\ \text{km/h}" /> (velocidad media a 10m en Quíbor) y <InlineMath math="\alpha = 0.16" /> (terreno plano despejado).
            </div>
            <div className="p-2 bg-warning-subtle text-dark rounded-3 mt-2 font-sans text-xs border border-warning-subtle">
              <span className="text-warning-emphasis fw-bold">Hallazgo Crítico:</span> A {ridgeHeightM}m de cumbrera, el viento alcanza <strong>{vRidge} km/h</strong>. Si la estructura se diseñara a solo 2.5m, la velocidad caería a <strong>{vLow} km/h</strong>, sufriendo una <strong>pérdida de tiro del {flowPenaltyPct}%</strong>. Por ello, la altura estructural es irremplazable por extractores solos.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
