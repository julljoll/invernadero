# Climatología Verificada de Quíbor (Municipio Jiménez, Lara)

## 1. Parámetros Geográficos y Clasificación
*   **Ubicación:** Valle de Quíbor, Municipio Jiménez, Estado Lara, Venezuela.
*   **Elevación:** 695 msnm.
*   **Clasificación Climática:** Köppen BSh (Semiárido cálido tropical).
*   **Fuente de Datos:** Reconstrucciones asimiladas NASA MERRA-2 (1980-2016) geolocalizadas puntualmente en Quíbor, calibradas con estaciones locales y registros meteorológicos validados.

---

## 2. Registro Mensual de Variables Bioclimáticas

| Mes | Máx. Prom. (°C) | Mín. Prom. (°C) | Lluvia Prom. (mm) | Viento Prom. (km/h) | Días Bochornosos (Húmedo-Calor) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Enero** | 30 | 19 | 11 | 8.5 | 16.0 |
| **Febrero** | 30 | 20 | 14 | 8.9 | 14.5 |
| **Marzo** *(Mes más cálido)* | **31** | 20 | 26 | 9.0 | 18.6 |
| **Abril** | 30 | 20 | 73 | 8.9 | 22.6 |
| **Mayo** *(Mes más lluvioso)* | 29 | 20 | **104** | 9.4 | 28.1 |
| **Junio** *(Mes más ventoso)* | 28 | 20 | 96 | **10.4** | 27.6 |
| **Julio** *(Mes más fresco)* | 28 | 19 | 95 | 10.2 | 28.0 |
| **Agosto** *(Pico bochorno)* | 28 | 19 | 91 | 9.5 | **28.6** |
| **Septiembre** | 29 | 19 | 94 | 8.4 | 27.6 |
| **Octubre** | 29 | 20 | 93 | 7.1 | 28.5 |
| **Noviembre** *(Más calmado)* | 29 | 20 | 64 | **7.0** | 26.4 |
| **Diciembre** | 29 | 19 | 28 | 7.9 | 22.0 |

---

## 3. Dinámica y Perfil de Vientos

1.  **Dirección Dominante:**
    *   Durante **11 meses del año** el viento proviene con firmeza del **ESTE** (con una persistencia que alcanza hasta el 88% de las horas el 1 de enero).
    *   Única excepción: ventana de 4 semanas en **septiembre** donde predomina el viento del **SUR** (hasta 53% el 16 de septiembre).
2.  **Implicaciones de Ingeniería y Fitosanitarias:**
    *   La fachada **ESTE** soporta la mayor presión dinámica de viento del cultivo. Requiere mayor anclaje estructural, zapatas sobredimensionadas y doble tensor de acero galvanizado.
    *   Doble puerta sanitaria (esclusa) debe evitar orientarse de frente al Este para no actuar como embudo de insectos arrastrados por las corrientes.
3.  **Ráfagas de Diseño:**
    *   Velocidad media: 7.0 – 10.4 km/h.
    *   Ráfagas registradas: picos de **27 km/h (17 mph)** sobre base media.
    *   Presión dinámica básica de viento: $q = \frac{1}{2} \rho v^2 \approx 35\ \text{N/m}^2$ para 27 km/h, incrementándose con el coeficiente de arrastre de la malla anti-insectos ($C_d \approx 0.6 - 0.8$).
4.  **Gradiente de Capa Límite Atmosférica:**
    La velocidad real a nivel de cumbrera o extractor se calcula mediante la ley de potencia de Hellmann sobre terreno agrícola abierto ($\alpha \approx 0.16$):
    $$v(z) = v_{10} \cdot \left(\frac{z}{10}\right)^{0.16}$$
    *   A 2.5 m (altura baja): $v(2.5) = 9.0 \times (2.5/10)^{0.16} \approx 7.2\ \text{km/h}$ (pérdida del 20%).
    *   A 5.5 m (cumbrera estándar): $v(5.5) = 9.0 \times (5.5/10)^{0.16} \approx 8.2\ \text{km/h}$.
    *   A 7.0 m (invernadero alto): $v(7.0) = 9.0 \times (7.0/10)^{0.16} \approx 8.5\ \text{km/h}$.
