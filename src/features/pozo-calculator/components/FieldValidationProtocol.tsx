import React, { useState } from 'react';
import { Row, Col, Badge } from 'react-bootstrap';
import { VALIDATION_PROTOCOL, ValidationStep } from '../wellData';

const STATUS_CONFIG = {
  pending:     { label: 'Pendiente',     color: 'secondary', icon: 'radio_button_unchecked', bg: '#f1f5f9' },
  in_progress: { label: 'En Progreso',   color: 'info',      icon: 'pending',                bg: '#e0f2fe' },
  done:        { label: 'Completado',    color: 'success',   icon: 'check_circle',           bg: '#dcfce7' },
  failed:      { label: 'Requiere Acción', color: 'danger',  icon: 'cancel',                 bg: '#fee2e2' },
};

const EQUIP_ICONS: Record<string, string> = {
  cctv:         'videocam',
  airlift:      'air',
  jacob:        'stacked_line_chart',
  theis:        'timeline',
  water_analysis: 'biotech',
};

export const FieldValidationProtocol: React.FC = () => {
  const [expanded, setExpanded] = useState<string | null>('cctv');
  const [steps, setSteps] = useState<ValidationStep[]>(VALIDATION_PROTOCOL);

  const toggleStatus = (id: string) => {
    setSteps((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const cycle: ValidationStep['status'][] = ['pending', 'in_progress', 'done', 'failed'];
        const next = cycle[(cycle.indexOf(s.status) + 1) % cycle.length];
        return { ...s, status: next };
      })
    );
  };

  const completedCount = steps.filter((s) => s.status === 'done').length;
  const viabilityPct = Math.round((completedCount / steps.length) * 100);
  const overallStatus = completedCount === steps.length
    ? 'VIABILIDAD CERTIFICADA ✅'
    : completedCount >= 3
      ? 'VIABILIDAD PARCIAL ⚠️'
      : 'PENDIENTE DE CAMPO 🔲';

  const waMessage = encodeURIComponent(
    'Hola Agrovenecua, necesito coordinar los ensayos de validación del Pozo en Cuara:\n' +
    '• Fase 1: Video-inspección CCTV 360°\n' +
    '• Fase 2: Limpieza Air-Lift (< 10 g/m³)\n' +
    '• Fase 3: Prueba Jacob (3 escalones)\n' +
    '• Fase 4: Prueba Theis continua 24–48h\n' +
    '• Fase 5: Análisis fisicoquímico completo (FONDONORMA)\n\n' +
    'Coordenadas finca: 9°53\'15.8"N 69°35\'37.3"W · Cuara, Lara'
  );

  return (
    <div className="card-cockpit p-4">
      {/* Cabecera del Protocolo */}
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h3 className="fs-6 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <span className="material-symbols-outlined text-warning ms-sm">assignment_turned_in</span>
            <span>Protocolo de Validación de Campo — 5 Fases de Certificación</span>
          </h3>
          <span className="text-secondary small font-sans">
            Estándar técnico según CIDIAT-ULA y regulaciones MPPAU Venezuela · Pozo Profundo Cuara
          </span>
        </div>

        {/* Estado global */}
        <div className="text-end">
          <div className="text-secondary text-xs mb-1">Estado de Certificación</div>
          <Badge
            bg={completedCount === steps.length ? 'success' : completedCount >= 3 ? 'warning' : 'secondary'}
            className="font-mono text-xs px-3 py-1.5"
          >
            {overallStatus}
          </Badge>
          <div className="text-muted text-2xs mt-1">{completedCount} / {steps.length} fases completadas</div>
        </div>
      </div>

      {/* Barra de progreso global */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center text-xs mb-1">
          <span className="text-secondary fw-semibold">Progreso de Certificación del Pozo</span>
          <span className="font-mono text-dark fw-bold">{viabilityPct}%</span>
        </div>
        <div className="progress" style={{ height: 10, borderRadius: 99 }}>
          <div
            className={`progress-bar ${completedCount === steps.length ? 'bg-success' : 'bg-info'}`}
            style={{ width: `${viabilityPct}%`, transition: 'width 0.5s ease' }}
            role="progressbar"
            aria-valuenow={viabilityPct}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* Cards de Pasos */}
      <div className="d-flex flex-column gap-3">
        {steps.map((step) => {
          const cfg = STATUS_CONFIG[step.status];
          const isOpen = expanded === step.id;

          return (
            <div
              key={step.id}
              className="rounded-3 border overflow-hidden"
              style={{ backgroundColor: cfg.bg, borderColor: '#e2e8f0' }}
            >
              {/* Cabecera del paso */}
              <button
                className="w-100 p-3 bg-transparent border-0 text-start d-flex align-items-center gap-3"
                onClick={() => setExpanded(isOpen ? null : step.id)}
                aria-expanded={isOpen}
              >
                {/* Número de fase */}
                <div
                  className={`flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle border fw-bold font-mono text-sm`}
                  style={{
                    width: 36, height: 36,
                    background: '#fff',
                    borderColor: `var(--bs-${cfg.color})`,
                    color: `var(--bs-${cfg.color})`,
                  }}
                >
                  {step.phase}
                </div>

                {/* Icono y nombre */}
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center gap-2">
                    <span className={`material-symbols-outlined text-${cfg.color} ms-sm`}>
                      {EQUIP_ICONS[step.id] ?? 'science'}
                    </span>
                    <span className="fw-bold text-dark text-xs">{step.name}</span>
                  </div>
                  <div className="text-secondary text-2xs mt-0.5">
                    ⏱ {step.duration} &nbsp;·&nbsp; {step.equipment.split('+')[0].trim()}
                  </div>
                </div>

                {/* Status badge clickeable */}
                <span
                  className={`badge bg-${cfg.color} text-white font-sans text-2xs px-2 py-1 flex-shrink-0`}
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => { e.stopPropagation(); toggleStatus(step.id); }}
                  title="Clic para cambiar estado"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 12, verticalAlign: 'middle' }}>
                    {cfg.icon}
                  </span>
                  {' '}{cfg.label}
                </span>

                <span className={`material-symbols-outlined text-secondary ms-1 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>

              {/* Detalle expandible */}
              {isOpen && (
                <div className="px-3 pb-3 pt-1 animate-fade-in">
                  <hr className="border-secondary-subtle my-2" />
                  <Row className="g-3">
                    <Col xs={12} md={8}>
                      <div className="text-xs text-secondary">
                        <strong className="text-dark d-block mb-1">Descripción Técnica:</strong>
                        {step.description}
                      </div>
                      <div className="mt-2 p-2 bg-white rounded border border-secondary-subtle text-xs">
                        <strong className="text-dark">🎯 Criterio de Aprobación:</strong>{' '}
                        <span className="text-secondary">{step.criterion}</span>
                      </div>
                    </Col>
                    <Col xs={12} md={4}>
                      <div className="p-2.5 bg-white rounded border text-xs">
                        <div className="fw-bold text-dark mb-1.5">Equipamiento Requerido:</div>
                        <div className="text-secondary">{step.equipment}</div>
                        <div className="mt-2 fw-bold text-dark mb-1">Duración Estimada:</div>
                        <div className="font-mono text-info">{step.duration}</div>
                      </div>
                    </Col>
                  </Row>

                  <div className="mt-2 d-flex gap-2">
                    <a
                      href={`https://wa.me/584160000000?text=${waMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`btn btn-sm btn-outline-${cfg.color} rounded-pill text-xs fw-bold d-inline-flex align-items-center gap-1`}
                    >
                      <span className="material-symbols-outlined fs-6">chat</span>
                      <span>Solicitar Fase {step.phase}</span>
                    </a>
                    <button
                      className="btn btn-sm btn-light text-xs rounded-pill"
                      onClick={() => toggleStatus(step.id)}
                    >
                      Actualizar Estado →
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CTA Final */}
      <div className="mt-4 p-3 rounded-3 bg-agro-info-soft border border-info border-opacity-30 text-center">
        <div className="text-dark text-xs fw-semibold mb-2">
          ¿Deseas agendar el protocolo completo de validación del pozo en una sola jornada de campo?
        </div>
        <a
          href={`https://wa.me/584160000000?text=${waMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-info btn-sm rounded-pill fw-bold text-white px-4 d-inline-flex align-items-center gap-2"
        >
          <span className="material-symbols-outlined fs-6">chat</span>
          <span>Agendar Protocolo Completo — 5 Fases</span>
        </a>
      </div>
    </div>
  );
};

export default FieldValidationProtocol;
