# Requerimientos Hídricos (FAO-56) y Manejo de Salinidad en Quíbor

## 1. Demanda Hídrica por Etapa Fenológica (Pimentón y Tomate)

En el Valle de Quíbor, la evapotranspiración de referencia ($ET_0$) oscila entre 4.8 mm/día en los meses nublados/frescos (julio) y 6.0 - 6.5 mm/día en la temporada calurosa y seca (marzo-abril).

Para una densidad promedio de **2.0 a 2.5 plantas/m²** (2.000 a 2.500 plantas por módulo de 1.000 m²):

| Etapa Fenológica | Semanas | Coeficiente $Kc$ (FAO) | $ET_c$ Estimada (mm/día) | Litros / Planta / Semana | Volumen Total Semanal (1.000 m²) | Manejo Agronómico |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Trasplante / Establecimiento** | 0 – 3 | 0.60 | ~3.0 | **7 – 9 L** | 15.000 – 18.000 L | Riegos frecuentes y cortos; raíz superficial (<15 cm). Evitar anoxia. |
| **Crecimiento Vegetativo** | 3 – 6 | 0.75 – 0.85 | ~4.0 | **10 – 12 L** | 22.000 – 25.000 L | Aumento progresivo de pulsos de fertirriego. |
| **Floración y Cuajado** | 6 – 10 | 1.05 – 1.15 | ~5.5 – 6.0 | **15 – 17 L** | 32.000 – 36.000 L | **Fase crítica:** el déficit hídrico causa aborto floral idéntico al estrés térmico. |
| **Fructificación y Cosecha** *(Pico de calor marzo-abril)* | 10 – 20+ | 1.05 (sostenido) | ~6.0 – 6.5 | **17 – 20 L** | 38.000 – 45.000 L | La alta tasa de transpiración y déficit de presión de vapor (DPV) exige volumen máximo. |
| **Fin de Ciclo / Senescencia** | Final | ~0.90 | ~5.0 | **13 – 14 L** | 28.000 – 30.000 L | Reducción paulatina para maduración y corte. |

---

## 2. Manejo de Aguas Subterráneas Salinas en el Acuífero de Quíbor

Los pozos profundos del Municipio Jiménez frecuentemente presentan conductividades eléctricas ($EC_w$) moderadas a altas ($1.0 - 2.5\ \text{dS/m}$), con presencia de sulfatos, cloruros y calcio/sodio.

### Tolerancia de los Cultivos:
*   **Pimentón:** Muy sensible a la salinidad. Umbral de rendimiento $EC_e \approx 1.5\ \text{dS/m}$. Por encima de este valor, pierde ~14% de rendimiento por cada dS/m adicional.
*   **Tomate:** Moderadamente tolerante. Umbral de rendimiento $EC_e \approx 2.5\ \text{dS/m}$. Por encima de este valor, pierde ~9.9% de rendimiento por cada dS/m.

### Cálculo de la Fracción de Lavado (Leaching Fraction - LF)
Para prevenir la acumulación de sales en el bulbo húmedo (75% de las raíces en los primeros 30-40 cm), se debe aplicar una lámina de sobre-riego calculada mediante la ecuación de Rhoades (FAO-29 / FAO-56):

$$LF = \frac{EC_w}{5 \cdot EC_e - EC_w}$$

**Ejemplo Práctico en Quíbor ($EC_w = 1.4\ \text{dS/m}$):**
*   Para Pimentón ($EC_e = 1.5\ \text{dS/m}$):
    $$LF = \frac{1.4}{5(1.5) - 1.4} = \frac{1.4}{7.5 - 1.4} = \frac{1.4}{6.1} \approx 0.23\ (23\%)$$
*   **Lámina Total Requerida ($ET_{ajustada}$):**
    $$ET_{ajustada} = \frac{ET_c}{1 - LF} = \frac{20\ \text{L}}{1 - 0.23} \approx 26.0\ \text{L/planta/semana}$$

### Recomendaciones Operativas para Aguas de Pozo en Quíbor:
1.  **Pulsos Fraccionados Diarios:** Con aguas salinas, evitar riegos únicos copiosos. Dividir el tiempo de riego en 3 a 5 pulsos diarios para mantener el potencial osmótico alto y evitar concentración de sales.
2.  **Monitoreo con Tensiómetros:** Mantener el suelo franco-arcilloso o franco-limoso de Quíbor a tensiones entre **-20 y -30 kPa** a 20 cm de profundidad.
3.  **Relación Ca/Na y Mg/Na:** Monitorear la Relación de Adsorción de Sodio (RAS) para evitar dispersión de arcillas en el suelo.
