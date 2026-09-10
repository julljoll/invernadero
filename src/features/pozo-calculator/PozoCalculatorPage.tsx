import React, { useState } from 'react';
import { WellViewer } from '../3d-viewers/WellViewer/WellViewer';
import { Slider } from '../../shared/components/Slider';

export const PozoCalculatorPage: React.FC = () => {
  const [targetDepth, setTargetDepth] = useState<number>(60);
  const currentDepth = 50; // Metros ya excavados físicamente en brocal de 1m (83%)
  const staticWaterLevel = 49.5; // Nivel freático estático en reposo

  // Cálculo por metro adicional (50 a 60m)
  const additionalMeters = Math.max(0, targetDepth - currentDepth);
  const waterColumnM = Math.max(0, targetDepth - staticWaterLevel);
  // Brocal artesanal de 1m de diámetro efectivo (radio 0.5m) -> Área = π * 0.5² ≈ 0.785 m² -> 785 L por metro lineal de agua
  const activeVolumeL = Math.round(waterColumnM * 785);
  // Recarga aluvial lateral según transmisividad T=180 m²/día
  const flowRateLs = targetDepth >= 60 ? 2.5 : targetDepth >= 55 ? 1.8 : 0.8;
  const costPerMeterExcavation = 165; // $1.650 USD / 10m
  const costExcavationUsd = additionalMeters * costPerMeterExcavation;
  const costEquipUsd = 1350; // Bomba industrial + tubería PEAD + tablero VFD
  const totalCostUsd = costExcavationUsd + costEquipUsd;

  const waMessage = encodeURIComponent(
    `Hola Agrovenecua, estuve analizando el Proyecto de Reactivación del Pozo Profundo en Cuara:\n` +
    `• Cota Seleccionada: ${targetDepth} metros (${additionalMeters}m adicionales a perforar)\n` +
    `• Columna de Agua Activa: ${waterColumnM.toFixed(1)} metros (${activeVolumeL.toLocaleString()} L en pozo)\n` +
    `• Caudal Proyectado: ${flowRateLs} L/s en tandas al achique con reservorio de 80 m³\n` +
    `• Inversión Hidráulica: $${totalCostUsd.toLocaleString()} USD\n` +
    `Deseo coordinar una visita técnica para revisar la infraestructura del pozo.`
  );

  return (
    <div className="py-5">
      <div className="container-xl d-flex flex-column gap-5">
        {/* Encabezado Técnico */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="badge bg-info bg-opacity-10 border border-info border-opacity-25 text-info rounded-pill px-3 py-1 text-uppercase fw-bold mb-2">
            Memoria Hidrogeológica &amp; Geofísica · Finca La Cigarronera
          </span>
          <h1 className="display-5 fw-bold text-dark tracking-tight mb-3">
            Proyecto de Reactivación de <span className="text-info">Pozo Profundo</span>
          </h1>
          <p className="lead text-secondary fs-6 mb-0">
            Dossier técnico oficial para la culminación de los últimos 10 metros del pozo artesanal aluvial (actualmente consolidado a 50m con 83% ejecutado), régimen de bombeo en tandas al achique y reservorio de 80 m³ en el Valle de Quíbor.
          </p>
        </div>

        {/* Visor 3D y Controles de Simulación */}
        <div className="row g-4 align-items-stretch">
          <div className="col-12 col-lg-7">
            <div className="card card-agro p-2 shadow-sm h-100 d-flex flex-column">
              <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center px-3 py-2">
                <span className="text-secondary text-xs fw-bold text-uppercase d-flex align-items-center gap-1">
                  <span className="material-symbols-outlined text-info ms-sm">layers</span>
                  <span>Estratigrafía 3D Georreferenciada (Cuara, Lara)</span>
                </span>
                <span className="badge bg-info bg-opacity-25 text-info font-monospace">
                  Cota Actual: 50m / Meta: {targetDepth}m
                </span>
              </div>
              <div className="flex-grow-1" style={{ minHeight: '400px' }}>
                <WellViewer totalDepthM={targetDepth} staticWaterLevelM={staticWaterLevel} />
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-5">
            <div className="card card-agro p-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <h3 className="fs-5 fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                  <span className="material-symbols-outlined text-info ms-md">tune</span>
                  <span>Configurar Profundidad de Culminación</span>
                </h3>

                <Slider
                  label="Profundidad Final Deseada:"
                  value={targetDepth}
                  min={50}
                  max={60}
                  step={1}
                  formatValue={(v) => `${v} metros (${v - currentDepth}m adicionales)`}
                  accentColor="info"
                  iconName="straighten"
                  onChange={setTargetDepth}
                />

                <div className="row g-3 my-2">
                  <div className="col-6">
                    <div className="p-3 bg-light rounded-3 border border-secondary-subtle">
                      <div className="text-secondary text-xs mb-1">Columna de Agua Activa</div>
                      <div className="fs-4 fw-bold font-mono text-info">{waterColumnM.toFixed(1)} m</div>
                      <div className="text-secondary text-xs mt-1">{activeVolumeL.toLocaleString()} Litros en pozo</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 bg-light rounded-3 border border-secondary-subtle">
                      <div className="text-secondary text-xs mb-1">Caudal en Régimen</div>
                      <div className="fs-4 fw-bold font-mono text-success">{flowRateLs} L/s</div>
                      <div className="text-secondary text-xs mt-1">Transmisividad 180 m²/día</div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-light rounded-3 border border-secondary-subtle text-xs text-secondary mt-3">
                  <div className="d-flex justify-content-between py-1 border-bottom border-secondary-subtle">
                    <span>Excavación y anillado de concreto ({additionalMeters}m @ $165/m):</span>
                    <strong className="text-dark font-mono">${costExcavationUsd} USD</strong>
                  </div>
                  <div className="d-flex justify-content-between py-1 border-bottom border-secondary-subtle">
                    <span>Electrobomba industrial + tablero VFD + PEAD:</span>
                    <strong className="text-dark font-mono">${costEquipUsd} USD</strong>
                  </div>
                  <div className="d-flex justify-content-between pt-2 fs-6 fw-bold text-dark">
                    <span>Inversión Hidráulica de Culminación:</span>
                    <span className="text-info font-mono">${totalCostUsd.toLocaleString()} USD</span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <a
                  href={`https://wa.me/584160000000?text=${waMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-info btn-lg w-100 rounded-pill fw-bold text-white d-flex align-items-center justify-content-center gap-2 shadow-sm"
                >
                  <span className="material-symbols-outlined ms-sm">chat</span>
                  <span>Solicitar Auditoría Hidrogeológica en Terreno</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pilares de la Memoria Hidrogeológica Oficial */}
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          <div className="col">
            <div className="card card-agro p-4 h-100 shadow-sm border-info border-opacity-25">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="badge bg-info bg-opacity-25 text-info font-monospace">Estratigrafía</span>
                <span className="material-symbols-outlined text-info ms-md">landscape</span>
              </div>
              <h4 className="fs-6 fw-bold text-dark mb-1">Perfil Lito-estratigráfico</h4>
              <p className="text-secondary small mb-0">
                0-15m Limos y arcillas superficiales; 15-35m gravas aluviales; 35-50m arenas cuarcíferas acuíferas; 50-60m acuífero consolidado con transmisividad T = 180 m²/día.
              </p>
            </div>
          </div>

          <div className="col">
            <div className="card card-agro p-4 h-100 shadow-sm border-info border-opacity-25">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="badge bg-info bg-opacity-25 text-info font-monospace">Régimen Tandas</span>
                <span className="material-symbols-outlined text-info ms-md">cached</span>
              </div>
              <h4 className="fs-6 fw-bold text-dark mb-1">Bombeo al Achique</h4>
              <p className="text-secondary small mb-0">
                La electrobomba extrae la columna útil de 4.5m (~2.200 L) en 15-18 min con corte por sonda de nivel. Recarga aluvial en 40-50 min. Con 8-10 tandas diarias aporta 18 a 22 m³/día.
              </p>
            </div>
          </div>

          <div className="col">
            <div className="card card-agro p-4 h-100 shadow-sm border-info border-opacity-25">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="badge bg-info bg-opacity-25 text-info font-monospace">Buffer 80 m³</span>
                <span className="material-symbols-outlined text-info ms-md">storage</span>
              </div>
              <h4 className="fs-6 fw-bold text-dark mb-1">Reservorio Regulador</h4>
              <p className="text-secondary small mb-0">
                Capacidad de 80.000 litros que otorga 8.6 a 10.2 días de autonomía de fertirriego ininterrumpido ante cortes prolongados de energía eléctrica de Corpoelec.
              </p>
            </div>
          </div>

          <div className="col">
            <div className="card card-agro p-4 h-100 shadow-sm border-info border-opacity-25">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="badge bg-info bg-opacity-25 text-info font-monospace">Transferible</span>
                <span className="material-symbols-outlined text-info ms-md">security</span>
              </div>
              <h4 className="fs-6 fw-bold text-dark mb-1">Protección del Capital</h4>
              <p className="text-secondary small mb-0">
                La electrobomba industrial de 5.5 HP (descarga 2") y el tablero VFD se proyectaron para ser 100% transferibles al futuro pozo profundo de 120m, protegiendo todo el Capex invertido.
              </p>
            </div>
          </div>
        </div>

        {/* Tabla Comparativa de Estratos */}
        <div className="card card-agro p-4 shadow-sm">
          <h3 className="fs-5 fw-bold text-dark mb-3 d-flex align-items-center gap-2">
            <span className="material-symbols-outlined text-info ms-md">table_chart</span>
            <span>Matriz de Rendimiento Hídrico por Cota (Valle de Quíbor)</span>
          </h3>

          <div className="table-responsive">
            <table className="table table-hover align-middle small mb-0">
              <thead className="table-light">
                <tr>
                  <th>Cota Final</th>
                  <th>Estrato Geológico</th>
                  <th>Columna de Agua</th>
                  <th>Reserva en Pozo</th>
                  <th>Caudal Continuo</th>
                  <th>Capacidad de Riego</th>
                  <th>Costo Culminación</th>
                </tr>
              </thead>
              <tbody className="font-monospace">
                <tr className={targetDepth === 50 ? 'table-info fw-bold' : ''}>
                  <td>50 m (Estado Actual)</td>
                  <td className="font-sans">Contacto Arenas Cuarcíferas</td>
                  <td>0.5 m</td>
                  <td>~390 L</td>
                  <td>0.8 L/s</td>
                  <td>Inestable (solo 0.2 ha)</td>
                  <td className="text-muted">$0 (Consolidado)</td>
                </tr>
                <tr className={targetDepth === 55 ? 'table-info fw-bold' : ''}>
                  <td>55 m (Intermedia)</td>
                  <td className="font-sans">Grava Aluvial Fina / Media</td>
                  <td>5.5 m</td>
                  <td>~4.300 L</td>
                  <td>1.8 L/s</td>
                  <td>1 Nave protegida (1.000 m²)</td>
                  <td className="text-dark">$2.175 USD</td>
                </tr>
                <tr className={targetDepth === 60 ? 'table-success fw-bold' : ''}>
                  <td>60 m (Recomendada)</td>
                  <td className="font-sans">Acuífero Productivo Consolidado</td>
                  <td className="text-success">10.5 m</td>
                  <td className="text-success">8.240 L</td>
                  <td className="text-success">2.5 L/s</td>
                  <td className="text-success">Hasta 3 Naves (3.000 m²)</td>
                  <td className="text-success">$3.000 USD</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PozoCalculatorPage;
