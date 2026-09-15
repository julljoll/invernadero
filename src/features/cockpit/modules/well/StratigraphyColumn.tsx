import React, { useState } from 'react';
import { Card, Badge } from 'react-bootstrap';

interface StratigraphyColumnProps {
  scenario: '60m' | '120m';
}

interface StratumDetail {
  id: string;
  name: string;
  depthRange: string;
  thickness: string;
  lithology: string;
  permeabilityK: string;
  transmissivityT: string;
  geomechanics: string;
  ragRef: string;
  description: string;
}

export const StratigraphyColumn: React.FC<StratigraphyColumnProps> = ({ scenario }) => {
  const is60m = scenario === '60m';
  const [selectedStratum, setSelectedStratum] = useState<string>('grava_acuifero');

  const strataData: Record<string, StratumDetail> = {
    brocal: {
      id: 'brocal',
      name: 'Brocal & Superficie',
      depthRange: '0.0 m (Cota 734 msnm)',
      thickness: '0.5 m sobre suelo',
      lithology: 'Brocal de concreto armado con marco angular de acero estructural',
      permeabilityK: 'N/A',
      transmissivityT: 'N/A',
      geomechanics: 'Camino rural afirmado, adyacente a poste de electrificación rural',
      ragRef: 'RAG HIDRO-001 / HIDRO-003',
      description: 'Superficie de operación con tapa sellada contra escorrentías superficiales. Acometida eléctrica contigua para alimentación 220V/60Hz.'
    },
    conglomerado: {
      id: 'conglomerado',
      name: 'Conglomerado Aluvial Cuaternario',
      depthRange: '0.0 a 8.0 m',
      thickness: '8.0 metros',
      lithology: 'Clastos de cuarzo lechoso y lidita subredondeados en matriz areno-arcillosa',
      permeabilityK: '10⁻⁵ a 10⁻⁶ m/s (Baja a moderada)',
      transmissivityT: '~10 - 25 m²/día',
      geomechanics: 'Estrato aluvial coluvial semicompacto, penetrado sin necesidad de entubado provisional',
      ragRef: 'RAG HIDRO-002 (§1.1)',
      description: 'Formación de desborde y abanico aluvial del piedemonte de Cuara. Protegido en los primeros 8 metros por encamisado de concreto.'
    },
    acuitardo: {
      id: 'acuitardo',
      name: 'Acuitardo Arcilloso Masivo (Sello Geológico)',
      depthRange: '8.0 a 48.0 m',
      thickness: '40.0 metros continuos',
      lithology: 'Arcillas pardas y abigarradas altamente preconsolidadas, compactas y secas',
      permeabilityK: '< 10⁻⁸ m/s (Impermeable)',
      transmissivityT: 'Nula (Confina el horizonte inferior)',
      geomechanics: 'Resistencia al corte no drenada Su > 120 kPa. Autoportante, estribos tallados a pico intactos por años',
      ragRef: 'RAG HIDRO-001 / HIDRO-002 (§2.3)',
      description: 'Actúa como sello impermeable natural absoluto que aísla el acuífero de cualquier contaminación superficial y evita el colapso de las paredes del fuste natural de Ø 80-100 cm.'
    },
    techo: {
      id: 'techo',
      name: 'Transición y Techo del Acuífero',
      depthRange: '48.0 a 49.5 m',
      thickness: '1.5 metros',
      lithology: 'Areniscas de grano medio y gravillas limpias de contacto',
      permeabilityK: '10⁻⁴ m/s',
      transmissivityT: '~80 m²/día',
      geomechanics: 'Horizonte de cambio brusco de facies sedimentaria, inicio de humedad freática',
      ragRef: 'RAG HIDRO-001 (§1.2)',
      description: 'Contacto nítido donde cesa la arcilla y comienza el paleocauce fluvial fósil. A los 49.5 m se establece el Nivel Estático (NE).'
    },
    grava_acuifero: {
      id: 'grava_acuifero',
      name: 'Paleocauce Aluvial de Gravas Negras Lavadas',
      depthRange: is60m ? '49.5 a 60.0 m' : '49.5 a 70.0 m',
      thickness: is60m ? '10.5 metros saturados' : '20.5 metros',
      lithology: 'Gravas negras de lidita y cantos de cuarzo cristalino reflectante sin matriz fina',
      permeabilityK: '1 × 10⁻³ a 5 × 10⁻³ m/s (Muy alta permeabilidad)',
      transmissivityT: '860 a 2.500 m²/día (Jégat & Mora, 2012)',
      geomechanics: 'Paquete poroso granular limpio con recarga radial inagotable para achique manual',
      ragRef: 'RAG HIDRO-005 (§2.2) / HIDRO-006',
      description: 'El acuífero productivo de Cuara. En 60m se penetra el espesor saturado completo de 10m del Sector Sur, con recarga activa de 2.0-2.5 L/s. Espejo de agua visible y cristalino.'
    },
    profundo_120: {
      id: 'profundo_120',
      name: 'Formación Terciaria Intercalada & Rejillas Johnson',
      depthRange: '70.0 a 120.0 m',
      thickness: '50.0 metros',
      lithology: 'Secuencia rítmica de areniscas cuarzosas consolidadas y lutitas compactas',
      permeabilityK: '5 × 10⁻⁴ m/s',
      transmissivityT: '1.200 a 1.800 m²/día',
      geomechanics: 'Requiere perforación mecánica rotaria a 12¼" con lodo bentonítico y entubado en acero ASTM A53',
      ragRef: 'RAG HIDRO-004 (§3)',
      description: 'Horizonte profundo apto para explotación masiva de hasta 4 hectáreas con bomba sumergible industrial de 6" (7.5 HP) y 38 m de filtros de ranura continua 0.030".'
    }
  };

  const activeData = strataData[selectedStratum] || strataData.grava_acuifero;

  return (
    <Card className="border-0 shadow-sm bg-light">
      <Card.Body className="p-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="d-flex align-items-center gap-2">
            <span className="material-symbols-outlined text-primary fs-5">layers</span>
            <span className="fw-bold text-dark small">Perfil Estratigráfico Interactivo & Columna de Captación</span>
          </div>
          <Badge bg={is60m ? 'success' : 'info'} className="text-xs">
            {is60m ? 'Pozo 60m Artesanal (Ø 80cm)' : 'Pozo 120m Rotario (Ø 12¼")'}
          </Badge>
        </div>

        <p className="text-secondary text-xs mb-3">
          Haz clic o sitúa el cursor sobre cualquier capa litológica para inspeccionar sus parámetros geomecánicos y valores de permeabilidad (K) validados en el RAG.
        </p>

        <div className="row g-3 align-items-start">
          {/* Columna SVG */}
          <div className="col-12 col-md-5 d-flex justify-content-center">
            <svg
              viewBox="0 0 280 560"
              style={{ width: '100%', maxWidth: '280px', height: 'auto', background: '#f8fafc', borderRadius: '8px' }}
              className="border shadow-2xs"
            >
              <defs>
                {/* Patrón de conglomerado */}
                <pattern id="patConglomerado" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect width="20" height="20" fill="#e2d9cc" />
                  <circle cx="5" cy="5" r="3" fill="#bfa588" />
                  <circle cx="15" cy="14" r="2.5" fill="#a88f72" />
                  <circle cx="14" cy="4" r="1.5" fill="#8c7358" />
                </pattern>

                {/* Patrón de arcilla masiva */}
                <pattern id="patArcilla" width="16" height="12" patternUnits="userSpaceOnUse">
                  <rect width="16" height="12" fill="#c49a6c" />
                  <line x1="0" y1="3" x2="16" y2="3" stroke="#aa7f53" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="0" y1="9" x2="16" y2="9" stroke="#aa7f53" strokeWidth="1" strokeDasharray="3,3" />
                </pattern>

                {/* Patrón de gravas de lidita y cuarzo */}
                <pattern id="patGrava" width="18" height="18" patternUnits="userSpaceOnUse">
                  <rect width="18" height="18" fill="#1e293b" />
                  <ellipse cx="6" cy="6" rx="4" ry="3" fill="#475569" />
                  <ellipse cx="14" cy="13" rx="3.5" ry="2.5" fill="#94a3b8" />
                  <circle cx="13" cy="5" r="2" fill="#cbd5e1" />
                </pattern>

                {/* Patrón de agua saturada */}
                <pattern id="patAgua" width="20" height="10" patternUnits="userSpaceOnUse">
                  <rect width="20" height="10" fill="#0284c7" opacity="0.85" />
                  <path d="M 0 5 Q 5 0, 10 5 T 20 5" fill="none" stroke="#7dd3fc" strokeWidth="1" opacity="0.6" />
                </pattern>

                {/* Gradiente de camisa de concreto */}
                <linearGradient id="gradConcreto" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#94a3b8" />
                  <stop offset="50%" stopColor="#e2e8f0" />
                  <stop offset="100%" stopColor="#64748b" />
                </linearGradient>
              </defs>

              {/* 1. Brocal de superficie (0 a 30 px) */}
              <g 
                className="cursor-pointer" 
                onClick={() => setSelectedStratum('brocal')}
                style={{ cursor: 'pointer' }}
              >
                <rect x="20" y="20" width="240" height="25" rx="3" fill="#475569" stroke="#334155" strokeWidth="1.5" />
                <text x="140" y="37" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
                  Brocal &amp; Boca del Pozo — Cota 734 msnm
                </text>
                {/* Poste contiguo */}
                <rect x="230" y="5" width="6" height="40" fill="#94a3b8" />
                <line x1="225" y1="8" x2="241" y2="8" stroke="#cbd5e1" strokeWidth="2" />
                <text x="233" y="0" textAnchor="middle" fill="#64748b" fontSize="8">Poste 220V</text>
              </g>

              {/* 2. Conglomerado 0 - 8m (y: 45 a 95) */}
              <g 
                className="cursor-pointer" 
                onClick={() => setSelectedStratum('conglomerado')}
                style={{ cursor: 'pointer' }}
              >
                <rect x="20" y="45" width="240" height="55" fill="url(#patConglomerado)" stroke="#a88f72" strokeWidth="0.5" />
                <rect x="25" y="50" width="80" height="18" rx="2" fill="rgba(0,0,0,0.6)" />
                <text x="65" y="63" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">0 - 8m: Aluvión</text>
              </g>

              {/* 3. Acuitardo Arcilloso 8 - 48m (y: 100 a 330) */}
              <g 
                className="cursor-pointer" 
                onClick={() => setSelectedStratum('acuitardo')}
                style={{ cursor: 'pointer' }}
              >
                <rect x="20" y="100" width="240" height="230" fill="url(#patArcilla)" stroke="#8c633a" strokeWidth="0.5" />
                <rect x="25" y="160" width="105" height="32" rx="2" fill="rgba(0,0,0,0.65)" />
                <text x="77" y="174" textAnchor="middle" fill="#fde047" fontSize="9" fontWeight="bold">8 - 48m: Acuitardo</text>
                <text x="77" y="186" textAnchor="middle" fill="#ffffff" fontSize="8">Arcilla Su &gt; 120 kPa</text>

                {/* Líneas de peldaños tallados a pico */}
                <line x1="105" y1="130" x2="115" y2="130" stroke="#fef08a" strokeWidth="1.5" />
                <line x1="105" y1="160" x2="115" y2="160" stroke="#fef08a" strokeWidth="1.5" />
                <line x1="105" y1="190" x2="115" y2="190" stroke="#fef08a" strokeWidth="1.5" />
                <line x1="105" y1="220" x2="115" y2="220" stroke="#fef08a" strokeWidth="1.5" />
                <line x1="105" y1="250" x2="115" y2="250" stroke="#fef08a" strokeWidth="1.5" />
                <line x1="105" y1="280" x2="115" y2="280" stroke="#fef08a" strokeWidth="1.5" />
                <line x1="105" y1="310" x2="115" y2="310" stroke="#fef08a" strokeWidth="1.5" />
              </g>

              {/* 4. Techo de acuífero a 48m (y: 330 a 345) */}
              <g 
                className="cursor-pointer" 
                onClick={() => setSelectedStratum('techo')}
                style={{ cursor: 'pointer' }}
              >
                <rect x="20" y="330" width="240" height="18" fill="#d97706" opacity="0.8" />
                <text x="140" y="343" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                  48.0m: Techo de Acuífero
                </text>
              </g>

              {/* 5. Acuífero de gravas negras lavadas (y: 348 a 510) */}
              <g 
                className="cursor-pointer" 
                onClick={() => setSelectedStratum(is60m ? 'grava_acuifero' : 'profundo_120')}
                style={{ cursor: 'pointer' }}
              >
                <rect x="20" y="348" width="240" height={is60m ? 165 : 165} fill="url(#patGrava)" stroke="#0f172a" strokeWidth="1" />
                
                {/* Agua saturada desde NE (49.5m -> y: 360) hasta el fondo */}
                <rect x="20" y="360" width="240" height="153" fill="url(#patAgua)" opacity="0.45" />

                <rect x="25" y="380" width="110" height="34" rx="2" fill="rgba(0,0,0,0.75)" />
                <text x="80" y="394" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold">
                  {is60m ? '49.5 - 60m: Gravas' : '49.5 - 120m: Formación'}
                </text>
                <text x="80" y="407" textAnchor="middle" fill="#ffffff" fontSize="8">
                  {is60m ? 'K ≈ 10⁻³ m/s (Lidita)' : 'Areniscas Cuarzosas'}
                </text>
              </g>

              {/* EJE DEL POZO: Fuste central (x: 110 a 170) */}
              {/* Espacio anular con grava */}
              <rect x="110" y="45" width="60" height="465" fill="#334155" opacity="0.3" stroke="#64748b" strokeWidth="1" strokeDasharray="2,2" />

              {/* Camisa de concreto o acero (x: 120 a 160) */}
              <rect x="118" y="45" width="44" height="465" fill="url(#gradConcreto)" stroke="#475569" strokeWidth="1" />
              
              {/* Hueco interior de agua (x: 126 a 154) */}
              <rect x="126" y="360" width="28" height="150" fill="#0284c7" opacity="0.8" />

              {/* Columna vertical de impulsión PEAD (x: 138, width: 4) */}
              <line x1="140" y1="35" x2="140" y2="470" stroke="#000000" strokeWidth="3" />
              <line x1="135" y1="35" x2="135" y2="470" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4,2" /> {/* Guaya */}

              {/* Electrobomba sumergible (y: 455 a 485) */}
              <rect x="131" y="455" width="18" height="30" rx="3" fill="#047857" stroke="#10b981" strokeWidth="1" />
              <text x="140" y="473" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">
                {is60m ? '2HP' : '7.5HP'}
              </text>

              {/* Nivel Estático NE (y: 360) */}
              <line x1="15" y1="360" x2="265" y2="360" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4,3" />
              <polygon points="15,360 8,355 8,365" fill="#0284c7" />
              <rect x="175" y="350" width="85" height="18" rx="2" fill="#0369a1" />
              <text x="217" y="362" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                NE: 49.5 m (Lámina)
              </text>

              {/* Nivel Dinámico ND (y: 395) */}
              <line x1="15" y1="395" x2="265" y2="395" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
              <polygon points="15,395 8,390 8,400" fill="#d97706" />
              <rect x="175" y="385" width="85" height="18" rx="2" fill="#b45309" />
              <text x="217" y="397" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                ND: {is60m ? '53.2 m (s=3.7m)' : '88.0 m (s=18m)'}
              </text>

              {/* Tapón de fondo (cota 60m / y: 510) */}
              <rect x="115" y="505" width="50" height="10" rx="1" fill="#475569" stroke="#1e293b" strokeWidth="1" />
              <text x="140" y="513" textAnchor="middle" fill="#f8fafc" fontSize="7">Tapón 1/4"</text>

              {/* Cota final */}
              <text x="140" y="535" textAnchor="middle" fill="#0f172a" fontSize="10" fontWeight="bold">
                Fondo: {is60m ? '60.0 metros' : '120.0 metros'}
              </text>
            </svg>
          </div>

          {/* Tarjeta de Detalle del Estrato Seleccionado */}
          <div className="col-12 col-md-7">
            <div className="bg-white p-3 rounded border border-secondary-subtle h-100 shadow-xs">
              <div className="d-flex justify-content-between align-items-start mb-2 border-bottom pb-2">
                <div>
                  <span className="text-uppercase text-xs fw-bold text-muted d-block">Estrato Geotécnico</span>
                  <h5 className="fs-6 fw-bold text-dark mb-0 text-primary">{activeData.name}</h5>
                </div>
                <Badge bg="dark" className="font-monospace text-xs">
                  {activeData.depthRange}
                </Badge>
              </div>

              <div className="d-flex flex-column gap-2 text-xs">
                <div>
                  <strong className="text-dark">Litología & Descripción Mineral:</strong>
                  <p className="text-secondary mb-0">{activeData.lithology}</p>
                </div>

                <div className="row g-2 pt-1">
                  <div className="col-6">
                    <div className="p-2 bg-light rounded border">
                      <span className="text-muted d-block text-2xs">Conductividad Hidráulica (K):</span>
                      <span className="fw-bold font-monospace text-dark">{activeData.permeabilityK}</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-2 bg-light rounded border">
                      <span className="text-muted d-block text-2xs">Transmisividad (T):</span>
                      <span className="fw-bold font-monospace text-dark">{activeData.transmissivityT}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <strong className="text-dark">Comportamiento Geomecánico:</strong>
                  <p className="text-secondary mb-0">{activeData.geomechanics}</p>
                </div>

                <div className="p-2 bg-primary-subtle rounded text-primary-emphasis mt-1">
                  <strong>Interpretación Hidrológica:</strong>
                  <p className="mb-0 text-2xs mt-1">{activeData.description}</p>
                </div>

                <div className="d-flex align-items-center justify-content-between pt-1 border-top mt-2">
                  <span className="text-muted text-2xs">Fuente de Validación:</span>
                  <Badge bg="secondary" className="text-2xs">{activeData.ragRef}</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
