import React, { useState } from 'react';
import { Slider } from '../../../../shared/components/Slider';
import { Link } from 'react-router-dom';

export const FunnelFinancialBenefits: React.FC = () => {
  const [sellingPrice, setSellingPrice] = useState<number>(0.90);

  const current = {
    name: 'Pimentón (Capsicum annuum)',
    cycleMonths: '5 meses',
    totalProductionKg: 12500, // 12.5 T en 1.000 m² a 2.5 pl/m²
    plants: 2500,
    operationalCosts: 4200,
    defaultPrice: 0.90,
    minPrice: 0.50,
    maxPrice: 1.40,
  };

  const grossRevenue = current.totalProductionKg * sellingPrice;
  const netProfit = Math.max(0, grossRevenue - current.operationalCosts);
  const investmentTotal = 4000;
  const investorReturn = netProfit * 0.40; // 40% participación por los $4.000 USD
  const roiPct = (investorReturn / investmentTotal) * 100;

  return (
    <section id="financiero" className="py-5 border-top border-secondary-subtle bg-light">
      <div className="container-xl py-3">
        {/* Encabezado */}
        <div className="text-center max-w-2xl mx-auto mb-5">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-success bg-opacity-10 border border-success border-opacity-25 text-success text-xs fw-bold text-uppercase mb-2">
            <span className="material-symbols-outlined ms-sm">payments</span>
            <span>Retorno de Capital &amp; Rentabilidad Quíbor</span>
          </div>
          <h2 className="display-6 fw-bold text-dark mb-2">
            Proyección Financiera: Reactivación con $4.000 USD
          </h2>
          <p className="text-secondary small max-w-xl mx-auto">
            Simula la recuperación de inversión en 1 solo ciclo con los rendimientos reales auditados en el Cockpit Agronómico para 2.500 plantas de pimentón.
          </p>

          {/* Insignia de Cultivo Único */}
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill bg-white border border-success border-opacity-30 shadow-sm mt-3">
            <span className="material-symbols-outlined text-success ms-sm">psychiatry</span>
            <span className="fw-bold text-success text-xs">Pimentón Híbrido Tecnificado (2.500 Plantas · 12.5 T)</span>
          </div>
        </div>

        <div className="row g-4 align-items-stretch">
          {/* Controles y Premisas */}
          <div className="col-12 col-lg-6">
            <div className="card card-agro p-4 h-100 shadow-sm border bg-white d-flex flex-column justify-content-between">
              <div>
                <h3 className="fs-5 fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                  <span className="material-symbols-outlined text-success ms-md">price_change</span>
                  <span>Simulador de Precio a Puerta de Finca</span>
                </h3>

                <p className="text-secondary small mb-3">
                  En el Municipio Jiménez, el precio en finca oscila estacionalmente. Mueve el control para evaluar escenarios conservadores y optimistas:
                </p>

                <Slider
                  label={`Precio de Venta ${current.name}:`}
                  value={sellingPrice}
                  min={current.minPrice}
                  max={current.maxPrice}
                  step={0.05}
                  formatValue={(v) => `$${v.toFixed(2)} USD / kg`}
                  accentColor="success"
                  iconName="sell"
                  onChange={setSellingPrice}
                />

                <div className="p-3 bg-light rounded-3 border border-secondary-subtle mt-4 text-xs text-secondary">
                  <div className="d-flex justify-content-between py-1.5 border-bottom border-secondary-subtle">
                    <span>Área Neta Bajo Malla:</span>
                    <strong className="text-dark font-mono">1.000 m² (20m × 50m)</strong>
                  </div>
                  <div className="d-flex justify-content-between py-1.5 border-bottom border-secondary-subtle">
                    <span>Densidad Tecnificada:</span>
                    <strong className="text-dark font-mono">{current.plants.toLocaleString()} plantas</strong>
                  </div>
                  <div className="d-flex justify-content-between py-1.5 border-bottom border-secondary-subtle">
                    <span>Cosecha Proyectada:</span>
                    <strong className="text-success font-mono fw-bold">
                      {current.totalProductionKg.toLocaleString()} kg ({(current.totalProductionKg / 1000).toFixed(1)} Ton)
                    </strong>
                  </div>
                  <div className="d-flex justify-content-between py-1.5 border-bottom border-secondary-subtle">
                    <span>Duración del Ciclo:</span>
                    <strong className="text-dark font-mono">{current.cycleMonths}</strong>
                  </div>
                  <div className="d-flex justify-content-between pt-1.5">
                    <span>Costos Operativos (AIFA Fertirriego + Mano de obra):</span>
                    <strong className="text-dark font-mono">${current.operationalCosts.toLocaleString()} USD</strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-top border-secondary-subtle text-xxs text-secondary d-flex align-items-center justify-content-between">
                <div>
                  <span className="material-symbols-outlined text-success ms-sm align-middle me-1">verified</span>
                  <span>Datos sincronizados con Cockpit Quíbor</span>
                </div>
                <Link to="/cockpit" className="text-success fw-bold text-decoration-none">
                  Ver plan de fertirriego →
                </Link>
              </div>
            </div>
          </div>

          {/* Resultado Financiero */}
          <div className="col-12 col-lg-6">
            <div className="card card-agro border-success border-opacity-50 p-4 h-100 shadow-sm bg-white d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="badge bg-success bg-opacity-25 text-success rounded-pill font-monospace">
                    Balance del Ciclo ({current.cycleMonths})
                  </span>
                  <span className="badge bg-light text-dark border border-secondary-subtle font-monospace">
                    Participación Inversora: 40%
                  </span>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <div className="p-3 bg-light rounded-3 border border-secondary-subtle">
                      <div className="text-secondary text-xs mb-1">Ingreso Bruto Total</div>
                      <div className="fs-4 fw-bold font-mono text-dark">
                        ${grossRevenue.toLocaleString()} <span className="fs-6 text-secondary">USD</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 bg-light rounded-3 border border-secondary-subtle">
                      <div className="text-secondary text-xs mb-1">Utilidad Neta Nave</div>
                      <div className="fs-4 fw-bold font-mono text-success">
                        ${netProfit.toLocaleString()} <span className="fs-6 text-secondary">USD</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-3 bg-success bg-opacity-10 border border-success border-opacity-25 mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="text-success text-xs fw-bold text-uppercase">Retorno Neto Inversor</div>
                      <div className="display-6 fw-bold font-mono text-success lh-1">
                        ${investorReturn.toFixed(0)} <span className="fs-6 text-dark font-sans fw-normal">USD</span>
                      </div>
                      <div className="text-secondary text-xxs mt-1">Sobre ticket de inversión de $4.000 USD</div>
                    </div>
                    <div className="text-end">
                      <div className="badge bg-success text-white font-mono fs-5 px-3 py-2 rounded-pill shadow-sm">
                        +{roiPct.toFixed(0)}% ROI
                      </div>
                      <div className="text-secondary text-xs mt-1">En {current.cycleMonths}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <a
                  href={`https://wa.me/584160000000?text=Hola%20Agrovenecua,%20revisé%20el%20simulador%20financiero%20de%20la%20nave%20de%201000m2%20para%20${current.name}%20con%20precio%20de%20$${sellingPrice.toFixed(2)}/kg.%20Deseo%20evaluar%20postular%20inversión.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success btn-lg touch-target-48 w-100 rounded-pill fw-bold text-white d-flex align-items-center justify-content-center gap-2 shadow-sm mb-2"
                >
                  <span className="material-symbols-outlined ms-sm">handshake</span>
                  <span>Postular Capital de Reactivación ($4.000 USD)</span>
                </a>

                <div className="text-center">
                  <Link to="/cockpit" className="text-secondary text-xxs font-mono text-decoration-none">
                    ¿Quieres verificar el aforo del pozo y salinidad? <span className="text-success fw-bold">Cockpit Hidrología →</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default FunnelFinancialBenefits;
