import React, { useState } from 'react';
import { Card, Table, Badge, Button, Row, Col, Form } from 'react-bootstrap';

interface BudgetItem {
  id: string;
  itemNum: string;
  category: string;
  description: string;
  unit: string;
  defaultQty: number;
  defaultUnitPrice: number;
  qty: number;
  unitPrice: number;
  isAsset?: boolean;
}

export const WellBudgetTable: React.FC = () => {
  const defaultItems: BudgetItem[] = [
    {
      id: 'excavacion',
      itemNum: '1.0',
      category: 'Mano de Obra',
      description: 'Cuadrilla de poceros calificados: pica en grava bajo agua, izaje continuo y achique (10 m faltantes: de 50 a 60 m)',
      unit: 'metros',
      defaultQty: 10,
      defaultUnitPrice: 100.0,
      qty: 10,
      unitPrice: 100.0
    },
    {
      id: 'martillo',
      itemNum: '2.0',
      category: 'Herramienta / Activo',
      description: 'Martillo demoledor electroneumático industrial (28mm hex, 50J, 2.200W, servicio pesado). Activo fijo permanente de la finca.',
      unit: 'equipo',
      defaultQty: 1,
      defaultUnitPrice: 1000.0,
      qty: 1,
      unitPrice: 1000.0,
      isAsset: true
    },
    {
      id: 'ventilacion',
      itemNum: '3.0',
      category: 'Seguridad Ocupacional',
      description: 'Soplador centrífugo industrial de aire limpio (1/2 HP) + 60m manguera corrugada 4" para inyección de O₂ a fondo de fuste.',
      unit: 'equipo',
      defaultQty: 1,
      defaultUnitPrice: 320.0,
      qty: 1,
      unitPrice: 320.0
    },
    {
      id: 'achique',
      itemNum: '4.0',
      category: 'Equipo de Obra',
      description: 'Bomba sumergible de achique de lodos y sólidos 1 HP (descarga 2") con flotador para evacuación durante la excavación activa.',
      unit: 'unidad',
      defaultQty: 1,
      defaultUnitPrice: 220.0,
      qty: 1,
      unitPrice: 220.0
    },
    {
      id: 'camisa',
      itemNum: '5.0',
      category: 'Revestimiento',
      description: 'Anillos de concreto armado Ø70cm ext / Ø60cm int (o camisa PVC ranurada Ø8"-10") + 2m³ empaque grava cuarzosa 1/4".',
      unit: 'metros',
      defaultQty: 12,
      defaultUnitPrice: 35.0,
      qty: 12,
      unitPrice: 35.0
    },
    {
      id: 'bomba_def',
      itemNum: '6.0',
      category: 'Equipamiento Hidráulico',
      description: 'Electrobomba sumergible multietapas AISI 304 de 2.0 HP (descarga 1.5", 220V, HMT = 70-75 mca, 14 impulsores Noryl).',
      unit: 'unidad',
      defaultQty: 1,
      defaultUnitPrice: 380.0,
      qty: 1,
      unitPrice: 380.0
    },
    {
      id: 'tablero',
      itemNum: '7.0',
      category: 'Automatización & Control',
      description: 'Tablero arrancador 2 HP 220V con relé electrónico de nivel de pozo anti-marcha en seco con electrodos de nivel, contactor y NEMA 4X.',
      unit: 'equipo',
      defaultQty: 1,
      defaultUnitPrice: 160.0,
      qty: 1,
      unitPrice: 160.0
    },
    {
      id: 'cableado',
      itemNum: '8.0',
      category: 'Material Eléctrico',
      description: '20 m Cable plano sumergible 3x12 AWG con empalme termocontraíble epoxi + 50 m cable TTU para fuste seco y superficie.',
      unit: 'lote',
      defaultQty: 1,
      defaultUnitPrice: 150.0,
      qty: 1,
      unitPrice: 150.0
    },
    {
      id: 'columna',
      itemNum: '9.0',
      category: 'Impulsión',
      description: '65 m tubería vertical PEAD PE100 PN12.5 de 1.5" continuo sin uniones + válvula check vertical de bronce 1.5" + adaptadores.',
      unit: 'lote',
      defaultQty: 1,
      defaultUnitPrice: 180.0,
      qty: 1,
      unitPrice: 180.0
    },
    {
      id: 'guaya',
      itemNum: '10.0',
      category: 'Sostenimiento',
      description: '65 m guaya de acero galvanizado Ø3/16" (carga rotura > 1.400 kgf) + 4 grapas prensacables inox y guardacabos anclados al brocal.',
      unit: 'lote',
      defaultQty: 1,
      defaultUnitPrice: 90.0,
      qty: 1,
      unitPrice: 90.0
    },
    {
      id: 'acometida',
      itemNum: '11.0',
      category: 'Conexión Eléctrica',
      description: 'Breaker bipolar termomagnético, canalización, tablero de protecciones y conexión a poste eléctrico contiguo existente.',
      unit: 'lote',
      defaultQty: 1,
      defaultUnitPrice: 80.0,
      qty: 1,
      unitPrice: 80.0
    }
  ];

  const [items, setItems] = useState<BudgetItem[]>(defaultItems);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const updateItem = (id: string, field: 'qty' | 'unitPrice', val: number) => {
    setItems(prev =>
      prev.map(it => (it.id === id ? { ...it, [field]: Math.max(0, val) } : it))
    );
  };

  const resetToDefault = () => {
    setItems(defaultItems);
    setIsEditing(false);
  };

  const totalCost = items.reduce((sum, it) => sum + it.qty * it.unitPrice, 0);
  const newWellCapex = 24880; // Costo cotizado de pozo industrial nuevo de 120m
  const netSavings = newWellCapex - totalCost;
  const savingsPct = ((netSavings / newWellCapex) * 100).toFixed(1);

  return (
    <Card className="border-0 shadow-sm bg-light">
      <Card.Body className="p-3">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <span className="material-symbols-outlined text-warning-emphasis fs-5">payments</span>
            <span className="fw-bold text-dark small">Presupuesto Itemizado de Culminación (50m ➔ 60m) — Llave en Mano</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <Button
              variant={isEditing ? 'primary' : 'outline-secondary'}
              size="sm"
              className="text-xs"
              onClick={() => setIsEditing(!isEditing)}
            >
              <span className="material-symbols-outlined text-xs me-1">
                {isEditing ? 'done' : 'edit'}
              </span>
              {isEditing ? 'Guardar Cambios' : 'Ajustar Precios'}
            </Button>
            {isEditing && (
              <Button
                variant="outline-danger"
                size="sm"
                className="text-xs"
                onClick={resetToDefault}
              >
                Restaurar RAG
              </Button>
            )}
          </div>
        </div>

        {/* Banner Comparativo de Ahorro */}
        <div className="p-3 bg-white rounded border border-success border-opacity-50 shadow-xs mb-3">
          <Row className="g-3 align-items-center text-xs">
            <Col xs={12} md={4}>
              <div className="d-flex flex-column">
                <span className="text-muted text-2xs">Inversión Culminación (60m):</span>
                <span className="fs-5 fw-bold text-success font-monospace">
                  ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </span>
                <span className="text-2xs text-secondary">Aprovecha el 83% ya excavado a 50m</span>
              </div>
            </Col>
            <Col xs={12} md={4}>
              <div className="d-flex flex-column">
                <span className="text-muted text-2xs">Pozo Mecánico Nuevo (120m Ø12"):</span>
                <span className="fs-5 fw-bold text-secondary font-monospace">
                  ${newWellCapex.toLocaleString()} USD
                </span>
                <span className="text-2xs text-muted">Taladro rotario + camisa de acero</span>
              </div>
            </Col>
            <Col xs={12} md={4}>
              <div className="p-2 bg-success-subtle rounded border border-success-subtle text-success-emphasis text-center">
                <span className="d-block fw-bold fs-6">
                  Ahorro Neto: ${netSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })} USD ({savingsPct}%)
                </span>
                <span className="text-2xs">Financia 100% de la nave de 1.000 m²</span>
              </div>
            </Col>
          </Row>
        </div>

        {/* Tabla Itemizada */}
        <div className="table-responsive bg-white rounded border shadow-xs mb-2">
          <Table hover size="sm" className="mb-0 text-xs align-middle">
            <thead className="table-light">
              <tr>
                <th className="py-2 text-center" style={{ width: '40px' }}>Ítem</th>
                <th className="py-2">Partida / Rubro</th>
                <th className="py-2">Descripción Técnica de Materiales y Servicios</th>
                <th className="py-2 text-center" style={{ width: '80px' }}>Cant.</th>
                <th className="py-2 text-center" style={{ width: '80px' }}>Unidad</th>
                <th className="py-2 text-end" style={{ width: '110px' }}>P. Unit (USD)</th>
                <th className="py-2 text-end" style={{ width: '110px' }}>Subtotal (USD)</th>
              </tr>
            </thead>
            <tbody>
              {items.map(it => {
                const subtotal = it.qty * it.unitPrice;
                return (
                  <tr key={it.id}>
                    <td className="text-center font-monospace text-muted">{it.itemNum}</td>
                    <td className="fw-bold text-dark">
                      {it.category}
                      {it.isAsset && (
                        <Badge bg="info" className="ms-1 text-3xs">Activo Fijo</Badge>
                      )}
                    </td>
                    <td className="text-secondary text-2xs">{it.description}</td>
                    <td className="text-center">
                      {isEditing ? (
                        <Form.Control
                          type="number"
                          size="sm"
                          min={1}
                          value={it.qty}
                          onChange={e => updateItem(it.id, 'qty', Number(e.target.value))}
                          style={{ width: '65px', fontSize: '11px' }}
                          className="mx-auto text-center"
                        />
                      ) : (
                        <span className="font-monospace fw-bold">{it.qty}</span>
                      )}
                    </td>
                    <td className="text-center text-muted text-2xs">{it.unit}</td>
                    <td className="text-end">
                      {isEditing ? (
                        <Form.Control
                          type="number"
                          size="sm"
                          min={0}
                          step={5}
                          value={it.unitPrice}
                          onChange={e => updateItem(it.id, 'unitPrice', Number(e.target.value))}
                          style={{ width: '85px', fontSize: '11px' }}
                          className="ms-auto text-end"
                        />
                      ) : (
                        <span className="font-monospace">${it.unitPrice.toFixed(2)}</span>
                      )}
                    </td>
                    <td className="text-end font-monospace fw-bold text-dark">
                      ${subtotal.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="table-light border-top">
              <tr>
                <td colSpan={6} className="text-end fw-bold py-2">TOTAL INVERSIÓN LLAVE EN MANO:</td>
                <td className="text-end fw-bold fs-6 text-success py-2 font-monospace">
                  ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </td>
              </tr>
            </tfoot>
          </Table>
        </div>

        <p className="text-muted text-2xs mb-0">
          * Fuente: RAG HIDRO-003. Costeado con cuadrillas locales de Cuara / Municipio Jiménez y casas comerciales de electrobombas en Barquisimeto.
        </p>
      </Card.Body>
    </Card>
  );
};
