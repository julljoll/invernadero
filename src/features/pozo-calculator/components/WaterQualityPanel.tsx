import React, { useState } from 'react';
import { Alert, Table, Row, Col } from 'react-bootstrap';
import { WATER_QUALITY_A, WATER_QUALITY_B, HYDRAULIC_FORMULAS } from '../wellData';
import { InlineMath } from 'react-katex';

interface Param {
  label: string;
  key: keyof typeof WATER_QUALITY_A;
  unit: string;
  thresholdGood: number;
  thresholdWarn: number;
  comparison: 'lt' | 'gt'; // 'lt': menor es mejor, 'gt': mayor es mejor
  description: string;
}

const PARAMS: Param[] = [
  {
    label: 'CE (Conductividad Eléctrica)',
    key: 'ceDs_m', unit: 'dS/m',
    thresholdGood: 1.0, thresholdWarn: 2.0, comparison: 'lt',
    description: 'Concentración de sales disueltas. >2.0 dS/m daña el pimentón sin fracción de lavado adecuada.',
  },
  {
    label: 'pH del Agua',
    key: 'pH', unit: '',
    thresholdGood: 7.5, thresholdWarn: 8.0, comparison: 'lt',
    description: 'pH alcalino > 7.6 bloquea Fósforo y Fe. Requiere ácido nítrico para bajar a 5.8-6.2 en gotero.',
  },
  {
    label: 'Bicarbonatos (HCO₃⁻)',
    key: 'hco3MmolL', unit: 'mmol/L',
    thresholdGood: 1.5, thresholdWarn: 3.0, comparison: 'lt',
    description: '>3 mmol/L taponan goteros por precipitación de CaCO₃ en 30-45 días. Requiere inyección de HNO₃.',
  },
  {
    label: 'RAS (Relación Adsorción Sodio)',
    key: 'rasMeq', unit: 'meq½/L½',
    thresholdGood: 3.0, thresholdWarn: 6.0, comparison: 'lt',
    description: 'RAS > 6 induce sodificación del suelo: colapso de estructura, impermeabilización y toxicidad de Na en raíz.',
  },
  {
    label: 'Hierro Total (Fe)',
    key: 'ironMgL', unit: 'mg/L',
    thresholdGood: 0.2, thresholdWarn: 0.5, comparison: 'lt',
    description: 'Fe > 0.5 mg/L en agua alcalina precipita como hidróxido férrico y tapona filtros de malla.',
  },
  {
    label: 'Boro (B)',
    key: 'boronMgL', unit: 'mg/L',
    thresholdGood: 0.3, thresholdWarn: 0.7, comparison: 'lt',
    description: 'Boro > 0.7 mg/L es tóxico para pimentón y tomate. Provoca quemado de bordes foliares.',
  },
  {
    label: 'Fracción de Lavado (LF)',
    key: 'leachingFractionPct', unit: '%',
    thresholdGood: 10, thresholdWarn: 20, comparison: 'lt',
    description: 'Volumen extra de agua para lavar sales de la zona radicular. LF > 25% indica agua muy salina.',
  },
  {
    label: 'HNO₃ 60% semanal (Tanque C)',
    key: 'nitricAcidLweek', unit: 'L/sem',
    thresholdGood: 10, thresholdWarn: 20, comparison: 'lt',
    description: 'Ácido nítrico necesario para neutralizar los bicarbonatos del agua de Quíbor en cada ciclo de riego.',
  },
];

const getStatus = (value: number, param: Param): 'good' | 'warn' | 'bad' => {
  if (param.comparison === 'lt') {
    if (value <= param.thresholdGood) return 'good';
    if (value <= param.thresholdWarn) return 'warn';
    return 'bad';
  }
  if (value >= param.thresholdGood) return 'good';
  if (value >= param.thresholdWarn) return 'warn';
  return 'bad';
};

const StatusBadge: React.FC<{ status: 'good' | 'warn' | 'bad'; value: number; unit: string }> = ({ status, value, unit }) => {
  const map = {
    good:  { bg: 'success', icon: '✅', text: 'ÓPTIMO' },
    warn:  { bg: 'warning', icon: '⚠️', text: 'MANEJABLE' },
    bad:   { bg: 'danger',  icon: '🔴', text: 'RIESGO' },
  };
  const s = map[status];
  return (
    <span className={`badge bg-${s.bg} text-white font-mono text-xs px-2 py-1`}>
      {s.icon} {value} {unit} — {s.text}
    </span>
  );
};

export const WaterQualityPanel: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<'A' | 'B'>('A');
  const water = activeScenario === 'A' ? WATER_QUALITY_A : WATER_QUALITY_B;

  return (
    <div className="card-cockpit p-4">
      {/* Cabecera */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3 pb-2 border-bottom border-secondary-subtle">
        <div>
          <h3 className="fs-6 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <span className="material-symbols-outlined text-info ms-sm">biotech</span>
            <span>Análisis Fisicoquímico del Agua — Acuífero Cuara, Quíbor</span>
          </h3>
          <span className="text-secondary small font-sans">
            Parámetros validados del RAG · Fuente: CIDIAT-ULA / SHYQ · Jégat et al. 2012
          </span>
        </div>

        {/* Toggle de escenarios */}
        <div className="d-flex gap-0 border rounded-pill overflow-hidden shadow-xs">
          <button
            onClick={() => setActiveScenario('A')}
            className={`btn btn-sm px-3 py-1.5 text-xs fw-bold rounded-0 ${activeScenario === 'A' ? 'btn-info text-white' : 'btn-light text-secondary'}`}
          >
            <span className="material-symbols-outlined fs-6 me-1">water_pump</span>
            Escenario A — Pozo Actual
          </button>
          <button
            onClick={() => setActiveScenario('B')}
            className={`btn btn-sm px-3 py-1.5 text-xs fw-bold rounded-0 ${activeScenario === 'B' ? 'btn-success text-white' : 'btn-light text-secondary'}`}
          >
            <span className="material-symbols-outlined fs-6 me-1">water</span>
            Escenario B — Trasvase Yacambú
          </button>
        </div>
      </div>

      {/* Banner contextual del escenario */}
      <Alert
        variant={activeScenario === 'A' ? 'warning' : 'success'}
        className="rounded-3 p-3 mb-3 text-xs d-flex align-items-start gap-2"
      >
        <span className="material-symbols-outlined fs-5 mt-0.5">
          {activeScenario === 'A' ? 'warning' : 'check_circle'}
        </span>
        <div>
          <strong>{water.label}</strong>
          {activeScenario === 'A' ? (
            <div className="mt-1">
              El acuífero del Valle de Quíbor sufre una sobreexplotación del <strong>29% (5 Mm³/año de déficit)</strong>. El cono de abatimiento central baja el nivel freático a <strong>546 msnm</strong>, extrayendo agua con contacto prolongado con formaciones salinas del Terciario (yesos, dolomitas). Exige tratamiento obligatorio con ácido nítrico y fracción de lavado del 20%.
            </div>
          ) : (
            <div className="mt-1">
              Agua del sistema andino Yacambú (Tramo Quíbor del Trasvase Yacambú-Quíbor). Excelente calidad química con CE de <strong>0.4–0.6 dS/m</strong>, elimina prácticamente el tratamiento ácido y reduce el consumo total de agua en <strong>2.63 m³/día (17.5%)</strong>.
            </div>
          )}
        </div>
      </Alert>

      {/* KPIs Rápidos */}
      <Row className="g-2 mb-3">
        {[
          { label: 'CE', value: water.ceDs_m, unit: 'dS/m', color: water.ceDs_m <= 1.0 ? 'success' : water.ceDs_m <= 2.0 ? 'warning' : 'danger' },
          { label: 'pH', value: water.pH, unit: '', color: water.pH <= 7.5 ? 'success' : water.pH <= 8.0 ? 'warning' : 'danger' },
          { label: 'HCO₃⁻', value: water.hco3MmolL, unit: 'mmol/L', color: water.hco3MmolL <= 1.5 ? 'success' : water.hco3MmolL <= 3.0 ? 'warning' : 'danger' },
          { label: 'LF', value: `${water.leachingFractionPct}%`, unit: '', color: water.leachingFractionPct <= 10 ? 'success' : water.leachingFractionPct <= 20 ? 'warning' : 'danger' },
          { label: 'HNO₃/sem', value: `${water.nitricAcidLweek} L`, unit: '', color: water.nitricAcidLweek <= 10 ? 'success' : water.nitricAcidLweek <= 20 ? 'warning' : 'danger' },
          { label: 'pH Gotero', value: water.phTargetGotero, unit: '', color: 'info' },
        ].map((kpi) => {
          const softBg = kpi.color === 'danger'
            ? 'bg-agro-danger-soft border-danger border-opacity-30'
            : kpi.color === 'warning'
            ? 'bg-agro-warning-soft border-warning border-opacity-40'
            : kpi.color === 'info'
            ? 'bg-agro-info-soft border-info border-opacity-30'
            : 'bg-agro-success-soft border-success border-opacity-30';
          const valColor = kpi.color === 'warning' ? 'text-dark' : `text-${kpi.color}`;
          return (
            <Col xs={6} md={4} lg={2} key={kpi.label}>
              <div className={`p-2.5 rounded-3 border ${softBg} text-center h-100 d-flex flex-column justify-content-center shadow-2xs`}>
                <span className="text-secondary text-2xs fw-bold d-block mb-0.5">{kpi.label}</span>
                <span className={`fs-5 fw-bold font-mono ${valColor}`}>{kpi.value}</span>
                {kpi.unit && <span className="text-secondary text-2xs ms-1">{kpi.unit}</span>}
              </div>
            </Col>
          );
        })}
      </Row>

      {/* Tabla Técnica de Parámetros */}
      <div className="table-responsive bg-white rounded border mb-3">
        <Table hover size="sm" className="align-middle mb-0 font-sans text-xs">
          <thead className="table-light">
            <tr>
              <th>Parámetro</th>
              <th>Valor / Estado</th>
              <th>Umbral Agronómico</th>
              <th>Implicación para Pimentón en Quíbor</th>
            </tr>
          </thead>
          <tbody>
            {PARAMS.map((param) => {
              const value = water[param.key] as number;
              const status = getStatus(value, param);
              return (
                <tr key={param.key}>
                  <td className="fw-semibold text-dark">{param.label}</td>
                  <td>
                    <StatusBadge status={status} value={value} unit={param.unit} />
                  </td>
                  <td className="font-mono text-secondary text-xs">
                    {param.comparison === 'lt'
                      ? `✅ <${param.thresholdGood}  ⚠️ ${param.thresholdGood}–${param.thresholdWarn}  🔴 >${param.thresholdWarn}`
                      : `✅ >${param.thresholdGood}  ⚠️ ${param.thresholdWarn}–${param.thresholdGood}  🔴 <${param.thresholdWarn}`
                    }
                  </td>
                  <td className="text-secondary">{param.description}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      {/* Protocolo de Tratamiento */}
      <div className="p-3 rounded-3 border border-secondary-subtle bg-light mb-3">
        <h6 className="fw-bold text-dark text-xs text-uppercase d-flex align-items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-info ms-sm">science</span>
          Protocolo de Tratamiento Recomendado — {water.label.split('—')[0].trim()}
        </h6>
        <ul className="text-xs text-secondary mb-0 d-flex flex-column gap-1">
          {water.treatment.map((t, i) => (
            <li key={i} className="d-flex align-items-start gap-1.5">
              <span className="text-info fw-bold flex-shrink-0">→</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Fórmula de Fracción de Lavado */}
      <div className="p-3 rounded-3 bg-white border border-info border-opacity-25 d-flex align-items-center gap-3 text-xs">
        <span className="badge bg-info text-white font-sans text-2xs fw-bold">FAO-56</span>
        <div>
          <span className="text-dark fw-semibold">Fracción de Lavado:</span>{' '}
          <InlineMath math={HYDRAULIC_FORMULAS.leachingFraction} />
          <span className="text-secondary ms-2">
            → Con CE<sub>w</sub> = {water.ceDs_m} dS/m, la lámina de riego se incrementa en <strong>{water.leachingFractionPct}%</strong> para evitar acumulación salina en los primeros 40 cm de raíz.
          </span>
        </div>
      </div>

      {/* Comparativa rápida A vs B (solo si estamos en A) */}
      {activeScenario === 'A' && (
        <div className="mt-3 p-3 rounded-3 bg-agro-success-soft border border-success border-opacity-30 text-xs">
          <div className="fw-bold text-success mb-1 d-flex align-items-center gap-1.5">
            <span className="material-symbols-outlined ms-sm">compare</span>
            ¿Qué ganaría el proyecto con el Trasvase Yacambú (Escenario B)?
          </div>
          <div className="d-flex flex-wrap gap-3">
            <span>🔵 CE: 1.4 → <strong className="text-success">0.5 dS/m</strong> (-64%)</span>
            <span>🔵 HCO₃: 3.5 → <strong className="text-success">1.0 mmol/L</strong> (-71%)</span>
            <span>🔵 HNO₃: 22 → <strong className="text-success">7 L/sem</strong> (-68%)</span>
            <span>🔵 LF: 20% → <strong className="text-success">6.5%</strong> = ahorro 2.63 m³/día</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaterQualityPanel;
