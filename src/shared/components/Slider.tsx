import React from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  formatValue?: (val: number) => string;
  accentColor?: 'success' | 'info' | 'warning';
  iconName?: string;
  onChange: (val: number) => void;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step,
  unit = '',
  formatValue,
  accentColor = 'success',
  iconName,
  onChange,
}) => {
  const textColors = {
    success: 'text-success',
    info: 'text-info',
    warning: 'text-warning',
  };

  const rangeClasses = {
    success: 'form-range',
    info: 'form-range form-range-water',
    warning: 'form-range',
  };

  const displayValue = formatValue ? formatValue(value) : `${value} ${unit}`;

  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <label className="form-label mb-0 text-dark text-xs fw-semibold d-flex align-items-center gap-1">
          {iconName && <span className={`material-symbols-outlined ms-sm ${textColors[accentColor]}`}>{iconName}</span>}
          <span>{label}</span>
        </label>
        <span className={`font-mono fw-bold fs-6 ${textColors[accentColor]}`}>
          {displayValue}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={rangeClasses[accentColor]}
      />
    </div>
  );
};
