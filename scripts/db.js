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

  // Recrear tablas para sincronización limpia y fresca
  db.exec(`
    DROP TABLE IF EXISTS settings;
    DROP TABLE IF EXISTS climate_months;
    DROP TABLE IF EXISTS crops;
    DROP TABLE IF EXISTS site_content;
  `);

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

  // 3. Tabla de Catálogo Agronómico de Cultivos (Exclusivo Pimentón)
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

  // Seed de Datos Iniciales Sincronizados desde docs/
  seedSettings(db);
  seedClimate(db);
  seedCrops(db);
  seedSiteContent(db);

  return db;
}

function seedSettings(db) {
  const insert = db.prepare(`
    INSERT INTO settings (key, category, label, value, type, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const initialSettings = [
    ['PROJECT_NAME', 'general', 'Nombre del Proyecto', 'LA CIGARRONERA — QUÍBOR', 'text', 'Nombre oficial del desarrollo agrícola protegido'],
    ['LOCATION_NAME', 'general', 'Ubicación Geográfica', 'Valle de Quíbor, Municipio Jiménez, Lara, Venezuela', 'text', 'Ubicación validada satelitalmente'],
    ['COTA_MSNM', 'general', 'Altitud Valle (msnm)', '700', 'number', 'Cota altitudinal media del predio (695-710 msnm)'],
    ['LATITUDE', 'general', 'Latitud Predio', '9.888889', 'number', 'Coordenada satelital Norte'],
    ['LONGITUDE', 'general', 'Longitud Predio', '-69.593056', 'number', 'Coordenada satelital Oeste'],
    
    // Invernadero / Casa de Malla Pimentón
    ['GH_DEFAULT_SURFACE_M2', 'greenhouse', 'Superficie Modular (m²)', '1000', 'number', 'Área estándar del módulo tecnificado'],
    ['GH_LENGTH_M', 'greenhouse', 'Largo Estructural (m)', '50.0', 'number', 'Longitud de la nave'],
    ['GH_WIDTH_M', 'greenhouse', 'Ancho Estructural (m)', '20.0', 'number', 'Ancho de la nave'],
    ['GH_PLANTS_COUNT', 'greenhouse', 'Población Total (plantas)', '2500', 'number', 'Población fija de pimentón en 1.000 m²'],
    ['GH_PLANT_DENSITY_M2', 'greenhouse', 'Densidad de Siembra (pl/m²)', '2.5', 'number', 'Densidad agronómica óptima para pimentón'],
    ['GH_MIN_GUTTER_HEIGHT_M', 'greenhouse', 'Altura al Alero/Canal (m)', '3.0', 'number', 'Altura alero para amortiguación térmica'],
    ['GH_OPT_RIDGE_HEIGHT_M', 'greenhouse', 'Altura a Cumbrera (m)', '5.5', 'number', 'Altura cenital para escape de aire caliente'],
    ['GH_TRELLIS_HEIGHT_M', 'greenhouse', 'Altura de Tutorado Malla (m)', '2.0', 'number', 'Altura alambre maestro Hortomalla 15x15'],
    ['GH_WIND_TURBINES_COUNT', 'greenhouse', 'Extractores Eólicos Cenitales', '8', 'number', 'Extractores eólicos 24"-30" para romper bolsa cenital'],

    // Malla Anti-Insectos
    ['MESH_SPEC', 'mesh', 'Especificación de Malla', '110 gsm, 50 mesh (50×25 hilos/pulgada) HDPE monofilamento virgen, Color Blanco', 'text', 'Especificación validada en docs/01-bioclima'],
    ['MESH_COLOR', 'mesh', 'Color de Malla', 'Blanco / Cristal Reflectivo', 'text', 'Color difusor de luz y reflector infrarrojo térmico'],
    ['MESH_WEIGHT_GSM', 'mesh', 'Gramaje Nominal (gsm)', '110', 'number', 'Gramaje de óptima permeabilidad aerodinámica'],
    ['MESH_MAX_PORE_MICRONS', 'mesh', 'Apertura de Poro (µm)', '192', 'number', 'Exclusión absoluta de trips, mosca blanca y pulgones'],
    ['MESH_PRICE_USD', 'mesh', 'Precio Rollo de Malla (USD)', '560', 'number', 'Costo estimado por rollo de malla anti-insectos'],

    // Pozo Profundo y Acuífero Cuara (docs/03-hidrogeologia)
    ['WELL_BROCAL_LAT', 'water', 'Latitud Satelital Brocal', '9.887719', 'number', 'GPS Brocal: 9°53\'15.79" N'],
    ['WELL_BROCAL_LON', 'water', 'Longitud Satelital Brocal', '-69.593681', 'number', 'GPS Brocal: 69°35\'37.25" W'],
    ['WELL_COTA_MSNM', 'water', 'Cota Brocal Aljibe (msnm)', '734', 'number', 'Elevación del brocal en Cuara'],
    ['WELL_STATIC_LEVEL_M', 'water', 'Nivel Estático de Agua (m)', '49.5', 'number', 'Profundidad medida del espejo de agua'],
    ['WELL_CURRENT_DEPTH_M', 'water', 'Profundidad Actual Aljibe (m)', '50.0', 'number', 'Fuste actual excavado a mano'],
    ['WELL_PROPOSED_DEPTH_M', 'water', 'Profundidad Proyectada (m)', '60.0', 'number', 'Meta recomendada de profundización (+10m)'],
    ['WELL_WATER_COLUMN_M', 'water', 'Columna de Agua Proyectada (m)', '10.5', 'number', 'Columna útil sumergible a 60m'],
    ['WELL_RESERVE_CAPACITY_L', 'water', 'Reserva Inmediata en Fuste (L)', '9000', 'number', '8.000 a 10.000 L de reserva inmediata en cilindro'],
    ['WELL_PUMPING_FLOW_LS', 'water', 'Caudal Estimado Bombeo (L/s)', '2.5', 'number', 'Caudal promedio régimen continuo (1.5-3.5 L/s)'],
    ['WATER_EC_DSM', 'water', 'Conductividad Eléctrica Pozo (dS/m)', '1.45', 'number', 'Salinidad real pozo acuífero Cuara'],
    ['WATER_PH', 'water', 'pH Agua de Pozo', '7.8', 'number', 'Alcalinidad moderada a neutralizar con ácido nítrico'],
    ['AQUIFER_TRANSMISSIVITY', 'water', 'Transmisividad Acuífero T (m²/día)', '180.0', 'number', 'Parámetro de la formación Cuara'],
    ['AQUIFER_STORATIVITY', 'water', 'Coeficiente de Almacenamiento S', '0.0025', 'number', 'Régimen semiconductor / confinado'],

    // Dinámica de Viento y Clima (docs/01-bioclima)
    ['WIND_DOMINANT_DIRECTION', 'wind', 'Dirección Dominante', 'ESTE (11 meses consecutivos)', 'text', 'Predominio horaria Este hasta 88%'],
    ['WIND_DESIGN_GUST_KMH', 'wind', 'Ráfaga de Diseño (km/h)', '27.0', 'number', 'Ráfaga máxima para cálculo de tensores y guayas'],
    ['WIND_SAFETY_FACTOR', 'wind', 'Factor de Seguridad Eólico', '1.5', 'number', 'Margen de sobrecarga estructural'],

    // Reducciones Fitosanitarias
    ['PESTICIDE_REDUCTION_PCT', 'agronomy', 'Reducción de Plaguicidas Químicos', '75%', 'text', 'Ahorro gracias al cerramiento físico 50 mesh'],
    ['VIROSIS_RISK_REDUCTION_PCT', 'agronomy', 'Reducción de Riesgo de Virosis', '98%', 'text', 'Exclusión mecánica de vectores'],

    // Contacto
    ['CONTACT_WHATSAPP', 'contact', 'Número de WhatsApp', '+58 412 000 0000', 'text', 'Teléfono de contacto comercial'],
    ['CONTACT_EMAIL', 'contact', 'Email de Contacto', 'agrovenecua@gmail.com', 'text', 'Correo oficial de atención']
  ];

  for (const s of initialSettings) {
    insert.run(...s);
  }
}

function seedClimate(db) {
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
  const insert = db.prepare(`
    INSERT INTO crops (id, name, scientific_name, ec_threshold, slope_percent_per_ds, recommended_gsm, pesticide_reduction, virosis_risk_reduction, target_yield_tons, avg_price_usd_per_kg)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Exclusivamente Pimentón
  const crops = [
    ['pepper', 'Pimentón Híbrido F1 (Magno / Nathalie)', 'Capsicum annuum', 1.5, 14.0, '110-130 gsm Blanco', '75%', '98%', 12.5, 0.90]
  ];

  for (const c of crops) {
    insert.run(...c);
  }
}

function seedSiteContent(db) {
  const insert = db.prepare(`
    INSERT INTO site_content (key, section, label, value)
    VALUES (?, ?, ?, ?)
  `);

  const content = [
    ['hero_title', 'landing', 'Título Principal', 'Horticultura Protegida de Alta Eficiencia en el Valle de Quíbor'],
    ['hero_subtitle', 'landing', 'Subtítulo', 'Ingeniería bioclimática y casa de malla tecnificada de 1.000 m² para 2.500 plantas de Pimentón bajo condiciones de semiárido cálido.'],
    ['cockpit_title', 'cockpit', 'Título Cockpit', 'Centro de Control Operativo & Gemelo Digital: Pimentón 2.500 Plantas'],
    ['malla_cta', 'malla', 'Llamado a la Acción Malla', 'Cotiza tu rollo de Malla Anti-Insectos 50 Mesh (110 gsm, Blanco) con despacho directo en el Valle de Quíbor.']
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
