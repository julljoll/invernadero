import React from 'react';
import { Card, Row, Col, Badge, Alert } from 'react-bootstrap';
import { useAgroStore } from '../../../shared/store/useAgroStore';
import { GreenhouseViewer } from '../../3d-viewers/GreenhouseViewer/GreenhouseViewer';
import { Slider } from '../../../shared/components/Slider';

export const Module03Structure: React.FC = () => {
  const {
    greenhouseLengthM,
    greenhouseWidthM,
    gutterHeightM,
    ridgeHeightM,
    setGreenhouseDimensions,
  } = useAgroStore();

  return (
    <Card className="card-cockpit p-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h3 className="fs-6 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <span className="material-symbols-outlined text-brand-bright ms-sm">domain</span>
            <span>Inspección Estructural CAD 3D &amp; Parámetros Bioclimáticos</span>
          </h3>
          <span className="text-secondary small">
            Nave Estándar Quíbor ({greenhouseWidthM}m × {greenhouseLengthM}m = {greenhouseWidthM * greenhouseLengthM} m² · 2.500 Plantas de Pimentón) · Orientación Este-Oeste
          </span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <Badge bg="success" className="bg-opacity-15 border border-success border-opacity-30 text-success font-monospace">
            108 Pilares Tubo Sch 40
          </Badge>
          <Badge bg="warning" className="bg-opacity-15 border border-warning border-opacity-30 text-warning-emphasis font-monospace">
            Viento Este: Ráfaga 27 km/h (FS ≥ 1.5)
          </Badge>
        </div>
      </div>

      {/* Regla Bioclimática Quíbor para Pimentón */}
      <Alert variant="success" className="p-3 mb-3 bg-success bg-opacity-10 border border-success border-opacity-25 rounded-3 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2">
        <div className="d-flex align-items-center gap-2">
          <span className="material-symbols-outlined text-success ms-sm">verified</span>
          <span className="text-dark small">
            <strong>Geometría Bioclimática para Pimentón:</strong> Cumbrera a <strong>{ridgeHeightM}m</strong> y alero a <strong>{gutterHeightM}m</strong> garantizan el volumen buffer para disipar el calor y prevenir aborto floral en 2.500 plantas de <em>Capsicum annuum</em>.
          </span>
        </div>
        <Badge bg="success" className="bg-opacity-20 text-success border border-success border-opacity-30 font-mono text-xs px-2.5 py-1 text-nowrap align-self-start align-self-md-auto">
          Buffer Térmico Óptimo (2.50 pl/m²)
        </Badge>
      </Alert>

      {/* Controles Interactivos de Geometría */}
      <Row className="g-3 mb-3 bg-light p-3 rounded-4 border border-secondary-subtle">
        <Col xs={12} md={3}>
          <Slider
            label="Ancho de Nave (m):"
            value={greenhouseWidthM}
            min={10}
            max={40}
            step={2}
            unit="m"
            accentColor="success"
            iconName="straighten"
            onChange={(val) => setGreenhouseDimensions({ widthM: val })}
          />
        </Col>
        <Col xs={12} md={3}>
          <Slider
            label="Largo de Nave (m):"
            value={greenhouseLengthM}
            min={20}
            max={100}
            step={5}
            unit="m"
            accentColor="success"
            iconName="straighten"
            onChange={(val) => setGreenhouseDimensions({ lengthM: val })}
          />
        </Col>
        <Col xs={12} md={3}>
          <Slider
            label="Altura Alero (Canal) (m):"
            value={gutterHeightM}
            min={2.0}
            max={5.0}
            step={0.25}
            unit="m"
            accentColor="info"
            iconName="vertical_align_bottom"
            onChange={(val) => setGreenhouseDimensions({ gutterHeightM: val })}
          />
        </Col>
        <Col xs={12} md={3}>
          <Slider
            label="Altura Cumbrera (m):"
            value={ridgeHeightM}
            min={3.0}
            max={7.5}
            step={0.25}
            unit="m"
            accentColor="warning"
            iconName="vertical_align_top"
            onChange={(val) => setGreenhouseDimensions({ ridgeHeightM: val })}
          />
        </Col>
      </Row>

      {/* Visor 3D Three.js AutoCAD */}
      <div className="rounded-3 overflow-hidden shadow-sm border border-secondary-subtle">
        <GreenhouseViewer
          widthM={greenhouseWidthM}
          lengthM={greenhouseLengthM}
          gutterHeightM={gutterHeightM}
          ridgeHeightM={ridgeHeightM}
        />
      </div>

      <Row className="g-2 mt-3 text-secondary small">
        <Col xs={12} md={4}>
          <span className="text-dark fw-bold">Capa 01 Estructural:</span> 108 Pilares Tubo Sch 40 (Cian #00FFFF), cerchas a dos aguas, vigas maestras y zapatas de anclaje de 1.20m.
        </Col>
        <Col xs={12} md={4}>
          <span className="text-dark fw-bold">Capa Barlovento (Este 88%):</span> Cruces de San Andrés y tensores de guaya galvanizada 1/4" 7×19 con tensores ojo-ojo 5/8" (FS ≥ 1.5).
        </Col>
        <Col xs={12} md={4}>
          <span className="text-dark fw-bold">Capa 02 Cobertura:</span> Malla 50 Mesh Blanca (110 gsm) con sellado perimetral hermético y alambre CAD de alta precisión.
        </Col>
      </Row>
    </Card>
  );
};
