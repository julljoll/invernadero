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

### 5. Estructura y Geometría de 1.000 m²
Para detalles constructivos de la nave de 5 módulos (40 m × 25 m):
*   Ver especificaciones estructurales en [diseno_estructural_1000m2.md](./references/diseno_estructural_1000m2.md).
*   Alero a 3.0 m, cumbrera a 5.5 m, tutorado tipo español a 2.2 m con alambre galvanizado calibre 12 y tensores a tierra.
