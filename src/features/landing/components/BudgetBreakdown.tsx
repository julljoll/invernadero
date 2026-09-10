import React from 'react';
import { BudgetStageCard, BudgetStageProps } from './budget/BudgetStageCard';

export const BudgetBreakdown: React.FC = () => {
  const stages: BudgetStageProps[] = [
    {
      stageNumber: 1,
      stageName: 'Culminación Pozo',
      amountUsd: 1650,
      iconName: 'handyman',
      variant: 'success',
      items: [
        'Excavación manual de 50m a 60m (10m en acuífero productivo).',
        'Vaciado in situ de anillos de concreto armado con malla electrosoldada.',
        'Engravado perimetral con canto rodado para filtrado mecánico de sedimentos.',
      ],
    },
    {
      stageNumber: 2,
      stageName: 'Equipamiento Hidráulico',
      amountUsd: 1350,
      iconName: 'electric_bolt',
      variant: 'info',
      items: [
        'Bomba sumergible de 2.0 HP para pozo profundo de 4 pulgadas.',
        'Cable plano sumergible 3×10 AWG y tablero de protección térmica.',
        'Tubería de impulsión PEAD / PVC y manómetros de glicerina.',
      ],
    },
    {
      stageNumber: 3,
      stageName: 'Activación Hortícola',
      amountUsd: 1000,
      iconName: 'eco',
      variant: 'warning',
      items: [
        '2.200 plántulas certificadas de pimentón de primera calidad.',
        'Mangueras de goteo autocompensantes con goteros a 20 cm.',
        'Fertilización de base soluble y red de entutorado Hortomalla.',
      ],
    },
  ];

  return (
    <section className="py-5 border-top border-secondary-subtle">
      <div className="container-xl">
        <div className="text-center max-w-2xl mx-auto mb-5">
          <span className="badge bg-success bg-opacity-10 border border-success border-opacity-25 text-success rounded-pill px-3 py-1 text-uppercase fw-bold mb-2">
            Desglose Técnico
          </span>
          <h2 className="display-6 fw-bold text-dark mb-2">
            Presupuesto Llave en Mano: $4.000 USD
          </h2>
          <p className="text-secondary small">
            Cada dólar está georreferenciado y asignado a ítems físicos y mecánicos verificables en campo.
          </p>
        </div>

        <div className="row row-cols-1 row-cols-md-3 g-4">
          {stages.map((stage) => (
            <BudgetStageCard key={stage.stageNumber} {...stage} />
          ))}
        </div>
      </div>
    </section>
  );
};
