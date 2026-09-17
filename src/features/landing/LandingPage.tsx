import React from 'react';
import { FunnelHero } from './components/funnel/FunnelHero';
import { FunnelAgronomicBenefits } from './components/funnel/FunnelAgronomicBenefits';
import { FunnelTechEvidence } from './components/funnel/FunnelTechEvidence';
import { FunnelFinancialBenefits } from './components/funnel/FunnelFinancialBenefits';
import { FunnelCockpitCTA } from './components/funnel/FunnelCockpitCTA';

export const LandingPage: React.FC = () => {
  return (
    <div className="landing-funnel-wrapper">
      {/* 1. Hero de Reactivación: Propuesta de Valor, Oportunidad y CTAs */}
      <FunnelHero />

      {/* 2. Factores Clave y Beneficios Técnicos extraídos del Cockpit (Rendimiento, Malla 50 Mesh, Riego FAO-56, VPD) */}
      <FunnelAgronomicBenefits />

      {/* 3. Evidencia Técnica y Planos de Ingeniería 2D (Valle de Quíbor / Formación Cuara) */}
      <FunnelTechEvidence />

      {/* 4. Simulador Financiero y Retorno de Inversión (ROI) para 3.500 plantas de Pimentón */}
      <FunnelFinancialBenefits />

      {/* 5. Banner CTA Principal hacia el Cockpit Técnico */}
      <FunnelCockpitCTA />
    </div>
  );
};

export default LandingPage;
