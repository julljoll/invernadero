# 📚 Archivo de Documentación Técnica — La Cigarronera

**Ubicación:** Cuara, Valle de Quíbor, Municipio Jiménez, Estado Lara, Venezuela  
**Georreferenciación:** $9^\circ 53' 20.0''\ \text{N},\ 69^\circ 35' 35.0''\ \text{W}$ (~700 msnm) | Pozo: $9^\circ 53' 15.79''\ \text{N},\ 69^\circ 35' 37.25''\ \text{W}$ (734 msnm)  
**Entidad Responsable:** Agrovenecua Ingeniería C.A.

---

## Estructura de Documentos Especializados

### 1. Climatología y Bioclima (`docs/01-bioclima/`)
* **[ANALISIS_TECNICO_QUIBOR.md](01-bioclima/ANALISIS_TECNICO_QUIBOR.md)**
  * Línea base climática NASA MERRA-2 (1980-2016).
  * Rosa de vientos (88% componente Este anual, ráfagas de diseño 27 km/h, $\alpha = 0.16$ de Hellmann).
  * Termodinámica de casas de malla y termorregulación convectiva natural.
  * Análisis de extractores eólicos cenitales (efecto chimenea vs. renovación eólica).

### 2. Ingeniería Estructural y Fitosanidad (`docs/02-estructura/`)
* **[CALCULO_TECNICO_TOMATE_QUIBOR.md](02-estructura/CALCULO_TECNICO_TOMATE_QUIBOR.md)**
  * Memoria de cálculo modular para rollo comercial de malla 110 gsm, 50 mesh HDPE monofilamento blanco ($4.00\text{ m} \times 100.00\text{ m}$).
  * Plan de corte con 100% de aprovechamiento (cero desperdicios en cubierta).
  * Matriz de resistencia estática y dinámica a vientos del Este con factor de seguridad $\ge 1.5$.
  * Exclusión biológica ($\le 192\ \mu\text{m}$) contra mosca blanca, trips y pulgones.

### 3. Hidrogeología y Captación de Agua Subterránea (`docs/03-hidrogeologia/`)
* **[PLAN_INVERSION_POZO_ARTESANAL_CUARA.md](03-hidrogeologia/PLAN_INVERSION_POZO_ARTESANAL_CUARA.md)**
  * Plan de inversión llave en mano ($4.000 USD) para la culminación artesanal del pozo existente de 50 m a 60 m.
  * Presupuesto itemizado: excavación manual con martillo eléctrico industrial ($2.000 USD), encofrado in-situ con 60 anillos de concreto f'c = 210 kg/cm² ($1.200 USD), y equipamiento electromecánico integral ($800 USD).
  * Retorno de inversión (ROI) con cultivo intensivo de pimentón ($0.90/kg) y tomate indeterminado.
* **[ANALISIS_GEOLOGICO_ALJIBE_50M_CUARA.md](03-hidrogeologia/ANALISIS_GEOLOGICO_ALJIBE_50M_CUARA.md)**
  * Registro de campo audiovisual del aljibe a 50 metros (videos y fotografías georreferenciadas).
  * Estratigrafía confirmada: 0-8m conglomerado aluvial, 8-48m acuitardo arcilloso autoportante sin colapso, 48-50m techo del acuífero con grava de lidita y cuarzo cristalino.
  * Nivel estático a 49.5 m con rezumo activo insaciable a tobo.
* **[PLAN_VALIDACION_POZO_PROFUNDO_QUIBOR.md](03-hidrogeologia/PLAN_VALIDACION_POZO_PROFUNDO_QUIBOR.md)**
  * Protocolo integral de aforo escalonado Jacob y certificación hidroquímica de salinidad ($EC_w$).
  * Comparativa de 5 escenarios hidrogeológicos de captación en el acuífero de Quíbor.

### 4. Operación Agronómica y Producción Intensiva (`docs/04-produccion/`)
* **[PLAN_PRODUCCION_TOMATE_1000M2_QUIBOR.md](04-produccion/PLAN_PRODUCCION_TOMATE_1000M2_QUIBOR.md)**
  * Plan de producción para casa de malla de 1.000 m² (2.200 plantas en 10 camellones dobles).
  * 2 sectores hidráulicos balanceados (2.00 m³/h c/u) con bomba de 1.5 HP.
  * Tutorado Hortomalla 15x15 cm con topping a 2.00 m (-88% mano de obra).
  * Rendimiento meta: 16.5 a 18.7 toneladas de tomate de primera.
* **[PLAN_PRODUCCION_TOMATE_2000M2_QUIBOR.md](04-produccion/PLAN_PRODUCCION_TOMATE_2000M2_QUIBOR.md)**
  * Plan de escalamiento para 2.000 m² (4.400 plantas, 3 sectores hidráulicos, 28.6 a 37.4 Ton).

### 5. Suite Frontend y Embudo de Reactivación (`/`)
* **[GUIA_REPLICACION_INDEX_REACTIVACION.md](../GUIA_REPLICACION_INDEX_REACTIVACION.md)**
  * Guía maestra para replicar el embudo de reactivación de 1.000 m² (2.500 plantas de pimentón Magistral F1).
  * Arquitectura técnica de los 7 módulos de la Index, sincronía dimensional 1:1 y sistema de diseño Agri-UX/UI.
  * Clasificación comercial de cestas en Venezuela (Grande $14, Mediana $8, Maraña $3.5) y erradicación de descarte.
  * Desglose exhaustivo de los 15 rubros operativos y fórmulas matemáticas de retorno.

