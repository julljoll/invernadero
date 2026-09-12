import React, { useState } from 'react';
import { Card, Row, Col, Badge, Alert, Button, ButtonGroup, Table } from 'react-bootstrap';
import { WellViewer } from '../../3d-viewers/WellViewer/WellViewer';
import { KpiCard } from '../../../shared/components/KpiCard';
import { BlockMath, InlineMath } from 'react-katex';

type WellScenario = '60m' | '120m';

export const Module05Well: React.FC = () => {
  const [scenario, setScenario] = useState<WellScenario>('60m');
  const [showTheis, setShowTheis] = useState<boolean>(false);

  // Demanda hídrica base del invernadero (1.000 m²)
  const dailyDemandL = 7500; // 7.5 m³/día pico

  // Parámetros por escenario validados en RAG (EXPEDIENTE_TECNICO_POZO_50M_CUARA.md y PLAN_VALIDACION_POZO_PROFUNDO_QUIBOR.md)
  const is60m = scenario === '60m';
  
  const totalDepthM = is60m ? 60 : 120;
  const staticWaterLevelM = is60m ? 49.5 : 70.0; // 49.5m acuífero libre superior vs 70.0m línea base estival profunda
  const pumpFlowLs = is60m ? 2.0 : 2.8; // 2.0 L/s continuo (1" a 1½") vs 2.8 L/s continuo (~2")
  const pumpFlowLh = pumpFlowLs * 3600; // 7,200 L/h vs 10,080 L/h
  const drawdownM = is60m ? 3.7 : 18.0; // Abatimiento estabilizado
  const dynamicWaterLevelM = staticWaterLevelM + drawdownM; // 53.2m vs 88.0m
  const waterColumnM = Number((totalDepthM - dynamicWaterLevelM).toFixed(1)); // 6.8m vs 32.0m
  const pumpingHoursNeeded = (dailyDemandL / pumpFlowLh).toFixed(2);
  const pumpPowerHp = is60m ? '2.0 HP' : '7.5 HP';
  const pumpSize = is60m ? '4" Sumergible (1.5"-2")' : '6" Industrial Sumergible';
  const hmtTotal = is60m ? '63.5 mca' : '100.5 mca';

  return (
    <div className="d-flex flex-column gap-4">
      <Card className="card-cockpit p-4">
        
        {/* Header y Toggle de Escenarios */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div>
            <h3 className="fs-6 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
              <span className="material-symbols-outlined text-info ms-sm">water_pump</span>
              <span>Análisis de Viabilidad Hidrogeológica y Diseño de Captación</span>
            </h3>
            <span className="text-secondary small">
              Valle de Quíbor (Municipio Jiménez, Lara) — Georref: 9°53'20.0"N, 69°35'35.0"W (Cota ~700 msnm)
            </span>
          </div>

          <ButtonGroup size="sm" className="shadow-sm">
            <Button 
              variant={is60m ? 'success' : 'outline-secondary'}
              className="fw-bold px-3"
              onClick={() => setScenario('60m')}
            >
              Pozo Artesanal a Pico (60m / Ø80cm / Concreto Ø70cm)
            </Button>
            <Button 
              variant={!is60m ? 'info' : 'outline-secondary'}
              className="fw-bold px-3"
              onClick={() => setScenario('120m')}
            >
              Expansión Industrial Rotaria (120m / Barreno 12¼" / Camisa 8" / Bomba 6" 7.5HP)
            </Button>
          </ButtonGroup>
        </div>

        {/* Tarjeta de Diagnóstico RAG y Garantía Científica */}
        <Alert variant={is60m ? 'success' : 'info'} className="d-flex flex-column gap-3 mb-4 border bg-opacity-10">
          <div className="d-flex align-items-start gap-3">
            <span className={`material-symbols-outlined fs-4 ${is60m ? 'text-success' : 'text-info'}`}>
              {is60m ? 'verified' : 'engineering'}
            </span>
            <div>
              <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                <h4 className={`fs-6 fw-bold mb-0 ${is60m ? 'text-success' : 'text-info'}`}>
                  {is60m 
                    ? 'Fase 1: Culminación Inmediata de Pozo Artesanal a 60m (Manual Ø80cm / Camisa Concreto Ø70cm)' 
                    : 'Fase 2: Perforación Profunda 120m con Camisa de 8" y Bomba Industrial de 6" (7.5 HP)'}
                </h4>
                {is60m && (
                  <Badge bg="success" pill className="text-xs px-2 py-1">
                    Garantía Científica CIDIAT-ULA
                  </Badge>
                )}
              </div>
              <p className="mb-0 text-dark small font-sans">
                {is60m 
                  ? 'El pozo actual a 50m fue excavado manualmente a pico (fuste cilíndrico vertical Ø 80 cm a tierra viva en arcillas masivas autoportantes Su > 120 kPa y verticalidad < 1°). Requiere profundizar solo 10m adicionales en el paquete de gravas negras lavadas de lidita y cuarzo con achique continuo hasta 60m. Se reviste con camisa de anillos de concreto armado de Ø 70 cm exterior (diámetro interior útil 60 cm) y empaque de grava cuarzosa 1/4". Con nivel estático a 49.5m, la columna sumergida de 10.5m genera un vaso buffer de ~3.800 L en reposo dentro del fuste (283 L/m). Una electrobomba sumergible de 2.0 HP entrega 1.5 a 2.0 L/s continuos (1 pulgada continua), cubriendo los 7.5 m³/día del invernadero en solo 1.04 horas de bombeo. Inversión estimada: $2.030 a $2.950 USD (ahorro >85% frente a perforación nueva).'
                  : 'Para bombear con una electrobomba sumergible industrial de 6" (7.5 HP), se requiere perforar a 12¼" (311 mm) con máquina rotaria y entubar con camisa de acero al carbono de 8" ASTM A53 Grado B (219.1 mm ext). Esto garantiza el espacio anular necesario para refrigerar el motor trifásico y colocar el empaque de grava cuarzosa 2-4 mm. Con 38m de filtros Johnson AISI 304 ranura 0.030", opera a un régimen ultra-laminar (Ve = 0.07 cm/s), venciendo un HMT de 100.5 mca con caudal continuo de 2.5 a 3.0 L/s para abastecer hasta 2.5 hectáreas (4 invernaderos).'}
              </p>
            </div>
          </div>

          {is60m && (
            <div className="bg-white p-3 rounded-2 border border-success border-opacity-25 shadow-xs">
              <div className="d-flex align-items-center gap-2 mb-2 text-success fw-bold text-xs">
                <span className="material-symbols-outlined fs-6">menu_book</span>
                <span>Fundamentación Hidrogeológica Regional (Jégat, Mora et al., CIDIAT-ULA / SHYQ 2012)</span>
              </div>
              <Row className="g-2 text-xs font-sans text-secondary">
                <Col xs={12} md={4}>
                  <div className="p-2 bg-light rounded border border-secondary-subtle">
                    <strong className="text-dark d-block mb-1">Espesor Saturado Cuara:</strong>
                    <span>El estudio determina textualmente que en el Sector Sur el relleno sedimentario alcanza hasta 230m con un <strong>espesor máximo saturado de 10 metros</strong>. Al profundizar a 60m se capta el 100% de esta columna productiva.</span>
                  </div>
                </Col>
                <Col xs={12} md={4}>
                  <div className="p-2 bg-light rounded border border-secondary-subtle">
                    <strong className="text-dark d-block mb-1">Litología de Paleocauce:</strong>
                    <span>Sedimentología in situ de gravas negras limpias de lidita y cuarzo cristalino. Conductividad hidráulica medida mediante ensayos Lefranc de <strong className="text-dark">K ≈ 10⁻³ m/s (86 - 432 m/día)</strong> y transmisividad <strong className="text-dark">T ≈ 860 - 2.500 m²/día</strong>.</span>
                  </div>
                </Col>
                <Col xs={12} md={4}>
                  <div className="p-2 bg-light rounded border border-secondary-subtle">
                    <strong className="text-dark d-block mb-1">Garantía Anti-Achique:</strong>
                    <span>La recarga radial del manto al fuste es de <strong className="text-dark">~33.2 L/s</strong>. Extraer solo 1.5 a 2.0 L/s representa menos del 6% del potencial del estrato, garantizando un régimen dinámico permanente sin riesgo de secado.</span>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Alert>

        {/* KPIs Hidráulicos del Pozo */}
        <Row className="g-3 mb-4">
          <Col xs={12} md={3}>
            <KpiCard
              label="Nivel Dinámico (ND)"
              value={`${dynamicWaterLevelM}`}
              unit="metros"
              subtext={`Caudal continuo: ${pumpFlowLs} L/s`}
              iconName="compress"
              variant="success"
            />
          </Col>

          <Col xs={12} md={3}>
            <KpiCard
              label="Potencia Bomba & HMT"
              value={pumpPowerHp}
              unit={`HMT ${hmtTotal}`}
              subtext={pumpSize}
              iconName="bolt"
              variant={is60m ? 'success' : 'info'}
            />
          </Col>

          <Col xs={12} md={3}>
            <KpiCard
              label={is60m ? "Vaso Buffer en Fuste" : "Columna de Agua Útil"}
              value={is60m ? "3.800 L" : `${waterColumnM} m`}
              unit={is60m ? "en reposo" : "metros"}
              subtext={is60m ? '283 L/m útil (Ø int 60cm)' : 'Reserva masiva para 4 naves'}
              iconName="water_full"
              variant="success"
            />
          </Col>

          <Col xs={12} md={3}>
            <KpiCard
              label="Tiempo Bombeo (1000m²)"
              value={`${pumpingHoursNeeded}`}
              unit="horas/día"
              subtext={`Consumo: ${dailyDemandL / 1000} m³/día`}
              iconName="timer"
              variant="success"
            />
          </Col>
        </Row>

        {/* Visor 3D del Pozo (Modo AutoCAD) */}
        <div className="rounded-3 overflow-hidden border border-secondary-subtle shadow-sm mb-4 position-relative">
          <WellViewer 
            scenario={scenario}
            totalDepthM={totalDepthM} 
            staticWaterLevelM={staticWaterLevelM}
            dynamicWaterLevelM={dynamicWaterLevelM} 
          />
        </div>

        {/* Ficha Técnica Comparativa de Ingeniería (Valle de Quíbor) */}
        <Card className="border border-secondary-subtle bg-light p-3 rounded-3 mb-3">
          <div className="d-flex align-items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary fs-5">table_chart</span>
            <h5 className="fs-6 fw-bold mb-0 text-dark">Especificaciones Técnicas Comparativas (RAG CIDIAT / Pozo Quíbor)</h5>
          </div>

          <Table responsive bordered size="sm" className="bg-white text-xs align-middle mb-0 font-sans">
            <thead className="table-dark">
              <tr>
                <th>Parámetro Hidráulico / Mecánico</th>
                <th className="text-center text-success">Pozo Artesanal Manual (60m)</th>
                <th className="text-center text-info">Expansión Profunda (120m)</th>
                <th>Criterio Técnico RAG Quíbor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="fw-bold">Método Constructivo</td>
                <td className="text-center font-monospace text-success">Excavación manual a pico</td>
                <td className="text-center font-monospace text-info">Perforación rotaria mecanizada</td>
                <td>60m ejecutado por poceros calificados con achique; 120m requiere taladro y lodo bentonítico.</td>
              </tr>
              <tr>
                <td className="fw-bold">Profundidad Total</td>
                <td className="text-center font-monospace">60.0 m</td>
                <td className="text-center font-monospace fw-bold text-info">120.0 m</td>
                <td>60m alcanza acuífero Cuara (grava negra); 120m alcanza lentes basales Formación Morán.</td>
              </tr>
              <tr>
                <td className="fw-bold">Espesor Saturado Captado</td>
                <td className="text-center font-monospace text-success fw-bold">10.0 metros (100%)</td>
                <td className="text-center font-monospace fw-bold text-info">Acuífero multicapa profundo</td>
                <td>Jégat &amp; Mora (2012) validan que el sector Sur posee un espesor saturado máximo de 10 m.</td>
              </tr>
              <tr>
                <td className="fw-bold">Permeabilidad y Transmisividad</td>
                <td className="text-center font-monospace text-success fw-bold">K ≈ 10⁻³ m/s | T ≈ 860-2500 m²/d</td>
                <td className="text-center font-monospace fw-bold text-info">T ≈ 250-450 m²/d</td>
                <td>Gravas de lidita y cuarzo de alta conductividad comprobada mediante ensayos tipo Lefranc.</td>
              </tr>
              <tr>
                <td className="fw-bold">Diámetro Fuste / Barreno</td>
                <td className="text-center font-monospace text-success fw-bold">Ø 80 cm (Fuste a pico)</td>
                <td className="text-center font-monospace fw-bold text-info">Ø 12¼" (311 mm) Rotario</td>
                <td>Fuste manual a tierra viva autoportante (Su &gt; 120 kPa); 12¼" broca tricono para camisa 8".</td>
              </tr>
              <tr>
                <td className="fw-bold">Camisa de Entubado (Casing)</td>
                <td className="text-center font-monospace text-success fw-bold">Anillos Concreto Ø 70 cm ext</td>
                <td className="text-center font-monospace fw-bold text-warning">8" ASTM A53 Gr. B (219.1 mm)</td>
                <td>Concreto Ø int útil 60 cm; acero 8" <strong>obligatorio</strong> para refrigeración de bomba 6".</td>
              </tr>
              <tr>
                <td className="fw-bold">Vaso Buffer en Fuste</td>
                <td className="text-center font-monospace text-success fw-bold">~3.800 Litros (283 L/m)</td>
                <td className="text-center font-monospace text-muted">~380 Litros (31 L/m)</td>
                <td>El fuste de concreto de 60cm actúa como cisterna natural de recarga y amortiguación hidráulica.</td>
              </tr>
              <tr>
                <td className="fw-bold">Bomba Sumergible &amp; Motor</td>
                <td className="text-center font-monospace">4" Sumergible 2.0 HP (Trif/Mon)</td>
                <td className="text-center font-monospace fw-bold text-success">6" Industrial 7.5 HP (Trifásica)</td>
                <td>2.0 HP entrega 1" continua a 69.0 mca; 7.5 HP entrega 2" continua a 100.5 mca.</td>
              </tr>
              <tr>
                <td className="fw-bold">Carga Manométrica (HMT)</td>
                <td className="text-center font-monospace">69.0 mca</td>
                <td className="text-center font-monospace fw-bold">100.5 mca</td>
                <td>ND dinámico + desnivel a cabezal + pérdidas de fricción y 1 bar de presión residual.</td>
              </tr>
              <tr>
                <td className="fw-bold">Filtros de Captación</td>
                <td className="text-center font-monospace">10 m ranurado continuo basal</td>
                <td className="text-center font-monospace fw-bold">38 m Johnson AISI 304 (Slot 0.030")</td>
                <td>Régimen laminar Ve &lt; 0.03 m/s (Sichardt) sin turbulencia ni arrastre de arena.</td>
              </tr>
              <tr>
                <td className="fw-bold">Caudal Continuo de Diseño</td>
                <td className="text-center font-monospace text-success fw-bold">1.5 - 2.0 L/s (1" continuo)</td>
                <td className="text-center font-monospace text-info fw-bold">2.5 - 3.0 L/s (~2" continuo)</td>
                <td>60m abastece 1 nave (1.000 m²); 120m abastece hasta 4 naves (2.5 ha).</td>
              </tr>
              <tr>
                <td className="fw-bold">Garantía Anti-Achique</td>
                <td className="text-center font-monospace text-success fw-bold">CERO RIESGO (Recarga &gt; 33 L/s)</td>
                <td className="text-center font-monospace text-info fw-bold">Mínimo (Recarga regional)</td>
                <td>Extracción requerida representa &lt; 6% de la capacidad de aporte radial de la grava.</td>
              </tr>
              <tr>
                <td className="fw-bold">Presupuesto Llave en Mano</td>
                <td className="text-center font-monospace text-success fw-bold">~$2.030 - $2.950 USD</td>
                <td className="text-center font-monospace text-info fw-bold">~$18.500 - $25.800 USD</td>
                <td>Amortización: &lt; 2 meses (60m) vs 1.3 años (120m) frente a camiones cisterna ($30/cisterna).</td>
              </tr>
            </tbody>
          </Table>
        </Card>

        {/* Progressive Disclosure de Ecuaciones Cooper-Jacob y HMT */}
        <div className="pt-2 border-top border-secondary-subtle">
          <Button
            variant="link"
            size="sm"
            onClick={() => setShowTheis(!showTheis)}
            className="text-info text-decoration-none p-0 d-flex align-items-center gap-1 font-monospace text-xs"
          >
            <span className="material-symbols-outlined ms-sm">
              {showTheis ? 'expand_less' : 'functions'}
            </span>
            <span>{showTheis ? 'Ocultar Ecuaciones Hidráulicas (KaTeX)' : 'Ver Fundamento Matemático: Ecuaciones de Recarga Radial, Abatimiento y Carga Dinámica HMT (KaTeX)'}</span>
          </Button>

          {showTheis && (
            <div className="formula-box formula-box-water mt-3 p-3 rounded-3 border border-info border-opacity-25 bg-light">
              <Row className="g-3">
                {is60m ? (
                  <>
                    <Col xs={12} md={6}>
                      <div className="text-secondary text-xs mb-2 font-sans fw-bold">
                        1. Ecuación de Aporte Radial al Pozo Artesanal (Dupuit-Thiem para Ø 80 cm):
                      </div>
                      <BlockMath math="Q = \frac{\pi K (H^2 - h_w^2)}{\ln(R / r_w)} \approx \mathbf{33.2\ \text{L/s}\ (Aporte\ Máximo)}" />
                      <div className="text-secondary small mt-2 font-sans lh-base text-xs">
                        Donde <InlineMath math="K = 10^{-3}\ \text{m/s}" /> (gravas de lidita), <InlineMath math="H = 10\ \text{m}" /> (espesor saturado total), <InlineMath math="h_w = 7.5\ \text{m}" /> (abatimiento controlado de 2.5m), <InlineMath math="r_w = 0.40\ \text{m}" /> y radio de influencia <InlineMath math="R = 25\ \text{m}" />.
                        Para mantener la velocidad crítica de entrada <InlineMath math="v_e < 0.03\ \text{m/s}" /> (criterio de Sichardt), el caudal de explotación continuo se fija en <strong className="text-success">1.5 a 2.0 L/s</strong>.
                      </div>
                    </Col>

                    <Col xs={12} md={6}>
                      <div className="text-secondary text-xs mb-2 font-sans fw-bold">
                        2. Altura Manométrica Total (HMT) y Potencia de Bomba 2.0 HP:
                      </div>
                      <BlockMath math="HMT = ND + \Delta z_{\text{tanque}} + P_{\text{serv}} + h_f = 52.0 + 3.0 + 10.0 + 4.0 = \mathbf{69.0\ \text{mca}}" />
                      <div className="text-secondary small mt-2 font-sans lh-base text-xs">
                        Potencia requerida en el eje con rendimiento combinado (<InlineMath math="\eta_b = 72\%" />, <InlineMath math="\eta_m = 88\%" />):
                        <InlineMath math="P_{HP} = \frac{\gamma \cdot Q \cdot HMT}{75 \cdot \eta} = \frac{1000 \cdot 0.0015 \cdot 69}{75 \cdot 0.633} \approx \mathbf{2.18\ \text{HP}} \rightarrow \mathbf{2.0\ \text{HP comercial}}" />.
                      </div>
                    </Col>
                  </>
                ) : (
                  <>
                    <Col xs={12} md={6}>
                      <div className="text-secondary text-xs mb-2 font-sans fw-bold">
                        1. Ecuación de Abatimiento Régimen Transitorio (Cooper &amp; Jacob):
                      </div>
                      <BlockMath math="s = \frac{Q}{4\pi T} \ln\left(\frac{2.25\, T\, t}{r^2 S}\right)" />
                      <div className="text-secondary small mt-2 font-sans lh-base text-xs">
                        Donde <InlineMath math={`Q = ${pumpFlowLs}\\ \\text{L/s}`} />, transmisividad <InlineMath math="T = 250\\ \\text{m}^2/\\text{día}" /> y coeficiente de almacenamiento <InlineMath math="S = 0.001" /> (Morán semiconfinado multicapa).
                      </div>
                    </Col>

                    <Col xs={12} md={6}>
                      <div className="text-secondary text-xs mb-2 font-sans fw-bold">
                        2. Altura Manométrica Total (HMT) para Bomba de 7.5 HP a 120m:
                      </div>
                      <BlockMath math="HMT = H_{\text{geom}} + h_f + P_{\text{serv}} = 88.0 + 7.5 + 5.0 = \mathbf{100.5\ \text{mca}}" />
                      <div className="text-secondary small mt-2 font-sans lh-base text-xs">
                        La potencia requerida con rendimiento del 65%: 
                        <InlineMath math="P_{HP} = \frac{\gamma \cdot Q \cdot HMT}{75 \cdot \eta} = \frac{1000 \cdot 0.0028 \cdot 100.5}{75 \cdot 0.65} \approx \mathbf{5.77\ \text{HP}} \rightarrow \mathbf{7.5\ \text{HP comercial}}" />.
                      </div>
                    </Col>
                  </>
                )}
              </Row>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

