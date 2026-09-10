export const QUIBOR_CONFIG = Object.freeze({
  VERSION: "2.0.0",
  PROJECT_NAME: "LA CIGARRONERA",
  LOCATION: {
    name: "Valle de Quíbor",
    municipio: "Jiménez",
    estado: "Lara",
    pais: "Venezuela",
    lat: 9.888889,
    lng: -69.593056,
    cotaMsnm: 700,
    koppen: "BSh (Semiárido cálido / Bosque seco premontano)"
  },
  WIND: {
    dominantDirection: "ESTE",
    dominantFrequency: 0.88,
    designGustKmH: 27.0,
    safetyFactor: 1.5,
    hellmannAlpha: 0.16
  },
  GREENHOUSE: {
    defaultSurfaceM2: 1000,
    lengthM: 50.0,
    widthM: 20.0,
    minHeightGutterM: 3.0,
    optRidgeHeightM: 5.5,
    trellisHeightM: 2.0,
    pillarSpacingXM: 4.0,
    pillarSpacingZM: 2.94,
    totalPillarsDefault: 108,
    densityPlantM2: 2.2,
    totalPlantsDefault: 2200
  },
  MESH: {
    spec: "130 gsm, 50 mesh (50×25 hilos/pulgada) HDPE monofilamento virgen, Color Blanco",
    color: "Blanco / Cristal",
    weightGsm: 130,
    meshCount: "50 mesh (50×25)",
    maxPoreMicrons: 192,
    priceCashUsd: 560,
    rollsRequired1000m2: 4,
    pestExclusion: ["Bemisia tabaci", "Frankliniella occidentalis", "Myzus persicae", "Liriomyza spp.", "Tuta absoluta"]
  },
  AQUIFER: {
    transmissivityT: 180.0, // m²/día
    storativityS: 0.0025,
    conductivityK: 22.0,    // m/día
    influenceRadiusR0: 260.0 // m
  }
});
