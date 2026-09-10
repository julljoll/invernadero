# Guía Maestra de Arquitectura y Replicación — Index de Reactivación Agrícola (1.000 m²)

> **Documento Técnico de Ingeniería, Agronomía Protegida y Desarrollo Frontend (Agri-UX/UI)**  
> **Proyecto Base:** Agrovenecua — Finca La Cigarronera (Valle de Quíbor, Lara, Venezuela)  
> **Cultivo:** Pimentón Híbrido (*Capsicum annuum* var. Magistral F1) bajo Casa de Malla 50 Mesh  
> **Población:** 2.500 Plantas en 1.000 m² ($20\text{ m} \times 50\text{ m}$)  
> **Fecha de Calibración:** Septiembre 2026 | **Moneda:** USD ($)

---

## 1. Resumen Ejecutivo del Embudo de Ventas y Filosofía de Diseño

La página principal (`LandingPage.tsx`) fue estructurada no como una vitrina genérica de catálogo, sino como un **embudo de decisión técnico-financiero (Technical Decision Funnel)** de alta conversión. Su propósito es convencer a productores, agrónomos e inversionistas agrícolas de la viabilidad matemática de reactivar una casa de cultivo inactiva de **1.000 m²**, respondiendo en cada pantalla a la pregunta:

$$\text{¿Cuánto dinero invierto, qué calidad obtengo y cuánto dinero neto limpio me queda en el bolsillo?}$$

### 1.1. Regla de Oro Comercial: La Cesta Venezolana y la Erradicación de la "Maraña"
En Venezuela (mercados de Quíbor, Mercabar Barquisimeto, Coche Caracas), el pimentón no se liquida a un precio plano. El camión clasifica la cesta plástica de 20 kg en:
1. **Cesta Grande (Primera / Jumbo >220g):** **$14.00 USD / cesta** ($0.70 USD/kg). Fruto de 4 lóbulos, pared celular de 8–10 mm, máxima firmeza.
2. **Cesta Mediana (Segunda 140–180g):** **$8.00 USD / cesta** ($0.40 USD/kg). Fruto intermedio de 3 lóbulos.
3. **Cesta Pequeña / "Maraña" (<120g o Deforme):** **$3.50 USD / cesta** ($0.17 USD/kg). Fruto arrugado, con culillo por falta de calcio o picado. Apenas paga el flete.

**Premisa del Embudo:** La siembra tradicional con abono granulado al suelo produce un **30% de Maraña** y un **45% de Mediano**, desplomando el promedio de venta a $9 USD/cesta. El **Plan AIFA + Semilla Magistral F1 + Ácido Nítrico + Malla 50 Mesh** está calibrado agronómicamente para **erradicar la Maraña al 0%** y concentrar el **88% de la cosecha en Cesta Grande a $14 USD**, logrando **+$4.015 USD netos adicionales** (+171% más ganancia).

---

## 2. Parámetros Físicos, Agronómicos e Hidráulicos Inmutables

Para replicar este proyecto en otra nave, se debe respetar la siguiente sincronía dimensional:

| Parámetro | Valor Base (Quíbor 1.000 m²) | Ecuación de Escalado para Otro Predio |
| :--- | :--- | :--- |
| **Dimensiones de Nave** | $20.00\text{ m (ancho)} \times 50.00\text{ m (largo)}$ | $A = \text{Ancho} \times \text{Largo}$ |
| **Camellones Dobles** | 10 camellones a 2.00 m entre ejes | $N_{\text{camellones}} = \text{Ancho} / 2.00\text{ m}$ |
| **Hileras de Cultivo** | 20 hileras de 50 m de longitud | $N_{\text{hileras}} = N_{\text{camellones}} \times 2$ |
| **Distancia entre Plantas** | 0.40 m en la hilera | $N_{\text{plantas/hilera}} = \text{Largo} / 0.40\text{ m} = 125\text{ pl}$ |
| **Población Total** | **2.500 plantas** ($2.50\text{ pl/m}^2$) | $\mathbf{Población} = N_{\text{hileras}} \times N_{\text{plantas/hilera}}$ |
| **Emisores de Riego (Goteros)** | **2.500 goteros PC/AS** (Sincronía 1:1) | 1 gotero autocompensante de 1.60 L/h por planta |
| **Caudal Total de Riego** | $4.00\text{ m}^3\text{/h}$ ($4.000\text{ L/h}$) | $Q_{\text{total}} = \text{Población} \times 1.60\text{ L/h}$ |
| **Sectorización** | 2 sectores hidráulicos de $2.00\text{ m}^3\text{/h}$ | Permite operar con bomba de 1.5 HP (220V) |
| **Rendimiento por Planta** | $5.20\text{ kg / planta}$ (Magistral F1) | Cosecha bajo malla vs 1.8–2.5 kg/pl a campo abierto |
| **Cosecha Total Ciclo** | **13.00 Toneladas (13.000 kg)** | $13.000\text{ kg} = 2.500\text{ pl} \times 5.20\text{ kg/pl}$ |
| **Cestas Cosechadas** | **650 cestas de 20 kg** | $N_{\text{cestas}} = \text{Kilos Totales} / 20\text{ kg/cesta}$ |
| **Duración del Ciclo** | 20 semanas (5 meses) | 3 sem. semillero + 5 sem. vegetativo + 12 sem. corte |

---

## 3. Arquitectura del Código y Árbol de Componentes

La estructura de carpetas en `src/features/landing/` está diseñada modularmente para que cada sección sea un componente funcional independiente, facilitando su mantenimiento y reutilización:

```
src/
├── app/
│   ├── App.tsx                     # Contenedor raíz con Navbar, AppRoutes y Footer
│   └── routes.tsx                  # Enrutador React Router (SPA)
├── features/
│   └── landing/
│       ├── LandingPage.tsx          # Componente integrador de las 7 secciones
│       └── components/
│           └── reactivation/
│               ├── ReactivationHero.tsx           # Sección 1: Hero con 3 KPIs y CTAs
│               ├── AgronomicLayoutSection.tsx     # Sección 2: Marco de Siembra y Riego 1:1
│               ├── FertigationPlanSection.tsx     # Sección 3: Plan AIFA, Cestas y Matriz
│               ├── TrellisEspalderaSection.tsx     # Sección 4: Hortomalla 15x15 y ToBRFV
│               ├── BioclimaticMeshSection.tsx     # Sección 5: Malla 50 Mesh y Vientos Este
│               ├── InvestmentCalculatorSection.tsx# Sección 6: Calculadora 15 Rubros
│               └── PozoDeepBanner.tsx             # Sección 7: Banner Pozo Profundo (Outflow)
├── shared/
│   └── components/
│       ├── navbar/
│       │   ├── Navbar.tsx          # Barra de navegación con logo centrado y anclas
│       │   └── NavMobileMenu.tsx   # Menú móvil flotante de alta legibilidad
│       ├── Footer.tsx              # Pie de página con créditos agronómicos
│       └── Slider.tsx              # Componente interactivo de rango para simuladores
└── styles/
    └── global.css                  # Design System Agrovenecua y paleta de colores
```

---

## 4. Desglose Módulo por Módulo: Lógica y Comportamiento

### Módulo 1: `ReactivationHero.tsx`
* **Propósito:** Captura de atención inmediata (Above the Fold) orientando al inversionista a entender la magnitud del proyecto.
* **Componentes Visuales:**
  * Kicker superior con coordenadas satelitales clicables (`📍 9°53'20"N 69°35'35"W · Valle de Quíbor, Lara`).
  * Título de alto impacto: *"Reactivación Técnica de Casa de Malla (1.000 m²)"*.
  * Subtítulo con parámetros: Población de 2.500 plantas de Pimentón Magistral F1 en 10 camellones dobles.
  * **3 Tarjetas de Resumen Rápido:**
    1. *Cosecha Proyectada:* 13.0 Toneladas (650 cestas de 20 kg).
    2. *Utilidad 1er Ciclo:* +$2.765 USD (amortizando 100% de adecuación, malla e insumos).
    3. *Utilidad Recurrente (2do Ciclo+):* +$5.300 USD / ciclo (+139% ROI operativo).
  * **Botones de Llamado a la Acción (CTA):**
    * `[ 💰 Calculadora de Inversión ]` ➔ Salto suave a `#calculadora-reactivacion`.
    * `[ 💧 Proyecto Pozo Profundo ]` ➔ Redirección a `/proyecto-pozo-profundo`.

---

### Módulo 2: `AgronomicLayoutSection.tsx`
* **Propósito:** Demostrar rigor agronómico y espacial para 2.500 plantas, eliminando dudas sobre la viabilidad física del espacio.
* **Datos Clave Presentados:**
  * **Marco de Siembra:** Camellón elevado a 0.25m, 1.20m de ancho de cama, 0.80m de pasillo (2.00m entre ejes).
  * **Doble Hilera:** 2 líneas por camellón separadas a 0.50m; plantas a 0.40m al tresbolillo.
  * **Red de Riego Sincronizada 1:1:** Cada planta tiene su propio emisor autocompensante (PC/AS) de 1.60 L/h, garantizando que ninguna planta reciba más agua o fertilizante que otra.
  * **Sectores Hidráulicos:** Sector Norte (Camellones 1–5, 1.250 pl, 2.000 L/h) y Sector Sur (Camellones 6–10, 1.250 pl, 2.000 L/h).

---

### Módulo 3: `FertigationPlanSection.tsx`
* **Propósito:** Justificar técnicamente la inversión en sales solubles AIFA, Semilla Magistral F1 y Ácido Nítrico para aguas salinas de Quíbor.
* **Componentes Principales:**
  1. **Grilla de 4 Tanques de Nutrición:**
     * *Tanque A (1.000 L):* Nitrato de Calcio (15.5-0-0 + 26 CaO) + Quelato de Hierro EDDHA 6% ($500 USD). Crea pared celular de 8–10 mm y erradica el culillo.
     * *Tanque B (1.000 L):* Nitrato de Potasio 13-0-46 + Fosfato Monopotásico (MKP) + Sulfato de Magnesio ($880 USD). Llena 4 lóbulos pesados (>220g).
     * *Tanque C (200 L - Regulador de pH):* Ácido Nítrico al 60% (224 L / ciclo a $220 USD). Neutraliza bicarbonatos del pozo (pH 8.0) y fija el pH de riego en **5.8 – 6.2**, desbloqueando el 100% del Calcio.
     * *Semilla Magistral F1:* 3 sobres × 1.000 semillas ($450) + bandejas/sustrato ($150) = $600 USD.
  2. **Panel de Clasificación de la Cesta en Venezuela:**
     * 🟢 *Pimentón Grande:* **$14.00 USD / cesta** ($0.70/kg). Meta AIFA: 88%.
     * 🟡 *Pimentón Mediano:* **$8.00 USD / cesta** ($0.40/kg). AIFA: 12% vs Granulado: 45%.
     * 🔴 *Maraña (Descarte):* **$3.50 USD / cesta** ($0.17/kg). AIFA: **0% (Erradicada)** vs Granulado: **30% (Ruina)**.
  3. **Matriz de Rentabilidad de Doble Vista (Agri-UX):**
     * **Modo `[ 📊 Comparativa Cara a Cara ]`:** Dos tarjetas confrontadas (Granulado vs AIFA) con desglose de cestas, facturación y margen neto.
     * **Modo `[ 📋 Tabla Detallada ]`:** Auditoría contable en 4 capítulos: (1) Calidad de Fruto, (2) Facturación, (3) Insumos ($2.740 vs $1.480) y (4) Margen Neto Libre (**$6.360 vs $2.345 USD ➔ +$4.015 USD LIBRES**).
     * **Eficiencia del Dólar Extra:** Recuperas **$3.19 USD netos libres por cada $1.00 adicional invertido**.
  4. **Infografía "La Lógica en 3 Pasos":** Explica cómo $1.260 USD de insumos adicionales eliminan la maraña y aumentan el ingreso bruto en +$5.275 USD.

---

### Módulo 4: `TrellisEspalderaSection.tsx`
* **Propósito:** Resolver el colapso mecánico de ramas por sobrepeso frutal y prevenir la dispersión de virus (ToBRFV).
* **Solución Técnica:**
  * Malla Espaldera tipo cajón (Hortomalla de polipropileno blanco 15×15 cm, 500 m lineales en 2 niveles a 0.50m y 0.90m).
  * Soporta los **13.000 kg** de carga sin desgajar las ramas dicotómicas en "Y".
  * **Ahorro de Mano de Obra:** Reduce de 8 jornales/mes (amarre con rafia manual) a solo 1 jornal/mes (**85% de ahorro laboral**).
  * **Blindaje Sanitario ToBRFV:** Cero contacto manual con la planta, evitando transmisión mecánica de virosis.
  * **Colchón Térmico:** Dosel vegetal a 1.20 m deja un buffer de **1.80 m de aire libre** hasta el alero de 3.00 m, evitando temperaturas >32 °C.

---

### Módulo 5: `BioclimaticMeshSection.tsx`
* **Propósito:** Especificar el despiece, termodinámica y refuerzo eólico de la cubierta perimetral y cenital.
* **Especificaciones:**
  * **Material:** Malla anti-insectos **50 Mesh (50×25 hilos/pulgada), 130 gsm, HDPE Monofilamento Virgen Blanco**, con aditivo UV a 720 KLY. Apertura de poro $\le 192\ \mu\text{m}$. Alta tenacidad mecánica ($1.530\text{ N / 5cm}$) calibrada para la fricción sobre postes de parral Sch 40 y ráfagas del Este en Quíbor.
  * **Despiece Exacto para 1.000 m²:** **4 rollos de 4.00 m × 100.00 m** (1.600 m² brutos con solapes de 0.30m y anclaje en zanja perimetral de 0.40m). Inversión en Venezuela: **$560 USD en efectivo por rollo** ($4 \times \$560 = \mathbf{\$2.240\text{ USD}}$).
  * **Ingeniería Eólica de Quíbor:** El 88% de los vientos proviene del **ESTE** con ráfagas de diseño de hasta **27 km/h**. La fachada Este requiere doble pilar y tensores de guaya galvanizada de 3/8" con tornillo ojo-ojo.
  * **Calculadora Modular Integrada:** Permite al usuario ingresar otras dimensiones de nave (ancho, largo, altura) y calcular rollos y metros cuadrados automáticamente.

---

### Módulo 6: `InvestmentCalculatorSection.tsx`
* **Propósito:** El corazón financiero de la aplicación. Permite al productor simular ingresos, alterar costos y generar cotizaciones para WhatsApp.
* **Variables de Entrada:**
  * `sellingPricePerKg` (Slider: $0.50 a $1.50 USD/kg; Defecto: **$0.70 USD/kg = $14.0 USD / cesta grande**).
  * `targetYieldKg` (Slider: 9.000 a 15.000 kg; Defecto: **13.000 kg = 650 cestas = 5.20 kg/pl**).
  * `productionCostInput` (Campo editable: Defecto **$4.755 USD** con botón para resetear).
* **Desglose Exhaustivo de los 15 Rubros de Producción y Adecuación ($4.755 USD):**
  1. Semilla Híbrida Magistral F1 ($450 USD)
  2. Germinación en bandejas 128 celdas + Peat Moss ($150 USD)
  3. Preparación de tierra tractor rastra/camellones ($180 USD)
  4. Mano de obra siembra y trasplante 2.500 plantas ($80 USD)
  5. Abonos AIFA 100% hidrosolubles 20 semanas ($1.380 USD)
  6. Regulador de pH Ácido Nítrico 60% 224L ($220 USD)
  7. Venenos plagas y hongos preventivo/curativo ($540 USD)
  8. Cisternas de agua 10.000L ($20/viaje × 40 viajes = $800 USD)
  9. Fondo blanco cuñete anticorrosivo para estructura ($75 USD)
  10. Mano de obra pintar 108 pilares Sch 40 ($120 USD)
  11. Mano de obra colocar y tensar Malla 50 Mesh ($180 USD)
  12. Manguera matriz PEAD conexión goteo ($120 USD)
  13. Rollo cinta goteo 2.500 pl a 40cm 1.000m ($180 USD)
  14. Conectores iniciales con válvula y gomas grommet ($60 USD)
  15. 3 tanques agua fertirriego A, B, C ($220 USD)
* **Capex de Materiales Físicos:** Malla 50 Mesh 130 gsm (4 rollos @ $560 USD efectivo = $2.240 USD) + Hortomalla 15x15 ($380 USD) = **$2.620 USD**.
* **Deducciones Totales 1er Ciclo:** $4.755 + $2.620 = **$7.375 USD**.
* **Resultados Matemáticos en Tiempo Real:**
  * **Ingreso Bruto:** $13.000\text{ kg} \times \$0.70 = \mathbf{\$9.100\text{ USD}}$ (650 cestas a $14 USD/cesta).
  * **Utilidad Neta Libre 1er Ciclo:** $\$9.100 - \$7.375 = \mathbf{+\$1.725\text{ USD}}$ (**+23.4% ROI** amortizando toda la estructura, pintura, tanques, mangueras, hortomalla y los 4 rollos de malla 130 gsm).
  * **Utilidad Neta Recurrente (2do Ciclo en adelante):** Sin volver a pintar, ni comprar malla, tanques ni mangueras (Gasto operativo = $3.800 USD):
    $$\text{Utilidad 2do Ciclo} = \$9.100 - \$3.800 = \mathbf{+\$5.300\text{ USD / ciclo}}\quad (\mathbf{+139.5\%\text{ ROI}})$$
* **Integración WhatsApp:** Botón `[ 📲 Enviar Plan a Mi Asesor ]` que codifica la cotización matemática completa en la URL de WhatsApp.

---

### Módulo 7: `PozoDeepBanner.tsx`
* **Propósito:** Segregación estratégica de contenido. La Index se mantiene 100% limpia de datos de pozos para no confundir al usuario, pero ofrece un banner llamativo que redirige a `/proyecto-pozo-profundo`.
* **Diseño:** Fondo contrastante con icono de gota de agua, resaltando la perforación a 100m, 120m y 150m y botón con flecha a la landing especializada.

---

## 5. Sistema de Diseño Agri-UX/UI y Tokens de Estilo

Para mantener la estética profesional y evitar errores de contraste bajo sol intenso en campo, se deben aplicar las siguientes reglas de diseño definidas en `src/styles/global.css`:

### 5.1. Paleta Cromática Agrícola Oficial (Logo Agrovenecua)
* **Verde Acción Primario (Botones y KPIs):** `#248a15` (Contraste WCAG AAA con texto blanco).
* **Verde Profundo (Títulos de Autoridad):** `#0F4D06` (Verde bosque para máxima agudeza visual).
* **Verde Clorofila (Resaltes y Acentos):** `#53C942`.
* **Fondo General Solicitado:** `#f3f3f3`.
* **Superficie de Tarjetas:** `#ffffff`.
* **Azul Agua (Riego y Pozos):** `#0284c7`.
* **Rojo Alerta (Maraña y Salinidad):** `#dc2626`.

### 5.2. Regla Fundamental de Fondos Suaves (Bugfix Documentado)
> [!WARNING]
> **Nunca utilizar `bg-opacity-5` en Bootstrap 5**, ya que esta clase no está definida nativamente en el compilador CSS. El navegador ignorará la opacidad y renderizará un fondo **verde oscuro o rojo sólido**, haciendo que el texto coloreado interior se vuelva invisible.
> 
> **Usar siempre las clases seguras creadas en `global.css`:**
> * `.bg-agro-success-soft` $\rightarrow$ `background-color: #f0fdf4 !important;` (Verde menta suave).
> * `.bg-agro-danger-soft` $\rightarrow$ `background-color: #fef2f2 !important;` (Rosa pastel suave).
> * `.bg-agro-warning-soft` $\rightarrow$ `background-color: #fffbeb !important;` (Ámbar suave).
> * `.bg-agro-info-soft` $\rightarrow$ `background-color: #f0f9ff !important;` (Azul cielo suave).

### 5.3. Ritmo de Secciones Alternadas
Para que el usuario distinga intuitivamente el cambio de tema al desplazarse:
* Sección Impar (Hero, Tutorado, Calculadora): Fondo `#ffffff` (`.section-agro-white`).
* Sección Par (Distribución, Fertirriego, Malla): Fondo `#f3f3f3` (`.section-agro-alt`).

---

## 6. Procedimiento Paso a Paso para Replicar este Proyecto en Otro Predio

Si se desea replicar este proyecto para otra finca, otro tamaño de invernadero o en otra región geográfica, siga este protocolo de 5 pasos:

### Paso 1: Configuración de la Línea Base Geográfica y Climática
1. Obtenga las coordenadas satelitales del nuevo predio en Google Maps.
2. Consulte la base de datos NASA MERRA-2 o estación meteorológica local más cercana:
   * Régimen de vientos (velocidad media y dirección dominante para orientar los anclajes).
   * Temperatura máxima diurna (si supera 34 °C, verificar que la altura al alero sea $\ge 3.0\text{ m}$).
   * Calidad de agua de riego (si la conductividad eléctrica $EC_w > 1.2\text{ dS/m}$, incluir dosis obligatoria de Ácido Nítrico en el Tanque C).
3. Actualice las coordenadas en el Kicker de `ReactivationHero.tsx` y en el `Navbar.tsx`.

### Paso 2: Parametrización Agronómica y Modular
1. En `AgronomicLayoutSection.tsx`:
   * Ingrese el ancho y largo de la nueva nave.
   * Calcule el número de camellones dobles a 2.00 m entre ejes.
   * Calcule la población total de plantas a 0.40 m de distancia ($N_{\text{plantas}}$).
2. Verifique que la red hidráulica mantenga la relación 1:1 ($N_{\text{goteros}} = N_{\text{plantas}}$).

### Paso 3: Calibración del Plan de Fertirriego y Cestas
1. En `FertigationPlanSection.tsx`:
   * Actualice la cotización vigente de la cesta de 20 kg en el mercado mayorista de destino (ej. $14.0 USD / cesta grande).
   * Ajuste la proporción de Pimentón Grande, Mediano y Maraña según la genética a sembrar.
   * Ajuste las proporciones de sacos en Tanque A y B según los kilogramos de fruto proyectados.

### Paso 4: Ajuste de Costos Operativos y Materiales
1. En `InvestmentCalculatorSection.tsx`:
   * Actualice los 15 ítems del `defaultCostItems`:
     * Precio local de los viajes de cisterna de agua dulce.
     * Costo de jornales locales (siembra, pintura, colocación de malla).
     * Precio de la semilla certificada en la agropecuaria local.
   * Ajuste el metraje de malla requerido en caso de cambiar las dimensiones físicas.
2. Verifique que el cálculo de retorno del 1er Ciclo y 2do Ciclo refleje los nuevos insumos.

### Paso 5: Despliegue y Ejecución
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Iniciar servidor de desarrollo en vivo:
   ```bash
   npm run dev
   ```
3. Compilar para producción:
   ```bash
   npm run build
   ```
   Los archivos estáticos listos para desplegar en cualquier servidor (Vercel, Netlify, Nginx o Apache) se generarán en la carpeta `dist/`.

---

## 7. Fórmulas de Cálculo Empleadas en el Proyecto

A continuación se presentan las ecuaciones matemáticas empleadas en el código para su consulta y programación en otros lenguajes:

1. **Cálculo de Cestas Totales:**
   $$N_{\text{cestas}} = \text{round}\left(\frac{\text{targetYieldKg}}{20}\right)$$

2. **Ingreso Bruto de Cosecha ($):**
   $$\text{GrossRevenue} = \text{targetYieldKg} \times \text{sellingPricePerKg} = N_{\text{cestas}} \times (\text{sellingPricePerKg} \times 20)$$

3. **Inversión Total 1er Ciclo ($):**
   $$\text{TotalDeductions}_{1\text{er Ciclo}} = \text{productionCost} + \text{capexMateriales}$$

4. **Utilidad Neta Libre 1er Ciclo ($):**
   $$\text{NetProfit}_{1\text{er Ciclo}} = \text{GrossRevenue} - \text{TotalDeductions}_{1\text{er Ciclo}}$$

5. **Retorno sobre Inversión (ROI %):**
   $$\text{ROI} = \left(\frac{\text{NetProfit}_{1\text{er Ciclo}}}{\text{TotalDeductions}_{1\text{er Ciclo}}}\right) \times 100$$

6. **Utilidad Neta Recurrente (2do Ciclo en adelante, $):**
   $$\text{NetProfit}_{2\text{do Ciclo}} = \text{GrossRevenue} - \text{OpexRecurrente}$$
   *(Donde $\text{OpexRecurrente}$ excluye compras de malla, tanques, mangueras y pintura).*

7. **Eficiencia del Dólar Extra (Retorno Insumos AIFA vs Granulado):**
   $$\text{RatioRetorno} = \frac{\Delta \text{MargenNeto}}{\Delta \text{InversiónInsumos}} = \frac{\$6.360 - \$2.345}{\$2.740 - \$1.480} = \frac{\$4.015}{\$1.260} = \mathbf{3.19 : 1}$$

---
*Fin del documento técnico de replicabilidad.*
