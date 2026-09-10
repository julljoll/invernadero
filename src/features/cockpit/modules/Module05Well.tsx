import React, { useState } from 'react';
import { WellViewer } from '../../3d-viewers/WellViewer/WellViewer';
import { KpiCard } from '../../../shared/components/KpiCard';
import { BlockMath, InlineMath } from 'react-katex';

export const Module05Well: React.FC = () => {
  const [showTheis, setShowTheis] = useState<boolean>(false);

  // Parámetros reales del Pozo en Sector Cuara / Quíbor
  const totalDepthM = 60;
  const staticWaterLevelM = 49.5;
  const dynamicWaterLevelM = 53.2;
  const drawdownM = Number((dynamicWaterLevelM - staticWaterLevelM).toFixed(1)); // 3.7m
  const pumpFlowLh = 7200; // 2.0 L/s
  const dailyDemandL = 7500; // Demanda pico diaria para 1.000 m² con LF
  const pumpingHoursNeeded = (dailyDemandL / pumpFlowLh).toFixed(2);

  return (
    <div className="space-y-4">
      <div className="card-cockpit p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div>
            <h3 className="fs-6 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
              <span className="material-symbols-outlined text-info ms-sm">layers</span>
              <span>Modelo Hidrogeológico &amp; Dinámica del Pozo Profundo (60m)</span>
            </h3>
            <span className="text-secondary small">
              Acuífero Valle de Quíbor · Sector Cuara · Monitoreo Piezométrico
            </span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-info bg-opacity-15 border border-info border-opacity-30 text-info font-monospace">
              Theis / Cooper-Jacob
            </span>
            <span className="badge bg-success bg-opacity-15 border border-success border-opacity-30 text-success font-monospace">
              Bomba 2.0 L/s (7.200 L/h)
            </span>
          </div>
        </div>

        {/* KPIs Hidráulicos del Pozo */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-3">
            <KpiCard
              label="Nivel Estático (NE)"
              value={`${staticWaterLevelM}`}
              unit="metros"
              subtext="Profundidad espejo de agua en reposo"
              iconName="straighten"
              variant="info"
            />
          </div>

          <div className="col-12 col-md-3">
            <KpiCard
              label="Nivel Dinámico (ND)"
              value={`${dynamicWaterLevelM}`}
              unit="metros"
              subtext="Nivel en régimen continuo (2.0 L/s)"
              iconName="compress"
              variant="info"
            />
          </div>

          <div className="col-12 col-md-3">
            <KpiCard
              label="Abatimiento (&Delta;s)"
              value={`${drawdownM}`}
              unit="metros"
              subtext="Cono de depresión moderado y seguro"
              iconName="vertical_align_bottom"
              variant="success"
            />
          </div>

          <div className="col-12 col-md-3">
            <KpiCard
              label="Tiempo Bombeo Diario"
              value={`${pumpingHoursNeeded}`}
              unit="horas/día"
              subtext="Abastece 1.000 m² al 100% en 63 min"
              iconName="timer"
              variant="warning"
            />
          </div>
        </div>

        {/* Visor 3D del Pozo */}
        <div className="rounded-3 overflow-hidden border border-secondary-subtle shadow-sm mb-3">
          <WellViewer totalDepthM={totalDepthM} staticWaterLevelM={staticWaterLevelM} />
        </div>

        {/* Progressive Disclosure de Ecuación Cooper-Jacob */}
        <div className="pt-2 border-top border-secondary-subtle">
          <button
            type="button"
            onClick={() => setShowTheis(!showTheis)}
            className="btn btn-sm btn-link text-info text-decoration-none p-0 d-flex align-items-center gap-1 font-monospace text-xs"
          >
            <span className="material-symbols-outlined ms-sm">
              {showTheis ? 'expand_less' : 'functions'}
            </span>
            <span>{showTheis ? 'Ocultar Ecuación Hidráulica' : 'Ver Ecuación de Abatimiento Theis / Cooper-Jacob (KaTeX)'}</span>
          </button>

          {showTheis && (
            <div className="formula-box formula-box-water mt-2">
              <div className="text-secondary text-xs mb-1 font-sans">
                Ecuación de Régimen No Estacionario (Cooper &amp; Jacob):
              </div>
              <BlockMath math="s = \frac{Q}{4\pi T} \ln\left(\frac{2.25\, T\, t}{r^2 S}\right)" />
              <div className="text-secondary small mt-2 font-sans">
                Donde <InlineMath math="Q = 2.0\ \text{L/s} = 0.002\ \text{m}^3\text{/s}" />, con transmisividad acuífera <InlineMath math="T" /> y coeficiente de almacenamiento <InlineMath math="S" /> típicos de las arenas arcillosas de Quíbor. El abatimiento estabiliza a solo <strong>{drawdownM} m</strong>, garantizando sustentabilidad sin sobreexplotar el pozo.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
