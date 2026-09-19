# Cálculo de Cargas de Viento para Invernaderos — Valle de Quíbor

## 1. Datos de Entrada del Sitio

| Parámetro | Valor | Nota |
| :--- | :---: | :--- |
| Coordenadas | 9°53'20"N, 69°35'35"W | Valle de Quíbor, Mun. Jiménez |
| Elevación | 700 msnm | Dato altimétrico medio |
| Temperatura media anual | 24.5 °C | MERRA-2 |
| Densidad del aire ($\rho$) | 1.127 kg/m³ | Corregida por altitud y temperatura |
| Rugosidad del terreno | Categoría B (Terreno agrícola abierto) | COVENIN 2003 |
| Exponente de potencia ($\alpha$) | 0.16 | Terreno agrícola plano |

---

## 2. Perfil de Velocidad del Viento (Ley de Hellmann)

La velocidad del viento a una altura $z$ sobre el terreno se calcula a partir de la velocidad de referencia a 10 m ($v_{10}$):

$$v(z) = v_{10} \left(\frac{z}{10}\right)^{\alpha}$$

### Tabla de Velocidades para Quíbor

| Altura (m) | Factor | Vel. Media (km/h) | Ráfaga (km/h) | Ráfaga × FS 1.5 (km/h) |
| :---: | :---: | :---: | :---: | :---: |
| 2.50 | 0.803 | 7.2 | 21.7 | 32.5 |
| 3.00 | 0.823 | 7.4 | 22.2 | 33.3 |
| 3.80 | 0.852 | 7.7 | 23.0 | 34.5 |
| 4.50 | 0.873 | 7.9 | 23.6 | 35.3 |
| 5.50 | 0.900 | 8.1 | 24.3 | 36.5 |
| 6.00 | 0.912 | 8.2 | 24.6 | 36.9 |
| 7.00 | 0.934 | 8.4 | 25.2 | 37.8 |
| 10.00 | 1.000 | 9.0 | 27.0 | 40.5 |

> **Nota:** $v_{10,media} = 9.0\ \text{km/h}$ (mes más ventoso: junio con 10.4 km/h). Ráfaga máxima registrada: 27 km/h a 10 m.

---

## 3. Presión Dinámica del Viento

### 3.1. Fórmula Básica
$$q = \frac{1}{2} \rho v^2 \quad [\text{Pa} = \text{N/m}^2]$$

### 3.2. Tabla de Presiones Dinámicas

| Velocidad (km/h) | Velocidad (m/s) | $q$ (N/m²) | $q$ (kgf/m²) |
| :---: | :---: | :---: | :---: |
| 20.0 | 5.56 | 17.4 | 1.77 |
| 25.0 | 6.94 | 27.2 | 2.77 |
| 27.0 | 7.50 | 31.7 | 3.23 |
| 30.0 | 8.33 | 39.1 | 3.99 |
| 35.0 | 9.72 | 53.3 | 5.43 |
| 40.0 | 11.11 | 69.6 | 7.10 |
| 40.5 | 11.25 | 71.3 | 7.27 |
| 50.0 | 13.89 | 108.8 | 11.09 |
| 60.0 | 16.67 | 156.6 | 15.97 |

### 3.3. Presión de Diseño Recomendada para Quíbor

**Velocidad de diseño:** $V_d = 27 \times 1.5 = 40.5\ \text{km/h} = 11.25\ \text{m/s}$

$$q_d = \frac{1}{2} \times 1.127 \times 11.25^2 = 71.3\ \text{N/m}^2 = 7.27\ \text{kgf/m}^2$$

---

## 4. Coeficientes de Presión ($C_p$) para Invernaderos

### 4.1. Casa de Malla Parral Plano

| Superficie | $C_p$ Barlovento | $C_p$ Sotavento | $C_p$ Succión (techo) |
| :--- | :---: | :---: | :---: |
| Pared vertical | +0.80 | −0.50 | — |
| Techo plano (pendiente < 5°) | — | — | −0.70 |

### 4.2. Multitúnel (Arco Semicircular)

| Superficie | $C_p$ |
| :--- | :---: |
| Pared barlovento | +0.80 |
| Pared sotavento | −0.40 |
| Arco barlovento (0°-45°) | +0.50 a −0.20 |
| Arco cumbrera (45°-90°) | −0.80 a −1.20 |
| Arco sotavento (90°-180°) | −0.40 a −0.60 |

### 4.3. Coeficiente de Arrastre de Malla ($C_{d,malla}$)

| Tipo de Malla | Porosidad (%) | $C_{d,malla}$ |
| :--- | :---: | :---: |
| Malla 50 mesh, 110 gsm | ~45-55% | 0.60 – 0.70 |
| Malla 50 mesh, 130 gsm | ~40-50% | 0.65 – 0.80 |
| Malla 40 mesh, 90 gsm | ~55-65% | 0.45 – 0.55 |
| Polietileno (film plástico) | 0% | 1.00 |

---

## 5. Presiones Efectivas sobre la Estructura

### 5.1. Presión sobre Paredes de Malla (Caso Crítico: Fachada Este)

$$q_{ef} = q_d \times C_{d,malla} \times C_p$$

**Barlovento (fachada Este) con malla 50 mesh 110 gsm:**
$$q_{barlovento} = 71.3 \times 0.65 \times 0.80 = 37.1\ \text{N/m}^2 = 3.78\ \text{kgf/m}^2$$

**Sotavento (fachada Oeste):**
$$q_{sotavento} = 71.3 \times 0.65 \times 0.50 = 23.2\ \text{N/m}^2 = 2.36\ \text{kgf/m}^2$$

### 5.2. Succión sobre Cubierta de Malla (Techo Plano)

$$q_{succión} = 71.3 \times 0.65 \times 0.70 = 32.4\ \text{N/m}^2 = 3.31\ \text{kgf/m}^2$$

### 5.3. Fuerza Total sobre un Panel de Malla

Para un panel de malla entre pilares de 4.0 m × 3.80 m (típico fachada Este):
$$F_{panel} = q_{barlovento} \times A = 37.1 \times (4.0 \times 3.80) = 564\ \text{N} = 57.5\ \text{kgf}$$

Con factor de seguridad adicional para anclajes ($F_S = 2.0$):
$$F_{diseño} = 564 \times 2.0 = 1128\ \text{N} = 115\ \text{kgf}$$

---

## 6. Verificación Rápida de Pilares a Viento

### 6.1. Momento Flector en Base del Pilar (Empotramiento)

Para pilar perimetral de altura $h$, separación $s$, carga distribuida $w = q_{ef} \times s$:

$$M_{base} = \frac{w \times h^2}{2} = \frac{q_{ef} \times s \times h^2}{2}$$

**Ejemplo: Pilar fachada Este, h = 3.80 m, s = 4.0 m:**
$$M_{base} = \frac{37.1 \times 4.0 \times 3.80^2}{2} = 1073\ \text{N·m} = 109.4\ \text{kgf·m}$$

### 6.2. Módulo de Sección Requerido

$$W_{req} = \frac{M_{base}}{f_b} = \frac{10940}{0.60 \times 2530} = 7.21\ \text{cm}^3$$

Donde $f_b = 0.60 \times F_y = 0.60 \times 2530 = 1518\ \text{kgf/cm}^2$ (tensión admisible a flexión).

### 6.3. Selección de Perfil Tubular

| Perfil | $W$ (cm³) | $I$ (cm⁴) | $A$ (cm²) | ¿Cumple? |
| :--- | :---: | :---: | :---: | :---: |
| Ø 2" × 2.0 mm | 3.19 | 5.10 | 2.47 | ❌ No |
| Ø 2½" × 2.0 mm | 4.74 | 7.56 | 3.73 | ❌ No (marginal) |
| **Ø 2½" × 2.5 mm** | **5.82** | **9.28** | **4.62** | ❌ Marginal |
| **Ø 3" × 2.5 mm** | **8.46** | **16.08** | **5.66** | ✅ Sí |
| Ø 3" × 3.0 mm | 9.97 | 18.95 | 6.73 | ✅ Sí (holgado) |

> **Recomendación para Quíbor:** Pilares perimetrales de la fachada Este en **Ø 3" × 2.5 mm** mínimo. Resto del perímetro puede usar Ø 2½" × 2.5 mm con arriostramientos.

---

## 7. Combinaciones de Carga (COVENIN)

| Combinación | Fórmula | Aplicación |
| :--- | :--- | :--- |
| 1 | $1.4 D$ | Solo peso propio |
| 2 | $1.2 D + 1.6 L$ | Peso propio + cultivo |
| 3 | $1.2 D + 1.0 L + 1.6 W$ | **Caso crítico viento** |
| 4 | $1.2 D + 1.0 L + 1.0 E$ | Caso sísmico |
| 5 | $0.9 D + 1.6 W$ | Arranque por succión |

Donde: $D$ = carga muerta, $L$ = carga viva (cultivo), $W$ = carga de viento, $E$ = carga sísmica.
