import React, { useState } from 'react';
import { Card, Row, Col, Badge, Button, Alert } from 'react-bootstrap';
import { Slider } from '../../../shared/components/Slider';

interface MeshRollCalculatorProps {
  selectedVariant: '110' | '130';
}

export const MeshRollCalculator: React.FC<MeshRollCalculatorProps> = ({
  selectedVariant,
}) => {
  const [greenhouseAreaM2, setGreenhouseAreaM2] = useState<number>(1000);

  // Parámetros Quíbor:
  // Nave estándar de 1.000 m² requiere 3.2 m² de malla por m² de suelo
  // Incluye: Techo cenital, cerramiento perimetral h=2.5-3.0m, falda enterrada 0.50m (bloqueo trips y orugas) y solapes 20%
  const rollAreaM2 = 400; // 4m × 100m
  const factorMalla = 3.2;
  const requiredMeshAreaM2 = greenhouseAreaM2 * factorMalla;
  const numRolls = Math.ceil(requiredMeshAreaM2 / rollAreaM2);
  
  // Perfiles de sujeción recomendados (Lock Channel C + Wiggle Wire): ~1.2 metros lineales por m² de nave
  const lockChannelMeters = Math.round(greenhouseAreaM2 * 0.95);

  const is110 = selectedVariant === '110';
  const variantName = is110 
    ? '110 gsm (Flujo Convectivo & Alivio Térmico)' 
    : '130 gsm (Alta Tenacidad Perimetral)';

  const waMessage = encodeURIComponent(
    `Hola AGROVENECUA, solicito cotización técnica para Malla Antiáfido 50 Mesh en el Valle de Quíbor:\n\n` +
    `• Rubro: Pimentón (2.500 plantas)\n` +
    `• Variante Seleccionada: ${variantName}\n` +
    `• Área de Nave: ${greenhouseAreaM2.toLocaleString()} m² de suelo\n` +
    `• Malla Total Estimada: ${requiredMeshAreaM2.toLocaleString()} m² (con solapes y falda enterrada)\n` +
    `• Rollos Requeridos: ${numRolls} rollos de 4.00 m × 100 m\n` +
    `• Perfiles Lock Channel C estimados: ${lockChannelMeters} metros lineales\n\n` +
    `Por favor confirmar disponibilidad en almacén de Quíbor y flete a finca.`
  );

  return (
    <Card className="border-0 shadow-lg p-3 p-md-4 bg-white rounded-4 overflow-hidden">
      <Card.Body>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4 border-bottom pb-3">
          <div className="d-flex align-items-center gap-2">
            <span className="material-symbols-outlined text-success fs-2">calculate</span>
            <div>
              <h3 className="h4 fw-bold text-dark mb-0">Calculadora Agronómica de Rollos</h3>
              <p className="text-secondary small mb-0">
                Dimensionamiento preciso según superficie de suelo, altura de pilares y anclaje perimetral
              </p>
            </div>
          </div>
          <Badge bg={is110 ? 'success' : 'warning'} text={is110 ? 'white' : 'dark'} className="px-3 py-2 fs-7 font-monospace rounded-pill">
            Variante Activa: {is110 ? '110 gsm' : '130 gsm'}
          </Badge>
        </div>

        <Row className="g-4 align-items-center">
          <Col xs={12} lg={6}>
            <div className="mb-4">
              <Slider
                label="Superficie de Suelo de la Nave:"
                value={greenhouseAreaM2}
                min={500}
                max={5000}
                step={250}
                formatValue={(v) => `${v.toLocaleString()} m²`}
                accentColor="success"
                iconName="crop_free"
                onChange={setGreenhouseAreaM2}
              />
            </div>

            <Alert variant="light" className="border border-secondary-subtle small mb-0 p-3">
              <div className="d-flex align-items-start gap-2">
                <span className="material-symbols-outlined text-success fs-5 mt-0.5">info</span>
                <div>
                  <strong className="text-dark">Fórmula Técnica de Cobertura AGROVENECUA:</strong>
                  <div className="text-secondary mt-1">
                    Factor multiplicador <strong>3.2×</strong> para garantizar techumbre en arco/capilla, paredes verticales (2.5 - 3.0 m), solapes del 20% y <strong>falda enterrada de 50 cm</strong> contra la invasión de orugas y trips por la base del suelo.
                  </div>
                </div>
              </div>
            </Alert>
          </Col>

          <Col xs={12} lg={6}>
            <div className="p-4 bg-light rounded-4 border border-secondary-subtle shadow-sm">
              <div className="text-uppercase text-secondary fw-bold fs-8 tracking-wider mb-3">
                Resumen de Material Requerido
              </div>

              <Row className="g-3 mb-4">
                <Col xs={6}>
                  <div className="p-3 bg-white rounded-3 border border-secondary-subtle text-center">
                    <div className="text-secondary small mb-1">Malla Total Necesaria</div>
                    <div className="fs-3 fw-bold text-dark font-monospace">
                      {requiredMeshAreaM2.toLocaleString()}
                    </div>
                    <div className="text-muted text-xs">m² con solapes y faldas</div>
                  </div>
                </Col>

                <Col xs={6}>
                  <div className="p-3 bg-success bg-opacity-10 border border-success border-opacity-25 rounded-3 text-center">
                    <div className="text-success small fw-bold mb-1">Rollos Industriales</div>
                    <div className="fs-3 fw-bold text-success font-monospace">
                      {numRolls}
                    </div>
                    <div className="text-success text-xs">Rollos (4m × 100m)</div>
                  </div>
                </Col>

                <Col xs={12}>
                  <div className="p-2.5 px-3 bg-white rounded-3 border border-secondary-subtle d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2 text-secondary small">
                      <span className="material-symbols-outlined text-success fs-5">straighten</span>
                      <span>Perfil Lock Channel C + Wiggle Wire:</span>
                    </div>
                    <span className="fw-bold font-monospace text-dark">
                      ~{lockChannelMeters} m lineales
                    </span>
                  </div>
                </Col>
              </Row>

              <Button
                as="a"
                href={`https://wa.me/584160000000?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                variant="success"
                size="lg"
                className="w-100 rounded-pill fw-bold py-3 d-flex align-items-center justify-content-center gap-2 shadow"
              >
                <span className="material-symbols-outlined fs-5">chat</span>
                <span>Cotizar Pedido ({numRolls} Rollos · {variantName.split(' ')[0]} gsm)</span>
              </Button>
              <div className="text-center text-muted text-xs mt-2">
                Asesoría técnica agronómica inmediata y entrega directa en el Valle de Quíbor
              </div>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};
