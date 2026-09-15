import React, { useState } from 'react';
import { Card, Collapse, Button, Row, Col } from 'react-bootstrap';

export const JegatMoraRegionalPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Card className="border-0 shadow-sm bg-light">
      <Card.Body className="p-3">
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <span className="material-symbols-outlined text-info fs-5">menu_book</span>
            <div>
              <h6 className="fw-bold text-dark mb-0 small">
                Fundamentación Científica Regional (Jégat, Mora et al. 2012 / CIDIAT-ULA)
              </h6>
              <span className="text-muted text-2xs">
                Evaluación de la Recarga Artificial y Modelo Hidrogeológico del Valle de Quíbor
              </span>
            </div>
          </div>
          <Button
            variant="outline-info"
            size="sm"
            className="text-xs"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="material-symbols-outlined text-xs me-1">
              {isOpen ? 'expand_less' : 'expand_more'}
            </span>
            {isOpen ? 'Ocultar Dossier Científico' : 'Desplegar Dossier Científico'}
          </Button>
        </div>

        <Collapse in={isOpen}>
          <div className="mt-3 pt-3 border-top">
            <Row className="g-3 text-xs font-sans">
              {/* Sección 1: Paleocauce y el Vecino */}
              <Col xs={12} md={6}>
                <div className="p-3 bg-white rounded border h-100 shadow-xs">
                  <div className="d-flex align-items-center gap-2 text-primary fw-bold mb-2">
                    <span className="material-symbols-outlined fs-6">explore</span>
                    <span>¿Por qué un vecino a 300 m excavó a 50 m y salió seco?</span>
                  </div>
                  <p className="text-secondary text-2xs mb-2">
                    En la hidrogeología del Valle de Quíbor, el agua subterránea no forma una mesa homogénea. El acuífero de Cuara está formado por <strong>paleocauces aluviales meándricos entrelazados</strong>:
                  </p>
                  <ul className="text-2xs text-secondary ps-3 mb-2">
                    <li>
                      <strong>Canal Colector Axial (Tu Pozo):</strong> El flujo torrencial lavó las arcillas y depositó gravas limpias de lidita y cuarzo en un corredor de 50 a 100 m de ancho.
                    </li>
                    <li>
                      <strong>Llanura de Inundación (Vecino):</strong> A 300 m hacia los costados, la velocidad del agua era casi nula, depositando lodo y arcillas impermeables sin gravas.
                    </li>
                  </ul>
                  <div className="p-2 bg-success-subtle rounded text-success-emphasis text-2xs">
                    <strong>Garantía Hidráulica:</strong> Al estar el vecino en arcilla seca, <strong>no existe interferencia ni succión de bombeo cruzado</strong> en tu radio de influencia (R=25m).
                  </div>
                </div>
              </Col>

              {/* Sección 2: Espesor Saturado en Sector Sur */}
              <Col xs={12} md={6}>
                <div className="p-3 bg-white rounded border h-100 shadow-xs">
                  <div className="d-flex align-items-center gap-2 text-info fw-bold mb-2">
                    <span className="material-symbols-outlined fs-6">science</span>
                    <span>El Espesor Saturado Máximo de 10 m (Sector Sur, Cuara)</span>
                  </div>
                  <p className="text-secondary text-2xs mb-2">
                    Jégat & Mora (2012, Sec. 2.5) documentan la asimetría sedimentaria del valle:
                  </p>
                  <blockquote className="border-start border-3 border-info ps-2 py-1 text-2xs fst-italic text-dark bg-light rounded-end">
                    "En el sector Norte el espesor saturado alcanza los 90 m. En el sector Sur el espesor de los sedimentos varía de 0 a 230 m con un <strong>espesor máximo saturado de 10 m</strong>."
                  </blockquote>
                  <p className="text-secondary text-2xs mb-0 mt-2">
                    Por ello, perforar a 60 metros corta exactamente los <strong>10.5 metros del paquete saturado completo</strong>. Perforar más profundo en este punto no aportaría mayor espesor saturado y arriesgaría tocar el basamento rocoso impermeable cretácico.
                  </p>
                </div>
              </Col>

              {/* Sección 3: Balance Hídrico Regional y Sobreexplotación */}
              <Col xs={12} md={6}>
                <div className="p-3 bg-white rounded border h-100 shadow-xs">
                  <div className="d-flex align-items-center gap-2 text-warning fw-bold mb-2">
                    <span className="material-symbols-outlined fs-6">troubleshoot</span>
                    <span>Balance Hídrico del Acuífero de Quíbor (CIDIAT)</span>
                  </div>
                  <div className="row g-2 text-2xs mb-2">
                    <div className="col-6">
                      <div className="p-2 bg-light rounded">
                        <span className="text-muted d-block">Extracción Total:</span>
                        <strong className="text-danger font-monospace">~22.0 Mm³/año</strong>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-2 bg-light rounded">
                        <span className="text-muted d-block">Recarga Natural:</span>
                        <strong className="text-primary font-monospace">~17.0 Mm³/año</strong>
                      </div>
                    </div>
                  </div>
                  <p className="text-secondary text-2xs mb-0">
                    El déficit regional (~5 Mm³/año) causó descensos históricos en el cono central de Quíbor. No obstante, al demandar la nave de 1.000 m² solo <strong>2.737 m³/año</strong> (el 0.01% del volumen local), tu captación es ecológicamente autosostenible.
                  </p>
                </div>
              </Col>

              {/* Sección 4: Horizonte Yacambú */}
              <Col xs={12} md={6}>
                <div className="p-3 bg-white rounded border h-100 shadow-xs">
                  <div className="d-flex align-items-center gap-2 text-success fw-bold mb-2">
                    <span className="material-symbols-outlined fs-6">water_lux</span>
                    <span>Proyección: Trasvase Yacambú-Quíbor (SHYQ)</span>
                  </div>
                  <p className="text-secondary text-2xs mb-2">
                    El proyecto de recarga artificial diseñado por el CIDIAT-ULA prevé inyectar agua superficial de la cuenca andina del Río Yacambú a través de canales de infiltración en el piedemonte:
                  </p>
                  <div className="p-2 bg-light rounded text-2xs">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Caudal de Trasvase:</span>
                      <strong className="font-monospace">1.0 a 2.0 m³/s</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Calidad Agua Yacambú:</span>
                      <strong className="text-success font-monospace">CEw &lt; 0.5 dS/m (Dulce)</strong>
                    </div>
                  </div>
                  <p className="text-muted text-3xs mt-2 mb-0">
                    Ref. RAG HIDRO-006: Jégat, Mora et al., 2012, Universidad de Los Andes / SHYQ.
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  );
};
