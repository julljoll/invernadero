import React from 'react';
import { Container, Row, Col, Card, Badge, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const FunnelAgronomicBenefits: React.FC = () => {
  const benefits = [
    {
      id: 'bioseguridad',
      title: 'Barrera 50 Mesh (130 gsm)',
      metric: '0% Geminivirus',
      submetric: 'Poro ≤ 192 µm · Monofilamento Blanco',
      desc: 'Bloqueo mecánico absoluto contra Mosca Blanca (Bemisia tabaci) y Trips. En Quíbor el campo abierto pierde hasta 60% por virosis; bajo malla blanca virgen la virosis se reduce a cero.',
      icon: 'shield',
      badge: 'Blindaje Sanitario',
      color: 'text-success',
      borderAccent: 'border-success',
      bannerBg: '#53C942'
    },
    {
      id: 'microclima',
      title: 'Microclima & Altura 3.0 m',
      metric: 'VPD 0.8 – 1.2 kPa',
      submetric: 'Disipación de Bochorno · Anti-Aborto',
      desc: 'El porte del pimentón (0.8 a 1.2 m) aprovecha el volumen buffer de 3.0 m de altura. La malla blanca difumina la radiación solar y evita temperaturas >32 °C que esterilizan el polen.',
      icon: 'cyclone',
      badge: 'Termodinámica Quíbor',
      color: 'text-warning',
      borderAccent: 'border-warning',
      bannerBg: '#d97706'
    },
    {
      id: 'hidrosolubles',
      title: 'Fertirriego Hidrosoluble',
      metric: '98% Asimilación',
      submetric: 'Sales AIFA Puras · Nitratos & Fosfatos',
      desc: 'Nutrición estequiométrica líquida sin impurezas. Goteros autocompensantes PC de 1.6 L/h con fracción de lavado (LF 15-20%) para neutralizar la salinidad de pozo (CEw 1.5 dS/m).',
      icon: 'science',
      badge: 'Nutrición de Precisión',
      color: 'text-info',
      borderAccent: 'border-info',
      bannerBg: '#0284c7'
    },
    {
      id: 'rendimiento',
      title: 'Calidad "Lujo Grande"',
      metric: '625 Cestas (20 kg)',
      submetric: '5,0 kg / planta · 12.500 kg ciclo',
      desc: 'El sistema de espaldar Hortomalla mantiene el fruto suspendido, libre de pudrición basal y quemaduras solares. El 95% clasifica como Lujo Grande con cotización de $15 USD en puerta.',
      icon: 'workspace_premium',
      badge: 'Máximo Valor Comercial',
      color: 'text-success',
      borderAccent: 'border-success',
      bannerBg: '#248a15'
    },
  ];

  const comparisonData = [
    {
      factor: 'Rendimiento por Planta',
      openField: '1.5 – 2.0 kg / pl',
      greenhouse: '5,0 kg / pl (Variedad Magistral)',
      gain: '+177% mayor biomasa útil',
      icon: 'scale'
    },
    {
      factor: 'Pérdidas por Plagas y Virosis',
      openField: '40% a 60% (Mosca blanca / Trips)',
      greenhouse: '< 5% (Barrera 50 Mesh 130 gsm)',
      gain: 'Cero Geminivirus / TYLCV',
      icon: 'bug_report'
    },
    {
      factor: 'Calidad Fruta "Lujo Grande"',
      openField: '35% a 45% (alta merma por sol)',
      greenhouse: '90% a 95% Calibre Extra',
      gain: 'Máximo precio puerta finca',
      icon: 'star'
    },
    {
      factor: 'Producción Neta Comercial',
      openField: '~180 a 220 cestas (20 kg)',
      greenhouse: '625 cestas (20 kg) seleccionadas',
      gain: '3.1x más volumen empacado',
      icon: 'inventory_2'
    },
    {
      factor: 'Consumo de Plaguicidas',
      openField: '24 a 30 aplicaciones / ciclo',
      greenhouse: '6 a 8 aplicaciones preventivas',
      gain: '-73% gasto en químicos y residual',
      icon: 'sanitizer'
    },
    {
      factor: 'Eficiencia Hídrica (FAO-56)',
      openField: 'Riego por surco (25-35% eficiencia)',
      greenhouse: 'Goteo autocompensante PC (92% ef.)',
      gain: 'Ahorro 70% agua de pozo',
      icon: 'water_drop'
    }
  ];

  return (
    <section id="beneficios-tecnicos" className="py-5 border-top border-secondary-subtle bg-white">
      <Container fluid="xl" className="py-3">
        {/* Encabezado de Sección */}
        <div className="text-center max-w-2xl mx-auto mb-5">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-success bg-opacity-10 border border-success border-opacity-25 text-success text-xs fw-bold text-uppercase mb-2">
            <span className="material-symbols-outlined ms-sm">science</span>
            <span>Ventaja Competitiva Bioclimática · Valle de Quíbor</span>
          </div>
          <h2 className="display-6 fw-bold text-dark mb-3">
            ¿Por Qué la Casa de Malla de 1.000 m² es la Inversión Más Segura?
          </h2>
          <p className="text-secondary small max-w-xl mx-auto">
            Comparativa agronómica basada en la meteorología real de Quíbor (radiación extrema, ráfagas del Este a 27 km/h y presión endémica de mosca blanca).
          </p>
        </div>

        {/* 4 Cards de Pilares Agronómicos */}
        <Row className="g-4 mb-5">
          {benefits.map((b) => (
            <Col xs={12} md={6} lg={3} key={b.id}>
              <Card 
                className="card-agro p-4 h-100 shadow-sm border position-relative overflow-hidden d-flex flex-column justify-content-between"
                style={{ backgroundColor: '#ffffff' }}
              >
                {/* Micro-glow superior */}
                <div 
                  className="position-absolute top-0 start-0 w-100" 
                  style={{ height: '4px', backgroundColor: b.bannerBg }} 
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
                  <span className="text-xxs text-muted font-mono">Norma Quíbor</span>
                  <Link to="/cockpit" className="text-success text-xs fw-bold text-decoration-none d-inline-flex align-items-center gap-1">
                    <span>Auditar en Cockpit</span>
                    <span className="material-symbols-outlined ms-sm">arrow_forward</span>
                  </Link>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Tabla Comparativa: Campo Abierto vs Casa de Malla */}
        <div className="card-agro p-4 border rounded-4 bg-light shadow-sm">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
            <div>
              <h3 className="fs-5 fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                <span className="material-symbols-outlined text-success">compare_arrows</span>
                <span>Matriz Comparativa: Campo Abierto vs Casa de Malla Tecnificada</span>
              </h3>
              <p className="text-secondary text-xs m-0">
                Datos de campo para 1.000 m² cultivados con Pimentón Híbrido en el Municipio Jiménez.
              </p>
            </div>
            <Badge bg="success" className="px-3 py-1.5 rounded-pill font-mono text-xs">
              Retorno 3.1x Superior
            </Badge>
          </div>

          <div className="table-responsive">
            <Table bordered hover className="comparison-table bg-white align-middle text-xs mb-0">
              <thead className="table-light text-secondary font-monospace">
                <tr>
                  <th style={{ width: '28%' }}>Parámetro de Producción</th>
                  <th style={{ width: '24%' }} className="text-center">Siembra a Campo Abierto</th>
                  <th style={{ width: '26%' }} className="text-center bg-success bg-opacity-10 text-success fw-bold">
                    Casa de Malla 1.000 m²
                  </th>
                  <th style={{ width: '22%' }}>Impacto en Rentabilidad</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, idx) => (
                  <tr key={idx}>
                    <td className="fw-bold text-dark">
                      <div className="d-flex align-items-center gap-2">
                        <span className="material-symbols-outlined text-muted fs-6">{row.icon}</span>
                        <span>{row.factor}</span>
                      </div>
                    </td>
                    <td className="text-center">
                      <span className="comparison-badge-open">{row.openField}</span>
                    </td>
                    <td className="text-center bg-success bg-opacity-10">
                      <span className="comparison-badge-greenhouse">{row.greenhouse}</span>
                    </td>
                    <td className="font-mono text-success fw-semibold">
                      <span className="d-flex align-items-center gap-1">
                        <span className="material-symbols-outlined text-success fs-6">check_circle</span>
                        <span>{row.gain}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <div className="mt-3 pt-2 text-xxs text-secondary d-flex flex-wrap justify-content-between align-items-center gap-2 border-top border-secondary-subtle">
            <span>
              * Rendimiento a campo abierto basado en promedio histórico de Cuara y Tintorero (fuente: registros agronómicos locales).
            </span>
            <span className="font-mono text-dark fw-bold">
              Base de cálculo: 2.500 plántulas Magistral · Espaldar Hortomalla · Fertirriego AIFA
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
};
export default FunnelAgronomicBenefits;
