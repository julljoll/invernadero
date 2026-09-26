import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const FunnelHero: React.FC = () => {
  return (
    <section className="position-relative overflow-hidden" style={{ backgroundColor: '#0f172a', minHeight: '90vh', paddingTop: '10vh' }}>
      <Container fluid="xl" className="position-relative h-100" style={{ zIndex: 1 }}>
        <Row className="g-5 align-items-center h-100">
          <Col xs={12} lg={6} className="py-5">
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill bg-success bg-opacity-10 border border-success border-opacity-25 text-xs fw-bold text-uppercase mb-4" style={{ color: '#53C942' }}>
              <span className="material-symbols-outlined ms-sm" style={{ color: '#53C942' }}>verified</span>
              <span>Quíbor, Lara · 695 msnm</span>
            </div>

            <h1 className="display-3 fw-bold text-white tracking-tight lh-sm mb-4">
              Ingeniería Agrícola de <br/>
              <span style={{ color: '#53C942' }}>Alta Precisión</span>
            </h1>

            <p className="lead text-secondary fs-5 mb-5 fw-light" style={{ maxWidth: '540px' }}>
              Proyecta, simula y controla estructuras protegidas para cultivo intensivo en el Valle de Quíbor. Toma decisiones basadas en datos climáticos reales y diseño estructural avanzado.
            </p>

            <div className="d-flex flex-wrap gap-3 mb-5">
              <Link
                to="/cockpit"
                className="btn btn-success btn-lg touch-target-48 rounded-pill fw-bold px-4 d-inline-flex align-items-center gap-2 shadow-lg text-white"
                style={{
                  background: 'linear-gradient(135deg, #53C942 0%, #248a15 100%)',
                  border: 'none'
                }}
              >
                <span className="material-symbols-outlined ms-sm">speed</span>
                <span>Ingresar al Cockpit</span>
              </Link>

              <Link
                to="/vivero-cad"
                className="btn btn-outline-light btn-lg touch-target-48 rounded-pill fw-bold px-4 d-inline-flex align-items-center gap-2"
              >
                <span className="material-symbols-outlined ms-sm">3d_rotation</span>
                <span>Visor CAD</span>
              </Link>
            </div>

            <div className="d-flex flex-wrap align-items-center gap-4 text-xs text-secondary font-monospace pt-2">
              <div className="d-flex align-items-center gap-2">
                <span className="material-symbols-outlined fs-6 text-success">eco</span>
                <span>Malla 50 Mesh</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="material-symbols-outlined fs-6 text-success">analytics</span>
                <span>Datos Térmicos</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="material-symbols-outlined fs-6 text-success">architecture</span>
                <span>Cálculo Estructural</span>
              </div>
            </div>
          </Col>

          <Col xs={12} lg={6} className="position-relative d-none d-lg-block h-100">
            {/* Espacio reservado para Render CAD Abstracto o Modelo 3D */}
            <div className="w-100 h-100 d-flex justify-content-center align-items-center" style={{ minHeight: '600px' }}>
               <div className="position-absolute top-50 start-50 translate-middle w-100 h-100 rounded-circle" style={{
                 background: 'radial-gradient(circle, rgba(83, 201, 66, 0.1) 0%, rgba(15, 23, 42, 0) 70%)',
                 filter: 'blur(40px)',
                 zIndex: -1
               }}></div>
               <img src="/plano_3d_invernadero_quibor.svg" alt="Render Arquitectónico" className="img-fluid" style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5)) opacity(0.8)', mixBlendMode: 'screen' }} />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
export default FunnelHero;
