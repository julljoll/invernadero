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
  const borderColors = {
    success: 'border-success border-opacity-25',
    info: 'border-info border-opacity-25',
    warning: 'border-warning border-opacity-25',
    danger: 'border-danger border-opacity-25',
    secondary: 'border-secondary border-opacity-25',
  };

  const textColors = {
    success: 'text-success',
    info: 'text-info',
    warning: 'text-warning',
    danger: 'text-danger',
    secondary: 'text-secondary',
  };

  return (
    <div className={`card card-agro ${borderColors[variant]} ${className}`}>
      <div className="card-body p-3 d-flex flex-column justify-content-between">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <span className="text-secondary text-xs fw-semibold">{label}</span>
          {iconName && (
            <span className={`material-symbols-outlined ms-sm ${textColors[variant]}`}>
              {iconName}
            </span>
          )}
        </div>

        <div className="d-flex align-items-baseline gap-1 my-1">
          <span className={`fs-3 fw-bold font-mono ${textColors[variant]}`}>{value}</span>
          {unit && <span className="text-secondary small font-monospace">{unit}</span>}
        </div>

        {subtext && (
          <div className="text-secondary" style={{ fontSize: '0.75rem' }}>
            {subtext}
          </div>
        )}
      </div>
    </div>
  );
};
