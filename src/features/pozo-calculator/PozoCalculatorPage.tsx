import React, { useState } from 'react';
import { Row, Col, Badge, Tab, Nav } from 'react-bootstrap';
import { InlineMath } from 'react-katex';
import { LithologicProfile2D } from './components/LithologicProfile2D';
import { WaterQualityPanel } from './components/WaterQualityPanel';
import { FieldValidationProtocol } from './components/FieldValidationProtocol';
import { HydrogeologyContext } from './components/HydrogeologyContext';
import { FinancialMatrix } from './components/FinancialMatrix';
import { RoiPimentonCard } from './components/RoiPimentonCard';
import {
  WELL_LOCATION,
  WELL_PARAMS,
  AQUIFER_PARAMS,
  INVESTMENT_COMPLETION,
  HYDRAULIC_FORMULAS,
  LITHOLOGY_LAYERS,
} from './wellData';

// ─── HELPER ESTILO KPI DE ALTO CONTRASTE (WCAG AAA) ──────────────────────────
const getKpiCardStyle = (color: string) => {
  switch (color) {
    case 'info':
      return {
        cardBg: 'bg-agro-info-soft border-info border-opacity-30',
        textVal: 'text-info',
      };
    case 'warning':
      return {
        cardBg: 'bg-agro-warning-soft border-warning border-opacity-40',
        textVal: 'text-dark',
      };
    case 'danger':
      return {
        cardBg: 'bg-agro-danger-soft border-danger border-opacity-30',
        textVal: 'text-danger',
      };
    case 'primary':
    case 'success':
    default:
      return {
        cardBg: 'bg-agro-success-soft border-success border-opacity-30',
        textVal: 'text-success',
      };
  }
};

// ─── CALCULADORA HIDRÁULICA INTERACTIVA ──────────────────────────────────────
const HydraulicsCalculator: React.FC = () => {
  const [targetDepth, setTargetDepth] = useState(60);
  const staticWL = WELL_PARAMS.staticWaterLevelM;
  const radius = WELL_PARAMS.boreholeRadiusM;

  // Columna activa de agua en el fuste (m)
  const activeColumnM = Math.max(0, targetDepth - staticWL);
  // Volumen en fuste (L): V = π × r² × h × 1000
  const fusteVolumeL = Math.round(Math.PI * radius * radius * activeColumnM * 1000);
  // Caudal estimado (precalculado con T=180 m²/día, prueba Jacob local)
  const flowLs = targetDepth >= 60 ? 2.5 : targetDepth >= 55 ? 1.8 : targetDepth >= 52 ? 1.2 : 0.8;
  // Horas de bombeo para llenar reservorio 80 m³
  const fillHours = (WELL_PARAMS.reservoirVolumeM3 / (flowLs * 3.6)).toFixed(1);
  // Autonomía con reservorio (días)
  const autonomyDays = (WELL_PARAMS.reservoirVolumeM3 / WELL_PARAMS.irrigationDemandPeakM3Day).toFixed(1);
  // Viabilidad
  const isViable = flowLs >= WELL_PARAMS.targetFlowMinLs;
  const isOptimal = flowLs >= WELL_PARAMS.targetFlowMaxLs;
  const viabilityColor = isOptimal ? 'success' : isViable ? 'warning' : 'danger';
  const viabilityLabel = isOptimal ? '✅ VIABLE ÓPTIMO' : isViable ? '⚠️ VIABLE MÍNIMO' : '🔴 INSUFICIENTE';

  const additionalMeters = Math.max(0, targetDepth - WELL_PARAMS.currentDepthM);
  const excavationCost = additionalMeters * 100;
  const totalCost = excavationCost + 3000;

  const waMessage = encodeURIComponent(
    `Hola Agrovenecua, estuve analizando el Dossier Hidrogeológico del Pozo Cuara:\n` +
    `• Cota Proyectada: ${targetDepth}m (${additionalMeters}m restantes desde los 50m actuales)\n` +
    `• Columna Útil en Fuste: ${activeColumnM.toFixed(1)}m → ${fusteVolumeL.toLocaleString()} L\n` +
    `• Caudal Estimado (T=180 m²/día): ${flowLs} L/s (${(flowLs * 3.6).toFixed(1)} m³/h)\n` +
    `• Inversión de Culminación: $${totalCost.toLocaleString()} USD llave en mano\n\n` +
    `Deseo coordinar el protocolo de validación: CCTV 360°, Air-Lift y Prueba Jacob en la Finca La Cigarronera.`
  );

  return (
    <div className="card-cockpit p-4">
      <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary-subtle">
        <div>
          <h3 className="fs-6 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <span className="material-symbols-outlined text-info ms-sm">calculate</span>
            <span>Simulador de Viabilidad Hidráulica — Parámetros RAG Validados</span>
          </h3>
          <span className="text-secondary small font-sans">
            T = {AQUIFER_PARAMS.transmisivityM2Day} m²/día · K = {AQUIFER_PARAMS.hydraulicConductivityMin}–{AQUIFER_PARAMS.hydraulicConductivityMax} m/día · NFS = {WELL_PARAMS.staticWaterLevelM} m
          </span>
        </div>
        <Badge bg={viabilityColor} className="font-mono px-3 py-1.5 text-xs">
          {viabilityLabel}
        </Badge>
      </div>

      <Row className="g-4 align-items-stretch">
        {/* Columna izquierda: Perfil litológico SVG */}
        <Col xs={12} lg={5}>
          <LithologicProfile2D
            currentDepthM={WELL_PARAMS.currentDepthM}
            targetDepthM={targetDepth}
            staticWaterLevelM={WELL_PARAMS.staticWaterLevelM}
            heightPx={460}
          />
        </Col>

        {/* Columna derecha: Controles y resultados */}
        <Col xs={12} lg={7}>
          {/* Slider de profundidad */}
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="text-dark fw-semibold text-xs">Profundidad Final de Culminación</label>
              <span className="font-mono text-info fw-bold">{targetDepth} m</span>
            </div>
            <input
              type="range"
              className="form-range"
              min={50} max={75} step={1}
              value={targetDepth}
              onChange={(e) => setTargetDepth(Number(e.target.value))}
              style={{ accentColor: '#0ea5e9' }}
            />
            <div className="d-flex justify-content-between text-2xs text-secondary font-mono">
              <span>50 m (actual)</span>
              <span>60 m (óptimo)</span>
              <span>75 m (máx)</span>
            </div>
          </div>

          {/* KPIs de resultado */}
          <Row className="g-2 mb-3">
            {[
              {
                label: 'Columna Activa (Fuste)',
                value: `${activeColumnM.toFixed(1)} m`,
                sub: `${fusteVolumeL.toLocaleString()} Litros en reposo`,
                color: 'info', icon: 'straighten',
              },
              {
                label: 'Caudal Estimado',
                value: `${flowLs} L/s`,
                sub: `${(flowLs * 3.6).toFixed(1)} m³/h · ${(flowLs * 86.4).toFixed(0)} m³/día`,
                color: viabilityColor, icon: 'water',
              },
              {
                label: 'Llenado Reservorio 80m³',
                value: `${fillHours} h`,
                sub: `Bombeo a ${flowLs} L/s`,
                color: 'primary', icon: 'timer',
              },
              {
                label: 'Autonomía ante Corte',
                value: `${autonomyDays} días`,
                sub: 'Demanda pico nave: 15.75 m³/día',
                color: 'success', icon: 'battery_charging_full',
              },
            ].map((kpi) => {
              const style = getKpiCardStyle(kpi.color);
              return (
                <Col xs={6} key={kpi.label}>
                  <div className={`p-2.5 rounded-3 border ${style.cardBg}`}>
                    <div className="d-flex align-items-center gap-1 mb-0.5">
                      <span className={`material-symbols-outlined text-${kpi.color} fs-6`}>{kpi.icon}</span>
                      <span className="text-secondary text-2xs fw-bold">{kpi.label}</span>
                    </div>
                    <div className={`fs-5 fw-bold font-mono ${style.textVal}`}>{kpi.value}</div>
                    <div className="text-muted text-2xs">{kpi.sub}</div>
                  </div>
                </Col>
              );
            })}
          </Row>

          {/* Fórmulas técnicas (KaTeX) */}
          <div className="p-2.5 bg-light rounded-3 border border-secondary-subtle mb-3 text-xs">
            <div className="fw-bold text-dark text-2xs text-uppercase mb-1">Ecuaciones Aplicadas (Hidrogeología Cuantitativa):</div>
            <div className="d-flex flex-wrap gap-2">
              <div className="bg-white rounded px-2 py-1 border text-2xs">
                <InlineMath math={HYDRAULIC_FORMULAS.theis} />
                <span className="text-muted ms-1">Theis</span>
              </div>
              <div className="bg-white rounded px-2 py-1 border text-2xs">
                <InlineMath math={HYDRAULIC_FORMULAS.columnVolume} />
              </div>
            </div>
          </div>

          {/* Litología de contacto según cota */}
          {(() => {
            const layer = [...LITHOLOGY_LAYERS].reverse().find((l) => targetDepth >= l.fromM);
            return layer ? (
              <div className="p-2.5 bg-white rounded-3 border border-secondary-subtle text-xs mb-3">
                <div className="fw-bold text-dark mb-0.5">
                  Litología de Contacto a {targetDepth}m:
                  <Badge
                    bg={layer.permeability === 'muy_alta' ? 'info' : layer.permeability === 'alta' ? 'success' : layer.permeability === 'media' ? 'warning' : 'secondary'}
                    className="ms-2 text-2xs"
                  >
                    Permeabilidad {layer.permeability.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="text-secondary">{layer.name} — {layer.description}</div>
              </div>
            ) : null;
          })()}

          {/* Presupuesto de culminación */}
          <div className="p-3 rounded-3 border border-secondary-subtle bg-light text-xs mb-3">
            <div className="fw-bold text-dark mb-1.5">Presupuesto de Culminación ({additionalMeters}m adicionales):</div>
            <div className="d-flex justify-content-between py-1 border-bottom border-secondary-subtle">
              <span>Mano de obra pica en grava ({additionalMeters}m × $100/m):</span>
              <strong className="font-mono text-dark">${excavationCost} USD</strong>
            </div>
            <div className="d-flex justify-content-between py-1 border-bottom border-secondary-subtle">
              <span>Equipamiento (Bomba 2HP + Martillo + Tablero + PEAD):</span>
              <strong className="font-mono text-dark">$3.000 USD</strong>
            </div>
            <div className="d-flex justify-content-between pt-2 fw-bold">
              <span>TOTAL LLAVE EN MANO:</span>
              <span className="text-info font-mono fs-6">${totalCost.toLocaleString()} USD</span>
            </div>
            <div className="text-success text-2xs mt-1">
              ✅ Ahorro vs Pozo Nuevo: ${(INVESTMENT_COMPLETION.alternativeNewWellUsd - totalCost).toLocaleString()} USD ({Math.round(((INVESTMENT_COMPLETION.alternativeNewWellUsd - totalCost) / INVESTMENT_COMPLETION.alternativeNewWellUsd) * 100)}% menos)
            </div>
          </div>

          <a
            href={`https://wa.me/584160000000?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-info btn-lg w-100 rounded-pill fw-bold text-white d-flex align-items-center justify-content-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined fs-5">chat</span>
            <span>Agendar Auditoría Hidrogeológica In-Situ</span>
          </a>
        </Col>
      </Row>
    </div>
  );
};

// ─── HERO — KPIs DE ESTADO DEL POZO ──────────────────────────────────────────
const WellHero: React.FC = () => {
  const kpis = [
    { label: 'Profundidad Actual',  value: `${WELL_PARAMS.currentDepthM} m`,  sub: `${WELL_PARAMS.progressPct}% Consolidado`,             color: 'info',    icon: 'straighten' },
    { label: 'Nivel Freático Est.', value: `${WELL_PARAMS.staticWaterLevelM} m`, sub: 'NFS en reposo — grava saturada',                    color: 'primary', icon: 'water_drop' },
    { label: 'Caudal Objetivo',     value: '≥ 2.5 L/s',                       sub: '9.0 m³/h — 216 m³/día disponibles',                   color: 'success', icon: 'water' },
    { label: 'Transmisividad (T)',  value: '180 m²/día',                       sub: 'K: 1.8–6.0 m/día (Alvarado 1989)',                    color: 'warning', icon: 'science' },
    { label: 'Inversión Terminac.', value: '$4.000 USD',                       sub: `Ahorro $${INVESTMENT_COMPLETION.savingVsNewWellUsd.toLocaleString()} vs pozo nuevo`, color: 'success', icon: 'savings' },
  ];

  return (
    <div className="text-center max-w-4xl mx-auto pt-2 mb-4">
      {/* Badge de Estado */}
      <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill bg-info bg-opacity-10 border border-info border-opacity-30 text-info text-xs fw-bold text-uppercase mb-3 shadow-xs">
        <span className="telemetry-pulse" />
        <span className="material-symbols-outlined ms-sm">verified</span>
        <span>Dictamen Hidrogeológico CIDIAT-ULA · Formación Cuara — Municipio Jiménez</span>
      </div>

      <h1 className="display-5 fw-bold text-dark tracking-tight mb-2">
        Calculadora de Viabilidad del{' '}
        <span className="text-info">Pozo Profundo</span>{' '}
        — Finca La Cigarronera
      </h1>

      <p className="lead text-secondary fs-6 mb-4 max-w-3xl mx-auto">
        Análisis técnico integral con datos validados del acuífero aluvial de Quíbor (CIDIAT-ULA · SHYQ · Jégat et al. 2012).
        El brocal artesanal está consolidado al <strong>83% (50 m)</strong>. Culminar los 10 metros restantes en grava saturada
        requiere <strong>$4.000 USD llave en mano</strong> y asegura riego independiente para{' '}
        <strong>3.500 plantas de pimentón en 1.000 m²</strong>.
      </p>

      {/* Badges de geolocalización */}
      <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
        <Badge bg="white" text="dark" className="border shadow-xs px-3 py-1.5 font-mono d-flex align-items-center gap-1.5 text-xs">
          <span className="material-symbols-outlined text-danger ms-sm fs-6">pin_drop</span>
          <span>{WELL_LOCATION.coordString} · Cota {WELL_LOCATION.elevationMsnm} msnm</span>
        </Badge>
        <Badge bg="white" text="dark" className="border shadow-xs px-3 py-1.5 font-mono d-flex align-items-center gap-1.5 text-xs">
          <span className="material-symbols-outlined text-info ms-sm fs-6">location_city</span>
          <span>{WELL_LOCATION.sector}</span>
        </Badge>
        <Badge bg="white" text="dark" className="border shadow-xs px-3 py-1.5 font-mono d-flex align-items-center gap-1.5 text-xs">
          <span className="material-symbols-outlined text-warning ms-sm fs-6">construction</span>
          <span>Ejecución: {INVESTMENT_COMPLETION.executionDays}</span>
        </Badge>
      </div>

      {/* 5 KPIs Horizontales */}
      <Row className="g-2 max-w-5xl mx-auto">
        {kpis.map((kpi) => {
          const style = getKpiCardStyle(kpi.color);
          return (
            <Col xs={6} md={4} lg key={kpi.label}>
              <div className={`p-2.5 rounded-3 border ${style.cardBg} text-center h-100 d-flex flex-column justify-content-between shadow-2xs`}>
                <div>
                  <span className={`material-symbols-outlined text-${kpi.color} fs-5 d-block mb-1`}>{kpi.icon}</span>
                  <div className="text-secondary text-2xs text-uppercase fw-bold">{kpi.label}</div>
                </div>
                <div className="my-1">
                  <div className={`fw-bold font-mono ${style.textVal}`} style={{ fontSize: 16 }}>{kpi.value}</div>
                </div>
                <div className="text-muted text-2xs">{kpi.sub}</div>
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
export const PozoCalculatorPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('simulador');

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container-xl d-flex flex-column gap-4">

        {/* HERO */}
        <WellHero />

        {/* NAV DE SECCIONES — Navegación Principal de la Página */}
        <div className="d-flex justify-content-center mb-1">
          <Tab.Container activeKey={activeSection} onSelect={(k) => setActiveSection(k ?? 'simulador')}>
            <Nav variant="pills" className="gap-2 flex-wrap justify-content-center bg-white p-2 rounded-pill border shadow-xs">
              {[
                { key: 'simulador',   label: 'Simulador Hidráulico',      icon: 'calculate' },
                { key: 'agua',        label: 'Calidad del Agua',           icon: 'biotech' },
                { key: 'protocolo',   label: 'Protocolo de Campo',         icon: 'assignment_turned_in' },
                { key: 'hidrogeol',   label: 'Contexto Hidrogeológico',    icon: 'terrain' },
                { key: 'financiero',  label: 'Matriz Financiera',          icon: 'analytics' },
              ].map((tab) => (
                <Nav.Item key={tab.key}>
                  <Nav.Link
                    eventKey={tab.key}
                    className="rounded-pill px-3 py-1.5 text-xs fw-bold d-flex align-items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined fs-6">{tab.icon}</span>
                    <span className="d-none d-sm-inline">{tab.label}</span>
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          </Tab.Container>
        </div>

        {/* CONTENIDO DE SECCIONES */}
        {activeSection === 'simulador' && <HydraulicsCalculator />}

        {activeSection === 'agua' && <WaterQualityPanel />}

        {activeSection === 'protocolo' && <FieldValidationProtocol />}

        {activeSection === 'hidrogeol' && <HydrogeologyContext />}

        {activeSection === 'financiero' && (
          <div className="d-flex flex-column gap-4">
            <FinancialMatrix />
            <RoiPimentonCard />
          </div>
        )}

        {/* CTA FINAL */}
        <div className="cockpit-sidebar-glass border-info border-opacity-30 p-4 p-md-5 text-center position-relative shadow-sm rounded-4">
          <div className="max-w-2xl mx-auto">
            <span className="badge bg-agro-info-soft border border-info border-opacity-30 text-info rounded-pill px-3 py-1 text-uppercase fw-bold mb-3 d-inline-flex align-items-center gap-1.5">
              <span className="telemetry-pulse" />
              <span>Paso Final · Agendar Visita Técnica In-Situ</span>
            </span>
            <h3 className="h2 fw-bold text-dark mb-2">
              ¿Listo para certificar la viabilidad del pozo en Cuara?
            </h3>
            <p className="text-secondary small mb-4">
              Un equipo especialista ejecutará el protocolo completo en{' '}
              <strong>10 a 12 días continuos</strong>: Video CCTV 360°, Air-Lift, Prueba Jacob,
              Theis 24–48h y Análisis fisicoquímico certificado. Inversión llave en mano:{' '}
              <strong>$4.000 USD</strong>. Ahorro vs pozo nuevo: <strong>$20.880 USD (84% menos)</strong>.
            </p>

            {/* Ecuación de fracción de lavado como evidencia técnica */}
            <div className="d-inline-block px-3 py-2 bg-white rounded-3 border border-info border-opacity-25 text-xs mb-4">
              <InlineMath math={HYDRAULIC_FORMULAS.leachingFraction} />
              <span className="text-secondary ms-2 font-sans">→ LF = 20% con CE<sub>w</sub> = 1.4 dS/m · Pozo Cuara</span>
            </div>

            <div className="d-flex flex-wrap justify-content-center gap-3">
              <a
                href={`https://wa.me/584160000000?text=${encodeURIComponent(
                  'Hola Agrovenecua, quiero agendar el Protocolo de Validación completo del Pozo en Cuara (CCTV + Air-Lift + Prueba Jacob + Theis + Lab). Coordenadas: 9°53\'15.8"N 69°35\'37.3"W · Finca La Cigarronera'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-info btn-lg rounded-pill fw-bold text-white px-4 py-3 d-inline-flex align-items-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined fs-5">chat</span>
                <span>Agendar Protocolo Completo</span>
              </a>
              <a
                href="/cockpit"
                className="btn btn-outline-secondary btn-lg rounded-pill fw-bold px-4 py-3 d-inline-flex align-items-center gap-2"
              >
                <span className="material-symbols-outlined fs-5">speed</span>
                <span>Ir al Cockpit Agronómico</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PozoCalculatorPage;
