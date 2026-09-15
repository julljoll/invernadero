import React from 'react';
import { Container, Row, Col, Card, Badge, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const FunnelTechEvidence: React.FC = () => {
  return (
    <section id="evidencia-tecnica" className="py-5 bg-white border-top border-secondary border-opacity-15">
      <Container fluid="xl" className="py-3">
        {/* Encabezado de Sección */}
        <div className="text-center max-w-2xl mx-auto mb-5">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-success bg-opacity-10 border border-success border-opacity-25 text-success text-xs fw-bold text-uppercase mb-2">
            <span className="material-symbols-outlined ms-sm">architecture</span>
            <span>Auditoría de Ingeniería &amp; Evidencia Científica</span>
          </div>
          <h2 className="display-6 fw-bold text-dark mb-2">
            Fundamentos de Ingeniería de la Nave de 1.000 m²
          </h2>
          <p className="text-secondary small max-w-xl mx-auto m-0">
            Cada cifra de producción está respaldada por planos 2D acotados, telemetría climatológica NASA MERRA-2 y modelos hidrogeológicos del pozo profundo en Cuara.
          </p>
        </div>

        <Row className="g-4 align-items-stretch mb-4">
          {/* Columna 1: Plano 2D Arquitectónico */}
          <Col xs={12} lg={7}>
            <Card className="card-agro p-4 h-100 shadow-sm border bg-white d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <span className="material-symbols-outlined text-success">floorplan</span>
                    <h4 className="fs-5 fw-bold text-dark m-0">Plano Técnico Acotado (20m × 50m)</h4>
                  </div>
                  <Badge bg="success" className="bg-opacity-15 text-success border border-success border-opacity-25 font-mono text-xxs">
                    Escala 1:1 · 2.500 Goteros
                  </Badge>
                </div>

                <p className="text-secondary text-xs mb-3">
                  Distribución geométrica de 10 camellones dobles a 2.00m entre ejes, 20 hileras de 50m y sincronía 1:1 entre gotero autocompensante PC/AS de 1.60 L/h y planta de pimentón.
                </p>

                {/* Contenedor del plano SVG interactivo */}
                <div
                  className="rounded-3 overflow-hidden border border-secondary border-opacity-25 bg-light p-2 text-center position-relative mb-3"
                  style={{ maxHeight: '340px' }}
                >
                  <img
                    src="/plano_2d_invernadero_quibor.svg"
                    alt="Plano 2D Casa de Malla Quíbor 1.000 m²"
                    className="img-fluid rounded"
                    style={{ maxHeight: '310px', objectFit: 'contain' }}
                    loading="lazy"
                  />
                  <div className="position-absolute bottom-0 end-0 p-2">
                    <a
                      href="/plano_2d_invernadero_quibor.svg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-dark btn-sm rounded-pill py-1 px-2.5 text-xxs d-flex align-items-center gap-1 shadow-sm opacity-90"
                    >
                      <span className="material-symbols-outlined ms-sm">fullscreen</span>
                      <span>Ver Plano Completo</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 pt-3 border-top border-secondary border-opacity-15 text-xxs font-mono text-secondary">
                <span>📐 Alero: 3.00m · Cumbrera: 5.50m</span>
                <span>🌀 8 Extractores Eólicos Cenitales</span>
                <span>💨 Ráfagas: 27 km/h (FS 1.5)</span>
              </div>
            </Card>
          </Col>

          {/* Columna 2: Ficha Técnica de Malla y Clima Quíbor */}
          <Col xs={12} lg={5}>
            <div className="d-flex flex-column gap-4 h-100">
              {/* Card Malla 50 Mesh */}
              <Card className="card-agro p-4 shadow-sm border bg-white flex-grow-1">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="material-symbols-outlined text-success">grid_4x4</span>
                    <h5 className="fw-bold text-dark m-0 fs-6">Malla 50 Mesh Blanca (110 gsm)</h5>
                  </div>
                  <Badge bg="success" className="text-xxs">100% Exclusión</Badge>
                </div>

                <p className="text-secondary text-xs mb-3">
                  Poro calibrado &le; 192 &mu;m con monofilamento virgen HDPE. Bloqueo hermético de vectores biológicos:
                </p>

                <Table size="sm" bordered responsive className="text-xxs font-mono align-middle mb-3">
                  <thead className="table-light">
                    <tr>
                      <th>Vector Plaga</th>
                      <th>Tamaño</th>
                      <th>Retención</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="fw-bold">Mosca Blanca (*B. tabaci*)</td>
                      <td>250 - 300 µm</td>
                      <td className="text-success fw-bold">100% Barrera</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Trips (*F. occidentalis*)</td>
                      <td>200 - 250 µm</td>
                      <td className="text-success fw-bold">100% Barrera</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Pulgones &amp; Minadores</td>
                      <td>&gt; 400 µm</td>
                      <td className="text-success fw-bold">100% Barrera</td>
                    </tr>
                  </tbody>
                </Table>

                <div className="p-2.5 rounded-3 bg-light border text-xxs text-secondary">
                  <strong className="text-dark">Beneficio Térmico:</strong> El color blanco difumina la radiación solar incidente, reduciendo la temperatura pico interna en 2.5°C a 3.0°C respecto a mallas oscuras.
                </div>
              </Card>

              {/* Card Pozo y Acuífero */}
              <Card className="card-agro p-4 shadow-sm border bg-white flex-grow-1">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="material-symbols-outlined text-info">water_ph</span>
                    <h5 className="fw-bold text-dark m-0 fs-6">Acuífero Formación Cuara</h5>
                  </div>
                  <Badge bg="info" className="text-white text-xxs">Pozo 50m / 60m</Badge>
                </div>

                <Row className="g-2 text-xs font-mono my-2">
                  <Col xs={6}>
                    <div className="p-2 rounded bg-light border">
                      <span className="text-muted d-block text-xxs">Nivel Estático:</span>
                      <strong className="text-dark">49.50 m</strong>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="p-2 rounded bg-light border">
                      <span className="text-muted d-block text-xxs">Caudal Aforado:</span>
                      <strong className="text-info">2.50 L/s (9 m³/h)</strong>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="p-2 rounded bg-light border">
                      <span className="text-muted d-block text-xxs">Transmisividad:</span>
                      <strong className="text-dark">180 m²/día</strong>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="p-2 rounded bg-light border">
                      <span className="text-muted d-block text-xxs">Salinidad CEw:</span>
                      <strong className="text-warning">1.45 - 1.65 dS/m</strong>
                    </div>
                  </Col>
                </Row>

                <div className="d-flex gap-2 mt-2">
                  <Link to="/calculo-pozo" className="btn btn-outline-info btn-sm w-100 rounded-pill text-xs fw-bold py-1.5">
                    Calculadora Theis →
                  </Link>
                  <Link to="/cockpit" className="btn btn-outline-success btn-sm w-100 rounded-pill text-xs fw-bold py-1.5">
                    Cockpit Agronómico →
                  </Link>
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
