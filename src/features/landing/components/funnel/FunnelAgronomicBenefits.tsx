import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const FunnelAgronomicBenefits: React.FC = () => {
  const benefits = [
    {
      id: 'rendimiento',
      title: 'Multiplicación de Cosecha',
      metric: '12.5 Ton Pimentón',
      submetric: '4x vs Campo Abierto · 2.50 pl/m²',
      desc: 'En 1.000 m² protegidos se cosechan 12.500 kg de Pimentón de primera calidad (2.500 plantas tecnificadas), eliminando el 60% de merma habitual a campo abierto.',
      icon: 'trending_up',
      badge: 'Pimentón Exclusivo',
      color: 'text-success',
      borderAccent: 'border-success',
      bgGlow: 'rgba(83, 201, 66, 0.08)'
    },
    {
      id: 'bioseguridad',
      title: 'Blindaje Fitosanitario Físico',
      metric: '50 Mesh Virgen',
      submetric: 'Poro ≤ 192 µm · 110 gsm',
      desc: 'Barrera mecánica impenetrable contra Mosca Blanca (Bemisia tabaci) y Trips (Frankliniella occidentalis). Reduce en más de un 70% las aplicaciones de agroquímicos.',
      icon: 'shield',
      badge: 'Sin Virosis',
      color: 'text-success',
      borderAccent: 'border-success',
      bgGlow: 'rgba(83, 201, 66, 0.08)'
    },
    {
      id: 'riego',
      title: 'Hidrología de Precisión (FAO-56)',
      metric: 'Pozo Propio 60m',
      submetric: 'Lixiviación LF +15%',
      desc: 'Riego localizado por goteo compensando la conductividad del pozo aluvial de Quíbor. Lavado continuo de sales que garantiza raíces sanas en el bulbo húmedo (0–40 cm).',
      icon: 'water_drop',
      badge: 'Ahorro Hídrico 88%',
      color: 'text-info',
      borderAccent: 'border-info',
      bgGlow: 'rgba(56, 189, 248, 0.08)'
    },
    {
      id: 'clima',
      title: 'Microclima & Control de VPD',
      metric: '0.8 – 1.2 kPa',
      submetric: 'Anti-Aborto Floral',
      desc: 'Ventilación convectiva natural y extractores cenitales que disipan el bochorno de Quíbor. Evita temperaturas >32 °C que esterilizan el polen y frenan el cuajado.',
      icon: 'cyclone',
      badge: 'NASA MERRA-2',
      color: 'text-warning',
      borderAccent: 'border-warning',
      bgGlow: 'rgba(245, 158, 11, 0.08)'
    },
  ];

  return (
    <section id="beneficios-tecnicos" className="py-5 border-top border-secondary-subtle bg-white">
      <Container fluid="xl" className="py-3">
        {/* Encabezado de Beneficios Técnicos */}
        <div className="text-center max-w-2xl mx-auto mb-5">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-success bg-opacity-10 border border-success border-opacity-25 text-success text-xs fw-bold text-uppercase mb-2">
            <span className="material-symbols-outlined ms-sm">verified_user</span>
            <span>Propuesta de Valor · Factores Clave de Éxito</span>
          </div>
          <h2 className="display-6 fw-bold text-dark mb-3">
            ¿Por Qué Reactivar la Nave de 1.000 m² en Quíbor?
          </h2>
          <p className="text-secondary small max-w-xl mx-auto">
            Datos técnicos reales extraídos de la línea base microclimática y del Cockpit de Ingeniería Agronómica de AGROVENECUA (Municipio Jiménez, Lara).
          </p>
        </div>

        {/* Tarjetas de Beneficios */}
        <Row className="g-4">
          {benefits.map((b) => (
            <Col xs={12} md={6} lg={3} key={b.id}>
              <Card 
                className="card-agro p-4 h-100 shadow-sm border position-relative overflow-hidden d-flex flex-column justify-content-between"
                style={{ backgroundColor: '#ffffff' }}
              >
                {/* Micro-glow superior */}
                <div 
                  className="position-absolute top-0 start-0 w-100" 
                  style={{ height: '4px', backgroundColor: b.color.includes('info') ? '#0284c7' : b.color.includes('warning') ? '#d97706' : '#53C942' }} 
                />

                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className={`material-symbols-outlined ${b.color} ms-lg`}>
                      {b.icon}
                    </span>
                    <Badge bg="light" text="dark" className="border border-secondary-subtle font-monospace text-xxs">
                      {b.badge}
                    </Badge>
                  </div>

                  <h3 className="fs-5 fw-bold text-dark mb-1">{b.title}</h3>
                  <div className={`fs-4 fw-bold font-mono ${b.color} mb-1`}>{b.metric}</div>
                  <div className="text-secondary fw-semibold text-xxs mb-3 font-mono">{b.submetric}</div>
                  <p className="text-secondary small mb-0">{b.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-top border-secondary-subtle d-flex align-items-center justify-content-between">
                  <span className="text-xxs text-muted font-mono">Cockpit Quíbor</span>
                  <Link to="/cockpit" className="text-success text-xs fw-bold text-decoration-none d-inline-flex align-items-center gap-1">
                    <span>Ver cálculo</span>
                    <span className="material-symbols-outlined ms-sm">arrow_forward</span>
                  </Link>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};
export default FunnelAgronomicBenefits;
