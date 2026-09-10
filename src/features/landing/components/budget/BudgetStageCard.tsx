import React from 'react';

export interface BudgetStageProps {
  stageNumber: number;
  stageName: string;
  amountUsd: number;
  iconName: string;
  variant?: 'success' | 'info' | 'warning';
  items: string[];
}

export const BudgetStageCard: React.FC<BudgetStageProps> = ({
  stageNumber,
  stageName,
  amountUsd,
  iconName,
  variant = 'success',
  items,
}) => {
  const badgeClasses = {
    success: 'bg-success bg-opacity-25 text-success',
    info: 'bg-info bg-opacity-25 text-info',
    warning: 'bg-warning bg-opacity-25 text-warning',
  };

  const textClasses = {
    success: 'text-success',
    info: 'text-info',
    warning: 'text-warning',
  };

  const cardClasses = {
    success: 'card-agro',
    info: 'card-agro card-agro-water',
    warning: 'card-agro card-agro-sun',
  };

  return (
    <div className="col">
      <div className={`card ${cardClasses[variant]} h-100 p-4`}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <span className={`badge ${badgeClasses[variant]} rounded-pill font-monospace`}>
            Etapa {stageNumber}
          </span>
          <span className={`material-symbols-outlined ${textClasses[variant]} ms-lg`}>
            {iconName}
          </span>
        </div>

        <h3 className="fs-5 fw-bold text-dark mb-1">{stageName}</h3>
        <div className={`fs-2 fw-bold font-mono ${textClasses[variant]} mb-3`}>
          ${amountUsd.toLocaleString()} <span className="fs-6 fw-normal text-secondary font-monospace">USD</span>
        </div>

        <ul className="list-unstyled text-secondary small d-flex flex-column gap-2 mb-0">
          {items.map((item, index) => (
            <li key={index} className="d-flex align-items-start gap-2">
              <span className={`material-symbols-outlined ${textClasses[variant]} ms-sm mt-0.5`}>
                check_circle
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
