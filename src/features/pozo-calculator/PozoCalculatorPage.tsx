import React, { useState } from 'react';
import { Row, Col, Badge } from 'react-bootstrap';
import { WellViewer } from '../3d-viewers/WellViewer/WellViewer';
import { Slider } from '../../shared/components/Slider';
import { FinancialMatrix } from './components/FinancialMatrix';
import { RoiPimentonCard } from './components/RoiPimentonCard';
import { TechnicalSpecsAccordion } from './components/TechnicalSpecsAccordion';

export const PozoCalculatorPage: React.FC = () => {
  const [targetDepth, setTargetDepth] = useState<number>(60);
  const currentDepth = 50; // Metros ya excavados físicamente en brocal de 1m (83% consolidado)
  const staticWaterLevel = 49.5; // Nivel freático estático en reposo

  // Cálculo por metro adicional (50 a 60m)
  const additionalMeters = Math.max(0, targetDepth - currentDepth);
  const waterColumnM = Math.max(0, targetDepth - staticWaterLevel);
  // Brocal artesanal de 1m de diámetro efectivo (radio 0.5m) -> Área = π * 0.5² ≈ 0.785 m² -> 785 L por metro lineal de agua
  const activeVolumeL = Math.round(waterColumnM * 785);
  // Recarga aluvial lateral según transmisividad T=180 m²/día
  const flowRateLs = targetDepth >= 60 ? 2.5 : targetDepth >= 55 ? 1.8 : 0.8;
  const costPerMeterExcavation = 100; // $100 USD/m mano de obra
  const costExcavationUsd = additionalMeters * costPerMeterExcavation;
  const costEquipUsd = 3000; // Bomba, martillo industrial capitalizable, tablero, ventilación, PEAD
  const totalCostUsd = costExcavationUsd + costEquipUsd;

  const waMessage = encodeURIComponent(
    `Hola Agrovenecua, estuve analizando el Dossier y Plan de Inversión del Pozo en Cuara:\n` +
    `• Cota Proyectada: ${targetDepth} metros (${additionalMeters}m restantes)\n` +
    `• Columna Útil: ${waterColumnM.toFixed(1)} metros (${activeVolumeL.toLocaleString()} L en fuste)\n` +
    `• Inversión Llave en Mano: $${totalCostUsd.toLocaleString()} USD (Ahorro $20.880 USD frente a pozo nuevo)\n` +
    `• Enfoque de Producción: 2.500 plantas de Pimentón en 1.000 m²\n` +
    `Deseo coordinar una visita técnica a la Finca La Cigarronera para revisar el pozo.`
  );

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container-xl d-flex flex-column gap-5">
        {/* =========================================================================
            FASE 1: ATENCIÓN (HERO DE ALTO IMPACTO COMERCIAL & TÉCNICO)
            ========================================================================= */}
        <div className="text-center max-w-4xl mx-auto pt-2">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill bg-info bg-opacity-10 border border-info border-opacity-30 text-info text-xs fw-bold text-uppercase mb-3 shadow-xs">
            <span className="material-symbols-outlined ms-sm">verified</span>
            <span>Dictamen Hidrogeológico 100% Favorable · Finca La Cigarronera</span>
          </div>

          <h1 className="display-5 fw-bold text-dark tracking-tight mb-3">
            Plan de Inversión Ejecutiva: Culminación Estratégica de <span className="text-info">Pozo de Agua</span>
          </h1>

          <p className="lead text-secondary fs-6 mb-4 max-w-3xl mx-auto">
            Aprovecha el <strong>83% ya excavado y consolidado a 50 metros</strong>. Avanzar los últimos 10 metros en grava saturada requiere solo <strong>$4.000 USD llave en mano</strong>, generando un <strong>ahorro directo de $20.880 USD (84%)</strong> frente a una perforación mecánica nueva y asegurando el riego de 2.500 plantas de Pimentón en Cuara.
          </p>

          {/* Badges de Confianza y Georreferenciación Exacta */}
          <div className="d-flex flex-wrap justify-content-center gap-2 pt-1">
            <Badge bg="white" text="dark" className="border shadow-xs px-3 py-2 font-mono d-flex align-items-center gap-1.5">
              <span className="material-symbols-outlined text-danger ms-sm">pin_drop</span>
              <span>Cuara, Lara: 9°53'15.8"N, 69°35'37.3"W (Cota 734 msnm)</span>
            </Badge>
            <Badge bg="white" text="dark" className="border shadow-xs px-3 py-2 font-mono d-flex align-items-center gap-1.5">
              <span className="material-symbols-outlined text-success ms-sm">savings</span>
              <span>Ahorro CAPEX: $20.880 USD (84% menos)</span>
            </Badge>
            <Badge bg="white" text="dark" className="border shadow-xs px-3 py-2 font-mono d-flex align-items-center gap-1.5">
              <span className="material-symbols-outlined text-info ms-sm">timer</span>
              <span>Ejecución Rápida: 10 a 12 Días continuos</span>
            </Badge>
          </div>
        </div>

        {/* =========================================================================
            FASE 2: 4 PILARES TÉCNICOS & ELIMINACIÓN DE RIESGO
            ========================================================================= */}
        <Row className="row-cols-1 row-cols-md-2 row-cols-lg-4 g-3">
          <Col>
            <div className="card-cockpit card-cockpit-water p-3.5 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="kpi-icon-pill kpi-icon-water shadow-xs">
                    <span className="material-symbols-outlined fs-5">water_drop</span>
                  </div>
                  <span className="badge bg-agro-info-soft text-info border border-info border-opacity-25 rounded-pill px-2.5 py-1 font-mono text-xxs d-inline-flex align-items-center gap-1">
                    <span className="telemetry-pulse"></span>
                    <span>Freático 49.5m</span>
                  </span>
                </div>
                <h5 className="fs-6 fw-bold text-dark mb-1.5">Acuífero Comprobado</h5>
                <p className="text-secondary small mb-0 lh-base">
                  Fondo consolidado a 50m cortando grava negra de lidita y cuarzo cristalino. Nivel freático estático a 49.5m. Riesgo geológico nulo.
                </p>
              </div>
            </div>
          </Col>

          <Col>
            <div className="card-cockpit p-3.5 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="kpi-icon-pill kpi-icon-green shadow-xs">
                    <span className="material-symbols-outlined fs-5">straighten</span>
                  </div>
                  <span className="badge bg-agro-success-soft text-success border border-success border-opacity-25 rounded-pill px-2.5 py-1 font-mono text-xxs">
                    10m Faltantes
                  </span>
                </div>
                <h5 className="fs-6 fw-bold text-dark mb-1.5">Columna Útil 10.5m</h5>
                <p className="text-secondary small mb-0 lh-base">
                  Al descender a 60m se habilita una reserva en fuste de <strong>8.240 Litros en reposo</strong>, cubriendo el 125% del agua diaria de la nave.
                </p>
              </div>
            </div>
          </Col>

          <Col>
            <div className="card-cockpit card-cockpit-water p-3.5 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="kpi-icon-pill kpi-icon-water shadow-xs">
                    <span className="material-symbols-outlined fs-5">storage</span>
                  </div>
                  <span className="badge bg-agro-info-soft text-info border border-info border-opacity-25 rounded-pill px-2.5 py-1 font-mono text-xxs">
                    Buffer 80.000 L
                  </span>
                </div>
                <h5 className="fs-6 fw-bold text-dark mb-1.5">Reservorio Regulador</h5>
                <p className="text-secondary small mb-0 lh-base">
                  Bombeo en tandas al achique con reservorio de 80 m³. Otorga de <strong>8 a 10 días de autonomía total</strong> ante apagones de Corpoelec.
                </p>
              </div>
            </div>
          </Col>

          <Col>
            <div className="card-cockpit card-cockpit-sun p-3.5 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="kpi-icon-pill kpi-icon-sun shadow-xs">
                    <span className="material-symbols-outlined fs-5">home_repair_service</span>
                  </div>
                  <span className="badge bg-agro-warning-soft text-warning-emphasis border border-warning border-opacity-25 rounded-pill px-2.5 py-1 font-mono text-xxs">
                    Activo Fijo
                  </span>
                </div>
                <h5 className="fs-6 fw-bold text-dark mb-1.5">Martillo Industrial</h5>
                <p className="text-secondary small mb-0 lh-base">
                  El presupuesto incluye martillo demoledor de <strong>$1.000 USD</strong> que queda como activo permanente de la finca (valor residual $750+).
                </p>
              </div>
            </div>
          </Col>
        </Row>

        {/* =========================================================================
            FASE 3: SIMULADOR 3D INTERACTIVO DE ESTRATIGRAFÍA Y CONTROLES
            ========================================================================= */}
        <Row className="g-4 align-items-stretch">
          <Col xs={12} lg={7}>
            <div className="card-cockpit card-cockpit-water p-2 h-100 d-flex flex-column">
              <div className="bg-transparent border-0 d-flex justify-content-between align-items-center px-3 py-2">
                <span className="text-secondary text-xs fw-bold text-uppercase d-flex align-items-center gap-1.5">
                  <span className="material-symbols-outlined text-info fs-5">view_in_ar</span>
                  <span>Estratigrafía 3D Georreferenciada (Cuara, Lara)</span>
                </span>
                <span className="badge bg-agro-info-soft text-info border border-info border-opacity-25 rounded-pill px-2.5 py-1 font-mono text-xs">
                  Cota Actual: 50m / Meta: {targetDepth}m
                </span>
              </div>
              <div className="flex-grow-1" style={{ minHeight: '430px' }}>
                <WellViewer totalDepthM={targetDepth} staticWaterLevelM={staticWaterLevel} />
              </div>
            </div>
          </Col>

          <Col xs={12} lg={5}>
            <div className="card-cockpit p-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h3 className="fs-5 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                    <span className="material-symbols-outlined text-info">tune</span>
                    <span>Simulador de Profundidad</span>
                  </h3>
                  <span className="badge bg-agro-info-soft text-info border border-info border-opacity-25 rounded-pill px-2.5 py-0.5 text-xxs font-mono">
                    Interactivo
                  </span>
                </div>
                <p className="text-secondary small mb-3">
                  Configura la cota final para evaluar la columna hidrostática, el caudal en régimen y la inversión de terminación:
                </p>

                <Slider
                  label="Profundidad Final Deseada:"
                  value={targetDepth}
                  min={50}
                  max={60}
                  step={1}
                  formatValue={(v) => `${v} metros (${v - currentDepth}m adicionales)`}
                  accentColor="info"
                  iconName="straighten"
                  onChange={setTargetDepth}
                />

                <Row className="g-2.5 my-2">
                  <Col xs={6}>
                    <div className="p-3 bg-agro-info-soft rounded-3 border border-info border-opacity-20">
                      <div className="text-secondary text-xxs text-uppercase fw-semibold mb-0.5">Columna Activa</div>
                      <div className="fs-4 fw-bold font-mono text-info">{waterColumnM.toFixed(1)} m</div>
                      <div className="text-secondary text-xxs mt-0.5">{activeVolumeL.toLocaleString()} L en fuste</div>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="p-3 bg-agro-success-soft rounded-3 border border-success border-opacity-20">
                      <div className="text-secondary text-xxs text-uppercase fw-semibold mb-0.5">Caudal en Régimen</div>
                      <div className="fs-4 fw-bold font-mono text-success">{flowRateLs} L/s</div>
                      <div className="text-secondary text-xxs mt-0.5">7.200 a 9.000 L/hora</div>
                    </div>
                  </Col>
                </Row>

                <div className="p-3 bg-light rounded-3 border border-secondary-subtle text-xs text-secondary mt-3">
                  <div className="d-flex justify-content-between py-1 border-bottom border-secondary-subtle">
                    <span>Mano de obra pica en grava ({additionalMeters}m @ $100/m):</span>
                    <strong className="text-dark font-mono">${costExcavationUsd} USD</strong>
                  </div>
                  <div className="d-flex justify-content-between py-1 border-bottom border-secondary-subtle">
                    <span>Equipamiento (Martillo + Bomba 2HP + Tablero + PEAD):</span>
                    <strong className="text-dark font-mono">${costEquipUsd} USD</strong>
                  </div>
                  <div className="d-flex justify-content-between pt-2 fs-6 fw-bold text-dark">
                    <span>Presupuesto Llave en Mano:</span>
                    <span className="text-info font-mono">${totalCostUsd.toLocaleString()} USD</span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <a
                  href={`https://wa.me/584160000000?text=${waMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-info btn-lg w-100 rounded-pill fw-bold text-white d-flex align-items-center justify-content-center gap-2 shadow-sm touch-target-48"
                >
                  <span className="material-symbols-outlined fs-5">chat</span>
                  <span>Solicitar Auditoría Hidrogeológica In-Situ</span>
                </a>
              </div>
            </div>
          </Col>
        </Row>

        {/* =========================================================================
            FASE 4: COMPARATIVA DE INVERSIÓN (MATRIZ FINANCIERA)
            ========================================================================= */}
        <FinancialMatrix />

        {/* =========================================================================
            FASE 5: RENTABILIDAD AGRONÓMICA EXCLUSIVA PARA PIMENTÓN (2.500 PLANTAS)
            ========================================================================= */}
        <RoiPimentonCard />

        {/* =========================================================================
            FASE 6: MEMORIA TÉCNICA E INGENIERÍA DETALLADA (ACORDEÓN DESPLEGABLE)
            ========================================================================= */}
        <TechnicalSpecsAccordion />

        {/* =========================================================================
            FASE 7: LLAMADO A LA ACCIÓN FINAL (STICKY / CTA BANNER)
            ========================================================================= */}
        <div className="cockpit-sidebar-glass border-info border-opacity-30 p-4 p-md-5 text-center position-relative shadow-sm">
          <div className="max-w-2xl mx-auto">
            <span className="badge bg-agro-info-soft border border-info border-opacity-30 text-info rounded-pill px-3 py-1 text-uppercase fw-bold mb-3 d-inline-flex align-items-center gap-1.5">
              <span className="telemetry-pulse"></span>
              <span>Paso Final · Agendar Visita Técnica</span>
            </span>
            <h3 className="h2 fw-bold text-dark mb-3">
              ¿Listo para desbloquear el potencial hídrico en Cuara?
            </h3>
            <p className="text-secondary small mb-4">
              Coordina con nuestro especialista hidrogeológico para verificar el fuste consolidado a 50 metros, calibrar el régimen de tandas y asegurar la inversión llave en mano de $4.000 USD.
            </p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <a
                href={`https://wa.me/584160000000?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-success btn-lg rounded-pill fw-bold text-white px-4 py-3 d-inline-flex align-items-center gap-2 shadow-sm touch-target-48"
              >
                <span className="material-symbols-outlined fs-5">chat</span>
                <span>Contactar por WhatsApp para Auditoría</span>
              </a>
              <a
                href="/cockpit"
                className="btn btn-outline-secondary btn-lg rounded-pill fw-bold px-4 py-3 d-inline-flex align-items-center gap-2 touch-target-48"
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
