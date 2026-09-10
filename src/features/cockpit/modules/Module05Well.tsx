import React, { useState } from 'react';
import { WellViewer } from '../../3d-viewers/WellViewer/WellViewer';
import { KpiCard } from '../../../shared/components/KpiCard';
import { BlockMath, InlineMath } from 'react-katex';

type WellScenario = '60m' | '120m';

export const Module05Well: React.FC = () => {
  const [scenario, setScenario] = useState<WellScenario>('60m');
  const [showTheis, setShowTheis] = useState<boolean>(false);

  // Demanda hídrica base
  const dailyDemandL = 7500; // Demanda pico diaria referencial

  // Parámetros por escenario
  const is60m = scenario === '60m';
  
  const totalDepthM = is60m ? 60 : 120;
  const staticWaterLevelM = 49.5;
  const pumpFlowLh = is60m ? 7200 : 9000; // 2.0 L/s vs 2.5 L/s
  const pumpFlowLs = (pumpFlowLh / 3600).toFixed(1);
  const drawdownM = is60m ? 3.7 : 4.5;
  const dynamicWaterLevelM = staticWaterLevelM + drawdownM;
  const waterColumnM = Number((totalDepthM - dynamicWaterLevelM).toFixed(1));
  const pumpingHoursNeeded = (dailyDemandL / pumpFlowLh).toFixed(2);

  // Evaluación de Viabilidad
  const kpiVariant = is60m ? 'danger' : 'success';
  const columnKpiVariant = waterColumnM < 10 ? 'danger' : 'success';

  return (
    <div className="space-y-4">
      <div className="card-cockpit p-4">
        
        {/* Header y Toggle de Escenarios */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div>
            <h3 className="fs-6 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
              <span className="material-symbols-outlined text-info ms-sm">water_pump</span>
              <span>Análisis de Viabilidad Hidrogeológica</span>
            </h3>
            <span className="text-secondary small">
              Acuífero Valle de Quíbor (Cono Central a 546 msnm)
            </span>
          </div>

          <div className="bg-light p-1 rounded-3 border border-secondary-subtle d-flex shadow-sm">
            <button 
              className={`btn btn-sm border-0 fw-bold px-3 ${is60m ? 'bg-white text-dark shadow-sm' : 'text-secondary'}`}
              onClick={() => setScenario('60m')}
            >
              Pozo Actual (60m)
            </button>
            <button 
              className={`btn btn-sm border-0 fw-bold px-3 ${!is60m ? 'bg-info text-white shadow-sm' : 'text-secondary'}`}
              onClick={() => setScenario('120m')}
            >
              Proyección Profunda (120m / 6")
            </button>
          </div>
        </div>

        {/* Tarjeta de Diagnóstico RAG */}
        <div className={`alert d-flex align-items-start gap-3 mb-4 border ${is60m ? 'alert-danger bg-danger bg-opacity-10 border-danger border-opacity-25' : 'alert-success bg-success bg-opacity-10 border-success border-opacity-25'}`}>
          <span className={`material-symbols-outlined fs-4 ${is60m ? 'text-danger' : 'text-success'}`}>
            {is60m ? 'warning' : 'verified'}
          </span>
          <div>
            <h4 className={`fs-6 fw-bold mb-1 ${is60m ? 'text-danger' : 'text-success'}`}>
              {is60m ? 'Riesgo Crítico de Cavitación (Déficit Hídrico)' : 'Viabilidad Hídrica Asegurada (Lentes Profundos)'}
            </h4>
            <p className="mb-0 text-dark small font-sans">
              {is60m 
                ? 'Según el estudio CIDIAT-ULA, el nivel freático central ha descendido de 53m a más de 95m históricamente. A 60m de perforación, el pozo solo retiene una columna útil de 10.5m en estático. Al encender la bomba, la columna baja a 6.8m. En sequía severa, el pozo succionará aire y colapsará la producción.'
                : 'Perforar a 120m con encamisado de 6" permite atravesar el cono de abatimiento y alcanzar gravas fluvio-lacustres. Garantiza una columna de agua presurizada de más de 70m, asegurando el caudal de 2.5 L/s todo el año. Reto: Mayor salinidad Terciaria (ECw ~2.0 dS/m) requerirá inyección de Ácido Nítrico y LF 20%.'}
            </p>
          </div>
        </div>

        {/* KPIs Hidráulicos del Pozo */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-3">
            <KpiCard
              label="Nivel Dinámico (ND)"
              value={`${dynamicWaterLevelM}`}
              unit="metros"
              subtext={`Bombeando a ${pumpFlowLs} L/s`}
              iconName="compress"
              variant={is60m ? 'warning' : 'info'}
            />
          </div>

          <div className="col-12 col-md-3">
            <KpiCard
              label="Abatimiento (&Delta;s)"
              value={`${drawdownM}`}
              unit="metros"
              subtext="Descenso del cono de depresión"
              iconName="vertical_align_bottom"
              variant="info"
            />
          </div>

          <div className="col-12 col-md-3">
            <KpiCard
              label="Columna de Agua Útil"
              value={`${waterColumnM}`}
              unit="metros"
              subtext={is60m ? '¡Margen de seguridad insuficiente!' : 'Reservorio presurizado profundo seguro'}
              iconName="water_full"
              variant={columnKpiVariant}
            />
          </div>

          <div className="col-12 col-md-3">
            <KpiCard
              label="Tiempo Bombeo (1000m²)"
              value={`${pumpingHoursNeeded}`}
              unit="horas/día"
              subtext={`Eficiencia con bomba de ${pumpFlowLs} L/s`}
              iconName="timer"
              variant="success"
            />
          </div>
        </div>

        {/* Visor 3D del Pozo */}
        <div className="rounded-3 overflow-hidden border border-secondary-subtle shadow-sm mb-3 position-relative">
          <div className="position-absolute top-0 start-0 m-2 z-1">
            <span className="badge bg-dark bg-opacity-75 font-monospace text-xs">
              Esquema Transversal (Corte Geológico)
            </span>
          </div>
          <WellViewer 
            scenario={scenario}
            totalDepthM={totalDepthM} 
            staticWaterLevelM={staticWaterLevelM}
            dynamicWaterLevelM={dynamicWaterLevelM} 
          />
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
            <div className="formula-box formula-box-water mt-3">
              <div className="text-secondary text-xs mb-2 font-sans">
                Ecuación de Régimen No Estacionario (Cooper &amp; Jacob):
              </div>
              <BlockMath math="s = \frac{Q}{4\pi T} \ln\left(\frac{2.25\, T\, t}{r^2 S}\right)" />
              <div className="text-secondary small mt-3 font-sans lh-base">
                Donde <InlineMath math={`Q = ${pumpFlowLs}\\ \\text{L/s}`} />, con transmisividad acuífera <InlineMath math="T" /> y coeficiente de almacenamiento <InlineMath math="S" /> típicos del acuífero de Quíbor. 
                {is60m 
                  ? ' En el estrato superficial (60m), la transmisividad es limitada y el abatimiento rápido amenaza con romper el equilibrio estático.' 
                  : ' Al alcanzar 120m, interceptamos estratos confinados con mayor presión y T, estabilizando el abatimiento de forma sustentable, aunque extrayendo aguas más añejas y salinas.'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
