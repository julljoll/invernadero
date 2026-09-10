import React from 'react';
import { Slider } from '../../../../shared/components/Slider';

interface RoiControlsProps {
  investmentAmount: number;
  sellingPricePerKg: number;
  onInvestmentChange: (val: number) => void;
  onPriceChange: (val: number) => void;
}

export const RoiControls: React.FC<RoiControlsProps> = ({
  investmentAmount,
  sellingPricePerKg,
  onInvestmentChange,
  onPriceChange,
}) => {
  return (
    <div className="card card-agro p-4">
      <Slider
        label="Monto a Invertir:"
        value={investmentAmount}
        min={500}
        max={4000}
        step={500}
        formatValue={(v) => `$${v.toLocaleString()} USD`}
        accentColor="success"
        iconName="payments"
        onChange={onInvestmentChange}
      />

      <Slider
        label="Precio Estimado Venta Pimentón:"
        value={sellingPricePerKg}
        min={0.60}
        max={1.50}
        step={0.05}
        formatValue={(v) => `$${v.toFixed(2)} USD / kg`}
        accentColor="info"
        iconName="sell"
        onChange={onPriceChange}
      />
    </div>
  );
};
