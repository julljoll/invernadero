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

      <Row className="g-2 mt-3 text-secondary small mb-3">
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

      {/* PLAN DE CORTE DE MALLA 50 MESH (RAG EST-001) */}
      <div className="p-3 bg-light rounded-3 border border-secondary-subtle">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-2 pb-2 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <span className="material-symbols-outlined text-success fs-5">content_cut</span>
            <h5 className="fs-6 fw-bold text-dark mb-0">Plan de Corte y Despiece de Malla 50 Mesh Blanca (110 gsm)</h5>
          </div>
          <Badge bg="success" className="font-monospace text-xs">
            8 Rollos (4.0m × 100m) · $560/rollo = $4.480 USD
          </Badge>
        </div>

        <p className="text-secondary text-2xs mb-2">
          Cálculo exacto de despiece según RAG EST-001 para la nave de 1.000 m² (50m × 20m, alero 3.5m, cumbrera 5.5m), considerando solapes de 20 cm cosidos con hilo monofilamento UV:
        </p>

        <div className="table-responsive bg-white rounded border shadow-2xs mb-2">
          <table className="table table-hover table-sm mb-0 text-xs align-middle">
            <thead className="table-light">
              <tr>
                <th className="py-1">Sector de la Nave</th>
                <th className="py-1 text-center">Lienzos</th>
                <th className="py-1 text-center">Dimensiones de Corte</th>
                <th className="py-1 text-center">Área Neta</th>
                <th className="py-1">Detalle de Fijación & Tensión</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="fw-bold text-dark py-1">Cubierta Techo a Dos Aguas</td>
                <td className="text-center font-monospace py-1">4 paños</td>
                <td className="text-center font-monospace py-1">4.0 m × 52.0 m</td>
                <td className="text-center font-monospace fw-bold text-primary py-1">832 m²</td>
                <td className="text-2xs text-secondary py-1">Solape central en cumbrera con perfil zigzag omega</td>
              </tr>
              <tr>
                <td className="fw-bold text-dark py-1">Fachadas Laterales (Norte y Sur)</td>
                <td className="text-center font-monospace py-1">2 paños</td>
                <td className="text-center font-monospace py-1">4.0 m × 52.0 m</td>
                <td className="text-center font-monospace fw-bold text-primary py-1">416 m²</td>
                <td className="text-2xs text-secondary py-1">Faldón enterrado 30 cm en zanja perimetral de grava</td>
              </tr>
              <tr>
                <td className="fw-bold text-dark py-1">Testero Frontal Este (Barlovento)</td>
                <td className="text-center font-monospace py-1">2 paños</td>
                <td className="text-center font-monospace py-1">4.0 m × 22.0 m</td>
                <td className="text-center font-monospace fw-bold text-primary py-1">176 m²</td>
                <td className="text-2xs text-secondary py-1">Refuerzo con cable tensor 1/4" contra ráfagas de 27 km/h</td>
              </tr>
              <tr>
                <td className="fw-bold text-dark py-1">Testero Trasero Oeste (Sotavento)</td>
                <td className="text-center font-monospace py-1">2 paños</td>
                <td className="text-center font-monospace py-1">4.0 m × 22.0 m</td>
                <td className="text-center font-monospace fw-bold text-primary py-1">176 m²</td>
                <td className="text-2xs text-secondary py-1">Fijación con clips plásticos dobles cada 40 cm</td>
              </tr>
              <tr>
                <td className="fw-bold text-dark py-1">Esclusa Sanitaria & Solapes</td>
                <td className="text-center font-monospace py-1">1 lote</td>
                <td className="text-center font-monospace py-1">4.0 m × 25.0 m</td>
                <td className="text-center font-monospace fw-bold text-primary py-1">100 m²</td>
                <td className="text-2xs text-secondary py-1">Doble puerta con antesala de desinfección sanitaria</td>
              </tr>
            </tbody>
            <tfoot className="table-light border-top">
              <tr>
                <td colSpan={3} className="text-end fw-bold py-1">TOTAL METROS CUADRADOS REQUERIDOS:</td>
                <td className="text-center fw-bold text-success font-monospace py-1">1.700 m²</td>
                <td className="text-muted text-3xs py-1">Margen de merma y solapes: 12% cubierto por los 8 rollos</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </Card>
  );
};
