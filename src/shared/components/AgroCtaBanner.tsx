import React from 'react';
import { Link } from 'react-router-dom';

export interface AgroCtaBannerProps {
  /** Texto del badge superior (kicker) */
  badgeKicker?: string;
  /** Sub-etiqueta o especificación en el badge */
  badgeTag?: string;
  /** Título principal (admite JSX con colores de resalte) */
  title: React.ReactNode;
  /** Párrafo descriptivo */
  description: React.ReactNode;
  /** Texto del botón de acción principal */
  primaryCtaText: string;
  /** Enlace interno o URL del botón principal */
  primaryCtaLink: string;
  /** Nombre del icono Material Symbols para el botón principal */
  primaryCtaIcon?: string;
  /** Texto opcional para el botón secundario */
  secondaryCtaText?: string;
  /** Enlace opcional para el botón secundario */
  secondaryCtaLink?: string;
  /** Icono para el botón secundario */
  secondaryCtaIcon?: string;
  /** Título de la tarjeta de contacto */
  contactTitle?: string;
  /** Correo de contacto */
  contactEmail?: string;
  /** Teléfono de contacto */
  contactPhone?: string;
  /** Ubicación de campo */
  contactLocation?: string;
  /** Mensaje predeterminado de WhatsApp */
  whatsappMessage?: string;
  /** Número de WhatsApp (código país + número, sin signos) */
  whatsappNumber?: string;
  /** Mostrar icono decorativo tenue de despacho en el fondo */
  showShippingIcon?: boolean;
  /** ID para anclaje o accesibilidad */
  id?: string;
  /** Clases CSS adicionales para el contenedor de la sección */
  className?: string;
}

export const AgroCtaBanner: React.FC<AgroCtaBannerProps> = ({
  badgeKicker = 'AGROVENECUA · Cobertura y Suministro en Venezuela',
  badgeTag = 'Malla 130 gsm 50 Mesh',
  title,
  description,
  primaryCtaText,
  primaryCtaLink,
  primaryCtaIcon = 'grid_view',
  secondaryCtaText,
  secondaryCtaLink,
  secondaryCtaIcon = 'home',
  contactTitle = 'Atención Directa en Campo',
  contactEmail = 'contacto@agrovenecua.com',
  contactPhone = '+58 416-0000000',
  contactLocation = 'Finca La Cigarronera, Quíbor, Lara',
  whatsappMessage = 'Hola AGROVENECUA, solicito cotización formal y asesoría técnica',
  whatsappNumber = '584160000000',
  showShippingIcon = true,
  id = 'seccion-cta-agrovenecua',
  className = 'py-5',
}) => {
  const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section className={className} id={id} aria-label="Llamada a la acción y contacto">
      <div className="container-xl">
        <div
          className="card card-agro p-4 p-lg-5 shadow-lg text-white position-relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #041f11 0%, #0a3d21 35%, #0f542c 70%, #062314 100%)',
            border: '2px solid rgba(83, 201, 66, 0.45)',
            borderRadius: '24px',
            boxShadow: '0 20px 50px -10px rgba(10, 61, 33, 0.55), 0 0 35px rgba(83, 201, 66, 0.22)',
          }}
        >
          {/* Destello de luz verde esmeralda superior derecho */}
          <div
            className="position-absolute top-0 end-0 pointer-events-none"
            style={{
              width: '500px',
              height: '500px',
              background: 'radial-gradient(circle, rgba(83, 201, 66, 0.32) 0%, rgba(83, 201, 66, 0) 70%)',
              transform: 'translate(25%, -25%)',
              zIndex: 1,
            }}
          />

          {/* Resplandor cálido de sol/tierra inferior izquierdo */}
          <div
            className="position-absolute bottom-0 start-0 pointer-events-none"
            style={{
              width: '380px',
              height: '380px',
              background: 'radial-gradient(circle, rgba(217, 119, 6, 0.18) 0%, rgba(217, 119, 6, 0) 70%)',
              transform: 'translate(-20%, 25%)',
              zIndex: 1,
            }}
          />

          {/* Malla agrícola geométrica sutil de fondo */}
          <div
            className="position-absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#53C942 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              opacity: 0.08,
              zIndex: 1,
            }}
          />

          {/* Icono tenue de logística/despacho */}
          {showShippingIcon && (
            <div className="position-absolute top-0 end-0 p-4 opacity-10 d-none d-lg-block pointer-events-none" style={{ zIndex: 1 }}>
              <span className="material-symbols-outlined display-1 text-success">local_shipping</span>
            </div>
          )}

          <div className="row g-4 align-items-center position-relative" style={{ zIndex: 2 }}>
            {/* Columna Principal: Mensaje y Botones de Acción */}
            <div className="col-12 col-lg-8">
              <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
                <span
                  className="badge rounded-pill px-3 py-1.5 text-uppercase fw-bold font-monospace text-xs shadow-sm d-inline-flex align-items-center gap-1.5"
                  style={{
                    backgroundColor: 'rgba(83, 201, 66, 0.25)',
                    color: '#a7f3d0',
                    border: '1px solid rgba(83, 201, 66, 0.45)',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>verified</span>
                  <span>{badgeKicker}</span>
                </span>
                {badgeTag && (
                  <span
                    className="badge rounded-pill px-2.5 py-1 text-xs font-monospace text-white-50"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                    }}
                  >
                    {badgeTag}
                  </span>
                )}
              </div>

              <h2 className="display-6 fw-bold text-white tracking-tight mb-3">
                {title}
              </h2>

              <div className="lead text-white-50 fs-6 mb-4" style={{ lineHeight: '1.65' }}>
                {description}
              </div>

              <div className="d-flex flex-wrap gap-3">
                {/* Botón CTA Primario */}
                {primaryCtaLink.startsWith('http') ? (
                  <a
                    href={primaryCtaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-lg rounded-pill fw-bold px-4 py-3 d-inline-flex align-items-center gap-2 shadow-lg hover-scale"
                    style={{
                      backgroundColor: '#53C942',
                      borderColor: '#53C942',
                      color: '#062613',
                      fontWeight: 800,
                      boxShadow: '0 8px 24px rgba(83, 201, 66, 0.45)',
                    }}
                  >
                    <span className="material-symbols-outlined ms-sm" style={{ fontSize: '20px' }}>{primaryCtaIcon}</span>
                    <span>{primaryCtaText}</span>
                    <span className="material-symbols-outlined ms-sm" style={{ fontSize: '18px' }}>arrow_forward</span>
                  </a>
                ) : (
                  <Link
                    to={primaryCtaLink}
                    className="btn btn-lg rounded-pill fw-bold px-4 py-3 d-inline-flex align-items-center gap-2 shadow-lg hover-scale"
                    style={{
                      backgroundColor: '#53C942',
                      borderColor: '#53C942',
                      color: '#062613',
                      fontWeight: 800,
                      boxShadow: '0 8px 24px rgba(83, 201, 66, 0.45)',
                    }}
                  >
                    <span className="material-symbols-outlined ms-sm" style={{ fontSize: '20px' }}>{primaryCtaIcon}</span>
                    <span>{primaryCtaText}</span>
                    <span className="material-symbols-outlined ms-sm" style={{ fontSize: '18px' }}>arrow_forward</span>
                  </Link>
                )}

                {/* Botón Secundario Opcional */}
                {secondaryCtaText && secondaryCtaLink && (
                  secondaryCtaLink.startsWith('http') ? (
                    <a
                      href={secondaryCtaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-light btn-lg rounded-pill fw-bold px-4 py-3 d-inline-flex align-items-center gap-2"
                      style={{
                        borderColor: 'rgba(255, 255, 255, 0.35)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <span className="material-symbols-outlined ms-sm">{secondaryCtaIcon}</span>
                      <span>{secondaryCtaText}</span>
                    </a>
                  ) : (
                    <Link
                      to={secondaryCtaLink}
                      className="btn btn-outline-light btn-lg rounded-pill fw-bold px-4 py-3 d-inline-flex align-items-center gap-2"
                      style={{
                        borderColor: 'rgba(255, 255, 255, 0.35)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <span className="material-symbols-outlined ms-sm">{secondaryCtaIcon}</span>
                      <span>{secondaryCtaText}</span>
                    </Link>
                  )
                )}
              </div>
            </div>

            {/* Columna Derecha: Tarjeta de Atención y Contacto en Campo */}
            <div className="col-12 col-lg-4">
              <div
                className="p-3.5 rounded-3 shadow-sm"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.09)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(16px)',
                }}
              >
                <div className="text-white-50 text-xs text-uppercase fw-bold mb-2.5 d-flex justify-content-between align-items-center">
                  <span>{contactTitle}</span>
                  <span className="badge rounded-pill bg-success bg-opacity-25 text-success font-monospace" style={{ fontSize: '10px' }}>
                    Activo
                  </span>
                </div>

                {contactEmail && (
                  <div className="d-flex align-items-center gap-2 text-white mb-2">
                    <span className="material-symbols-outlined" style={{ color: '#53C942', fontSize: '18px' }}>mail</span>
                    <span className="font-monospace small">{contactEmail}</span>
                  </div>
                )}

                {contactPhone && (
                  <div className="d-flex align-items-center gap-2 text-white mb-2">
                    <span className="material-symbols-outlined" style={{ color: '#53C942', fontSize: '18px' }}>call</span>
                    <span className="font-monospace small">{contactPhone}</span>
                  </div>
                )}

                {contactLocation && (
                  <div className="d-flex align-items-center gap-2 text-white mb-3">
                    <span className="material-symbols-outlined" style={{ color: '#53C942', fontSize: '18px' }}>location_on</span>
                    <span className="small">{contactLocation}</span>
                  </div>
                )}

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn w-100 rounded-pill fw-bold py-2.5 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                  style={{
                    backgroundColor: '#248a15',
                    borderColor: '#53C942',
                    color: '#ffffff',
                    boxShadow: '0 4px 16px rgba(36, 138, 21, 0.4)',
                  }}
                  title="Contactar asesor comercial de AGROVENECUA"
                >
                  <span className="material-symbols-outlined ms-sm">chat</span>
                  <span>Contactar Representante</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgroCtaBanner;
