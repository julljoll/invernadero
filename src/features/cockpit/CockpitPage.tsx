import React, { useState } from 'react';
import { Container, Row, Col, Nav, Badge, Button } from 'react-bootstrap';
import { useAgroStore } from '../../shared/store/useAgroStore';
import { CROPS_CATALOG } from '../../core/constants/crops';
import { CockpitHeader } from './components/CockpitHeader';
import { Module01Climate } from './modules/Module01Climate';
import { Module03Structure } from './modules/Module03Structure';
import { Module03Fertirriego } from './modules/Module03Fertirriego';
import { Module05Well } from './modules/Module05Well';
import { Module06PestControl } from './modules/Module06PestControl';

export const CockpitPage: React.FC = () => {
  const { selectedCrop } = useAgroStore();
  const [activeTab, setActiveTab] = useState<string>('clima');
  const crop = CROPS_CATALOG[selectedCrop];

  const waShiftText = encodeURIComponent(
    `🚜 *AGROVENECUA — FICHA DE TURNO DE CAMPO*\n` +
    `📍 *Ubicación:* Valle de Quíbor, Lara (9°53'20"N 69°35'35"W · 700 msnm)\n` +
    `🌱 *Cultivo Activo:* ${crop.name} (${crop.scientificName})\n` +
    `💧 *Pozo:* 60m profundidad · Nivel Estático 49.5m\n` +
    `🛡️ *Malla:* 50 Mesh Blanca (110 gsm, poro ≤ 192 µm)\n` +
    `📋 Ficha técnica verificada en Cockpit Agronómico Quíbor.`
  );

  const tabs = [
    { id: 'clima', label: '01. Clima & VPD', subtitle: 'NASA MERRA-2 · Quíbor', icon: 'air', color: 'sun' },
    { id: 'estructura', label: '02. Estructura 3D', subtitle: 'Malla 50 Mesh · Cargas', icon: 'view_in_ar', color: 'green' },
    { id: 'fertirriego', label: '03. Siembra & Fertirriego', subtitle: 'FAO-56 · AIFA Hidrosoluble', icon: 'water_drop', color: 'water' },
    { id: 'pozo', label: '04. Hidrología Pozo 60m', subtitle: 'Nivel Dinámico · Aforo', icon: 'water_ph', color: 'water' },
    { id: 'plagas', label: '05. Fitosanidad IPM', subtitle: 'Rotación IRAC · Umbrales', icon: 'pest_control', color: 'alert' },
  ];

  return (
    <div className="cockpit-view-wrapper pb-5">
      <CockpitHeader />

      <Container fluid="xl">
        <Row className="g-4">
          {/* ====================================================================
             SIDEBAR DE NAVEGACIÓN AGRONÓMICA (Lateral en Desktop / Deslizable en Mobile)
             ==================================================================== */}
          <Col xs={12} lg={4} xl={3} as="aside">
            <div className="cockpit-sidebar-glass p-3 sticky-lg-top" style={{ top: '5.5rem', zIndex: 10 }}>
              {/* Encabezado del Menú Lateral */}
              <div className="d-flex align-items-center justify-content-between mb-3 px-1">
                <div className="d-flex align-items-center gap-1.5">
                  <span className="material-symbols-outlined text-success ms-sm">tune</span>
                  <span className="text-uppercase tracking-wider text-muted fw-bold text-xxs">
                    Módulos Cockpit
                  </span>
                </div>
                <Badge bg="success" className="bg-opacity-15 text-success border border-success border-opacity-30 rounded-pill px-2.5 py-1 text-xxs font-mono">
                  2.500 Plantas
                </Badge>
              </div>

              {/* Lista Vertical en Desktop / Fila horizontal táctil en Móvil */}
              <Nav
                variant="pills"
                className="flex-row flex-lg-column flex-nowrap flex-lg-wrap overflow-auto gap-2 pb-2 pb-lg-0"
                style={{ scrollbarWidth: 'thin' }}
              >
                {tabs.map((tab, idx) => {
                  const isActive = activeTab === tab.id;
                  const numStr = `0${idx + 1}`;
                  return (
                    <Nav.Item className="w-100 flex-shrink-0 flex-lg-shrink-1" key={tab.id} style={{ minWidth: 'fit-content' }}>
                      <button
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`nav-link w-100 rounded-3 touch-target-48 text-start fw-bold d-flex align-items-center gap-2.5 px-3 py-2.5 ${
                          isActive ? 'active shadow-sm' : 'cockpit-tab-pill'
                        }`}
                      >
                        <span className="tab-number-chip flex-shrink-0">
                          {numStr}
                        </span>
                        <span
                          className={`material-symbols-outlined ms-md flex-shrink-0 ${
                            isActive ? 'text-success' : 'text-slate-400'
                          }`}
                        >
                          {tab.icon}
                        </span>
                        <div className="d-flex flex-column flex-grow-1 overflow-hidden">
                          <span className="text-truncate text-xs">{tab.label.replace(/^\d+\.\s*/, '')}</span>
                          <span className="text-xxs text-muted fw-normal text-truncate d-none d-lg-block">
                            {tab.subtitle}
                          </span>
                        </div>
                        {isActive && (
                          <span className="material-symbols-outlined ms-sm text-success ms-auto d-none d-lg-inline">
                            chevron_right
                          </span>
                        )}
                      </button>
                    </Nav.Item>
                  );
                })}
              </Nav>

              {/* Separador de Sección Desktop */}
              <hr className="my-3 d-none d-lg-block text-secondary opacity-25" />

              {/* CTA Ficha de Turno WhatsApp en Desktop */}
              <div className="d-none d-lg-block px-1">
                <Button
                  variant="outline-success"
                  as="a"
                  href={`https://wa.me/?text=${waShiftText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target-48 rounded-3 fw-bold w-100 d-flex align-items-center justify-content-center gap-2 py-2 text-xs shadow-xs"
                  title="Compartir reporte agronómico por WhatsApp con el equipo de campo"
                >
                  <span className="material-symbols-outlined ms-sm">send_to_mobile</span>
                  <span>Ficha de Turno WhatsApp</span>
                </Button>
              </div>
            </div>

            {/* CTA Ficha WhatsApp en Móviles (Debajo del carrusel de pestañas) */}
            <div className="d-lg-none mt-2">
              <Button
                variant="outline-success"
                as="a"
                href={`https://wa.me/?text=${waShiftText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target-48 rounded-pill fw-bold w-100 d-flex align-items-center justify-content-center gap-2 py-2 text-xs"
              >
                <span className="material-symbols-outlined ms-sm">send_to_mobile</span>
                <span>Ficha de Turno WhatsApp</span>
              </Button>
            </div>
          </Col>

          {/* ====================================================================
             WORKSPACE DE MÓDULOS AGRONÓMICOS (Columna Derecha)
             ==================================================================== */}
          <Col xs={12} lg={8} xl={9} as="main">
            {/* Header Contextual del Módulo */}
            <div className="d-none d-md-flex align-items-center justify-content-between px-2 mb-3 text-secondary text-xs font-sans">
              <div className="d-flex align-items-center gap-2">
                <span className="material-symbols-outlined text-success ms-sm">spa</span>
                <span>Cultivo Objetivo: <strong className="text-dark">Pimentón Híbrido F1</strong> (2.500 plantas · 1.000 m²)</span>
              </div>
              <div className="d-flex align-items-center gap-2 font-mono">
                <Badge bg="light" text="secondary" className="border border-secondary-subtle">
                  Valle de Quíbor · 700 msnm
                </Badge>
              </div>
            </div>

            {activeTab === 'clima' && <Module01Climate />}
            {activeTab === 'estructura' && <Module03Structure />}
            {(activeTab === 'fertirriego' || activeTab === 'riego' || activeTab === 'siembra') && <Module03Fertirriego />}
            {activeTab === 'pozo' && <Module05Well />}
            {activeTab === 'plagas' && <Module06PestControl />}
          </Col>
        </Row>
      </Container>
    </div>
  );
};
