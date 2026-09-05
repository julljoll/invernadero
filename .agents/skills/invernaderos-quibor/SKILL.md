---
name: invernaderos-quibor
description: >-
  Especialista en diseño agronómico, cálculo bioclimático y dimensionamiento estructural de invernaderos y casas de malla en el Valle de Quíbor (Municipio Jiménez, Lara, Venezuela) para pimentón y tomate. Utiliza este skill cuando se requieran análisis microclimáticos, cálculos de ventilación y extractores eólicos, diseño estructural (alturas, cargas de viento, tensores), selección de mallas anti-insectos, tablas fitosanitarias (IPM) o programas de fertirriego FAO-56 adaptados a aguas salinas de pozo.
---

# Especialista en Invernaderos y Casas de Malla — Valle de Quíbor

Este skill dota al agente del marco conceptual, ecuaciones de ingeniería y parámetros bioclimáticos verificados para el diseño, dimensionamiento y gestión de cultivos protegidos en Quíbor, Lara.

## Procedimientos Clave de Consulta y Cálculo

### 1. Climatología de Quíbor y Dinámica de Vientos
Para consultar datos mensuales de radiación, temperatura, precipitación, días bochornosos y perfil de viento:
*   Ver referencia detallada en [clima_quibor.md](./references/clima_quibor.md).
*   **Regla de Capa Límite:** Para estimar la velocidad del viento $v(z)$ a una altura de montaje $z$ respecto a los datos estándar a 10 m ($v_{10}$):
    $$v(z) = v_{10} \left(\frac{z}{10}\right)^{0.16}$$
    *A 2.5 m: $v(2.5) \approx 0.80 \times v_{10}$. A 5.5 m: $v(5.5) \approx 0.91 \times v_{10}$. A 7.0 m: $v(7.0) \approx 0.94 \times v_{10}$.*

### 2. Dimensionamiento de Ventilación y Extractores Eólicos
Para evaluar la renovación de aire (RAH) y la física de extractores eólicos:
*   Ver referencia completa en [ventilacion_extractores.md](./references/ventilacion_extractores.md).
*   **Fórmula TurboExtractor (turbina 420 mm / 17"):**
    $$Q\ (\text{m}^3/\text{h}) = (0.818 + 0.0303 \times A) \times (121.5 + 103.4 \times V + 11.6 \times G + 5.6 \times T)$$
    *Donde $A$ es altura de montaje (m), $V$ velocidad del viento (km/h), $G$ gradiente térmico interior-exterior (°C) y $T$ temperatura media regional (°C).*
*   **Criterio de Diseño:** No sustituir volumen por extractores. En casas de malla de 1.000 m², la ventilación perimetral porosa ($A_{vent} \ge 20\%$) es la vía principal, y se instalan de 7 a 10 extractores eólicos cenitales (24"-30") para horas de calma térmica.

### 3. Matriz Fitosanitaria y Selección de Malla Anti-Insectos
Para determinar la permeabilidad de malla y el programa integrado de control de plagas:
*   Ver matriz completa en [plagas_malla_ipm.md](./references/plagas_malla_ipm.md).
*   **Malla Estándar:** 50×25 hilos/pulgada HDPE monofilamento ($\le 192\ \mu\text{m}$).
*   **Monitoreo y Alerta Crítica:**
    *   *Trips y Mosca Blanca:* Controlados por barrera física 50×25 y trampas cromotrópicas (azules para trips, amarillas para mosca/pulgón/minador).
    *   *Ácaros (Araña roja y Ácaro blanco):* No retenidos por la malla. Requieren control biológico (*Phytoseiulus*, *Amblyseius*) y control de humedad relativa.

### 4. Programa de Riego FAO-56 y Manejo de Salinidad
Para determinar los requerimientos hídricos por fenología y la fracción de lavado:
*   Ver tabla y coeficientes en [riego_fao56_salinidad.md](./references/riego_fao56_salinidad.md).
*   **Curva de Demanda:** Desde 7-9 L/planta/semana en trasplante hasta 17-20 L/planta/semana en fructificación pico (marzo-abril).
*   **Factor Salinidad de Pozo ($LF$):** Incrementar la lámina entre 15% y 25% según conductividad del agua ($EC_w$).

### 5. Estructura y Geometría de 1.000 m² / 2.000 m²
Para detalles constructivos de la nave de parral plano tensado con guayas de acero (cero tubos en techo) modulada a rollos de 4m × 100m:
*   Ver especificaciones estructurales en [diseno_estructural_1000m2.md](./references/diseno_estructural_1000m2.md).
*   Altura de pilares a 3.80 m libre, tutorado con Malla Espaldera Biorientada (Hortomalla 15×15 cm) a 2.20 m con despunte apical (-88% mano de obra), 8 rollos totales (98.7% aprovechamiento).

### 6. Hidrogeología, Minería del Acuífero y Recarga Artificial (CIDIAT-ULA / SHYQ)
Para comprender la dinámica hidrogeológica del Valle de Quíbor y la justificación de la alta eficiencia hídrica:
*   Ver estudio formal en [hidrogeologia_acuifero_quibor.md](./references/hidrogeologia_acuifero_quibor.md) basado en Jégat, Mora, Hernández (CIDIAT-ULA), Alvarado, Massiah (SHYQ) y Terán (2012).
*   **Balance del Acuífero:** Extracción anual de 22 Mm³ vs recarga renovable de 17 Mm³ en los 90 km² críticos. **Sobreexplotación del 29%** ($5\text{ Mm}^3\text{/año}$ de déficit).
*   **Cono de Abatimiento Central:** Niveles freáticos que descendieron de 53 a 95 m (1963-1987) y alcanzan **546 msnm en el centro del valle** (25 m por debajo de la cota de salida a 571 msnm), induciendo salinización profunda ($EC_w \ge 1.2 - 2.0\text{ dS/m}$).
*   **Doble Escenario Operativo:**
    1.  *Escenario Actual (Pozo Profundo Abatido):* Requiere fracción de lavado $LF = 20\%$ y $22\text{ L/sem}$ de ácido nítrico para neutralizar bicarbonatos.
    2.  *Escenario Yacambú / Recarga Artificial ($1\text{ m}^3\text{/s}$ Visual MODFLOW):* Agua dulce andina ($EC_w \approx 0.5\text{ dS/m}$) que reduce el lavado a $LF = 6.5\%$ (ahorro de $2.6\text{ m}^3\text{/día}$ y 65% menos ácido).

### 7. Protocolo de Validación y Certificación de Pozo Profundo (2.000 m²)
Para validar la aptitud hidrogeológica, mecánica y química de un pozo en las coordenadas satelitales ($9^\circ 53' 20.0''\ \text{N},\ 69^\circ 35' 35.0''\ \text{W}$, ~700 msnm):
*   Ver protocolo maestro en [PLAN_VALIDACION_POZO_PROFUNDO_QUIBOR.md](../../../PLAN_VALIDACION_POZO_PROFUNDO_QUIBOR.md).
*   **Demanda Hídrica de Nave:** $15.75\text{ m}^3\text{/día}$ pico ($4.400\text{ plantas}$).
*   **Caudal Objetivo de Certificación:** $Q \ge 2.0 - 2.5\text{ L/s}$ ($7.2 - 9.0\text{ m}^3\text{/h}$) para abastecer un **reservorio regulador australiano de $80\text{ m}^3$** (5.1 días de autonomía continua) en 2.2 horas de bombeo diario.
*   **Protocolo de Campo:** Video-inspección submarina CCTV 360°, limpieza por air-lift ($<10\text{ g/m}^3$ arenas), prueba escalonada (Jacob: pérdidas $BQ + CQ^2$), prueba continua de 24-48 h con recuperación (Theis), y batería fisicoquímica completa (CE, pH, Na, Ca, Mg, HCO3, Cl, B, Fe, RAS, CSR).


