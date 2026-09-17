# Rediseño Estratégico del Plan de Fertirriego (Alta Frecuencia / Pulsos Cortos)

El clima semiárido de Quíbor presenta tasas altas de evapotranspiración (ET₀ 4.8 - 6.2 mm/día). Un riego diario único satura el suelo (causando percolación profunda y pérdida de nutrientes) y expone agua libre a la evaporación superficial. El rediseño propone **riegos cortos y frecuentes (pulsos)** a lo largo del día, ajustados a la capacidad de retención del bulbo húmedo y al consumo en tiempo real de la planta.

## Proposed Changes

## Viabilidad Agronómica (Investigación Reciente)
La investigación científica y las prácticas comerciales actuales respaldan fuertemente el riego por pulsos de alta frecuencia para pimentón en invernadero:
- **Estabilidad del Bulbo Húmedo:** El pimentón es altamente sensible al estrés hídrico; los pulsos mantienen niveles constantes de humedad que evitan la pudrición apical (blossom-end rot) y deformación de frutos.
- **Eficiencia y Nutrición:** Reduce significativamente la percolación profunda (lixiviación excesiva). Mantener pulsos continuos permite sostener la Conductividad Eléctrica (CE) óptima sin picos de salinidad.
- **Requisitos Técnicos:** Exige el uso de goteros autocompensantes y antidrenantes (No-Leak) para asegurar que el caudal (ej. 1.6 L/h) arranque y se detenga de manera uniforme en toda la cinta de riego.
- **Evaporación y Clima:** En climas de alta radiación como Quíbor, sincronizar los pulsos con las horas de mayor insolación (11 AM - 3 PM) maximiza la transpiración útil y previene pérdidas por evaporación directa.

---

### 1. Modelado Agronómico: Pulsos y Evaporación
- **Fraccionamiento del Riego:** En lugar de aplicar el 100% de la lámina diaria en un evento, se dividirá en **3 a 6 pulsos diarios** dependiendo de la etapa fenológica y la demanda evaporativa pico (11:00 AM a 3:00 PM).
- **Inyección Continua (Fertirriego Constante):** La fertilización hidrosoluble se dosificará proporcionalmente en cada pulso de riego (inyección proporcional), manteniendo la Conductividad Eléctrica (CE) constante en el bulbo húmedo y evitando picos de salinidad.
- **Tiempos de Pulso:** Considerando goteros de 1.6 L/h, los pulsos durarán entre **8 y 25 minutos** para evitar que el agua baje de los 40 cm de profundidad radical efectiva.

---

### 2. Modificaciones al Core (Types & Lógica)

#### [MODIFY] [agronomy.ts](file:///c:/VS%20CODE/CODIGO/Invernadero/src/core/types/agronomy.ts)
- Extender la interfaz `IrrigationStage` para incluir:
  - `dailyPulses` (número de riegos al día).
  - `pulseDurationMinutes` (duración exacta de cada pulso).
  - `pulseVolumeLiters` (litros por planta por pulso).
  - `fertigationStrategy` (descripción del abonado).

#### [MODIFY] [fao56.ts](file:///c:/VS%20CODE/CODIGO/Invernadero/src/core/agronomy/fao56.ts)
- Actualizar `calculateFao56IrrigationStages` para recibir parámetros como el caudal del gotero (1.6 L/h por defecto) e integrar la lógica de cálculo de pulsos diarios según el volumen bruto.
- Limitar el tiempo máximo de riego por pulso para evitar que exceda la capacidad de campo teórica del suelo aluvial.

---

### 3. Modificaciones a la Interfaz de Usuario (UI)

#### [MODIFY] [FunnelTechEvidence.tsx](file:///c:/VS%20CODE/CODIGO/Invernadero/src/features/landing/components/funnel/FunnelTechEvidence.tsx)
- En la pestaña "FAO-56", cambiar el enfoque visual de "Lámina Semanal" a "Estrategia Diaria de Pulsos".
- Mostrar claramente el número de riegos diarios y los minutos por riego para cada etapa del cultivo de pimentón.

#### [MODIFY] [IrrigationSchedule.tsx](file:///c:/VS%20CODE/CODIGO/Invernadero/src/features/cockpit/modules/fertirriego/IrrigationSchedule.tsx)
- Actualizar la tabla del Cockpit Agronómico para que el mayordomo de campo pueda ver exactamente cuántos riegos dar, de qué duración y con qué volumen por planta en cada semana del ciclo de 20 semanas.
- Incorporar una advertencia sobre la inyección de fertilizantes fraccionada.

## User Review Required

> [!IMPORTANT]
> **Definición de Goteros y Caudal**
> Para el cálculo de los minutos exactos por riego, asumiré un sistema de **cinta de goteo con goteros autocompensantes de 1.6 L/h a 40 cm de separación**. ¿Confirmas este caudal para los cálculos matemáticos de duración, o deseas utilizar un caudal distinto (ej. 1.0 L/h o 2.0 L/h)?

> [!TIP]
> Al aplicar fertilizantes en cada uno de estos pulsos, evitamos lixiviación y garantizamos que la planta siempre tenga comida a demanda. ¿Apruebas este enfoque de inyección continua para el plan?
