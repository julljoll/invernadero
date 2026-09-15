import React, { useState } from 'react';
import { Card, Row, Col, Badge, Alert, Button, ButtonGroup } from 'react-bootstrap';
import { GoogleSheetsSyncModal } from '../../../shared/components/GoogleSheetsSyncModal';

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
    quiborRiskNotes: 'Vector del virus de la marchitez manchada (TSWV) en pimentón. La malla 50 mesh blanca detiene su ingreso perimetral.',
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
    quiborRiskNotes: 'Vector de Geminivirus y virus del mosaico dorado en pimentón. El color blanco difuso de la malla desorienta su vuelo fototáctico.',
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
    name: 'Gusano Soldado & Barrenador del Fruto',
    scientificName: 'Spodoptera frugiperda / Helicoverpa zea',
    physicalExclusion: true,
    meshEffectiveness: '100% Barrera Física Total',
    iracCode: 'IRAC 28 / 22A',
    biologicalControl: 'Bacillus thuringiensis · Feromonas sexuales',
    chemicalActive: 'Clorantraniliprol · Indoxacarb',
    quiborRiskNotes: 'Daño directo por perforación en frutos de pimentón y brotes apicales. Retenido completamente sin necesidad de insecticidas pesados.',
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
  const [showGoogleSheetsModal, setShowGoogleSheetsModal] = useState<boolean>(false);

  const filteredPests = PEST_DATABASE.filter((p) => {
    if (filter === 'excluded') return p.physicalExclusion;
    if (filter === 'critical') return !p.physicalExclusion || p.severity === 'critical';
    return true;
  });

  return (
    <div className="d-flex flex-column gap-4">
      {/* Banner Especificación Malla Estándar Quíbor */}
      <Card className="card-cockpit p-4 mb-4">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="agro-chip agro-chip-green text-xs font-mono">Estándar Quíbor Validado</span>
              <span className="agro-chip agro-chip-sun text-xs font-mono">Difusión Solar Térmica</span>
            </div>
            <h3 className="fs-5 fw-bold text-dark mb-1 d-flex align-items-center gap-2">
              <span className="material-symbols-outlined text-brand-bright ms-sm">shield</span>
              <span>Malla 50 Mesh Blanca (130 gsm · Monofilamento HDPE Virgen)</span>
            </h3>
            <p className="text-secondary small mb-0">
              Poro hidráulico &le; 192 &mu;m (50&times;25 hilos/pulgada) · Tasa de bloqueo físico de insectos vectores sin asfixiar la renovación de aire (RAH).
            </p>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <div className="bg-light p-2.5 rounded-3 border border-secondary-subtle text-center">
              <div className="text-secondary text-xs">Gramaje Óptimo</div>
              <div className="font-mono text-success fw-bold fs-6">130 g/m²</div>
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
        <Alert variant="danger" className="mt-3 p-3 bg-danger-subtle border border-danger-subtle rounded-3 d-flex align-items-start gap-2.5 mb-0">
          <span className="material-symbols-outlined text-danger ms-sm mt-0.5">report_problem</span>
          <div className="small">
            <strong className="text-danger">PUNTO CRÍTICO FITOSANITARIO (ÁCAROS Y ARAÑA ROJA):</strong>
            <span className="text-dark ms-1">
              La araña roja (<em>Tetranychus urticae</em>) y el ácaro blanco (<em>Polyphagotarsonemus latus</em>) <strong>NO son retenidos por ninguna malla comercial del mundo</strong> debido a su tamaño microscópico (&lt; 150 &mu;m). Su control en el Valle de Quíbor es <strong>100% de manejo integrado</strong>: material vegetal certificado, mantenimiento de Humedad Relativa &gt; 60% en horas cálidas para frenar su ovoposición, y depredadores <em>Amblyseius swirskii</em>.
            </span>
          </div>
        </Alert>
      </Card>

      {/* Filtros y Matriz de Plagas */}
      <Card className="card-cockpit p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <h4 className="fs-6 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <span className="material-symbols-outlined text-danger ms-sm">pest_control</span>
            <span>Matriz de Manejo Integrado de Plagas &amp; Rotación IRAC</span>
          </h4>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            <Button
              variant="outline-success"
              size="sm"
              onClick={() => setShowGoogleSheetsModal(true)}
              className="d-flex align-items-center gap-1.5 fw-bold rounded-pill px-3 shadow-xs"
              title="Exportar Plan Fitosanitario y Rotación IRAC a Google Sheets"
            >
              <span className="material-symbols-outlined ms-sm">table_chart</span>
              <span>Guardar en Google Sheets</span>
            </Button>

            <ButtonGroup size="sm" className="bg-light p-1 rounded-pill border border-secondary-subtle">
              <Button
                variant={filter === 'all' ? 'success' : 'outline-secondary'}
                onClick={() => setFilter('all')}
                className={`rounded-pill px-3 fw-bold ${filter !== 'all' ? 'border-0' : ''}`}
              >
                Todas (6)
              </Button>
              <Button
                variant={filter === 'excluded' ? 'success' : 'outline-secondary'}
                onClick={() => setFilter('excluded')}
                className={`rounded-pill px-3 fw-bold ${filter !== 'excluded' ? 'border-0' : ''}`}
              >
                Excluidas por Malla (5)
              </Button>
              <Button
                variant={filter === 'critical' ? 'danger' : 'outline-secondary'}
                onClick={() => setFilter('critical')}
                className={`rounded-pill px-3 fw-bold ${filter !== 'critical' ? 'border-0' : ''}`}
              >
                Críticas / No Retenidas (Ácaros)
              </Button>
            </ButtonGroup>
          </div>
        </div>

        {/* ALERTA CRÍTICA DE EXCLUSIÓN DE ÁCAROS */}
        <Alert variant="danger" className="border border-danger border-opacity-30 rounded-3 p-3 mb-4 d-flex align-items-start gap-3 bg-danger bg-opacity-10 shadow-xs">
          <span className="material-symbols-outlined text-danger fs-4 mt-0.5">warning</span>
          <div>
            <h5 className="fs-6 fw-bold text-danger mb-1">
              ⚠️ Punto Crítico de Bioseguridad: La Malla 50 Mesh NO Retiene Ácaros
            </h5>
            <p className="mb-0 text-dark small font-sans">
              La araña roja (<em>Tetranychus urticae</em>, 120-150 µm) y el ácaro blanco (<em>Polyphagotarsonemus latus</em>, 80-120 µm) atraviesan fácilmente los 192 µm del poro de cualquier malla comercial. En Quíbor, su proliferación se acelera exponencialmente en períodos cálidos y secos (HR &lt; 50%, T &gt; 30°C), acortando su ciclo biológico de 14 a solo 5 días. <strong>Estrategia obligatoria:</strong> mantener humedad relativa foliar &gt; 60%, suelta temprana de <em>Amblyseius swirskii</em> y rotación química estricta por modo de acción (IRAC Grupo 10B / 21A / 23).
            </p>
          </div>
        </Alert>

        <Row className="g-3 mb-4">
          {filteredPests.map((pest) => (
            <Col xs={12} md={6} lg={4} key={pest.id}>
              <Card className="p-3 h-100 d-flex flex-column border-secondary-subtle bg-light hover-border-success transition-all shadow-xs">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h5 className="fs-6 fw-bold text-dark mb-0">{pest.name}</h5>
                    <span className="text-secondary small font-monospace fst-italic">{pest.scientificName}</span>
                  </div>
                  <Badge bg={pest.physicalExclusion ? 'success-subtle' : 'danger-subtle'} text={pest.physicalExclusion ? 'success-emphasis' : 'danger'} className="font-monospace text-xs border">
                    {pest.iracCode}
                  </Badge>
                </div>

                <div className="mb-2 d-flex flex-wrap gap-1">
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
              </Card>
            </Col>
          ))}
        </Row>

        {/* CALENDARIO DE LIBERACIÓN DE FAUNA BENÉFICA (IPM BIOLÓGICO) */}
        <div className="p-3 bg-white rounded-3 border border-secondary-subtle shadow-xs">
          <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
            <div className="d-flex align-items-center gap-2">
              <span className="material-symbols-outlined text-success fs-5">pest_control</span>
              <h5 className="fs-6 fw-bold text-dark mb-0">
                Calendario de Sueltas de Fauna Benéfica & Agentes Biológicos (Valle de Quíbor)
              </h5>
            </div>
            <Badge bg="success" className="text-2xs">
              Estrategia Preventiva Integrada
            </Badge>
          </div>

          <Row className="g-3 text-xs">
            <Col xs={12} md={4}>
              <div className="p-3 bg-light rounded border border-success border-opacity-30 h-100">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <strong className="text-success">Semana 2: Post-Trasplante</strong>
                  <Badge bg="success" className="font-monospace text-3xs">Preventivo</Badge>
                </div>
                <h6 className="fw-bold text-dark mb-1">Amblyseius swirskii</h6>
                <p className="text-secondary text-2xs mb-2">
                  Sobres de cría lenta (50 ácaros/m²) colgados en el tercio inferior. Depreda ninfas de trips y huevos de mosca blanca antes del cierre de calles.
                </p>
                <div className="text-muted text-3xs border-top pt-1">
                  Compatibilidad: Tolera azufre tras 72h de aplicado.
                </div>
              </div>
            </Col>

            <Col xs={12} md={4}>
              <div className="p-3 bg-light rounded border border-primary border-opacity-30 h-100">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <strong className="text-primary">Semana 4: Floración Inicial</strong>
                  <Badge bg="primary" className="font-monospace text-3xs">Pecíolo & Flores</Badge>
                </div>
                <h6 className="fw-bold text-dark mb-1">Orius insidiosus (Chinche Pirata)</h6>
                <p className="text-secondary text-2xs mb-2">
                  Dosis de 1 a 2 ind/m² en las flores abiertas. Voraz depredador de trips adultos y larvas refugiadas dentro de la corola del pimentón.
                </p>
                <div className="text-muted text-3xs border-top pt-1">
                  Requisito: Presencia de polen para establecimiento inicial.
                </div>
              </div>
            </Col>

            <Col xs={12} md={4}>
              <div className="p-3 bg-light rounded border border-warning border-opacity-50 h-100">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <strong className="text-warning-emphasis">Semana 6: Pleno Vegetativo</strong>
                  <Badge bg="warning" className="font-monospace text-3xs">Focos Foliares</Badge>
                </div>
                <h6 className="fw-bold text-dark mb-1">Chrysoperla carnea & Bacillus th.</h6>
                <p className="text-secondary text-2xs mb-2">
                  Sueltas en focos de pulgones y minadores (2-3 larvas L2/m²). Aplicación de <em>Bacillus thuringiensis</em> (Bt kurstaki) contra cogollero.
                </p>
                <div className="text-muted text-3xs border-top pt-1">
                  Monitoreo: 1 trampa cromática azul y amarilla cada 150 m².
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Card>

      {/* Modal de Sincronización Google Sheets */}
      <GoogleSheetsSyncModal
        show={showGoogleSheetsModal}
        onHide={() => setShowGoogleSheetsModal(false)}
        initialSheetId="04_Plan_Fitosanitario_IPM"
      />
    </div>
  );
};
