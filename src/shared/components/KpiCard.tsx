import React from 'react';

interface KpiCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  iconName?: string;
  variant?: 'success' | 'info' | 'warning' | 'danger' | 'secondary';
  className?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  unit,
  subtext,
  iconName,
  variant = 'success',
  className = '',
}) => {
  const cardColors = {
    success: 'card-cockpit card-cockpit-green',
    info: 'card-cockpit card-cockpit-water',
    warning: 'card-cockpit card-cockpit-sun',
    danger: 'card-cockpit card-cockpit-alert',
    secondary: 'card-cockpit',
  };

  const iconPillColors = {
    success: 'kpi-icon-green',
    info: 'kpi-icon-water',
    warning: 'kpi-icon-sun',
    danger: 'kpi-icon-alert',
    secondary: 'bg-light text-secondary border border-secondary-subtle',
  };

  return (
    <div className={`${cardColors[variant]} ${className} h-100`}>
      <div className="p-3 d-flex flex-column h-100 justify-content-between">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <span className="text-secondary text-xs fw-bold text-uppercase tracking-wider mt-1">{label}</span>
          {iconName && (
            <div className={`kpi-icon-pill ${iconPillColors[variant]} shadow-sm`}>
              <span className="material-symbols-outlined">{iconName}</span>
            </div>
          )}
        </div>

        <div>
          <div className="d-flex align-items-baseline gap-1 mt-2 mb-1">
            <span className="fs-2 fw-bold font-mono text-dark tracking-tight">{value}</span>
            {unit && <span className="text-secondary text-xs font-monospace">{unit}</span>}
          </div>

          {subtext && (
            <div className="text-muted font-sans text-xs lh-sm">
              {subtext}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
