# Snippets de Código Agronómico y Funciones de Producción

Este documento contiene algoritmos y utilidades probadas en **Python** y **TypeScript** para cálculos agronómicos en producción.

---

## 1. Módulo Python: Psicrometría, VPD y Riego

```python
"""
agri_microclimate.py
Utilidades psicrométricas, bioclimáticas y cálculo de riego para invernaderos.
"""
import math
from typing import Dict, Any, Tuple

def calcular_psicrometria(temp_aire: float, hr_pct: float, temp_hoja: float = None) -> Dict[str, Any]:
    """
    Calcula presión de saturación, presión real de vapor, punto de rocío y VPD.
    
    Args:
        temp_aire: Temperatura del aire en °C
        hr_pct: Humedad relativa en % (0 - 100)
        temp_hoja: Opcional. Temperatura foliar en °C. Si es None, se estima (temp_aire - 1.8°C).
    
    Returns:
        Diccionario con es, ea, t_rocio, vpd_aire, vpd_foliar y diagnostico_estado.
    """
    # 1. Presión de saturación (Tetens, en kPa)
    es_aire = 0.61078 * math.exp((17.27 * temp_aire) / (temp_aire + 237.3))
    
    # 2. Presión real de vapor (kPa)
    ea = es_aire * (hr_pct / 100.0)
    
    # 3. Punto de rocío (°C)
    val_ln = math.log(max(ea, 1e-5) / 0.61078)
    t_rocio = (237.3 * val_ln) / (17.27 - val_ln)
    
    # 4. VPD del aire (kPa)
    vpd_aire = es_aire - ea
    
    # 5. VPD foliar (Canopy VPD)
    t_canopy = temp_hoja if temp_hoja is not None else (temp_aire - 1.8)
    es_hoja = 0.61078 * math.exp((17.27 * t_canopy) / (t_canopy + 237.3))
    vpd_foliar = es_hoja - ea
    
    # 6. Diagnóstico fisiológico
    if vpd_foliar < 0.40:
        estado = "PELIGRO_BAJA_TRANSPIRACION_HONGO"
        accion = "Aumentar ventilación cenital / abrir cortinas laterales. Restringir riegos."
    elif 0.80 <= vpd_foliar <= 1.25:
        estado = "OPTIMO_FOTOSINTETICO"
        accion = "Condiciones ideales de transpiración y asimilación de calcio."
    elif 1.25 < vpd_foliar <= 1.55:
        estado = "ESTRES_HIDRICO_MODERADO"
        accion = "Incrementar frecuencia de pulsos de riego. Evaluar sombreo difuso."
    elif vpd_foliar > 1.55:
        estado = "ESTRES_CRITICO_ABORTOCELULAR"
        accion = "Activar nebulización (fogging), aspersores de techo o cierre de ventilación caliente."
    else:
        estado = "TRANSICION_VEGETATIVA_SUAVE"
        accion = "Monitorear evolución de radiación."
        
    return {
        "es_aire_kpa": round(es_aire, 4),
        "ea_kpa": round(ea, 4),
        "punto_rocio_c": round(t_rocio, 2),
        "vpd_aire_kpa": round(vpd_aire, 3),
        "vpd_foliar_kpa": round(vpd_foliar, 3),
        "estado": estado,
        "accion_sugerida": accion
    }


def balance_hidrico_salinidad(
    eto_mm_dia: float, 
    kc: float, 
    densidad_plantas_m2: float, 
    ec_agua_ds_m: float, 
    cultivo: str = "tomate"
) -> Dict[str, float]:
    """
    Calcula demanda hídrica neta, fracción de lixiviación (LF) y lámina bruta por planta.
    
    Args:
        eto_mm_dia: Evapotranspiración de referencia en mm/día
        kc: Coeficiente de cultivo fenológico
        densidad_plantas_m2: Plantas por m2 (ej. 2.5)
        ec_agua_ds_m: Conductividad eléctrica del agua de riego (dS/m)
        cultivo: 'tomate' o 'pimenton'
    """
    # Umbrales máximos tolerables de ECe sin merma de rendimiento (FAO-29)
    ece_umbral = 2.5 if cultivo.lower() == "tomate" else 1.5
    
    # 1. Fracción de lavado (LF)
    denominador = (5.0 * ece_umbral) - ec_agua_ds_m
    lf = max(0.05, ec_agua_ds_m / denominador) if denominador > 0 else 0.35
    lf = min(lf, 0.40) # Límite máximo operativo razonable (40%)
    
    # 2. Evapotranspiración de cultivo (mm/día = L/m²/día)
    etc_mm_dia = eto_mm_dia * kc
    
    # 3. Volumen neto por planta
    volumen_neto_l_planta = etc_mm_dia / densidad_plantas_m2
    
    # 4. Volumen bruto con lixiviación
    volumen_bruto_l_planta = volumen_neto_l_planta / (1.0 - lf)
    
    return {
        "etc_mm_dia": round(etc_mm_dia, 2),
        "fraccion_lavado_pct": round(lf * 100.0, 1),
        "volumen_neto_l_planta_dia": round(volumen_neto_l_planta, 3),
        "volumen_bruto_l_planta_dia": round(volumen_bruto_l_planta, 3),
        "volumen_bruto_semanal_l_planta": round(volumen_bruto_l_planta * 7, 2)
    }
```

---

## 2. Módulo Python: Solver Estequiométrico de Fertirriego

```python
"""
fertigation_solver.py
Cálculo de masa de fertilizantes comerciales para preparar 1000 L de Tanque Madre (100x).
"""
from typing import Dict, Any

def calcular_tanques_concentrados(
    aporte_agua_ppm: Dict[str, float],
    objetivo_meq_gotero: Dict[str, float],
    volumen_tanque_madre_l: float = 1000.0,
    factor_dilucion: float = 100.0
) -> Dict[str, Any]:
    """
    Resuelve el requerimiento de sales comerciales para Tanque A y Tanque B.
    
    Pesos moleculares aproximados y pureza comercial común:
    - Ca(NO3)2·4H2O: ~19% Ca, 15.5% N (14.4% N-NO3, 1.1% N-NH4)
    - KNO3: 38.6% K, 13.8% N-NO3
    - KH2PO4 (MKP): 28.7% K, 22.7% P (52% P2O5, 34% K2O)
    - MgSO4·7H2O: 9.8% Mg, 13% S (16% MgO)
    - K2SO4: 41.5% K, 18% S (50% K2O)
    """
    # Conversión de aportes de agua bruta a meq/L
    ca_agua_meq = aporte_agua_ppm.get("Ca", 0.0) / 20.04
    mg_agua_meq = aporte_agua_ppm.get("Mg", 0.0) / 12.15
    k_agua_meq  = aporte_agua_ppm.get("K", 0.0) / 39.10
    
    # Requerimientos netos a aportar en meq/L diluido
    ca_neto_meq = max(0.0, objetivo_meq_gotero.get("Ca", 9.0) - ca_agua_meq)
    mg_neto_meq = max(0.0, objetivo_meq_gotero.get("Mg", 3.5) - mg_agua_meq)
    p_neto_meq  = objetivo_meq_gotero.get("P", 1.5)
    k_neto_meq  = max(0.0, objetivo_meq_gotero.get("K", 9.0) - k_agua_meq)
    
    # 1. Tanque A: Todo el Calcio proviene de Nitrato de Calcio
    # 1 meq Ca/L = 20.04 ppm Ca -> Requiere ~105 mg de Nitrato de Calcio grado fertirriego por litro diluido
    gramos_ca_nitrato_por_m3 = ca_neto_meq * 118.0
    kilos_ca_nitrato_tanque = (gramos_ca_nitrato_por_m3 * volumen_tanque_madre_l * factor_dilucion) / (1000.0 * 1000.0)
    
    # Nitrato aportado por Ca(NO3)2
    n_aportado_por_ca_meq = ca_neto_meq * 1.05
    
    # 2. Tanque B: Todo el Fósforo con MKP (KH2PO4)
    # 1 meq P/L requiere 136 mg de MKP por litro diluido, aportando 1 meq K
    kilos_mkp_tanque = (p_neto_meq * 136.0 * volumen_tanque_madre_l * factor_dilucion) / 1e6
    k_remanente_meq = max(0.0, k_neto_meq - p_neto_meq)
    
    # Magnesio aportado por Sulfato de Magnesio (MgSO4·7H2O)
    # 1 meq Mg/L requiere 123.2 mg de MgSO4 por litro diluido
    kilos_mgso4_tanque = (mg_neto_meq * 123.2 * volumen_tanque_madre_l * factor_dilucion) / 1e6
    
    # Potasio remanente dividido entre KNO3 y K2SO4
    n_restante_meq = max(0.0, objetivo_meq_gotero.get("N", 14.0) - n_aportado_por_ca_meq)
    k_from_kno3_meq = min(k_remanente_meq, n_restante_meq)
    kilos_kno3_tanque = (k_from_kno3_meq * 101.1 * volumen_tanque_madre_l * factor_dilucion) / 1e6
    
    k_from_k2so4_meq = max(0.0, k_remanente_meq - k_from_kno3_meq)
    kilos_k2so4_tanque = (k_from_k2so4_meq * 87.1 * volumen_tanque_madre_l * factor_dilucion) / 1e6
    
    return {
        "tanque_A_kg": {
            "nitrato_de_calcio_kg": round(kilos_ca_nitrato_tanque, 2),
            "quelato_hierro_fe_eddha_kg": round(0.03 * kilos_ca_nitrato_tanque, 2)
        },
        "tanque_B_kg": {
            "mkp_fosfato_monopotasico_kg": round(kilos_mkp_tanque, 2),
            "sulfato_de_magnesio_kg": round(kilos_mgso4_tanque, 2),
            "nitrato_de_potasio_kg": round(kilos_kno3_tanque, 2),
            "sulfato_de_potasio_kg": round(kilos_k2so4_tanque, 2),
            "complejo_micros_quelatados_kg": round(1.5, 2)
        },
        "balance_diluido_teorico_meq": {
            "Ca": round(ca_neto_meq + ca_agua_meq, 2),
            "K": round(k_neto_meq + k_agua_meq, 2),
            "Mg": round(mg_neto_meq + mg_agua_meq, 2),
            "P": round(p_neto_meq, 2)
        }
    }
```

---

## 3. Módulo TypeScript: Cálculo en Cliente y Offline Engine

```typescript
/**
 * agri-calculator.ts
 * Motor de cálculo agronómico reactivo para Frontend PWA.
 */

export interface MicroclimaInput {
  temperaturaAire: number;
  humedadRelativa: number;
  temperaturaHoja?: number;
}

export interface MicroclimaResult {
  esAireKpa: number;
  eaKpa: number;
  puntoRocioCelsius: number;
  vpdAireKpa: number;
  vpdFoliarKpa: number;
  colorEstado: string; // Token CSS
  rotuloEstado: string;
}

export function calcularVpdFrontend(input: MicroclimaInput): MicroclimaResult {
  const { temperaturaAire, humedadRelativa, temperaturaHoja } = input;
  
  // Fórmula Tetens
  const esAire = 0.61078 * Math.exp((17.27 * temperaturaAire) / (temperaturaAire + 237.3));
  const ea = esAire * (humedadRelativa / 100.0);
  
  // Punto de rocío
  const lnEa = Math.log(Math.max(ea, 0.0001) / 0.61078);
  const puntoRocio = (237.3 * lnEa) / (17.27 - lnEa);
  
  // VPD
  const vpdAire = esAire - ea;
  const tHojaEfectiva = temperaturaHoja ?? (temperaturaAire - 1.8);
  const esHoja = 0.61078 * Math.exp((17.27 * tHojaEfectiva) / (tHojaEfectiva + 237.3));
  const vpdFoliar = esHoja - ea;
  
  let colorEstado = '#10b981'; // Verde óptimo
  let rotuloEstado = 'Óptimo Fisiológico';
  
  if (vpdFoliar < 0.40) {
    colorEstado = '#38bdf8'; // Azul saturación
    rotuloEstado = 'Saturado / Riesgo Fúngico';
  } else if (vpdFoliar > 1.45) {
    colorEstado = '#f43f5e'; // Carmín estrés
    rotuloEstado = 'Estrés Térmico / Cierre Estomático';
  } else if (vpdFoliar > 1.20) {
    colorEstado = '#f59e0b'; // Ámbar advertencia
    rotuloEstado = 'Transpiración Alta';
  }
  
  return {
    esAireKpa: Number(esAire.toFixed(3)),
    eaKpa: Number(ea.toFixed(3)),
    puntoRocioCelsius: Number(puntoRocio.toFixed(1)),
    vpdAireKpa: Number(vpdAire.toFixed(2)),
    vpdFoliarKpa: Number(vpdFoliar.toFixed(2)),
    colorEstado,
    rotuloEstado
  };
}

/**
 * Acumulador de Grados Día de Desarrollo (GDD)
 */
export function acumularGdd(tempMax: number, tempMin: number, tempBase: number, tempCutoff: number = 34): number {
  const tMaxAjustada = Math.min(tempMax, tempCutoff);
  const tMedia = (tMaxAjustada + tempMin) / 2.0;
  return Math.max(0, Number((tMedia - tempBase).toFixed(2)));
}
```

---

## 4. Módulo Python: Análisis Estadístico (ANOVA DBCA y Tukey HSD)

```python
"""
agri_statistics.py
Análisis de varianza para ensayos agronómicos en campo (DBCA) con Tukey HSD.
"""
import pandas as pd
import numpy as np
from scipy import stats
from statsmodels.formula.api import ols
import statsmodels.api as sm
from statsmodels.stats.multicomp import pairwise_tukeyhsd

def analizar_ensayo_dbca(df: pd.DataFrame, var_respuesta: str, var_tratamiento: str, var_bloque: str):
    """
    Ejecuta ANOVA de 2 vías sin interacción (DBCA) y prueba de comparación de Tukey.
    
    Args:
        df: DataFrame con columnas [var_respuesta, var_tratamiento, var_bloque]
    """
    formula = f"{var_respuesta} ~ C({var_tratamiento}) + C({var_bloque})"
    modelo = ols(formula, data=df).fit()
    tabla_anova = sm.stats.anova_lm(modelo, typ=2)
    
    # 1. Supuesto de normalidad de residuos (Shapiro-Wilk)
    residuos = modelo.resid
    stat_shapiro, p_shapiro = stats.shapiro(residuos)
    
    # 2. Prueba post-hoc de Tukey HSD para tratamientos
    tukey = pairwise_tukeyhsd(endog=df[var_respuesta], groups=df[var_tratamiento], alpha=0.05)
    
    return {
        "anova": tabla_anova,
        "shapiro_p_valor": round(p_shapiro, 4),
        "normalidad_cumplida": p_shapiro >= 0.05,
        "tukey_summary": tukey.summary()
    }
```
