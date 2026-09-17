import React from 'react';
import { Row, Col, Table, Badge } from 'react-bootstrap';
import {
  AQUIFER_PARAMS,
  WATER_LEVEL_HISTORY,
  WATER_EFFICIENCY_COMPARISON,
  INVESTMENT_COMPLETION,
  WELL_PARAMS,
} from '../wellData';

export const HydrogeologyContext: React.FC = () => {
  const maxDepth = Math.max(...WATER_LEVEL_HISTORY.map((d) => d.northDepthM));

  return (
    <div className="d-flex flex-column gap-4">
      {/* ─── BALANCE HÍDRICO REGIONAL ─────────────────────────────────── */}
      <div className="card-cockpit p-4">
        <h3 className="fs-6 fw-bold text-dark mb-3 d-flex align-items-center gap-2">
          <span className="material-symbols-outlined text-danger ms-sm">water_loss</span>
          <span>Balance Hídrico del Acuífero del Valle de Quíbor — Sobreexplotación Crónica</span>
        </h3>
        <span className="badge bg-danger text-white font-mono text-xxs mb-3 d-inline-block">
          Fuente: CIDIAT-ULA / SHYQ · Jégat, Mora, Hernández (2012) · Alvarado, Massiah (1989)
        </span>

        <Row className="g-3 mb-4">
          {[
            {
              label: 'Extracción Anual', value: `${AQUIFER_PARAMS.extractionAnnualMm3} Mm³/año`,
              subtext: 'Zona crítica: 90 km²', color: 'danger', icon: 'water_pump',
            },
            {
              label: 'Recarga Renovable', value: `${AQUIFER_PARAMS.rechargeAnnualMm3} Mm³/año`,
              subtext: 'Precipitación + infiltración', color: 'info', icon: 'water_drop',
            },
            {
              label: 'Déficit Anual', value: `${AQUIFER_PARAMS.deficitAnnualMm3} Mm³/año`,
              subtext: 'Sobreexplotación 29%', color: 'warning', icon: 'trending_down',
            },
            {
              label: 'Reservas Geológicas', value: `${AQUIFER_PARAMS.reservesGeologicMm3} Mm³`,
              subtext: 'Estimación histórica total', color: 'secondary', icon: 'storage',
            },
          ].map((kpi) => {
            const softBg = kpi.color === 'info'
              ? 'bg-agro-info-soft border-info border-opacity-30'
              : kpi.color === 'warning'
              ? 'bg-agro-warning-soft border-warning border-opacity-40'
              : kpi.color === 'secondary'
              ? 'bg-light border-secondary border-opacity-30'
              : 'bg-agro-success-soft border-success border-opacity-30';
            const valColor = kpi.color === 'warning' ? 'text-dark' : `text-${kpi.color}`;
            return (
              <Col xs={6} lg={3} key={kpi.label}>
                <div className={`p-3 rounded-3 border ${softBg} text-center h-100 d-flex flex-column justify-content-between shadow-2xs`}>
                  <div>
                    <span className={`material-symbols-outlined text-${kpi.color} fs-4 d-block mb-1`}>{kpi.icon}</span>
                    <div className="text-secondary text-2xs text-uppercase fw-bold">{kpi.label}</div>
                  </div>
                  <div className="my-1">
                    <div className={`fs-5 fw-bold font-mono ${valColor}`}>{kpi.value}</div>
                  </div>
                  <div className="text-muted text-2xs">{kpi.subtext}</div>
                </div>
              </Col>
            );
          })}
        </Row>

        {/* Piezometría Visual */}
        <div className="p-3 bg-light rounded-3 border border-secondary-subtle mb-3">
          <div className="fw-bold text-dark text-xs mb-2 d-flex align-items-center gap-2">
            <span className="material-symbols-outlined text-info ms-sm">terrain</span>
            Piezometría del Acuífero — Cotas Nivel Freático (msnm)
          </div>
          <div className="d-flex align-items-end gap-0 justify-content-center" style={{ height: 80 }}>
            {[
              { label: 'Recarga\nAtarigua', msnm: AQUIFER_PARAMS.piezoRecharge, color: '#22c55e' },
              { label: 'Centro\nValle', msnm: AQUIFER_PARAMS.piezoCenter, color: '#ef4444' },
              { label: 'Salida\nLas Raíces', msnm: AQUIFER_PARAMS.piezoOutlet, color: '#f59e0b' },
            ].map((p) => {
              const relH = ((p.msnm - 500) / (AQUIFER_PARAMS.piezoRecharge - 500)) * 70;
              return (
                <div key={p.label} className="d-flex flex-column align-items-center mx-4 text-center">
                  <span className="font-mono fw-bold text-xs" style={{ color: p.color }}>{p.msnm} m</span>
                  <div
                    style={{ width: 32, height: relH, background: p.color, opacity: 0.8, borderRadius: '4px 4px 0 0', minHeight: 8, marginTop: 2 }}
                  />
                  <span className="text-secondary text-2xs mt-1" style={{ whiteSpace: 'pre-line' }}>{p.label}</span>
                </div>
              );
            })}
          </div>
          <div className="text-center text-2xs text-danger mt-2 fw-bold">
            ⚠️ Nivel freático del centro está {AQUIFER_PARAMS.coneDepression} m POR DEBAJO de la salida → Cono de abatimiento cerrado (sin drenaje natural)
          </div>
        </div>

        {/* Cono de Abatimiento — Historia de Descenso */}
        <div>
          <div className="fw-bold text-dark text-xs mb-2 d-flex align-items-center gap-2">
            <span className="material-symbols-outlined text-warning ms-sm">trending_down</span>
            Descenso Histórico del Nivel Freático — Sector Norte (1963 – 2026)
          </div>
          <div className="d-flex align-items-end gap-1 px-2 pb-1 border-bottom border-secondary-subtle">
            {WATER_LEVEL_HISTORY.map((d) => {
              const barH = (d.northDepthM / maxDepth) * 70;
              const color = d.northDepthM < 70 ? '#22c55e' : d.northDepthM < 85 ? '#f59e0b' : '#ef4444';
              return (
                <div key={d.year} className="d-flex flex-column align-items-center flex-grow-1">
                  <span className="font-mono text-2xs fw-bold" style={{ color }}>{d.northDepthM}m</span>
                  <div style={{ width: '100%', height: barH, background: color, opacity: 0.7, borderRadius: '3px 3px 0 0', minHeight: 6 }} />
                  <span className="text-muted text-2xs mt-0.5">{d.year}</span>
                </div>
              );
            })}
          </div>
          <div className="text-center text-2xs text-secondary mt-1">Profundidad del nivel estático (m) — Sector Norte del Valle de Quíbor</div>
        </div>
      </div>

      {/* ─── EFICIENCIA HÍDRICA: CAMPO ABIERTO vs CASA DE MALLA ─────────── */}
      <div className="card-cockpit p-4">
        <h3 className="fs-6 fw-bold text-dark mb-1 d-flex align-items-center gap-2">
          <span className="material-symbols-outlined text-success ms-sm">home_work</span>
          <span>Eficiencia Hídrica: Campo Abierto vs Casa de Malla 1.000 m² (3.500 plantas)</span>
        </h3>
        <p className="text-secondary text-xs mb-3">
          Frente a la sobreexplotación del acuífero, la Casa de Malla con goteo autocompensante PC representa la solución tecnológica de máxima eficiencia de uso del agua (WUE) disponible en el Valle de Quíbor.
        </p>
        <div className="table-responsive bg-white rounded border">
          <Table hover size="sm" className="align-middle mb-0 font-sans text-xs">
            <thead className="table-light">
              <tr>
                <th>Parámetro</th>
                <th className="text-danger">Campo Abierto Tradicional</th>
                <th className="text-success">Casa de Malla Tecnificada</th>
                <th className="text-primary">Ventaja / Ahorro</th>
              </tr>
            </thead>
            <tbody>
              {WATER_EFFICIENCY_COMPARISON.map((row, i) => (
                <tr key={i}>
                  <td className="fw-semibold text-dark">{row.parameter}</td>
                  <td className="text-danger">{row.openField}</td>
                  <td className="text-success fw-bold">{row.greenhouse}</td>
                  <td>
                    <Badge bg="primary" className="text-white font-mono text-2xs px-2">
                      {row.advantage}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <div className="mt-2 text-center text-xs text-secondary">
          Fuente: Hidrogeología del Acuífero Quíbor · CIDIAT-ULA · Datos calibrados con modelo Visual MODFLOW 4.1 (11.253 nodos activos, 12 estratos)
        </div>
      </div>

      {/* ─── COMPARATIVA FINANCIERA: POZO PROPIO vs CISTERNAS ─────────── */}
      <div className="card-cockpit p-4">
        <h3 className="fs-6 fw-bold text-dark mb-3 d-flex align-items-center gap-2">
          <span className="material-symbols-outlined text-success ms-sm">savings</span>
          <span>Comparativa de Inversión: Culminar el Pozo vs Pozo Nuevo vs Cisternas</span>
        </h3>

        <Row className="g-3 mb-4">
          {[
            {
              title: 'Culminar Pozo Existente',
              subtitle: '(50→60m · Brocal Artesanal)',
              cost: `$${INVESTMENT_COMPLETION.totalCompletionUsd.toLocaleString()} USD`,
              perM3: '$0.008 USD/m³',
              highlight: true,
              color: 'success',
              note: `Ahorra $${INVESTMENT_COMPLETION.savingVsNewWellUsd.toLocaleString()} vs pozo nuevo (${INVESTMENT_COMPLETION.savingPct}% menos)`,
              icon: 'trending_up',
            },
            {
              title: 'Pozo Mecánico Nuevo',
              subtitle: '(Rotopercusión 6" PEAD)',
              cost: `$${INVESTMENT_COMPLETION.alternativeNewWellUsd.toLocaleString()} USD`,
              perM3: '$0.012 USD/m³',
              highlight: false,
              color: 'warning',
              note: 'Tiempo: 45-60 días · Perforación, revestimiento, bomba, eléctrico, legal',
              icon: 'construction',
            },
            {
              title: 'Cisternas 10.000 L',
              subtitle: '(74-75 viajes × $25/viaje)',
              cost: '$1.850 USD / ciclo',
              perM3: '$2.50 USD/m³',
              highlight: false,
              color: 'danger',
              note: 'Costo 313× más caro por m³ que el agua de pozo propio',
              icon: 'local_shipping',
            },
          ].map((opt) => (
            <Col xs={12} md={4} key={opt.title}>
              <div
                className={`p-4 rounded-3 border ${opt.highlight ? 'border-success border-2 bg-agro-success-soft' : 'border-secondary-subtle bg-white'} h-100 d-flex flex-column`}
              >
                {opt.highlight && (
                  <Badge bg="success" className="align-self-start mb-2 font-sans text-xs">
                    ⭐ OPCIÓN RECOMENDADA
                  </Badge>
                )}
                <span className={`material-symbols-outlined text-${opt.color} fs-3 mb-2`}>{opt.icon}</span>
                <h5 className="fs-6 fw-bold text-dark mb-0">{opt.title}</h5>
                <div className="text-secondary text-xs mb-2">{opt.subtitle}</div>
                <div className={`fs-4 fw-bold font-mono text-${opt.color} mb-1`}>{opt.cost}</div>
                <div className="font-mono text-2xs text-secondary mb-3">{opt.perM3} equivalente</div>
                <div className={`text-${opt.color} text-xs fw-semibold mt-auto`}>{opt.note}</div>
              </div>
            </Col>
          ))}
        </Row>

        {/* Desglose de la inversión */}
        <div className="bg-light rounded-3 border p-3">
          <div className="fw-bold text-dark text-xs mb-2">Desglose de Inversión de Culminación ({INVESTMENT_COMPLETION.executionDays}):</div>
          <Table size="sm" className="mb-0 text-xs font-sans">
            <tbody>
              {INVESTMENT_COMPLETION.completionItems.map((item, i) => (
                <tr key={i}>
                  <td className="text-secondary border-0 py-1">{item.label}</td>
                  <td className="font-mono fw-bold text-dark border-0 py-1 text-end">${item.cost.toLocaleString()} USD</td>
                </tr>
              ))}
              <tr className="border-top">
                <td className="fw-bold text-dark py-2">TOTAL LLAVE EN MANO</td>
                <td className="font-mono fw-bold text-success text-end py-2 fs-6">
                  ${INVESTMENT_COMPLETION.totalCompletionUsd.toLocaleString()} USD
                </td>
              </tr>
            </tbody>
          </Table>
        </div>

        {/* Autonomía del sistema */}
        <div className="mt-3 p-3 rounded-3 bg-agro-info-soft border border-info border-opacity-30 text-xs">
          <div className="fw-bold text-info mb-1 d-flex align-items-center gap-1.5">
            <span className="material-symbols-outlined ms-sm">battery_charging_full</span>
            Autonomía del Sistema Pozo + Reservorio 80 m³
          </div>
          <div className="d-flex flex-wrap gap-3 text-secondary">
            <span>💧 Demanda pico nave 1.000 m²: <strong className="text-dark">{WELL_PARAMS.irrigationDemandPeakM3Day} m³/día</strong></span>
            <span>🏊 Reservorio australiano: <strong className="text-dark">{WELL_PARAMS.reservoirVolumeM3} m³</strong></span>
            <span>🔋 Autonomía ante corte eléctrico: <strong className="text-success">{WELL_PARAMS.reservoirAutonomyDays} días continuos</strong></span>
            <span>⏱ Horas de bombeo para llenado: <strong className="text-dark">~{Math.ceil(WELL_PARAMS.reservoirVolumeM3 / (2.5 * 3.6))} h @ 2.5 L/s</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HydrogeologyContext;
