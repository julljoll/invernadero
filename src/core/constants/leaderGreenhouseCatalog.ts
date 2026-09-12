export interface GreenhouseModel {
  id: string;
  name: string;
  category: string;
  tag: string;
  width: string;
  roofHeight: string;
  bowSpacing: string;
  archPurlins: boolean;
  windBracing: boolean;
  crossBracing: boolean;
  imageUrl: string;
  description: string;
  recommendedUse: string;
  structuralSpecs: {
    columnType: string;
    galvanization: string;
    windResistance: string;
    ventilationType: string;
  };
}

export interface HotSaleAccessory {
  id: string;
  name: string;
  category: string;
  packageUnits: string;
  dimension: string;
  shippingTime: string;
  imageUrl: string;
  stockStatus: string;
  description: string;
  agronomicBenefit: string;
}

export interface FacilitySystem {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  keyFeatures: string[];
}

export interface AccessoryCategory {
  id: string;
  categoryName: string;
  icon: string;
  description: string;
  items: {
    name: string;
    description: string;
    spec: string;
  }[];
}

export const GREENHOUSE_MODELS: GreenhouseModel[] = [
  {
    id: 'u3-pro',
    name: 'AGRO-U3 Pro — Multicapilla Agrícola Reforzada',
    category: 'Invernadero Gótico de Alta Resistencia',
    tag: 'Máxima Resistencia Eólica',
    width: '≤ 8.00 m por vano',
    roofHeight: '≈ 3.00 m cumbrera',
    bowSpacing: '1.00 m entre arcos',
    archPurlins: true,
    windBracing: true,
    crossBracing: true,
    imageUrl: 'https://sc04.alicdn.com/kf/H5c3efd3ce3e34b1f8a4b596c91983941a/239438894/H5c3efd3ce3e34b1f8a4b596c91983941a.png',
    description: 'Estructura compacta de alta tenacidad mecánica con triple sistema de anclaje: correas de arco longitudinales, tirantes contraviento perimetrales y cruces de San Andrés. Calculada especialmente para soportar ráfagas sostenidas del Este en el Valle de Quíbor y zonas semiáridas de Venezuela.',
    recommendedUse: 'Producción protegida de pimentón, semilleros tecnificados, hortalizas de porte medio y flores.',
    structuralSpecs: {
      columnType: 'Tubería estructural de acero al carbono Sch 40 (Ø 32mm / 42mm)',
      galvanization: 'Galvanizado en caliente por inmersión continua Z275/Z350 (Norma ISO 1461)',
      windResistance: 'Resistencia estructural probada hasta 30 m/s (~108 km/h)',
      ventilationType: 'Cortinas laterales enrollables con malla antiáfido 50 mesh (130 gsm)'
    }
  },
  {
    id: 'u2-basic',
    name: 'AGRO-U2 Basic — Nave Ancha Multitúnel 15m',
    category: 'Macrotúnel de Gran Amplitud',
    tag: 'Vano Despejado 15m',
    width: '≤ 15.00 m por vano',
    roofHeight: '≈ 3.80 m cumbrera',
    bowSpacing: '1.00 ~ 2.00 m modular',
    archPurlins: true,
    windBracing: true,
    crossBracing: false,
    imageUrl: 'https://sc04.alicdn.com/kf/H75293243a7a84d8cac787032ff573d6f1/239438894/H75293243a7a84d8cac787032ff573d6f1.png',
    description: 'Nave de amplio vano de hasta 15 metros sin columnas centrales intermedias. Facilita el laboreo con motocultor o tractor ligero, la instalación de hasta 14 camellones dobles y el tendido directo de cintas de goteo con máxima uniformidad hidráulica.',
    recommendedUse: 'Cultivos protegidos de alta productividad: pimentón en espaldera o tutorado intensivo a campo protegido.',
    structuralSpecs: {
      columnType: 'Perfiles ovales galvanizados de alta inercia a la flexión lateral',
      galvanization: 'Galvanizado Sendzimir Z275 de doble cara',
      windResistance: 'Cálculo de carga eólica hasta 24 m/s (~86 km/h)',
      ventilationType: 'Ventilación perimetral completa y testeros abatibles'
    }
  },
  {
    id: 'u1-pro',
    name: 'AGRO-U1 Pro — Volumen Térmico 4.8m & Tutorado Reforzado',
    category: 'Invernadero de Alto Rendimiento',
    tag: 'Óptimo para Pimentón de Alta Densidad',
    width: '≤ 10.00 m por módulo',
    roofHeight: '≈ 4.80 m cumbrera (Alero 3.20m)',
    bowSpacing: '1.00 ~ 2.00 m',
    archPurlins: true,
    windBracing: true,
    crossBracing: true,
    imageUrl: 'https://sc04.alicdn.com/kf/He8062da9fca94fe09065e4818e40e9dfH/239438894/He8062da9fca94fe09065e4818e40e9dfH.png',
    description: 'Diseño verticalizado de gran despeje cenital que maximiza el volumen de aire buffer interior. El aire caliente asciende por convección natural manteniendo la zona de cuajado y floración bajo los 30 °C para prevenir el aborto. Estructura calculada para soportar tutorados intensivos de pimentón de hasta 20 kg/m².',
    recommendedUse: 'Pimentón de alta densidad (2.5 pl/m² · 2.500 plantas), espalderas de 1.80m a 2.20m y fertirriego tecnificado.',
    structuralSpecs: {
      columnType: 'Pilares cuadrados de 80x80mm y arcos reforzados con cumbrera ventilada',
      galvanization: 'Inmersión térmica en caliente Z350 de máxima longevidad',
      windResistance: 'Resistencia hasta 28 m/s (~100 km/h) con dados de concreto ciclópeo',
      ventilationType: 'Ventilación cenital continua mariposa o diente de sierra + laterales con malla monofilamento'
    }
  },
  {
    id: 'uio-basic',
    name: 'AGRO-UIO Modular — Estructura a Medida de Parcela',
    category: 'Módulo Adaptable y Escalable',
    tag: 'Adaptabilidad de Terreno',
    width: 'Dimensiones Personalizadas',
    roofHeight: 'Configurable según cultivo',
    bowSpacing: 'Ajustable según carga de viento',
    archPurlins: true,
    windBracing: true,
    crossBracing: false,
    imageUrl: 'https://sc04.alicdn.com/kf/Hd7ca5a5661bd4d67a9ce343735f1e381k/239438894/Hd7ca5a5661bd4d67a9ce343735f1e381k.png',
    description: 'Sistema modular de acople rápido diseñado para fincas con topografía irregular o superficies no estandarizadas. Permite conectar módulos contiguos compartiendo canales de desagüe pluvial para un aprovechamiento del 100% del suelo disponible.',
    recommendedUse: 'Proyectos llave en mano, ampliaciones de casas de malla existentes y huertos protegidos.',
    structuralSpecs: {
      columnType: 'Perfiles combinados tubulares y perfiles C galvanizados',
      galvanization: 'Galvanizado integral anticorrosivo',
      windResistance: 'Diseñado bajo especificación bioclimática local',
      ventilationType: 'Aperturas cenitales y laterales configurables con accionamiento manual o motorizado'
    }
  },
  {
    id: 'u6-basic',
    name: 'AGRO-U6 Tropical — Macroestructura con Evacuación Cenital',
    category: 'Macroestructura para Climas Cálidos',
    tag: 'Máxima Ventilación',
    width: 'Módulos de 9.60m / 12.80m',
    roofHeight: 'Cumbrera alta optimizada',
    bowSpacing: '1.50 ~ 2.50 m',
    archPurlins: true,
    windBracing: true,
    crossBracing: false,
    imageUrl: 'https://sc04.alicdn.com/kf/H822f5240f0ce425f9bd114aabf92a463R/239438894/H822f5240f0ce425f9bd114aabf92a463R.png',
    description: 'Estructura diseñada específicamente para condiciones tropicales semiáridas. Su amplia altura y ángulo de techo aceleran la salida del aire sobrecalentado y la humedad excesiva, reduciendo la incidencia de hongos foliares (Oidio, Botrytis) y bacteriosis.',
    recommendedUse: 'Horticultura intensiva de valles cálidos (Lara, Zulia, Falcón, Guárico, Aragua).',
    structuralSpecs: {
      columnType: 'Tubería redonda estructural y arcos de alta capacidad portante',
      galvanization: 'HDG (Hot Dip Galvanized Z275/Z350)',
      windResistance: 'Resistencia estructural certificada para zonas abiertas',
      ventilationType: 'Perimetral 360° con Malla 50 Mesh 130 gsm blanca de difusión térmica'
    }
  }
];

export const HOT_SALE_ACCESSORIES: HotSaleAccessory[] = [
  {
    id: 'lock-profile',
    name: 'Perfil Canalón de Sujeción C (Lock Channel)',
    category: 'Fijación de Mallas y Plásticos',
    packageUnits: '20 unidades / paquete',
    dimension: '4.00 metros de longitud',
    shippingTime: 'Disponibilidad Inmediata / Envíos a Nivel Nacional',
    imageUrl: 'https://www.leadergreenhouse.com/themes/LeaderGreenhouse_en/public/assets/img/models/model1-menu.png',
    stockStatus: 'En Stock · Entrega Inmediata',
    description: 'Perfil de aleación de aluminio estructural o acero galvanizado de alta resistencia química a fertilizantes y pesticidas. Su sección en "C" sujeta firmemente la malla antiáfido o el plástico térmico con el alambre Wiggle Wire sin necesidad de perforar ni rasgar el material.',
    agronomicBenefit: 'Evita rasgaduras por viento y asegura hermetismo biológico perimetral contra Trips, Mosca Blanca y Pulgones.'
  },
  {
    id: 'wiggle-wire',
    name: 'Alambre Ondulado Zig-Zag (Wiggle Wire)',
    category: 'Resorte de Fijación Elástica',
    packageUnits: '500 piezas / paquete',
    dimension: '2.00 metros de longitud',
    shippingTime: 'Disponibilidad Inmediata / Envíos a Nivel Nacional',
    imageUrl: 'https://www.leadergreenhouse.com/themes/LeaderGreenhouse_en/public/assets/img/models/model2-menu.png',
    stockStatus: 'En Stock · Calidad Reforzada',
    description: 'Resorte de acero templado de alta resiliencia recubierto con polímero termoplástico con protección contra radiación ultravioleta. Se encaja a presión dentro del Lock Channel sujetando hasta dos capas de película plástica y una de malla simultáneamente.',
    agronomicBenefit: 'Permite retirar o retensar la cubierta en minutos para labores de mantenimiento sin dañar el tejido de la malla.'
  },
  {
    id: 'galvanized-gutter',
    name: 'Canalón Pluvial de Desagüe Galvanizado',
    category: 'Drenaje Pluvial y Soporte de Techo',
    packageUnits: '1 unidad / tramo',
    dimension: '4.00 metros de largo (Ancho 30-40cm)',
    shippingTime: 'Disponibilidad Inmediata / Fabricación a Medida',
    imageUrl: 'https://www.leadergreenhouse.com/themes/LeaderGreenhouse_en/public/assets/img/models/model3-menu.png',
    stockStatus: 'En Stock · Alta Capacidad',
    description: 'Canalón conformado en chapa de acero galvanizado en caliente de alto espesor (1.5mm - 2.0mm). Cumple una doble función esencial: evacuar el agua torrencial de lluvia y actuar como viga portante longitudinal entre los pilares de la estructura.',
    agronomicBenefit: 'Impide el goteo descontrolado en los camellones, evitando encharcamientos que pudren raíces y propagan Pythium y Phytophthora.'
  },
  {
    id: 'gi-round-pipe',
    name: 'Tubería Redonda Estructural Galvanizada Sch 40',
    category: 'Estructura, Pilares y Arcos',
    packageUnits: '91 unidades / atado',
    dimension: '6.00 metros estándar (Ø 32mm / 42mm / 48mm)',
    shippingTime: 'Disponibilidad Inmediata / Despacho Inmediato',
    imageUrl: 'https://www.leadergreenhouse.com/themes/LeaderGreenhouse_en/public/assets/img/models/model4-menu.png',
    stockStatus: 'En Stock · Acero de Grado Estructural',
    description: 'Tubería de acero al carbono galvanizada en caliente por inmersión continua interior y exterior. Gran ductilidad para curvado en frío de arcos sin que se fracture la capa protectora de zinc.',
    agronomicBenefit: 'Garantía de más de 15 años libre de corrosión frente a la alta humedad relativa y las sales del agua de riego de pozo.'
  },
  {
    id: 'heavy-exhaust-fan',
    name: 'Extractor Industrial de Aire de Martillo Pesado 1.1m',
    category: 'Climatización y Ventilación Forzada',
    packageUnits: '1 unidad / embalaje reforzado',
    dimension: '1.10 m × 1.10 m (Marco de acero galvanizado)',
    shippingTime: 'Disponibilidad Inmediata',
    imageUrl: 'https://www.leadergreenhouse.com/themes/LeaderGreenhouse_en/public/assets/img/models/model5-menu.png',
    stockStatus: 'En Stock · Caudal 44.000 m³/h',
    description: 'Extractor axial de alto rendimiento con aspas en acero inoxidable balanceadas dinámicamente. Dispone de persiana exterior con mecanismo de contrapeso centrífugo tipo martillo que garantiza un cierre 100% hermético contra plagas y polvo cuando el equipo está inactivo.',
    agronomicBenefit: 'Desaloja bolsas de calor y renueva hasta 60 veces por hora el volumen de aire en horas pico de calor en Quíbor.'
  }
];

export const FACILITY_SYSTEMS: FacilitySystem[] = [
  {
    id: 'fan-wet-curtain',
    title: 'Sistema de Muro Húmedo y Extractores (Cooling Pad Evaporativo)',
    imageUrl: 'https://www.leadergreenhouse.com/themes/LeaderGreenhouse_en/public/assets/img/box/box1.jpg',
    description: 'Climatización evaporativa por presión negativa que combina extractores axiales con paneles de celulosa corrugada humedecida, reduciendo la temperatura interior de 4 °C a 8 °C respecto al exterior en días secos.',
    keyFeatures: [
      'Disminución térmica activa para mantener la temperatura del cultivo por debajo de 29 °C',
      'Regulación pasiva del déficit de presión de vapor (VPD) reduciendo el estrés hídrico de las plantas',
      'Paneles de celulosa tratados contra algas, bacterias y degradación solar',
      'Consumo eléctrico optimizado con recirculación continua de agua'
    ]
  },
  {
    id: 'drip-irrigation',
    title: 'Sistema de Riego por Goteo Tecnificado y Fertirriego de Precisión',
    imageUrl: 'https://www.leadergreenhouse.com/themes/LeaderGreenhouse_en/public/assets/img/box/box2.jpg',
    description: 'Red hidráulica completa con tuberías matrices de polietileno de alta densidad (PEAD), mangueras de goteo autocompensantes (PC), filtros de anillas/mallas y dosificación de fertilizantes para camellones dobles de 50 metros.',
    keyFeatures: [
      'Uniformidad de emisión superior al 95% desde el primer hasta el último gotero del camellón',
      'Goteros autocompensantes y antidrenantes resistentes a obstrucciones por aguas duras y salinas',
      'Integración directa con inyectores Venturi y tanques dosificadores de nutrientes A, B y C',
      'Ahorro comprobado del 50% al 65% en volumen de agua frente a métodos tradicionales'
    ]
  },
  {
    id: 'hydroponic-system',
    title: 'Sistemas Hidropónicos de Sustrato (Fibra de Coco / Perlita) y NFT',
    imageUrl: 'https://www.leadergreenhouse.com/themes/LeaderGreenhouse_en/public/assets/img/box/box3.jpg',
    description: 'Canaletas técnicas y sacos de sustrato inerte para horticultura de precisión sin suelo. Permite el control exacto de la conductividad eléctrica (EC) y el pH radicular, eliminando patógenos telúricos.',
    keyFeatures: [
      'Erradicación total de nematodos agalladores y hongos de suelo (Fusarium, Ralstonia)',
      'Aprovechamiento al 100% de la solución nutritiva mediante drenaje y recirculación',
      'Incremento de la densidad de siembra hasta 3.5 a 4.0 plantas por metro cuadrado',
      'Cosechas más limpias, mayor peso por fruto y facilidad ergonómica para los operarios'
    ]
  }
];

export const ACCESSORY_CATEGORIES: AccessoryCategory[] = [
  {
    id: 'lock-channel-etc',
    categoryName: 'Perfiles Lock Channel y Sujeción de Cubiertas',
    icon: 'linear_scale',
    description: 'Sistemas profesionales para el tensado estanco de mallas antiáfido y plásticos agrícolas.',
    items: [
      { name: 'Perfil Lock Channel en C', description: 'Canal estructural en aleación de aluminio 6063-T5 o acero galvanizado Z275.', spec: 'Largo 4.0m · Espesor 0.7 - 1.0mm' },
      { name: 'Alambre Zig-Zag (Wiggle Wire)', description: 'Resorte de acero acerado con recubrimiento plástico resistente a rayos UV.', spec: 'Largo 2.0m · Calibre Ø 2.0mm' },
      { name: 'Soporte Abrazadera para Lock Channel', description: 'Pieza de anclaje para fijar el canal a pilares redondos o vigas cuadradas sin soldar.', spec: 'Acero galvanizado Sch 40' },
      { name: 'Pieza de Unión Longitudinal de Canales', description: 'Inserto interior para empalmar perfiles en serie asegurando continuidad recta.', spec: 'Chapa estampada HDG' }
    ]
  },
  {
    id: 'galvanized-pipe-etc',
    categoryName: 'Tuberías, Arcos y Uniones Mecánicas',
    icon: 'construction',
    description: 'Gama completa de tubos redondos, ovales y accesorios para armar estructuras sin quemar el galvanizado.',
    items: [
      { name: 'Tubo Redondo Estructural Sch 40', description: 'Tubería para pilares, correas longitudinales y líneas de tutorado.', spec: 'Diámetros: Ø 25mm, 32mm, 42mm, 48mm' },
      { name: 'Clips de Fijación Rápida (Film Clips)', description: 'Abrazaderas elásticas de polímero virgen para fijar tela o plástico a tubos.', spec: 'Compatibles con Ø 22mm, 25mm y 32mm' },
      { name: 'Abrazaderas Cruzadas (Cross Clamps)', description: 'Abrazadera de dos piezas empernadas para cruce perpendicular de tubos sin soldar.', spec: 'Tornillería galvanizada Grado 5' },
      { name: 'Manguito Terminal de Poste (End Sleeve)', description: 'Manguito para remate superior de columnas y soporte de correas.', spec: 'Galvanizado en caliente por inmersión' },
      { name: 'Conector de Unión de Arcos', description: 'Manguito interior calibrado para ensamblar las dos mitades de los arcos de techo.', spec: 'Ajuste milimétrico a presión' },
      { name: 'Perfiles Ovales y Accesorios', description: 'Tubos ovales de alta resistencia a la flexión transversal para arcos anchos.', spec: 'Dimensiones 30x50mm y 40x70mm' },
      { name: 'Postes Cuadrados y Placas Base', description: 'Columnas principales con platinas perforadas para anclar con espárragos a zapatas.', spec: '50x50mm, 60x60mm, 80x80mm' }
    ]
  },
  {
    id: 'fixator-etc',
    categoryName: 'Pernos en U, Abrazaderas y Herrajes de Apriete',
    icon: 'hardware',
    description: 'Elementos de ensamble por fricción y torque mecánico que preservan el recubrimiento de zinc.',
    items: [
      { name: 'Clips de Resorte para Correas (Spring Clips)', description: 'Clips de acero elástico templado para sujetar correas secundarias a los arcos.', spec: 'Tensión permanente sin deformación' },
      { name: 'Alambres Tensores en U (U-Type Wire)', description: 'Grapas rápidas de alambre galvanizado pesado para fijación de tutores.', spec: 'Calibre Ø 3.0mm HDG' },
      { name: 'Pernos en U Roscados con Tuercas Autofrenantes', description: 'Perno tipo U con pletina de apoyo para fijaciones de alta carga estructural.', spec: 'Roscas M8, M10, M12 galvanizadas' }
    ]
  },
  {
    id: 'gutter-etc',
    categoryName: 'Canalones Pluviales y Drenaje de Techo',
    icon: 'water_damage',
    description: 'Sistemas de recolección y desalojo rápido de aguas de lluvia para evitar sobrepeso en cubiertas.',
    items: [
      { name: 'Canalón Matriz Galvanizado de Techo', description: 'Canal central con pestañas de rigidización para unión hermética entre módulos.', spec: 'Espesor 1.5mm - 2.0mm galvanizado' },
      { name: 'Soporte Ménsula para Canalón', description: 'Soporte reforzado para colgar el canalón directamente sobre los postes principales.', spec: 'Pletina estructural de 40x4mm' },
      { name: 'Placa de Apriete de Arranque de Arcos', description: 'Placa reforzada que prensa la base del arco contra el borde del canalón.', spec: 'Chapa de 3mm estampada' },
      { name: 'Embudo Bajante Colector de Agua Pluvial', description: 'Boca de salida con emboque estanco para conectar bajantes pluviales de 110mm.', spec: 'Evacuación de hasta 120 L/min' }
    ]
  },
  {
    id: 'film-etc',
    categoryName: 'Películas Plásticas, Cuerdas y Protección UV',
    icon: 'layers',
    description: 'Materiales de cubierta térmica y tensores de protección contra ráfagas de viento.',
    items: [
      { name: 'Película Plástica Térmica Tricapa (Film)', description: 'Polietileno con aditivos térmicos EVA, anti-goteo, anti-polvo y filtro solar UV.', spec: '150 a 200 micras (Garantía 3 a 5 años)' },
      { name: 'Cuerda de Tensión Poliéster Trenzada', description: 'Cuerda de alta tenacidad para atar y retener la cubierta plástica entre arcos.', spec: 'Resistencia a tracción superior a 400 kg' },
      { name: 'Resorte Amortiguador de Cuerda', description: 'Resorte helicoidal que mantiene la tensión uniforme ante cambios de temperatura.', spec: 'Acero inoxidable o zincado' },
      { name: 'Abrazadera de Protección Suave (Anti-Fricción)', description: 'Protector de polímero que se interpone entre el tubo y el plástico para evitar roces.', spec: 'Elimina roturas por desgaste mecánico' }
    ]
  }
];

// Compatibilidad retroactiva con nombres anteriores si fuesen importados
export const LEADER_GREENHOUSE_MODELS = GREENHOUSE_MODELS;
export const LEADER_HOT_SALE_ACCESSORIES = HOT_SALE_ACCESSORIES;
export const LEADER_FACILITY_SYSTEMS = FACILITY_SYSTEMS;
export const LEADER_ACCESSORY_CATEGORIES = ACCESSORY_CATEGORIES;
export type LeaderGreenhouseModel = GreenhouseModel;
export type LeaderHotSaleAccessory = HotSaleAccessory;
export type LeaderFacilitySystem = FacilitySystem;
export type LeaderAccessoryCategory = AccessoryCategory;
