import React from 'react';
import { FunnelHero } from './components/funnel/FunnelHero';
import { FunnelAgronomicBenefits } from './components/funnel/FunnelAgronomicBenefits';
import { FunnelFinancialBenefits } from './components/funnel/FunnelFinancialBenefits';
import { FunnelCockpitCTA } from './components/funnel/FunnelCockpitCTA';

export const LandingPage: React.FC = () => {
  return (
    <div className="landing-funnel-wrapper">
      {/* 1. Hero del Embudo de Ventas: Propuesta de Valor, Oportunidad de Reactivación y CTAs */}
      <FunnelHero />

      {/* 2. Factores Clave y Beneficios Técnicos extraídos del Cockpit (Rendimiento, Malla 50 Mesh, Riego FAO-56, VPD) */}
      <FunnelAgronomicBenefits />

      {/* 3. Simulador Financiero y Retorno de Inversión (ROI) con selector dinámico Tomate / Pimentón */}
      <FunnelFinancialBenefits />

      {/* 4. Banner CTA Principal hacia el Cockpit Técnico (http://localhost:3000/cockpit) */}
      <FunnelCockpitCTA />
    </div>
  );
};

export default LandingPage;
