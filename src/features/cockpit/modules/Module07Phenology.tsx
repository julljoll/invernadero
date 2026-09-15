import React, { useState, useMemo } from 'react';
import { Card, Row, Col, Badge, ProgressBar, Table, Button, Form } from 'react-bootstrap';
import { useAgroStore } from '../../../shared/store/useAgroStore';
import { calculatePhenologyGdd, CROP_THERMAL_SPECS } from '../../../core/agronomy/gdd';
import { CROPS_CATALOG } from '../../../core/constants/crops';
import { Slider } from '../../../shared/components/Slider';

export const Module07Phenology: React.FC = () => {
  const { selectedCrop, setSelectedCrop, transplantDateStr, setTransplantDateStr } = useAgroStore();
  const crop = CROPS_CATALOG[selectedCrop] || CROPS_CATALOG.pepper;
  const specs = CROP_THERMAL_SPECS[selectedCrop] || CROP_THERMAL_SPECS.pepper;

  // Calcular días transcurridos desde fecha de trasplante
  const calculatedDays = useMemo(() => {
    if (!transplantDateStr) return 35;
    const transplant = new Date(transplantDateStr).getTime();
    const now = Date.now();
    const diffDays = Math.max(1, Math.round((now - transplant) / (1000 * 60 * 60 * 24)));
    return Math.min(diffDays, specs.totalCycleDaysExpected + 30);
  }, [transplantDateStr, specs.totalCycleDaysExpected]);

  const [simDays, setSimDays] = useState<number>(calculatedDays);
  const [useCustomSlider, setUseCustomSlider] = useState<boolean>(false);

  const activeDays = useCustomSlider ? simDays : calculatedDays;
  const phenoResult = useMemo(() => {
    return calculatePhenologyGdd(selectedCrop, activeDays);
  }, [selectedCrop, activeDays]);

  const stageVariantMap: Record<string, string> = {
    establishment: 'info',
    vegetative: 'success',
    flowering: 'warning',
    fruiting: 'primary',
    harvest: 'success',
  };

  const stageWaterMap: Record<string, { kc: number; litersPlantWeek: number; dailyM3: number; pumpMinutes: number }> = {
    establishment: { kc: 0.50, litersPlantWeek: 8.4, dailyM3: 3.0, pumpMinutes: 25 },
    vegetative: { kc: 0.80, litersPlantWeek: 13.2, dailyM3: 4.7, pumpMinutes: 39 },
    flowering: { kc: 1.05, litersPlantWeek: 17.1, dailyM3: 6.1, pumpMinutes: 51 },
    fruiting: { kc: 1.15, litersPlantWeek: 21.0, dailyM3: 7.5, pumpMinutes: 62 },
    harvest: { kc: 1.10, litersPlantWeek: 19.0, dailyM3: 6.8, pumpMinutes: 56 },
  };
  const currentWater = stageWaterMap[phenoResult.currentStage] || stageWaterMap.flowering;

  return (
    <div className="module-phenology-view animate-agro-fade-in-up">
      {/* ====================================================================
          1. HEADER CONTEXTUAL DEL MÓDULO FENOLÓGICO
          ==================================================================== */}
      <Card className="card-agro mb-4 border-success border-opacity-25">
        <Card.Body className="p-4">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="badge rounded-pill bg-success bg-opacity-15 text-success border border-success border-opacity-30 text-xxs font-mono text-uppercase">
                  Bioclima NASA MERRA-2 · Quíbor
                </span>
                <span className="text-secondary text-xxs">Cálculo Baskerville-Emin</span>
              </div>
              <h3 className="fw-bold text-dark m-0 d-flex align-items-center gap-2">
                <span className="material-symbols-outlined text-success" style={{ fontSize: '1.75rem' }}>
                  calendar_clock
                </span>
                06. Fenología & Grados-Día de Desarrollo (GDD)
              </h3>
              <p className="text-secondary text-sm m-0 mt-1">
                Seguimiento del tiempo térmico acumulado para <strong className="text-dark">{crop.name}</strong> (<em>{crop.scientificName}</em>) para predecir floración, llenado de fruto y fecha exacta de cosecha.
              </p>
            </div>

            {/* Selector de Cultivo Rápido */}
            <div className="d-flex align-items-center gap-2 bg-light p-1.5 rounded-3 border">
              <span className="text-xxs fw-bold text-muted px-1 text-uppercase">Cultivo:</span>
              <Button
                variant={selectedCrop === 'pepper' ? 'success' : 'outline-secondary'}
                size="sm"
                className="py-1 px-3 fw-bold text-xs rounded-2"
                onClick={() => setSelectedCrop('pepper')}
              >
                Pimentón F1
              </Button>
              <Button
                variant={selectedCrop === 'tomato' ? 'success' : 'outline-secondary'}
                size="sm"
                className="py-1 px-3 fw-bold text-xs rounded-2"
                onClick={() => setSelectedCrop('tomato')}
              >
                Tomate Hilo Alto
              </Button>
            </div>
          </div>

          {/* Selector de Fecha de Trasplante & Simulador */}
          <Row className="g-3 align-items-end pt-3 border-top">
            <Col xs={12} md={4}>
              <Form.Group controlId="transplantDateInput">
                <Form.Label className="text-xs fw-bold text-secondary mb-1 d-flex align-items-center gap-1">
                  <span className="material-symbols-outlined ms-sm text-success">event_available</span>
                  Fecha Real de Trasplante en Nave
                </Form.Label>
                <Form.Control
                  type="date"
                  value={transplantDateStr}
                  onChange={(e) => {
                    setTransplantDateStr(e.target.value);
                    setUseCustomSlider(false);
                  }}
                  className="font-mono text-sm touch-target-48"
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={5}>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="text-xs fw-bold text-secondary">
                  Días Transcurridos: <strong className="text-dark font-mono">{activeDays} días</strong>
                </span>
                <span className="text-xxs text-muted font-mono">
                  Ciclo: {specs.totalCycleDaysExpected} días
                </span>
              </div>
              <Slider
                label="Días desde Trasplante:"
                min={1}
                max={specs.totalCycleDaysExpected + 20}
                step={1}
                value={activeDays}
                onChange={(val) => {
                  setSimDays(val);
                  setUseCustomSlider(true);
                }}
                unit=" días"
              />
            </Col>

            <Col xs={12} md={3}>
              {useCustomSlider ? (
                <div className="p-2 bg-warning bg-opacity-10 border border-warning border-opacity-25 rounded-3 text-center">
                  <span className="text-xxs fw-bold text-warning-emphasis d-block text-uppercase">
                    Simulación Manual Activa
                  </span>
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 text-xs text-primary font-mono"
                    onClick={() => {
                      setUseCustomSlider(false);
                      setSimDays(calculatedDays);
                    }}
                  >
                    Volver a fecha real ({calculatedDays}d)
                  </Button>
                </div>
              ) : (
                <div className="p-2 bg-success bg-opacity-10 border border-success border-opacity-25 rounded-3 text-center">
                  <span className="text-xxs fw-bold text-success d-block text-uppercase">
                    Sincronizado con Campo
                  </span>
                  <span className="text-xs font-mono text-dark fw-bold">
                    Día #{activeDays} en Curso
                  </span>
                </div>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* ====================================================================
          2. CARDS DE KPIS FENOLÓGICOS PRINCIPALES
          ==================================================================== */}
      <Row className="g-3 mb-4">
        <Col xs={12} sm={6} lg={3}>
          <Card className="card-agro h-100 p-3">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-xxs text-uppercase fw-bold text-muted">Tiempo Térmico</span>
              <span className="material-symbols-outlined text-warning">sunny</span>
            </div>
            <div className="d-flex align-items-baseline gap-1">
              <span className="text-dark fw-bold font-mono" style={{ fontSize: '1.85rem' }}>
                {phenoResult.accumulatedGdd}
              </span>
              <span className="text-secondary text-xs font-mono">GDD (°C·d)</span>
            </div>
            <span className="text-xxs text-muted mt-1">
              Meta ciclo: {specs.totalCycleGdd} GDD
            </span>
            <ProgressBar
              now={phenoResult.totalCycleProgressPct}
              variant="warning"
              className="mt-2"
              style={{ height: '6px' }}
            />
          </Card>
        </Col>

        <Col xs={12} sm={6} lg={3}>
          <Card className="card-agro h-100 p-3">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-xxs text-uppercase fw-bold text-muted">Etapa Actual</span>
              <Badge bg={stageVariantMap[phenoResult.currentStage] || 'success'} className="text-xxs">
                {phenoResult.stageProgressPct}% avance
              </Badge>
            </div>
            <h6 className="fw-bold text-dark text-truncate mb-1" title={phenoResult.currentStageLabel}>
              {phenoResult.currentStageLabel.replace(/^[IVX]+\.\s*/, '')}
            </h6>
            <span className="text-xxs text-secondary">
              Próximo hito: {phenoResult.daysToNextStage > 0 ? `en ${phenoResult.daysToNextStage} días` : 'Etapa Final'}
            </span>
            <ProgressBar
              now={phenoResult.stageProgressPct}
              variant="success"
              className="mt-2"
              style={{ height: '6px' }}
            />
          </Card>
        </Col>

        {/* Demanda Hídrica & Pozo según Fase */}
        <Col xs={12} sm={6} lg={3}>
          <Card className="card-agro h-100 p-3 border-primary border-opacity-30">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-xxs text-uppercase fw-bold text-primary">Demanda Pozo FAO-56</span>
              <span className="material-symbols-outlined text-primary">water_drop</span>
            </div>
            <div className="d-flex align-items-baseline gap-1">
              <span className="text-primary fw-bold font-mono" style={{ fontSize: '1.85rem' }}>
                {currentWater.dailyM3}
              </span>
              <span className="text-secondary text-xs">m³/día</span>
            </div>
            <span className="text-xxs text-muted mt-1">
              Kc actual: <strong>{currentWater.kc}</strong> ({currentWater.litersPlantWeek} L/pl/sem)
            </span>
            <div className="d-flex align-items-center gap-1 mt-2 text-xxs text-success fw-bold">
              <span className="material-symbols-outlined ms-sm">timer</span>
              <span>Bombeo: {currentWater.pumpMinutes} min/día (2.0 L/s)</span>
            </div>
          </Card>
        </Col>

        <Col xs={12} sm={6} lg={3}>
          <Card className="card-agro h-100 p-3">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-xxs text-uppercase fw-bold text-muted">Cosecha Comercial</span>
              <span className="material-symbols-outlined text-success">local_shipping</span>
            </div>
            <div className="d-flex align-items-baseline gap-1">
              <span className="text-dark fw-bold font-mono" style={{ fontSize: '1.85rem' }}>
                {phenoResult.projectedHarvestDateDays}
              </span>
              <span className="text-secondary text-xs">días rest.</span>
            </div>
            <span className="text-xxs text-muted mt-1">
              Proyección a {specs.totalCycleDaysExpected} días totales
            </span>
            <div className="d-flex align-items-center gap-1 mt-2 text-xxs text-success fw-bold">
              <span className="material-symbols-outlined ms-sm">check_circle</span>
              <span>13 Toneladas esperadas</span>
            </div>
          </Card>
        </Col>

        <Col xs={12} sm={6} lg={3}>
          <Card className="card-agro h-100 p-3">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-xxs text-uppercase fw-bold text-muted">Confort Fisiológico</span>
              <span className="material-symbols-outlined text-info">thermostat</span>
            </div>
            <div className="d-flex align-items-baseline gap-1">
              <span className="text-dark fw-bold font-mono" style={{ fontSize: '1.6rem' }}>
                {specs.baseTempC}°C
              </span>
              <span className="text-secondary text-xs">T. Base</span>
            </div>
            <span className="text-xxs text-secondary mt-1">
              Rango óptimo: {specs.optMinTempC} - {specs.optMaxTempC}°C
            </span>
            <div className="mt-2">
              <Badge bg="success" className="bg-opacity-15 text-success border border-success border-opacity-30 text-xxs font-mono">
                Cutoff Térmico: {specs.cutoffTempC}°C
              </Badge>
            </div>
          </Card>
        </Col>
      </Row>

      {/* ALERTA AGRONÓMICA: ABORTO FLORAL TÉRMICO (>32°C) */}
      <Card className="card-agro mb-4 p-3 bg-danger bg-opacity-10 border border-danger border-opacity-30">
        <div className="d-flex align-items-start gap-3">
          <span className="material-symbols-outlined text-danger fs-4 mt-0.5">heat</span>
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <h5 className="fs-6 fw-bold text-danger mb-0">
                Alerta Fisiológica Quíbor: Riesgo de Aborto Floral Térmico (&gt;32 °C)
              </h5>
              <Badge bg="danger" className="text-3xs">
                Termo-sensibilidad Floral
              </Badge>
            </div>
            <p className="text-dark text-xs mb-2 font-sans">
              En <em>Capsicum annuum</em> y tomate indeterminado, cuando la temperatura foliar supera los <strong>32 °C</strong> durante la fase de floración, el pistilo (estilo) sufre una elongación anormal que sobrepasa los estambres, impidiendo el contacto con el grano de polen. Adicionalmente, por encima de <strong>34 °C</strong> la viabilidad del polen colapsa en un 50-70%, produciendo caída masiva de flores y frutos partenocárpicos deformes ("micro-pimientos").
            </p>
            <div className="p-2 bg-white rounded border border-danger border-opacity-25 text-2xs">
              <strong className="text-danger-emphasis">Protocolo Anti-Aborto en Quíbor:</strong>{' '}
              <span>1) Garantizar altura cenital ≥ 5.5 m con 8 extractores eólicos activos (disipación convectiva). 2) Microaspersión de niebla (fogging) entre las 11:30 y 14:00 hrs para abatir 2-3 °C la temperatura de canopia. 3) Mantener aporte de Boro quelatado (0.15 kg/sem) para viabilidad del tubo polínico.</span>
            </div>
          </div>
        </div>
      </Card>

      {/* ====================================================================
          3. LÍNEA TEMPORAL DE AVANCE FENOLÓGICO (TIMELINE INTERACTIVO)
          ==================================================================== */}
      <Card className="card-agro mb-4 p-4">
        <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
          <span className="material-symbols-outlined text-success">timeline</span>
          Línea de Tiempo del Ciclo Biológico & Demanda Hídrica en Quíbor
        </h5>

        <div className="position-relative mb-4">
          <ProgressBar style={{ height: '14px', borderRadius: '10px' }}>
            <ProgressBar
              now={phenoResult.totalCycleProgressPct}
              variant="success"
              key={1}
              className="progress-bar-striped progress-bar-animated"
            />
          </ProgressBar>
        </div>

        <Row className="g-2 text-center">
          <Col xs={12} sm className={`p-2 rounded-3 ${phenoResult.currentStage === 'establishment' ? 'bg-success bg-opacity-10 border border-success' : 'bg-light'}`}>
            <span className="text-xxs fw-bold text-muted text-uppercase d-block">I. Enraizamiento</span>
            <strong className="text-xs text-dark font-mono">0 - {specs.stageGddThresholds.establishment} GDD</strong>
            <span className="text-xxs text-primary d-block mt-0.5">Kc 0.50 · 3.0 m³/d</span>
            <span className="text-3xs text-muted d-block">25 min bombeo</span>
          </Col>
          <Col xs={12} sm className={`p-2 rounded-3 ${phenoResult.currentStage === 'vegetative' ? 'bg-success bg-opacity-10 border border-success' : 'bg-light'}`}>
            <span className="text-xxs fw-bold text-muted text-uppercase d-block">II. Vegetativo</span>
            <strong className="text-xs text-dark font-mono">{specs.stageGddThresholds.establishment} - {specs.stageGddThresholds.vegetative} GDD</strong>
            <span className="text-xxs text-primary d-block mt-0.5">Kc 0.80 · 4.7 m³/d</span>
            <span className="text-3xs text-muted d-block">39 min bombeo</span>
          </Col>
          <Col xs={12} sm className={`p-2 rounded-3 ${phenoResult.currentStage === 'flowering' ? 'bg-success bg-opacity-10 border border-success' : 'bg-light'}`}>
            <span className="text-xxs fw-bold text-muted text-uppercase d-block">III. Floración</span>
            <strong className="text-xs text-dark font-mono">{specs.stageGddThresholds.vegetative} - {specs.stageGddThresholds.flowering} GDD</strong>
            <span className="text-xxs text-warning-emphasis d-block mt-0.5 fw-bold">Kc 1.05 · 6.1 m³/d</span>
            <span className="text-3xs text-danger d-block">⚠️ Riesgo aborto &gt;32°</span>
          </Col>
          <Col xs={12} sm className={`p-2 rounded-3 ${phenoResult.currentStage === 'fruiting' ? 'bg-success bg-opacity-10 border border-success' : 'bg-light'}`}>
            <span className="text-xxs fw-bold text-muted text-uppercase d-block">IV. Llenado</span>
            <strong className="text-xs text-dark font-mono">{specs.stageGddThresholds.flowering} - {specs.stageGddThresholds.fruiting} GDD</strong>
            <span className="text-xxs text-success d-block mt-0.5 fw-bold">Kc 1.15 · 7.5 m³/d</span>
            <span className="text-3xs text-muted d-block">62 min bombeo pico</span>
          </Col>
          <Col xs={12} sm className={`p-2 rounded-3 ${phenoResult.currentStage === 'harvest' ? 'bg-success bg-opacity-10 border border-success' : 'bg-light'}`}>
            <span className="text-xxs fw-bold text-muted text-uppercase d-block">V. Cosecha Plena</span>
            <strong className="text-xs text-dark font-mono">{specs.stageGddThresholds.fruiting} - {specs.totalCycleGdd} GDD</strong>
            <span className="text-xxs text-primary d-block mt-0.5">Kc 1.10 · 6.8 m³/d</span>
            <span className="text-3xs text-muted d-block">56 min bombeo</span>
          </Col>
        </Row>
      </Card>

      {/* ====================================================================
          4. CALENDARIO DE ACCIÓN AGRONÓMICA SEGÚN ETAPA
          ==================================================================== */}
      <Card className="card-agro p-4">
        <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
          <span className="material-symbols-outlined text-success">checklist</span>
          Directivas Operativas para la Etapa Actual ({phenoResult.currentStageLabel})
        </h5>

        <Table responsive bordered hover className="align-middle text-sm mb-0">
          <thead className="table-light text-secondary text-xxs text-uppercase">
            <tr>
              <th>Área Operativa</th>
              <th>Directiva Clave en Campo</th>
              <th>Insumo / Acción</th>
              <th>Parámetro de Control</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 text-xxs font-mono">
                  💧 Fertirriego
                </span>
              </td>
              <td className="fw-semibold">
                {phenoResult.currentStage === 'establishment' && 'Riegos frecuentes y cortos para mantener humedad de bulbo sin lixiviar enraizadores.'}
                {phenoResult.currentStage === 'vegetative' && 'Elevar aporte de Nitrógeno y Magnesio para formación de área foliar vigorosa.'}
                {phenoResult.currentStage === 'flowering' && 'Incrementar Fósforo y Boro foliar para viabilidad polínica y cuajado.'}
                {phenoResult.currentStage === 'fruiting' && 'Pico de demanda de Potasio (K2O) y Calcio solubilizado para engorde de pared celular.'}
                {phenoResult.currentStage === 'harvest' && 'Mantener relación K/N en 2.2 y sostener fracción de lavado para evitar salinidad.'}
              </td>
              <td className="font-mono text-xs">
                {phenoResult.currentStage === 'establishment' && 'Ácido Fosfórico + Calcio'}
                {phenoResult.currentStage === 'vegetative' && 'Nitrato de Calcio + Sulfato Mg'}
                {phenoResult.currentStage === 'flowering' && 'MKP (0-52-34) + Boro Quelatado'}
                {phenoResult.currentStage === 'fruiting' && 'Nitrato Potasio + AIFA Ca'}
                {phenoResult.currentStage === 'harvest' && 'Sulfato Potásico + Ácido Nítrico'}
              </td>
              <td className="font-mono text-xs text-success fw-bold">
                {phenoResult.currentStage === 'establishment' && 'CE: 1.2 - 1.4 dS/m'}
                {phenoResult.currentStage === 'vegetative' && 'CE: 1.5 - 1.8 dS/m'}
                {phenoResult.currentStage === 'flowering' && 'CE: 1.8 - 2.1 dS/m'}
                {phenoResult.currentStage === 'fruiting' && 'CE: 2.2 - 2.4 dS/m'}
                {phenoResult.currentStage === 'harvest' && 'CE: 2.0 - 2.2 dS/m'}
              </td>
            </tr>
            <tr>
              <td>
                <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 text-xxs font-mono">
                  ☀️ Bioclima
                </span>
              </td>
              <td className="fw-semibold">
                Monitoreo del VPD foliar en horas pico (11:00 am - 2:00 pm).
              </td>
              <td>Ventilación Cenital + 8 Extractores Eólicos</td>
              <td className="font-mono text-xs text-warning fw-bold">VPD: 0.8 - 1.2 kPa</td>
            </tr>
            <tr>
              <td>
                <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 text-xxs font-mono">
                  🛡️ Fitosanidad
                </span>
              </td>
              <td className="fw-semibold">
                Revisión semanal de trampas cromotrópicas amarillas y envés foliar con lupa 20x.
              </td>
              <td>Rotación IRAC preventiva (Grupos 23, 28, 5)</td>
              <td className="font-mono text-xs text-danger fw-bold">&lt; 1 adulto / 5 trampas</td>
            </tr>
          </tbody>
        </Table>
      </Card>
    </div>
  );
};
