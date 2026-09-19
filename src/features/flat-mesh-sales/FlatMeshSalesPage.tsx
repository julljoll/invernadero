import React from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { FlatMeshViewer } from '../3d-viewers/MeshViewer/FlatMeshViewer';
import { Link } from 'react-router-dom';
import { AgroCtaBanner } from '../../shared/components/AgroCtaBanner';

export const FlatMeshSalesPage: React.FC = () => {

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-light py-4 py-md-5">
      <Container fluid="xl" className="d-flex flex-column gap-5">
        
        {/* ============================================================ */}
        {/* HERO SECTION DE ALTO IMPACTO                                */}
        {/* ============================================================ */}
        <section className="position-relative overflow-hidden rounded-4 bg-white text-dark p-4 p-md-5 shadow-sm border border-secondary border-opacity-25">
          <Row className="align-items-center g-4">
            <Col xs={12} lg={7}>
              {/* Breadcrumb inline */}
              <div className="mb-4">
                <Link to="/catalogo-invernaderos" className="text-success text-decoration-none text-xs fw-bold font-monospace text-uppercase">
                  <span className="material-symbols-outlined fs-6 align-middle me-1">arrow_back</span>
                  Volver al Catálogo
                </Link>
              </div>

              <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill bg-info bg-opacity-20 border border-info border-opacity-50 text-info text-xs fw-bold text-uppercase mb-3">
                <span className="material-symbols-outlined fs-6">architecture</span>
                <span>Tipología 100% Malla Parral</span>
              </div>

              <h1 className="display-4 fw-bold text-dark tracking-tight mb-3">
                Casa de Malla Plana <span className="text-success">Parral</span>
              </h1>

              <p className="lead text-secondary fs-6 mb-4">
                La solución de ingeniería más eficiente para el clima cálido. <strong>Máxima ventilación cruzada</strong> y difusión solar con un costo estructural optimizado al extremo. Ideal para <strong>Pimentón</strong> y cultivos de porte medio en el Valle de Quíbor.
              </p>

              {/* Indicadores clave rápidos */}
              <Row className="g-3 mb-4">
                <Col xs={6} sm={3}>
                  <div className="p-2.5 bg-light rounded-3 border border-secondary border-opacity-25 text-center">
                    <div className="text-success fs-4 fw-bold font-monospace">100%</div>
                    <div className="text-secondary text-xs">Ventilación</div>
                  </div>
                </Col>
                <Col xs={6} sm={3}>
                  <div className="p-2.5 bg-light rounded-3 border border-secondary border-opacity-25 text-center">
                    <div className="text-success fs-4 fw-bold font-monospace">10-15</div>
                    <div className="text-secondary text-xs">USD / m²</div>
                  </div>
                </Col>
                <Col xs={6} sm={3}>
                  <div className="p-2.5 bg-light rounded-3 border border-secondary border-opacity-25 text-center">
                    <div className="text-success fs-4 fw-bold font-monospace">Z-275</div>
                    <div className="text-secondary text-xs">Galvanizado</div>
                  </div>
                </Col>
                <Col xs={6} sm={3}>
                  <div className="p-2.5 bg-light rounded-3 border border-secondary border-opacity-25 text-center">
                    <div className="text-success fs-4 fw-bold font-monospace">50 M</div>
                    <div className="text-secondary text-xs">Antiáfidos</div>
                  </div>
                </Col>
              </Row>

              <div className="d-flex flex-wrap gap-3">
                <Button
                  variant="info"
                  size="lg"
                  className="rounded-pill px-4 fw-bold d-inline-flex align-items-center gap-2 shadow"
                  onClick={() => scrollToSection('viewer-section')}
                >
                  <span className="material-symbols-outlined fs-5">3d_rotation</span>
                  <span>Explorar Modelo 3D</span>
                </Button>

                <Button
                  variant="outline-light"
                  size="lg"
                  className="rounded-pill px-4 fw-bold d-inline-flex align-items-center gap-2 border-opacity-50"
                  onClick={() => scrollToSection('specs-section')}
                >
                  <span className="material-symbols-outlined fs-5">description</span>
                  <span>Ficha Técnica</span>
                </Button>
              </div>
            </Col>

            <Col xs={12} lg={5}>
              <div className="position-relative">
                <div className="rounded-4 overflow-hidden border border-success border-opacity-40 shadow-sm bg-light">
                   <div className="p-5 text-center d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '380px' }}>
                    <span className="material-symbols-outlined text-success mb-3" style={{ fontSize: '4rem' }}>thermostat</span>
                    <h3 className="text-dark fw-bold">Ingeniería Térmica</h3>
                    <p className="text-secondary small mb-0 px-3">
                      Evacuación convectiva natural sin barreras plásticas. Diseñada para evitar el sobrecalentamiento en climas semiáridos como el de Lara.
                    </p>
                   </div>
                </div>
              </div>
            </Col>
          </Row>
        </section>

        {/* ============================================================ */}
        {/* VISOR 3D SECTION                                            */}
        {/* ============================================================ */}
        <section id="viewer-section" className="bg-white rounded-4 p-4 p-md-5 shadow-sm border border-secondary border-opacity-25">
          <div className="text-center mb-4">
            <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1 font-monospace text-uppercase fw-bold mb-2">Visor Estructural Interactivo</span>
            <h2 className="text-dark fw-bold mb-2">Navega la Estructura Base de 1.000 m²</h2>
            <p className="text-secondary">Usa el ratón para rotar y hacer zoom en el modelo 3D paramétrico.</p>
          </div>
          <div className="shadow-sm rounded-4 overflow-hidden border border-secondary border-opacity-25" style={{ height: '600px', background: '#f8f9fa' }}>
            <FlatMeshViewer widthM={20} lengthM={50} heightM={2.5} />
          </div>
        </section>

        {/* ============================================================ */}
        {/* FICHA TÉCNICA SECTION                                       */}
        {/* ============================================================ */}
        <section id="specs-section">
          <div className="text-center mb-5">
            <span className="badge bg-success bg-opacity-25 text-success rounded-pill px-3 py-1 font-monospace text-uppercase fw-bold mb-2">Ingeniería Aprobada</span>
            <h2 className="fw-bold text-dark">Especificaciones de Clase Mundial</h2>
          </div>
          
          <Row className="g-4">
            <Col md={4}>
              <div className="card h-100 border-0 shadow-sm rounded-4 bg-white p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-info bg-opacity-10 p-3 rounded-circle me-3">
                    <span className="material-symbols-outlined text-info fs-4">settings</span>
                  </div>
                  <h4 className="text-dark fw-bold mb-0">Tubería Universal</h4>
                </div>
                <p className="text-secondary small">Tubo redondo galvanizado en caliente Z-275.</p>
                <ul className="text-secondary list-unstyled text-sm">
                  <li className="mb-2"><span className="material-symbols-outlined text-success fs-6 align-middle me-2">check_circle</span><strong>Perfil:</strong> Ø 2" × 2.3 mm</li>
                  <li className="mb-2"><span className="material-symbols-outlined text-success fs-6 align-middle me-2">check_circle</span><strong>Fluencia (Fy):</strong> 2.530 kgf/cm²</li>
                  <li><span className="material-symbols-outlined text-success fs-6 align-middle me-2">check_circle</span><strong>Durabilidad:</strong> 15-25 años en Quíbor</li>
                </ul>
              </div>
            </Col>
            
            <Col md={4}>
              <div className="card h-100 border-0 shadow-sm rounded-4 bg-white p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3">
                    <span className="material-symbols-outlined text-success fs-4">grid_view</span>
                  </div>
                  <h4 className="text-dark fw-bold mb-0">Cubierta y Laterales</h4>
                </div>
                <p className="text-secondary small">Malla de alta tenacidad HDPE monofilamento virgen, color blanco.</p>
                <ul className="text-secondary list-unstyled text-sm">
                  <li className="mb-2"><span className="material-symbols-outlined text-success fs-6 align-middle me-2">check_circle</span><strong>Densidad:</strong> 50×25 mesh</li>
                  <li className="mb-2"><span className="material-symbols-outlined text-success fs-6 align-middle me-2">check_circle</span><strong>Gramaje:</strong> 130 gsm (Heavy Duty)</li>
                  <li><span className="material-symbols-outlined text-success fs-6 align-middle me-2">check_circle</span><strong>Soporte:</strong> Alambrón cal. 10 cada 1m</li>
                </ul>
              </div>
            </Col>
            
            <Col md={4}>
              <div className="card h-100 border-0 shadow-sm rounded-4 bg-white p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-warning bg-opacity-10 p-3 rounded-circle me-3">
                    <span className="material-symbols-outlined text-warning fs-4">payments</span>
                  </div>
                  <h4 className="text-dark fw-bold mb-0">Economía de Escala</h4>
                </div>
                <p className="text-secondary small">La tipología más rentable por metro cuadrado.</p>
                <ul className="text-secondary list-unstyled text-sm">
                  <li className="mb-2"><span className="material-symbols-outlined text-success fs-6 align-middle me-2">check_circle</span><strong>Inversión Estimada:</strong> $10 - $15 / m²</li>
                  <li className="mb-2"><span className="material-symbols-outlined text-success fs-6 align-middle me-2">check_circle</span><strong>Montaje:</strong> Rápido (4-6 semanas)</li>
                  <li><span className="material-symbols-outlined text-success fs-6 align-middle me-2">check_circle</span><strong>ROI:</strong> Menor a 2 años</li>
                </ul>
              </div>
            </Col>
          </Row>
        </section>

        {/* ============================================================ */}
        {/* GUAYAS DEEP DIVE SECTION                                    */}
        {/* ============================================================ */}
        <section id="guayas-section" className="bg-white rounded-4 shadow-sm p-4 p-md-5">
          <Row className="align-items-center">
            <Col lg={5} className="mb-4 mb-lg-0">
              <span className="badge bg-warning bg-opacity-25 text-dark rounded-pill px-3 py-1 font-monospace text-uppercase fw-bold mb-3">
                Deep Dive: Ingeniería de Tensores
              </span>
              <h3 className="fw-bold mb-4 text-dark">Esqueleto a Tensión (Guayas y Anclajes)</h3>
              <p className="text-secondary mb-4">
                A diferencia de los invernaderos tradicionales, la Casa de Malla Plana no utiliza cerchas metálicas pesadas en el techo. Su resistencia al viento recae 100% en una red dinámica de cables de acero.
              </p>
              <ul className="list-unstyled text-secondary">
                <li className="mb-3 d-flex align-items-start gap-2">
                  <span className="material-symbols-outlined text-info">straighten</span>
                  <span><strong>Retícula 1x1m:</strong> Alambrón galvanizado Cal. 10 dispuesto en cuadrícula para soportar el peso de la malla y evitar "bolsas de agua".</span>
                </li>
                <li className="mb-3 d-flex align-items-start gap-2">
                  <span className="material-symbols-outlined text-info">all_inclusive</span>
                  <span><strong>Cinturón Perimetral:</strong> Guaya de acero ¼" (6x19) tensada alrededor de toda la estructura, transfiriendo la carga de viento a los pilares principales.</span>
                </li>
                <li className="mb-3 d-flex align-items-start gap-2">
                  <span className="material-symbols-outlined text-warning">anchor</span>
                  <span><strong>Anclajes (Muertos):</strong> Cables tensores con ojales a 45° fijados a bloques de concreto ciclópeo a 1.0 metro de profundidad, contrarrestando la tracción interna.</span>
                </li>
              </ul>
            </Col>
            <Col lg={7}>
              <div className="bg-light rounded-3 p-4 position-relative overflow-hidden shadow-inner h-100 d-flex flex-column justify-content-center border border-secondary border-opacity-25">
                <div className="text-center font-monospace text-xs text-success mb-4 opacity-75">
                  ESQUEMA TÉCNICO VISTA LATERAL
                </div>
                <pre className="text-secondary m-0 w-100 font-monospace fw-bold" style={{ fontSize: '0.85rem', lineHeight: '1.4', overflowX: 'auto' }}>
{`
     MALLA Y ALAMBRÓN (Techo Plano)
      =============================
      |                           |
      | Tensor a 45°              | Pilar
      \\                           | 
       \\ Guaya 1/4"               | Ø 2"
        \\                         |
         \\                        |
__________\\_______________________|_________ Suelo
           \\                      |
            \\                     |
           [██] Muerto 1m prof.  [██] Dado
`}
                </pre>
              </div>
            </Col>
          </Row>
        </section>

        {/* ============================================================ */}
        {/* DESGLOSE PRESUPUESTARIO SECTION                             */}
        {/* ============================================================ */}
        <section id="budget-section" className="mb-4">
          <div className="text-center mb-5">
            <span className="badge bg-secondary bg-opacity-25 text-secondary rounded-pill px-3 py-1 font-monospace text-uppercase fw-bold mb-2">Transparencia Total</span>
            <h2 className="fw-bold text-dark">Desglose de Materiales (Ref: 1.000 m²)</h2>
            <p className="text-secondary">Cantidades exactas calculadas para el Valle de Quíbor.</p>
          </div>

          <Row className="justify-content-center">
            <Col lg={10}>
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="bg-light p-4 border-bottom d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 text-dark fw-bold d-flex align-items-center gap-2">
                    <span className="material-symbols-outlined text-success">receipt_long</span> 
                    Presupuesto Estructural
                  </h5>
                  <Badge bg="dark" className="font-monospace fw-normal">Cotización Base</Badge>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover table-borderless mb-0 align-middle">
                    <thead className="table-light text-secondary text-xs text-uppercase font-monospace border-bottom">
                      <tr>
                        <th className="ps-4 py-3">Material Principal</th>
                        <th className="text-center py-3">Cant.</th>
                        <th className="text-end py-3">Precio Ref.</th>
                        <th className="text-end pe-4 py-3">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="border-top-0">
                      <tr>
                        <td className="ps-4 fw-medium text-dark py-3">Pilares Perimetrales (40 und = 20 Tubos Ø 2", 6m)</td>
                        <td className="text-center text-secondary py-3">20 tubos</td>
                        <td className="text-end text-secondary py-3">$24.98</td>
                        <td className="text-end pe-4 fw-bold text-dark py-3">$499.60</td>
                      </tr>
                      <tr>
                        <td className="ps-4 fw-medium text-dark py-3">Pilares Esquineros Dobles (8 und = 4 Tubos Ø 2", 6m)</td>
                        <td className="text-center text-secondary py-3">4 tubos</td>
                        <td className="text-end text-secondary py-3">$24.98</td>
                        <td className="text-end pe-4 fw-bold text-dark py-3">$99.92</td>
                      </tr>
                      <tr>
                        <td className="ps-4 fw-medium text-dark py-3">Pilares Interiores (64 und = 32 Tubos Ø 2", 6m)</td>
                        <td className="text-center text-secondary py-3">32 tubos</td>
                        <td className="text-end text-secondary py-3">$24.98</td>
                        <td className="text-end pe-4 fw-bold text-dark py-3">$799.36</td>
                      </tr>
                      <tr>
                        <td className="ps-4 fw-medium text-dark py-3">Correas de Refuerzo Perimetral (Ø 1" × 1.9 mm, 6m)</td>
                        <td className="text-center text-secondary py-3">31 tubos</td>
                        <td className="text-end text-secondary py-3">$11.00</td>
                        <td className="text-end pe-4 fw-bold text-dark py-3">$341.00</td>
                      </tr>
                      <tr className="bg-light border-top">
                        <td className="ps-4 pt-4 pb-3 fw-bold text-dark">Subtotal Tubería Galvanizada</td>
                        <td className="text-center pt-4 pb-3 fw-bold text-dark">87 tubos</td>
                        <td className="text-end pt-4 pb-3"></td>
                        <td className="text-end pt-4 pb-3 text-success pe-4 fw-black fs-5">$1,739.88</td>
                      </tr>
                      <tr className="border-top">
                        <td className="ps-4 fw-medium text-dark py-3">Malla 130gsm 50x25 Blanca (Rollos 4x100m)</td>
                        <td className="text-center text-secondary py-3">5 rollos</td>
                        <td className="text-end text-secondary py-3">$300.00</td>
                        <td className="text-end pe-4 fw-bold text-dark py-3">$1,500.00</td>
                      </tr>
                      <tr>
                        <td className="ps-4 fw-medium text-dark py-3">Guaya Acero Galvanizado ¼" (Perímetro y Anclajes)</td>
                        <td className="text-center text-secondary py-3">360 m</td>
                        <td className="text-end text-secondary py-3">$0.95</td>
                        <td className="text-end pe-4 fw-bold text-dark py-3">$342.00</td>
                      </tr>
                      <tr>
                        <td className="ps-4 fw-medium text-dark py-3">Alambrón Galvanizado Cal. 10 (Retícula de Techo 1x1m)</td>
                        <td className="text-center text-secondary py-3">2.100 m</td>
                        <td className="text-end text-secondary py-3">$0.06</td>
                        <td className="text-end pe-4 fw-bold text-dark py-3">$126.00</td>
                      </tr>
                      <tr>
                        <td className="ps-4 fw-medium text-dark py-3">Accesorios (Tensores Torniquete, Perrillos ¼")</td>
                        <td className="text-center text-secondary py-3">48 anclajes</td>
                        <td className="text-end text-secondary py-3">$4.50</td>
                        <td className="text-end pe-4 fw-bold text-dark py-3">$216.00</td>
                      </tr>
                      <tr className="bg-success bg-opacity-10 border-top border-success border-opacity-25">
                        <td className="ps-4 pt-4 pb-3 fw-bold text-success text-uppercase">Gran Total Materiales Principales</td>
                        <td className="text-center pt-4 pb-3"></td>
                        <td className="text-end pt-4 pb-3"></td>
                        <td className="text-end pt-4 pb-3 text-success pe-4 fw-black fs-4">$3,923.88</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Col>
          </Row>
        </section>

        {/* ============================================================ */}
        {/* CALL TO ACTION CTA                                          */}
        {/* ============================================================ */}
        <AgroCtaBanner 
          title="¿Listo para escalar tu producción?"
          description="Cotiza tu Casa de Malla Plana a medida y asegura el éxito de tu cosecha."
          primaryCtaText="Solicitar Presupuesto Formal"
          primaryCtaLink="https://wa.me/584160000000"
        />

      </Container>
    </div>
  );
};
