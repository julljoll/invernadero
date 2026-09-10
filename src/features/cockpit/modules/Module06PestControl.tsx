import React, { useState } from 'react';

interface PestItem {
  id: string;
  name: string;
  scientificName: string;
  physicalExclusion: boolean;
  meshEffectiveness: string;
  iracCode: string;
  biologicalControl: string;
  chemicalActive: string;
  quiborRiskNotes: string;
  severity: 'high' | 'medium' | 'critical';
}

const PEST_DATABASE: PestItem[] = [
  {
    id: 'trips',
    name: 'Trips de las Flores',
    scientificName: 'Frankliniella occidentalis',
    physicalExclusion: true,
    meshEffectiveness: '100% Barrera Física (Poro ≤ 192 µm)',
    iracCode: 'IRAC 5 / 6',
    biologicalControl: 'Orius insidiosus · Trampas cromáticas azules',
    chemicalActive: 'Spinosad · Emamectina benzoato',
    quiborRiskNotes: 'Vector del virus del bronceado del tomate (TSWV). La malla 50 mesh blanca detiene su ingreso perimetral.',
    severity: 'high',
  },
  {
    id: 'mosca_blanca',
    name: 'Mosca Blanca',
    scientificName: 'Bemisia tabaci',
    physicalExclusion: true,
    meshEffectiveness: '100% Barrera Física (Poro ≤ 192 µm)',
    iracCode: 'IRAC 4A / 28',
    biologicalControl: 'Chrysoperla carnea · Encarsia formosa',
    chemicalActive: 'Flupyradifurone · Cyantraniliprole',
    quiborRiskNotes: 'Vector de Geminivirus (TYLCV). El color blanco difuso de la malla desorienta su vuelo fototáctico.',
    severity: 'critical',
  },
  {
    id: 'acaros',
    name: 'Araña Roja & Ácaro Blanco',
    scientificName: 'Tetranychus urticae / Polyphagotarsonemus',
    physicalExclusion: false,
    meshEffectiveness: '0% Exclusión Física (Tamaño < 150 µm)',
    iracCode: 'IRAC 10B / 21A / 23',
    biologicalControl: 'Amblyseius swirskii · Phytoseiulus persimilis',
    chemicalActive: 'Etoxazol · Spiromesifen · Azufre micronizado',
    quiborRiskNotes: '¡ATENCIÓN! Ninguna malla comercial los retiene. Su proliferación en Quíbor estalla con sequedad (HR < 50%) y calor.',
    severity: 'critical',
  },
  {
    id: 'minador',
    name: 'Minador de la Hoja',
    scientificName: 'Liriomyza sativae / huidobrensis',
    physicalExclusion: true,
    meshEffectiveness: '100% Barrera Física',
    iracCode: 'IRAC 17 / 6',
    biologicalControl: 'Diglyphus isaea · Trampas amarillas',
    chemicalActive: 'Ciromazina · Abamectina',
    quiborRiskNotes: 'Provoca galerías foliares reduciendo la tasa fotosintética. Excluido al 100% por malla 50 mesh.',
    severity: 'medium',
  },
  {
    id: 'lepidopteros',
    name: 'Polilla del Tomate / Cogollero',
    scientificName: 'Tuta absoluta / Spodoptera frugiperda',
    physicalExclusion: true,
    meshEffectiveness: '100% Barrera Física Total',
    iracCode: 'IRAC 28 / 22A',
    biologicalControl: 'Bacillus thuringiensis · Feromonas sexuales',
    chemicalActive: 'Clorantraniliprol · Indoxacarb',
    quiborRiskNotes: 'Daño directo en frutos y brotes apicales. Retenido completamente sin necesidad de insecticidas pesados.',
    severity: 'high',
  },
  {
    id: 'pulgones',
    name: 'Pulgón Verde y del Algodón',
    scientificName: 'Myzus persicae / Aphis gossypii',
    physicalExclusion: true,
    meshEffectiveness: '100% Barrera Física',
    iracCode: 'IRAC 4D / 9B',
    biologicalControl: 'Aphidoletes aphidimyza · Mariquitas (Coccinellidae)',
    chemicalActive: 'Flonicamid · Sulfoxaflor',
    quiborRiskNotes: 'Segregan melaza favoreciendo fumagina y transmiten virus de polerovirus y potyvirus.',
    severity: 'medium',
  },
];

export const Module06PestControl: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'excluded' | 'critical'>('all');

  const filteredPests = PEST_DATABASE.filter((p) => {
    if (filter === 'excluded') return p.physicalExclusion;
    if (filter === 'critical') return !p.physicalExclusion || p.severity === 'critical';
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Banner Especificación Malla Estándar Quíbor */}
      <div className="card-cockpit p-4 mb-4">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="agro-chip agro-chip-green text-xs font-mono">Estándar Quíbor Validado</span>
              <span className="agro-chip agro-chip-sun text-xs font-mono">Difusión Solar Térmica</span>
            </div>
            <h3 className="fs-5 fw-bold text-dark mb-1 d-flex align-items-center gap-2">
              <span className="material-symbols-outlined text-brand-bright ms-sm">shield</span>
              <span>Malla 50 Mesh Blanca (110 gsm · Monofilamento HDPE Virgen)</span>
            </h3>
            <p className="text-secondary small mb-0">
              Poro hidráulico &le; 192 &mu;m (50&times;25 hilos/pulgada) · Tasa de bloqueo físico de insectos vectores sin asfixiar la renovación de aire (RAH).
            </p>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <div className="bg-light p-2.5 rounded-3 border border-secondary-subtle text-center">
              <div className="text-secondary text-xs">Gramaje Óptimo</div>
              <div className="font-mono text-success fw-bold fs-6">110 g/m²</div>
            </div>
            <div className="bg-light p-2.5 rounded-3 border border-secondary-subtle text-center">
              <div className="text-secondary text-xs">Poro Máximo</div>
              <div className="font-mono text-info fw-bold fs-6">&le; 192 &mu;m</div>
            </div>
            <div className="bg-light p-2.5 rounded-3 border border-secondary-subtle text-center">
              <div className="text-secondary text-xs">Color Térmico</div>
              <div className="font-mono text-warning fw-bold fs-6">Blanco Difuso</div>
            </div>
          </div>
        </div>

        {/* Alerta Destacada sobre Ácaros */}
        <div className="mt-3 p-3 bg-danger-subtle border border-danger-subtle rounded-3 d-flex align-items-start gap-2.5">
          <span className="material-symbols-outlined text-danger ms-sm mt-0.5">report_problem</span>
          <div className="small">
            <strong className="text-danger">PUNTO CRÍTICO FITOSANITARIO (ÁCAROS Y ARAÑA ROJA):</strong>
            <span className="text-dark ms-1">
              La araña roja (<em>Tetranychus urticae</em>) y el ácaro blanco (<em>Polyphagotarsonemus latus</em>) <strong>NO son retenidos por ninguna malla comercial del mundo</strong> debido a su tamaño microscópico (&lt; 150 &mu;m). Su control en el Valle de Quíbor es <strong>100% de manejo integrado</strong>: material vegetal certificado, mantenimiento de Humedad Relativa &gt; 60% en horas cálidas para frenar su ovoposición, y depredadores <em>Amblyseius swirskii</em>.
            </span>
          </div>
        </div>
      </div>

      {/* Filtros y Matriz de Plagas */}
      <div className="card-cockpit p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <h4 className="fs-6 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <span className="material-symbols-outlined text-danger ms-sm">pest_control</span>
            <span>Matriz de Manejo Integrado de Plagas &amp; Rotación IRAC</span>
          </h4>

          <div className="btn-group btn-group-sm bg-light p-1 rounded-pill border border-secondary-subtle">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`btn btn-sm rounded-pill px-3 fw-bold ${filter === 'all' ? 'btn-success text-white' : 'text-secondary border-0'}`}
            >
              Todas (6)
            </button>
            <button
              type="button"
              onClick={() => setFilter('excluded')}
              className={`btn btn-sm rounded-pill px-3 fw-bold ${filter === 'excluded' ? 'btn-success text-white' : 'text-secondary border-0'}`}
            >
              Excluidas por Malla (5)
            </button>
            <button
              type="button"
              onClick={() => setFilter('critical')}
              className={`btn btn-sm rounded-pill px-3 fw-bold ${filter === 'critical' ? 'btn-danger text-white' : 'text-secondary border-0'}`}
            >
              Críticas / No Retenidas (Ácaros)
            </button>
          </div>
        </div>

        <div className="row g-3">
          {filteredPests.map((pest) => (
            <div className="col-12 col-md-6 col-lg-4" key={pest.id}>
              <div className="card-cockpit p-3 h-100 d-flex flex-column border-secondary-subtle bg-light hover-border-success transition-all">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h5 className="fs-6 fw-bold text-dark mb-0">{pest.name}</h5>
                    <span className="text-secondary small font-monospace fst-italic">{pest.scientificName}</span>
                  </div>
                  <span className={`badge font-monospace text-xs ${pest.physicalExclusion ? 'bg-success-subtle text-success-emphasis border border-success-subtle' : 'bg-danger-subtle text-danger border border-danger-subtle'}`}>
                    {pest.iracCode}
                  </span>
                </div>

                <div className="mb-2">
                  <span className={`agro-chip text-xs ${pest.physicalExclusion ? 'agro-chip-green' : 'agro-chip-alert'}`}>
                    <span className="material-symbols-outlined ms-sm">
                      {pest.physicalExclusion ? 'check_circle' : 'cancel'}
                    </span>
                    <span>{pest.meshEffectiveness}</span>
                  </span>
                </div>

                <p className="text-secondary small mb-3 flex-grow-1 lh-sm">
                  {pest.quiborRiskNotes}
                </p>

                <div className="border-top border-secondary-subtle pt-2 text-xs space-y-1 mt-auto">
                  <div>
                    <strong className="text-success">Control Biológico:</strong>{' '}
                    <span className="text-secondary">{pest.biologicalControl}</span>
                  </div>
                  <div className="mt-1">
                    <strong className="text-warning-emphasis">Rotación Química:</strong>{' '}
                    <span className="text-secondary">{pest.chemicalActive}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
