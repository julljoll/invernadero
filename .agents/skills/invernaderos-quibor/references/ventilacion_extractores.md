# Ventilación, Termodinámica y Rendimiento de Extractores Eólicos en Quíbor

## 1. Física de la Extracción Eólica en Cubierta

### Ecuación de Rendimiento (Ficha Técnica TurboExtractor 420 mm / 17")
$$Q\ (\text{m}^3/\text{h}) = (0.818 + 0.0303 \times A) \times (121.5 + 103.4 \times V + 11.6 \times G + 5.6 \times T)$$

Donde:
*   $A$: Altura de montaje del extractor (m).
*   $V$: Velocidad efectiva del viento a la altura de montaje (km/h).
*   $G$: Gradiente térmico interior - exterior (°C) ($\Delta T$).
*   $T$: Temperatura media regional (°C).

### Impacto de la Altura de Montaje en Quíbor
Tomando los parámetros medios de Quíbor: $V_{10} = 9.0\ \text{km/h}$, $T = 23.5\ \text{°C}$, y un gradiente conservador en horas pico de $G = 5.0\ \text{°C}$:

| Altura de Montaje ($A$) | Viento Efectivo $V(z)$ | Factor de Altura $(0.818 + 0.0303 A)$ | Capacidad Unitaria ($Q$) | Pérdida Relativa |
| :---: | :---: | :---: | :---: | :---: |
| **2.5 m** (Casa de malla baja) | 7.2 km/h | 0.894 | **941 m³/h** | **-23.2%** |
| **5.5 m** (Cumbrera estándar) | 8.2 km/h | 0.985 | **1,154 m³/h** | -5.9% |
| **7.0 m** (Invernadero alto) | 8.5 km/h | 1.030 | **1,226 m³/h** | Base (0%) |

**Conclusión Física:**
A 2.5 m de altura, el extractor rinde casi un **25% menos** que a 7 m debido a:
1.  **Capa límite superficial:** El roce del suelo frena el viento en los primeros 2-3 metros.
2.  **Menor tiro térmico (efecto chimenea):** La columna estática boyante es proporcional a $\Delta h$. A menor altura, menor diferencia de presión ascensional.

---

## 2. Demanda Teórica de Ventilación: Tasa de Renovación (RAH)

En horticultura protegida en climas cálidos-semiáridos tropicales, se exige una tasa de **60 renovaciones de aire por hora (RAH = 60)** para evacuar la radiación solar y evitar sobrecalentamiento interno ($\Delta T > 3-4\ \text{°C}$).

Para una casa de 1.000 m²:
*   **Volumen efectivo (modelo 5.5 m cumbrera / 3 m alero):** $\approx 5.500\ \text{m}^3$.
*   **Caudal total requerido:**
    $$Q_{req} = 5.500\ \text{m}^3 \times 60\ \text{h}^{-1} = 330.000\ \text{m}^3/\text{h}$$

### Comparación de Unidades de Extractores Requeridas

| Modelo de Extractor | Caudal Unitario a 2.5 m | Caudal Unitario a 5.5 m | Unidades necesarias (a 2.5 m) | Viabilidad Constructiva |
| :--- | :---: | :---: | :---: | :--- |
| **17" (420 mm)** | ~940 m³/h | ~1.150 m³/h | **~350 unidades** | **INVIABLE** (1 cada 2.8 m² de techo) |
| **24" (600 mm)** | ~1.850 m³/h | ~2.300 m³/h | **~180 unidades** | **INVIABLE** (Sobrecarga de peso) |
| **36" (900 mm Industrial)**| ~4.200 m³/h | ~5.200 m³/h | **~78 unidades** | **INVIABLE** (Costos y sombras excesivas) |

> [!CAUTION]
> **Ningún número realista de extractores eólicos puede sustituir la altura estructural**. El extractor eólico no genera energía: extrae trabajo del viento circundante. Si el viento es bajo (7-9 km/h) y la columna de aire es baja (2.5 m), la masa de aire no puede ser movida únicamente por turbinas pasivas.

---

## 3. El Mecanismo Real en Casas de Malla: Ventilación Natural Perimetral

A diferencia de un galpón industrial cerrado con láminas de zinc, una **casa de malla es una estructura porosa abierta**:
*   Perímetro para 1.000 m² (ej. 40 m × 25 m) = $130\ \text{m}$ lineales.
*   Con pilares de 3.0 m de altura, el área de fachada perimetral es:
    $$A_{perimetro} = 130\ \text{m} \times 3.0\ \text{m} = 390\ \text{m}^2$$
*   Incluso con la resistencia de la malla 50×25 (porosidad libre $\approx 35\%$), el área de paso libre efectivo es de $\approx 135\ \text{m}^2$, lo que supera holgadamente la recomendación agronómica mínima del 15-25% de la superficie del suelo ($150 - 250\ \text{m}^2$).

### Ventilación Convectiva Dinámica
El viento del **ESTE** presuriza la cara de barlovento ($C_p > 0$) y crea succión en la cara de sotavento y el techo ($C_p < 0$).
$$Q_{viento} = C_v \times A \times V$$
Con el viento de Quíbor (7-10 km/h), el intercambio a través de las paredes de malla supera con facilidad los $300.000\ \text{m}^3/\text{h}$ **sin costo energético alguno**, siempre que la altura interna permita que el aire caliente ascienda por encima del dosel vegetal.

---

## 4. Función Recomendada de los Extractores Eólicos
Los extractores eólicos **SÍ son recomendables**, pero no como método único de ventilación, sino como:
1.  **Extractores de Cumbrera para Calmas Térmicas:**
    *   En horas de mediodía de baja velocidad de viento (ej. meses de octubre-noviembre con 7 km/h), el aire caliente se estratifica en la parte más alta de las cerchas.
    *   El gradiente térmico de 3-5 °C hace girar las turbinas eólicas por tiro convectivo natural, evacuando la bolsa de aire sobrecalentado.
2.  **Dotación Óptima para 1.000 m²:**
    *   **7 a 10 extractores eólicos de 24" a 30" (600 - 750 mm)** distribuidos en la línea de cumbrera de las naves.
    *   Priorizar su colocación hacia la nave este y el centro de la estructura.
