import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  GREENHOUSE_MODELS,
  HOT_SALE_ACCESSORIES,
  FACILITY_SYSTEMS,
  ACCESSORY_CATEGORIES,
  GreenhouseModel,
} from '../../core/constants/leaderGreenhouseCatalog';
import { AgroCtaBanner } from '../../shared/components/AgroCtaBanner';

export const LeaderCatalogPage: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<GreenhouseModel>(GREENHOUSE_MODELS[0]);
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>(ACCESSORY_CATEGORIES[0].id);
  const [inquiryModalModel, setInquiryModalModel] = useState<GreenhouseModel | null>(null);

  // Optimización SEO dinámica del documento
  useEffect(() => {
    document.title = "Catálogo de Invernaderos en Venezuela y Equipamiento Agrícola | AGROVENECUA";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Catálogo técnico de invernaderos en acero galvanizado, casas de malla, perfiles Lock Channel, alambre Wiggle Wire y sistemas de fertirriego para pimentón en el Valle de Quíbor, Venezuela.'
      );
    }
  }, []);

  const getWaLinkForModel = (model: GreenhouseModel) => {
    const text = encodeURIComponent(
      `Hola AGROVENECUA, deseo cotizar una estructura de invernadero:\n` +
      `• Modelo: ${model.name}\n` +
      `• Categoría: ${model.category}\n` +
      `• Ancho de Vano: ${model.width} | Altura Cumbrera: ${model.roofHeight}\n` +
      `• Cultivo Destinado: ${model.recommendedUse}\n` +
      `Por favor indicarme costos de materiales, tiempos de despacho y asesoría técnica para mi predio en Venezuela.`
    );
    return `https://wa.me/584160000000?text=${text}`;
  };

  const getWaLinkForAccessory = (accName: string, spec: string) => {
    const text = encodeURIComponent(
      `Hola AGROVENECUA, deseo cotizar el accesorio de montaje:\n` +
      `• Producto: ${accName}\n` +
      `• Presentación / Medida: ${spec}\n` +
      `Por favor indicarme disponibilidad de entrega y precio puesto en Venezuela.`
    );
    return `https://wa.me/584160000000?text=${text}`;
  };

  const activeCategory = ACCESSORY_CATEGORIES.find((c) => c.id === activeCategoryTab) || ACCESSORY_CATEGORIES[0];

  return (
    <main className="pb-5" role="main">
      {/* 1. HERO DEL CATÁLOGO (Optimizado para SEO y Conversión) */}
      <section 
        className="py-5 py-lg-6 section-agro-alt border-bottom border-success border-opacity-25"
        aria-labelledby="hero-catalogo-title"
      >
        <div className="container-xl">
          {/* Breadcrumb de navegación */}
          <nav aria-label="Ruta de navegación" className="mb-3">
            <ol className="breadcrumb text-xs font-monospace m-0 p-0">
              <li className="breadcrumb-item">
                <Link to="/" className="text-secondary text-decoration-none">Inicio</Link>
              </li>
              <li className="breadcrumb-item active text-success fw-bold" aria-current="page">
                Catálogo de Invernaderos y Accesorios
              </li>
            </ol>
          </nav>

          <div className="row g-5 align-items-center">
            <div className="col-12 col-lg-8">
              <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
                <span className="badge bg-success bg-opacity-25 text-success rounded-pill px-3 py-1 font-monospace text-uppercase fw-bold">
                  Línea Industrial AGROVENECUA · Venezuela
                </span>
                <span className="badge bg-light text-secondary border border-secondary-subtle rounded-pill px-3 py-1 font-monospace">
                  Acero Sch 40 Galvanizado Z275/Z350
                </span>
              </div>

              {/* H1 Principal Único para SEO Semántico */}
              <h1 id="hero-catalogo-title" className="display-4 fw-black text-dark tracking-tight lh-1 mb-3">
                Invernaderos en Venezuela, <span className="text-success">Casas de Malla</span> & Herrajes de Montaje
              </h1>

              <p className="lead text-secondary fs-6 mb-4">
                Suministro e ingeniería de estructuras agrícolas de acero galvanizado en caliente, perfiles de sujeción Lock Channel C, alambre Wiggle Wire anti-desgarre, canalones pluviales y sistemas de fertirriego tecnificado adaptados al régimen bioclimático del Valle de Quíbor, Estado Lara y toda Venezuela.
              </p>

              <div className="d-flex flex-wrap gap-3 mb-4">
                <a
                  href="#modelos-invernaderos"
                  className="btn btn-success btn-lg rounded-pill fw-bold px-4 d-inline-flex align-items-center gap-2 shadow-sm"
                  title="Ver los 5 modelos de invernadero disponibles"
                >
                  <span className="material-symbols-outlined ms-sm">domain</span>
                  <span>Modelos de Invernadero</span>
                </a>

                <a
                  href="#hot-sale-accesorios"
                  className="btn btn-outline-dark btn-lg rounded-pill fw-bold px-4 d-inline-flex align-items-center gap-2"
                  title="Ver accesorios de fijación y sujeción"
                >
                  <span className="material-symbols-outlined ms-sm">inventory_2</span>
                  <span>Accesorios de Montaje</span>
                </a>

                <Link
                  to="/malla-50mesh"
                  className="btn btn-outline-success btn-lg rounded-pill fw-bold px-4 d-inline-flex align-items-center gap-2"
                  title="Ver malla antiáfido 50 mesh de 130 gsm"
                >
                  <span className="material-symbols-outlined ms-sm">grid_view</span>
                  <span>Malla 50 Mesh (130 gsm)</span>
                </Link>
              </div>

              {/* Indicadores de Ingeniería Agronómica */}
              <div className="d-flex flex-wrap align-items-center gap-4 text-xs text-secondary font-monospace border-top border-secondary-subtle pt-3">
                <div className="d-flex align-items-center gap-1.5">
                  <span className="material-symbols-outlined text-success ms-sm">verified_user</span>
                  <span>Acero Sch 40 HDG Z275/Z350</span>
                </div>
                <div className="d-flex align-items-center gap-1.5">
                  <span className="material-symbols-outlined text-success ms-sm">air</span>
                  <span>Resistencia Ráfagas Este 27 km/h</span>
                </div>
                <div className="d-flex align-items-center gap-1.5">
                  <span className="material-symbols-outlined text-success ms-sm">local_shipping</span>
                  <span>Despacho Directo en Venezuela</span>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-4">
              <div className="card card-agro p-4 shadow-sm border-success border-opacity-50">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="text-secondary small fw-bold text-uppercase">Garantía Estructural</span>
                  <span className="badge bg-success bg-opacity-25 text-success font-monospace">15+ Años</span>
                </div>
                <h3 className="fs-5 fw-bold text-dark mb-2">Asesoría Agronómica Especializada</h3>
                <p className="text-secondary small mb-3">
                  Calculamos la orientación de naves según la rosa de vientos, el volumen buffer térmico para evitar aborto floral y el marco de tutorado de alta carga.
                </p>
                <div className="bg-light p-3 rounded-3 border border-secondary-subtle mb-3">
                  <div className="d-flex justify-content-between text-xs mb-1">
                    <span className="text-secondary">Estructuras suministradas:</span>
                    <strong className="text-dark font-mono">+120 proyectos</strong>
                  </div>
                  <div className="d-flex justify-content-between text-xs mb-1">
                    <span className="text-secondary">Zonas agrícolas activas:</span>
                    <strong className="text-dark font-mono">Quíbor, Aragua, Zulia</strong>
                  </div>
                  <div className="d-flex justify-content-between text-xs">
                    <span className="text-secondary">Respuesta técnica:</span>
                    <strong className="text-success font-mono">&lt; 24 Horas</strong>
                  </div>
                </div>
                <a
                  href="https://wa.me/584160000000?text=Hola%20AGROVENECUA%2C%20deseo%20asesor%C3%ADa%20técnica%20para%20diseñar%20o%20equipar%20un%20invernadero%20en%20Venezuela"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success w-100 rounded-pill fw-bold py-2 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                  title="Contactar al equipo técnico de AGROVENECUA vía WhatsApp"
                >
                  <span className="material-symbols-outlined ms-sm">support_agent</span>
                  <span>Asesoría Técnica WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATÁLOGO DE MODELOS DE INVERNADERO */}
      <section id="modelos-invernaderos" className="py-5" aria-labelledby="heading-modelos">
        <div className="container-xl">
          <div className="text-center max-w-3xl mx-auto mb-5">
            <span className="badge bg-success bg-opacity-10 border border-success border-opacity-25 text-success rounded-pill px-3 py-1 text-uppercase fw-bold mb-2">
              Ingeniería Estructural en Acero Galvanizado Sch 40
            </span>
            <h2 id="heading-modelos" className="display-6 fw-bold text-dark tracking-tight mb-2">
              Estructuras e Invernaderos AGROVENECUA
            </h2>
            <p className="text-secondary fs-6 mb-0">
              Modelos prediseñados y configurables calculados bajo norma de solicitación eólica, con capacidad portante de tutorado de hasta 20 kg/m² para pimentón intensivo de alto rendimiento.
            </p>
          </div>

          {/* Grid de Modelos */}
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-5">
            {GREENHOUSE_MODELS.map((model) => {
              const isSelected = selectedModel.id === model.id;
              return (
                <div className="col" key={model.id}>
                  <article
                    className={`card card-agro h-100 p-3 transition-all cursor-pointer ${
                      isSelected ? 'border-success border-opacity-75 shadow-lg' : 'border-secondary-subtle'
                    }`}
                    onClick={() => setSelectedModel(model)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Imagen del modelo con alt semántico */}
                    <div className="position-relative bg-white rounded-3 p-3 text-center mb-3 border border-secondary-subtle" style={{ minHeight: '200px' }}>
                      <span className="position-absolute top-0 start-0 m-2 badge bg-success bg-opacity-25 text-success font-monospace text-xs">
                        {model.tag}
                      </span>
                      <img
                        src={model.imageUrl}
                        alt={`${model.name} - Estructura de invernadero en Venezuela`}
                        className="img-fluid rounded"
                        style={{ maxHeight: '170px', objectFit: 'contain' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://www.leadergreenhouse.com/themes/LeaderGreenhouse_en/public/assets/img/models/model1-menu.png';
                        }}
                      />
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="badge bg-light text-secondary border border-secondary-subtle text-xs">
                        {model.category}
                      </span>
                      <span className="material-symbols-outlined text-success ms-sm">
                        {isSelected ? 'radio_button_checked' : 'radio_button_unchecked'}
                      </span>
                    </div>

                    <h3 className="fs-5 fw-bold text-dark mb-2">{model.name}</h3>

                    {/* Ficha rápida de medidas clave */}
                    <div className="bg-light p-2.5 rounded-3 text-xs mb-3 border border-secondary-subtle">
                      <div className="d-flex justify-content-between py-1 border-bottom border-secondary-subtle">
                        <span className="text-secondary">Ancho Modular:</span>
                        <strong className="text-dark font-mono">{model.width}</strong>
                      </div>
                      <div className="d-flex justify-content-between py-1 border-bottom border-secondary-subtle">
                        <span className="text-secondary">Altura Cumbrera:</span>
                        <strong className="text-dark font-mono">{model.roofHeight}</strong>
                      </div>
                      <div className="d-flex justify-content-between py-1">
                        <span className="text-secondary">Distancia Arcos:</span>
                        <strong className="text-dark font-mono">{model.bowSpacing}</strong>
                      </div>
                    </div>

                    {/* Verificadores de refuerzo eólico */}
                    <div className="d-flex justify-content-between text-xs text-center mb-3 p-2 rounded-2 bg-success bg-opacity-10 border border-success border-opacity-25">
                      <div>
                        <div className="fw-bold text-dark">Correas Arco</div>
                        <span className={`material-symbols-outlined ms-sm ${model.archPurlins ? 'text-success' : 'text-secondary'}`}>
                          {model.archPurlins ? 'check_circle' : 'cancel'}
                        </span>
                      </div>
                      <div>
                        <div className="fw-bold text-dark">Tirante Viento</div>
                        <span className={`material-symbols-outlined ms-sm ${model.windBracing ? 'text-success' : 'text-secondary'}`}>
                          {model.windBracing ? 'check_circle' : 'cancel'}
                        </span>
                      </div>
                      <div>
                        <div className="fw-bold text-dark">Cruz San Andrés</div>
                        <span className={`material-symbols-outlined ms-sm ${model.crossBracing ? 'text-success' : 'text-secondary'}`}>
                          {model.crossBracing ? 'check_circle' : 'cancel'}
                        </span>
                      </div>
                    </div>

                    <p className="text-secondary small mb-3" style={{ fontSize: '0.85rem', lineHeight: '1.45' }}>
                      {model.description}
                    </p>

                    <div className="mt-auto d-flex gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedModel(model);
                          setInquiryModalModel(model);
                        }}
                        className="btn btn-outline-dark btn-sm flex-fill rounded-pill fw-bold"
                        title="Ver especificaciones de tubería y galvanizado"
                      >
                        Ficha Técnica
                      </button>
                      <a
                        href={getWaLinkForModel(model)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="btn btn-success btn-sm flex-fill rounded-pill fw-bold d-flex align-items-center justify-content-center gap-1 shadow-sm"
                        title="Solicitar cotización personalizada"
                      >
                        <span className="material-symbols-outlined ms-sm" style={{ fontSize: '18px' }}>chat</span>
                        <span>Cotizar</span>
                      </a>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>

          {/* Ficha Técnica Expandida del Modelo Activo */}
          <div className="card card-agro p-4 shadow-sm border-success border-opacity-50">
            <div className="row g-4 align-items-center">
              <div className="col-12 col-lg-3 text-center">
                <img
                  src={selectedModel.imageUrl}
                  alt={`${selectedModel.name} - Vista estructural isométrica`}
                  className="img-fluid rounded border border-secondary-subtle p-2 bg-white"
                  style={{ maxHeight: '180px', objectFit: 'contain' }}
                />
                <div className="mt-2 text-xs font-monospace text-secondary">
                  Cálculo Estructural Oficial AGROVENECUA
                </div>
              </div>
              <div className="col-12 col-lg-6">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="badge bg-success text-white font-monospace">{selectedModel.tag}</span>
                  <span className="badge bg-light text-secondary border border-secondary-subtle">{selectedModel.category}</span>
                </div>
                <h3 className="fs-4 fw-bold text-dark mb-2">{selectedModel.name}</h3>
                <p className="text-secondary small mb-3">
                  <strong>Uso Agronómico:</strong> {selectedModel.recommendedUse}
                </p>
                <div className="row g-2 text-xs">
                  <div className="col-sm-6">
                    <div className="p-2 rounded bg-light border border-secondary-subtle">
                      <span className="text-secondary d-block">Tipo de Perfil y Pilares:</span>
                      <strong className="text-dark">{selectedModel.structuralSpecs.columnType}</strong>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="p-2 rounded bg-light border border-secondary-subtle">
                      <span className="text-secondary d-block">Capa de Galvanizado:</span>
                      <strong className="text-dark">{selectedModel.structuralSpecs.galvanization}</strong>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="p-2 rounded bg-light border border-secondary-subtle">
                      <span className="text-secondary d-block">Resistencia al Viento:</span>
                      <strong className="text-success">{selectedModel.structuralSpecs.windResistance}</strong>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="p-2 rounded bg-light border border-secondary-subtle">
                      <span className="text-secondary d-block">Ventilación Perimetral:</span>
                      <strong className="text-dark">{selectedModel.structuralSpecs.ventilationType}</strong>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-3 text-center text-lg-end">
                <div className="p-3 bg-success bg-opacity-10 rounded-3 border border-success border-opacity-25 mb-3 text-center">
                  <span className="text-secondary text-xs d-block mb-1">Presupuesto y Suministro</span>
                  <div className="fs-5 fw-bold text-success font-mono mb-1">Llave en Mano</div>
                  <span className="text-secondary text-xs">Adaptado a la superficie de tu finca</span>
                </div>
                <a
                  href={getWaLinkForModel(selectedModel)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success w-100 rounded-pill fw-bold py-2.5 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                  title="Cotizar este modelo específico vía WhatsApp"
                >
                  <span className="material-symbols-outlined ms-sm">chat</span>
                  <span>Cotizar {selectedModel.name.split('—')[0]}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ACCESORIOS HOT SALE (ALTA ROTACIÓN PARA MONTAJE) */}
      <section 
        id="hot-sale-accesorios" 
        className="py-5 section-agro-alt border-top border-bottom border-success border-opacity-25"
        aria-labelledby="heading-accesorios-hotsale"
      >
        <div className="container-xl">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end mb-4 gap-3">
            <div>
              <span className="badge bg-success bg-opacity-10 border border-success border-opacity-25 text-success rounded-pill px-3 py-1 text-uppercase fw-bold mb-2">
                Herrajes de Montaje en Stock
              </span>
              <h2 id="heading-accesorios-hotsale" className="display-6 fw-bold text-dark tracking-tight mb-1">
                Accesorios de Sujeción y Estructura
              </h2>
              <p className="text-secondary fs-6 mb-0">
                Piezas esenciales para montaje hermético de mallas, plásticos y drenaje pluvial sin perforar ni oxidar.
              </p>
            </div>
            <a
              href="#todos-los-accesorios"
              className="btn btn-outline-success rounded-pill fw-bold d-inline-flex align-items-center gap-1.5"
            >
              <span>Ver las 5 categorías técnicas</span>
              <span className="material-symbols-outlined ms-sm">arrow_downward</span>
            </a>
          </div>

          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-5 g-3">
            {HOT_SALE_ACCESSORIES.map((acc) => (
              <div className="col" key={acc.id}>
                <article className="card card-agro h-100 p-3 border-secondary-subtle hover-shadow transition-all d-flex flex-column">
                  <div className="bg-white rounded-3 p-3 text-center mb-2 border border-secondary-subtle" style={{ height: '140px' }}>
                    <img
                      src={acc.imageUrl}
                      alt={`${acc.name} - Accesorio de invernadero AGROVENECUA`}
                      className="img-fluid"
                      style={{ maxHeight: '110px', objectFit: 'contain' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://sc04.alicdn.com/kf/Hedf179985d564859835eb08c90ce8a67H/239438894/Hedf179985d564859835eb08c90ce8a67H.jpg';
                      }}
                    />
                  </div>

                  <span className="badge bg-success bg-opacity-25 text-success text-xs font-monospace align-self-start mb-2">
                    {acc.stockStatus}
                  </span>

                  <h3 className="fs-6 fw-bold text-dark mb-2" style={{ minHeight: '44px' }}>
                    {acc.name}
                  </h3>

                  <div className="bg-light p-2 rounded-2 text-xs mb-3 border border-secondary-subtle">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-secondary">Empaque:</span>
                      <strong className="text-dark font-mono">{acc.packageUnits}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-secondary">Medida:</span>
                      <strong className="text-dark font-mono">{acc.dimension}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-secondary">Disponibilidad:</span>
                      <strong className="text-success font-mono">{acc.shippingTime}</strong>
                    </div>
                  </div>

                  <p className="text-secondary text-xs mb-3" style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                    {acc.description}
                  </p>

                  <div className="mt-auto">
                    <div className="p-2 rounded bg-success bg-opacity-10 border border-success border-opacity-25 text-xs text-dark mb-2">
                      <strong className="text-success d-block">Impacto Agronómico:</strong>
                      <span>{acc.agronomicBenefit}</span>
                    </div>

                    <a
                      href={getWaLinkForAccessory(acc.name, `${acc.dimension} (${acc.packageUnits})`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-success btn-sm w-100 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-1"
                      title={`Cotizar ${acc.name} en WhatsApp`}
                    >
                      <span className="material-symbols-outlined ms-sm" style={{ fontSize: '16px' }}>chat</span>
                      <span>Cotizar Pieza</span>
                    </a>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INSTALACIONES & SISTEMAS CLIMÁTICOS DE SOPORTE */}
      <section className="py-5" aria-labelledby="heading-sistemas">
        <div className="container-xl">
          <div className="text-center max-w-3xl mx-auto mb-5">
            <span className="badge bg-success bg-opacity-10 border border-success border-opacity-25 text-success rounded-pill px-3 py-1 text-uppercase fw-bold mb-2">
              Climatización, Riego e Hidroponía
            </span>
            <h2 id="heading-sistemas" className="display-6 fw-bold text-dark tracking-tight mb-2">
              Sistemas Tecnológicos de Invernadero
            </h2>
            <p className="text-secondary fs-6 mb-0">
              Transforma tu estructura en una unidad de producción intensiva con control de temperatura, riego autocompensante y nutrición iónica de precisión.
            </p>
          </div>

          <div className="row g-4">
            {FACILITY_SYSTEMS.map((facility) => (
              <div className="col-12 col-md-4" key={facility.id}>
                <article className="card card-agro h-100 overflow-hidden shadow-sm border-secondary-subtle d-flex flex-column">
                  <div className="position-relative" style={{ height: '220px', overflow: 'hidden' }}>
                    <img
                      src={facility.imageUrl}
                      alt={`${facility.title} - Sistema técnico AGROVENECUA`}
                      className="w-100 h-100"
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://sc04.alicdn.com/kf/H88dd70e0eb1b4e1ba2d3bb2baeffdcb8D/239438894/H88dd70e0eb1b4e1ba2d3bb2baeffdcb8D.jpg';
                      }}
                    />
                    <div
                      className="position-absolute bottom-0 start-0 end-0 p-3 text-white"
                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}
                    >
                      <h3 className="fs-6 fw-bold mb-0 text-white">{facility.title}</h3>
                    </div>
                  </div>

                  <div className="p-4 d-flex flex-column flex-grow-1">
                    <p className="text-secondary small mb-3">{facility.description}</p>

                    <h4 className="fs-6 fw-bold text-dark mb-2">Ventajas Técnicas:</h4>
                    <ul className="list-unstyled text-secondary small d-flex flex-column gap-2 mb-4">
                      {facility.keyFeatures.map((feat, idx) => (
                        <li key={idx} className="d-flex align-items-start gap-2">
                          <span className="material-symbols-outlined text-success ms-sm mt-0.5" style={{ fontSize: '18px' }}>
                            check_circle
                          </span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-2 border-top border-secondary-subtle">
                      <a
                        href={getWaLinkForAccessory(facility.title, 'Sistema Llave en Mano para Finca')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-success w-100 rounded-pill fw-bold py-2 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                        title={`Cotizar ${facility.title}`}
                      >
                        <span className="material-symbols-outlined ms-sm">chat</span>
                        <span>Cotizar Sistema</span>
                      </a>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CATÁLOGO COMPLETO DE ACCESORIOS (TABS POR CATEGORÍA) */}
      <section 
        id="todos-los-accesorios" 
        className="py-5 section-agro-alt border-top border-success border-opacity-25"
        aria-labelledby="heading-despiece"
      >
        <div className="container-xl">
          <div className="text-center max-w-3xl mx-auto mb-4">
            <span className="badge bg-success bg-opacity-10 border border-success border-opacity-25 text-success rounded-pill px-3 py-1 text-uppercase fw-bold mb-2">
              Despiece Completo de Estructuras
            </span>
            <h2 id="heading-despiece" className="display-6 fw-bold text-dark tracking-tight mb-2">
              Herrajes, Repuestos & Elementos de Sujeción
            </h2>
            <p className="text-secondary fs-6 mb-0">
              Consulta las 5 categorías técnicas de fijación mecánica que permiten ensamblar casas de malla sin quemar el galvanizado con soldaduras.
            </p>
          </div>

          {/* Navegación por Tabs Accesible */}
          <div 
            className="d-flex flex-wrap justify-content-center gap-2 mb-4" 
            role="tablist" 
            aria-label="Categorías de accesorios de invernadero"
          >
            {ACCESSORY_CATEGORIES.map((cat) => {
              const isActive = cat.id === activeCategoryTab;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategoryTab(cat.id)}
                  className={`btn rounded-pill px-3 py-2 fw-bold text-xs d-flex align-items-center gap-2 transition-all ${
                    isActive
                      ? 'btn-success text-white shadow-sm'
                      : 'btn-outline-secondary bg-white text-dark border-secondary-subtle'
                  }`}
                >
                  <span className="material-symbols-outlined ms-sm" style={{ fontSize: '18px' }}>
                    {cat.icon}
                  </span>
                  <span>{cat.categoryName}</span>
                </button>
              );
            })}
          </div>

          {/* Tarjeta de la Categoría Activa */}
          <div className="card card-agro p-4 shadow-sm">
            <div className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom border-secondary-subtle">
              <span className="material-symbols-outlined text-success display-6">
                {activeCategory.icon}
              </span>
              <div>
                <h3 className="fs-4 fw-bold text-dark mb-0">{activeCategory.categoryName}</h3>
                <p className="text-secondary small mb-0">{activeCategory.description}</p>
              </div>
            </div>

            <div className="row g-3">
              {activeCategory.items.map((item, idx) => (
                <div className="col-12 col-md-6 col-lg-4" key={idx}>
                  <div className="p-3 rounded-3 bg-light border border-secondary-subtle h-100 d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <h4 className="fs-6 fw-bold text-dark mb-0">{item.name}</h4>
                        <span className="badge bg-secondary bg-opacity-10 text-secondary text-xs font-monospace">
                          Ítem #{idx + 1}
                        </span>
                      </div>
                      <p className="text-secondary text-xs mb-2">{item.description}</p>
                    </div>
                    <div>
                      <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary-subtle">
                        <span className="text-secondary text-xs font-monospace">{item.spec}</span>
                        <a
                          href={getWaLinkForAccessory(item.name, item.spec)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-success btn-sm rounded-pill px-2.5 py-1 text-xs fw-bold d-inline-flex align-items-center gap-1"
                          title={`Cotizar ${item.name} por WhatsApp`}
                        >
                          <span className="material-symbols-outlined ms-sm" style={{ fontSize: '14px' }}>chat</span>
                          <span>Cotizar</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. BANNER COMPLEMENTARIO: VÍNCULO CON MALLAS Y REACTIVACIÓN QUÍBOR */}
      <AgroCtaBanner
        id="heading-complemento-malla"
        badgeKicker="AGROVENECUA · Cobertura y Suministro en Venezuela"
        badgeTag="Malla 130 gsm 50 Mesh"
        title={<>¿Necesitas <span style={{ color: '#53C942' }}>Malla 50 Mesh (130 gsm)</span> para tu Estructura en Quíbor?</>}
        description="Complementa estas estructuras con nuestra Malla Antiáfido de 130 gsm monofilamento virgen blanco (con 5 años de garantía UV y poro de 192 micras) o consulta el plan agronómico completo de reactivación para 2.500 plantas de pimentón."
        primaryCtaText="Ver Malla 50 Mesh (130 gsm)"
        primaryCtaLink="/malla-50mesh"
        primaryCtaIcon="grid_view"
        secondaryCtaText="Ir a la Landing Principal"
        secondaryCtaLink="/"
        secondaryCtaIcon="home"
        contactTitle="Atención Directa en Campo"
        contactEmail="contacto@agrovenecua.com"
        contactPhone="+58 416-0000000"
        contactLocation="Finca La Cigarronera, Quíbor, Lara"
        whatsappMessage="Hola AGROVENECUA, solicito cotización formal del catálogo de invernaderos y accesorios"
      />

      {/* MODAL CON ESPECIFICACIONES TÉCNICAS (Accesible y Limpio) */}
      {inquiryModalModel && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1060 }}
          tabIndex={-1}
          role="dialog"
          aria-labelledby="modal-model-title"
          aria-modal="true"
          onClick={() => setInquiryModalModel(null)}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content card-agro border-success border-opacity-50 p-4">
              <div className="modal-header border-bottom border-secondary-subtle pb-3">
                <div>
                  <span className="badge bg-success bg-opacity-25 text-success font-monospace mb-1">
                    {inquiryModalModel.tag}
                  </span>
                  <h3 id="modal-model-title" className="modal-title fs-5 fw-bold text-dark">{inquiryModalModel.name}</h3>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setInquiryModalModel(null)}
                  aria-label="Cerrar ventana"
                ></button>
              </div>
              <div className="modal-body py-4">
                <div className="row g-4 align-items-center">
                  <div className="col-12 col-md-5 text-center">
                    <img
                      src={inquiryModalModel.imageUrl}
                      alt={`${inquiryModalModel.name} - Detalle técnico estructural`}
                      className="img-fluid rounded border border-secondary-subtle p-2 bg-white"
                      style={{ maxHeight: '220px', objectFit: 'contain' }}
                    />
                  </div>
                  <div className="col-12 col-md-7">
                    <p className="text-secondary small mb-3">{inquiryModalModel.description}</p>
                    <div className="p-3 bg-light rounded-3 border border-secondary-subtle text-xs">
                      <div className="mb-2"><strong>Ancho Modular:</strong> {inquiryModalModel.width}</div>
                      <div className="mb-2"><strong>Altura Cumbrera:</strong> {inquiryModalModel.roofHeight}</div>
                      <div className="mb-2"><strong>Espaciado entre Arcos:</strong> {inquiryModalModel.bowSpacing}</div>
                      <div className="mb-2"><strong>Pilares y Tubos:</strong> {inquiryModalModel.structuralSpecs.columnType}</div>
                      <div className="mb-2"><strong>Galvanizado:</strong> {inquiryModalModel.structuralSpecs.galvanization}</div>
                      <div><strong>Resistencia Eólica:</strong> {inquiryModalModel.structuralSpecs.windResistance}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top border-secondary-subtle pt-3 d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill px-4"
                  onClick={() => setInquiryModalModel(null)}
                >
                  Cerrar
                </button>
                <a
                  href={getWaLinkForModel(inquiryModalModel)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success rounded-pill fw-bold px-4 d-inline-flex align-items-center gap-2"
                  title="Solicitar presupuesto detallado por WhatsApp"
                >
                  <span className="material-symbols-outlined ms-sm">chat</span>
                  <span>Solicitar Presupuesto por WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default LeaderCatalogPage;
