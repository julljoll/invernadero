import dbExport from './database.json';

const s = dbExport.settings;

export const QUIBOR_CONFIG = Object.freeze({
  VERSION: dbExport._meta?.version ?? "2.0.0",
  PROJECT_NAME: s.PROJECT_NAME ?? "LA CIGARRONERA",
  LOCATION: {
    name: s.LOCATION_NAME ?? "Valle de Quíbor",
    municipio: "Jiménez",
    estado: "Lara",
    pais: "Venezuela",
    lat: s.LATITUDE ?? 9.888889,
    lng: s.LONGITUDE ?? -69.593056,
    cotaMsnm: s.COTA_MSNM ?? 700,
    koppen: "BSh (Semiárido cálido / Bosque seco premontano)"
  },
  WIND: {
    dominantDirection: s.WIND_DOMINANT_DIRECTION ?? "ESTE",
    dominantFrequency: 0.88,
    designGustKmH: s.WIND_DESIGN_GUST_KMH ?? 27.0,
    safetyFactor: s.WIND_SAFETY_FACTOR ?? 1.5,
    hellmannAlpha: 0.16
  },
  GREENHOUSE: {
    defaultSurfaceM2: s.GH_DEFAULT_SURFACE_M2 ?? 1000,
    lengthM: s.GH_LENGTH_M ?? 50.0,
    widthM: s.GH_WIDTH_M ?? 20.0,
    minHeightGutterM: s.GH_MIN_GUTTER_HEIGHT_M ?? 3.0,
    optRidgeHeightM: s.GH_OPT_RIDGE_HEIGHT_M ?? 5.5,
    trellisHeightM: s.GH_TRELLIS_HEIGHT_M ?? 2.0,
    pillarSpacingXM: 4.0,
    pillarSpacingZM: 2.94,
    totalPillarsDefault: 108,
    densityPlantM2: s.GH_PLANT_DENSITY_M2 ?? 2.2,
    totalPlantsDefault: Math.round((s.GH_DEFAULT_SURFACE_M2 ?? 1000) * (s.GH_PLANT_DENSITY_M2 ?? 2.2)),
    turbinesCount: s.GH_WIND_TURBINES_COUNT ?? 8
  },
  MESH: {
    spec: s.MESH_SPEC ?? "130 gsm, 50 mesh (50×25 hilos/pulgada) HDPE monofilamento virgen, Color Blanco",
    color: s.MESH_COLOR ?? "Blanco / Cristal",
    weightGsm: s.MESH_WEIGHT_GSM ?? 130,
    meshCount: "50 mesh (50×25)",
    maxPoreMicrons: s.MESH_MAX_PORE_MICRONS ?? 192,
    priceCashUsd: s.MESH_PRICE_USD ?? 560,
    rollsRequired1000m2: 4,
    pestExclusion: ["Bemisia tabaci", "Frankliniella occidentalis", "Myzus persicae", "Liriomyza spp.", "Tuta absoluta"]
  },
  AQUIFER: {
    transmissivityT: s.AQUIFER_TRANSMISSIVITY ?? 180.0,
    storativityS: s.AQUIFER_STORATIVITY ?? 0.0025,
    conductivityK: 22.0,
    influenceRadiusR0: 260.0
  },
  WELL: {
    staticLevelM: s.WELL_STATIC_LEVEL_M ?? 49.5,
    pumpingFlowLs: s.WELL_PUMPING_FLOW_LS ?? 2.5,
    waterEcDsM: s.WATER_EC_DSM ?? 1.65
  },
  CONTACT: {
    whatsapp: s.CONTACT_WHATSAPP ?? "+58 412 000 0000",
    email: s.CONTACT_EMAIL ?? "agrovenecua@gmail.com"
  }
});
