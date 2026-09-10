import React, { useState } from 'react';
import { useAgroStore } from '../../shared/store/useAgroStore';
import { CROPS_CATALOG } from '../../core/constants/crops';
import { CockpitHeader } from './components/CockpitHeader';
import { Module01Climate } from './modules/Module01Climate';
import { Module02Ventilation } from './modules/Module02Ventilation';
import { Module03Structure } from './modules/Module03Structure';
import { Module04Irrigation } from './modules/Module04Irrigation';
import { Module05Well } from './modules/Module05Well';
import { Module06PestControl } from './modules/Module06PestControl';
import { Module07CropPlan } from './modules/Module07CropPlan';

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
    { id: 'ventilacion', label: '02. Ventilación & RAH', subtitle: 'Eólicos & Convección', icon: 'cyclone', color: 'green' },
    { id: 'estructura', label: '03. Estructura 3D', subtitle: 'Malla 50 Mesh · Cargas', icon: 'view_in_ar', color: 'green' },
    { id: 'riego', label: '04. Riego & Salinidad', subtitle: 'FAO-56 · Conductividad', icon: 'water_drop', color: 'water' },
    { id: 'pozo', label: '05. Hidrología Pozo 60m', subtitle: 'Nivel Dinámico · Aforo', icon: 'water_ph', color: 'water' },
    { id: 'plagas', label: '06. Fitosanidad IPM', subtitle: 'Rotación IRAC · Umbrales', icon: 'pest_control', color: 'alert' },
    { id: 'siembra', label: '07. Siembra & Fertirriego', subtitle: 'FAO-56 · AIFA Hidrosoluble', icon: 'calendar_month', color: 'green' },
  ];

  return (
    <div className="cockpit-view-wrapper pb-5">
      <CockpitHeader />

      <div className="container-xl">
        <div className="row g-4">
          {/* ====================================================================
             SIDEBAR DE NAVEGACIÓN AGRONÓMICA (Lateral en Desktop / Deslizable en Mobile)
             ==================================================================== */}
          <aside className="col-12 col-lg-4 col-xl-3">
            <div className="cockpit-sidebar-card p-3 sticky-lg-top" style={{ top: '1.25rem', zIndex: 10 }}>
              {/* Encabezado del Menú Lateral */}
              <div className="d-flex align-items-center justify-content-between mb-3 px-1">
                <span className="text-uppercase tracking-wider text-muted fw-bold text-xxs">
                  Módulos Técnicos
                </span>
                <span className="badge bg-success bg-opacity-20 text-success border border-success border-opacity-30 rounded-pill px-2 py-1 text-xxs">
                  7 Módulos
                </span>
              </div>

              {/* Lista Vertical en Desktop / Fila horizontal táctil en Móvil */}
              <ul
                className="nav nav-pills flex-row flex-lg-column flex-nowrap flex-lg-wrap overflow-auto gap-2 pb-2 pb-lg-0"
                style={{ scrollbarWidth: 'thin' }}
              >
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <li className="nav-item w-100 flex-shrink-0 flex-lg-shrink-1" key={tab.id} style={{ minWidth: 'fit-content' }}>
                      <button
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`nav-link w-100 rounded-3 touch-target-48 text-start fw-bold d-flex align-items-center gap-2 px-3 py-2 ${
                          isActive ? 'active shadow-sm' : 'cockpit-tab-pill'
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined ms-md flex-shrink-0 ${
                            isActive ? 'text-success' : 'text-slate-400'
                          }`}
                        >
                          {tab.icon}
                        </span>
                        <div className="d-flex flex-column flex-grow-1 overflow-hidden">
                          <span className="text-truncate text-xs">{tab.label}</span>
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
                    </li>
                  );
                })}
              </ul>

              {/* Separador de Sección Desktop */}
              <hr className="my-3 d-none d-lg-block text-secondary opacity-25" />

              {/* CTA Ficha de Turno WhatsApp en Desktop */}
              <div className="d-none d-lg-block px-1">
                <a
                  href={`https://wa.me/?text=${waShiftText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-success touch-target-48 rounded-3 fw-bold w-100 d-flex align-items-center justify-content-center gap-2 py-2 text-xs"
                  title="Compartir reporte agronómico por WhatsApp con el equipo de campo"
                >
                  <span className="material-symbols-outlined ms-sm">send_to_mobile</span>
                  <span>Ficha de Turno WhatsApp</span>
                </a>
              </div>
            </div>

            {/* CTA Ficha WhatsApp en Móviles (Debajo del carrusel de pestañas) */}
            <div className="d-lg-none mt-2">
              <a
                href={`https://wa.me/?text=${waShiftText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-success touch-target-48 rounded-pill fw-bold w-100 d-flex align-items-center justify-content-center gap-2 py-2 text-xs"
              >
                <span className="material-symbols-outlined ms-sm">send_to_mobile</span>
                <span>Ficha de Turno WhatsApp</span>
              </a>
            </div>
          </aside>

          {/* ====================================================================
             WORKSPACE DE MÓDULOS AGRONÓMICOS (Columna Derecha)
             ==================================================================== */}
          <main className="col-12 col-lg-8 col-xl-9">
            {activeTab === 'clima' && <Module01Climate />}
            {activeTab === 'ventilacion' && <Module02Ventilation />}
            {activeTab === 'estructura' && <Module03Structure />}
            {activeTab === 'riego' && <Module04Irrigation />}
            {activeTab === 'pozo' && <Module05Well />}
            {activeTab === 'plagas' && <Module06PestControl />}
            {activeTab === 'siembra' && <Module07CropPlan />}
          </main>
        </div>
      </div>
    </div>
  );
};
