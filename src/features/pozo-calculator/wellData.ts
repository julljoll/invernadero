/**
 * wellData.ts — Parámetros Técnicos Validados del RAG
 * Fuentes: CIDIAT-ULA (Jégat, Mora, Hernández 2012), SHYQ (Alvarado, Massiah 1989)
 * Protocolo: PLAN_VALIDACION_POZO_PROFUNDO_QUIBOR.md
 */

// ─── LOCALIZACIÓN ─────────────────────────────────────────────────────────────
export const WELL_LOCATION = {
  name: 'Finca La Cigarronera',
  sector: 'Cuara, Municipio Jiménez, Estado Lara, Venezuela',
  lat: 9.886611,
  lon: -69.593694,
  elevationMsnm: 734,
  coordString: "9°53'15.8\"N  69°35'37.3\"W",
};

// ─── PARÁMETROS DEL ACUÍFERO REGIONAL (CIDIAT-ULA / SHYQ) ────────────────────
export const AQUIFER_PARAMS = {
  transmisivityM2Day: 180,       // T = 180 m²/día (Alvarado 1989, Jégat 2012)
  hydraulicConductivityMin: 1.8, // K mínimo m/día (pruebas Lefranc)
  hydraulicConductivityMax: 6.0, // K máximo m/día
  storativityMin: 5e-5,          // S libre superficial
  storativityMax: 1e-2,          // S semiconfinado
  saturatedThicknessNorth: 90,   // metros (sector Norte)
  extractionAnnualMm3: 22,       // Mm³/año extraídos (zona 90 km²)
  rechargeAnnualMm3: 17,         // Mm³/año recarga renovable
  deficitAnnualMm3: 5,           // Mm³/año déficit (29% sobreexplotación)
  reservesGeologicMm3: 125,      // Mm³ reservas geológicas totales
  // Piezometría (cotas msnm)
  piezoRecharge: 795,            // Zona de recarga (Quebrada Atarigua)
  piezoCenter: 546,              // Centro del valle (cono de abatimiento)
  piezoOutlet: 571,              // Salida del valle (Quebrada Las Raíces)
  coneDepression: 25,            // Metros bajo la cota de salida
};

// ─── DATOS DEL POZO ACTUAL ────────────────────────────────────────────────────
export const WELL_PARAMS = {
  currentDepthM: 50,             // Profundidad actual (83% consolidado)
  targetDepthM: 60,              // Meta de culminación
  boreholeRadiusM: 0.5,          // Radio del brocal artesanal (1.0 m diámetro)
  staticWaterLevelM: 49.5,       // NFS — Nivel Freático Estático
  lithologyBottom: 'Grava negra de lidita y cuarzo cristalino saturada',
  progressPct: 83,               // % excavado y consolidado
  // Caudal objetivo de certificación
  targetFlowMinLs: 2.0,          // L/s mínimo viable
  targetFlowMaxLs: 2.5,          // L/s óptimo
  targetFlowM3h: 9.0,            // m³/h equivalente
  // Reservorio australiano
  reservoirVolumeM3: 80,         // m³ (tanque australiano)
  reservoirAutonomyDays: 5.1,    // días de autonomía continua
  // Demanda agronómica nave 1.000 m² (3.500 plantas pimentón)
  irrigationDemandPeakM3Day: 15.75,  // m³/día pico (floración-cosecha)
  irrigationDemandAvgM3Day: 10.5,    // m³/día promedio ciclo
};

// ─── ESTRATIGRAFÍA DEL POZO (columnas litológicas validadas) ─────────────────
export interface LithologyLayer {
  fromM: number;
  toM: number;
  name: string;
  description: string;
  color: string;       // hex para visualización SVG
  pattern: 'solid' | 'dots' | 'lines' | 'gravel' | 'clay';
  permeability: 'alta' | 'media' | 'baja' | 'muy_alta';
}

export const LITHOLOGY_LAYERS: LithologyLayer[] = [
  {
    fromM: 0, toM: 3,
    name: 'Capa Vegetal y Suelo',
    description: 'Horizonte A-B. Arcilla orgánica parda con raíces.',
    color: '#8B4513', pattern: 'solid', permeability: 'baja'
  },
  {
    fromM: 3, toM: 12,
    name: 'Limo-Arcilla Cuaternaria',
    description: 'Sedimento fluvio-lacustre fino. Baja permeabilidad.',
    color: '#C4A882', pattern: 'clay', permeability: 'baja'
  },
  {
    fromM: 12, toM: 25,
    name: 'Arena Media con Grava Fina',
    description: 'Lente aluvial. Permeabilidad media. Acuífero libre.',
    color: '#D4C085', pattern: 'dots', permeability: 'media'
  },
  {
    fromM: 25, toM: 35,
    name: 'Arcilla Lacustre Compacta',
    description: 'Capa semiconfinante. Separa acuíferos multicapa.',
    color: '#9E8870', pattern: 'lines', permeability: 'baja'
  },
  {
    fromM: 35, toM: 49.5,
    name: 'Grava Gruesa y Arena Saturada',
    description: 'Acuífero principal. Alta transmisividad T≈180 m²/día.',
    color: '#A8956A', pattern: 'gravel', permeability: 'alta'
  },
  {
    fromM: 49.5, toM: 60,
    name: 'Grava Lidita y Cuarzo Cristalino (Saturado)',
    description: 'Zona de máximo rendimiento. NFS=49.5m. Muy alta permeabilidad.',
    color: '#7BA7C4', pattern: 'gravel', permeability: 'muy_alta'
  },
  {
    fromM: 60, toM: 75,
    name: 'Roca Metamórfica / Basamento Cretácico',
    description: 'Límite inferior del acuífero. Formación Cuara — lidita y filita.',
    color: '#4A4A5A', pattern: 'solid', permeability: 'baja'
  },
];

// ─── CALIDAD DEL AGUA — ESCENARIO A: POZO ACTUAL ─────────────────────────────
export const WATER_QUALITY_A = {
  label: 'Pozo Profundo Actual (Acuífero Sobreexplotado)',
  scenario: 'A' as const,
  ceDs_m: 1.4,             // Conductividad Eléctrica dS/m
  pH: 7.8,
  hco3MmolL: 3.5,          // Bicarbonatos mmol/L
  clMmolL: 4.2,            // Cloruros
  naMeqL: 5.8,             // Sodio meq/L
  caMgDh: 18,              // Dureza total °dH
  rasMeq: 4.2,             // Relación de Adsorción de Sodio (RAS)
  ironMgL: 0.35,           // Hierro total mg/L
  boronMgL: 0.4,           // Boro (tóxico > 0.7 mg/L para pimentón)
  leachingFractionPct: 20, // LF = 20% (obligatorio)
  nitricAcidLweek: 22,     // Litros de HNO₃ 60% por semana (Tanque C)
  phTargetGotero: 5.9,     // pH objetivo en solución gotero
  risk: 'moderado' as const,
  treatment: [
    'Inyección de 22 L/semana HNO₃ 60% (Tanque C) para neutralizar HCO₃⁻',
    'Fracción de Lavado (LF) 20% sobre lámina de riego calculada',
    'K₂SO₄ en lugar de KCl para evitar agravamiento del frente salino',
    'Quelato Fe-EDDHA 6% para contrarrestar insolubilización de Fe en pH 7.8',
    'Monitoreo de CE radicular cada 2 semanas (conductímetro en drenaje)',
  ],
};

// ─── CALIDAD DEL AGUA — ESCENARIO B: TRASVASE YACAMBÚ ────────────────────────
export const WATER_QUALITY_B = {
  label: 'Agua Andina — Trasvase Yacambú (Recarga Artificial)',
  scenario: 'B' as const,
  ceDs_m: 0.5,
  pH: 7.1,
  hco3MmolL: 1.0,
  clMmolL: 0.8,
  naMeqL: 1.2,
  caMgDh: 6,
  rasMeq: 1.1,
  ironMgL: 0.05,
  boronMgL: 0.1,
  leachingFractionPct: 6.5,
  nitricAcidLweek: 7,
  phTargetGotero: 6.0,
  risk: 'bajo' as const,
  treatment: [
    'Inyección reducida a 7 L/semana HNO₃ (ahorro 65% en ácido)',
    'LF 6.5%: ahorro 2.63 m³/día de agua vs Escenario A',
    'Formulación AIFA sin interferencia de iones competidores',
    'Dosis de K₂SO₄ soluble optimizada sin riesgo de cloruros',
  ],
};

// ─── PROTOCOLO DE VALIDACIÓN DE CAMPO ────────────────────────────────────────
export interface ValidationStep {
  id: string;
  phase: number;
  name: string;
  shortName: string;
  equipment: string;
  duration: string;
  criterion: string;
  description: string;
  icon: string;
  status: 'pending' | 'in_progress' | 'done' | 'failed';
}

export const VALIDATION_PROTOCOL: ValidationStep[] = [
  {
    id: 'cctv',
    phase: 1,
    name: 'Video-Inspección Submarina CCTV 360°',
    shortName: 'CCTV 360°',
    equipment: 'Cámara submarina giratoria Pan-Tilt + cable Kevlar 100 m',
    duration: '4 a 6 horas',
    criterion: 'Paredes íntegras, cero derrumbes, fuste limpio y sin obstrucciones',
    description: 'Descenso de cámara desde superficie hasta fondo (50 m). Se verifica integridad de pared, litología de contacto, sedimentos en fondo, fisuras y zonas de entrada de agua.',
    icon: 'videocam',
    status: 'pending',
  },
  {
    id: 'airlift',
    name: 'Limpieza por Air-Lift (Desarrollo Neumático)',
    shortName: 'Air-Lift',
    phase: 2,
    equipment: 'Compresor de tornillo 200 CFM + tubería de inyección al fondo',
    duration: '6 a 12 horas',
    criterion: 'Caudal de finos < 10 g/m³ de agua producida (agua cristalina)',
    description: 'Inyección de aire comprimido desde el fondo para romper los puentes de arena y limpiar el filtro granular natural. Criterio de aprobación: turbidez < 10 NTU en muestra de 3 horas continuas.',
    icon: 'air',
    status: 'pending',
  },
  {
    id: 'jacob',
    phase: 3,
    name: 'Prueba Escalonada de Caudal (Método de Jacob)',
    shortName: 'Prueba Jacob',
    equipment: 'Bomba sumergible variable + datalogger de presión 0.01 m resolución',
    duration: '8 a 10 horas (3 escalones × 120 min c/u)',
    criterion: 'Separar coeficientes B (pérdidas lineales) y C (pérdidas turbulentas) — eficiencia E_w ≥ 70%',
    description: 'Bombeo en 3–4 escalones de caudal creciente (0.5, 1.0, 1.5, 2.0 L/s). Se grafica s/Q vs Q para obtener B y C de la ecuación de Jacob: s = BQ + CQ². Determina el caudal máximo explotable.',
    icon: 'stacked_line_chart',
    status: 'pending',
  },
  {
    id: 'theis',
    phase: 4,
    name: 'Prueba Continua 24–48 h (Método de Theis)',
    shortName: 'Theis 24–48h',
    equipment: 'Bomba sumergible a caudal constante + 2 pozos de observación + datalogger',
    duration: '24 a 48 horas bombeo + 12 h recuperación',
    criterion: 'Determinar T y S definitivos — Q constante a ≥ 2.0 L/s sin agotamiento',
    description: 'Bombeo continuo a caudal fijo durante 24–48 h con registro de niveles en pozos de observación. Análisis de recuperación (Residual Recovery — Theis) para calcular T y S reales del acuífero en el radio de influencia. Base para diseño de bomba definitiva.',
    icon: 'timeline',
    status: 'pending',
  },
  {
    id: 'water_analysis',
    phase: 5,
    name: 'Análisis Fisicoquímico Completo del Agua',
    shortName: 'Laboratorio',
    equipment: 'Laboratorio acreditado FONDONORMA / INIA Lara',
    duration: '5 a 7 días hábiles',
    criterion: 'CE < 2.0 dS/m, RAS < 6, Boro < 0.7 mg/L, sin metales pesados > LMP',
    description: 'Muestra tomada tras Air-Lift y al inicio de la prueba Theis. Parámetros: CE, pH, Na, Ca, Mg, K, HCO₃⁻, Cl⁻, SO₄²⁻, NO₃⁻, B, Fe total, Mn, As, RAS, CSR, SAR. Determina el tratamiento agronómico exacto.',
    icon: 'biotech',
    status: 'pending',
  },
];

// ─── CONTEXTO REGIONAL — HISTORIA DEL NIVEL FREÁTICO ─────────────────────────
export const WATER_LEVEL_HISTORY = [
  { year: 1963, northDepthM: 53, southDepthM: 95, note: 'Inicio de sobreexplotación intensiva' },
  { year: 1975, northDepthM: 65, southDepthM: 108, note: 'Expansión del sector hortícola' },
  { year: 1987, northDepthM: 83, southDepthM: 135, note: 'Estado máximo de abatimiento histórico documentado' },
  { year: 2000, northDepthM: 75, southDepthM: 118, note: 'Sequía severa — ENSO fase negativa' },
  { year: 2012, northDepthM: 86, southDepthM: 136, note: 'Campaña CIDIAT-ULA (Jégat et al.)' },
  { year: 2026, northDepthM: 88, southDepthM: 138, note: 'Estimación conservadora (continúa la tendencia)' },
];

// ─── COMPARATIVA EFICIENCIA HÍDRICA: CAMPO vs CASA DE MALLA ─────────────────
export const WATER_EFFICIENCY_COMPARISON = [
  {
    parameter: 'Evaporación directa del suelo',
    openField: '1.700 – 3.200 mm/año',
    greenhouse: '~0 mm (acolchado mulch)',
    advantage: '-75% pérdidas por evaporación',
  },
  {
    parameter: 'Transpiración forzada por viento Este',
    openField: 'Viento directo 10.4 km/h',
    greenhouse: 'Malla 50×25 frena viento 45%',
    advantage: '-25% estrés hídrico por viento',
  },
  {
    parameter: 'Consumo pico en cosecha (3.500 pl)',
    openField: '28 – 35 m³/día (gravedad)',
    greenhouse: '14.53 – 15.75 m³/día (goteo)',
    advantage: '-50% extracción neta del pozo',
  },
  {
    parameter: 'Eficiencia de uso del agua (WUE)',
    openField: '0.8 – 1.2 kg / m³',
    greenhouse: '2.2 – 2.5 kg / m³',
    advantage: '+100% productividad por m³',
  },
  {
    parameter: 'Control del frente salino radicular',
    openField: 'Encharcamiento / salinización',
    greenhouse: 'Bulbo continuo con LF controlada',
    advantage: 'Cero estrés osmótico radicular',
  },
];

// ─── FÓRMULAS HIDROGEOLÓGICAS (para render en KaTeX) ─────────────────────────
export const HYDRAULIC_FORMULAS = {
  theis: 's = \\frac{Q}{4\\pi T} W\\!\\left(\\frac{r^2 S}{4Tt}\\right)',
  jacob: 's_{\\text{total}} = B \\cdot Q + C \\cdot Q^2',
  leachingFraction: 'LF = \\frac{EC_w}{5 \\cdot EC_e - EC_w}',
  darcy: 'Q = K \\cdot i \\cdot A',
  columnVolume: 'V_{\\text{fuste}} = \\pi \\cdot r^2 \\cdot h_{\\text{columna}} \\times 1000\\ \\text{L}',
  specificCapacity: 'Q_s = \\frac{Q}{s}\\quad [\\text{L/s/m}]',
};

// ─── FINANCIERO — INVERSIÓN DE TERMINACIÓN ───────────────────────────────────
export const INVESTMENT_COMPLETION = {
  alternativeNewWellUsd: 24880,   // Costo pozo nuevo completo (benchmark INSAVI)
  completionItems: [
    { label: 'Mano de obra pica en grava (10 m × $100/m)', cost: 1000 },
    { label: 'Bomba sumergible 2HP + tablero eléctrico IATEC', cost: 850 },
    { label: 'Martillo demoledor industrial (activo residual $750)', cost: 1000 },
    { label: 'Tubería PEAD 4" + accesorios y válvulas', cost: 650 },
    { label: 'Ventilación + sellado de brocal antiséptico', cost: 300 },
    { label: 'Prueba de caudal (air-lift 12h + Jacob 8h)', cost: 200 },
  ],
  totalCompletionUsd: 4000,
  savingVsNewWellUsd: 20880,
  savingPct: 84,
  executionDays: '10 a 12 días continuos',
};
