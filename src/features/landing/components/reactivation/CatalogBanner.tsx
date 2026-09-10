import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface ShowcaseItem {
  id: string;
  name: string;
  category: string;
  badge: string;
  specs: string;
  description: string;
  imageUrl: string;
}

export const CatalogBanner: React.FC = () => {
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);

  const showcaseItems: ShowcaseItem[] = [
    {
      id: 'u3-pro',
      name: 'AGRO-U3 Pro — Multicapilla Reforzada',
      category: 'Invernadero Gótico de Alta Carga',
      badge: 'Triple Refuerzo Eólico',
      specs: 'Ancho ≤ 8.00m · Cumbrera 3.00m · Arcos a 1.00m',
      description: 'Estructura reforzada con correas de arco, tirantes contraviento y cruces de San Andrés. Diseñada para tolerar las ráfagas sostenidas del Este en el Valle de Quíbor sin deformaciones.',
      imageUrl: 'https://sc04.alicdn.com/kf/H5c3efd3ce3e34b1f8a4b596c91983941a/239438894/H5c3efd3ce3e34b1f8a4b596c91983941a.png',
    },
    {
      id: 'u1-pro',
      name: 'AGRO-U1 Pro — Hilo Alto & Volumen Térmico',
      category: 'Invernadero para Tomate y Pimentón',
      badge: 'Cumbrera 4.80m',
      specs: 'Ancho ≤ 10.00m · Cumbrera 4.80m · Tutorado 20 kg/m²',
      description: 'Gran altura cenital que acelera el tiro convectivo y desaloja bolsas de calor en horas pico. Soporta líneas de tutorado vertical pesado sin fatiga mecánica.',
      imageUrl: 'https://sc04.alicdn.com/kf/He8062da9fca94fe09065e4818e40e9dfH/239438894/He8062da9fca94fe09065e4818e40e9dfH.png',
    },
    {
      id: 'u2-basic',
      name: 'AGRO-U2 Basic — Nave Ancha Multitúnel 15m',
      category: 'Macrotúnel Comercial',
      badge: 'Vano Libre 15m',
      specs: 'Ancho ≤ 15.00m · Cumbrera 3.80m · Sin postes intermedios',
      description: 'Espacio diáfano continuo para mecanización ligera, distribución de 10 a 14 camellones dobles y tendido continuo de mangueras de riego por goteo.',
      imageUrl: 'https://sc04.alicdn.com/kf/H75293243a7a84d8cac787032ff573d6f1/239438894/H75293243a7a84d8cac787032ff573d6f1.png',
    },
    {
      id: 'lock-profile',
      name: 'Kit Lock Channel C + Alambre Wiggle Wire',
      category: 'Herrajes de Fijación Profesional',
      badge: 'Sujeción Sin Perforar',
      specs: 'Perfil C 4.00m · Resorte Zig-Zag 2.00m anti-UV',
      description: 'Sistema estándar de sujeción estanca para mallas antiáfido 50 mesh y plásticos térmicos. Resiste tensiones de viento extremo sin rasgar el tejido.',
      imageUrl: 'https://www.leadergreenhouse.com/themes/LeaderGreenhouse_en/public/assets/img/models/model1-menu.png',
    }
  ];

  const currentItem = showcaseItems[activeItemIndex];

  const waBannerMsg = encodeURIComponent(
    `Hola Agrovenecua, estoy interesado en el Catálogo de Invernaderos y Accesorios:\n` +
    `• Producto: ${currentItem.name}\n` +
    `• Especificaciones: ${currentItem.specs}\n` +
    `Por favor compartirme lista de precios, ficha técnica y opciones de suministro en Venezuela.`
  );

  return (
    <section 
      id="banner-catalogo-invernaderos" 
      aria-labelledby="heading-catalogo-banner"
      className="py-5 section-agro-white border-top border-secondary-subtle"
    >
      <div className="container-xl">
        <div
          className="card card-agro shadow-lg overflow-hidden position-relative border-0"
          style={{
            background: 'linear-gradient(135deg, #071f13 0%, #0d3320 50%, #05140c 100%)',
            borderRadius: '24px',
          }}
        >
          {/* Acento de iluminación verde esmeralda */}
          <div
            className="position-absolute top-0 end-0 pointer-events-none"
            style={{
              width: '520px',
              height: '520px',
              background: 'radial-gradient(circle, rgba(83, 201, 66, 0.18) 0%, rgba(83, 201, 66, 0) 70%)',
              transform: 'translate(20%, -20%)',
              zIndex: 1,
            }}
          />

          {/* Grilla técnica sutil tipo plano estructural */}
          <div
            className="position-absolute inset-0 pointer-events-none opacity-5"
            style={{
              backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              zIndex: 1,
            }}
          />

          <div className="p-4 p-md-5 position-relative" style={{ zIndex: 2 }}>
            <div className="row g-4 g-xl-5 align-items-center">
              {/* COLUMNA IZQUIERDA: CONTENIDO SEO Y VALOR AGRONÓMICO */}
              <div className="col-12 col-lg-7">
                {/* Badges de Garantía y Ubicación */}
                <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
                  <span className="badge bg-success text-white rounded-pill px-3 py-1.5 text-uppercase fw-bold font-monospace text-xs shadow-sm d-inline-flex align-items-center gap-1.5">
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>verified</span>
                    <span>Ingeniería Agronómica · AGROVENECUA</span>
                  </span>
                  <span className="badge bg-white bg-opacity-15 text-white rounded-pill px-3 py-1.5 text-xs font-monospace border border-white border-opacity-20">
                    Suministro en Venezuela · Valle de Quíbor, Lara
                  </span>
                </div>

                {/* Título Principal con Alto Impacto SEO */}
                <h2 id="heading-catalogo-banner" className="display-6 fw-black text-white tracking-tight lh-1 mb-3">
                  Catálogo de <span style={{ color: '#53C942' }}>Invernaderos, Casas de Malla</span> & Herrajes de Montaje
                </h2>

                {/* Resumen Técnico con Lenguaje Agrícola Claro */}
                <p className="lead text-white-50 fs-6 mb-4" style={{ lineHeight: '1.65' }}>
                  Estructuras de acero galvanizado en caliente Sch 40 (HDG Z275/Z350) calculadas para resistir las ráfagas de viento del Este (27 km/h) en Quíbor. Disponemos de vanos modulares de 8m, 10m y 15m, perfiles Lock Channel C, alambre Wiggle Wire, canalones pluviales de alto caudal y sistemas de ventilación forzada para pimentón y tomate.
                </p>

                {/* Franja de 4 Métricas de Ingeniería para Fácil Comprensión */}
                <div className="row g-2 mb-4">
                  <div className="col-6 col-sm-3">
                    <div className="p-2.5 rounded-3 bg-black bg-opacity-35 border border-white border-opacity-10 text-center">
                      <div className="fs-5 fw-bold font-mono" style={{ color: '#53C942' }}>5 Modelos</div>
                      <span className="text-white-50 text-xs">Vanos de 8 a 15m</span>
                    </div>
                  </div>
                  <div className="col-6 col-sm-3">
                    <div className="p-2.5 rounded-3 bg-black bg-opacity-35 border border-white border-opacity-10 text-center">
                      <div className="fs-5 fw-bold font-mono" style={{ color: '#53C942' }}>Z350 HDG</div>
                      <span className="text-white-50">15+ Años sin Óxido</span>
                    </div>
                  </div>
                  <div className="col-6 col-sm-3">
                    <div className="p-2.5 rounded-3 bg-black bg-opacity-35 border border-white border-opacity-10 text-center">
                      <div className="fs-5 fw-bold font-mono" style={{ color: '#53C942' }}>100 km/h</div>
                      <span className="text-white-50">Carga de Viento Segura</span>
                    </div>
                  </div>
                  <div className="col-6 col-sm-3">
                    <div className="p-2.5 rounded-3 bg-black bg-opacity-35 border border-white border-opacity-10 text-center">
                      <div className="fs-5 fw-bold font-mono" style={{ color: '#53C942' }}>En Stock</div>
                      <span className="text-white-50">Despacho en Venezuela</span>
                    </div>
                  </div>
                </div>

                {/* Botones de Acción (CTAs Principales) */}
                <div className="d-flex flex-wrap align-items-center gap-3">
                  <Link
                    to="/catalogo-invernaderos"
                    className="btn btn-success btn-lg rounded-pill fw-bold text-white px-4 py-3 d-inline-flex align-items-center gap-2 shadow-lg"
                    style={{ backgroundColor: '#248a15', borderColor: '#248a15' }}
                    title="Ver catálogo completo de estructuras e invernaderos en Venezuela"
                  >
                    <span className="material-symbols-outlined ms-sm">storefront</span>
                    <span>Explorar Catálogo Completo</span>
                    <span className="material-symbols-outlined ms-sm">arrow_forward</span>
                  </Link>

                  <a
                    href={`https://wa.me/584160000000?text=${waBannerMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-light btn-lg rounded-pill fw-bold px-4 py-3 d-inline-flex align-items-center gap-2"
                    title="Solicitar cotización técnica por WhatsApp a AGROVENECUA"
                  >
                    <span className="material-symbols-outlined text-success ms-sm">chat</span>
                    <span>Cotizar por WhatsApp</span>
                  </a>

                  <Link
                    to="/malla-50mesh"
                    className="text-white-50 text-xs fw-bold text-decoration-none d-inline-flex align-items-center gap-1 px-2 py-1"
                    title="Ver ficha técnica y calculadora de rollos de Malla 50 Mesh 130 gsm"
                  >
                    <span className="material-symbols-outlined text-success" style={{ fontSize: '16px' }}>grid_view</span>
                    <span>Malla 50 Mesh (130 gsm)</span>
                  </Link>
                </div>
              </div>

              {/* COLUMNA DERECHA: SHOWCASE VISUAL INTERACTIVO */}
              <div className="col-12 col-lg-5">
                <div
                  className="card card-agro p-3 p-md-4 border-0 shadow-lg"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    borderRadius: '20px',
                  }}
                >
                  {/* Selector rápido con pestañas */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="text-white-50 text-xs text-uppercase fw-bold font-monospace">
                      Showcase de Estructuras & Accesorios
                    </span>
                    <span className="badge bg-success bg-opacity-25 text-success font-monospace text-xs">
                      {activeItemIndex + 1} / {showcaseItems.length}
                    </span>
                  </div>

                  {/* Pills de Navegación Rápida */}
                  <div className="d-flex gap-1.5 mb-3 overflow-x-auto pb-1" role="tablist" aria-label="Selector de productos">
                    {showcaseItems.map((item, idx) => (
                      <button
                        key={item.id}
                        type="button"
                        role="tab"
                        aria-selected={activeItemIndex === idx}
                        onClick={() => setActiveItemIndex(idx)}
                        className={`btn btn-sm rounded-pill px-2.5 py-1 text-xs fw-bold transition-all ${
                          activeItemIndex === idx
                            ? 'btn-success text-white shadow-sm'
                            : 'btn-outline-light text-white-50 border-white border-opacity-15'
                        }`}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        {item.name.split('—')[0].replace('AGRO-', '')}
                      </button>
                    ))}
                  </div>

                  {/* Visor del Producto */}
                  <div
                    className="position-relative bg-white rounded-3 p-3 text-center mb-3 d-flex align-items-center justify-content-center shadow-inner"
                    style={{ height: '210px', overflow: 'hidden' }}
                  >
                    <span
                      className="position-absolute top-0 start-0 m-2.5 badge font-monospace text-xs"
                      style={{ backgroundColor: '#0F4D06', color: '#ffffff' }}
                    >
                      {currentItem.badge}
                    </span>
                    <span
                      className="position-absolute top-0 end-0 m-2.5 badge bg-light text-secondary border border-secondary-subtle text-xs"
                    >
                      {currentItem.category}
                    </span>

                    <img
                      src={currentItem.imageUrl}
                      alt={`${currentItem.name} - Estructura agrícola para invernadero en Venezuela`}
                      className="img-fluid transition-all"
                      style={{ maxHeight: '180px', objectFit: 'contain' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://www.leadergreenhouse.com/themes/LeaderGreenhouse_en/public/assets/img/models/model1-menu.png';
                      }}
                    />
                  </div>

                  {/* Datos del Producto Seleccionado */}
                  <h3 className="fs-5 fw-bold text-white mb-1.5">{currentItem.name}</h3>

                  <div className="p-2.5 rounded-3 bg-black bg-opacity-40 border border-white border-opacity-10 mb-3 text-xs">
                    <div className="text-success fw-bold font-mono mb-1 d-flex align-items-center gap-1">
                      <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>straighten</span>
                      <span>{currentItem.specs}</span>
                    </div>
                    <p className="text-white-50 mb-0" style={{ lineHeight: '1.4' }}>
                      {currentItem.description}
                    </p>
                  </div>

                  {/* Acciones del Producto */}
                  <div className="d-flex gap-2">
                    <Link
                      to="/catalogo-invernaderos"
                      className="btn btn-success btn-sm flex-fill rounded-pill fw-bold py-2 d-inline-flex align-items-center justify-content-center gap-1.5 shadow-sm"
                      style={{ backgroundColor: '#248a15', borderColor: '#248a15' }}
                      title="Ver ficha técnica completa en el catálogo"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>visibility</span>
                      <span>Ver Ficha Técnica en Catálogo</span>
                    </Link>

                    <a
                      href={`https://wa.me/584160000000?text=${waBannerMsg}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-light btn-sm rounded-circle p-2 d-inline-flex align-items-center justify-content-center"
                      title="Consultar precio y disponibilidad de este ítem por WhatsApp"
                      style={{ width: '38px', height: '38px' }}
                    >
                      <span className="material-symbols-outlined text-success" style={{ fontSize: '18px' }}>chat</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CatalogBanner;
