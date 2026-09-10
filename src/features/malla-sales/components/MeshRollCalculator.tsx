import React, { useState } from 'react';
import { Slider } from '../../../shared/components/Slider';

interface MeshRollCalculatorProps {
  selectedVariant: '110' | '130';
}

export const MeshRollCalculator: React.FC<MeshRollCalculatorProps> = ({
  selectedVariant,
}) => {
  const [greenhouseAreaM2, setGreenhouseAreaM2] = useState<number>(1000);

  // Cálculo de rollos comerciales (4m × 100m = 400 m² por rollo)
  // Regla Quíbor: 1.000 m² de nave requiere 8 rollos por faldas y solapes (factor 3.2 m² de malla por m² de suelo)
  const rollAreaM2 = 400;
  const factorMalla = 3.2;
  const requiredMeshAreaM2 = greenhouseAreaM2 * factorMalla;
  const numRolls = Math.ceil(requiredMeshAreaM2 / rollAreaM2);

  const is110 = selectedVariant === '110';

  const waMessage = encodeURIComponent(
    `Hola Agrovenecua, solicito cotización para Malla Antiáfido 50 Mesh en el Valle de Quíbor:\n` +
    `• Variante: ${is110 ? '110 gsm (Tomate Hilo Alto)' : '130 gsm (Pimentón / Alta Tenacidad - $560 USD/rollo efectivo)'}\n` +
    `• Área de Nave: ${greenhouseAreaM2} m²\n` +
    `• Rollos Estimados: ${numRolls} rollos de 4m × 100m\n` +
    `Por favor confirmar disponibilidad y tiempos de entrega.`
  );

  return (
    <div className="card card-agro p-4 p-md-5">
      <div className="row g-4 align-items-center">
        <div className="col-12 col-lg-6">
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-success ms-md">calculate</span>
            <h3 className="fs-5 fw-bold text-dark mb-0">Calculadora de Cobertura</h3>
          </div>
          <p className="text-secondary small mb-4">
            Ajusta los metros cuadrados de tu casa de malla para estimar el número de rollos comerciales (4.00 m × 100 m = 400 m²).
          </p>

          <Slider
            label="Superficie de la Nave (Suelo):"
            value={greenhouseAreaM2}
            min={500}
            max={5000}
            step={250}
            formatValue={(v) => `${v.toLocaleString()} m²`}
            accentColor="success"
            iconName="square_foot"
            onChange={setGreenhouseAreaM2}
          />
        </div>

        <div className="col-12 col-lg-6">
          <div className="p-4 bg-light rounded-3 border border-secondary-subtle">
            <div className="row g-3 mb-4">
              <div className="col-6">
                <div className="text-secondary text-xs mb-1">Malla Total con Solapes</div>
                <div className="fs-3 fw-bold font-mono text-dark">
                  {requiredMeshAreaM2.toLocaleString()} <span className="fs-6 text-secondary">m²</span>
                </div>
              </div>
              <div className="col-6">
                <div className="text-secondary text-xs mb-1">Rollos Requeridos</div>
                <div className="fs-3 fw-bold font-mono text-success">
                  {numRolls} <span className="fs-6 text-secondary">Rollos</span>
                </div>
              </div>
            </div>

            <a
              href={`https://wa.me/584160000000?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-success btn-lg w-100 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2 shadow"
            >
              <span className="material-symbols-outlined ms-sm">chat</span>
              <span>Solicitar Cotización ({numRolls} Rollos)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
