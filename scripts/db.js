import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DB_PATH = path.join(ROOT_DIR, 'database.sqlite');
const JSON_OUTPUT_PATH = path.join(ROOT_DIR, 'src', 'core', 'constants', 'database.json');

export function getDatabase() {
  const db = new DatabaseSync(DB_PATH);
  db.exec('PRAGMA journal_mode = WAL;');
  return db;
}

export function initDatabase() {
  const db = getDatabase();

  // 1. Tabla de Parámetros y Configuración General
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      label TEXT NOT NULL,
      value TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'text',
      description TEXT
    );
  `);

  // 2. Tabla Climatológica Mensual (NASA MERRA-2 Quíbor)
  db.exec(`
    CREATE TABLE IF NOT EXISTS climate_months (
      id INTEGER PRIMARY KEY,
      mes TEXT NOT NULL,
      max REAL NOT NULL,
      min REAL NOT NULL,
      tmed REAL NOT NULL,
      lluvia REAL NOT NULL,
      viento REAL NOT NULL,
      bochorno REAL NOT NULL,
      rh REAL NOT NULL,
      rad REAL NOT NULL,
      eto REAL NOT NULL,
      dir TEXT NOT NULL,
      flags TEXT DEFAULT '{}'
    );
  `);

  // 3. Tabla de Catálogo Agronómico de Cultivos
  db.exec(`
    CREATE TABLE IF NOT EXISTS crops (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      scientific_name TEXT NOT NULL,
      ec_threshold REAL NOT NULL,
      slope_percent_per_ds REAL NOT NULL,
      recommended_gsm TEXT NOT NULL,
      pesticide_reduction TEXT NOT NULL,
      virosis_risk_reduction TEXT NOT NULL,
      target_yield_tons REAL NOT NULL,
      avg_price_usd_per_kg REAL NOT NULL
    );
  `);

  // 4. Tabla de Textos y Contenidos del Sitio
  db.exec(`
    CREATE TABLE IF NOT EXISTS site_content (
      key TEXT PRIMARY KEY,
      section TEXT NOT NULL,
      label TEXT NOT NULL,
      value TEXT NOT NULL
    );
  `);

  // Seed de Datos Iniciales si están vacías
  seedSettings(db);
  seedClimate(db);
  seedCrops(db);
  seedSiteContent(db);

  return db;
}

function seedSettings(db) {
  const count = db.prepare('SELECT count(*) as count FROM settings').get().count;
  if (count > 0) return;

  const insert = db.prepare(`
    INSERT INTO settings (key, category, label, value, type, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const initialSettings = [
    ['PROJECT_NAME', 'general', 'Nombre del Proyecto', 'LA CIGARRONERA', 'text', 'Nombre oficial del desarrollo agrícola'],
    ['LOCATION_NAME', 'general', 'Ubicación', 'Valle de Quíbor, Municipio Jiménez, Lara, Venezuela', 'text', 'Zona geográfica del proyecto'],
    ['COTA_MSNM', 'general', 'Altitud (msnm)', '700', 'number', 'Cota altitudinal sobre el nivel del mar'],
    ['LATITUDE', 'general', 'Latitud', '9.888889', 'number', 'Coordenada satelital Norte'],
    ['LONGITUDE', 'general', 'Longitud', '-69.593056', 'number', 'Coordenada satelital Oeste'],
    
    // Invernadero
    ['GH_DEFAULT_SURFACE_M2', 'greenhouse', 'Superficie Base (m²)', '1000', 'number', 'Área estándar del módulo'],
    ['GH_LENGTH_M', 'greenhouse', 'Largo Estructural (m)', '50.0', 'number', 'Longitud de la nave'],
    ['GH_WIDTH_M', 'greenhouse', 'Ancho Estructural (m)', '20.0', 'number', 'Ancho de la nave'],
    ['GH_MIN_GUTTER_HEIGHT_M', 'greenhouse', 'Altura al Alero/Canal (m)', '3.0', 'number', 'Altura mínima para disipación térmica'],
    ['GH_OPT_RIDGE_HEIGHT_M', 'greenhouse', 'Altura a Cumbrera (m)', '5.5', 'number', 'Altura cenital recomendada'],
    ['GH_TRELLIS_HEIGHT_M', 'greenhouse', 'Altura de Tutorado (m)', '2.0', 'number', 'Altura de hilo de soporte'],
    ['GH_PLANT_DENSITY_M2', 'greenhouse', 'Densidad de Plantación (pl/m²)', '2.2', 'number', 'Densidad óptima para pimentón/tomate'],
    ['GH_WIND_TURBINES_COUNT', 'greenhouse', 'Extractores Eólicos Cenitales', '8', 'number', 'Unidades de cumbrera por 1000 m²'],

    // Malla
    ['MESH_SPEC', 'mesh', 'Especificación de Malla', '130 gsm, 50 mesh (50×25 hilos/pulgada) HDPE monofilamento virgen, Color Blanco', 'text', 'Especificación técnica recomendada'],
    ['MESH_COLOR', 'mesh', 'Color de Malla', 'Blanco / Cristal', 'text', 'Color reflectivo para control térmico'],
    ['MESH_WEIGHT_GSM', 'mesh', 'Gramaje (gsm)', '130', 'number', 'Gramaje de referencia'],
    ['MESH_MAX_PORE_MICRONS', 'mesh', 'Apertura de Poro (µm)', '192', 'number', 'Límite de exclusión de trips y mosca blanca'],
    ['MESH_PRICE_USD', 'mesh', 'Precio Rollo de Malla (USD)', '560', 'number', 'Costo por rollo de malla anti-insectos'],

    // Pozo y Acuífero
    ['WELL_STATIC_LEVEL_M', 'water', 'Nivel Estático de Agua (m)', '49.5', 'number', 'Profundidad del espejo de agua'],
    ['WELL_PUMPING_FLOW_LS', 'water', 'Caudal de Bombeo (L/s)', '2.5', 'number', 'Régimen de explotación del pozo'],
    ['WATER_EC_DSM', 'water', 'Conductividad Eléctrica Agua (dS/m)', '1.65', 'number', 'Salinidad media de pozo en Cuara'],
    ['AQUIFER_TRANSMISSIVITY', 'water', 'Transmisividad Acuífero T (m²/día)', '180.0', 'number', 'Parámetro de la formación Cuara'],
    ['AQUIFER_STORATIVITY', 'water', 'Coeficiente de Almacenamiento S', '0.0025', 'number', 'Régimen semiconductor / confinado'],

    // Viento
    ['WIND_DOMINANT_DIRECTION', 'wind', 'Dirección Dominante', 'ESTE', 'text', 'Dirección predominante durante 11 meses'],
    ['WIND_DESIGN_GUST_KMH', 'wind', 'Ráfaga de Diseño (km/h)', '27.0', 'number', 'Velocidad de ráfaga para cálculo de guayas y tensores'],
    ['WIND_SAFETY_FACTOR', 'wind', 'Factor de Seguridad Eólico', '1.5', 'number', 'Margen de sobrecarga estructural'],

    // Contacto
    ['CONTACT_WHATSAPP', 'contact', 'Número de WhatsApp', '+58 412 000 0000', 'text', 'Teléfono de contacto comercial'],
    ['CONTACT_EMAIL', 'contact', 'Email de Contacto', 'agrovenecua@gmail.com', 'text', 'Correo oficial de atención']
  ];

  for (const s of initialSettings) {
    insert.run(...s);
  }
}

function seedClimate(db) {
  const count = db.prepare('SELECT count(*) as count FROM climate_months').get().count;
  if (count > 0) return;

  const insert = db.prepare(`
    INSERT INTO climate_months (id, mes, max, min, tmed, lluvia, viento, bochorno, rh, rad, eto, dir, flags)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const months = [
    [1, "Enero", 30.1, 16.0, 23.8, 18.9, 7.7, 16.0, 69.2, 18.7, 5.4, "88% ESTE", "{}"],
    [2, "Febrero", 30.8, 16.0, 24.6, 11.2, 8.5, 14.5, 63.9, 20.2, 5.8, "85% ESTE", "{}"],
    [3, "Marzo", 31.0, 16.0, 25.4, 23.9, 8.6, 18.6, 62.2, 19.2, 6.4, "84% ESTE", '{"picoCalor": true}'],
    [4, "Abril", 30.6, 17.5, 25.6, 61.8, 8.5, 22.6, 67.7, 16.7, 6.2, "80% ESTE", "{}"],
    [5, "Mayo", 29.8, 18.4, 25.1, 104.0, 8.8, 28.1, 73.8, 16.5, 5.6, "78% ESTE", '{"maxLluvia": true}'],
    [6, "Junio", 28.6, 18.0, 24.2, 99.0, 10.4, 27.6, 77.9, 16.2, 5.2, "82% ESTE", '{"maxViento": true}'],
    [7, "Julio", 28.0, 19.0, 23.8, 99.8, 9.1, 28.0, 79.5, 17.2, 4.8, "85% ESTE", '{"masFresco": true}'],
    [8, "Agosto", 28.5, 17.9, 24.0, 95.2, 9.0, 28.6, 80.1, 18.2, 5.1, "86% ESTE", '{"picoBochorno": true}'],
    [9, "Septiembre", 29.2, 18.1, 24.2, 82.8, 8.2, 27.6, 79.1, 18.7, 5.3, "53% SUR (Excepción)", "{}"],
    [10, "Octubre", 29.4, 16.7, 24.0, 98.3, 6.7, 28.5, 80.3, 17.6, 4.6, "79% ESTE", "{}"],
    [11, "Noviembre", 29.2, 17.6, 23.9, 72.0, 7.0, 26.4, 80.3, 16.5, 4.9, "84% ESTE", '{"masCalmado": true}'],
    [12, "Diciembre", 29.4, 15.9, 23.7, 28.0, 7.2, 22.0, 75.1, 17.3, 5.0, "87% ESTE", "{}"]
  ];

  for (const m of months) {
    insert.run(...m);
  }
}

function seedCrops(db) {
  const count = db.prepare('SELECT count(*) as count FROM crops').get().count;
  if (count > 0) return;

  const insert = db.prepare(`
    INSERT INTO crops (id, name, scientific_name, ec_threshold, slope_percent_per_ds, recommended_gsm, pesticide_reduction, virosis_risk_reduction, target_yield_tons, avg_price_usd_per_kg)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const crops = [
    ['pepper', 'Pimentón (Cultivo Principal)', 'Capsicum annuum', 1.5, 14.0, '125-130 gsm', '75%', '98%', 12.5, 0.90],
    ['tomato', 'Tomate Indeterminado (Hilo Alto)', 'Solanum lycopersicum', 2.5, 9.9, '110 gsm', '70%', '95%', 18.7, 0.80],
    ['cucumber', 'Pepino (Cultivo Terciario / Rotación Rápida)', 'Cucumis sativus', 2.5, 13.0, '110 gsm', '65%', '92%', 15.0, 0.65]
  ];

  for (const c of crops) {
    insert.run(...c);
  }
}

function seedSiteContent(db) {
  const count = db.prepare('SELECT count(*) as count FROM site_content').get().count;
  if (count > 0) return;

  const insert = db.prepare(`
    INSERT INTO site_content (key, section, label, value)
    VALUES (?, ?, ?, ?)
  `);

  const content = [
    ['hero_title', 'landing', 'Título Principal', 'Horticultura Protegida de Alta Eficiencia en el Valle de Quíbor'],
    ['hero_subtitle', 'landing', 'Subtítulo', 'Ingeniería bioclimática y casas de malla optimizadas para pimentón y tomate indeterminado bajo condiciones de clima semiárido cálido.'],
    ['cockpit_title', 'cockpit', 'Título Cockpit', 'Centro de Control y Gemelo Digital Bioclimático'],
    ['malla_cta', 'malla', 'Llamado a la Acción Malla', 'Cotiza tu rollo de Malla Anti-Insectos 50 Mesh de grado premium con despacho directo en Lara.']
  ];

  for (const c of content) {
    insert.run(...c);
  }
}

export function exportToJson() {
  const db = initDatabase();

  const settingsRows = db.prepare('SELECT * FROM settings ORDER BY category, key').all();
  const climateRows = db.prepare('SELECT * FROM climate_months ORDER BY id').all();
  const cropRows = db.prepare('SELECT * FROM crops ORDER BY id').all();
  const contentRows = db.prepare('SELECT * FROM site_content ORDER BY section, key').all();

  // Mapear settings a objeto estructurado
  const settingsObj = {};
  for (const row of settingsRows) {
    let val = row.value;
    if (row.type === 'number') {
      val = Number(val);
    } else if (row.type === 'json' || row.type === 'boolean') {
      try { val = JSON.parse(val); } catch (e) {}
    }
    settingsObj[row.key] = val;
  }

  // Mapear meses de clima a formato exacto ClimateMonth
  const climateMonths = climateRows.map((r) => {
    let flags = {};
    try { flags = JSON.parse(r.flags); } catch (e) {}
    return {
      mes: r.mes,
      max: Number(r.max),
      min: Number(r.min),
      tmed: Number(r.tmed),
      lluvia: Number(r.lluvia),
      viento: Number(r.viento),
      bochorno: Number(r.bochorno),
      rh: Number(r.rh),
      rad: Number(r.rad),
      eto: Number(r.eto),
      dir: r.dir,
      ...flags
    };
  });

  // Mapear cultivos
  const cropsCatalog = {};
  for (const c of cropRows) {
    cropsCatalog[c.id] = {
      id: c.id,
      name: c.name,
      scientificName: c.scientific_name,
      ecThreshold: Number(c.ec_threshold),
      slopePercentPerDs: Number(c.slope_percent_per_ds),
      recommendedGsm: c.recommended_gsm,
      pesticideReduction: c.pesticide_reduction,
      virosisRiskReduction: c.virosis_risk_reduction,
      targetYieldTons: Number(c.target_yield_tons),
      avgPriceUsdPerKg: Number(c.avg_price_usd_per_kg)
    };
  }

  // Mapear textos del sitio
  const siteContent = {};
  for (const s of contentRows) {
    siteContent[s.key] = s.value;
  }

  const exportPayload = {
    _meta: {
      generatedAt: new Date().toISOString(),
      source: 'database.sqlite',
      version: '2.0.0'
    },
    settings: settingsObj,
    settingsRaw: settingsRows,
    climateMonths,
    crops: cropsCatalog,
    cropsRaw: cropRows,
    siteContent,
    siteContentRaw: contentRows
  };

  // Asegurar directorio destino
  const dir = path.dirname(JSON_OUTPUT_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(JSON_OUTPUT_PATH, JSON.stringify(exportPayload, null, 2), 'utf-8');
  console.log(`[Data Baking] SQLite exportado exitosamente a: ${JSON_OUTPUT_PATH}`);
  return exportPayload;
}

// Ejecutar directamente si se llama desde la terminal
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  initDatabase();
  exportToJson();
  console.log('Base de datos inicializada y exportada a JSON con éxito.');
}
