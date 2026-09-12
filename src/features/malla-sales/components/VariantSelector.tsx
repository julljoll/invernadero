import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';

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
    <Row className="g-4">
      {/* Variante A: 110 gsm */}
      <Col xs={12} md={6}>
        <Card
          onClick={() => onSelectVariant('110')}
          className={`h-100 p-4 cursor-pointer transition-all shadow-sm ${
            is110
              ? 'border-success border-2 bg-success bg-opacity-10 shadow'
              : 'border-secondary-subtle bg-white hover-shadow'
          }`}
          style={{ cursor: 'pointer', transition: 'all 0.25s ease-in-out' }}
        >
          <Card.Body className="p-0 d-flex flex-column">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <Badge bg="success" className="px-3 py-1 mb-2 font-monospace text-uppercase">
                  Variante A · Recomendada Quíbor
                </Badge>
                <h3 className="h5 fw-bold text-dark mb-1">
                  110 gsm (Flujo Convectivo &amp; Alivio Térmico)
                </h3>
                <div className="text-success small fw-semibold font-monospace">
                  50 × 25 mesh · Poro ≤ 192 µm
                </div>
              </div>
              <span className={`material-symbols-outlined fs-2 ${is110 ? 'text-success' : 'text-secondary'}`}>
                {is110 ? 'check_circle' : 'radio_button_unchecked'}
              </span>
            </div>

            <Card.Text className="text-secondary small mb-3">
              <strong className="text-dark">Máximo Flujo Aerodinámico:</strong> Especialmente formulada para evacuar el calor acumulado en naves de Quíbor. Mantiene el microclima de las <strong className="text-success">2.500 plantas de pimentón</strong> hasta <strong className="text-success">2.0 °C más fresco</strong>, evitando la esterilidad del polen y el aborto de flores por temperaturas &gt; 32 °C.
            </Card.Text>

            <div className="row g-2 text-xs border-top border-secondary-subtle pt-3 mt-auto font-monospace">
              <div className="col-6 d-flex align-items-center gap-1 text-dark">
                <span className="material-symbols-outlined fs-6 text-success">fitness_center</span>
                <span>1.280 N / 5cm</span>
              </div>
              <div className="col-6 d-flex align-items-center gap-1 text-dark">
                <span className="material-symbols-outlined fs-6 text-success">verified_user</span>
                <span>95% Exclusión Plagas</span>
              </div>
              <div className="col-6 d-flex align-items-center gap-1 text-muted">
                <span className="material-symbols-outlined fs-6 text-success">air</span>
                <span>Ventilación Libre: ~22%</span>
              </div>
              <div className="col-6 d-flex align-items-center gap-1 text-muted">
                <span className="material-symbols-outlined fs-6 text-success">wb_sunny</span>
                <span>Sombra Difusa: 18-20%</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      {/* Variante B: 125-130 gsm */}
      <Col xs={12} md={6}>
        <Card
          onClick={() => onSelectVariant('130')}
          className={`h-100 p-4 cursor-pointer transition-all shadow-sm ${
            !is110
              ? 'border-warning border-2 bg-warning bg-opacity-10 shadow'
              : 'border-secondary-subtle bg-white hover-shadow'
          }`}
          style={{ cursor: 'pointer', transition: 'all 0.25s ease-in-out' }}
        >
          <Card.Body className="p-0 d-flex flex-column">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <Badge bg="warning" text="dark" className="px-3 py-1 mb-2 font-monospace text-uppercase">
                  Variante B · Refuerzo Mecánico
                </Badge>
                <h3 className="h5 fw-bold text-dark mb-1">
                  125–130 gsm (Alta Tenacidad Perimetral)
                </h3>
                <div className="text-warning-emphasis small fw-semibold font-monospace">
                  50 × 25 mesh · Poro ≤ 192 µm
                </div>
              </div>
              <span className={`material-symbols-outlined fs-2 ${!is110 ? 'text-warning' : 'text-secondary'}`}>
                {!is110 ? 'check_circle' : 'radio_button_unchecked'}
              </span>
            </div>

            <Card.Text className="text-secondary small mb-3">
              <strong className="text-dark">Máxima Resistencia al Viento:</strong> Monofilamento de calibre engrosado para soportar ráfagas del Este de 27 km/h y el roce continuo en cumbreras y esquinas perimetrales. Recomendada para naves de pimentón con tutorado pesado y zonas con alta turbulencia.
            </Card.Text>

            <div className="row g-2 text-xs border-top border-secondary-subtle pt-3 mt-auto font-monospace">
              <div className="col-6 d-flex align-items-center gap-1 text-dark">
                <span className="material-symbols-outlined fs-6 text-warning">fitness_center</span>
                <span>1.530 N / 5cm</span>
              </div>
              <div className="col-6 d-flex align-items-center gap-1 text-dark">
                <span className="material-symbols-outlined fs-6 text-warning">verified_user</span>
                <span>98% Exclusión Plagas</span>
              </div>
              <div className="col-6 d-flex align-items-center gap-1 text-muted">
                <span className="material-symbols-outlined fs-6 text-warning">air</span>
                <span>Ventilación Libre: ~18%</span>
              </div>
              <div className="col-6 d-flex align-items-center gap-1 text-muted">
                <span className="material-symbols-outlined fs-6 text-warning">wb_sunny</span>
                <span>Sombra Difusa: 22-25%</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};
