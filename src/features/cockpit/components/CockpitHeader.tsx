import React from 'react';
import { useAgroStore } from '../../../shared/store/useAgroStore';
import { CROPS_CATALOG } from '../../../core/constants/crops';
import { CropType } from '../../../core/types/agronomy';
import { useOpenMeteo } from '../../../core/hooks/useOpenMeteo';

export const CockpitHeader: React.FC = () => {
  const { selectedCrop, setSelectedCrop } = useAgroStore();
  const { telemetry } = useOpenMeteo();

  const cropIcons: Record<CropType, string> = {
    pepper: 'workspace_premium',
    tomato: 'nutrition',
    cucumber: 'spa',
  };

  const cropDescriptions: Record<CropType, string> = {
    pepper: 'Porte 0.8-1.2m · Alero 2.5m viable',
    tomato: 'Hilo Alto (2.2m) · Alero mín. 3.0m / Cumbrera 5.5m',
    cucumber: 'Ciclo rápido · Alta demanda hídrica',
  };

  return (
    <div className="card-cockpit border-0 rounded-0 border-bottom border-secondary-subtle py-3 px-3 px-md-4 mb-4">
      <div className="container-xl">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
          
          {/* Identidad y Georreferenciación Exacta Quíbor */}
          <div>
            <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
              <span className="agro-chip agro-chip-green">
                <span className="telemetry-pulse"></span>
                <span>{telemetry.isLive ? 'Telemetría Satelital Live' : 'Línea Base Quíbor 20A'}</span>
              </span>
              <span className="agro-chip font-monospace">
                9°53'20.0"N 69°35'35.0"W
              </span>
              <span className="agro-chip agro-chip-water font-monospace">
                700 msnm · Valle de Quíbor
              </span>
            </div>

            <h1 className="h3 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
              <span>Cockpit Técnico</span>
              <span className="text-brand-deep">La Cigarronera</span>
            </h1>
            <p className="text-secondary small mb-0 mt-1">
              Suite Agronómica, Dinámica Eólica &amp; Modelo Hidrogeológico · Municipio Jiménez, Lara
            </p>
          </div>

          {/* Telemetría Micro-Barra en Tiempo Real */}
          <div className="d-flex flex-wrap align-items-center gap-2 bg-light p-2 rounded-4 border border-secondary-subtle shadow-sm">
            <div className="d-flex align-items-center gap-1 px-2 py-1">
              <span className="material-symbols-outlined text-danger ms-sm">device_thermostat</span>
              <span className="font-mono fw-bold text-dark">{telemetry.temperatureC}°C</span>
            </div>
            <div className="vr text-secondary opacity-25 my-1"></div>
            <div className="d-flex align-items-center gap-1 px-2 py-1">
              <span className="material-symbols-outlined text-info ms-sm">humidity_mid</span>
              <span className="font-mono fw-bold text-dark">{telemetry.relativeHumidityPct}%</span>
            </div>
            <div className="vr text-secondary opacity-25 my-1"></div>
            <div className="d-flex align-items-center gap-1 px-2 py-1">
              <span className="material-symbols-outlined text-warning ms-sm">air</span>
              <span className="font-mono fw-bold text-dark">{telemetry.windSpeedKmH} km/h {telemetry.windCompass}</span>
            </div>
            <div className="vr text-secondary opacity-25 my-1"></div>
            <div className="d-flex align-items-center gap-1 px-2 py-1">
              <span className="material-symbols-outlined text-success ms-sm">psychology</span>
              <span className="font-mono fw-bold text-success">{telemetry.vpdKpa} kPa</span>
            </div>
          </div>

          {/* Selector de Cultivo Agronómico */}
          <div className="d-flex flex-column align-items-lg-end">
            <span className="text-secondary text-xs fw-bold text-uppercase mb-1">Cultivo Activo en Suite:</span>
            <div className="btn-group bg-light p-1 rounded-pill border border-secondary-subtle" role="group">
              {(Object.keys(CROPS_CATALOG) as CropType[]).map((cKey) => {
                const isSelected = selectedCrop === cKey;
                const label = cKey === 'pepper' ? 'Pimentón' : cKey === 'tomato' ? 'Tomate Hilo Alto' : 'Pepino';
                return (
                  <button
                    key={cKey}
                    type="button"
                    title={cropDescriptions[cKey]}
                    onClick={() => setSelectedCrop(cKey)}
                    className={`btn btn-sm rounded-pill touch-target-48 px-3 fw-bold transition-all ${
                      isSelected
                        ? 'btn-success text-white shadow-sm'
                        : 'text-secondary border-0'
                    }`}
                  >
                    <span className="material-symbols-outlined ms-sm me-1">{cropIcons[cKey]}</span>
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
