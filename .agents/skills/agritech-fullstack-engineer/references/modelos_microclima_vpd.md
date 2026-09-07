# Modelos de Microclima, Psicrometría y Balance Térmico de Invernaderos

Este documento recopila las formulaciones físicas, termodinámicas y bioclimáticas para la simulación, monitoreo y control automatizado de invernaderos y casas de malla.

---

## 1. Psicrometría y Déficit de Presión de Vapor (VPD)

### 1.1. Ecuaciones Fundamentales del Aire Húmedo
Para calcular las propiedades del aire en sistemas de control de clima:

1. **Presión de Vapor de Saturación ($e_s$):**
   Fórmula de Tetens (precisión < 0.1% en rango 0 a 50 °C):
   $$e_s(T) = 0.61078 \exp\left(\frac{17.27 \cdot T}{T + 237.3}\right)\quad [\text{kPa}]$$
   *Donde $T$ es la temperatura en grados Celsius (°C).*

2. **Presión Real de Vapor ($e_a$):**
   Calculada a partir de la Humedad Relativa ($HR$, en %):
   $$e_a = e_s(T) \times \frac{HR}{100}\quad [\text{kPa}]$$

3. **Temperatura de Punto de Rocío ($T_{dp}$):**
   $$T_{dp} = \frac{237.3 \times \ln(e_a / 0.61078)}{17.27 - \ln(e_a / 0.61078)}\quad [^\circ\text{C}]$$
   *Si $T_{superficie\_planta} \le T_{dp}$, se produce condensación líquida directa, disparando esporulación de patógenos.*

4. **Humedad Absoluta / Relación de Mezcla ($AH$):**
   Densidad de vapor de agua en el aire:
   $$AH = \frac{216.7 \times e_a}{T + 273.15}\quad [\text{g/m}^3]$$

### 1.2. Déficit de Presión de Vapor del Aire ($VPD_{aire}$) vs Foliar ($VPD_{foliar}$)
El VPD representa la fuerza de succión que ejerce la atmósfera sobre el agua de las hojas de las plantas:

$$VPD_{aire} = e_s(T_{aire}) - e_a\quad [\text{kPa}]$$

En agronomía de precisión, la transpiración real depende de la temperatura del dosel foliar ($T_{hoja}$):
$$VPD_{foliar} = e_s(T_{hoja}) - e_a\quad [\text{kPa}]$$

* **Estimación empírica de $T_{hoja}$ sin sensor térmico infrarrojo:**
  * Cultivo bien regado y transpirando activamente: $T_{hoja} \approx T_{aire} - (1.5 \text{ a } 2.5^\circ\text{C})$.
  * Cultivo bajo estrés hídrico o salino (estomas cerrados): $T_{hoja} \approx T_{aire} + (1.0 \text{ a } 3.0^\circ\text{C})$.
  * Con sensor termográfico/IR: Utilizar directamente $T_{hoja}$ medida en el ápice activo.

### 1.3. Matriz de Estados de VPD para Solanáceas (Tomate y Pimentón)

| Rango VPD (kPa) | Estado Fisiológico | Impacto en Tomate / Pimentón | Acción Automática del Sistema |
| :--- | :--- | :--- | :--- |
| **< 0.40** | **Saturación / Sin Transpiración** | Cero absorción de Ca²⁺. Gutación en bordes foliares, edema celular, altísimo riesgo de *Botrytis cinerea*, tizón tardío y bacterias. | Activar ventilación forzada o apertura máxima de cortinas; restringir riegos; elevar temperatura si es posible. |
| **0.40 - 0.80** | **Baja Transpiración** | Crecimiento vegetativo suave. Adecuado para enraizamiento de plántulas o post-trasplante. | Monitorear HR; permitir ventilación natural moderada. |
| **0.80 - 1.25** | **ÓPTIMO AGRONÓMICO** | Máxima fotosíntesis, óptimo intercambio gaseoso, transporte equilibrado de agua y fotoasimilados. Cuajado ideal. | Mantener consignas de clima; sincronizar pulsos de riego según radiación solar. |
| **1.25 - 1.55** | **Transpiración Forzada** | Comienzo de estrés hídrico leve. Los estomas reducen conductancia. Frutos propensos a *Blossom End Rot* (BER / culillo negro). | Incrementar frecuencia de pulsos de riego; cerrar parcialmente ventilación o activar nebulizadores / mallas de sombreo. |
| **> 1.55** | **ESTRÉS CRÍTICO** | Cierre estomático total. Paralización fotosintética, aborto masivo de flores, necrosis apical y quemadura solar (*sunscald*). | Activación de emergencia de nebulización (fogging), aspersores de techo o humectación de pasillos. |

---

## 2. Balance Térmico de Invernaderos y Casas de Malla

El balance de energía térmica por unidad de superficie del suelo ($1\ \text{m}^2$) se expresa como:

$$R_{net} - H_{conv} - \lambda E_{transp} - q_{vent} - q_{suelo} = 0\quad [\text{W/m}^2]$$

Donde:
* $R_{net}$: Radiación solar neta absorbida dentro de la estructura ($R_{net} \approx \tau_{cubierta} \times (1 - \alpha_{cultivo}) \times R_{global}$).
  * Para malla blanca 50 mesh ($110\ \text{gsm}$): Transmisividad solar $\tau \approx 0.72 - 0.78$; fracción difusa $\ge 40\%$.
* $H_{conv}$: Calor sensible transferido al aire interno por convección.
* $\lambda E_{transp}$: Calor latente consumido por la transpiración del cultivo (enfriamiento evaporativo biológico).
  * 1 mm de agua transpirada equivale a la disipación de aproximadamente **$2.45\ \text{MJ/m}^2$** de calor latente.
* $q_{vent}$: Calor sensible evacuado por renovación de aire hacia el exterior.
* $q_{suelo}$: Flujo de calor conducido hacia el suelo ($5 - 10\%$ de $R_{net}$).

---

## 3. Dinámica de Ventilación Natural y Renovaciones de Aire (RAH)

### 3.1. Caudal de Ventilación por Efecto Viento
En casas de malla y naves protegidas con paredes de malla porosa, el flujo de viento horizontal es la principal fuerza motriz:

$$Q_{viento} = C_d \times A_{vent} \times v(z) \times 3600\quad [\text{m}^3/\text{h}]$$

Donde:
* $A_{vent}$: Área libre de ventilación efectiva orientada al viento incidente ($\text{m}^2$).
* $C_d$: Coeficiente de descarga aerodinámica de la malla. Para mallas anti-insectos 50×25 hilos ($192\ \mu\text{m}$ de apertura):
  $$C_d \approx 0.22 - 0.28$$
* $v(z)$: Velocidad del viento a la altura cumbrera $z$, corregida por el perfil de la capa límite atmosférica:
  $$v(z) = v_{10} \times \left(\frac{z}{10}\right)^{0.16}$$
  * A 2.5 m: $v(2.5) = 0.80 \times v_{10}$ (20% de reducción).
  * A 5.5 m: $v(5.5) = 0.91 \times v_{10}$ (9% de reducción).
  * A 7.0 m: $v(7.0) = 0.94 \times v_{10}$ (solo 6% de reducción).

### 3.2. Ventilación Cenital Asistida por Extractores Eólicos
En horas de calma eólica ($v_{10} < 4\ \text{km/h}$), el gradiente térmico vertical genera tiro convectivo natural (efecto chimenea). Para reforzar la extracción cenital sin consumo eléctrico, los extractores eólicos tipo cebolla (24" a 30") siguen la ecuación de descarga:

$$Q_{extractor}\ (\text{m}^3/\text{h}) = (0.818 + 0.0303 \times A) \times (121.5 + 103.4 \times V + 11.6 \times \Delta T + 5.6 \times T_{amb})$$

Donde:
* $A$: Altura de montaje respecto al suelo (m).
* $V$: Velocidad del viento a la cumbrera (km/h).
* $\Delta T$: Gradiente térmico entre cumbrera y exterior ($T_{int} - T_{ext}$, en °C).
* $T_{amb}$: Temperatura ambiente exterior (°C).

### 3.3. Cálculo de RAH (Renovaciones de Aire por Hora / ACH)
$$\text{RAH} = \frac{Q_{total\_extraccion}}{V_{nave}} = \frac{Q_{vent\_lateral} + \sum Q_{extractores}}{L \times W \times H_{media}}\quad [\text{h}^{-1}]$$

* **Criterios de Diseño:**
  * Mínimo absoluto para evitar sofocación térmica: $\text{RAH} \ge 35\ \text{h}^{-1}$.
  * Óptimo para climas cálidos y semiáridos: $\text{RAH} = 45 - 65\ \text{h}^{-1}$.

---

## 4. Radiación Solar, PAR y Daily Light Integral (DLI)

### 4.1. Conversión de Unidades Radiométricas a Cuánticas
Los sensores meteorológicos estándar miden irradiancia global en $\text{W/m}^2$. Las plantas responden al flujo de fotones fotosintéticos (PPFD, en $\mu\text{mol/m}^2/\text{s}$ en el espectro 400 - 700 nm):

* **Factor de Conversión Típico para Luz Solar Natural:**
  $$1\ \text{W/m}^2 \text{ de radiación solar global} \approx 2.05 - 2.15\ \mu\text{mol/m}^2/\text{s de PPFD}$$
  *(La fracción PAR de la luz solar directa representa aproximadamente el 45% al 48% de la energía total).*

### 4.2. Cálculo del DLI Diario (Daily Light Integral)
El DLI acumula los fotones fotosintéticos recibidos a lo largo del día fotoperiódico:

$$\text{DLI} = \sum_{t=1}^{N} \left(\text{PPFD}_t \times \Delta t\right) \times 10^{-6}\quad [\text{mol/m}^2/\text{día}]$$

Si el sistema registra lecturas de $\text{W/m}^2$ promediadas cada 5 minutos ($\Delta t = 300\ \text{s}$):
$$\text{DLI} = \left( \sum_{i=1}^{M} R_{global\_i} \times 2.10 \times 300 \right) \times 10^{-6} \times \tau_{cubierta}\quad [\text{mol/m}^2/\text{día}]$$

### 4.3. Requerimientos de DLI y Umbrales de Saturación Lumínica

| Cultivo | DLI Mínimo Aceptable | DLI Óptimo Comercial | Saturación Fotosintética (PPFD) |
| :--- | :--- | :--- | :--- |
| **Tomate Indeterminado** | $15\ \text{mol/m}^2/\text{d}$ | **$22 - 30\ \text{mol/m}^2/\text{d}$** | $1000 - 1200\ \mu\text{mol/m}^2/\text{s}$ |
| **Pimentón (*Capsicum*)** | $12\ \text{mol/m}^2/\text{d}$ | **$18 - 25\ \text{mol/m}^2/\text{d}$** | $800 - 1000\ \mu\text{mol/m}^2/\text{s}$ |

*Nota: Por encima de la saturación luminosa sin CO₂ suplementario o en presencia de altas temperaturas (>32 °C), el exceso de fotones genera fotoinhibición y estrés oxidativo.*
