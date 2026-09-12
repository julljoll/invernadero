import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Slider } from '../../../shared/components/Slider';

interface RoiPimentonCardProps {
  onContactClick?: () => void;
}

export const RoiPimentonCard: React.FC<RoiPimentonCardProps> = ({ onContactClick }) => {
  const [pricePerKg, setPricePerKg] = useState<number>(1.20);
  const [yieldPerPlant, setYieldPerPlant] = useState<number>(4.2);

  const plants = 2500;
  const investmentPozo = 4000;
  const residualMartilloValue = 750; // Valor residual del martillo
  const netInvestmentPozo = investmentPozo - residualMartilloValue;

  const totalKg = Math.round(plants * yieldPerPlant);
  const totalCestas20Kg = Math.round(totalKg / 20);
  const grossRevenue = Math.round(totalKg * pricePerKg);
  const opexPerKg = 0.38; // Insumos, fertirriego AIFA, mano de obra
  const totalOpex = Math.round(totalKg * opexPerKg);
  const netProfit = grossRevenue - totalOpex;
  
  // Semanas para amortizar el pozo (asumiendo 12 semanas de corte escalonado)
  const revenuePerHarvestWeek = grossRevenue / 12;
  const weeksToAmortize = (investmentPozo / revenuePerHarvestWeek).toFixed(1);

  // Ahorro en cisternas estimado por ciclo
  const cisternaSavingsUsd = 2400;

  const waMessage = encodeURIComponent(
    `Hola Agrovenecua, estuve revisando el Plan de Viabilidad de Inversión del Pozo para Pimentón:\n` +
    `• Rendimiento estimado: ${yieldPerPlant} kg/planta (${totalKg.toLocaleString()} kg totales)\n` +
    `• Precio simulado: $${pricePerKg.toFixed(2)} USD/kg\n` +
    `• Ingreso Bruto: $${grossRevenue.toLocaleString()} USD | Utilidad Neta: $${netProfit.toLocaleString()} USD\n` +
    `• Amortización del pozo ($4.000): En ${weeksToAmortize} semanas de cosecha.\n` +
    `Deseo revisar los términos de financiamiento/ejecución del pozo en Finca La Cigarronera.`
  );

  return (
    <div className="card-cockpit shadow-sm border-0 overflow-hidden mb-4 bg-white">
      <div className="bg-agro-success-soft border-bottom border-success border-opacity-20 py-3 px-4 d-flex flex-wrap justify-content-between align-items-center gap-2">
        <div className="d-flex align-items-center gap-2.5">
          <div className="kpi-icon-pill kpi-icon-green shadow-xs">
            <span className="material-symbols-outlined fs-5">psychiatry</span>
          </div>
          <div>
            <h4 className="fs-5 fw-bold text-success mb-0">
              Retorno de Inversión (ROI) · Pimentón Tecnificado Quíbor
            </h4>
            <span className="text-secondary text-xs">
              2.500 plantas protegidas bajo Malla 50 Mesh (1.000 m² en Cuara)
            </span>
          </div>
        </div>
        <span className="badge bg-agro-success-soft text-success border border-success border-opacity-30 font-mono px-3 py-2 fs-6 rounded-pill shadow-xs">
          Amortización: ~{weeksToAmortize} Semanas
        </span>
      </div>

      <div className="p-4">
        <Row className="g-4 align-items-stretch">
          {/* Parámetros Dinámicos de Simulación */}
          <Col xs={12} lg={6} className="d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-dark fw-bold small text-uppercase">Variables de Mercado y Campo</span>
                <span className="badge bg-light text-secondary border font-mono">1er Ciclo (5 Meses)</span>
              </div>

              <div className="mb-3">
                <Slider
                  label="Precio Puerta de Finca (Quíbor / Barquisimeto):"
                  value={pricePerKg}
                  min={0.90}
                  max={1.50}
                  step={0.05}
                  formatValue={(v) => `$${v.toFixed(2)} USD / kg`}
                  accentColor="success"
                  iconName="payments"
                  onChange={setPricePerKg}
                />
              </div>

              <div className="mb-3">
                <Slider
                  label="Rendimiento por Planta bajo Malla 50 Mesh:"
                  value={yieldPerPlant}
                  min={3.5}
                  max={5.0}
                  step={0.1}
                  formatValue={(v) => `${v.toFixed(1)} kg/planta`}
                  accentColor="info"
                  iconName="nutrition"
                  onChange={setYieldPerPlant}
                />
              </div>

              {/* Ficha Resumen Agronómica */}
              <div className="p-3 bg-light rounded-3 border border-secondary-subtle small text-secondary">
                <div className="d-flex justify-content-between py-1.5 border-bottom border-secondary-subtle">
                  <span>Densidad y marco de plantación:</span>
                  <strong className="text-dark font-mono">2.50 pl/m² (10 camellones dobles)</strong>
                </div>
                <div className="d-flex justify-content-between py-1.5 border-bottom border-secondary-subtle">
                  <span>Cosecha proyectada (1er Ciclo):</span>
                  <strong className="text-dark font-mono">{totalKg.toLocaleString()} kg (~{totalCestas20Kg} cestas 20kg)</strong>
                </div>
                <div className="d-flex justify-content-between py-1.5 border-bottom border-secondary-subtle">
                  <span>Fracción de Lavado de Sal (LF):</span>
                  <strong className="text-info font-mono">+23% sobre-riego garantizado</strong>
                </div>
                <div className="d-flex justify-content-between pt-1.5">
                  <span>Ahorro neto por supresión de cisternas:</span>
                  <strong className="text-success font-mono">+${cisternaSavingsUsd.toLocaleString()} USD / ciclo</strong>
                </div>
              </div>
            </div>

            <div className="mt-3 text-xxs text-secondary">
              * Estimación sustentada en la Memoria Hidrogeológica y Protocolo FAO-56 para el Valle de Quíbor.
            </div>
          </Col>

          {/* Tarjeta de Impacto Económico */}
          <Col xs={12} lg={6}>
            <div className="p-4 rounded-3 bg-agro-success-soft border border-success border-opacity-30 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="text-uppercase text-secondary text-xs fw-bold mb-3 d-flex align-items-center gap-1.5">
                  <span className="material-symbols-outlined text-success fs-6">analytics</span>
                  <span>Proyección Financiera Consolidada</span>
                </div>

                <Row className="g-3 mb-3">
                  <Col xs={6}>
                    <div className="bg-white p-3 rounded-3 border border-success border-opacity-20 shadow-xs">
                      <div className="text-secondary text-xs mb-1">Ingreso Bruto Ciclo 1</div>
                      <div className="fs-4 fw-bold font-mono text-dark">
                        ${grossRevenue.toLocaleString()} <span className="fs-6 text-muted">USD</span>
                      </div>
                      <div className="text-muted text-xxs mt-1">12 semanas de corte continuo</div>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="bg-white p-3 rounded-3 border border-success border-opacity-20 shadow-xs">
                      <div className="text-secondary text-xs mb-1">Utilidad Operativa Neta</div>
                      <div className="fs-4 fw-bold font-mono text-success">
                        ${netProfit.toLocaleString()} <span className="fs-6 text-muted">USD</span>
                      </div>
                      <div className="text-muted text-xxs mt-1">OPEX: ~${totalOpex.toLocaleString()} USD</div>
                    </div>
                  </Col>
                </Row>

                <div className="p-3 bg-white border border-success border-opacity-30 rounded-3 mb-3 shadow-xs">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="text-success text-xs fw-bold text-uppercase">Carga de Inversión del Pozo ($4.000 USD)</div>
                      <div className="fs-3 fw-bold font-mono text-success">
                        {((investmentPozo / grossRevenue) * 100).toFixed(1)}% <span className="fs-6 fw-normal font-sans text-dark">del ingreso bruto</span>
                      </div>
                      <div className="text-secondary text-xxs mt-0.5">
                        (Apenas {((netInvestmentPozo / grossRevenue) * 100).toFixed(1)}% si se descuenta el martillo industrial)
                      </div>
                    </div>
                    <div className="text-end">
                      <span className="badge bg-agro-success-soft text-success border border-success border-opacity-30 px-3 py-2 font-mono fs-6 rounded-pill shadow-xs">
                        {weeksToAmortize} Semanas
                      </span>
                      <div className="text-secondary text-xxs mt-1">Para amortización 100%</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <a
                  href={`https://wa.me/584160000000?text=${waMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success btn-lg w-100 rounded-pill fw-bold text-white d-flex align-items-center justify-content-center gap-2 shadow-sm touch-target-48"
                  onClick={onContactClick}
                >
                  <span className="material-symbols-outlined fs-5">handshake</span>
                  <span>Postular Capital de Reactivación ($4.000 USD)</span>
                </a>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
