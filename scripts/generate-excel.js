import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// 1. Hoja 01: Plan de Siembra
const planSiembraHeaders = ['Parámetro Técnico', 'Valor Especificado', 'Unidad de Medida', 'Observaciones Agronómicas Quíbor'];
const planSiembraRows = [
  ['Cultivo Objetivo', 'Pimentón Híbrido F1 (Magistral F1)', 'Híbrido Certificado', 'Variedad tipo bloque de 4 lóbulos, pared gruesa (8-10 mm), alta firmeza'],
  ['Especie Científica', 'Capsicum annuum L.', 'Taxonomía', 'Solanácea de polinización protegida'],
  ['Ubicación Satelital', 'Valle de Quíbor, Municipio Jiménez, Lara', 'Georreferenciación', '9°53\'20.0" N, 69°35\'35.0" W · Sector Cuara / La Cigarronera'],
  ['Cota Altitudinal', 700, 'msnm', 'Valle semiárido cálido (BSh / premontano)'],
  ['Superficie Neta de Nave', 1000, 'm²', 'Módulo estándar de alta eficiencia (50 m largo × 20 m ancho)'],
  ['Población de Plantas', 2500, 'plantas', '2.500 plantas totales en 1.000 m²'],
  ['Densidad de Siembra', 2.50, 'plantas / m²', 'Densidad balanceada para ventilación lateral y control de humedad relativa'],
  ['Camellones / Bancales', 10, 'camellones', 'Camellones de 50 m de largo espaciados a 2.00 m de centro a centro'],
  ['Disposición de Hileras', 'Doble hilera a tresbolillo', 'Esquema', 'Separación de 40 cm entre hileras dentro del camellón'],
  ['Distancia Entre Plantas', 0.40, 'metros', '40 cm lineales entre plantas a lo largo de la cinta'],
  ['Sistema de Tutorado', 'Hortomalla 15×15 cm en cajón', 'Malla vertical', '2 líneas de malla + estacas de madera cada 3.0 m + alambre Cal 12'],
  ['Cubierta de Protección', 'Malla Anti-Insectos 50 Mesh Blanca', '110 / 130 gsm', 'HDPE monofilamento virgen, poro ≤ 192 µm, difusor lumínico e infrarrojo'],
  ['Extractores Cenitales Eólicos', 8, 'unidades 24"-30"', 'Refuerzo eólico cenital para renovación convectiva en horas pico de calma'],
  ['Orientación Predominante', 'Eje largo Norte-Sur / Refuerzo Este', 'Brújula', 'Fachada Este reforzada por viento dominante durante 11 meses (hasta 27 km/h ráfaga)'],
  ['Duración del Ciclo', 20, 'semanas (140 días)', 'Ciclo completo de trasplante a final de cosecha'],
  ['Meta Rendimiento', 13000, 'kg / ciclo', '13.0 Toneladas métricas equivalentes a 650 cestas de 20 kg (5.20 kg / planta)'],
  ['Garantía Calibre Grande (Primera)', '88%', 'Porcentaje', 'Frutos Extra Grandes / Jumbo > 220 gramos'],
  ['Calibre Mediano (Segunda)', '10%', 'Porcentaje', 'Frutos de 170 a 220 gramos'],
  ['Descarte / Maraña', '2%', 'Porcentaje', 'Mínimo descarte gracias a protección 50 mesh y nutrición AIFA'],
];

// 2. Hoja 02: Plan de Riego FAO-56
const planRiegoHeaders = [
  'Semana', 'Fase Fenológica', 'Kc (FAO-56)', 'ET0 (mm/d)', 'ETc Neta (mm/d)', 
  'Fracc. Lixiv. (LF)', 'Lámina Bruta (mm/d)', 'L / planta / día', 'L / planta / sem', 
  'Vol. Total Semanal (m³)', 'Goteros PC (1.6 L/h)', 'Minutos Riego / Día', 'Turnos / Día'
];
const planRiegoRows = [];
const lfMultiplier = 1.15;
for (let w = 1; w <= 24; w++) {
  let fase = '';
  let kc = 0.50;
  let baseLiters = 7.0;
  if (w <= 3) {
    fase = '01. Trasplante y Enraizamiento';
    kc = 0.45 + (w - 1) * 0.05;
    baseLiters = 7.2 + (w - 1) * 0.9;
  } else if (w <= 7) {
    fase = '02. Crecimiento Vegetativo Rápido';
    kc = 0.65 + (w - 4) * 0.08;
    baseLiters = 10.0 + (w - 4) * 1.1;
  } else if (w <= 12) {
    fase = '03. Floración y Cuajado de Frutos';
    kc = 0.95 + (w - 8) * 0.04;
    baseLiters = 14.5 + (w - 8) * 0.6;
  } else if (w <= 18) {
    fase = '04. Engorde y Cosecha Temprana';
    kc = 1.15;
    baseLiters = 17.5 + (w - 13) * 0.3;
  } else {
    fase = '05. Cosecha Plena y Senescencia';
    kc = 1.05 - (w - 19) * 0.03;
    baseLiters = 18.0 - (w - 19) * 0.6;
  }
  const et0 = 5.6;
  const etcNet = Number((et0 * kc).toFixed(2));
  const grossMm = Number((etcNet * lfMultiplier).toFixed(2));
  const grossLitersWeek = Number((baseLiters * lfMultiplier).toFixed(1));
  const litersDay = Number((grossLitersWeek / 7).toFixed(2));
  const totalM3 = Number(((grossLitersWeek * 2500) / 1000).toFixed(1));
  const minutes = Math.round((litersDay / 3.2) * 60);
  const turnos = minutes > 45 ? 2 : 1;
  planRiegoRows.push([
    `Sem ${w < 10 ? '0' + w : w}`,
    fase,
    Number(kc.toFixed(2)),
    et0,
    etcNet,
    '15.0%',
    grossMm,
    litersDay,
    grossLitersWeek,
    totalM3,
    '2 goteros × 1.6 L/h',
    minutes,
    turnos
  ]);
}

// 3. Hoja 03: Plan de Fertirriego AIFA
const planFertilizacionHeaders = [
  'Semana', 'Etapa del Cultivo', 'Nitrato Calcio AIFA (g/pl)', 'Nitrato Potasio AIFA (g/pl)', 
  'Fosfato Monopotásico MKP (g/pl)', 'Sulfato Magnesio AIFA (g/pl)', 'Sulfato Potasio (g/pl)', 
  'Ácido Nítrico 60% (mL/pl)', 'Total Fertilizante Semanal (kg)', 'Total Ácido Nítrico (L)', 
  'Conductividad (dS/m)', 'pH Salida'
];
const planFertilizacionRows = [
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
  ['Sem 20', 'Fin del ciclo productivo', 3.5, 5.0, 0.8, 1.2, 1.2, 4.0, 29.3, 10.0, 1.9, 6.0]
];

// 4. Hoja 04: Plan Fitosanitario IPM
const planFitosanitarioHeaders = [
  'Blanco Biológico', 'Nombre Científico', 'Eficacia Malla 50 Mesh', 'Umbral de Acción Económica', 
  'Control Biológico / Etológico', 'Ingrediente Activo Químico', 'Código IRAC / FRAC', 'Riesgo Específico en Quíbor'
];
const planFitosanitarioRows = [
  ['Trips de las Flores', 'Frankliniella occidentalis', '100% Barrera Física (Poro ≤ 192 µm)', '1 trips por flor en 5 flores al azar', 'Orius insidiosus · Trampas cromáticas azules', 'Spinosad · Emamectina benzoato', 'IRAC 5 / IRAC 6', 'Vector principal del virus TSWV. Excluido 100% por malla 50 mesh.'],
  ['Mosca Blanca', 'Bemisia tabaci', '100% Barrera Física (Poro ≤ 192 µm)', '1 adulto por cada 10 hojas muestreadas', 'Chrysoperla carnea · Encarsia formosa', 'Flupyradifurone · Cyantraniliprole', 'IRAC 4D / IRAC 28', 'Vector de Geminivirus / Mosaico dorado. El color blanco de la malla desorienta su vuelo.'],
  ['Araña Roja & Ácaro Blanco', 'Tetranychus urticae / Polyphagotarsonemus', '0% Exclusión (Tamaño < 140 µm)', 'Aparición del primer foco o síntoma bronceado', 'Amblyseius swirskii · Neoseiulus · HR > 60%', 'Etoxazol · Spiromesifen · Azufre micronizado', 'IRAC 10B / IRAC 23', '¡Alerta crítica! Ninguna malla la retiene. Explota con aire seco (HR < 50%) y calor en Quíbor.'],
  ['Minador de la Hoja', 'Liriomyza sativae / huidobrensis', '100% Barrera Física', '5 galerías activas por planta en estrato medio', 'Diglyphus isaea · Trampas amarillas', 'Ciromazina · Cartap', 'IRAC 17 / IRAC 14', 'Reduce área fotosintética foliar. Excluido totalmente por el cerramiento 50 mesh.'],
  ['Gusano Soldado y Barrenador', 'Spodoptera frugiperda / Helicoverpa zea', '100% Barrera Física Total', '0 tolerancia en fruto cuajado', 'Bacillus thuringiensis kurstaki · Feromonas', 'Clorantraniliprol · Indoxacarb', 'IRAC 28 / IRAC 22A', 'Polillas adultas no pueden penetrar la casa de malla. Ahorro de 80% en insecticidas pesados.'],
  ['Pulgón Verde y del Algodón', 'Myzus persicae / Aphis gossypii', '100% Barrera Física', 'Presencia en 3% de brotes apicales', 'Aphidoletes aphidimyza · Coccinélidos', 'Flonicamid · Sulfoxaflor', 'IRAC 29 / IRAC 4C', 'Segregan melaza y provocan fumagina en frutos. Excluidos por malla hermética.'],
  ['Oídio / Cenicilla Polvorienta', 'Leveillula taurica', 'Control Microclimático', 'Presencia de primeras manchas cloróticas', 'Biofungicidas (Bacillus subtilis) · Ventilación', 'Azoxystrobin + Difenoconazol', 'FRAC 11 + 3', 'Favorecido por microclimas estancados. Se previene con altura ≥ 3.0 m y extractores eólicos.'],
  ['Mancha Bacteriana', 'Xanthomonas campestris', 'Protección de Cubierta', 'Aparición tras lluvias de mayo-octubre', 'Extracto de semillas de toronja · Ventilación', 'Oxicloruro de Cobre + Mancozeb', 'FRAC M01 + M03', 'Entra por estomas y heridas por viento. La malla frena el impacto mecánico de lluvia y ráfagas.']
];

// 5. Hoja 05: Cálculo de Gastos y ROI
const calculoGastosHeaders = [
  'Categoría Presupuestaria', 'Rubro Específico de Costo', 'Especificación Comercial / Detalle', 
  'Tipo de Gasto', 'Monto Unitario / Base', 'Costo Total (USD)', 'Porcentaje del Total'
];
const calculoGastosRows = [
  ['1. Semillero & Labranza', 'Semilla Híbrida Magistral F1', '3 sobres de 1.000 semillas certificadas', 'OPEX Producción', '$150 / sobre', 450, '6.1%'],
  ['1. Semillero & Labranza', 'Germinación & Bandejas', 'Bandejas 128 celdas + Peat moss Klasmann', 'OPEX Producción', '$0.06 / plántula', 150, '2.0%'],
  ['1. Semillero & Labranza', 'Preparación de Suelo', 'Pase de tractor, rastra y 10 camellones a 2m', 'OPEX Producción', '$18 / camellón', 180, '2.4%'],
  ['1. Semillero & Labranza', 'Mano de Obra Trasplante', 'Cuadrilla de siembra para 2.500 plántulas', 'OPEX Producción', '$0.032 / planta', 80, '1.1%'],
  
  ['2. Nutrición & Fitosanidad', 'Fertilizantes Solubles AIFA', 'Nitrato Calcio, Potasio, MKP, Mg (20 sem)', 'OPEX Producción', 'Programa 20 sem', 1380, '18.7%'],
  ['2. Nutrición & Fitosanidad', 'Regulador pH Ácido Nítrico 60%', '224 Litros / ciclo para neutralizar agua pozo', 'OPEX Producción', '$0.98 / Litro', 220, '3.0%'],
  ['2. Nutrición & Fitosanidad', 'Agroquímicos & Biológicos IPM', 'Acaricidas, spinosad, cobre, trampas cromáticas', 'OPEX Producción', 'Plan rotación IRAC', 540, '7.3%'],
  ['2. Nutrición & Fitosanidad', 'Cisternas de Agua Dulce', '40 viajes × 10.000 L ($20/viaje) para dilución', 'OPEX Producción', '$20 / cisterna', 800, '10.8%'],
  
  ['3. Reacondicionamiento Estructural', 'Fondo Blanco Anticorrosivo', '1 cuñete epóxico para herrería Sch 40', 'CAPEX Reactivación', '1 cuñete', 75, '1.0%'],
  ['3. Reacondicionamiento Estructural', 'Mano de Obra Lijado y Pintura', '108 pilares, vigas y tensores', 'CAPEX Reactivación', 'Herrería nave', 120, '1.6%'],
  ['3. Reacondicionamiento Estructural', 'Instalación y Costura Malla', 'Mano de obra colocación con hilo UV reforzado', 'CAPEX Reactivación', '4 paños 50m', 180, '2.4%'],
  
  ['4. Sistema de Riego & Cabezal', 'Tubería Matriz PEAD 1"-1.5"', 'Matriz y submatrices con codos y uniones', 'CAPEX Reactivación', 'Instalación completa', 120, '1.6%'],
  ['4. Sistema de Riego & Cabezal', 'Cinta Goteo Goteros PC 1.6 L/h', '1.000 m cinta espaciada a 40 cm autocompensante', 'OPEX / CAPEX', '$0.18 / metro', 180, '2.4%'],
  ['4. Sistema de Riego & Cabezal', 'Conectores Iniciales y Válvulas', '20 conectores con válvula + gomas grommet', 'CAPEX Reactivación', '$3.00 / unidad', 60, '0.8%'],
  ['4. Sistema de Riego & Cabezal', '3 Tanques para Fertirriego', 'Tanque A 500L, Tanque B 500L, Tanque C 200L', 'CAPEX Reactivación', 'Batería 3 tanques', 220, '3.0%'],
  
  ['5. Cubierta & Tutorado', '4 Rollos Malla 50 Mesh 130 gsm', '4 rollos de 4.2m × 50m monofilamento virgen', 'CAPEX Reactivación', '$560 en efectivo / rollo', 2240, '30.4%'],
  ['5. Cubierta & Tutorado', 'Hortomalla 15×15 cm + Alambres', '500m malla soporte cajón + alambres Cal 12-14', 'CAPEX Reactivación', 'Tutorado completo', 380, '5.2%'],
  
  ['RESUMEN FINANCIERO', 'Subtotal OPEX Producción (1er Ciclo)', 'Semilla, nutrición, fitosanidad, agua y labores', 'OPEX', '2.500 plantas', 4755, '64.5%'],
  ['RESUMEN FINANCIERO', 'Subtotal CAPEX Adecuación & Malla', 'Malla 50 mesh, hortomalla, tanques, pintura', 'CAPEX', 'Activos fijos nave', 2620, '35.5%'],
  ['RESUMEN FINANCIERO', 'INVERSIÓN TOTAL 1ER CICLO', 'Deducción total del primer ciclo productivo', 'TOTAL DEDUCCIONES', '1.000 m²', 7375, '100.0%'],
  
  ['PROYECCIÓN DE INGRESOS', 'Escenario Base: $14.0 USD / cesta', '13.000 kg (650 cestas) × $0.70 USD/kg', 'Ingreso Bruto', '$14 / cesta 20kg', 9100, '-'],
  ['PROYECCIÓN DE INGRESOS', 'Utilidad Neta Libre (1er Ciclo Base)', 'Ingreso $9.100 - Inversión Total $7.375', 'Utilidad Neta', 'Recupera Malla 100%', 1725, '+23% ROI'],
  ['PROYECCIÓN DE INGRESOS', 'OPEX Recurrente (2do Ciclo en adelante)', 'Solo costo de producción (malla y equipos ya pagos)', 'OPEX Recurrente', 'Ciclos subsiguientes', 3800, '-'],
  ['PROYECCIÓN DE INGRESOS', 'Utilidad Libre Proyectada (2do Ciclo)', 'Ingreso $9.100 - OPEX Recurrente $3.800', 'Utilidad Recurrente', 'Cada 5 meses', 5300, '+139% ROI'],
  ['PROYECCIÓN DE INGRESOS', 'Escenario Favorable: $18.0 USD / cesta', '13.000 kg (650 cestas) × $0.90 USD/kg', 'Ingreso Bruto', '$18 / cesta 20kg', 11700, '-'],
  ['PROYECCIÓN DE INGRESOS', 'Utilidad Neta Libre (Escenario Favorable)', 'Ingreso $11.700 - Inversión Total $7.375', 'Utilidad Neta', '1er Ciclo con buen precio', 4325, '+59% ROI'],
  ['PROYECCIÓN DE INGRESOS', 'Escenario Conservador: $11.0 USD / cesta', '13.000 kg (650 cestas) × $0.55 USD/kg', 'Ingreso Bruto', '$11 / cesta 20kg', 7150, '-']
];

function buildWorkbook() {
  const wb = XLSX.utils.book_new();

  const sheets = [
    { name: '01_Plan_Siembra', headers: planSiembraHeaders, rows: planSiembraRows },
    { name: '02_Plan_Riego_FAO56', headers: planRiegoHeaders, rows: planRiegoRows },
    { name: '03_Plan_Fertilizacion_AIFA', headers: planFertilizacionHeaders, rows: planFertilizacionRows },
    { name: '04_Plan_Fitosanitario_IPM', headers: planFitosanitarioHeaders, rows: planFitosanitarioRows },
    { name: '05_Calculo_Gastos_ROI', headers: calculoGastosHeaders, rows: calculoGastosRows },
  ];

  for (const s of sheets) {
    const tableData = [s.headers, ...s.rows];
    const ws = XLSX.utils.aoa_to_sheet(tableData);

    // Ajuste de ancho de columnas
    const colWidths = s.headers.map((h, i) => {
      let maxLen = h.length;
      for (const row of s.rows) {
        const val = row[i];
        if (val !== undefined && val !== null) {
          maxLen = Math.max(maxLen, String(val).length);
        }
      }
      return { wch: Math.min(50, Math.max(15, maxLen + 2)) };
    });
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, s.name);
  }

  const outputFileName = 'Plan_Maestro_Pimenton_Quibor.xlsx';
  const outPath1 = path.join(ROOT_DIR, outputFileName);
  const outPath2 = path.join(ROOT_DIR, 'public', outputFileName);

  XLSX.writeFile(wb, outPath1);
  XLSX.writeFile(wb, outPath2);

  console.log(`✅ Archivo Excel generado con éxito con las 5 pestañas:`);
  console.log(`  -> ${outPath1}`);
  console.log(`  -> ${outPath2}`);
}

buildWorkbook();
