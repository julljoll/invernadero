# Análisis Financiero y ROI para Invernaderos y Casas de Malla — Valle de Quíbor

## 1. Modelo de Negocio de la Fabricación e Instalación

### 1.1. Cadena de Valor del Fabricante

```
Diseño → Cotización → Fabricación en Taller → Galvanizado → Transporte → Montaje → Entrega
  ↓          ↓              ↓                    ↓            ↓          ↓         ↓
 5%        2%            35-40%               10-15%        5-8%      20-25%    2-3%
                         (del costo total de fabricación)
```

### 1.2. Márgenes del Fabricante

| Concepto | Rango Típico |
| :--- | :---: |
| Costo directo de materiales | 45 – 55% del precio de venta |
| Mano de obra directa (taller + campo) | 15 – 22% |
| Transporte y logística | 5 – 8% |
| Gastos administrativos | 5 – 8% |
| **Utilidad neta del fabricante** | **15 – 25%** |

---

## 2. Modelo Financiero del Productor (Cliente)

### 2.1. Inversión Inicial — Casa de Malla 1.000 m² para Tomate

| Partida | Costo (USD) | % del Total |
| :--- | :---: | :---: |
| Estructura metálica galvanizada | 10.000 – 15.000 | 35 – 40% |
| Cubierta de malla anti-insectos | 3.000 – 5.000 | 10 – 14% |
| Cimentaciones y anclajes | 2.000 – 3.500 | 7 – 10% |
| Sistema de riego por goteo + fertirriego | 3.000 – 5.000 | 10 – 14% |
| Preparación de terreno (nivelación, caminos) | 1.500 – 3.000 | 5 – 8% |
| Mano de obra de montaje | 3.000 – 5.000 | 10 – 14% |
| Reservorio de agua (80 m³) | 2.000 – 3.500 | 7 – 10% |
| **TOTAL INVERSIÓN** | **25.000 – 40.000** | **100%** |

### 2.2. Costos Operativos por Ciclo de Producción (4-5 meses)

| Concepto | Costo/Ciclo (USD) | Costo/Año × 2 ciclos |
| :--- | :---: | :---: |
| Semillero y plántulas (2.200 plantas) | 350 – 500 | 700 – 1.000 |
| Fertilizantes solubles (N-P-K + Micros) | 600 – 1.000 | 1.200 – 2.000 |
| Agroquímicos (fitosanitarios, biocontrol) | 400 – 700 | 800 – 1.400 |
| Mano de obra de cultivo (2-3 obreros) | 1.500 – 2.500 | 3.000 – 5.000 |
| Energía eléctrica (bomba de pozo) | 200 – 400 | 400 – 800 |
| Agua (costo de bombeo) | 150 – 300 | 300 – 600 |
| Mantenimiento de estructura | 100 – 200 | 200 – 400 |
| Empaque y transporte a mercado | 300 – 500 | 600 – 1.000 |
| **TOTAL OPERATIVO/AÑO** | — | **7.200 – 12.200** |

### 2.3. Proyección de Ingresos — Tomate Indeterminado

| Parámetro | Pesimista | Base | Optimista |
| :--- | :---: | :---: | :---: |
| Rendimiento por ciclo (Ton/1.000 m²) | 8 | 10 | 14 |
| Ciclos por año | 2.0 | 2.0 | 2.5 |
| **Producción anual (Ton)** | **16** | **20** | **35** |
| Precio promedio (USD/kg) | 0.80 | 1.00 | 1.20 |
| **Ingreso Bruto Anual (USD)** | **12.800** | **20.000** | **42.000** |
| Costo operativo anual (USD) | 12.000 | 9.500 | 10.500 |
| **Margen Neto Anual (USD)** | **800** | **10.500** | **31.500** |

### 2.4. Indicadores de Retorno de Inversión

| Indicador | Pesimista | Base | Optimista |
| :--- | :---: | :---: | :---: |
| Inversión Total (USD) | 40.000 | 32.000 | 28.000 |
| Margen Neto Anual (USD) | 800 | 10.500 | 31.500 |
| **Payback (años)** | **50.0** ⚠️ | **3.0** | **0.9** |
| **ROI Anual (%)** | **2%** ⚠️ | **33%** | **112%** |
| **VAN a 10 años, r=12% (USD)** | −35.480 | 27.328 | 149.968 |
| **TIR (%)** | −8% | 28% | 108% |

> **Análisis:** El escenario pesimista (baja producción + bajo precio + altos costos) hace el proyecto inviable. El escenario base muestra recuperación en 3 años (aceptable para inversión agrícola). El escenario optimista genera un ROI excepcional que justifica ampliación.

---

## 3. Fórmulas Financieras Aplicadas

### 3.1. Valor Actual Neto (VAN)
$$VAN = -I_0 + \sum_{t=1}^{n} \frac{FC_t}{(1+r)^t}$$

Donde:
- $I_0$ = inversión inicial
- $FC_t$ = flujo de caja neto del año $t$
- $r$ = tasa de descuento (12% para proyectos agrícolas en Venezuela)
- $n$ = horizonte de evaluación (10 años)

### 3.2. Tasa Interna de Retorno (TIR)
La TIR es la tasa $r^*$ que hace $VAN = 0$:
$$0 = -I_0 + \sum_{t=1}^{n} \frac{FC_t}{(1+r^*)^t}$$

### 3.3. Período de Recuperación Simple (Payback)
$$\text{Payback} = \frac{I_0}{\overline{FC}} \quad [\text{años}]$$

### 3.4. Punto de Equilibrio (Break-Even)
$$Q_{BE} = \frac{CF}{P - CV_u}$$

Donde:
- $CF$ = costos fijos anuales (depreciación + mantenimiento)
- $P$ = precio de venta por kg
- $CV_u$ = costo variable unitario por kg

**Ejemplo:**
$$Q_{BE} = \frac{4.000}{1.00 - 0.45} = 7.273\ \text{kg} = 7.27\ \text{Ton/año}$$

Para producir 7.27 Ton/año en 1.000 m² se necesita un rendimiento de 3.6 Ton/1.000 m²/ciclo (2 ciclos), que es muy alcanzable en casa de malla.

---

## 4. Análisis de Sensibilidad

### 4.1. Sensibilidad al Precio del Tomate

| Precio (USD/kg) | Ingreso Anual | Margen Neto | ROI (Inv. 32k) | Payback |
| :---: | :---: | :---: | :---: | :---: |
| 0.60 | 12.000 | 2.500 | 8% | 12.8 años |
| 0.80 | 16.000 | 6.500 | 20% | 4.9 años |
| **1.00** | **20.000** | **10.500** | **33%** | **3.0 años** |
| 1.20 | 24.000 | 14.500 | 45% | 2.2 años |
| 1.50 | 30.000 | 20.500 | 64% | 1.6 años |

### 4.2. Sensibilidad al Rendimiento

| Rendimiento (Ton/año) | Ingreso (a $1/kg) | Margen Neto | ROI | Payback |
| :---: | :---: | :---: | :---: | :---: |
| 12 | 12.000 | 2.500 | 8% | 12.8 años |
| 16 | 16.000 | 6.500 | 20% | 4.9 años |
| **20** | **20.000** | **10.500** | **33%** | **3.0 años** |
| 25 | 25.000 | 15.500 | 48% | 2.1 años |
| 30 | 30.000 | 20.500 | 64% | 1.6 años |

---

## 5. Ventaja Competitiva de la Estructura Protegida vs. Cielo Abierto

| Indicador | Cielo Abierto | Casa de Malla | Factor |
| :--- | :---: | :---: | :---: |
| Rendimiento (Ton/Ha/año) | 40 – 60 | 160 – 240 | 3× – 5× |
| Uso de agua (L/kg tomate) | 150 – 200 | 40 – 70 | 50 – 75% ahorro |
| Uso de agroquímicos | 15 – 25 aplic./ciclo | 4 – 8 aplic./ciclo | 60 – 75% ahorro |
| Pérdida por plagas/clima | 30 – 50% | 5 – 15% | −70% pérdidas |
| Calidad de fruto (1ra calidad) | 40 – 60% | 75 – 90% | +50% primera |
| Precio obtenible (USD/kg) | 0.60 – 0.80 | 0.90 – 1.30 | +30 – 60% |

---

## 6. Propuesta de Escalamiento Modular

### 6.1. Estrategia de Crecimiento Recomendada

| Fase | Superficie | Inversión | Producción | Plazo |
| :--- | :---: | :---: | :---: | :--- |
| **Fase 1 (Piloto)** | 1.000 m² | 30.000 USD | 20 Ton/año | Año 1 |
| **Fase 2 (Validación)** | +1.000 m² (2.000 m² total) | 25.000 USD | 40 Ton/año | Año 2-3 |
| **Fase 3 (Expansión)** | +3.000 m² (5.000 m² total) | 55.000 USD | 100 Ton/año | Año 3-5 |
| **Fase 4 (Escala)** | +5.000 m² (1 Ha total) | 90.000 USD | 200 Ton/año | Año 5-7 |

> **Nota:** A partir de Fase 3, los costos por m² bajan un 15-25% por economías de escala en compra de materiales, galvanizado y mano de obra especializada.
