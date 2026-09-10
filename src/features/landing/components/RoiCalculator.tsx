import React, { useState } from 'react';
import { RoiControls } from './roi/RoiControls';
import { RoiSummaryCard } from './roi/RoiSummaryCard';

export const RoiCalculator: React.FC = () => {
  const [investmentAmount, setInvestmentAmount] = useState<number>(4000);
  const [sellingPricePerKg, setSellingPricePerKg] = useState<number>(0.90);

  // Proyección económica ciclo pimentón (12.5 Tons = 12.500 kg en 1.000 m²)
  const totalProductionKg = 12500;
  const grossRevenue = totalProductionKg * sellingPricePerKg;
  const operationalCosts = 4200;
  const netProfit = Math.max(0, grossRevenue - operationalCosts);
  const investorSharePct = (investmentAmount / 4000) * 0.40;
  const investorReturn = netProfit * investorSharePct;
  const roiPercentage = investmentAmount > 0 ? (investorReturn / investmentAmount) * 100 : 0;

  return (
    <section id="calculadora-roi" className="py-5 border-top border-secondary-subtle">
      <div className="container-xl">
        <div className="row g-5 align-items-center">
          {/* Entradas / Sliders */}
          <div className="col-12 col-lg-6">
            <span className="badge bg-success bg-opacity-10 border border-success border-opacity-25 text-success rounded-pill px-3 py-1 text-uppercase fw-bold mb-2">
              Simulador Financiero
            </span>
            <h2 className="display-6 fw-bold text-dark mb-3">
              Calculadora de Retorno de Inversión (ROI)
            </h2>
            <p className="text-secondary small mb-4">
              El Valle de Quíbor es el mayor polo hortícola de Venezuela. Los precios del pimentón en puerta de finca oscilan entre <strong className="text-dark">$0.70 y $1.40 USD/kg</strong> según la época de bochorno y radiación.
            </p>

            <RoiControls
              investmentAmount={investmentAmount}
              sellingPricePerKg={sellingPricePerKg}
              onInvestmentChange={setInvestmentAmount}
              onPriceChange={setSellingPricePerKg}
            />
          </div>

          {/* Tarjeta de Resultados Financieros */}
          <div className="col-12 col-lg-6">
            <RoiSummaryCard
              investmentAmount={investmentAmount}
              grossRevenue={grossRevenue}
              investorReturn={investorReturn}
              roiPercentage={roiPercentage}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
