import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { KpiCard } from '../../../../shared/components/KpiCard';

interface PlantingFrameProps {
  areaM2: number;
  totalPlants: number;
  camellonesCount: number;
  totalDrippers: number;
  totalMetersTape: number;
  dripperFlowLh: number;
  totalFlowM3h: number;
  sectorsCount: number;
  sectorFlowM3h: number;
}

export const PlantingFrame: React.FC<PlantingFrameProps> = ({
  areaM2,
  totalPlants,
  camellonesCount,
  totalDrippers,
  totalMetersTape,
  dripperFlowLh,
  totalFlowM3h,
  sectorsCount,
  sectorFlowM3h,
}) => {
  return (
    <Card className="card-cockpit p-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3 pb-2 border-bottom border-secondary-subtle">
        <div>
          <h3 className="fs-6 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <span className="material-symbols-outlined text-success ms-sm">grid_view</span>
            <span>Marco de Siembra & Diseño Hidráulico de Riego por Goteo</span>
          </h3>
          <span className="text-secondary small font-sans">
            Configuración para {areaM2} m² (Camellones de 1.20 m + Pasillos de 0.80 m · 2 cintas por cama)
          </span>
        </div>
        <Badge bg="light" text="dark" className="border font-monospace text-xs px-2.5 py-1">
          Densidad: 2.50 pl/m² ({totalPlants.toLocaleString()} plantas)
        </Badge>
      </div>

      {/* Tarjetas de KPIs */}
      <Row className="g-3 mb-3">
        <Col xs={12} sm={6} md={3}>
          <KpiCard
            label="Camellones & Cintas"
            value={`${camellonesCount}`}
            unit="camas"
            subtext={`${(totalMetersTape / 1000).toFixed(1)} km cinta (2 líneas/cama)`}
            iconName="view_agenda"
            variant="success"
          />
        </Col>

        <Col xs={12} sm={6} md={3}>
          <KpiCard
            label="Goteros PC Autocomp."
            value={`${totalDrippers.toLocaleString()}`}
            unit="emisores"
            subtext={`Gasto ${dripperFlowLh} L/h @ 40 cm`}
            iconName="opacity"
            variant="success"
          />
        </Col>

        <Col xs={12} sm={6} md={3}>
          <KpiCard
            label="Caudal Simultáneo Total"
            value={totalFlowM3h.toFixed(2)}
            unit="m³/hora"
            subtext="Toda la nave abierta"
            iconName="water"
            variant="warning"
          />
        </Col>

        <Col xs={12} sm={6} md={3}>
          <KpiCard
            label={`Caudal Sector (${sectorsCount} turnos)`}
            value={sectorFlowM3h.toFixed(2)}
            unit="m³/hora"
            subtext="Operación real por electroválvula"
            iconName="alt_route"
            variant="info"
          />
        </Col>
      </Row>

      <div className="p-2.5 bg-light rounded-3 border border-secondary-subtle text-xs text-secondary d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2">
          <span className="material-symbols-outlined text-primary fs-6">tune</span>
          <span>
            <strong>Presión de Operación en Cabezal:</strong> 1.5 a 2.0 bar (compensación activa en laberinto 0.5 a 3.5 bar).
          </span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="material-symbols-outlined text-success fs-6">filter_alt</span>
          <span>Filtración recomendada: Malla / Anillas 120 mesh (130 µm).</span>
        </div>
      </div>
    </Card>
  );
};
