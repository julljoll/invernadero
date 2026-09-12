import React, { useState } from 'react';
import { GreenhouseViewer } from '../3d-viewers/GreenhouseViewer/GreenhouseViewer';
import { Slider } from '../../shared/components/Slider';

interface GreenhousePackage {
  id: string;
  name: string;
  targetCrop: string;
  ridgeHeightM: number;
  gutterHeightM: number;
  meshGsm: number;
  pillarsCount: number;
  priceUsd: number;
  highlight: string;
  features: string[];
}

export const GreenhouseSalesPage: React.FC = () => {
  const [selectedPackageId, setSelectedPackageId] = useState<string>('mesh-1000');
  const [customLengthM, setCustomLengthM] = useState<number>(50); // ancho fijo 20m, largo ajustable

  const packages: GreenhousePackage[] = [
    {
      id: 'mesh-1000',
      name: 'Casa de Malla Clásica 1.000 m²',
      targetCrop: 'Pimentón Híbrido Tecnificado (2.500 plantas)',
      gutterHeightM: 3.0,
      ridgeHeightM: 5.5,
      meshGsm: 130,
      pillarsCount: 108,
      priceUsd: 14500,
      highlight: 'Máxima Tenacidad Eólica Quíbor',
      features: [
        'Estructura de 20m × 50m (1.000 m² efectivos)',
        '108 pilares en tubería Sch 40 galvanizada en caliente',
        'Malla 50 Mesh 130 gsm blanca con 5 años de garantía UV',
        'Refuerzo Este con doble tensor y guayas de 3/8"',
        'Sistema de doble puerta esclusa sanitaria anti-trips',
        'Líneas de tutorado Hortomalla para 2.500 plantas de pimentón',
      ],
    },
    {
      id: 'high-wire-1000',
      name: 'Casa de Malla Reforzada Pimentón 1.000 m²',
      targetCrop: 'Pimentón de Alto Rendimiento',
      gutterHeightM: 3.8,
      ridgeHeightM: 6.8,
      meshGsm: 110,
      pillarsCount: 120,
      priceUsd: 17800,
      highlight: 'Volumen Buffer Térmico Máximo',
      features: [
        'Altura cumbrera 6.8m para evacuar bolsas de calor térmico',
        'Malla 110 gsm optimizada para flujo convectivo (ΔT < 1.8 °C)',
        'Estructura calculada para carga vertical de tutorado (15 kg/m²)',
        'Refuerzo perimetral con zapatas de concreto ciclópeo',
        '7 extractores eólicos cenitales de 24" para calma térmica',
        'Garantía estructural de 10 años contra fatiga mecánica',
      ],
    },
    {
      id: 'tropical-hybrid',
      name: 'Invernadero Híbrido Polietileno + Malla para Pimentón',
      targetCrop: 'Pimentón Tecnificado / Semilleros',
      gutterHeightM: 4.0,
      ridgeHeightM: 6.5,
      meshGsm: 110,
      pillarsCount: 120,
      priceUsd: 21500,
      highlight: 'Control Total de Lluvias & Humedad',
      features: [
        'Techo en polietileno térmico difuso tricapa (200 micras)',
        'Laterales en Malla 50 Mesh 110 gsm blanca',
        'Canales pluviales para captación de lluvia (mayo-octubre)',
        'Protección total contra tizón tardío y bacteriosis foliar',
        'Ventilación cenital protegida tipo diente de sierra',
        'Apto para fertirriego automatizado con sensores IoT',
      ],
    },
  ];

  const currentPkg = packages.find((p) => p.id === selectedPackageId) || packages[0];
  const calculatedAreaM2 = 20 * customLengthM;
  const areaRatio = calculatedAreaM2 / 1000;
  const estimatedPriceUsd = Math.round(currentPkg.priceUsd * areaRatio);

  const waMessage = encodeURIComponent(
    `Hola Agrovenecua, solicito cotización formal para construcción de invernadero en Quíbor:\n` +
    `• Modelo: ${currentPkg.name}\n` +
    `• Dimensiones: 20m × ${customLengthM}m (${calculatedAreaM2.toLocaleString()} m²)\n` +
    `• Cultivo Destino: ${currentPkg.targetCrop}\n` +
    `• Altura Cumbrera: ${currentPkg.ridgeHeightM}m | Alero: ${currentPkg.gutterHeightM}m\n` +
    `• Presupuesto Estimado: ~$${estimatedPriceUsd.toLocaleString()} USD Llave en Mano\n` +
    `Por favor coordinar visita técnica de inspección en terreno.`
  );

  return (
    <div className="py-5">
      <div className="container-xl d-flex flex-column gap-5">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="badge bg-success bg-opacity-10 border border-success border-opacity-25 text-success rounded-pill px-3 py-1 text-uppercase fw-bold mb-2">
            Ingeniería Estructural Agronómica · Valle de Quíbor
          </span>
          <h1 className="display-5 fw-bold text-dark tracking-tight mb-3">
            Estructuras Protegidas e <span className="text-success">Invernaderos 1.000 m²</span>
          </h1>
          <p className="lead text-secondary fs-6 mb-0">
            Diseño e instalación llave en mano adaptado al microclima de Jiménez: ráfagas del Este de 27 km/h, alta radiación UV y requerimientos bioclimáticos para 2.500 plantas de pimentón.
          </p>
        </div>

        {/* Visor 3D de Estructura */}
        <div className="card card-agro p-2 shadow-sm">
          <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center px-3 py-2">
            <span className="text-secondary text-xs fw-bold text-uppercase d-flex align-items-center gap-1">
              <span className="material-symbols-outlined text-success ms-sm">view_in_ar</span>
              <span>Modelo 3D Estructural: {currentPkg.name} ({customLengthM}m Largo)</span>
            </span>
            <span className="badge bg-success bg-opacity-25 text-success font-monospace">
              Cumbrera: {currentPkg.ridgeHeightM}m / Alero: {currentPkg.gutterHeightM}m
            </span>
          </div>
          <div style={{ height: '400px' }}>
            <GreenhouseViewer
              widthM={20}
              lengthM={customLengthM}
              gutterHeightM={currentPkg.gutterHeightM}
              ridgeHeightM={currentPkg.ridgeHeightM}
            />
          </div>
        </div>

        {/* Ajuste de Medidas y Paquetes */}
        <div className="card card-agro p-4 shadow-sm">
          <div className="row g-4 align-items-center">
            <div className="col-12 col-lg-7">
              <h3 className="fs-5 fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                <span className="material-symbols-outlined text-success ms-md">straighten</span>
                <span>Personalizar Longitud de la Nave (Ancho estándar: 20 m)</span>
              </h3>
              <Slider
                label="Longitud de Nave:"
                value={customLengthM}
                min={30}
                max={100}
                step={5}
                formatValue={(v) => `${v} metros (${(20 * v).toLocaleString()} m² de nave)`}
                accentColor="success"
                iconName="crop_landscape"
                onChange={setCustomLengthM}
              />
            </div>
            <div className="col-12 col-lg-5">
              <div className="p-3 bg-light rounded-3 border border-secondary-subtle d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-secondary text-xs">Presupuesto Estimado Llave en Mano</div>
                  <div className="fs-3 fw-bold font-mono text-success">${estimatedPriceUsd.toLocaleString()} USD</div>
                  <div className="text-secondary text-xs">Incluye pilares Sch 40, malla, guayas e instalación</div>
                </div>
                <a
                  href={`https://wa.me/584160000000?text=${waMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success fw-bold rounded-pill px-3 py-2 d-flex align-items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined ms-sm">chat</span>
                  <span>Cotizar</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Catálogo de Paquetes Llave en Mano */}
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {packages.map((pkg) => {
            const isSelected = selectedPackageId === pkg.id;
            return (
              <div className="col" key={pkg.id}>
                <div
                  onClick={() => setSelectedPackageId(pkg.id)}
                  className={`card card-agro h-100 p-4 cursor-pointer transition-all ${
                    isSelected ? 'border-success border-opacity-75 shadow-lg' : 'border-secondary-subtle'
                  }`}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-success bg-opacity-25 text-success rounded-pill font-monospace">
                      {pkg.highlight}
                    </span>
                    <span className={`material-symbols-outlined ms-md ${isSelected ? 'text-success' : 'text-secondary'}`}>
                      {isSelected ? 'radio_button_checked' : 'radio_button_unchecked'}
                    </span>
                  </div>

                  <h3 className="fs-5 fw-bold text-dark mb-1">{pkg.name}</h3>
                  <div className="text-secondary text-xs mb-3">{pkg.targetCrop}</div>

                  <div className="fs-3 fw-bold font-mono text-success mb-3">
                    ${pkg.priceUsd.toLocaleString()} <span className="fs-6 fw-normal text-secondary font-monospace">USD (1.000 m²)</span>
                  </div>

                  <ul className="list-unstyled text-secondary small d-flex flex-column gap-2 mb-4">
                    {pkg.features.map((feat, fIdx) => (
                      <li key={fIdx} className="d-flex align-items-start gap-2">
                        <span className="material-symbols-outlined text-success ms-sm mt-0.5">check_circle</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPackageId(pkg.id);
                    }}
                    className={`btn w-100 rounded-pill fw-bold mt-auto ${
                      isSelected ? 'btn-success text-white shadow-sm' : 'btn-outline-success'
                    }`}
                  >
                    {isSelected ? 'Configuración Seleccionada' : 'Seleccionar Paquete'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default GreenhouseSalesPage;
