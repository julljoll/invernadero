import React from 'react';
import { Table } from 'react-bootstrap';

export const FinancialMatrix: React.FC = () => {
  const comparisonData = [
    {
      param: 'Inversión Total (CAPEX)',
      artesanal: '$4.000 USD',
      mecanico: '$24.880 USD',
      benefit: 'Ahorro neto de $20.880 USD (84% menos)',
      highlight: true,
      badge: 'AHORRO 84%',
      badgeVariant: 'success',
    },
    {
      param: 'Riesgo Geológico',
      artesanal: 'CERO (Acuífero visible a 49.5m)',
      mecanico: 'ALTO (Riesgo de barreno seco)',
      benefit: 'Certeza absoluta de agua comprobada',
      highlight: true,
      badge: 'RIESGO CERO',
      badgeVariant: 'info',
    },
    {
      param: 'Tiempo de Ejecución',
      artesanal: '10 a 12 días continuos',
      mecanico: '60 a 90 días (permisología + taladro)',
      benefit: 'Puesta en marcha 2 meses más rápida',
      highlight: false,
    },
    {
      param: 'Aprovechamiento de Activo',
      artesanal: 'Aprovecha 83% ejecutado (50 m fuste)',
      mecanico: 'Abandono total del activo existente',
      benefit: 'Eficiencia patrimonial y de capital',
      highlight: false,
    },
    {
      param: 'Equipamiento Mecánico',
      artesanal: 'Martillo eléctrico industrial ($1.000)',
      mecanico: 'Renta de taladro petrolero rotatorio',
      benefit: 'Activo fijo durable que queda en finca',
      highlight: false,
    },
    {
      param: 'Volumen Buffer en Fuste',
      artesanal: '~8.240 L en reposo (Ø 1.0 m)',
      mecanico: '~750 L en camisa (Ø 6"-8")',
      benefit: '11× mayor inercia de amortiguamiento',
      highlight: false,
    },
    {
      param: 'Suministro Eléctrico',
      artesanal: 'Poste comercial existente al pie del pozo',
      mecanico: 'Demanda planta diésel trifásica pesada',
      benefit: 'Cero gasto en flete o combustible diésel',
      highlight: false,
    },
    {
      param: 'Aptitud Agronómica Pimentón',
      artesanal: '2.0 L/s sostenido (7.200 L/h)',
      mecanico: '2.5 a 3.2 L/s continuo',
      benefit: 'Cubre 100% de la demanda de 2.500 plantas',
      highlight: true,
      badge: '100% VIABLE',
      badgeVariant: 'success',
    },
  ];

  return (
    <div className="card-cockpit shadow-sm border-0 overflow-hidden mb-4">
      <div className="bg-white border-bottom py-3 px-4 d-flex flex-wrap justify-content-between align-items-center gap-2">
        <div>
          <div className="d-inline-flex align-items-center gap-1.5 px-2.5 py-1 rounded-pill bg-agro-success-soft text-success text-xs fw-bold text-uppercase mb-1 border border-success border-opacity-20">
            <span className="material-symbols-outlined fs-6">balance</span>
            <span>Matriz de Decisión de Capital · Finca La Cigarronera</span>
          </div>
          <h4 className="fs-5 fw-bold text-dark mb-0">
            Culminación Artesanal (60m) vs. Perforación Mecánica Nueva (120m)
          </h4>
        </div>
        <span className="badge bg-agro-success-soft text-success border border-success border-opacity-30 p-2.5 px-3.5 rounded-pill font-mono fs-6 shadow-xs">
          Ahorro Neto: $20.880 USD
        </span>
      </div>

      <div className="table-responsive">
        <Table hover className="align-middle mb-0 text-sm">
          <thead className="table-light text-secondary text-uppercase text-xxs tracking-wider">
            <tr>
              <th className="py-3 px-4" style={{ width: '25%' }}>Parámetro de Evaluación</th>
              <th className="py-3 px-3 text-info bg-agro-info-soft border-start border-end border-info border-opacity-20" style={{ width: '25%' }}>
                Opción A: Culminación Artesanal (50m ➔ 60m)
              </th>
              <th className="py-3 px-3 text-secondary" style={{ width: '25%' }}>
                Opción B: Perforación Mecánica (120m Ø 12")
              </th>
              <th className="py-3 px-4 text-success" style={{ width: '25%' }}>
                Diferencial de Valor / Retorno
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((row, idx) => (
              <tr key={idx} className={row.highlight ? 'bg-agro-success-soft bg-opacity-25' : ''}>
                <td className="py-3 px-4 fw-semibold text-dark">
                  <div className="d-flex align-items-center gap-2">
                    <span>{row.param}</span>
                    {row.badge && (
                      <span className={`badge ${
                        row.badgeVariant === 'success' 
                          ? 'bg-agro-success-soft text-success border border-success border-opacity-30' 
                          : 'bg-agro-info-soft text-info border border-info border-opacity-30'
                      } text-xxs px-2 py-0.5 rounded-pill font-mono`}>
                        {row.badge}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-3 text-info fw-bold bg-agro-info-soft border-start border-end border-info border-opacity-10 font-mono">
                  {row.artesanal}
                </td>
                <td className="py-3 px-3 text-secondary font-mono text-muted">
                  {row.mecanico}
                </td>
                <td className="py-3 px-4 text-success fw-semibold">
                  <div className="d-flex align-items-center gap-1.5">
                    <span className="material-symbols-outlined fs-6 text-success">check_circle</span>
                    <span>{row.benefit}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="bg-light bg-opacity-70 p-3 px-4 border-top text-xs text-secondary d-flex flex-wrap justify-content-between align-items-center gap-2">
        <div className="d-flex align-items-center gap-1.5">
          <span className="material-symbols-outlined text-info fs-5">info</span>
          <span>
            Los $20.880 USD liberados financian la totalidad de los materiales de la nave de 1.000 m² (malla 50 mesh, postes, guayas y fertirriego).
          </span>
        </div>
        <span className="badge bg-white text-secondary border font-mono">Fuente: Memoria Hidrogeológica Cuara 2026</span>
      </div>
    </div>
  );
};
