import React from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const FunnelHero: React.FC = () => {
  return (
    <section className="landing-hero-dark py-5 position-relative">
      {/* Patrón de malla bioclimática 50 mesh */}
      <div className="mesh-pattern-overlay" />

      <Container fluid="xl" className="position-relative py-4" style={{ zIndex: 1 }}>
        <Row className="g-5 align-items-center">
          <Col xs={12} lg={7}>
            {/* Tag de georreferenciación oficial */}
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill bg-success bg-opacity-20 border border-success border-opacity-40 text-xs fw-bold text-uppercase mb-3 shadow-sm" style={{ color: '#53C942' }}>
              <span className="material-symbols-outlined ms-sm" style={{ color: '#53C942' }}>verified</span>
              <span>Oportunidad de Inversión Agrícola · Valle de Quíbor, Lara</span>
            </div>

            <h1 className="display-4 fw-black text-white tracking-tight lh-sm mb-3">
              Invierte en Alta Rentabilidad: <span style={{ color: '#53C942' }}>1.000 m² de Pimentón Magistral</span> en Casa de Malla
            </h1>

            <p className="lead text-light text-opacity-90 fs-6 mb-4">
              En el Valle de Quíbor, el cultivo a campo abierto sufre hasta un <strong className="text-danger">60% de pérdidas</strong> por virosis de mosca blanca y bochorno. Producir bajo una <strong className="text-white">casa de malla de 3.0 m</strong> con <strong className="text-white">espaldar Hortomalla</strong> y <strong className="text-white">fertirriego hidrosoluble</strong> asegura <strong style={{ color: '#53C942' }}>17.500 kg (875 cestas Lujo Grande)</strong> con 3.500 plantas y un retorno superior al <strong>100% de ROI</strong> en 5 meses.
            </p>

            {/* Micro-puntos de valor agronómico del RAG */}
            <div className="row g-2 mb-4">
              <div className="col-sm-6">
                <div className="p-2.5 rounded-3 bg-black bg-opacity-40 border border-white border-opacity-10 d-flex align-items-center gap-2 text-xs text-light">
                  <span className="material-symbols-outlined text-success ms-sm">grid_4x4</span>
                  <span><strong>Malla 50 Mesh 130 gsm:</strong> 100% libre de virosis</span>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="p-2.5 rounded-3 bg-black bg-opacity-40 border border-white border-opacity-10 d-flex align-items-center gap-2 text-xs text-light">
                  <span className="material-symbols-outlined text-info ms-sm">format_line_spacing</span>
                  <span><strong>Espaldar Hortomalla 15×15:</strong> -88% mano de obra</span>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="p-2.5 rounded-3 bg-black bg-opacity-40 border border-white border-opacity-10 d-flex align-items-center gap-2 text-xs text-light">
                  <span className="material-symbols-outlined text-warning ms-sm">science</span>
                  <span><strong>Sales Hidrosolubles AIFA:</strong> Nutrición pura</span>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="p-2.5 rounded-3 bg-black bg-opacity-40 border border-white border-opacity-10 d-flex align-items-center gap-2 text-xs text-light">
                  <span className="material-symbols-outlined text-success ms-sm">payments</span>
                  <span><strong>$15 USD / Cesta (20 kg):</strong> Venta puerta finca</span>
                </div>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-3 mb-4">
              <Button
                as="a"
                href="#financiero"
                variant="success"
                size="lg"
                className="touch-target-48 rounded-pill fw-bold px-4 d-inline-flex align-items-center gap-2 shadow text-white"
                style={{
                  background: 'linear-gradient(135deg, #53C942 0%, #248a15 100%)',
                  border: 'none'
                }}
              >
                <span className="material-symbols-outlined ms-sm">trending_up</span>
                <span>Simular Retorno ($15/Cesta)</span>
              </Button>

              <Link
                to="/cockpit"
                className="btn btn-outline-light btn-lg touch-target-48 rounded-pill fw-bold px-4 d-inline-flex align-items-center gap-2"
              >
                <span className="material-symbols-outlined ms-sm">speed</span>
                <span>Cockpit Técnico Quíbor</span>
              </Link>
            </div>

            {/* Georreferenciación Exacta de Quíbor (AGENTS.md) */}
            <div className="d-flex flex-wrap align-items-center gap-3 text-xs text-light text-opacity-75 font-monospace border-top border-white border-opacity-10 pt-3">
              <div className="d-flex align-items-center gap-1.5">
                <span className="material-symbols-outlined text-success ms-sm">location_on</span>
                <span>9°53'20.0"N 69°35'35.0"W</span>
              </div>
              <div className="d-flex align-items-center gap-1.5">
                <span className="material-symbols-outlined text-success ms-sm">height</span>
                <span>Cota 695–710 msnm</span>
              </div>
              <div className="d-flex align-items-center gap-1.5">
                <span className="material-symbols-outlined text-info ms-sm">air</span>
                <span>Viento Este (88% freq)</span>
              </div>
              <div className="d-flex align-items-center gap-1.5">
                <span className="material-symbols-outlined text-warning ms-sm">vertical_align_top</span>
                <span>Altura 3.0 m (Óptima Pimentón)</span>
              </div>
            </div>
          </Col>

          {/* Tarjeta Ejecutiva de Inversión y Producción */}
          <Col xs={12} lg={5}>
            <Card className="glass-card-dark p-4 shadow-lg position-relative overflow-hidden">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Badge bg="success" className="bg-opacity-25 text-white border border-success border-opacity-40 rounded-pill font-monospace px-3 py-1">
                  Módulo 1.000 m² Tecnificado
                </Badge>
                <span className="text-white-50 font-monospace text-xs">
                  Ciclo: 5 Meses (20 sem)
                </span>
              </div>

              {/* KPI Principal: Retorno / Ganancia */}
              <div className="mb-3">
                <div className="text-uppercase text-xs tracking-wider fw-bold text-white-50">
                  Ingreso Bruto Proyectado (875 Cestas)
                </div>
                <div className="display-5 fw-bold font-mono text-white mb-0">
                  $13.125 <span className="fs-6 text-white-50">USD / ciclo</span>
                </div>
                <div className="text-xs text-light text-opacity-75 mt-1">
                  A precio referencial auditado de <strong style={{ color: '#53C942' }}>$15 USD / cesta (20 kg)</strong> puerta de invernadero.
                </div>
              </div>

              {/* Ficha cuantitativa de la Nave */}
              <div className="p-3 bg-black bg-opacity-50 rounded-3 border border-white border-opacity-10 mb-3 text-xs">
                <div className="d-flex justify-content-between align-items-center py-1.5 border-bottom border-white border-opacity-10">
                  <span className="text-white-50 d-flex align-items-center gap-1.5">
                    <span className="material-symbols-outlined text-success fs-6">potted_plant</span>
                    <span>Plántulas Magistral F1:</span>
                  </span>
                  <strong className="font-mono text-white">3.500 plantas (3.5 pl/m²)</strong>
                </div>

                <div className="d-flex justify-content-between align-items-center py-1.5 border-bottom border-white border-opacity-10">
                  <span className="text-white-50 d-flex align-items-center gap-1.5">
                    <span className="material-symbols-outlined text-info fs-6">scale</span>
                    <span>Rendimiento Unitario:</span>
                  </span>
                  <strong className="font-mono text-white">5,0 kg / planta con espaldar</strong>
                </div>

                <div className="d-flex justify-content-between align-items-center py-1.5 border-bottom border-white border-opacity-10">
                  <span className="text-white-50 d-flex align-items-center gap-1.5">
                    <span className="material-symbols-outlined text-warning fs-6">inventory_2</span>
                    <span>Producción Comercial Neta:</span>
                  </span>
                  <strong className="font-mono text-white" style={{ color: '#53C942' }}>17.500 kg (875 Cestas)</strong>
                </div>

                <div className="d-flex justify-content-between align-items-center py-1.5 border-bottom border-white border-opacity-10">
                  <span className="text-white-50 d-flex align-items-center gap-1.5">
                    <span className="material-symbols-outlined text-info fs-6">water_drop</span>
                    <span>Agua (Cisternas 10.000 L):</span>
                  </span>
                  <strong className="font-mono text-white">92 – 93 viajes ($1.380 USD)</strong>
                </div>

                <div className="d-flex justify-content-between align-items-center py-1.5 border-bottom border-white border-opacity-10">
                  <span className="text-white-50 d-flex align-items-center gap-1.5">
                    <span className="material-symbols-outlined text-danger fs-6">savings</span>
                    <span>Costos Operativos Ciclo:</span>
                  </span>
                  <strong className="font-mono text-white">$2.700 USD (Agua + Insumos)</strong>
                </div>

                <div className="d-flex justify-content-between align-items-center pt-1.5">
                  <span className="text-white-50 d-flex align-items-center gap-1.5">
                    <span className="material-symbols-outlined text-success fs-6">paid</span>
                    <span>Utilidad Neta Ciclo:</span>
                  </span>
                  <strong className="font-mono fw-bold fs-6" style={{ color: '#53C942' }}>$10.425 USD</strong>
                </div>
              </div>

              {/* Comparativa rápida de inversión */}
              <div className="p-3 rounded-3 border border-success border-opacity-30 bg-success bg-opacity-10">
                <Row className="g-2 text-center text-xs">
                  <Col xs={4}>
                    <span className="text-white-50 d-block text-xxs">Inversión Inicial:</span>
                    <strong className="fs-6 font-mono text-white">$4.845</strong>
                  </Col>
                  <Col xs={4}>
                    <span className="text-white-50 d-block text-xxs">ROI por Ciclo:</span>
                    <strong className="fs-6 font-mono" style={{ color: '#53C942' }}>+215%</strong>
                  </Col>
                  <Col xs={4}>
                    <span className="text-white-50 d-block text-xxs">Recuperación:</span>
                    <strong className="fs-6 font-mono text-info">5 Meses</strong>
                  </Col>
                </Row>
              </div>

              <div className="mt-3 text-center">
                <a
                  href="#financiero"
                  className="text-decoration-none text-xs fw-bold d-inline-flex align-items-center gap-1"
                  style={{ color: '#53C942' }}
                >
                  <span>Ver simulador interactivo y desglose completo</span>
                  <span className="material-symbols-outlined ms-sm">arrow_downward</span>
                </a>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
export default FunnelHero;
