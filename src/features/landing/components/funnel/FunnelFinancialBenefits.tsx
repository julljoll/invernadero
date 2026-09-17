import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Slider } from '../../../../shared/components/Slider';

export const FunnelFinancialBenefits: React.FC = () => {
  // 1. Modificador de Kilos por Planta (mata) - Opciones solicitadas: 2kg, 3kg, 4kg, 5kg
  const [yieldPerPlantKg, setYieldPerPlantKg] = useState<number>(5.0);

  // 2. Precio por cesta de 20 kg (puerta de invernadero)
  const [basketPrice, setBasketPrice] = useState<number>(15.00);

  // Parámetros fijos validados
  const totalPlants = 2500;
  const totalKg = totalPlants * yieldPerPlantKg;
  const basketsCount = Math.round(totalKg / 20); // Cestas de 20 kg
  const pricePerKg = basketPrice / 20;

  // Costos e Inversión
  const operationalCosts = 3170; // Costos con agua por cisternas (10.000L) y ahorro en mano de obra
  const initialCapitalInvestment = 5195; // Malla instalada + Riego + Semilla + Pintura + Espalderas

  // Métricas dinámicas
  const grossRevenue = basketsCount * basketPrice;
  const netProfit = Math.max(0, grossRevenue - operationalCosts);
  const netProfitAfterTotalCapex = netProfit - initialCapitalInvestment;
  const roiCycle1 = (netProfit / initialCapitalInvestment) * 100;

  // Opciones de Kilos por Mata
  const yieldOptions = [
    {
      kg: 2.0,
      label: '2 kg / mata',
      badge: 'Manejo Mínimo',
      desc: '5.000 kg (250 cestas)',
      note: 'Estrés hídrico o virosis parcial'
    },
    {
      kg: 3.0,
      label: '3 kg / mata',
      badge: 'Media Regional',
      desc: '7.500 kg (375 cestas)',
      note: 'Protegido sin espaldar'
    },
    {
      kg: 4.0,
      label: '4 kg / mata',
      badge: 'Buen Manejo',
      desc: '10.000 kg (500 cestas)',
      note: 'Tecnificado estándar'
    },
    {
      kg: 5.0,
      label: '5 kg / mata',
      badge: 'Óptimo AIFA',
      desc: '12.500 kg (625 cestas)',
      note: 'Sistema Español + Hidrosolubles',
      recommended: true
    },
  ];

  // 8 Opciones de Precio por Cesta (20 kg) solicitadas: $6, $10, $12, $13, $14, $15, $20, $30
  const priceOptions = [
    { price: 6, label: '$6', sub: '$0.30/kg', desc: 'Sobreoferta' },
    { price: 10, label: '$10', sub: '$0.50/kg', desc: 'Mercado Bajo' },
    { price: 12, label: '$12', sub: '$0.60/kg', desc: 'Conservador' },
    { price: 13, label: '$13', sub: '$0.65/kg', desc: 'Medio-Bajo' },
    { price: 14, label: '$14', sub: '$0.70/kg', desc: 'Media Quíbor' },
    { price: 15, label: '$15', sub: '$0.75/kg', desc: 'Base Auditada', recommended: true },
    { price: 20, label: '$20', sub: '$1.00/kg', desc: 'Alta Demanda' },
    { price: 30, label: '$30', sub: '$1.50/kg', desc: 'Pico Escasez' },
  ];


  const investmentItems = [
    { item: '5 Rollos Malla 50 mesh 130 gsm (instalada en estructura y guayas existentes)', cost: 3000 },
    { item: 'Pintura de fondo (1 cuñete para mantenimiento de la estructura metálica)', cost: 120 },
    { item: 'Riego: Cinta de goteo, bolsa conectores iniciales y filtro de disco', cost: 450 },
    { item: 'Semillas / Plántulas certificadas Pimentón Magistral F1', cost: 625 },
    { item: 'Malla Espaldera Biorientada (Sistema Español a 2.20 m)', cost: 350 },
    { item: 'Insumos Iniciales: Fertirriego Hidrosoluble', cost: 650 },
  ];

  const operationalItems = [
    { item: 'Nutrición semanal con sales hidrosolubles de alta pureza (20 semanas)', cost: 650 },
    { item: 'Bioinsumos y productos de banda verde (cero residuos tóxicos)', cost: 300 },
    { item: 'Mano de obra (Sistema Español sin poda, 75% ahorro) y cosecha', cost: 185 },
    { item: 'Agua por cisternas: 74 a 75 viajes de 10.000 L (740.000 L demanda total del ciclo a $25/viaje)', cost: 1850 },
    { item: 'Consumibles de cosecha (cestas, hilo de amarre y embalaje)', cost: 100 },
    { item: 'Fondo de imprevistos técnicos y amortización menor (5%)', cost: 85 },
  ];

  const timelineSteps = [
    {
      week: 'Sem 1',
      title: 'Transplante',
      desc: '2.500 plántulas Magistral en camellones dobles a 2.5 pl/m².'
    },
    {
      week: 'Sem 4',
      title: 'Tutorado',
      desc: 'Soporte con malla (Sistema Español sin poda, -75% mano de obra).'
    },
    {
      week: 'Sem 8',
      title: 'Floración',
      desc: 'Cuajado masivo de flores. VPD regulado a 0.8–1.2 kPa.'
    },
    {
      week: 'Sem 13',
      title: '1ª Cosecha',
      desc: 'Primer corte de pimentones Lujo Grande (>220g) a puerta finca.'
    },
    {
      week: 'Sem 16',
      title: 'Pico Cosecha',
      desc: `Volumen pico proporcional a ${yieldPerPlantKg} kg/planta.`
    },
    {
      week: 'Sem 20',
      title: 'Cierre Ciclo',
      desc: `${totalKg.toLocaleString()} kg completados (${basketsCount} cestas). Liquidación.`
    }
  ];

  return (
    <section id="financiero" className="py-5 border-top border-secondary-subtle bg-light">
      <Container fluid="xl" className="py-3">
        {/* Encabezado */}
        <div className="text-center max-w-2xl mx-auto mb-5">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-success bg-opacity-10 border border-success border-opacity-25 text-success text-xs fw-bold text-uppercase mb-2">
            <span className="material-symbols-outlined ms-sm">payments</span>
            <span>Retorno Financiero &amp; Rentabilidad Auditada</span>
          </div>
          <h2 className="display-6 fw-bold text-dark mb-2">
            Simulador de Rentabilidad: Pimentón Magistral 1.000 m²
          </h2>
          <p className="text-secondary small max-w-xl mx-auto">
            Proyección real basada en <strong>2.500 plantas</strong>, con selector de rendimiento (kilos por mata) y precio por cesta de 20 kg a puerta de finca en Quíbor.
          </p>

          {/* Chips de selección rápida de precios por cesta */}
          <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
            {priceOptions.map((opt) => {
              const isSelected = basketPrice === opt.price;
              return (
                <button
                  key={opt.price}
                  type="button"
                  className={`scenario-chip ${isSelected ? 'active' : ''}`}
                  onClick={() => setBasketPrice(opt.price)}
                >
                  <span className="font-mono">{opt.label}</span>
                  <span className="text-xxs opacity-75">({opt.sub})</span>
                  {opt.recommended && (
                    <span className="badge bg-success text-white ms-1 p-0.5" style={{ fontSize: '0.6rem' }}>
                      Base
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Fila del Simulador Interactivo */}
        <Row className="g-4 align-items-stretch mb-5">
          {/* Columna Izquierda: Modificadores (Kilos por mata + Precio por cesta) */}
          <Col xs={12} lg={6}>
            <Card className="card-agro p-4 h-100 shadow-sm border bg-white d-flex flex-column justify-content-between">
              <div>
                {/* 1. MODIFICADOR DE KILOS POR PLANTA (SOLICITADO) */}
                <div className="mb-4 pb-3 border-bottom border-secondary-subtle">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h3 className="fs-6 fw-bold text-dark m-0 d-flex align-items-center gap-2">
                      <span className="material-symbols-outlined text-success">scale</span>
                      <span>Rendimiento: Kilos por Mata / Planta</span>
                    </h3>
                    <Badge bg="success" className="font-mono text-xs px-2.5 py-1">
                      {yieldPerPlantKg.toFixed(1)} kg / planta
                    </Badge>
                  </div>

                  <p className="text-secondary text-xxs mb-3">
                    Selecciona el rendimiento esperado según el nivel de tecnificación y manejo agronómico:
                  </p>

                  {/* Cuadrícula de 4 Opciones: 2kg, 3kg, 4kg, 5kg */}
                  <Row className="g-2 mb-3">
                    {yieldOptions.map((opt) => {
                      const isSelected = yieldPerPlantKg === opt.kg;
                      return (
                        <Col xs={6} sm={3} key={opt.kg}>
                          <button
                            type="button"
                            onClick={() => setYieldPerPlantKg(opt.kg)}
                            className={`w-100 p-2.5 rounded-3 border text-start transition-all position-relative ${
                              isSelected
                                ? 'border-success bg-success bg-opacity-10 shadow-sm'
                                : 'border-secondary-subtle bg-white hover-bg-light'
                            }`}
                            style={{
                              borderWidth: isSelected ? '2px' : '1px',
                              cursor: 'pointer'
                            }}
                          >
                            {opt.recommended && (
                              <span 
                                className="badge bg-success text-white position-absolute top-0 end-0 translate-middle-y me-2 font-mono"
                                style={{ fontSize: '0.6rem' }}
                              >
                                Top
                              </span>
                            )}
                            <div className={`fw-bold font-mono text-xs ${isSelected ? 'text-success' : 'text-dark'}`}>
                              {opt.label}
                            </div>
                            <div className="text-xxs text-secondary font-mono mt-0.5">
                              {opt.desc}
                            </div>
                          </button>
                        </Col>
                      );
                    })}
                  </Row>

                  {/* Slider de ajuste fino de rendimiento */}
                  <Slider
                    label="Ajustar Rendimiento por Planta:"
                    value={yieldPerPlantKg}
                    min={2.0}
                    max={5.0}
                    step={0.5}
                    formatValue={(v) => `${v.toFixed(1)} kg / planta`}
                    accentColor="success"
                    iconName="psychiatry"
                    onChange={setYieldPerPlantKg}
                  />
                </div>

                {/* 2. MODIFICADOR DE PRECIO POR CESTA (SOLICITADO: $6, $10, $12, $13, $14, $15, $20, $30) */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h3 className="fs-6 fw-bold text-dark m-0 d-flex align-items-center gap-2">
                      <span className="material-symbols-outlined text-info">payments</span>
                      <span>Precio por Cesta de 20 kg (Puerta Finca)</span>
                    </h3>
                    <Badge bg="info" className="font-mono text-xs text-white px-2.5 py-1">
                      ${pricePerKg.toFixed(2)} USD / kg
                    </Badge>
                  </div>

                  <p className="text-secondary text-xxs mb-3">
                    Selecciona la cotización por cesta (20 kg) en puerta de invernadero según la época o demanda:
                  </p>

                  {/* Cuadrícula de las 8 Opciones de Precio: $6, $10, $12, $13, $14, $15, $20, $30 */}
                  <Row className="g-2 mb-3">
                    {priceOptions.map((opt) => {
                      const isSelected = basketPrice === opt.price;
                      return (
                        <Col xs={6} sm={3} key={opt.price}>
                          <button
                            type="button"
                            onClick={() => setBasketPrice(opt.price)}
                            className={`w-100 p-2 rounded-3 border text-start transition-all position-relative ${
                              isSelected
                                ? 'border-info bg-info bg-opacity-10 shadow-sm'
                                : 'border-secondary-subtle bg-white hover-bg-light'
                            }`}
                            style={{
                              borderWidth: isSelected ? '2px' : '1px',
                              cursor: 'pointer'
                            }}
                          >
                            {opt.recommended && (
                              <span 
                                className="badge bg-success text-white position-absolute top-0 end-0 translate-middle-y me-1 font-mono"
                                style={{ fontSize: '0.55rem' }}
                              >
                                Base
                              </span>
                            )}
                            <div className={`fw-bold font-mono text-xs ${isSelected ? 'text-info' : 'text-dark'}`}>
                              {opt.label}
                            </div>
                            <div className="text-xxs text-secondary font-mono mt-0.5" style={{ fontSize: '0.65rem' }}>
                              {opt.sub} · {opt.desc}
                            </div>
                          </button>
                        </Col>
                      );
                    })}
                  </Row>

                  {/* Slider de ajuste continuo desde $6 hasta $30 */}
                  <Slider
                    label="Ajuste Continuo de Precio por Cesta:"
                    value={basketPrice}
                    min={6.0}
                    max={30.0}
                    step={1.0}
                    formatValue={(v) => `$${v.toFixed(2)} USD / cesta`}
                    accentColor="info"
                    iconName="inventory_2"
                    onChange={setBasketPrice}
                  />
                </div>

                {/* Tabla resumen de parámetros reactivos */}
                <div className="p-3 bg-light rounded-3 border border-secondary-subtle text-xs">
                  <div className="d-flex justify-content-between py-1 border-bottom">
                    <span className="text-secondary">Población de Siembra:</span>
                    <strong className="font-mono text-dark">2.500 Plántulas Magistral F1</strong>
                  </div>
                  <div className="d-flex justify-content-between py-1 border-bottom">
                    <span className="text-secondary">Rendimiento Seleccionado:</span>
                    <strong className="font-mono text-success fw-bold">
                      {yieldPerPlantKg.toFixed(1)} kg / mata
                    </strong>
                  </div>
                  <div className="d-flex justify-content-between py-1 border-bottom">
                    <span className="text-secondary">Cosecha Total Proyectada:</span>
                    <strong className="font-mono text-dark">
                      {totalKg.toLocaleString()} kg ({(totalKg / 1000).toFixed(1)} Ton)
                    </strong>
                  </div>
                  <div className="d-flex justify-content-between py-1 border-bottom">
                    <span className="text-secondary">Cestas de 20 kg Obtenidas:</span>
                    <strong className="font-mono text-success fw-bold">
                      {basketsCount.toLocaleString()} Cestas
                    </strong>
                  </div>
                  <div className="d-flex justify-content-between py-1">
                    <span className="text-secondary">Costos Operativos (OPEX 5 meses):</span>
                    <strong className="font-mono text-danger">${operationalCosts.toLocaleString()} USD</strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-top d-flex justify-content-between align-items-center text-xxs text-secondary">
                <span className="d-flex align-items-center gap-1 font-mono">
                  <span className="material-symbols-outlined text-success fs-6">check</span>
                  <span>Datos vinculados en tiempo real con Cockpit Quíbor</span>
                </span>
                <Link to="/cockpit" className="text-success fw-bold text-decoration-none">
                  Ver plan de nutrición →
                </Link>
              </div>
            </Card>
          </Col>

          {/* Columna Derecha: Tarjeta de Retorno Financiero */}
          <Col xs={12} lg={6}>
            <Card className="card-agro border-success border-opacity-50 p-4 h-100 shadow-sm bg-white d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="badge bg-success bg-opacity-20 text-success rounded-pill font-monospace px-3 py-1 text-xs">
                    Liquidación del Ciclo (5 Meses)
                  </span>
                  <span className="badge bg-light text-dark border font-mono text-xs">
                    {basketsCount} Cestas @ ${basketPrice.toFixed(2)}
                  </span>
                </div>

                {/* Ingreso y Utilidad Reactivos */}
                <Row className="g-3 mb-3">
                  <Col xs={6}>
                    <div className="p-3 bg-light rounded-3 border">
                      <div className="text-secondary text-xs mb-1">Ingreso Bruto Total</div>
                      <div className="fs-4 fw-bold font-mono text-dark">
                        ${grossRevenue.toLocaleString()} <span className="fs-6 text-muted">USD</span>
                      </div>
                      <div className="text-xxs text-secondary font-mono">{basketsCount} cestas × ${basketPrice.toFixed(2)}</div>
                    </div>
                  </Col>

                  <Col xs={6}>
                    <div className="p-3 bg-light rounded-3 border">
                      <div className="text-secondary text-xs mb-1">Costos Operativos</div>
                      <div className="fs-4 fw-bold font-mono text-danger">
                        ${operationalCosts.toLocaleString()} <span className="fs-6 text-muted">USD</span>
                      </div>
                      <div className="text-xxs text-secondary font-mono">Hidrosolubles + MO + Luz</div>
                    </div>
                  </Col>
                </Row>

                {/* Utilidad Neta Destacada */}
                <div className="p-4 rounded-3 bg-success bg-opacity-10 border border-success border-opacity-30 mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="text-success text-xs fw-bold text-uppercase">
                        Utilidad Neta del Ciclo (5 Meses)
                      </div>
                      <div className="display-6 fw-bold font-mono text-success lh-1 mb-1">
                        ${netProfit.toLocaleString()} <span className="fs-6 text-dark font-sans fw-normal">USD</span>
                      </div>
                      <div className="text-secondary text-xxs">
                        Margen Operativo sobre Ingresos: <strong>{grossRevenue > 0 ? ((netProfit / grossRevenue) * 100).toFixed(1) : 0}%</strong>
                      </div>
                    </div>

                    <div className="text-end">
                      <div className="badge bg-success text-white font-mono fs-4 px-3 py-2 rounded-pill shadow-sm">
                        +{roiCycle1.toFixed(0)}% ROI
                      </div>
                      <div className="text-secondary text-xxs mt-1">Sobre Inversión Inicial</div>
                    </div>
                  </div>
                </div>

                {/* Explicación de amortización y rendimiento */}
                <div className="p-2.5 rounded-3 bg-light border text-xxs text-secondary font-mono mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-dark fw-bold">Rendimiento Evaluado:</span>
                    <span className="text-success fw-bold">{yieldPerPlantKg.toFixed(1)} kg / mata ({totalKg.toLocaleString()} kg total)</span>
                  </div>
                  <span className="text-dark fw-bold">Recuperación de Capital:</span> Con {yieldPerPlantKg} kg/planta y cesta a ${basketPrice.toFixed(2)}, el ciclo genera <strong>${netProfit.toLocaleString()} USD</strong> netos frente al CAPEX de ${initialCapitalInvestment.toLocaleString()} USD {netProfitAfterTotalCapex >= 0 ? `(excedente de +$${netProfitAfterTotalCapex.toLocaleString()} USD en el ciclo 1)` : `(recuperación del ${((netProfit / initialCapitalInvestment) * 100).toFixed(0)}% en ciclo 1)`}.
                </div>
              </div>

              <div>
                <a
                  href={`https://wa.me/584160000000?text=Hola%20Agrovenecua,%20revisé%20el%20simulador%20financiero%20de%20la%20casa%20de%20malla%20de%201.000m2%20para%20pimentón%20Magistral%20con%20rendimiento%20de%20${yieldPerPlantKg}kg/planta%20(${basketsCount}%20cestas)%20y%20precio%20de%20$${basketPrice.toFixed(2)}/cesta.%20Deseo%20conocer%20las%20condiciones%20para%20participar%20en%20el%20proyecto.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success btn-lg touch-target-48 w-100 rounded-pill fw-bold text-white d-flex align-items-center justify-content-center gap-2 shadow mb-2"
                  style={{
                    background: 'linear-gradient(135deg, #53C942 0%, #248a15 100%)',
                    border: 'none'
                  }}
                >
                  <span className="material-symbols-outlined ms-sm">handshake</span>
                  <span>Postular Capital para el Módulo de 1.000 m²</span>
                </a>

                <div className="text-center">
                  <span className="text-secondary text-xxs font-mono">
                    Ubicación satelital verificada: 9°53'20.0"N, 69°35'35.0"W · Valle de Quíbor, Lara
                  </span>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Cronograma Fenológico de las 20 Semanas del Ciclo */}
        <div className="card-agro p-4 border rounded-4 bg-white shadow-sm mb-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="fs-5 fw-bold text-dark m-0 d-flex align-items-center gap-2">
              <span className="material-symbols-outlined text-success">event_available</span>
              <span>Cronograma Productivo: 20 Semanas de Siembra a Liquidación</span>
            </h3>
            <Badge bg="light" text="dark" className="border font-mono text-xxs">
              5 Meses Calendario
            </Badge>
          </div>

          <div className="timeline-cycle-track d-none d-md-flex">
            {timelineSteps.map((step, idx) => (
              <div className="timeline-cycle-step" key={idx}>
                <div className="timeline-node">{step.week}</div>
                <div className="fw-bold text-dark text-xs mb-1">{step.title}</div>
                <div className="text-secondary text-xxs">{step.desc}</div>
              </div>
            ))}
          </div>

          {/* Versión móvil del timeline */}
          <div className="d-md-none">
            {timelineSteps.map((step, idx) => (
              <div className="d-flex gap-3 mb-3" key={idx}>
                <div className="timeline-node flex-shrink-0">{step.week}</div>
                <div>
                  <div className="fw-bold text-dark text-xs">{step.title}</div>
                  <div className="text-secondary text-xxs">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desglose Detallado de Costos: Inversión Inicial vs Costos Operativos */}
        <Row className="g-4">
          <Col xs={12} lg={6}>
            <Card className="card-agro p-4 border bg-white shadow-sm h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fs-6 fw-bold text-dark m-0 d-flex align-items-center gap-2">
                  <span className="material-symbols-outlined text-success">construction</span>
                  <span>Desglose de Inversión Inicial (CAPEX)</span>
                </h4>
                <Badge bg="success" className="font-mono text-xs px-2.5 py-1">
                  ${initialCapitalInvestment.toLocaleString()} USD
                </Badge>
              </div>

              <div className="table-responsive">
                <Table size="sm" hover className="text-xs align-middle mb-0">
                  <thead className="table-light font-mono">
                    <tr>
                      <th>Componente / Insumo</th>
                      <th className="text-end">Costo (USD)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investmentItems.map((item, idx) => (
                      <tr key={idx}>
                        <td className="text-secondary">{item.item}</td>
                        <td className="text-end font-mono fw-bold text-dark">${item.cost.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr className="table-light fw-bold">
                      <td>Total Inversión Inicial Módulo 1.000 m²</td>
                      <td className="text-end font-mono text-success">${initialCapitalInvestment.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </Card>
          </Col>

          <Col xs={12} lg={6}>
            <Card className="card-agro p-4 border bg-white shadow-sm h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fs-6 fw-bold text-dark m-0 d-flex align-items-center gap-2">
                  <span className="material-symbols-outlined text-danger">receipt_long</span>
                  <span>Costos Operativos del Ciclo (OPEX)</span>
                </h4>
                <Badge bg="danger" className="font-mono text-xs px-2.5 py-1">
                  ${operationalCosts.toLocaleString()} USD
                </Badge>
              </div>

              <div className="table-responsive">
                <Table size="sm" hover className="text-xs align-middle mb-0">
                  <thead className="table-light font-mono">
                    <tr>
                      <th>Rubro Operativo (5 Meses)</th>
                      <th className="text-end">Costo (USD)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {operationalItems.map((item, idx) => (
                      <tr key={idx}>
                        <td className="text-secondary">{item.item}</td>
                        <td className="text-end font-mono fw-bold text-dark">${item.cost.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr className="table-light fw-bold">
                      <td>Total Costos Operativos del Ciclo</td>
                      <td className="text-end font-mono text-danger">${operationalCosts.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>

              <div className="mt-3 p-2.5 rounded bg-light border border-secondary-subtle text-xxs text-secondary">
                <span className="fw-bold text-dark d-block mb-1">Nota Técnica sobre el Gasto de Agua:</span>
                Calculado mediante balance hídrico FAO-56 por pulsos cortos. Las 2.500 plantas demandan exactamente <strong>~740.000 Litros</strong> en 20 semanas, abastecidos con <strong>74 viajes de camiones cisterna de 10.000 L (+ 1 de reserva = 75 viajes)</strong> a $25 USD/viaje puesto en finca.
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
export default FunnelFinancialBenefits;
