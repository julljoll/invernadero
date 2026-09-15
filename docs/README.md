# 📚 Archivo de Documentación Técnica — La Cigarronera (Corpus RAG)

**Ubicación:** Cuara, Valle de Quíbor, Municipio Jiménez, Estado Lara, Venezuela  
**Georreferenciación:** $9^\circ 53' 20.0''\ \text{N},\ 69^\circ 35' 35.0''\ \text{W}$ (~700 msnm) | Pozo: $9^\circ 53' 15.79''\ \text{N},\ 69^\circ 35' 37.25''\ \text{W}$ (734 msnm)  
**Entidad Responsable:** Agrovenecua Ingeniería C.A.

> [!NOTE]
> **Corpus RAG Optimizado (v3.0)**
> Esta documentación está optimizada semánticamente para ser consumida por modelos de Inteligencia Artificial mediante Retrieval-Augmented Generation (RAG). Todos los archivos `.md` incluyen metadatos YAML estandarizados y los documentos extensos contienen marcadores `<!-- chunk:ID -->` para segmentación semántica precisa.

---

## 📊 Estadísticas del Corpus RAG

| Dominio | Documentos | Descripción |
|---------|:----------:|-------------|
| **01-bioclima** | 1 | Datos NASA MERRA-2, ráfagas de viento y bochorno. |
| **02-estructura** | 1 | Cálculo y despiece de cubierta (malla anti-insecto). |
| **03-hidrogeologia**| 6 | Expedientes de pozo, aforos de caudal e investigación (Jégat-Mora). |
| **04-produccion** | 2 | Planes agronómicos detallados para 1.000 y 2.000 m². |
| **05-catalogo** | 1 | Especificaciones del fabricante (Leader Greenhouse). |
| **Compendio** | 1 | `MANUAL_CANONICO_AGROVENECUA.md` (SSoT). |

---

## 📂 Estructura de Documentos Especializados

### 1. Climatología y Bioclima (`docs/01-bioclima/`)
* **[ANALISIS_TECNICO_QUIBOR.md](01-bioclima/ANALISIS_TECNICO_QUIBOR.md)** (ID: `BIO-001`)
  * Línea base climática NASA MERRA-2 (1980-2016).
  * Rosa de vientos, dinámica de ráfagas.

### 2. Ingeniería Estructural (`docs/02-estructura/`)
* **[CALCULO_TECNICO_MALLA_2000M2.md](02-estructura/CALCULO_TECNICO_MALLA_2000M2.md)** (ID: `EST-001`)
  * Memoria de cálculo modular para rollo comercial de malla 130 gsm, 50 mesh HDPE.

### 3. Hidrogeología y Captación (`docs/03-hidrogeologia/`)
* **[EXPEDIENTE_TECNICO_POZO_50M.md](03-hidrogeologia/EXPEDIENTE_TECNICO_POZO_50M.md)** (ID: `HIDRO-001`)
  * Registro consolidado del pozo artesanal actual.
* **[ANALISIS_GEOLOGICO_ALJIBE_50M.md](03-hidrogeologia/ANALISIS_GEOLOGICO_ALJIBE_50M.md)** (ID: `HIDRO-002`)
  * Análisis de los videos de campo y estratigrafía.
* **[PLAN_INVERSION_POZO_60M.md](03-hidrogeologia/PLAN_INVERSION_POZO_60M.md)** (ID: `HIDRO-003`)
  * Plan de inversión y factibilidad técnica.
* **[PLAN_VALIDACION_POZO_PROFUNDO.md](03-hidrogeologia/PLAN_VALIDACION_POZO_PROFUNDO.md)** (ID: `HIDRO-004`)
  * Protocolo maestro de validación y aforo escalonado.
* **[VERIFICACION_CAUDAL_60M.md](03-hidrogeologia/VERIFICACION_CAUDAL_60M.md)** (ID: `HIDRO-005`)
  * Estudio técnico hidráulico y selección de bombeo.
* **[JEGAT_MORA_2012_RECARGA.md](03-hidrogeologia/JEGAT_MORA_2012_RECARGA.md)** (ID: `HIDRO-006`)
  * Paper científico base sobre el Acuífero del Valle de Quíbor.

### 4. Operación Agronómica (`docs/04-produccion/`)
* **[PLAN_TOMATE_1000M2.md](04-produccion/PLAN_TOMATE_1000M2.md)** (ID: `PROD-001`)
  * Plan maestro para 1.000 m² (2.200 plantas).
* **[PLAN_TOMATE_2000M2.md](04-produccion/PLAN_TOMATE_2000M2.md)** (ID: `PROD-002`)
  * Plan maestro para 2.000 m² (4.400 plantas).

### 5. Catálogos Comerciales (`docs/05-catalogo/`)
* **[LEADERGREENHOUSE_PRODUCTOS.md](05-catalogo/LEADERGREENHOUSE_PRODUCTOS.md)** (ID: `CAT-001`)
  * Base de datos de productos de mallas, plásticos y mallas de sombra.

### 6. Multimedia (No RAG) (`docs/multimedia/`)
* Contiene fotos georreferenciadas y catálogos PDF en crudo. No indexables directamente como texto para el RAG.
  * `/mallas`
  * `/pozo-cigarronera`

### 7. Documento Canónico Central
* **[MANUAL_CANONICO_AGROVENECUA.md](MANUAL_CANONICO_AGROVENECUA.md)** (ID: `CANON-001`)
  * El Compendio Unificado (Single Source of Truth) para todo el ecosistema.

---

## 🤖 Guía para Pipelines de Embeddings (LLM / RAG)

1. **Manifest File**: El archivo `rag_manifest.json` contiene el inventario completo, IDs y relaciones entre los documentos.
2. **Chunking**: Use expresiones regulares sobre los comentarios HTML `<!-- chunk:ID/CX title:"..." tokens:~N -->` para segmentar los archivos grandes.
3. **Metadatos**: Todo archivo `.md` (excepto este README) posee YAML frontmatter que debe ser parseado e insertado en la base de datos vectorial como metadata del chunk.

