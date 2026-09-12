import React from 'react';
import { Container, Badge } from 'react-bootstrap';
import { useOpenMeteo } from '../../../core/hooks/useOpenMeteo';

export const CockpitHeader: React.FC = () => {
  const { telemetry } = useOpenMeteo();

  return (
    <header className="cockpit-header-glass py-3 px-3 px-md-4 mb-4 sticky-top" style={{ zIndex: 1020 }}>
      <Container fluid="xl">
        <div className="d-flex flex-column gap-3">

          {/* ====================================================================
             FILA SUPERIOR: IDENTIDAD INSTITUCIONAL & FICHA CULTIVO EXCLUSIVO
             ==================================================================== */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 pb-3 border-bottom border-secondary-subtle">
            {/* Identidad del Cockpit */}
            <div>
              <h1 className="h3 fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                <span>Cockpit Técnico</span>
                <span className="text-brand-deep">La Cigarronera</span>
              </h1>
              <p className="text-secondary small mb-0 font-sans">
                Suite Agronómica, Dinámica Eólica &amp; Modelo Hidrogeológico · Municipio Jiménez, Estado Lara
              </p>
            </div>

            {/* Cultivo Activo Exclusivo: Pimentón (Capsicum annuum) */}
            <div className="d-flex align-items-center gap-2.5 bg-success bg-opacity-10 border border-success border-opacity-30 px-3 py-2 rounded-4 shadow-sm flex-shrink-0">
              <div className="bg-success text-white rounded-circle p-1.5 d-flex align-items-center justify-content-center shadow-xs">
                <span className="material-symbols-outlined ms-sm">workspace_premium</span>
              </div>
              <div className="d-flex flex-column">
                <div className="d-flex align-items-center gap-1.5">
                  <span className="fw-bold text-success text-xs">Pimentón Híbrido</span>
                  <Badge bg="success" className="bg-opacity-25 text-success font-monospace" style={{ fontSize: '10px' }}>
                    Capsicum annuum
                  </Badge>
                </div>
                <span className="text-secondary font-mono text-xxs mt-0.5">
                  <strong className="text-dark">2.500 Plantas</strong> · Densidad <strong className="text-success">2.50 pl/m²</strong> (1.000 m²)
                </span>
              </div>
            </div>
          </div>

          {/* ====================================================================
             FILA INFERIOR: BARRA DE TELEMETRÍA EN VIVO & GEORREFERENCIACIÓN NASA
             ==================================================================== */}
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-2.5 pt-0.5">
            {/* Cluster Izquierdo: Coordenadas Satelitales y Cota Quíbor */}
            <div className="d-flex flex-wrap align-items-center gap-2">
              <span className="agro-chip agro-chip-green text-xs font-mono">
                <span className="telemetry-pulse"></span>
                <span>{telemetry.isLive ? 'Telemetría Satelital Live' : 'Línea Base Quíbor 20A'}</span>
              </span>
              <span className="agro-chip font-monospace text-xs text-secondary bg-light border border-secondary-subtle d-inline-flex align-items-center gap-1">
                <span className="material-symbols-outlined text-secondary" style={{ fontSize: '15px' }}>location_on</span>
                <span>9°53'20.0"N 69°35'35.0"W</span>
              </span>
              <span className="agro-chip agro-chip-water font-monospace text-xs d-inline-flex align-items-center gap-1">
                <span className="material-symbols-outlined text-info" style={{ fontSize: '15px' }}>terrain</span>
                <span>700 msnm · Valle de Quíbor</span>
              </span>
            </div>

            {/* Cluster Derecho: Métricas Microclimáticas en Tiempo Real */}
            <div className="d-flex flex-nowrap overflow-auto align-items-center gap-2 bg-light px-3 py-1.5 rounded-pill border border-secondary-subtle shadow-xs text-nowrap">
              <div className="d-flex align-items-center gap-1 px-1">
                <span className="material-symbols-outlined text-danger ms-sm" style={{ fontSize: '17px' }}>device_thermostat</span>
                <span className="font-mono fw-bold text-dark text-xs">{telemetry.temperatureC}°C</span>
              </div>
              <div className="vr text-secondary opacity-25 my-1"></div>
              <div className="d-flex align-items-center gap-1 px-1">
                <span className="material-symbols-outlined text-info ms-sm" style={{ fontSize: '17px' }}>humidity_mid</span>
                <span className="font-mono fw-bold text-dark text-xs">{telemetry.relativeHumidityPct}% HR</span>
              </div>
              <div className="vr text-secondary opacity-25 my-1"></div>
              <div className="d-flex align-items-center gap-1 px-1">
                <span className="material-symbols-outlined text-warning ms-sm" style={{ fontSize: '17px' }}>air</span>
                <span className="font-mono fw-bold text-dark text-xs">{telemetry.windSpeedKmH} km/h {telemetry.windCompass}</span>
              </div>
              <div className="vr text-secondary opacity-25 my-1"></div>
              <div className="d-flex align-items-center gap-1 px-1">
                <span className="material-symbols-outlined text-success ms-sm" style={{ fontSize: '17px' }}>psychology</span>
                <span className="font-mono fw-bold text-success text-xs">VPD {telemetry.vpdKpa} kPa</span>
              </div>
            </div>
          </div>

        </div>
      </Container>
    </header>
  );
};
