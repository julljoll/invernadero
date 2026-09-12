import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Table, Accordion } from 'react-bootstrap';
import { MeshViewer } from '../3d-viewers/MeshViewer/MeshViewer';
import { VariantSelector } from './components/VariantSelector';
import { MeshRollCalculator } from './components/MeshRollCalculator';
import { AgroCtaBanner } from '../../shared/components/AgroCtaBanner';

export const MallaSalesPage: React.FC = () => {
  const [variant, setVariant] = useState<'110' | '130'>('110');

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
        {/* FASE 1: ATENCIÓN (HERO SECTION DE ALTO IMPACTO)               */}
        {/* ============================================================ */}
        <section className="position-relative overflow-hidden rounded-4 bg-dark text-white p-4 p-md-5 shadow-lg border border-secondary border-opacity-25" style={{ background: 'linear-gradient(135deg, #06170d 0%, #0d2919 50%, #041009 100%)' }}>
          <Row className="align-items-center g-4">
            <Col xs={12} lg={7}>
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill bg-success bg-opacity-20 border border-success border-opacity-50 text-success text-xs fw-bold text-uppercase mb-3">
                <span className="material-symbols-outlined fs-6">verified</span>
                <span>100% Monofilamento Virgen · 5 Años Garantía UV (720 KLY)</span>
              </div>

              <h1 className="display-4 fw-bold text-white tracking-tight mb-3">
                Catálogo Oficial: Malla Antiáfido <span className="text-success">50 Mesh</span>
              </h1>

              <p className="lead text-light text-opacity-90 fs-6 mb-4">
                Blindaje biológico, difusión térmica infrarroja y máxima ventilación convectiva para <strong>2.500 plantas de pimentón (1.000 m²)</strong>. Diseñada con tenacidad probada contra las ráfagas de 27 km/h del Este y la alta radiación solar del Valle de Quíbor.
              </p>

              {/* Indicadores clave rápidos */}
              <Row className="g-3 mb-4">
                <Col xs={6} sm={3}>
                  <div className="p-2.5 bg-black bg-opacity-40 rounded-3 border border-secondary border-opacity-25 text-center">
                    <div className="text-success fs-4 fw-bold font-monospace">≤192 µm</div>
                    <div className="text-muted text-xs">Poro Certificado</div>
                  </div>
                </Col>
                <Col xs={6} sm={3}>
                  <div className="p-2.5 bg-black bg-opacity-40 rounded-3 border border-secondary border-opacity-25 text-center">
                    <div className="text-success fs-4 fw-bold font-monospace">-2.0 °C</div>
                    <div className="text-muted text-xs">Alivio en Hoja</div>
                  </div>
                </Col>
                <Col xs={6} sm={3}>
                  <div className="p-2.5 bg-black bg-opacity-40 rounded-3 border border-secondary border-opacity-25 text-center">
                    <div className="text-success fs-4 fw-bold font-monospace">1.530 N</div>
                    <div className="text-muted text-xs">Tenacidad Eólica</div>
                  </div>
                </Col>
                <Col xs={6} sm={3}>
                  <div className="p-2.5 bg-black bg-opacity-40 rounded-3 border border-secondary border-opacity-25 text-center">
                    <div className="text-success fs-4 fw-bold font-monospace">98%</div>
                    <div className="text-muted text-xs">Bloqueo Virosis</div>
                  </div>
                </Col>
              </Row>

              <div className="d-flex flex-wrap gap-3">
                <Button
                  variant="success"
                  size="lg"
                  className="rounded-pill px-4 fw-bold d-inline-flex align-items-center gap-2 shadow"
                  onClick={() => scrollToSection('calculadora-malla')}
                >
                  <span className="material-symbols-outlined fs-5">calculate</span>
                  <span>Calcular Rollos para mi Nave</span>
                </Button>

                <Button
                  variant="outline-light"
                  size="lg"
                  className="rounded-pill px-4 fw-bold d-inline-flex align-items-center gap-2 border-opacity-50"
                  onClick={() => scrollToSection('catalogo-visual')}
                >
                  <span className="material-symbols-outlined fs-5">photo_library</span>
                  <span>Ver Catálogo Visual</span>
                </Button>
              </div>
            </Col>

            <Col xs={12} lg={5}>
              <div className="position-relative">
                <div className="rounded-4 overflow-hidden border border-success border-opacity-40 shadow-lg">
                  <img
                    src="/assets/malla-renders/mesh_micro_hero.webp"
                    alt="Malla Antiáfido 50 Mesh Microscópica AGROVENECUA"
                    className="img-fluid w-100 object-fit-cover"
                    style={{ maxHeight: '380px' }}
                  />
                </div>
                <div className="position-absolute bottom-0 start-0 m-3 p-2 px-3 bg-dark bg-opacity-90 rounded-pill border border-success border-opacity-50 text-white text-xs font-monospace d-flex align-items-center gap-2">
                  <span className="badge bg-success rounded-circle p-1"></span>
                  <span>Tejido 50×25 Hilos / Pulgada² · Color Blanco Óptico</span>
                </div>
              </div>
            </Col>
          </Row>
        </section>

        {/* ============================================================ */}
        {/* FASE 2: INTERÉS & AGITACIÓN (PROBLEMA VS SOLUCIÓN EN QUÍBOR) */}
        {/* ============================================================ */}
        <section className="py-2">
          <div className="text-center max-w-2xl mx-auto mb-4">
            <Badge bg="warning" text="dark" className="px-3 py-1.5 rounded-pill text-uppercase fw-bold mb-2">
              Diagnóstico Bioclimático en Quíbor
            </Badge>
            <h2 className="h2 fw-bold text-dark mb-2">
              ¿Por qué el 50 Mesh Blanco es Innegociable para el Pimentón?
            </h2>
            <p className="text-secondary small mb-0">
              En el Municipio Jiménez, cultivar sin malla adecuada o con plásticos negros provoca pérdidas de hasta el 60% por virosis y aborto floral térmico.
            </p>
          </div>

          <Row className="g-4 align-items-stretch">
            {/* Problema: Campo abierto o malla inadecuada */}
            <Col xs={12} md={6}>
              <Card className="h-100 border-danger border-opacity-50 bg-white shadow-sm rounded-4 p-3 p-md-4">
                <Card.Body className="p-0">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-danger fs-2">dangerous</span>
                    <div>
                      <h3 className="h5 fw-bold text-danger mb-0">Riesgo con Mallas Inadecuadas o Campo Abierto</h3>
                      <span className="text-muted text-xs">Mallas &lt;40 mesh, plásticos oscuros o polietileno reciclado</span>
                    </div>
                  </div>

                  <ul className="list-unstyled d-flex flex-column gap-3 text-secondary small mb-0">
                    <li className="d-flex align-items-start gap-2">
                      <span className="material-symbols-outlined text-danger fs-5 mt-0.5">cancel</span>
                      <div>
                        <strong className="text-dark">Entrada Masiva de Trips y Mosca Blanca:</strong> Mallas de 40 mesh tienen poros &gt;250 µm que permiten el libre paso de trips portadores de Tospovirus (TSWV) y Geminivirus en el pimentón.
                      </div>
                    </li>
                    <li className="d-flex align-items-start gap-2">
                      <span className="material-symbols-outlined text-danger fs-5 mt-0.5">cancel</span>
                      <div>
                        <strong className="text-dark">Efecto Horno y Aborto Floral (&gt;32 °C):</strong> Mallas tupidas de baja calidad sin reflexión UV retienen calor en las horas de calma térmica, esterilizando el polen del pimentón.
                      </div>
                    </li>
                    <li className="d-flex align-items-start gap-2">
                      <span className="material-symbols-outlined text-danger fs-5 mt-0.5">cancel</span>
                      <div>
                        <strong className="text-dark">Rotura por Viento del Este (27 km/h):</strong> El polietileno reciclado se tuesta en menos de 8 meses bajo la radiación UV de Quíbor, rasgándose en las uniones con los postes.
                      </div>
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>

            {/* Solución: AGROVENECUA 50 Mesh */}
            <Col xs={12} md={6}>
              <Card className="h-100 border-success border-2 bg-success bg-opacity-10 shadow-sm rounded-4 p-3 p-md-4">
                <Card.Body className="p-0">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-success fs-2">security</span>
                    <div>
                      <h3 className="h5 fw-bold text-success mb-0">Solución AGROVENECUA 50 Mesh (110 / 130 gsm)</h3>
                      <span className="text-success small fw-semibold">100% HDPE Virgen con Estabilizador HALS 720 KLY</span>
                    </div>
                  </div>

                  <ul className="list-unstyled d-flex flex-column gap-3 text-secondary small mb-0">
                    <li className="d-flex align-items-start gap-2">
                      <span className="material-symbols-outlined text-success fs-5 mt-0.5">check_circle</span>
                      <div>
                        <strong className="text-dark">Barrera Física Absoluta (Poro ≤192 µm):</strong> Bloqueo mecánico del 98% de trips, moscas blancas y pulgones. Reducción drástica del gasto en aplicaciones químicas.
                      </div>
                    </li>
                    <li className="d-flex align-items-start gap-2">
                      <span className="material-symbols-outlined text-success fs-5 mt-0.5">check_circle</span>
                      <div>
                        <strong className="text-dark">Reflexión Térmica y Luz Difusa:</strong> El pigmento blanco óptico difunde la radiación PAR y refleja el infrarrojo térmico, bajando la temperatura en hoja hasta 2.0 °C.
                      </div>
                    </li>
                    <li className="d-flex align-items-start gap-2">
                      <span className="material-symbols-outlined text-success fs-5 mt-0.5">check_circle</span>
                      <div>
                        <strong className="text-dark">Garantía UV de 5 Años:</strong> Aditivación anti-oxidante de grado industrial para soportar 720 KLY de radiación solar acumulada y anclajes con canal Lock C.
                      </div>
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>

        {/* ============================================================ */}
        {/* FASE 3: CATÁLOGO VISUAL & GALERÍA DE EQUIPAMIENTO AGRÍCOLA     */}
        {/* ============================================================ */}
        <section id="catalogo-visual" className="py-2">
          <div className="text-center max-w-2xl mx-auto mb-4">
            <Badge bg="success" className="px-3 py-1.5 rounded-pill text-uppercase fw-bold mb-2">
              Galería Fotográfica &amp; Renders Técnicos
            </Badge>
            <h2 className="h2 fw-bold text-dark mb-2">
              Catálogo Visual de Mallas e Infraestructura
            </h2>
            <p className="text-secondary small mb-0">
              Inspecciona los componentes reales que blindan y optimizan la producción de 2.500 plantas de pimentón en Quíbor.
            </p>
          </div>

          <Row className="g-4">
            {/* Foto 1: Rollo Comercial */}
            <Col xs={12} sm={6} lg={3}>
              <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white hover-shadow">
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img
                    src="/assets/malla-renders/mesh_roll_product.webp"
                    alt="Rollo de Malla Antiáfido 4m x 100m"
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>
                <Card.Body className="p-3">
                  <Badge bg="success" className="mb-2 font-monospace">Rollo 400 m²</Badge>
                  <h4 className="h6 fw-bold text-dark mb-1">Presentación Industrial 4m × 100m</h4>
                  <p className="text-secondary text-xs mb-0">
                    Orillos reforzados con doble hilo para tensado seguro en alambre perimetral sin deformación del poro.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            {/* Foto 2: Exclusión de Plagas */}
            <Col xs={12} sm={6} lg={3}>
              <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white hover-shadow">
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img
                    src="/assets/malla-renders/mesh_pest_exclusion.webp"
                    alt="Barrera Biológica contra Trips y Mosca Blanca"
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>
                <Card.Body className="p-3">
                  <Badge bg="danger" className="mb-2 font-monospace">Barrera IPM</Badge>
                  <h4 className="h6 fw-bold text-dark mb-1">Exclusión Mecánica de Vectores</h4>
                  <p className="text-secondary text-xs mb-0">
                    Bloqueo certificado de <em>Bemisia tabaci</em> y <em>Frankliniella occidentalis</em>, reduciendo la carga química.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            {/* Foto 3: Estructura y Fijación */}
            <Col xs={12} sm={6} lg={3}>
              <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white hover-shadow">
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img
                    src="/assets/malla-renders/mesh_structure_tubes.webp"
                    alt="Fijación con Perfil Lock Channel C"
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>
                <Card.Body className="p-3">
                  <Badge bg="primary" className="mb-2 font-monospace">Montaje Pro</Badge>
                  <h4 className="h6 fw-bold text-dark mb-1">Fijación con Perfil C &amp; Wiggle Wire</h4>
                  <p className="text-secondary text-xs mb-0">
                    Anclaje continuo que distribuye la tensión eólica sin perforaciones de clavos ni desgarres en cumbrera.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            {/* Foto 4: Cultivo Pimentón */}
            <Col xs={12} sm={6} lg={3}>
              <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white hover-shadow">
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img
                    src="/assets/malla-renders/mesh_greenhouse_crops.webp"
                    alt="Cultivo de Pimentón en Invernadero Quíbor"
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>
                <Card.Body className="p-3">
                  <Badge bg="success" className="mb-2 font-monospace">Pimentón 1.000 m²</Badge>
                  <h4 className="h6 fw-bold text-dark mb-1">Microclima para 2.500 Plantas</h4>
                  <p className="text-secondary text-xs mb-0">
                    Rendimiento objetivo de 12.5 T con frutos de primera categoría libres de quemaduras solares.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>

        {/* ============================================================ */}
        {/* FASE 4: VISOR 3D INTERACTIVO (MICROSCOPIO & ROLLO INDUSTRIAL) */}
        {/* ============================================================ */}
        <section className="py-2">
          <Card className="border-0 shadow-lg rounded-4 overflow-hidden bg-white">
            <Card.Header className="bg-white border-bottom p-3 p-md-4 d-flex flex-wrap justify-content-between align-items-center gap-2">
              <div className="d-flex align-items-center gap-2">
                <span className="material-symbols-outlined text-success fs-3">view_in_ar</span>
                <div>
                  <h3 className="h5 fw-bold text-dark mb-0">Visor 3D Interactivo: Tejido Microscópico &amp; Bobina</h3>
                  <p className="text-secondary text-xs mb-0">
                    Gira con el cursor o toque táctil para evaluar la disposición de hilos de urdimbre y trama.
                  </p>
                </div>
              </div>
              <Badge bg="success" className="px-3 py-2 font-monospace rounded-pill">
                Poro ≤ 192 µm Calibrado
              </Badge>
            </Card.Header>

            <Card.Body className="p-2 p-md-3 bg-dark">
              <MeshViewer initialMode="weave" />
            </Card.Body>
          </Card>
        </section>

        {/* ============================================================ */}
        {/* FASE 5: COMPARATIVA DE VARIANTES (110 vs 130 GSM)             */}
        {/* ============================================================ */}
        <section className="py-2">
          <div className="text-center max-w-2xl mx-auto mb-4">
            <Badge bg="success" className="px-3 py-1.5 rounded-pill text-uppercase fw-bold mb-2">
              Variantes Comerciales Disponibles
            </Badge>
            <h2 className="h2 fw-bold text-dark mb-2">
              Selecciona la Variante para tu Proyecto en Quíbor
            </h2>
            <p className="text-secondary small mb-0">
              Ambas variantes cuentan con poro de 50 mesh y 5 años de garantía UV. Selecciona la que mejor se adapte a tu ubicación:
            </p>
          </div>

          <VariantSelector selectedVariant={variant} onSelectVariant={setVariant} />
        </section>

        {/* ============================================================ */}
        {/* FASE 6: FICHA TÉCNICA OFICIAL CERTIFICADA                    */}
        {/* ============================================================ */}
        <section className="py-2">
          <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white p-3 p-md-4">
            <div className="d-flex align-items-center gap-2 mb-3 border-bottom pb-3">
              <span className="material-symbols-outlined text-success fs-3">fact_check</span>
              <div>
                <h3 className="h5 fw-bold text-dark mb-0">Ficha Técnica Oficial y Especificaciones Físicas</h3>
                <p className="text-secondary text-xs mb-0">Valores analíticos certificados bajo normativas internacionales ISO y ASTM</p>
              </div>
            </div>

            <div className="table-responsive">
              <Table bordered hover className="align-middle mb-0 text-sm">
                <thead className="table-light font-monospace text-xs text-uppercase">
                  <tr>
                    <th style={{ width: '35%' }}>Parámetro Físico-Mecánico</th>
                    <th style={{ width: '32.5%' }} className="text-success">
                      Variante A: 110 gsm (Flujo Térmico)
                    </th>
                    <th style={{ width: '32.5%' }} className="text-warning-emphasis">
                      Variante B: 130 gsm (Alta Tenacidad)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="fw-semibold text-dark">Densidad de Malla (Mesh)</td>
                    <td className="font-monospace">50 × 25 hilos / pulgada² (20 × 10 / cm²)</td>
                    <td className="font-monospace">50 × 25 hilos / pulgada² (20 × 10 / cm²)</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold text-dark">Apertura Efectiva de Poro</td>
                    <td className="font-monospace text-success fw-bold">≤ 192 µm (0.19 mm × 0.76 mm)</td>
                    <td className="font-monospace text-warning-emphasis fw-bold">≤ 192 µm (0.19 mm × 0.76 mm)</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold text-dark">Polímero Base</td>
                    <td>100% HDPE Monofilamento Virgen</td>
                    <td>100% HDPE Monofilamento Virgen</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold text-dark">Estabilizador UV</td>
                    <td>Quimasorb / HALS (720 KLY acumulados)</td>
                    <td>Quimasorb / HALS (720 KLY acumulados)</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold text-dark">Color y Difusión de Luz</td>
                    <td>Blanco Óptico Cristalino (PAR difusa)</td>
                    <td>Blanco Cristalino Reforzado</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold text-dark">Sombra Solar Difusa</td>
                    <td className="font-monospace">18% – 20%</td>
                    <td className="font-monospace">22% – 25%</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold text-dark">Permeabilidad al Viento (Área Libre)</td>
                    <td className="font-monospace text-success fw-bold">~22% (Alta convección)</td>
                    <td className="font-monospace">~18% (Viento filtrado)</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold text-dark">Resistencia a la Tracción (Urdimbre)</td>
                    <td className="font-monospace">1.280 N / 5 cm</td>
                    <td className="font-monospace fw-bold text-dark">1.530 N / 5 cm (+20% tenacidad)</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold text-dark">Resistencia al Reventamiento (Mullen)</td>
                    <td className="font-monospace">&gt; 1.8 MPa</td>
                    <td className="font-monospace fw-bold">&gt; 2.2 MPa</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold text-dark">Dimensiones Estándar del Rollo</td>
                    <td className="font-monospace">4.00 m ancho × 100 m largo (400 m²)</td>
                    <td className="font-monospace">4.00 m ancho × 100 m largo (400 m²)</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold text-dark">Garantía Solar Certificada</td>
                    <td>5 Años contra degradación UV en Quíbor</td>
                    <td>5 Años contra degradación UV en Quíbor</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Card>
        </section>

        {/* ============================================================ */}
        {/* FASE 7: ACCIÓN / CALCULADORA AGRONÓMICA                      */}
        {/* ============================================================ */}
        <section id="calculadora-malla" className="py-2">
          <MeshRollCalculator selectedVariant={variant} />
        </section>

        {/* ============================================================ */}
        {/* FASE 8: PREGUNTAS FRECUENTES AGRONÓMICAS & OBJECIONES EN QUÍBOR */}
        {/* ============================================================ */}
        <section className="py-2">
          <div className="text-center max-w-2xl mx-auto mb-4">
            <Badge bg="secondary" className="px-3 py-1.5 rounded-pill text-uppercase fw-bold mb-2">
              Preguntas Frecuentes
            </Badge>
            <h2 className="h2 fw-bold text-dark mb-2">
              Criterios Agronómicos e Instalación en Quíbor
            </h2>
            <p className="text-secondary small mb-0">
              Respuestas fundamentadas en ingeniería bioclimática y el régimen agroecológico del Valle de Quíbor:
            </p>
          </div>

          <Accordion defaultActiveKey="0" className="shadow-sm rounded-4 overflow-hidden">
            <Accordion.Item eventKey="0" className="border-secondary-subtle">
              <Accordion.Header>
                <span className="fw-bold text-dark">1. ¿Por qué es obligatorio el color BLANCO y no negro ni cristal opaco?</span>
              </Accordion.Header>
              <Accordion.Body className="text-secondary small">
                El color blanco refleja el exceso de radiación infrarroja térmica (&gt;750 nm) manteniendo el interior de la nave hasta <strong>2.0 °C más fresco</strong> en las horas de insolación pico de Quíbor (11:00 AM - 2:00 PM). Al mismo tiempo, difumina la radiación fotosintéticamente activa (PAR), iluminando uniformemente el dosel vegetal del pimentón sin provocar quemaduras en flores ni frutos.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1" className="border-secondary-subtle">
              <Accordion.Header>
                <span className="fw-bold text-dark">2. ¿Por qué 50 mesh y no 40 mesh o 60 mesh para pimentón?</span>
              </Accordion.Header>
              <Accordion.Body className="text-secondary small">
                Una malla de <strong>40 mesh</strong> tiene aperturas &gt;250 µm que permiten el ingreso de trips (*Frankliniella occidentalis*), vector directo del virus de la marchitez manchada del tomate/pimentón (TSWV). Por otro lado, una malla de <strong>60 mesh</strong> ahoga térmicamente la nave reduciendo la ventilación natural en más de un 40%, superando el umbral crítico de aborto floral (&gt;32 °C). <strong>50 mesh (≤192 µm) es el punto de equilibrio hidrodinámico exacto</strong> para el Valle de Quíbor.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2" className="border-secondary-subtle">
              <Accordion.Header>
                <span className="fw-bold text-dark">3. ¿Cómo se comporta frente a las ráfagas de 27 km/h procedentes del ESTE?</span>
              </Accordion.Header>
              <Accordion.Body className="text-secondary small">
                El monofilamento HDPE 100% virgen posee una tenacidad mecánica de 1.280 a 1.530 N/5cm con factor de seguridad &gt;1.5 frente a las cargas eólicas registradas en la estación meteorológica de Quíbor. Para las fachadas Este se recomienda fijación continua con <strong>perfil Lock Channel C y alambre zig-zag Wiggle Wire</strong>, evitando el uso de puntillas o clavos que desgarran el tejido.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3" className="border-secondary-subtle">
              <Accordion.Header>
                <span className="fw-bold text-dark">4. ¿Esta malla detiene ácaros como la araña roja?</span>
              </Accordion.Header>
              <Accordion.Body className="text-secondary small">
                <strong>Honestidad agronómica:</strong> Ninguna malla física comercial retiene a la araña roja (*Tetranychus urticae*) ni al ácaro blanco (*Polyphagotarsonemus latus*), ya que miden menos de 100 µm. El control de ácaros se realiza mediante manejo integrado (IPM): control de humedad relativa (&gt;60% para inhibir proliferación), material vegetal certificado de vivero y rotación química por modo de acción IRAC.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="4" className="border-secondary-subtle">
              <Accordion.Header>
                <span className="fw-bold text-dark">5. ¿Qué accesorios requiero para una instalación completa en 1.000 m²?</span>
              </Accordion.Header>
              <Accordion.Body className="text-secondary small">
                Para una nave estándar de 1.000 m² (2.500 plantas de pimentón) se requieren aproximadamente <strong>8 rollos de 4m × 100m</strong>, 950 a 1.000 metros de perfil Lock Channel C galvanizado, alambre Wiggle Wire plastificado y precintos UV de poliamida para costuras en faldas enterradas de 50 cm.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </section>

        {/* ============================================================ */}
        {/* FASE 9: CIERRE Y LLAMADO A LA ACCIÓN FINAL                   */}
        {/* ============================================================ */}
        <AgroCtaBanner
          className="p-0 m-0"
          badgeKicker="Suministro Integral de Estructuras e Insumos AGROVENECUA"
          badgeTag="Almacén Quíbor"
          title={<>¿Deseas Asesoría Técnica para el <span style={{ color: '#53C942' }}>Enmallado y Estructura</span>?</>}
          description="Contamos con stock de rollos de Malla 50 Mesh (110 y 130 gsm), perfiles Lock Channel C, alambre Wiggle Wire y asesoría agronómica directa en Finca La Cigarronera, Valle de Quíbor."
          primaryCtaText="Cotizar Pedido de Mallas"
          primaryCtaLink={`https://wa.me/584160000000?text=${encodeURIComponent('Hola AGROVENECUA, deseo cotizar rollos de Malla 50 Mesh para pimentón en Quíbor')}`}
          primaryCtaIcon="chat"
          secondaryCtaText="Ver Catálogo de Invernaderos"
          secondaryCtaLink="/catalogo-invernaderos"
          secondaryCtaIcon="storefront"
          contactTitle="Atención Agronómica en Campo"
          contactEmail="contacto@agrovenecua.com"
          contactPhone="+58 416-0000000"
          contactLocation="Valle de Quíbor, Municipio Jiménez, Lara"
          whatsappMessage="Hola AGROVENECUA, deseo cotizar rollos de malla 50 mesh y accesorios de montaje"
        />

      </Container>
    </div>
  );
};

