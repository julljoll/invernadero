import React from 'react';
import { Card, Badge, Table, Row, Col } from 'react-bootstrap';

export const DliSolarPanel: React.FC = () => {
  const dliMonthlyData = [
    { mes: 'Ene', exteriorDli: 34.2, meshDli: 28.0, ppfd: 1080, status: 'Óptimo' },
    { mes: 'Feb', exteriorDli: 37.5, meshDli: 30.8, ppfd: 1150, status: 'Óptimo' },
    { mes: 'Mar', exteriorDli: 41.2, meshDli: 33.8, ppfd: 1280, status: 'Pico Solar' },
    { mes: 'Abr', exteriorDli: 38.6, meshDli: 31.6, ppfd: 1200, status: 'Óptimo' },
    { mes: 'May', exteriorDli: 35.1, meshDli: 28.8, ppfd: 1100, status: 'Óptimo' },
    { mes: 'Jun', exteriorDli: 33.8, meshDli: 27.7, ppfd: 1050, status: 'Óptimo' },
    { mes: 'Jul', exteriorDli: 36.4, meshDli: 29.8, ppfd: 1120, status: 'Óptimo' },
    { mes: 'Ago', exteriorDli: 38.0, meshDli: 31.2, ppfd: 1180, status: 'Óptimo' },
    { mes: 'Sep', exteriorDli: 37.2, meshDli: 30.5, ppfd: 1160, status: 'Óptimo' },
    { mes: 'Oct', exteriorDli: 33.5, meshDli: 27.5, ppfd: 1040, status: 'Óptimo' },
    { mes: 'Nov', exteriorDli: 31.8, meshDli: 26.1, ppfd: 990, status: 'Óptimo' },
    { mes: 'Dic', exteriorDli: 32.5, meshDli: 26.7, ppfd: 1020, status: 'Óptimo' }
  ];

  return (
    <Card className="border-0 shadow-sm bg-light">
      <Card.Body className="p-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="d-flex align-items-center gap-2">
            <span className="material-symbols-outlined text-warning fs-5">wb_sunny</span>
            <span className="fw-bold text-dark small">Integral de Luz Diaria (DLI) & Radiación Fotosintética (PAR)</span>
          </div>
          <Badge bg="success" className="text-2xs">
            Zona Fotosintética Óptima (25 - 35 mol/m²/d)
          </Badge>
        </div>

        <p className="text-secondary text-2xs mb-3">
          El DLI mide la cantidad total de fotones útiles para fotosíntesis (400-700 nm) que reciben las hojas al día. La malla 50 mesh blanca (110 gsm) difunde la luz y reduce el estrés por quemadura foliar en los meses cálidos.
        </p>

        <Row className="g-2 mb-3 text-2xs">
          <Col xs={12} sm={4}>
            <div className="p-2 bg-white rounded border">
              <span className="text-muted d-block">DLI Promedio Quíbor Exterior:</span>
              <strong className="fs-6 text-warning-emphasis font-monospace">~36.0</strong>
              <span className="text-muted text-3xs ms-1">mol/m²/día</span>
            </div>
          </Col>
          <Col xs={12} sm={4}>
            <div className="p-2 bg-white rounded border border-success border-opacity-50">
              <span className="text-muted d-block">DLI Interior Bajo Malla 50 Mesh:</span>
              <strong className="fs-6 text-success font-monospace">~29.5</strong>
              <span className="text-muted text-3xs ms-1">mol/m²/día (-18% directo, +45% difuso)</span>
            </div>
          </Col>
          <Col xs={12} sm={4}>
            <div className="p-2 bg-white rounded border">
              <span className="text-muted d-block">Requerimiento Capsicum / Tomate:</span>
              <strong className="fs-6 text-primary font-monospace">22 a 32</strong>
              <span className="text-muted text-3xs ms-1">mol/m²/día (100% cubierto)</span>
            </div>
          </Col>
        </Row>

        <div className="table-responsive bg-white rounded border shadow-xs">
          <Table hover size="sm" className="mb-0 text-xs align-middle">
            <thead className="table-light">
              <tr>
                <th className="py-1">Mes</th>
                <th className="py-1 text-center">DLI Exterior (mol/m²/d)</th>
                <th className="py-1 text-center">DLI Bajo Malla (mol/m²/d)</th>
                <th className="py-1 text-center">PPFD Mediodía (µmol/m²/s)</th>
                <th className="py-1 text-center">Estado Agronómico</th>
              </tr>
            </thead>
            <tbody>
              {dliMonthlyData.map((d, idx) => (
                <tr key={idx}>
                  <td className="fw-bold text-dark py-1">{d.mes}</td>
                  <td className="text-center font-monospace py-1">{d.exteriorDli}</td>
                  <td className="text-center font-monospace fw-bold text-success py-1">{d.meshDli}</td>
                  <td className="text-center font-monospace py-1">{d.ppfd}</td>
                  <td className="text-center py-1">
                    <Badge bg={d.status === 'Pico Solar' ? 'warning' : 'success'} className="text-3xs">
                      {d.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};
