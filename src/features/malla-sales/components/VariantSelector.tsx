import React from 'react';

interface VariantSelectorProps {
  selectedVariant: '110' | '130';
  onSelectVariant: (variant: '110' | '130') => void;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  selectedVariant,
  onSelectVariant,
}) => {
  const is110 = selectedVariant === '110';

  return (
    <div className="row g-4">
      {/* Variante A: 110 gsm */}
      <div className="col-12 col-md-6">
        <div
          onClick={() => onSelectVariant('110')}
          className={`card card-agro h-100 p-4 cursor-pointer transition-all ${
            is110 ? 'border-success border-opacity-75 shadow-lg' : 'border-white border-opacity-10'
          }`}
          style={{ cursor: 'pointer' }}
        >
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <span className="badge bg-success bg-opacity-25 text-success rounded-pill font-monospace mb-1">
                Variante A
              </span>
              <h3 className="fs-5 fw-bold text-dark mb-0">110 gsm (Tomate Hilo Alto)</h3>
            </div>
            <span className={`material-symbols-outlined ms-md ${is110 ? 'text-success' : 'text-secondary'}`}>
              {is110 ? 'radio_button_checked' : 'radio_button_unchecked'}
            </span>
          </div>

          <p className="text-secondary small mb-3">
            <strong className="text-dark">Máximo Flujo Convectivo:</strong> Diseñada para evacuar calor en cultivos de porte alto (2.2 m). Mantiene las naves hasta <strong className="text-success">2 °C más frescas</strong>, evitando el aborto floral por sobrecalentamiento.
          </p>

          <div className="row g-2 text-xs border-top border-secondary-subtle pt-3 mt-auto font-monospace">
            <div className="col-6 d-flex align-items-center gap-1 text-dark">
              <span className="material-symbols-outlined ms-sm text-success">fitness_center</span>
              <span>1.280 N / 5cm</span>
            </div>
            <div className="col-6 d-flex align-items-center gap-1 text-dark">
              <span className="material-symbols-outlined ms-sm text-success">verified_user</span>
              <span>95% Reducción Virosis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Variante B: 125-130 gsm */}
      <div className="col-12 col-md-6">
        <div
          onClick={() => onSelectVariant('130')}
          className={`card card-agro h-100 p-4 cursor-pointer transition-all ${
            !is110 ? 'border-warning border-opacity-75 shadow-lg' : 'border-secondary-subtle'
          }`}
          style={{ cursor: 'pointer' }}
        >
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <span className="badge bg-warning bg-opacity-25 text-warning rounded-pill font-monospace mb-1">
                Variante B
              </span>
              <h3 className="fs-5 fw-bold text-dark mb-0">125–130 gsm (Pimentón)</h3>
            </div>
            <span className={`material-symbols-outlined ms-md ${!is110 ? 'text-warning' : 'text-secondary'}`}>
              {!is110 ? 'radio_button_checked' : 'radio_button_unchecked'}
            </span>
          </div>

          <p className="text-secondary small mb-3">
            <strong className="text-dark">Máxima Resistencia Mecánica:</strong> Alta tenacidad para soportar ráfagas del Este de 27 km/h y fricción sobre postes. El porte compacto del pimentón permite priorizar durabilidad estructural a 5 años.
          </p>

          <div className="row g-2 text-xs border-top border-secondary-subtle pt-3 mt-auto font-monospace">
            <div className="col-6 d-flex align-items-center gap-1 text-dark">
              <span className="material-symbols-outlined ms-sm text-warning">fitness_center</span>
              <span>1.530 N / 5cm</span>
            </div>
            <div className="col-6 d-flex align-items-center gap-1 text-dark">
              <span className="material-symbols-outlined ms-sm text-warning">verified_user</span>
              <span>98% Reducción Virosis</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
