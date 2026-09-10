# 🌱 LA CIGARRONERA — Suite Agrotecnológica & Plan de Inversión

<div align="center">
  <img src="assets/logo/agrovenecua_logo.svg" alt="Agrovenecua Logo" width="130">
  <h3>AGROVENECUA INGENIERÍA</h3>
  <p><strong>Horticultura Protegida, Hidrogeología & Climatología de Precisión — Valle de Quíbor, Lara, Venezuela</strong></p>
  <p>
    <a href="landing.html"><strong>🚀 Abrir Landing Page de Inversión</strong></a> •
    <a href="index.html"><strong>⚙️ Abrir Suite Técnica Cockpit</strong></a> •
    <a href="docs/README.md"><strong>📚 Documentación Técnica</strong></a> •
    <a href="GUIA_REPLICACION_INDEX_REACTIVACION.md"><strong>📖 Guía Maestra de Replicación Index</strong></a>
  </p>
</div>

---

## 📍 Resumen Ejecutivo del Proyecto

**La Cigarronera** es un desarrollo agroproductivo de alta eficiencia situado en **Cuara, Municipio Jiménez, Estado Lara, Venezuela** ($9^\circ 53' 20.0''\ \text{N},\ 69^\circ 35' 35.0''\ \text{W}$, elevación base ~700 msnm), en pleno corazón del **Valle de Quíbor**.

El proyecto integra:
1. **Casa de Malla Tecnificada (1.000 m²):** Estructura de parral plano tensado en acero Sch 40 con malla anti-insectos monofilamento virgen **110 gsm, 50 mesh blanco** ($\le 192\ \mu\text{m}$) que previene el sobrecalentamiento interno (>31.5 °C), difumina la luz solar y bloquea el 100% de vectores plaga.
2. **Activo Hídrico Subterráneo Estratégico:** Pozo artesanal excavado verticalmente a pico hasta **50 metros de profundidad** en paredes autoportantes a tierra viva (con estribos intactos y cero colapso), con nivel estático comprobado a **49.5 m** y piso en manto de grava permeable con cuarzo cristalino y lidita.
3. **Plan de Inversión Llave en Mano ($4.000 USD):** Culminación de los últimos **10 metros** (de 50 a 60 m) con martillo eléctrico industrial de demolición, revestimiento en 60 anillos de concreto reforzado $f'c = 210\text{ kg/cm}^2$, y equipamiento electromecánico integral.
4. **Retorno de Inversión Excepcional:**
   * **Pimentón (*Capsicum annuum*):** 2.500 plantas, 12.5 Ton/ciclo a **$0.90 USD/kg** = **$11.250 USD brutos** / **$6.750 USD netos** por ciclo. Payback del pozo en **menos de 4 meses** (168% de ROI en el primer ciclo).
   * **Tomate Indeterminado (*Solanum lycopersicum*):** 2.200 plantas tutoradas en Hortomalla a 2.0 m, 17.6 Ton/ciclo = **$14.960 USD brutos** / **$9.460 USD netos** por ciclo.

---

## 🗂️ Arquitectura del Repositorio

```text
invernadero/
├── landing.html              # Landing page ejecutiva para inversores (Three.js 3D Well Viewer)
├── index.html                # Cockpit agronómico integral (Suite de 5 etapas técnicas)
├── README.md                 # Documentación maestra del repositorio
├── manifest.webmanifest      # PWA Manifest para instalación offline en móviles/tablets
├── sw.js                     # Service Worker para funcionamiento 100% offline en campo
├── sitemap.xml               # Mapa de sitio optimizado para indexación web
│
├── src/                      # Código fuente organizado de la aplicación
│   ├── js/
│   │   ├── app.js            # Lógica agronómica, cálculo FAO-56, reactividad y simuladores
│   │   ├── well-3d.js        # Motor Three.js WebGL: Render interactivo 3D del pozo artesanal
│   │   └── greenhouse-3d.js  # Motor Three.js WebGL: Render interactivo 3D de la casa de malla
│   └── css/
│       ├── styles.css        # Sistema de diseño Agro-Dark con tokens oficiales Agrovenecua
│       └── landing.css       # Estilos específicos de alta gama para la landing page
│
├── assets/                   # Recursos gráficos vectoriales y multimedia
│   ├── logo/                 # Logotipos oficiales Agrovenecua e iconos PWA
│   │   ├── agrovenecua_logo.svg  # Logo oficial (Verde #53C942 y #0F4D06)
│   │   ├── icon-192.svg
│   │   └── icon-512.svg
│   └── svg/                  # Planos constructivos 2D y 3D en SVG
│       ├── plano_2d_invernadero_quibor.svg
│       └── plano_3d_invernadero_quibor.svg
│
├── data/                     # Conjuntos de datos estructurados en formato JSON
│   ├── climate-quibor.json   # Series temporales NASA MERRA-2 y parámetros eólicos
│   └── project-config.json   # Ficha técnica maestra, presupuestos y modelos ROI
│
├── docs/                     # Documentación técnica de ingeniería organizada por disciplinas
│   ├── README.md             # Índice temático de documentos técnicos
│   ├── 01-bioclima/          # Climatología MERRA-2, vientos del Este y extractores eólicos
│   ├── 02-estructura/        # Memoria de cálculo de malla 110 gsm 50 mesh y despiece
│   ├── 03-hidrogeologia/     # Planes de inversión del pozo artesanal y estratigrafía
│   └── 04-produccion/        # Planes maestros de cultivo para 1.000 m² y 2.000 m²
│
├── lib/                      # Librerías de terceros (Zero-CDN, offline first)
│   ├── three.min.js          # Three.js r128 WebGL Engine
│   └── OrbitControls.js      # Control orbital de cámara para inspección 3D
│
└── RAG/                      # Evidencias de campo (Fotografías y videos georreferenciados)
```

---

## 🎨 Identidad Gráfica y Sistema de Diseño

El diseño de la plataforma se rige por los colores corporativos exactos de Agrovenecua:
* **Verde Clorofila / Acento:** `#53C942` (borde del escudo y letra "A" superior).
* **Verde Bosque Profundo:** `#0F4D06` (letra "V" inferior y fondos con glassmorphism).
* **Suelo / Obsidiana:** `#090e0b` y `#0e1611` (contrastes nocturnos de alta legibilidad solar).
* **Cian Hidráulico:** `#38bdf8` (acuífero, tuberías y balance de humedad).
* **Ámbar Bioclimático:** `#f59e0b` (radiación solar y temperatura).

---

## 🚀 Cómo Ejecutar el Proyecto

El proyecto está diseñado bajo una arquitectura **Zero-Dependency & Offline-First** en Vanilla HTML5, CSS3 y JavaScript ES6+. No requiere Node.js, compilar bundlers ni conexión a internet para funcionar.

### 1. Ejecución Local Directa
Simplemente abre [`landing.html`](landing.html) o [`index.html`](index.html) en cualquier navegador moderno (Google Chrome, Microsoft Edge, Safari o Firefox).

### 2. Con Servidor Local (Opcional)
```bash
# Con Python 3
python -m http.server 8080

# Con Node.js npx
npx serve .
```
Luego accede a `http://localhost:8080/landing.html`.

---

## 👨‍🌾 Créditos y Autoría Técnica
* **Ingeniería Agronómica y Bioclimática:** Especialista Senior en Horticultura Protegida.
* **Hidrogeología y Geotecnia:** Consultor Senior en Recursos Hídricos Subterráneos del Valle de Quíbor.
* **Desarrollo Tecnológico:** Agrovenecua Ingeniería C.A. — Finca La Cigarronera.
