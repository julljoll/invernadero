/**
 * Servicio de Sincronización y Formateo para Google Sheets Oficial
 * Proyecto: Invernadero y Casa de Malla — Valle de Quíbor, Lara
 * Documento Oficial: https://docs.google.com/spreadsheets/d/1flk-st-27PIKnTmO2q0KzUnGUR2RSdnvWXiupKHD8uE/edit?usp=sharing
 * ID: 1flk-st-27PIKnTmO2q0KzUnGUR2RSdnvWXiupKHD8uE
 */

export interface SheetDefinition {
  id: string;
  name: string;
  title: string;
  description: string;
  headers: string[];
  rows: (string | number)[][];
  summaryRows?: (string | number)[][];
}

export const GOOGLE_SHEET_CONFIG = {
  url: 'https://docs.google.com/spreadsheets/d/1flk-st-27PIKnTmO2q0KzUnGUR2RSdnvWXiupKHD8uE/edit?usp=sharing',
  id: '1flk-st-27PIKnTmO2q0KzUnGUR2RSdnvWXiupKHD8uE',
  title: 'Plan de Siembra Pimenton — Valle de Quíbor',
  storageKeyWebhook: 'agrovenecua_google_webhook_url',
};

/**
 * 1. HOJA 01: PLAN DE SIEMBRA & DISEÑO AGRONÓMICO
 */
export function getPlanSiembraSheet(): SheetDefinition {
  const headers = ['Parámetro Técnico', 'Valor Especificado', 'Unidad de Medida', 'Observaciones Agronómicas Quíbor'];
  const rows: (string | number)[][] = [
    ['Cultivo Objetivo', 'Pimentón Híbrido F1 (Magistral F1)', 'Híbrido Certificado', 'Variedad tipo bloque de 4 lóbulos, pared gruesa (8-10 mm), alta firmeza'],
    ['Especie Científica', 'Capsicum annuum L.', 'Taxonomía', 'Solanácea de polinización protegida'],
    ['Ubicación Satelital', 'Valle de Quíbor, Municipio Jiménez, Lara', 'Georreferenciación', '9°53\'20.0" N, 69°35\'35.0" W · Sector Cuara / La Cigarronera'],
    ['Cota Altitudinal', 700, 'msnm', 'Valle semiárido cálido (BSh / premontano)'],
    ['Superficie Neta de Nave', 1000, 'm²', 'Módulo estándar de alta eficiencia (50 m largo × 20 m ancho)'],
    ['Población de Plantas', 3500, 'plantas', '3.500 plantas totales en 1.000 m²'],
    ['Densidad de Siembra', 3.50, 'plantas / m²', 'Densidad balanceada para ventilación lateral y control de humedad relativa'],
    ['Camellones / Bancales', 10, 'camellones', 'Camellones de 50 m de largo espaciados a 2.00 m de centro a centro'],
    ['Disposición de Hileras', 'Doble hilera a tresbolillo', 'Esquema', 'Separación de 40 cm entre hileras dentro del camellón'],
    ['Distancia Entre Plantas', 0.40, 'metros', '40 cm lineales entre plantas a lo largo de la cinta'],
    ['Sistema de Tutorado', 'Hortomalla 15×15 cm en cajón', 'Malla vertical', '2 líneas de malla + estacas de madera cada 3.0 m + alambre Cal 12'],
    ['Cubierta de Protección', 'Malla Anti-Insectos 50 Mesh Blanca', '130 gsm', 'HDPE monofilamento virgen, poro ≤ 192 µm, difusor lumínico e infrarrojo'],
    ['Extractores Cenitales Eólicos', 8, 'unidades 24"-30"', 'Refuerzo eólico cenital para renovación convectiva en horas pico de calma'],
    ['Orientación Predominante', 'Eje largo Norte-Sur / Refuerzo Este', 'Brújula', 'Fachada Este reforzada por viento dominante durante 11 meses (hasta 27 km/h ráfaga)'],
    ['Duración del Ciclo', 20, 'semanas (140 días)', 'Ciclo completo de trasplante a final de cosecha'],
    ['Meta Rendimiento', 17500, 'kg / ciclo', '17.5 Toneladas métricas equivalentes a 875 cestas de 20 kg (5.00 kg / planta)'],
    ['Garantía Calibre Grande (Primera)', '75%', 'Porcentaje', 'Frutos Extra Grandes / Jumbo > 220 gramos'],
    ['Calibre Mediano (Segunda)', '25%', 'Porcentaje', 'Frutos de 170 a 220 gramos'],
    ['Descarte / Maraña', '2%', 'Porcentaje', 'Mínimo descarte gracias a protección 50 mesh y nutrición AIFA'],
  ];

  return {
    id: '01_Plan_Siembra',
    name: '01_Plan_Siembra',
    title: '01. Plan de Siembra & Diseño Agronómico (Magistral F1)',
    description: 'Marco de plantación, densidad, variedad, dimensiones de nave y metas de producción para 3.500 plantas.',
    headers,
    rows,
  };
}

/**
 * 2. HOJA 02: PLAN DE RIEGO FAO-56 POR SEMANA (24 SEMANAS)
 */
export function getPlanRiegoSheet(waterEcDsM: number = 1.45): SheetDefinition {
  const headers = [
    'Semana',
    'Fase Fenológica',
    'Kc (FAO-56)',
    'ET0 (mm/d)',
    'ETc Neta (mm/d)',
    'Fracc. Lixiv. (LF)',
    'Lámina Bruta (mm/d)',
    'L / planta / día',
    'L / planta / sem',
    'Vol. Total Semanal (m³)',
    'Goteros PC (1.6 L/h)',
    'Minutos Riego / Día',
    'Turnos / Día'
  ];

  // Cálculo de fracción de lixiviación según salinidad del pozo
  const lf = Math.min(0.35, Math.max(0.10, waterEcDsM / (5 * 2.5 - waterEcDsM)));
  const lfMultiplier = 1 / (1 - lf);

  const rows: (string | number)[][] = [];

  for (let w = 1; w <= 24; w++) {
    let fase = '';
    let kc = 0.50;
    let baseLitersPlantWeek = 7.0;

    if (w <= 3) {
      fase = '01. Trasplante y Enraizamiento';
      kc = 0.45 + (w - 1) * 0.05;
      baseLitersPlantWeek = 7.2 + (w - 1) * 0.9;
    } else if (w <= 7) {
      fase = '02. Crecimiento Vegetativo Rápido';
      kc = 0.65 + (w - 4) * 0.08;
      baseLitersPlantWeek = 10.0 + (w - 4) * 1.1;
    } else if (w <= 12) {
      fase = '03. Floración y Cuajado de Frutos';
      kc = 0.95 + (w - 8) * 0.04;
      baseLitersPlantWeek = 14.5 + (w - 8) * 0.6;
    } else if (w <= 18) {
      fase = '04. Engorde y Cosecha Temprana';
      kc = 1.15;
      baseLitersPlantWeek = 17.5 + (w - 13) * 0.3;
    } else {
      fase = '05. Cosecha Plena y Senescencia';
      kc = 1.05 - (w - 19) * 0.03;
      baseLitersPlantWeek = 18.0 - (w - 19) * 0.6;
    }

    const et0 = 5.6; // Promedio Quíbor mm/día
    const etcNetMmDay = Number((et0 * kc).toFixed(2));
    const grossMmDay = Number((etcNetMmDay * lfMultiplier).toFixed(2));
    const grossLitersPlantWeek = Number((baseLitersPlantWeek * lfMultiplier).toFixed(1));
    const litersPlantDay = Number((grossLitersPlantWeek / 7).toFixed(2));
    const totalWeeklyM3 = Number(((grossLitersPlantWeek * 3500) / 1000).toFixed(1));

    const plantDeliveryRateLh = 3.2;
    const minutesDaily = Math.round((litersPlantDay / plantDeliveryRateLh) * 60);
    const turnos = minutesDaily > 45 ? 2 : 1;

    rows.push([
      `Sem ${w < 10 ? '0' + w : w}`,
      fase,
      Number(kc.toFixed(2)),
      et0,
      etcNetMmDay,
      `${(lf * 100).toFixed(1)}%`,
      grossMmDay,
      litersPlantDay,
      grossLitersPlantWeek,
      totalWeeklyM3,
      '2 goteros × 1.6 L/h',
      minutesDaily,
      turnos
    ]);
  }

  return {
    id: '02_Plan_Riego_FAO56',
    name: '02_Plan_Riego_FAO56',
    title: '02. Plan de Riego FAO-56 Ajustado a Quíbor (Semanas 1 a 24)',
    description: 'Cronograma hídrico con balance de evapotranspiración, fracción de lixiviación por salinidad de pozo y tiempos de bombeo.',
    headers,
    rows,
  };
}

/**
 * 3. HOJA 03: PLAN DE FERTIRRIEGO & NUTRICIÓN AIFA SOLUBLE
 */
export function getPlanFertilizacionSheet(): SheetDefinition {
  const headers = [
    'Semana',
    'Etapa del Cultivo',
    'Nitrato Calcio AIFA (g/pl)',
    'Nitrato Potasio AIFA (g/pl)',
    'Fosfato Monopotásico MKP (g/pl)',
    'Sulfato Magnesio AIFA (g/pl)',
    'Sulfato Potasio (g/pl)',
    'Ácido Nítrico 60% (mL/pl)',
    'Total Fertilizante Semanal (kg / 3.500 pl)',
    'Total Ácido Nítrico (Litros / semana)',
    'Conductividad Solución (dS/m)',
    'pH Riego Salida'
  ];

  const rows: (string | number)[][] = [
    ['Sem 01', 'Enraizamiento inicial', 1.2, 0.6, 1.8, 0.8, 0.0, 3.0, 11.0, 7.5, 1.6, 5.8],
    ['Sem 02', 'Enraizamiento y desarrollo radicular', 1.8, 1.0, 2.2, 1.0, 0.0, 3.5, 15.0, 8.8, 1.7, 5.8],
    ['Sem 03', 'Despegue vegetativo inicial', 2.5, 1.8, 2.0, 1.2, 0.0, 4.0, 18.8, 10.0, 1.8, 5.8],
    ['Sem 04', 'Vegetativo rápido y ramificación', 3.5, 2.8, 2.0, 1.6, 0.0, 4.5, 24.8, 11.3, 1.9, 5.9],
    ['Sem 05', 'Diferenciación de botones florales', 4.2, 3.6, 2.2, 1.8, 0.0, 5.0, 29.5, 12.5, 2.0, 5.9],
    ['Sem 06', 'Primera floración y elongación', 5.0, 4.5, 2.4, 2.0, 0.5, 5.5, 36.0, 13.8, 2.1, 5.9],
    ['Sem 07', 'Cuajado primeros frutos en horqueta', 5.5, 5.8, 2.2, 2.2, 1.0, 6.0, 41.8, 15.0, 2.2, 5.9],
    ['Sem 08', 'Crecimiento de frutos cuajados', 6.0, 7.0, 2.0, 2.4, 1.5, 6.5, 47.3, 16.3, 2.3, 6.0],
    ['Sem 09', 'Engorde de pared celular Magistral F1', 6.5, 8.2, 1.8, 2.5, 2.0, 7.0, 52.5, 17.5, 2.4, 6.0],
    ['Sem 10', 'Máxima demanda de Calcio y Potasio', 7.0, 9.0, 1.8, 2.6, 2.5, 7.5, 57.3, 18.8, 2.4, 6.0],
    ['Sem 11', 'Inicio de viraje de color en frutos', 7.0, 9.5, 1.6, 2.6, 3.0, 7.5, 59.3, 18.8, 2.5, 6.0],
    ['Sem 12', 'Primera cosecha / floración intermedia', 6.8, 9.5, 1.6, 2.5, 3.0, 7.0, 58.5, 17.5, 2.4, 6.0],
    ['Sem 13', 'Cosecha continua y rebrote', 6.5, 9.0, 1.6, 2.4, 2.8, 7.0, 55.8, 17.5, 2.4, 6.0],
    ['Sem 14', 'Segunda oleada de cuajado', 6.5, 8.8, 1.6, 2.4, 2.6, 6.8, 54.8, 17.0, 2.3, 6.0],
    ['Sem 15', 'Engorde de segunda cosecha', 6.2, 8.5, 1.5, 2.2, 2.5, 6.5, 52.3, 16.3, 2.3, 6.0],
    ['Sem 16', 'Pico de producción Magistral F1', 6.0, 8.2, 1.5, 2.2, 2.4, 6.5, 50.8, 16.3, 2.3, 6.0],
    ['Sem 17', 'Cosecha regular y llenado final', 5.5, 7.8, 1.4, 2.0, 2.2, 6.0, 47.3, 15.0, 2.2, 6.0],
    ['Sem 18', 'Mantenimiento de calibre en cosecha', 5.0, 7.2, 1.2, 1.8, 2.0, 5.5, 43.0, 13.8, 2.1, 6.0],
    ['Sem 19', 'Últimos cortes comerciales', 4.5, 6.5, 1.0, 1.6, 1.8, 5.0, 38.5, 12.5, 2.0, 6.0],
    ['Sem 20', 'Fin del ciclo productivo', 3.5, 5.0, 0.8, 1.2, 1.2, 4.0, 29.3, 10.0, 1.9, 6.0],
  ];

  return {
    id: '03_Plan_Fertilizacion_AIFA',
    name: '03_Plan_Fertilizacion_AIFA',
    title: '03. Plan de Fertirriego AIFA & Regulador de pH (20 Semanas)',
    description: 'Programa nutricional 100% hidrosoluble en tanques A, B y C para pimentón grande Magistral F1.',
    headers,
    rows,
  };
}

/**
 * 4. HOJA 04: PLAN FITOSANITARIO & ROTACIÓN IRAC
 */
export function getPlanFitosanitarioSheet(): SheetDefinition {
  const headers = [
    'Blanco Biológico',
    'Nombre Científico',
    'Eficacia Malla 50 Mesh',
    'Umbral de Acción Económica',
    'Control Biológico / Etológico',
    'Ingrediente Activo Químico',
    'Código IRAC / FRAC',
    'Riesgo Específico en Quíbor'
  ];

  const rows: (string | number)[][] = [
    [
      'Trips de las Flores',
      'Frankliniella occidentalis',
      '100% Barrera Física (Poro ≤ 192 µm)',
      '1 trips por flor en 5 flores al azar',
      'Orius insidiosus · Trampas cromáticas azules a 20 cm del ápice',
      'Spinosad · Emamectina benzoato',
      'IRAC 5 / IRAC 6',
      'Vector principal del virus TSWV (Marchitez manchada). Excluido 100% por malla 50 mesh.'
    ],
    [
      'Mosca Blanca',
      'Bemisia tabaci',
      '100% Barrera Física (Poro ≤ 192 µm)',
      '1 adulto por cada 10 hojas muestreadas',
      'Chrysoperla carnea · Encarsia formosa · Trampas amarillas',
      'Flupyradifurone · Cyantraniliprole · Piriproxifeno',
      'IRAC 4D / IRAC 28 / IRAC 7C',
      'Vector de Geminivirus / Mosaico dorado. El color blanco de la malla desorienta su vuelo.'
    ],
    [
      'Araña Roja & Ácaro Blanco',
      'Tetranychus urticae / Polyphagotarsonemus',
      '0% Exclusión (Tamaño < 140 µm)',
      'Aparición del primer foco o síntoma bronceado',
      'Amblyseius swirskii · Neoseiulus californicus · HR > 60%',
      'Etoxazol · Spiromesifen · Abamectina + Azufre micro',
      'IRAC 10B / IRAC 23 / IRAC 6',
      '¡Alerta crítica! Ninguna malla la retiene. Explota con aire seco (HR < 50%) y calor en Quíbor.'
    ],
    [
      'Minador de la Hoja',
      'Liriomyza sativae / huidobrensis',
      '100% Barrera Física',
      '5 galerías activas por planta en estrato medio',
      'Diglyphus isaea · Trampas pegajosas amarillas',
      'Ciromazina · Cartap',
      'IRAC 17 / IRAC 14',
      'Reduce área fotosintética foliar. Excluido totalmente por el cerramiento 50 mesh.'
    ],
    [
      'Gusano Soldado y Barrenador',
      'Spodoptera frugiperda / Helicoverpa zea',
      '100% Barrera Física Total',
      '0 tolerancia en fruto cuajado',
      'Bacillus thuringiensis kurstaki · Feromonas sexuales',
      'Clorantraniliprol · Indoxacarb · Metoxifenocida',
      'IRAC 28 / IRAC 22A / IRAC 18',
      'Polillas adultas no pueden penetrar la casa de malla. Ahorro de 80% en insecticidas pesados.'
    ],
    [
      'Pulgón Verde y del Algodón',
      'Myzus persicae / Aphis gossypii',
      '100% Barrera Física',
      'Presencia en 3% de brotes apicales',
      'Aphidoletes aphidimyza · Mariquitas (Coccinellidae)',
      'Flonicamid · Sulfoxaflor · Pimetrozina',
      'IRAC 29 / IRAC 4C / IRAC 9B',
      'Segregan melaza y provocan fumagina en frutos. Excluidos por malla hermética.'
    ],
    [
      'Oídio / Cenicilla Polvorienta',
      'Leveillula taurica',
      'Control Microclimático',
      'Presencia de primeras manchas cloróticas abaxiales',
      'Biofungicidas (Bacillus subtilis) · Buena ventilación convectiva',
      'Azoxystrobin + Difenoconazol · Bupirimato',
      'FRAC 11 + 3 / FRAC 8',
      'Favorecido por microclimas estancados. Se previene con altura ≥ 3.0 m y extractores eólicos.'
    ],
    [
      'Mancha Bacteriana',
      'Xanthomonas campestris pv. vesicatoria',
      'Protección de Cubierta',
      'Aparición tras lluvias de mayo-octubre',
      'Extracto de semillas de toronja · Ventilación rápida',
      'Oxicloruro de Cobre + Mancozeb · Kasugamicina',
      'FRAC M01 + M03 / FRAC 24',
      'Entra por estomas y heridas por viento. La malla frena el impacto mecánico de lluvia y ráfagas.'
    ]
  ];

  return {
    id: '04_Plan_Fitosanitario_IPM',
    name: '04_Plan_Fitosanitario_IPM',
    title: '04. Plan de Manejo Integrado de Plagas (IPM) & Rotación IRAC',
    description: 'Protocolo de exclusión física 50 mesh, umbrales económicos, biológicos y rotación química anti-resistencia.',
    headers,
    rows,
  };
}

/**
 * 5. HOJA 05: CÁLCULO DE GASTOS, INVERSIÓN Y RETORNO (ROI)
 */
export function getCalculoGastosSheet(): SheetDefinition {
  const headers = [
    'Categoría Presupuestaria',
    'Rubro Específico de Costo',
    'Especificación Comercial / Detalle',
    'Tipo de Gasto',
    'Monto Unitario / Base',
    'Costo Total (USD)',
    'Porcentaje del Total'
  ];

  const rows: (string | number)[][] = [
    // 1. Semillero & Labranza ($860)
    ['1. Semillero & Labranza', 'Semilla Híbrida Magistral F1', '3 sobres de 1.000 semillas certificadas', 'OPEX Producción', '$150 / sobre', 450, '6.1%'],
    ['1. Semillero & Labranza', 'Germinación & Bandejas', 'Bandejas 128 celdas + Peat moss Klasmann', 'OPEX Producción', '$0.06 / plántula', 150, '2.0%'],
    ['1. Semillero & Labranza', 'Preparación de Suelo', 'Pase de tractor, rastra y 10 camellones a 2m', 'OPEX Producción', '$18 / camellón', 180, '2.4%'],
    ['1. Semillero & Labranza', 'Mano de Obra Trasplante', 'Cuadrilla de siembra para 3.500 plántulas', 'OPEX Producción', '$0.032 / planta', 112, '1.5%'],

    // 2. Nutrición, Agua & Fitosanitarios ($2.940)
    ['2. Nutrición & Fitosanidad', 'Fertilizantes Solubles AIFA', 'Nitrato Calcio, Potasio, MKP, Mg (20 sem)', 'OPEX Producción', 'Programa 20 sem', 1380, '18.7%'],
    ['2. Nutrición & Fitosanidad', 'Regulador pH Ácido Nítrico 60%', '224 Litros / ciclo para neutralizar agua pozo', 'OPEX Producción', '$0.98 / Litro', 220, '3.0%'],
    ['2. Nutrición & Fitosanidad', 'Agroquímicos & Biológicos IPM', 'Acaricidas, spinosad, cobre, trampas cromáticas', 'OPEX Producción', 'Plan rotación IRAC', 540, '7.3%'],
    ['2. Nutrición & Fitosanidad', 'Cisternas de Agua Dulce', '92-93 viajes × 10.000 L ($15/viaje) abastecimiento ciclo', 'OPEX Producción', '$15 / cisterna', 1395, '19.9%'],

    // 3. Reacondicionamiento Estructural ($375)
    ['3. Reacondicionamiento Estructural', 'Fondo Blanco Anticorrosivo', '1 cuñete epóxico para herrería Sch 40', 'CAPEX Reactivación', '1 cuñete', 75, '1.0%'],
    ['3. Reacondicionamiento Estructural', 'Mano de Obra Lijado y Pintura', '108 pilares, vigas y tensores', 'CAPEX Reactivación', 'Herrería nave', 120, '1.6%'],
    ['3. Reacondicionamiento Estructural', 'Instalación y Costura Malla', 'Mano de obra colocación con hilo UV reforzado', 'CAPEX Reactivación', '4 paños 50m', 180, '2.4%'],

    // 4. Riego & Cabezal Fertirriego ($580)
    ['4. Sistema de Riego & Cabezal', 'Tubería Matriz PEAD 1"-1.5"', 'Matriz y submatrices con codos y uniones', 'CAPEX Reactivación', 'Instalación completa', 120, '1.6%'],
    ['4. Sistema de Riego & Cabezal', 'Sistema de Riego por Goteo (goteros PC/AS 1.6 L/h autocompensados + cabezal y filtros)', 'Cinta 1.000m + goteros PC/AS 1.6 L/h + cabezal y filtros de disco', 'OPEX / CAPEX', 'Kit 1.000 m²', 100, '1.4%'],
    ['4. Sistema de Riego & Cabezal', 'Conectores Iniciales y Válvulas', '20 conectores con válvula + gomas grommet', 'CAPEX Reactivación', '$3.00 / unidad', 60, '0.8%'],
    ['4. Sistema de Riego & Cabezal', '3 Tanques para Fertirriego', 'Tanque A 500L, Tanque B 500L, Tanque C 200L', 'CAPEX Reactivación', 'Batería 3 tanques', 220, '3.0%'],

    // 5. Cubierta Malla 50 Mesh & Tutorado ($2.620)
    ['5. Cubierta & Tutorado', '4 Rollos Malla 50 Mesh 130 gsm', '4 rollos de 4.2m × 50m monofilamento virgen', 'CAPEX Reactivación', '$560 en efectivo / rollo', 2240, '30.4%'],
    ['5. Cubierta & Tutorado', 'Hortomalla 15×15 cm + Alambres', '500m malla soporte cajón + alambres Cal 12-14', 'CAPEX Reactivación', 'Tutorado completo', 380, '5.2%'],

    // RESUMEN ECONÓMICO Y BALANCE
    ['RESUMEN FINANCIERO', 'Subtotal OPEX Producción (1er Ciclo)', 'Semilla, nutrición, fitosanidad, agua y labores', 'OPEX', '3.500 plantas', 4427, '55.9%'],
    ['RESUMEN FINANCIERO', 'Subtotal CAPEX Adecuación & Malla', 'Malla 50 mesh, hortomalla, tanques, pintura', 'CAPEX', 'Activos fijos nave', 3495, '44.1%'],
    ['RESUMEN FINANCIERO', 'INVERSIÓN TOTAL 1ER CICLO', 'Deducción total del primer ciclo productivo', 'TOTAL DEDUCCIONES', '1.000 m²', 7922, '100.0%'],

    // ESCENARIOS DE RETORNO (ROI)
    ['PROYECCIÓN DE INGRESOS', 'Escenario Base: $14.0 USD / cesta', '17.500 kg (875 cestas) × $0.70 USD/kg', 'Ingreso Bruto', '$14 / cesta 20kg', 12250, '-'],
    ['PROYECCIÓN DE INGRESOS', 'Utilidad Neta Libre (1er Ciclo Base)', 'Ingreso $10.936 - Inversión Total $7.922', 'Utilidad Neta', 'Recupera Malla 100%', 3014, '+38% ROI'],
    ['PROYECCIÓN DE INGRESOS', 'OPEX Recurrente (2do Ciclo en adelante)', 'Solo costo de producción (malla y equipos ya pagos)', 'OPEX Recurrente', 'Ciclos subsiguientes', 4427, '-'],
    ['PROYECCIÓN DE INGRESOS', 'Utilidad Libre Proyectada (2do Ciclo)', 'Ingreso $10.936 - OPEX Recurrente $4.427', 'Utilidad Recurrente', 'Cada 5 meses', 6509, '+147% ROI'],
    ['PROYECCIÓN DE INGRESOS', 'Escenario Favorable: $18.0 USD / cesta', '17.500 kg (875 cestas) × $0.90 USD/kg', 'Ingreso Bruto', '$18 / cesta 20kg', 15750, '-'],
    ['PROYECCIÓN DE INGRESOS', 'Utilidad Neta Libre (Escenario Favorable)', 'Ingreso $15.750 - Inversión Total $7.922', 'Utilidad Neta', '1er Ciclo con buen precio', 7828, '+99% ROI'],
    ['PROYECCIÓN DE INGRESOS', 'Escenario Conservador: $11.0 USD / cesta', '17.500 kg (875 cestas) × $0.55 USD/kg', 'Ingreso Bruto', '$11 / cesta 20kg', 9625, '-'],
  ];

  return {
    id: '05_Calculo_Gastos_ROI',
    name: '05_Calculo_Gastos_ROI',
    title: '05. Desglose de Gastos de Producción, Inversión y Retorno (ROI)',
    description: '15 rubros exhaustivos de adecuación y producción, balance OPEX/CAPEX y proyección de rentabilidad.',
    headers,
    rows,
  };
}

/**
 * Obtener las 5 hojas maestras del proyecto
 */
export function getAllProductionSheets(waterEcDsM: number = 1.45): SheetDefinition[] {
  return [
    getPlanSiembraSheet(),
    getPlanRiegoSheet(waterEcDsM),
    getPlanFertilizacionSheet(),
    getPlanFitosanitarioSheet(),
    getCalculoGastosSheet(),
  ];
}

/**
 * Convertir una hoja a formato TSV para copiar al portapapeles y pegar directo en Google Sheets
 */
export function sheetToTsv(sheet: SheetDefinition): string {
  const lines: string[] = [];
  lines.push(sheet.headers.join('\t'));
  for (const row of sheet.rows) {
    lines.push(row.map((val) => (val === null || val === undefined ? '' : String(val).replace(/\t/g, ' '))).join('\t'));
  }
  return lines.join('\n');
}

/**
 * Convertir una hoja a formato CSV con comillas
 */
export function sheetToCsv(sheet: SheetDefinition): string {
  const lines: string[] = [];
  lines.push(sheet.headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(','));
  for (const row of sheet.rows) {
    lines.push(
      row
        .map((val) => {
          const s = val === null || val === undefined ? '' : String(val);
          return `"${s.replace(/"/g, '""')}"`;
        })
        .join(',')
    );
  }
  return lines.join('\r\n');
}

/**
 * Copiar datos al portapapeles en formato TSV (directo para pegar con Ctrl+V en Google Sheets)
 */
export async function copySheetToClipboard(sheet: SheetDefinition): Promise<boolean> {
  try {
    const tsv = sheetToTsv(sheet);
    await navigator.clipboard.writeText(tsv);
    return true;
  } catch (err) {
    console.error('Error al copiar al portapapeles:', err);
    return false;
  }
}

/**
 * Descargar una hoja individual como archivo CSV
 */
export function downloadSheetCsv(sheet: SheetDefinition): void {
  const csv = sheetToCsv(sheet);
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${sheet.name}_Quibor.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Descargar paquete de texto con las 5 hojas
 */
export function downloadAllSheetsPackage(waterEcDsM: number = 1.45): void {
  const sheets = getAllProductionSheets(waterEcDsM);
  let content = `===============================================================================\n`;
  content += `AGROVENECUA — VALLE DE QUÍBOR · PLAN MAESTRO AGRONÓMICO Y FINANCIERO\n`;
  content += `Google Sheet Oficial: ${GOOGLE_SHEET_CONFIG.url}\n`;
  content += `Generado: ${new Date().toLocaleString('es-VE')}\n`;
  content += `===============================================================================\n\n`;

  sheets.forEach((sheet) => {
    content += `\n###############################################################################\n`;
    content += `HOJA: ${sheet.name} — ${sheet.title}\n`;
    content += `Descripción: ${sheet.description}\n`;
    content += `###############################################################################\n\n`;
    content += sheetToCsv(sheet);
    content += `\n\n`;
  });

  const blob = new Blob(['\uFEFF' + content], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Plan_Completo_Quibor_GoogleSheets.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Enviar datos al Webhook de Google Apps Script para autoguardado directo en el documento
 */
export async function syncWithGoogleAppsScript(
  webhookUrl: string,
  waterEcDsM: number = 1.45
): Promise<{ success: boolean; message: string }> {
  if (!webhookUrl || !webhookUrl.startsWith('http')) {
    return {
      success: false,
      message: 'Debes configurar una URL de Google Apps Script Web App válida.',
    };
  }

  try {
    const sheets = getAllProductionSheets(waterEcDsM);
    const payload = {
      spreadsheetId: GOOGLE_SHEET_CONFIG.id,
      timestamp: new Date().toISOString(),
      project: 'Agrovenecua Valle de Quíbor',
      sheets: sheets.map((s) => ({
        name: s.name,
        title: s.title,
        headers: s.headers,
        rows: s.rows,
      })),
    };

    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    return {
      success: true,
      message: 'Datos enviados exitosamente a Google Sheets a través del Webhook.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Error al conectar con Google Apps Script: ${err.message || err}`,
    };
  }
}
