# 🏗️ Plan Estratégico de Reorganización y Rediseño UI/UX (La Cigarronera v4.0)

Este documento maestro establece el plan de acción paso a paso, nivel Senior/Arquitecto, para refactorizar la suite *La Cigarronera*. El objetivo es implementar una arquitectura escalable, un diseño UI/UX minimalista (AgriTech Premium) optimizado para pantallas de laptop (13" a 15"), y garantizar que ninguna pieza de código heredado afecte el rendimiento.

---

## 🟢 ETAPA 1: Auditoría y Reestructuración Arquitectónica (Semana 1)
**Objetivo:** Limpiar la deuda técnica del monorepo y establecer un estándar estricto basado en **Feature-Sliced Design (FSD)**.

*   **Paso 1.1: Limpieza de Raíz y Metadatos.**
    *   Eliminar permanentemente remanentes de repositorios legados (`vivero-react`, `vivero-pimenton-web`).
    *   Consolidar configuración de `vite.config.ts`, `tsconfig.json` y `package.json` para eliminar dependencias huérfanas o duplicadas.
*   **Paso 1.2: Implementación de Feature-Sliced Design (FSD).**
    *   Reorganizar `src/` en capas estrictas:
        *   `src/app/` (Configuración global, providers, router).
        *   `src/pages/` (Composición de páginas: Landing, Cockpit, VisorCAD).
        *   `src/widgets/` (Bloques de UI complejos: Navbar, Footer, Paneles de Control).
        *   `src/features/` (Lógica de negocio: calculadoras, CAD, auth).
        *   `src/shared/` (Componentes base, UI kits, utilidades, hooks).
*   **Paso 1.3: Alias de TypeScript.**
    *   Configurar rutas absolutas (`@/`, `@pages/`, `@widgets/`) para evitar el "infierno de imports relativos" (`../../../../`).

---

## 🟢 ETAPA 2: Sistema de Diseño (Design System) Minimalista (Semana 2)
**Objetivo:** Crear un motor visual coherente, premium y minimalista, basado en los colores de la marca y optimizado para el formato apaisado (16:9) de las laptops.

*   **Paso 2.1: Definición de Design Tokens.**
    *   **Color Primario:** Agronomía Premium (`#53C942`).
    *   **Fondos:** Transición del negro puro a grises técnicos (ej. `#0F172A`, `#1E293B`) para reducir fatiga visual en laptops.
    *   **Acentos:** Blanco clínico y transparencias (Glassmorphism sutil).
*   **Paso 2.2: Tipografía Técnica.**
    *   Implementar fuentes de alta legibilidad numérica (ej. *Inter* o *Geist*) para datos agronómicos y *JetBrains Mono* para métricas/CAD.
*   **Paso 2.3: Reescritura del `index.css` (Tailwind / CSS Modules).**
    *   Eliminar el CSS global desordenado.
    *   Crear clases utilitarias para componentes base: *Botones primarios fantasma*, *Tarjetas con blur*, *Tablas de datos compactas*.
*   **Paso 2.4: Layout Orientado a Laptops (1024px - 1440px).**
    *   Establecer contenedores fluidos con máximos definidos (`max-w-7xl`).
    *   Cambiar los "scrolls infinitos" verticales por layouts de **Dashboard/Grid** (Sidebar lateral y contenido a la derecha) para aprovechar el ancho de las laptops sin requerir tanto scroll.

---

## 🟢 ETAPA 3: Rediseño de Interfaces Core (Semana 3)
**Objetivo:** Refactorizar cada pantalla utilizando el nuevo sistema de diseño, enfocándose en la revelación progresiva de información (UX minimalista).

*   **Paso 3.1: Rediseño de la Landing Page (`Index`).**
    *   **Hero Section:** Cambiar el fondo recargado por un modelo 3D sutil o un render CAD abstracto en un lateral. Textos grandes, limpios, con mucho espacio en blanco (Negative Space).
    *   **Navegación:** Un Navbar tipo "píldora" flotante en la parte superior.
*   **Paso 3.2: Rediseño del `Cockpit Técnico`.**
    *   Transformar la interfaz actual de tarjetas apiladas en un **Grid Béntico (Bento Box)**.
    *   Agrupar calculadoras, clima y finanzas en cuadrantes ordenados.
    *   Reducir el tamaño de las fuentes secundarias para que más datos quepan en la pantalla de laptop sin sentirse abarrotado.
*   **Paso 3.3: Refinamiento del `Visor CAD (vivero-cad)`.**
    *   Hacer que el visor 3D ocupe el 100% del alto de la ventana de la laptop (`100vh`).
    *   Mover los controles y botones de Remotion a un panel lateral colapsable (Offcanvas) o flotante sobre el canvas (HUD estilo videojuego).

---

## 🟢 ETAPA 4: Optimización Técnica y Renderizado (Semana 4)
**Objetivo:** Mejorar los TTI (Time to Interactive) y reducir el consumo de RAM, vital para laptops que puedan no tener tarjetas gráficas dedicadas.

*   **Paso 4.1: Lazy Loading y Code Splitting Agresivo.**
    *   Asegurar que OpenCASCADE (`react-cad`) y `Remotion` **solo** se carguen al entrar a la ruta `/vivero-cad` mediante `React.lazy()` y `Suspense`.
    *   Extraer dependencias masivas (Three.js, Chart.js) en chunks separados (ya iniciado, pero requiere afinamiento).
*   **Paso 4.2: Gestión de Estado (Zustand/Context).**
    *   Eliminar el "prop drilling" profundo.
    *   Implementar una tienda global ligera (ej. Zustand) para manejar la configuración del vivero que se comparte entre el CAD y el Cockpit.
*   **Paso 4.3: Memoización de Componentes (React 18).**
    *   Aplicar `React.memo` y `useMemo` a gráficas matemáticas complejas y renders 3D para evitar re-renders innecesarios al navegar por el panel.

---

## 🟢 ETAPA 5: Calidad (QA), Testing y Despliegue Final
**Objetivo:** Confirmar que la reorganización no rompió la lógica matemática y desplegar a producción.

*   **Paso 5.1: Auditoría TypeScript estricta.**
    *   Habilitar gradualmente `strict: true` en toda la base de código.
    *   Reemplazar `any` por interfaces concretas de agronomía (`IPlanta`, `IClima`, `IModeloEstructural`).
*   **Paso 5.2: Pruebas de Estrés en Laptop.**
    *   Simular throttling (CPU x4 slowdown) en Chrome DevTools para medir el rendimiento del ReactCAD en laptops estándar.
*   **Paso 5.3: Commit Maestro y Push a Producción.**
    *   Creación del release canditate (v4.0.0).
    *   Despliegue a Vercel con pre-cálculo estático de la landing page (SSG).

---

> *Este documento actuará como nuestra brújula. Haz clic en "Proceed" si estás de acuerdo con la visión, para iniciar de inmediato con la **ETAPA 1 (Auditoría y Reestructuración)*.*
