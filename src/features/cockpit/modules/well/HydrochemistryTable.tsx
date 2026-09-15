import React from 'react';
import { Card, Table, Badge, Row, Col, Alert } from 'react-bootstrap';

export interface WaterParam {
  param: string;
  symbol: string;
  measuredValue: string;
  numericVal: number;
  unit: string;
  agronomicThreshold: string;
  status: 'optimum' | 'caution' | 'danger';
  impact: string;
  correction: string;
}

export const HydrochemistryTable: React.FC = () => {
  const params: WaterParam[] = [
    {
      param: 'Conductividad Eléctrica',
      symbol: 'CE (EC_w)',
      measuredValue: '1.50',
      numericVal: 1.5,
      unit: 'dS/m',
      agronomicThreshold: '< 1.5 dS/m (Pimentón)',
      status: 'caution',
      impact: 'Salinidad moderada típica de pozos de Quíbor; induce estrés osmótico si el bulbo se seca.',
      correction: 'Aplicar Fracción de Lavado (LF) del 20% al 25% en cada pulso de riego (FAO-56).'
    },
    {
      param: 'Potencial de Hidrógeno',
      symbol: 'pH',
      measuredValue: '7.40',
      numericVal: 7.4,
      unit: 'Unidades',
      agronomicThreshold: '5.8 – 6.5 (Óptimo goteo)',
      status: 'caution',
      impact: 'Alcalinidad leve que reduce la solubilidad de microelementos (Fe, Zn, Mn) y precipita fósforo.',
      correction: 'Acidificar agua de riego en Tanque C con Ácido Nítrico (HNO₃ 55%) hasta pH 6.0 - 6.2.'
    },
    {
      param: 'Relación de Adsorción de Sodio',
      symbol: 'RAS (SAR)',
      measuredValue: '4.20',
      numericVal: 4.2,
      unit: '(meq/L)⁰˙⁵',
      agronomicThreshold: '< 6.0 (Sin riesgo de sodificación)',
      status: 'optimum',
      impact: 'Excelente equilibrio Ca²⁺/Na⁺; la estructura física del suelo arcilloso no sufrirá dispersión.',
      correction: 'No requiere enmiendas con yeso agrícola en este rango.'
    },
    {
      param: 'Cloruros Libres',
      symbol: 'Cl⁻',
      measuredValue: '3.80',
      numericVal: 3.8,
      unit: 'meq/L (135 ppm)',
      agronomicThreshold: '< 4.0 meq/L (Sensibilidad en Capsicum)',
      status: 'caution',
      impact: 'Cercano al límite de toxicidad foliar por acumulación en bordes de hojas viejas.',
      correction: 'Mantener humedad de bulbo > 80% capacidad de campo para evitar concentración de sales.'
    },
    {
      param: 'Bicarbonatos',
      symbol: 'HCO₃⁻',
      measuredValue: '4.50',
      numericVal: 4.5,
      unit: 'meq/L (275 ppm)',
      agronomicThreshold: '< 1.5 meq/L en goteo',
      status: 'caution',
      impact: 'Riesgo alto de obturación química en laberintos de goteros por carbonato de calcio (incrustaciones).',
      correction: 'Inyección de 0.28 L de HNO₃ 55% por cada m³ de agua para destruir 3.5 meq/L de bicarbonato.'
    },
    {
      param: 'Boro Asimilable',
      symbol: 'B',
      measuredValue: '0.35',
      numericVal: 0.35,
      unit: 'mg/L (ppm)',
      agronomicThreshold: '< 0.75 mg/L',
      status: 'optimum',
      impact: 'Nivel seguro. El pimentón tolera hasta 0.8 ppm antes de mostrar clorosis marginal.',
      correction: 'Monitoreo semestral en aforos de estación seca.'
    },
    {
      param: 'Dureza Total (CaCO₃)',
      symbol: 'Dureza',
      measuredValue: '285',
      numericVal: 285,
      unit: 'mg/L',
      agronomicThreshold: '< 300 mg/L',
      status: 'optimum',
      impact: 'Agua moderadamente dura con aporte natural de Calcio (Ca²⁺ ~75 ppm) y Magnesio (Mg²⁺ ~24 ppm).',
      correction: 'Descontar el Ca y Mg nativo del agua en el cálculo de fertilización del Tanque A.'
    }
  ];

  return (
    <Card className="border-0 shadow-sm bg-light">
      <Card.Body className="p-3">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-2">
          <div className="d-flex align-items-center gap-2">
            <span className="material-symbols-outlined text-success fs-5">biotech</span>
            <span className="fw-bold text-dark small">Caracterización Hidroquímica & Aptitud Agronómica (FAO-29)</span>
          </div>
          <Badge bg="success" className="text-xs">
            Apta para Horticultura Protegida con Manejo
          </Badge>
        </div>

        <p className="text-secondary text-xs mb-3">
          Parámetros fisicoquímicos del agua subterránea de Cuara (Valle de Quíbor) y su impacto en la nutrición del pimentón y tomate.
        </p>

        <div className="table-responsive bg-white rounded border shadow-xs mb-3">
          <Table hover size="sm" className="mb-0 text-xs align-middle">
            <thead className="table-light">
              <tr>
                <th className="py-2">Parámetro</th>
                <th className="py-2">Símbolo</th>
                <th className="py-2 text-center">Valor Medido</th>
                <th className="py-2">Umbral Tolerancia</th>
                <th className="py-2 text-center">Diagnóstico</th>
                <th className="py-2">Protocolo Agronómico de Manejo</th>
              </tr>
            </thead>
            <tbody>
              {params.map((item, idx) => (
                <tr key={idx}>
                  <td className="fw-bold text-dark">{item.param}</td>
                  <td className="font-monospace text-secondary">{item.symbol}</td>
                  <td className="text-center font-monospace fw-bold">
                    {item.measuredValue} <span className="text-muted text-2xs">{item.unit}</span>
                  </td>
                  <td className="text-secondary">{item.agronomicThreshold}</td>
                  <td className="text-center">
                    <Badge
                      bg={
                        item.status === 'optimum'
                          ? 'success'
                          : item.status === 'caution'
                          ? 'warning'
                          : 'danger'
                      }
                      className="text-2xs px-2"
                    >
                      {item.status === 'optimum'
                        ? 'Óptimo'
                        : item.status === 'caution'
                        ? 'Manejo Requ.'
                        : 'Crítico'}
                    </Badge>
                  </td>
                  <td className="text-dark-emphasis text-2xs">{item.correction}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Resumen Operativo de Fertirriego */}
        <Row className="g-2 text-xs">
          <Col xs={12} md={6}>
            <Alert variant="warning" className="p-2 mb-0 d-flex gap-2 align-items-start border">
              <span className="material-symbols-outlined text-warning fs-5">warning</span>
              <div>
                <strong>Ajuste de Salinidad (CEw 1.5 dS/m):</strong>
                <p className="mb-0 text-2xs mt-1">
                  El agua de pozo aporta sales disueltas que exigen una lámina adicional de lixiviación (LF = 20-25%). Para 1.000 m², la demanda bruta pasa de 6.0 a 7.5 m³/día para lavar los cloruros de la rizosfera activa.
                </p>
              </div>
            </Alert>
          </Col>
          <Col xs={12} md={6}>
            <Alert variant="success" className="p-2 mb-0 d-flex gap-2 align-items-start border">
              <span className="material-symbols-outlined text-success fs-5">check_circle</span>
              <div>
                <strong>Ahorro en Fertilizantes Cálcicos:</strong>
                <p className="mb-0 text-2xs mt-1">
                  El agua contiene ~75 mg/L de Ca²⁺ nativo. En un consumo de 7.5 m³/día, el pozo aporta naturalmente <strong>562 gramos de calcio puro al día</strong> (~3.2 kg diarios de Nitrato de Calcio equivalentes), ahorrando fertilizante base.
                </p>
              </div>
            </Alert>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};
