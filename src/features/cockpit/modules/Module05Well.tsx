import React, { useState } from 'react';
import { WellViewer } from '../../3d-viewers/WellViewer/WellViewer';
import { KpiCard } from '../../../shared/components/KpiCard';
import { BlockMath, InlineMath } from 'react-katex';

type WellScenario = '60m' | '120m';

export const Module05Well: React.FC = () => {
  const [scenario, setScenario] = useState<WellScenario>('60m');
  const [showTheis, setShowTheis] = useState<boolean>(false);

  // Demanda hídrica base del invernadero (1.000 m²)
  const dailyDemandL = 7500; // 7.5 m³/día pico

  // Parámetros por escenario validados en RAG (PLAN_VALIDACION_POZO_PROFUNDO_QUIBOR.md)
  const is60m = scenario === '60m';
  
  const totalDepthM = is60m ? 60 : 120;
  const staticWaterLevelM = is60m ? 49.5 : 70.0; // 49.5m acuífero libre superior vs 70.0m línea base estival profunda
  const pumpFlowLs = is60m ? 2.0 : 2.8; // 2.0 L/s continuo (1" a 1½") vs 2.8 L/s continuo (~2")
  const pumpFlowLh = pumpFlowLs * 3600; // 7,200 L/h vs 10,080 L/h
  const drawdownM = is60m ? 3.7 : 18.0; // Abatimiento estabilizado
  const dynamicWaterLevelM = staticWaterLevelM + drawdownM; // 53.2m vs 88.0m
  const waterColumnM = Number((totalDepthM - dynamicWaterLevelM).toFixed(1)); // 6.8m vs 32.0m
  const pumpingHoursNeeded = (dailyDemandL / pumpFlowLh).toFixed(2);
  const pumpPowerHp = is60m ? '1.5 HP' : '7.5 HP';
  const casingDiameter = is60m ? '6" ASTM A53' : '8" ASTM A53';
  const pumpSize = is60m ? '4" Sumergible' : '6" Industrial Sumergible';
  const hmtTotal = is60m ? '63.5 mca' : '100.5 mca';

  return (
    <div className="space-y-4">
      <div className="card-cockpit p-4">
        
        {/* Header y Toggle de Escenarios */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div>
            <h3 className="fs-6 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
              <span className="material-symbols-outlined text-info ms-sm">water_pump</span>
              <span>Análisis de Viabilidad Hidrogeológica y Diseño de Captación</span>
            </h3>
            <span className="text-secondary small">
              Valle de Quíbor (Municipio Jiménez, Lara) — Georref: 9°53'20.0"N, 69°35'35.0"W (Cota ~700 msnm)
            </span>
          </div>

          <div className="bg-light p-1 rounded-3 border border-secondary-subtle d-flex shadow-sm">
            <button 
              className={`btn btn-sm border-0 fw-bold px-3 ${is60m ? 'bg-white text-dark shadow-sm' : 'text-secondary'}`}
              onClick={() => setScenario('60m')}
            >
              Pozo Óptimo Actual (60m)
            </button>
            <button 
              className={`btn btn-sm border-0 fw-bold px-3 ${!is60m ? 'bg-info text-white shadow-sm' : 'text-secondary'}`}
              onClick={() => setScenario('120m')}
            >
              Expansión a Futuro (120m / Camisa 8" / Bomba 6" 7.5HP)
            </button>
          </div>
        </div>

        {/* Tarjeta de Diagnóstico RAG */}
        <div className={`alert d-flex align-items-start gap-3 mb-4 border ${is60m ? 'alert-success bg-success bg-opacity-10 border-success border-opacity-25' : 'alert-info bg-info bg-opacity-10 border-info border-opacity-25'}`}>
          <span className={`material-symbols-outlined fs-4 ${is60m ? 'text-success' : 'text-info'}`}>
            {is60m ? 'verified' : 'engineering'}
          </span>
          <div>
            <h4 className={`fs-6 fw-bold mb-1 ${is60m ? 'text-success' : 'text-info'}`}>
              {is60m 
                ? 'Fase 1: Culminación Inmediata de Pozo a 60m (100% Viable y Rentable)' 
                : 'Fase 2: Perforación Profunda 120m con Camisa de 8" y Bomba Industrial de 6" (7.5 HP)'}
            </h4>
            <p className="mb-0 text-dark small font-sans">
              {is60m 
                ? 'El pozo actual a 50m requiere profundizar solo 10m adicionales a pico o barreno 8½" hasta alcanzar los 60m en el Acuífero Cuara. Con Nivel Estático a 49.5m, se consolida una columna de agua de 10.5m. Una bomba de 1.5 HP entrega 1.5 a 2.0 L/s continuos (equivalente a 1 pulgada de agua), cubriendo los 7.5 m³/día del invernadero de 1.000 m² en apenas 1.04 horas de bombeo. Inversión estimada de ~$3.490 a $5.345 USD, amortizable en 2.4 meses frente a camiones cisterna.'
                : 'Para bombear con una electrobomba sumergible industrial de 6" (7.5 HP), se requiere perforar a 12¼" (311 mm) con máquina rotaria y entubar con camisa de acero al carbono de 8" ASTM A53 Grado B (219.1 mm ext). Esto garantiza el espacio anular necesario para refrigerar el motor trifásico y colocar el empaque de grava cuarzosa 2-4 mm. Con 38m de filtros Johnson AISI 304 ranura 0.030", opera a un régimen ultra-laminar (Ve = 0.07 cm/s), venciendo un HMT de 100.5 mca con caudal continuo de 2.5 a 3.0 L/s para abastecer hasta 2.5 hectáreas (4 invernaderos).'}
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
              subtext={`Caudal continuo: ${pumpFlowLs} L/s`}
              iconName="compress"
              variant="success"
            />
          </div>

          <div className="col-12 col-md-3">
            <KpiCard
              label="Potencia Bomba & HMT"
              value={pumpPowerHp}
              unit={`HMT ${hmtTotal}`}
              subtext={pumpSize}
              iconName="bolt"
              variant={is60m ? 'success' : 'info'}
            />
          </div>

          <div className="col-12 col-md-3">
            <KpiCard
              label="Columna de Agua Útil"
              value={`${waterColumnM}`}
              unit="metros"
              subtext={is60m ? 'Suficiente para 1 nave (1000m²)' : 'Reserva masiva para 4 naves'}
              iconName="water_full"
              variant="success"
            />
          </div>

          <div className="col-12 col-md-3">
            <KpiCard
              label="Tiempo Bombeo (1000m²)"
              value={`${pumpingHoursNeeded}`}
              unit="horas/día"
              subtext={`Consumo: ${dailyDemandL / 1000} m³/día`}
              iconName="timer"
              variant="success"
            />
          </div>
        </div>

        {/* Visor 3D del Pozo (Modo AutoCAD) */}
        <div className="rounded-3 overflow-hidden border border-secondary-subtle shadow-sm mb-4 position-relative">
          <WellViewer 
            scenario={scenario}
            totalDepthM={totalDepthM} 
            staticWaterLevelM={staticWaterLevelM}
            dynamicWaterLevelM={dynamicWaterLevelM} 
          />
        </div>

        {/* Ficha Técnica Comparativa de Ingeniería (Valle de Quíbor) */}
        <div className="card border border-secondary-subtle bg-light p-3 rounded-3 mb-3">
          <div className="d-flex align-items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary fs-5">table_chart</span>
            <h5 className="fs-6 fw-bold mb-0 text-dark">Especificaciones Técnicas Comparativas (RAG CIDIAT / Pozo Quíbor)</h5>
          </div>

          <div className="table-responsive">
            <table className="table table-sm table-bordered bg-white text-xs align-middle mb-0 font-sans">
              <thead className="table-dark">
                <tr>
                  <th>Parámetro Hidráulico / Mecánico</th>
                  <th className="text-center text-success">Pozo Óptimo Actual (60m)</th>
                  <th className="text-center text-info">Expansión Profunda (120m)</th>
                  <th>Criterio Técnico RAG Quíbor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="fw-bold">Profundidad Total</td>
                  <td className="text-center font-monospace">60.0 m</td>
                  <td className="text-center font-monospace fw-bold text-info">120.0 m</td>
                  <td>Alcanza lentes basales semiconfinados (Formación Morán).</td>
                </tr>
                <tr>
                  <td className="fw-bold">Diámetro Barreno Perforación</td>
                  <td className="text-center font-monospace">Ø 8½" (216 mm) o a pico Ø 80cm</td>
                  <td className="text-center font-monospace fw-bold text-info">Ø 12¼" (311 mm) Rotario</td>
                  <td>Broca tricono con lodo bentonítico densificado 1.06 g/cm³.</td>
                </tr>
                <tr>
                  <td className="fw-bold">Camisa de Entubado (Casing)</td>
                  <td className="text-center font-monospace">6" ASTM A53 (Ø ext 168.3 mm)</td>
                  <td className="text-center font-monospace fw-bold text-warning">8" ASTM A53 Gr. B (Ø ext 219.1 mm)</td>
                  <td><strong>Obligatorio 8"</strong> para permitir espacio de refrigeración de la bomba 6".</td>
                </tr>
                <tr>
                  <td className="fw-bold">Bomba Sumergible &amp; Motor</td>
                  <td className="text-center font-monospace">4" Sumergible 1.5 HP (Trif/Mon)</td>
                  <td className="text-center font-monospace fw-bold text-success">6" Industrial 7.5 HP (Trifásica)</td>
                  <td>Posicionada a 98.0 m de profundidad con cable 3×10 AWG.</td>
                </tr>
                <tr>
                  <td className="fw-bold">Carga Manométrica (HMT)</td>
                  <td className="text-center font-monospace">63.5 mca</td>
                  <td className="text-center font-monospace fw-bold">100.5 mca</td>
                  <td>Vence ND estival a 88m + pérdidas en columna de 2½".</td>
                </tr>
                <tr>
                  <td className="fw-bold">Filtros de Captación</td>
                  <td className="text-center font-monospace">12 m ranurado continuo</td>
                  <td className="text-center font-monospace fw-bold">38 m Johnson AISI 304 (Slot 0.030")</td>
                  <td>Régimen laminar Ve = 0.07 cm/s &lt;&lt; 3.0 cm/s (sin turbulencia ni arena).</td>
                </tr>
                <tr>
                  <td className="fw-bold">Caudal Continuo de Diseño</td>
                  <td className="text-center font-monospace text-success fw-bold">1.5 - 2.0 L/s (1" a 1½")</td>
                  <td className="text-center font-monospace text-info fw-bold">2.5 - 3.0 L/s (~2" continuo)</td>
                  <td>60m abastece 1 nave (1000m²); 120m abastece hasta 4 naves (2.5 ha).</td>
                </tr>
                <tr>
                  <td className="fw-bold">Presupuesto Llave en Mano</td>
                  <td className="text-center font-monospace text-success fw-bold">~$3.490 - $5.345 USD</td>
                  <td className="text-center font-monospace text-info fw-bold">~$24.880 - $25.800 USD</td>
                  <td>Amortización: 2.4 meses (60m) vs 1.3 años (120m) vs camiones cisterna ($30/cisterna).</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Progressive Disclosure de Ecuaciones Cooper-Jacob y HMT */}
        <div className="pt-2 border-top border-secondary-subtle">
          <button
            type="button"
            onClick={() => setShowTheis(!showTheis)}
            className="btn btn-sm btn-link text-info text-decoration-none p-0 d-flex align-items-center gap-1 font-monospace text-xs"
          >
            <span className="material-symbols-outlined ms-sm">
              {showTheis ? 'expand_less' : 'functions'}
            </span>
            <span>{showTheis ? 'Ocultar Ecuaciones Hidráulicas (KaTeX)' : 'Ver Fundamento Matemático: Ecuaciones de Abatimiento Cooper-Jacob y Altura Dinámica HMT (KaTeX)'}</span>
          </button>

          {showTheis && (
            <div className="formula-box formula-box-water mt-3 p-3 rounded-3 border border-info border-opacity-25 bg-light">
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <div className="text-secondary text-xs mb-2 font-sans fw-bold">
                    1. Ecuación de Abatimiento Régimen Transitorio (Cooper &amp; Jacob):
                  </div>
                  <BlockMath math="s = \frac{Q}{4\pi T} \ln\left(\frac{2.25\, T\, t}{r^2 S}\right)" />
                  <div className="text-secondary small mt-2 font-sans lh-base text-xs">
                    Donde <InlineMath math={`Q = ${pumpFlowLs}\\ \\text{L/s}`} />, transmisividad <InlineMath math={is60m ? "T = 120\\ \\text{m}^2/\\text{día}" : "T = 250\\ \\text{m}^2/\\text{día}"} /> y coeficiente de almacenamiento <InlineMath math="S = 0.05" /> (Cuara) a <InlineMath math="S = 0.001" /> (Morán semiconfinado).
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="text-secondary text-xs mb-2 font-sans fw-bold">
                    2. Altura Manométrica Total (HMT) para Bomba de 7.5 HP a 120m:
                  </div>
                  <BlockMath math="HMT = H_{\text{geom}} + h_f + P_{\text{serv}} = 88.0 + 7.5 + 5.0 = \mathbf{100.5\ \text{mca}}" />
                  <div className="text-secondary small mt-2 font-sans lh-base text-xs">
                    La potencia requerida con rendimiento del 65%: 
                    <InlineMath math="P_{HP} = \frac{\gamma \cdot Q \cdot HMT}{75 \cdot \eta} = \frac{1000 \cdot 0.0028 \cdot 100.5}{75 \cdot 0.65} \approx \mathbf{5.77\ \text{HP}} \rightarrow \mathbf{7.5\ \text{HP comercial}}" />.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

