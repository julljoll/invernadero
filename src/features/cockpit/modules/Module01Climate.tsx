import React, { useState } from 'react';
import { calculateVpd } from '../../../core/agronomy/vpd';
import { QUIBOR_CLIMATE_MONTHS } from '../../../core/constants/climateData';
import { Slider } from '../../../shared/components/Slider';
import { BlockMath, InlineMath } from 'react-katex';

export const Module01Climate: React.FC = () => {
  const [simTemp, setSimTemp] = useState<number>(29.5);
  const [simHr, setSimHr] = useState<number>(65);
  const [showFormulas, setShowFormulas] = useState<boolean>(false);

  const vpdResult = calculateVpd(simTemp, simHr);

  const statusBadgeClass: Record<string, string> = {
    danger_low: 'bg-danger text-light',
    optimum: 'bg-success text-white',
    warning_high: 'bg-warning text-dark',
    danger_high: 'bg-danger text-light',
  };

  return (
    <div className="row g-4">
      {/* Simulador Interactivo */}
      <div className="col-12 col-lg-5">
        <div className="card-cockpit p-4 h-100">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <span className="text-secondary text-xs fw-bold text-uppercase d-flex align-items-center gap-1.5">
              <span className="material-symbols-outlined text-brand-bright ms-sm">psychology</span>
              <span>Simulador Psicrométrico en Vivo</span>
            </span>
            <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-25 font-monospace">
              Tetens / FAO
            </span>
          </div>

          <Slider
            label="Temperatura Interior (°C):"
            value={simTemp}
            min={18}
            max={40}
            step={0.5}
            unit="°C"
            accentColor="warning"
            iconName="device_thermostat"
            onChange={setSimTemp}
          />

          <Slider
            label="Humedad Relativa (%):"
            value={simHr}
            min={20}
            max={95}
            step={1}
            unit="%"
            accentColor="info"
            iconName="humidity_mid"
            onChange={setSimHr}
          />

          {/* Resultado VPD con Semántica de Color Estricta y Desglose Aire/Canopy */}
          <div className="p-3 bg-light rounded-4 border border-secondary-subtle mt-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-secondary text-xs fw-bold text-uppercase">Déficit de Presión de Vapor:</span>
              <span className="agro-chip agro-chip-sun font-monospace text-xs">Transpiración & Cuajado</span>
            </div>

            <div className="row g-2 mb-2">
              <div className="col-6">
                <div className="p-2 bg-white rounded-3 border border-secondary-subtle">
                  <div className="text-secondary text-xs font-sans">VPD Aire (Atm)</div>
                  <div className="fs-4 fw-bold font-mono text-dark">
                    {vpdResult.vpdAir} <span className="fs-6 fw-normal text-secondary font-monospace">kPa</span>
                  </div>
                  <span className="text-secondary text-xs font-monospace">T = {simTemp}°C</span>
                </div>
              </div>
              <div className="col-6">
                <div className="p-2 bg-white rounded-3 border border-secondary-subtle">
                  <div className="text-success text-xs font-sans fw-bold">VPD Foliar (Canopy)</div>
                  <div className="fs-4 fw-bold font-mono text-success">
                    {vpdResult.vpdCanopy} <span className="fs-6 fw-normal text-secondary font-monospace">kPa</span>
                  </div>
                  <span className="text-secondary text-xs font-monospace">T_hoja = {(simTemp - 1.8).toFixed(1)}°C (ΔT -1.8)</span>
                </div>
              </div>
            </div>

            <div className="mb-2">
              <span className={`badge ${statusBadgeClass[vpdResult.status]} rounded-pill px-3 py-1.5 font-monospace text-xs shadow-sm`}>
                {vpdResult.statusLabel}
              </span>
            </div>

            <p className="text-secondary small mb-0 lh-base">
              {vpdResult.recommendation}
            </p>
          </div>

          {/* Desglose Matemático KaTeX (Progressive Disclosure) */}
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setShowFormulas(!showFormulas)}
              className="btn btn-sm btn-link text-success text-decoration-none p-0 d-flex align-items-center gap-1 font-monospace text-xs"
            >
              <span className="material-symbols-outlined ms-sm">
                {showFormulas ? 'expand_less' : 'calculate'}
              </span>
              <span>{showFormulas ? 'Ocultar Ecuación Psicrométrica' : 'Ver Ecuaciones Tetens & Canopy (KaTeX)'}</span>
            </button>

            {showFormulas && (
              <div className="formula-box mt-2">
                <div className="text-secondary text-xs mb-1 font-sans fw-bold">Presión Saturada (Tetens) y Déficit de Vapor:</div>
                <BlockMath math="e_s(T) = 0.61078 \exp\left(\frac{17.27 \cdot T}{T + 237.3}\right)\ \text{[kPa]}" />
                <BlockMath math="e_a = e_s(T_{aire}) \cdot \left(\frac{HR\%}{100}\right)\ \text{[kPa]}" />
                <BlockMath math="VPD_{aire} = e_s(T_{aire}) - e_a \quad \vert \quad VPD_{canopy} = e_s(T_{hoja}) - e_a" />
                <div className="text-secondary text-xs mt-2 pt-2 border-top border-secondary-subtle font-sans">
                  A {simTemp}°C y {simHr}% HR:
                  <div className="mt-1 font-monospace text-dark">
                    <InlineMath math={`e_s = ${vpdResult.esAir}\\ \\text{kPa}`} /> &nbsp;·&nbsp;
                    <InlineMath math={`e_a = ${vpdResult.eaAir}\\ \\text{kPa}`} /> &nbsp;·&nbsp;
                    <InlineMath math={`VPD_{canopy} = ${vpdResult.vpdCanopy}\\ \\text{kPa}`} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabla Línea Base Quíbor 20 Años */}
      <div className="col-12 col-lg-7">
        <div className="card-cockpit p-4 h-100">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div>
              <h3 className="fs-6 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <span className="material-symbols-outlined text-info ms-sm">satellite_alt</span>
                <span>Línea Base Quíbor (NASA MERRA-2 · 20 Años)</span>
              </h3>
              <span className="text-secondary text-xs">
                Cota 695 – 710 msnm · Köppen BSh (Semiárido cálido / Bosque seco premontano)
              </span>
            </div>
            <div className="text-end">
              <span className="badge bg-light border border-info-subtle text-info font-monospace d-block">
                9°53'20.0"N · 69°35'35.0"W
              </span>
              <span className="text-muted text-xs font-monospace">
                (9.888889°N, -69.593056°W)
              </span>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover table-sm align-middle small mb-0 font-sans border-secondary-subtle">
              <thead>
                <tr className="text-secondary border-bottom border-secondary-subtle text-xs">
                  <th>Mes</th>
                  <th>T. Máx</th>
                  <th>T. Mín</th>
                  <th>Lluvia</th>
                  <th>Viento</th>
                  <th>Bochorno</th>
                  <th>Dominancia</th>
                </tr>
              </thead>
              <tbody className="font-monospace">
                {QUIBOR_CLIMATE_MONTHS.map((m) => {
                  const isWindDominant = m.dir.includes('ESTE');
                  return (
                    <tr key={m.mes} className="border-bottom border-secondary-subtle">
                      <td className="fw-bold text-dark font-sans">{m.mes}</td>
                      <td className="text-danger fw-bold">{m.max}°C</td>
                      <td className="text-info">{m.min}°C</td>
                      <td>{m.lluvia} mm</td>
                      <td>{m.viento} km/h</td>
                      <td>
                        <span className={m.bochorno >= 25 ? 'text-warning fw-bold' : 'text-muted'}>
                          {m.bochorno} d
                        </span>
                      </td>
                      <td>
                        <span className={`badge rounded-pill px-2 py-0.5 ${isWindDominant ? 'bg-warning-subtle text-warning-emphasis border border-warning-subtle' : 'bg-light text-secondary border'}`}>
                          {m.dir}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-3 p-2 bg-warning bg-opacity-10 rounded-3 border border-warning border-opacity-25 d-flex align-items-center gap-2">
            <span className="material-symbols-outlined text-warning ms-sm">warning</span>
            <span className="text-dark small">
              <strong className="text-warning-emphasis">Regla de Viento Quíbor:</strong> Viento del <strong>ESTE</strong> 11 meses del año (hasta 88% frecuencia). Ráfagas registradas de <strong>27 km/h (17 mph)</strong>. Toda fachada Este requiere refuerzo estructural de doble tensor y anclajes con factor $\ge 1.5$.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
