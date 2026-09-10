import React from 'react';
import { useAgroStore } from '../../../shared/store/useAgroStore';
import { CROPS_CATALOG } from '../../../core/constants/crops';
import { GreenhouseViewer } from '../../3d-viewers/GreenhouseViewer/GreenhouseViewer';
import { Slider } from '../../../shared/components/Slider';

export const Module03Structure: React.FC = () => {
  const {
    selectedCrop,
    greenhouseLengthM,
    greenhouseWidthM,
    gutterHeightM,
    ridgeHeightM,
    setGreenhouseDimensions,
  } = useAgroStore();

  const crop = CROPS_CATALOG[selectedCrop];
  const isTomato = selectedCrop === 'tomato';
  const isHeightTooLowForTomato = isTomato && (gutterHeightM < 3.0 || ridgeHeightM < 5.0);

  return (
    <div className="card-cockpit p-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h3 className="fs-6 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <span className="material-symbols-outlined text-brand-bright ms-sm">domain</span>
            <span>Inspección Estructural CAD 3D &amp; Parámetros Bioclimáticos</span>
          </h3>
          <span className="text-secondary small">
            Nave Estándar Quíbor ({greenhouseWidthM}m × {greenhouseLengthM}m = {greenhouseWidthM * greenhouseLengthM} m²) · Orientación Este-Oeste
          </span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-success bg-opacity-15 border border-success border-opacity-30 text-success font-monospace">
            108 Pilares Tubo Sch 40
          </span>
          <span className="badge bg-warning bg-opacity-15 border border-warning border-opacity-30 text-warning-emphasis font-monospace">
            Viento Este: Ráfaga 27 km/h (FS ≥ 1.5)
          </span>
        </div>
      </div>

      {/* Regla de Oro Agronómica Quíbor: Alerta Bioclimática */}
      {isHeightTooLowForTomato ? (
        <div className="p-3 mb-3 bg-danger-subtle border border-danger-subtle rounded-3 d-flex align-items-start gap-2">
          <span className="material-symbols-outlined text-danger ms-sm mt-0.5">warning</span>
          <div>
            <strong className="text-danger">RESTRICCIÓN AGRONÓMICA CRÍTICA PARA TOMATE INDETERMINADO:</strong>
            <p className="text-dark small mb-1 mt-0.5">
              El cultivo de tomate de hilo alto (tutorado a 2.2 m) requiere un volumen buffer de aire elevado. Diseñar con alero menor a <strong>3.0 m</strong> o cumbrera menor a <strong>5.5 m</strong> acumula calor radiante en la zona de fructificación (&gt; 32 °C – 34 °C), provocando <strong>aborto floral masivo y marchitez por calor</strong>.
            </p>
            <button
              type="button"
              onClick={() => setGreenhouseDimensions({ gutterHeightM: 3.5, ridgeHeightM: 5.8 })}
              className="btn btn-sm btn-danger rounded-pill fw-bold text-xs mt-1"
            >
              Ajustar a Estándar Seguro (3.5m Alero / 5.8m Cumbrera)
            </button>
          </div>
        </div>
      ) : (
        <div className="p-2.5 mb-3 bg-success bg-opacity-10 border border-success border-opacity-25 rounded-3 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <span className="material-symbols-outlined text-success ms-sm">verified</span>
            <span className="text-dark small">
              <strong>Geometría Bioclimática Adecuada:</strong> Altura a cumbrera de <strong>{ridgeHeightM}m</strong> y alero de <strong>{gutterHeightM}m</strong> para <em>{crop.name}</em> en Quíbor.
            </span>
          </div>
          <span className="agro-chip agro-chip-green text-xs font-mono">Buffer Térmico Óptimo</span>
        </div>
      )}

      {/* Controles Interactivos de Geometría */}
      <div className="row g-3 mb-3 bg-light p-3 rounded-4 border border-secondary-subtle">
        <div className="col-12 col-md-3">
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
        </div>
        <div className="col-12 col-md-3">
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
        </div>
        <div className="col-12 col-md-3">
          <Slider
            label="Altura Alero (Canal) (m):"
            value={gutterHeightM}
            min={2.0}
            max={5.0}
            step={0.25}
            unit="m"
            accentColor={gutterHeightM < 3.0 && isTomato ? 'warning' : 'info'}
            iconName="vertical_align_bottom"
            onChange={(val) => setGreenhouseDimensions({ gutterHeightM: val })}
          />
        </div>
        <div className="col-12 col-md-3">
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
        </div>
      </div>

      {/* Visor 3D Three.js */}
      <div className="rounded-3 overflow-hidden border border-secondary-subtle shadow-sm">
        <GreenhouseViewer
          widthM={greenhouseWidthM}
          lengthM={greenhouseLengthM}
          gutterHeightM={gutterHeightM}
          ridgeHeightM={ridgeHeightM}
        />
      </div>

      <div className="row g-2 mt-3 text-secondary small">
        <div className="col-12 col-md-4">
          <span className="text-dark fw-bold">Refuerzo Fachada Este:</span> Viento dominante al 88%. Postes esquineros dobles con anclaje de concreto a 1.20m de profundidad.
        </div>
        <div className="col-12 col-md-4">
          <span className="text-dark fw-bold">Tensores de Guaya:</span> Cable de acero galvanizado 1/4" 7×19 con tensores ojo-ojo de 5/8".
        </div>
        <div className="col-12 col-md-4">
          <span className="text-dark fw-bold">Cobertura Superior:</span> Malla 50 Mesh Blanca (110 gsm) con sujeción en perfil de aluminio tipo zigzag continuo.
        </div>
      </div>
    </div>
  );
};
