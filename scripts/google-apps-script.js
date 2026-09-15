/**
 * ===============================================================================
 * AGROVENECUA — CÓDIGO GOOGLE APPS SCRIPT PARA GOOGLE SHEETS
 * Documento Oficial: https://docs.google.com/spreadsheets/d/1flk-st-27PIKnTmO2q0KzUnGUR2RSdnvWXiupKHD8uE/edit?usp=sharing
 * ID: 1flk-st-27PIKnTmO2q0KzUnGUR2RSdnvWXiupKHD8uE
 * ===============================================================================
 * 
 * INSTRUCCIONES DE INSTALACIÓN EN 1 MINUTO:
 * 1. Abre tu hoja de Google Sheets en el navegador.
 * 2. En el menú superior haz clic en: Extensiones > Apps Script.
 * 3. Borra cualquier código que aparezca en el editor (ej. `myFunction()`).
 * 4. Pega todo este código completo y haz clic en el icono de Guardar (disco).
 * 5. Haz clic en "Ejecutar" en la función `generarPlanesProduccion`.
 *    (Google te pedirá autorizar permisos una sola vez).
 * 6. ¡Listo! Se crearán y formatearán automáticamente las 5 pestañas:
 *    - 01_Plan_Siembra
 *    - 02_Plan_Riego_FAO56
 *    - 03_Plan_Fertilizacion_AIFA
 *    - 04_Plan_Fitosanitario_IPM
 *    - 05_Calculo_Gastos_ROI
 * 
 * (Opcional para Sincronización Automática desde la Web):
 * - En Apps Script, haz clic arriba a la derecha en "Implementar" > "Nueva implementación".
 * - Tipo: "Aplicación web".
 * - Ejecutar como: "Yo".
 * - Quién tiene acceso: "Cualquier usuario".
 * - Copia la URL que te arroje y pégala en la web en el botón "Configurar Webhook".
 */

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('🌱 Agrovenecua Quíbor')
    .addItem('⚡ Generar / Actualizar Todos los Planes', 'generarPlanesProduccion')
    .addSeparator()
    .addItem('💧 Actualizar Plan de Riego FAO-56', 'generarPlanRiego')
    .addItem('🧪 Actualizar Plan de Nutrición AIFA', 'generarPlanFertilizacion')
    .addItem('💰 Actualizar Cálculo de Gastos y ROI', 'generarCalculoGastos')
    .addToUi();
}

/**
 * Función Principal: Crea y formatea todas las hojas del proyecto
 */
function generarPlanesProduccion() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  crearHojaPlanSiembra(ss);
  crearHojaPlanRiego(ss);
  crearHojaPlanFertilizacion(ss);
  crearHojaPlanFitosanitario(ss);
  crearHojaCalculoGastos(ss);
  
  // Limpiar Hoja 1 inicial si aún existe
  var hojaInicial = ss.getSheetByName('Hoja 1');
  if (hojaInicial && ss.getSheets().length > 1) {
    try {
      ss.deleteSheet(hojaInicial);
    } catch(e) {}
  }
  
  SpreadsheetApp.getActiveSpreadsheet().toast('¡Las 5 Hojas Agronómicas y Financieras se han generado exitosamente!', 'Agrovenecua Quíbor', 5);
}

// ===============================================================================
// 1. HOJA: 01_Plan_Siembra
// ===============================================================================
function crearHojaPlanSiembra(ss) {
  var nombre = '01_Plan_Siembra';
  var sheet = getOrCreateSheet(ss, nombre, 0);
  sheet.clear();
  
  var data = [
    ['PARÁMETRO TÉCNICO', 'VALOR ESPECIFICADO', 'UNIDAD DE MEDIDA', 'OBSERVACIONES AGRONÓMICAS QUÍBOR'],
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
    ['Cubierta de Protección', 'Malla Anti-Insectos 50 Mesh Blanca', '130 gsm', 'HDPE monofilamento virgen, poro ≤ 192 µm, difusor lumínico e infrarrojo'],
    ['Extractores Cenitales Eólicos', 8, 'unidades 24"-30"', 'Refuerzo eólico cenital para renovación convectiva en horas pico de calma'],
    ['Orientación Predominante', 'Eje largo Norte-Sur / Refuerzo Este', 'Brújula', 'Fachada Este reforzada por viento dominante durante 11 meses (hasta 27 km/h ráfaga)'],
    ['Duración del Ciclo', 20, 'semanas (140 días)', 'Ciclo completo de trasplante a final de cosecha'],
    ['Meta Rendimiento', 13000, 'kg / ciclo', '13.0 Toneladas métricas equivalentes a 650 cestas de 20 kg (5.20 kg / planta)'],
    ['Garantía Calibre Grande (Primera)', '88%', 'Porcentaje', 'Frutos Extra Grandes / Jumbo > 220 gramos'],
    ['Calibre Mediano (Segunda)', '10%', 'Porcentaje', 'Frutos de 170 a 220 gramos'],
    ['Descarte / Maraña', '2%', 'Porcentaje', 'Mínimo descarte gracias a protección 50 mesh y nutrición AIFA']
  ];
  
  sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
  darFormatoHoja(sheet, data.length, data[0].length, '#1b4332');
}

// ===============================================================================
// 2. HOJA: 02_Plan_Riego_FAO56
// ===============================================================================
function crearHojaPlanRiego(ss) {
  var nombre = '02_Plan_Riego_FAO56';
  var sheet = getOrCreateSheet(ss, nombre, 1);
  sheet.clear();
  
  var headers = [
    'SEMANA', 'FASE FENOLÓGICA', 'KC (FAO-56)', 'ET0 (MM/D)', 'ETC NETA (MM/D)', 
    'FRACC. LIXIV. (LF)', 'LÁMINA BRUTA (MM/D)', 'L / PLANTA / DÍA', 'L / PLANTA / SEM', 
    'VOL. TOTAL SEMANAL (M³)', 'GOTEROS PC (1.6 L/H)', 'MINUTOS RIEGO / DÍA', 'TURNOS / DÍA'
  ];
  
  var data = [headers];
  var lfMultiplier = 1.15; // LF por salinidad del pozo en Quíbor (ECw 1.45 dS/m)
  
  for (var w = 1; w <= 24; w++) {
    var fase = '';
    var kc = 0.50;
    var baseLiters = 7.0;
    
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
    
    var et0 = 5.6;
    var etcNet = Math.round(et0 * kc * 100) / 100;
    var grossMm = Math.round(etcNet * lfMultiplier * 100) / 100;
    var grossLitersWeek = Math.round(baseLiters * lfMultiplier * 10) / 10;
    var litersDay = Math.round((grossLitersWeek / 7) * 100) / 100;
    var totalM3 = Math.round(((grossLitersWeek * 2500) / 1000) * 10) / 10;
    var minutes = Math.round((litersDay / 3.2) * 60);
    var turnos = minutes > 45 ? 2 : 1;
    
    data.push([
      'Sem ' + (w < 10 ? '0' + w : w),
      fase,
      kc,
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
  
  sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
  darFormatoHoja(sheet, data.length, data[0].length, '#0d47a1');
}

// ===============================================================================
// 3. HOJA: 03_Plan_Fertilizacion_AIFA
// ===============================================================================
function crearHojaPlanFertilizacion(ss) {
  var nombre = '03_Plan_Fertilizacion_AIFA';
  var sheet = getOrCreateSheet(ss, nombre, 2);
  sheet.clear();
  
  var data = [
    [
      'SEMANA', 'ETAPA FENOLÓGICA', 'NITRATO CALCIO (G/PL)', 'NITRATO POTASIO (G/PL)', 
      'FOSFATO MKP (G/PL)', 'SULFATO MAGNESIO (G/PL)', 'SULFATO POTASIO (G/PL)', 
      'ÁCIDO NÍTRICO 60% (ML/PL)', 'TOTAL FERTILIZANTE SEMANAL (KG)', 'TOTAL ÁCIDO NÍTRICO (L)', 
      'CONDUCTIVIDAD (DS/M)', 'PH SALIDA'
    ],
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
  
  sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
  darFormatoHoja(sheet, data.length, data[0].length, '#2e7d32');
}

// ===============================================================================
// 4. HOJA: 04_Plan_Fitosanitario_IPM
// ===============================================================================
function crearHojaPlanFitosanitario(ss) {
  var nombre = '04_Plan_Fitosanitario_IPM';
  var sheet = getOrCreateSheet(ss, nombre, 3);
  sheet.clear();
  
  var data = [
    [
      'BLANCO BIOLÓGICO', 'NOMBRE CIENTÍFICO', 'EFICACIA MALLA 50 MESH', 'UMBRAL DE ACCIÓN', 
      'CONTROL BIOLÓGICO', 'INGREDIENTE ACTIVO', 'CÓDIGO IRAC / FRAC', 'RIESGO EN QUÍBOR'
    ],
    ['Trips de las Flores', 'Frankliniella occidentalis', '100% Barrera Física (Poro ≤ 192 µm)', '1 trips por flor en 5 flores al azar', 'Orius insidiosus · Trampas azules', 'Spinosad · Emamectina', 'IRAC 5 / IRAC 6', 'Vector de TSWV. Excluido por malla 50 mesh.'],
    ['Mosca Blanca', 'Bemisia tabaci', '100% Barrera Física (Poro ≤ 192 µm)', '1 adulto por cada 10 hojas', 'Chrysoperla carnea · Encarsia formosa', 'Flupyradifurone · Cyantraniliprole', 'IRAC 4D / IRAC 28', 'Vector Geminivirus. La luz blanca difusa desorienta su vuelo.'],
    ['Araña Roja & Ácaro Blanco', 'Tetranychus urticae / Polyphagotarsonemus', '0% Exclusión (Tamaño < 140 µm)', 'Primer foco visible', 'Amblyseius swirskii · Neoseiulus · HR > 60%', 'Etoxazol · Spiromesifen · Azufre', 'IRAC 10B / IRAC 23', '¡Alerta! Ninguna malla la retiene. Control de HR y acaricidas.'],
    ['Minador de la Hoja', 'Liriomyza sativae / huidobrensis', '100% Barrera Física', '5 galerías activas por planta', 'Diglyphus isaea · Trampas amarillas', 'Ciromazina · Cartap', 'IRAC 17 / IRAC 14', 'Detenido al 100% por la malla hermética.'],
    ['Gusano Soldado y Barrenador', 'Spodoptera frugiperda / Helicoverpa zea', '100% Barrera Física Total', '0 tolerancia en fruto cuajado', 'Bacillus thuringiensis · Feromonas', 'Clorantraniliprol · Indoxacarb', 'IRAC 28 / IRAC 22A', 'Polillas no penetran la estructura. 80% menos plaguicidas.'],
    ['Pulgón Verde y del Algodón', 'Myzus persicae / Aphis gossypii', '100% Barrera Física', '3% brotes apicales infestados', 'Aphidoletes aphidimyza · Coccinélidos', 'Flonicamid · Sulfoxaflor', 'IRAC 29 / IRAC 4C', 'Excluidos mecánicamente por el tejido monofilamento.'],
    ['Oídio / Cenicilla', 'Leveillula taurica', 'Control Microclimático', 'Primeras manchas cloróticas', 'Bacillus subtilis · Ventilación eólica', 'Azoxystrobin + Difenoconazol', 'FRAC 11 + 3', 'Prevenido por altura al alero 3.0m y extractores eólicos.'],
    ['Mancha Bacteriana', 'Xanthomonas campestris', 'Protección de Cubierta', 'Aparición tras lluvias mayo-oct', 'Extracto toronja · Ventilación rápida', 'Oxicloruro de Cobre + Mancozeb', 'FRAC M01 + M03', 'Malla mitiga impacto de gotas de lluvia y heridas mecánicas.']
  ];
  
  sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
  darFormatoHoja(sheet, data.length, data[0].length, '#b71c1c');
}

// ===============================================================================
// 5. HOJA: 05_Calculo_Gastos_ROI
// ===============================================================================
function crearHojaCalculoGastos(ss) {
  var nombre = '05_Calculo_Gastos_ROI';
  var sheet = getOrCreateSheet(ss, nombre, 4);
  sheet.clear();
  
  var data = [
    ['CATEGORÍA PRESUPUESTARIA', 'RUBRO ESPECÍFICO DE COSTO', 'ESPECIFICACIÓN COMERCIAL / DETALLE', 'TIPO DE GASTO', 'MONTO UNITARIO', 'COSTO TOTAL (USD)', '% DEL TOTAL'],
    ['1. Semillero & Labranza', 'Semilla Híbrida Magistral F1', '3 sobres de 1.000 semillas certificadas', 'OPEX Producción', '$150 / sobre', 450, 0.061],
    ['1. Semillero & Labranza', 'Germinación & Bandejas', 'Bandejas 128 celdas + Peat moss Klasmann', 'OPEX Producción', '$0.06 / plántula', 150, 0.020],
    ['1. Semillero & Labranza', 'Preparación de Suelo', 'Pase de tractor, rastra y 10 camellones a 2m', 'OPEX Producción', '$18 / camellón', 180, 0.024],
    ['1. Semillero & Labranza', 'Mano de Obra Trasplante', 'Cuadrilla de siembra para 2.500 plántulas', 'OPEX Producción', '$0.032 / planta', 80, 0.011],
    
    ['2. Nutrición & Fitosanidad', 'Fertilizantes Solubles AIFA', 'Nitrato Calcio, Potasio, MKP, Mg (20 sem)', 'OPEX Producción', 'Programa 20 sem', 1380, 0.187],
    ['2. Nutrición & Fitosanidad', 'Regulador pH Ácido Nítrico 60%', '224 Litros / ciclo para neutralizar agua pozo', 'OPEX Producción', '$0.98 / Litro', 220, 0.030],
    ['2. Nutrición & Fitosanidad', 'Agroquímicos & Biológicos IPM', 'Acaricidas, spinosad, cobre, trampas cromáticas', 'OPEX Producción', 'Plan rotación IRAC', 540, 0.073],
    ['2. Nutrición & Fitosanidad', 'Cisternas de Agua Dulce', '40 viajes × 10.000 L ($20/viaje) para dilución', 'OPEX Producción', '$20 / cisterna', 800, 0.108],
    
    ['3. Reacondicionamiento Estructural', 'Fondo Blanco Anticorrosivo', '1 cuñete epóxico para herrería Sch 40', 'CAPEX Reactivación', '1 cuñete', 75, 0.010],
    ['3. Reacondicionamiento Estructural', 'Mano de Obra Lijado y Pintura', '108 pilares, vigas y tensores', 'CAPEX Reactivación', 'Herrería nave', 120, 0.016],
    ['3. Reacondicionamiento Estructural', 'Instalación y Costura Malla', 'Mano de obra colocación con hilo UV reforzado', 'CAPEX Reactivación', '4 paños 50m', 180, 0.024],
    
    ['4. Sistema de Riego & Cabezal', 'Tubería Matriz PEAD 1"-1.5"', 'Matriz y submatrices con codos y uniones', 'CAPEX Reactivación', 'Instalación completa', 120, 0.016],
    ['4. Sistema de Riego & Cabezal', 'Cinta Goteo Goteros PC 1.6 L/h', '1.000 m cinta espaciada a 40 cm autocompensante', 'OPEX / CAPEX', '$0.18 / metro', 180, 0.024],
    ['4. Sistema de Riego & Cabezal', 'Conectores Iniciales y Válvulas', '20 conectores con válvula + gomas grommet', 'CAPEX Reactivación', '$3.00 / unidad', 60, 0.008],
    ['4. Sistema de Riego & Cabezal', '3 Tanques para Fertirriego', 'Tanque A 500L, Tanque B 500L, Tanque C 200L', 'CAPEX Reactivación', 'Batería 3 tanques', 220, 0.030],
    
    ['5. Cubierta & Tutorado', '4 Rollos Malla 50 Mesh 130 gsm', '4 rollos de 4.2m × 50m monofilamento virgen', 'CAPEX Reactivación', '$560 en efectivo / rollo', 2240, 0.304],
    ['5. Cubierta & Tutorado', 'Hortomalla 15×15 cm + Alambres', '500m malla soporte cajón + alambres Cal 12-14', 'CAPEX Reactivación', 'Tutorado completo', 380, 0.052],
    
    ['RESUMEN FINANCIERO', 'Subtotal OPEX Producción (1er Ciclo)', 'Semilla, nutrición, fitosanidad, agua y labores', 'OPEX', '2.500 plantas', 4755, 0.645],
    ['RESUMEN FINANCIERO', 'Subtotal CAPEX Adecuación & Malla', 'Malla 50 mesh, hortomalla, tanques, pintura', 'CAPEX', 'Activos fijos nave', 2620, 0.355],
    ['RESUMEN FINANCIERO', 'INVERSIÓN TOTAL 1ER CICLO', 'Deducción total del primer ciclo productivo', 'TOTAL DEDUCCIONES', '1.000 m²', 7375, 1.000],
    
    ['PROYECCIÓN DE INGRESOS', 'Escenario Base: $14.0 USD / cesta', '13.000 kg (650 cestas) × $0.70 USD/kg', 'Ingreso Bruto', '$14 / cesta 20kg', 9100, ''],
    ['PROYECCIÓN DE INGRESOS', 'Utilidad Neta Libre (1er Ciclo Base)', 'Ingreso $9.100 - Inversión Total $7.375', 'Utilidad Neta', 'Recupera Malla 100%', 1725, '+23% ROI'],
    ['PROYECCIÓN DE INGRESOS', 'OPEX Recurrente (2do Ciclo en adelante)', 'Solo costo de producción (malla y equipos ya pagos)', 'OPEX Recurrente', 'Ciclos subsiguientes', 3800, ''],
    ['PROYECCIÓN DE INGRESOS', 'Utilidad Libre Proyectada (2do Ciclo)', 'Ingreso $9.100 - OPEX Recurrente $3.800', 'Utilidad Recurrente', 'Cada 5 meses', 5300, '+139% ROI'],
    ['PROYECCIÓN DE INGRESOS', 'Escenario Favorable: $18.0 USD / cesta', '13.000 kg (650 cestas) × $0.90 USD/kg', 'Ingreso Bruto', '$18 / cesta 20kg', 11700, ''],
    ['PROYECCIÓN DE INGRESOS', 'Utilidad Neta Libre (Escenario Favorable)', 'Ingreso $11.700 - Inversión Total $7.375', 'Utilidad Neta', '1er Ciclo con buen precio', 4325, '+59% ROI'],
    ['PROYECCIÓN DE INGRESOS', 'Escenario Conservador: $11.0 USD / cesta', '13.000 kg (650 cestas) × $0.55 USD/kg', 'Ingreso Bruto', '$11 / cesta 20kg', 7150, '']
  ];
  
  sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
  darFormatoHoja(sheet, data.length, data[0].length, '#e65100');
  
  // Formato monetario para columna F (Costo Total)
  sheet.getRange(2, 6, data.length - 1, 1).setNumberFormat('$#,##0');
}

// ===============================================================================
// UTILIDADES DE FORMATO Y ESTILO CORPORATIVO AGTECH
// ===============================================================================
function getOrCreateSheet(ss, name, index) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name, index);
  }
  return sheet;
}

function darFormatoHoja(sheet, numRows, numCols, colorEncabezado) {
  // 1. Congelar fila de encabezado
  sheet.setFrozenRows(1);
  
  // 2. Formato de Encabezado
  var headerRange = sheet.getRange(1, 1, 1, numCols);
  headerRange.setBackground(colorEncabezado || '#1b4332');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setFontSize(10);
  headerRange.setFontFamily('Arial');
  headerRange.setHorizontalAlignment('center');
  headerRange.setVerticalAlignment('middle');
  sheet.setRowHeight(1, 32);
  
  // 3. Formato de Celdas de Datos
  if (numRows > 1) {
    var dataRange = sheet.getRange(2, 1, numRows - 1, numCols);
    dataRange.setFontFamily('Arial');
    dataRange.setFontSize(9);
    dataRange.setVerticalAlignment('middle');
    
    // Bordes sutiles
    dataRange.setBorder(true, true, true, true, true, true, '#e0e0e0', SpreadsheetApp.BorderStyle.SOLID);
    
    // Filas alternadas suaves
    for (var r = 2; r <= numRows; r++) {
      sheet.setRowHeight(r, 24);
      if (r % 2 === 0) {
        sheet.getRange(r, 1, 1, numCols).setBackground('#f9fbf9');
      } else {
        sheet.getRange(r, 1, 1, numCols).setBackground('#ffffff');
      }
    }
  }
  
  // 4. Ajuste automático de ancho de columnas
  for (var c = 1; c <= numCols; c++) {
    sheet.autoResizeColumn(c);
    var currentWidth = sheet.getColumnWidth(c);
    if (currentWidth < 120) {
      sheet.setColumnWidth(c, 130);
    }
  }
}

// ===============================================================================
// WEBHOOK HTTP POST: Permite sincronizar en tiempo real desde la aplicación web
// ===============================================================================
function doPost(e) {
  try {
    var contents = e.postData ? e.postData.contents : '';
    if (!contents) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Cuerpo vacío' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var payload = JSON.parse(contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if (payload.sheets && Array.isArray(payload.sheets)) {
      payload.sheets.forEach(function(s, idx) {
        var sheet = getOrCreateSheet(ss, s.name, idx);
        sheet.clear();
        var fullData = [s.headers].concat(s.rows);
        sheet.getRange(1, 1, fullData.length, fullData[0].length).setValues(fullData);
        darFormatoHoja(sheet, fullData.length, fullData[0].length, idx % 2 === 0 ? '#1b4332' : '#0d47a1');
      });
    } else {
      generarPlanesProduccion();
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Hojas actualizadas exitosamente vía Webhook.',
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
