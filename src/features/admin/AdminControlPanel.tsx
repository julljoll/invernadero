import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import dbExport from '../../core/constants/database.json';

interface SettingRow {
  key: string;
  category: string;
  label: string;
  value: string;
  type: string;
  description: string;
}

interface ClimateRow {
  id: number;
  mes: string;
  max: number;
  min: number;
  tmed: number;
  lluvia: number;
  viento: number;
  bochorno: number;
  rh: number;
  rad: number;
  eto: number;
  dir: string;
}

interface CropRow {
  id: string;
  name: string;
  scientific_name: string;
  ec_threshold: number;
  slope_percent_per_ds: number;
  recommended_gsm: string;
  pesticide_reduction: string;
  virosis_risk_reduction: string;
  target_yield_tons: number;
  avg_price_usd_per_kg: number;
}

interface ContentRow {
  key: string;
  section: string;
  label: string;
  value: string;
}

export const AdminControlPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'settings' | 'greenhouse' | 'water' | 'climate' | 'crops' | 'content'>('settings');
  const [isLocalApiAvailable, setIsLocalApiAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Estados de datos
  const [settings, setSettings] = useState<SettingRow[]>([]);
  const [climateMonths, setClimateMonths] = useState<ClimateRow[]>([]);
  const [crops, setCrops] = useState<CropRow[]>([]);
  const [siteContent, setSiteContent] = useState<ContentRow[]>([]);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Cargar datos desde la API local o desde el JSON horneado
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/db/all');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setSettings(json.data.settings || []);
          setClimateMonths(json.data.climateMonths || []);
          setCrops(json.data.crops || []);
          setSiteContent(json.data.siteContent || []);
          setIsLocalApiAvailable(true);
          setLoading(false);
          return;
        }
      }
      throw new Error('API local no responde');
    } catch (err) {
      // Si estamos en Vercel o sin servidor Vite activo, usar dbExport de respaldo
      setIsLocalApiAvailable(false);
      setSettings((dbExport.settingsRaw as unknown as SettingRow[]) || []);
      setClimateMonths((dbExport.climateMonths as unknown as ClimateRow[]) || []);
      setCrops((dbExport.cropsRaw as unknown as CropRow[]) || []);
      setSiteContent((dbExport.siteContentRaw as unknown as ContentRow[]) || []);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Actualizar un valor individual de settings en el estado
  const handleSettingChange = (key: string, newValue: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value: newValue } : s))
    );
  };

  // Guardar un setting individual en SQLite
  const saveSetting = async (key: string, value: string) => {
    if (!isLocalApiAvailable) {
      showToast('En Vercel el sitio es de solo lectura. Para actualizar la base de datos, ejecuta el panel en local ("npm run dev").', 'info');
      return;
    }

    setSavingKey(key);
    try {
      const res = await fetch('/api/db/setting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`✅ Parámetro ${key} guardado en SQLite.`, 'success');
      } else {
        throw new Error(data.error || 'Error al guardar');
      }
    } catch (err: any) {
      showToast(`❌ Error: ${err.message}`, 'error');
    } finally {
      setSavingKey(null);
    }
  };

  // Guardar todos los settings de una categoría
  const saveCategorySettings = async (category: string) => {
    if (!isLocalApiAvailable) {
      showToast('Estás en Vercel / Modo Estático. Ejecuta "npm run dev" en tu computadora para modificar SQLite.', 'info');
      return;
    }

    const categoryItems = settings.filter((s) => s.category === category);
    setSavingKey(category);
    try {
      for (const item of categoryItems) {
        await fetch('/api/db/setting', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: item.key, value: item.value }),
        });
      }
      showToast(`✅ Todos los parámetros de "${category}" guardados en SQLite y exportados.`, 'success');
    } catch (err: any) {
      showToast(`❌ Error al guardar categoría: ${err.message}`, 'error');
    } finally {
      setSavingKey(null);
    }
  };

  // Actualizar mes climático
  const handleClimateChange = (id: number, field: keyof ClimateRow, val: any) => {
    setClimateMonths((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: val } : m))
    );
  };

  const saveClimateMonth = async (month: ClimateRow) => {
    if (!isLocalApiAvailable) {
      showToast('Estás en Vercel / Modo Estático. Modifica los datos en tu entorno local.', 'info');
      return;
    }

    setSavingKey(`climate-${month.id}`);
    try {
      const res = await fetch('/api/db/climate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(month),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`✅ Mes de ${month.mes} actualizado en SQLite.`, 'success');
      } else {
        throw new Error(data.error || 'Error');
      }
    } catch (err: any) {
      showToast(`❌ Error: ${err.message}`, 'error');
    } finally {
      setSavingKey(null);
    }
  };

  // Actualizar cultivo
  const handleCropChange = (id: string, field: keyof CropRow, val: any) => {
    setCrops((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: val } : c))
    );
  };

  const saveCrop = async (crop: CropRow) => {
    if (!isLocalApiAvailable) {
      showToast('Estás en Vercel / Modo Estático. Modifica los datos en tu entorno local.', 'info');
      return;
    }

    setSavingKey(`crop-${crop.id}`);
    try {
      const res = await fetch('/api/db/crop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(crop),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`✅ Cultivo ${crop.name} guardado en SQLite.`, 'success');
      } else {
        throw new Error(data.error || 'Error');
      }
    } catch (err: any) {
      showToast(`❌ Error: ${err.message}`, 'error');
    } finally {
      setSavingKey(null);
    }
  };

  // Actualizar contenido de texto
  const handleContentChange = (key: string, val: string) => {
    setSiteContent((prev) =>
      prev.map((c) => (c.key === key ? { ...c, value: val } : c))
    );
  };

  const saveContent = async (item: ContentRow) => {
    if (!isLocalApiAvailable) {
      showToast('Estás en Vercel / Modo Estático. Modifica los datos en tu entorno local.', 'info');
      return;
    }

    setSavingKey(`content-${item.key}`);
    try {
      const res = await fetch('/api/db/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: item.key, value: item.value }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`✅ Texto "${item.label}" actualizado en SQLite.`, 'success');
      } else {
        throw new Error(data.error || 'Error');
      }
    } catch (err: any) {
      showToast(`❌ Error: ${err.message}`, 'error');
    } finally {
      setSavingKey(null);
    }
  };

  // Forzar exportación Data Baking
  const triggerBake = async () => {
    if (!isLocalApiAvailable) {
      showToast('Data Baking solo está disponible en el servidor local de desarrollo.', 'info');
      return;
    }
    try {
      const res = await fetch('/api/db/bake', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('🔥 ¡Data Baking completado! database.json actualizado con éxito.', 'success');
      }
    } catch (err: any) {
      showToast(`❌ Error: ${err.message}`, 'error');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', fontFamily: 'var(--font-sans)', color: '#0f172a' }}>
      {/* Barra de Notificación Flotante (Toast) */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            backgroundColor: toastMessage.type === 'success' ? '#166534' : toastMessage.type === 'error' ? '#991b1b' : '#1e3a8a',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: '8px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
            fontWeight: 600,
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.2s ease-in-out'
          }}
        >
          {toastMessage.text}
        </div>
      )}

      {/* Header Principal del Panel de Control */}
      <header style={{ backgroundColor: '#0F4D06', color: '#ffffff', padding: '16px 24px', borderBottom: '3px solid #53C942' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#53C942', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#0F4D06' }}>
                AG
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 800, letterSpacing: '-0.5px' }}>
                  PANEL DE CONTROL — BASE DE DATOS SQLITE
                </h1>
                <p style={{ margin: 0, fontSize: '12px', color: '#bbf7d0' }}>
                  Valle de Quíbor · Inyección Directa Local (Data Baking para Vercel)
                </p>
              </div>
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Indicador de Estado de Conexión SQLite */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: isLocalApiAvailable ? 'rgba(83, 201, 66, 0.2)' : 'rgba(255, 255, 255, 0.15)',
                border: isLocalApiAvailable ? '1px solid #53C942' : '1px solid rgba(255,255,255,0.3)',
                color: '#ffffff'
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: isLocalApiAvailable ? '#53C942' : '#f59e0b'
                }}
              />
              {isLocalApiAvailable ? 'SQLite Activo (database.sqlite)' : 'Modo Lectura / Vercel'}
            </div>

            {isLocalApiAvailable && (
              <button
                onClick={triggerBake}
                style={{
                  backgroundColor: '#53C942',
                  color: '#0F4D06',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
                title="Sincroniza y hornea inmediatamente la base de datos a database.json"
              >
                🔥 Hornear Datos (Bake)
              </button>
            )}

            <Link
              to="/cockpit"
              style={{
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: 600,
                padding: '6px 12px',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '6px'
              }}
            >
              Ver Cockpit 3D →
            </Link>
          </div>
        </div>
      </header>

      {/* Navegación por Pestañas */}
      <nav style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', overflowX: 'auto', gap: '8px', padding: '0 16px' }}>
          {[
            { id: 'settings', label: '⚙️ Configuración General', count: settings.filter((s) => s.category === 'general').length },
            { id: 'greenhouse', label: '🏗️ Invernadero y Malla', count: settings.filter((s) => s.category === 'greenhouse' || s.category === 'mesh').length },
            { id: 'water', label: '💧 Pozo y Acuífero', count: settings.filter((s) => s.category === 'water').length },
            { id: 'climate', label: '🌤️ Climatología Quíbor', count: climateMonths.length },
            { id: 'crops', label: '🌱 Cultivos (Tomate/Pimentón)', count: crops.length },
            { id: 'content', label: '📝 Textos y Contacto', count: siteContent.length + settings.filter((s) => s.category === 'contact').length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '14px 18px',
                fontSize: '14px',
                fontWeight: activeTab === tab.id ? 700 : 500,
                color: activeTab === tab.id ? '#0F4D06' : '#64748b',
                border: 'none',
                borderBottom: activeTab === tab.id ? '3px solid #0F4D06' : '3px solid transparent',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {tab.label}
              <span style={{ fontSize: '11px', backgroundColor: activeTab === tab.id ? '#dcfce7' : '#f1f5f9', color: activeTab === tab.id ? '#166534' : '#64748b', padding: '2px 6px', borderRadius: '10px' }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Contenido Central */}
      <main style={{ maxWidth: '1300px', margin: '24px auto', padding: '0 16px' }}>
        {/* Banner Explicativo de Vercel & SQLite */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '16px 20px', marginBottom: '24px', borderLeft: '5px solid #0284c7', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700, color: '#0369a1' }}>
              ℹ️ Flujo de Actualización en Vercel (Data Baking)
            </h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>
              Al guardar cualquier dato en este panel, se escribe en <code style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>database.sqlite</code> y se genera automáticamente <code style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>database.json</code>.
              Cuando hagas <strong style={{ color: '#0f172a' }}>git push</strong>, Vercel desplegará la interfaz con todos estos datos pre-cargados a máxima velocidad.
            </p>
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', backgroundColor: '#f8fafc', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            Último horneado: <strong>{dbExport._meta?.generatedAt ? new Date(dbExport._meta.generatedAt).toLocaleString() : 'N/A'}</strong>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
            <div style={{ fontSize: '24px', marginBottom: '12px' }}>⏳ Cargando datos de SQLite...</div>
          </div>
        ) : (
          <>
            {/* PESTAÑA: CONFIGURACIÓN GENERAL */}
            {activeTab === 'settings' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Parámetros Generales y Ubicación</h3>
                  {isLocalApiAvailable && (
                    <button
                      onClick={() => saveCategorySettings('general')}
                      disabled={savingKey === 'general'}
                      style={{ backgroundColor: '#0F4D06', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      {savingKey === 'general' ? 'Guardando...' : 'Guardar Todos los Generales'}
                    </button>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
                  {settings
                    .filter((s) => s.category === 'general' || s.category === 'wind')
                    .map((item) => (
                      <div key={item.key} style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                          <label style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                            {item.label}
                          </label>
                          <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#94a3b8', backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                            {item.key}
                          </span>
                        </div>
                        <p style={{ margin: '0 0 10px 0', fontSize: '11px', color: '#64748b' }}>
                          {item.description}
                        </p>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            type={item.type === 'number' ? 'number' : 'text'}
                            step="any"
                            value={item.value}
                            onChange={(e) => handleSettingChange(item.key, e.target.value)}
                            style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                          />
                          {isLocalApiAvailable && (
                            <button
                              onClick={() => saveSetting(item.key, item.value)}
                              disabled={savingKey === item.key}
                              style={{ backgroundColor: '#248a15', color: '#ffffff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                            >
                              {savingKey === item.key ? '...' : 'Guardar'}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* PESTAÑA: INVERNADERO Y MALLA */}
            {activeTab === 'greenhouse' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Dimensiones del Invernadero y Malla Anti-Insectos</h3>
                  {isLocalApiAvailable && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => saveCategorySettings('greenhouse')}
                        disabled={savingKey === 'greenhouse'}
                        style={{ backgroundColor: '#0F4D06', color: '#ffffff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Guardar Invernadero
                      </button>
                      <button
                        onClick={() => saveCategorySettings('mesh')}
                        disabled={savingKey === 'mesh'}
                        style={{ backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Guardar Malla
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
                  {settings
                    .filter((s) => s.category === 'greenhouse' || s.category === 'mesh')
                    .map((item) => (
                      <div key={item.key} style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                          <label style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                            {item.label}
                          </label>
                          <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#94a3b8', backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                            {item.key}
                          </span>
                        </div>
                        <p style={{ margin: '0 0 10px 0', fontSize: '11px', color: '#64748b' }}>
                          {item.description}
                        </p>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            type={item.type === 'number' ? 'number' : 'text'}
                            step="any"
                            value={item.value}
                            onChange={(e) => handleSettingChange(item.key, e.target.value)}
                            style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                          />
                          {isLocalApiAvailable && (
                            <button
                              onClick={() => saveSetting(item.key, item.value)}
                              disabled={savingKey === item.key}
                              style={{ backgroundColor: '#248a15', color: '#ffffff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                            >
                              {savingKey === item.key ? '...' : 'Guardar'}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* PESTAÑA: POZO Y AGUA */}
            {activeTab === 'water' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Parámetros Hídricos, Hidrogeología y Salinidad de Pozo</h3>
                  {isLocalApiAvailable && (
                    <button
                      onClick={() => saveCategorySettings('water')}
                      disabled={savingKey === 'water'}
                      style={{ backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      {savingKey === 'water' ? 'Guardando...' : 'Guardar Todos los Parámetros Hídricos'}
                    </button>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
                  {settings
                    .filter((s) => s.category === 'water')
                    .map((item) => (
                      <div key={item.key} style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                          <label style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                            {item.label}
                          </label>
                          <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#94a3b8', backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                            {item.key}
                          </span>
                        </div>
                        <p style={{ margin: '0 0 10px 0', fontSize: '11px', color: '#64748b' }}>
                          {item.description}
                        </p>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            type={item.type === 'number' ? 'number' : 'text'}
                            step="any"
                            value={item.value}
                            onChange={(e) => handleSettingChange(item.key, e.target.value)}
                            style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                          />
                          {isLocalApiAvailable && (
                            <button
                              onClick={() => saveSetting(item.key, item.value)}
                              disabled={savingKey === item.key}
                              style={{ backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                            >
                              {savingKey === item.key ? '...' : 'Guardar'}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* PESTAÑA: CLIMA MERRA-2 */}
            {activeTab === 'climate' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Régimen Bioclimático Mensual (NASA MERRA-2 Quíbor)</h3>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Edita los valores térmicos, precipitaciones y vientos de cada mes.</p>
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', overflowX: 'auto', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                        <th style={{ padding: '12px 14px' }}>Mes</th>
                        <th style={{ padding: '12px 10px' }}>T. Máx (°C)</th>
                        <th style={{ padding: '12px 10px' }}>T. Mín (°C)</th>
                        <th style={{ padding: '12px 10px' }}>T. Med (°C)</th>
                        <th style={{ padding: '12px 10px' }}>Lluvia (mm)</th>
                        <th style={{ padding: '12px 10px' }}>Viento (km/h)</th>
                        <th style={{ padding: '12px 10px' }}>Bochorno (días)</th>
                        <th style={{ padding: '12px 10px' }}>HR (%)</th>
                        <th style={{ padding: '12px 10px' }}>ETo (mm)</th>
                        <th style={{ padding: '12px 10px' }}>Dirección Viento</th>
                        {isLocalApiAvailable && <th style={{ padding: '12px 14px', textAlign: 'center' }}>Acción</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {climateMonths.map((m) => (
                        <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0F4D06' }}>
                            {m.mes}
                          </td>
                          <td style={{ padding: '6px 10px' }}>
                            <input
                              type="number"
                              step="0.1"
                              value={m.max}
                              onChange={(e) => handleClimateChange(m.id, 'max', parseFloat(e.target.value) || 0)}
                              style={{ width: '60px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                            />
                          </td>
                          <td style={{ padding: '6px 10px' }}>
                            <input
                              type="number"
                              step="0.1"
                              value={m.min}
                              onChange={(e) => handleClimateChange(m.id, 'min', parseFloat(e.target.value) || 0)}
                              style={{ width: '60px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                            />
                          </td>
                          <td style={{ padding: '6px 10px' }}>
                            <input
                              type="number"
                              step="0.1"
                              value={m.tmed}
                              onChange={(e) => handleClimateChange(m.id, 'tmed', parseFloat(e.target.value) || 0)}
                              style={{ width: '60px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                            />
                          </td>
                          <td style={{ padding: '6px 10px' }}>
                            <input
                              type="number"
                              step="0.1"
                              value={m.lluvia}
                              onChange={(e) => handleClimateChange(m.id, 'lluvia', parseFloat(e.target.value) || 0)}
                              style={{ width: '65px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                            />
                          </td>
                          <td style={{ padding: '6px 10px' }}>
                            <input
                              type="number"
                              step="0.1"
                              value={m.viento}
                              onChange={(e) => handleClimateChange(m.id, 'viento', parseFloat(e.target.value) || 0)}
                              style={{ width: '60px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                            />
                          </td>
                          <td style={{ padding: '6px 10px' }}>
                            <input
                              type="number"
                              step="0.1"
                              value={m.bochorno}
                              onChange={(e) => handleClimateChange(m.id, 'bochorno', parseFloat(e.target.value) || 0)}
                              style={{ width: '60px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                            />
                          </td>
                          <td style={{ padding: '6px 10px' }}>
                            <input
                              type="number"
                              step="0.1"
                              value={m.rh}
                              onChange={(e) => handleClimateChange(m.id, 'rh', parseFloat(e.target.value) || 0)}
                              style={{ width: '60px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                            />
                          </td>
                          <td style={{ padding: '6px 10px' }}>
                            <input
                              type="number"
                              step="0.1"
                              value={m.eto}
                              onChange={(e) => handleClimateChange(m.id, 'eto', parseFloat(e.target.value) || 0)}
                              style={{ width: '60px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                            />
                          </td>
                          <td style={{ padding: '6px 10px' }}>
                            <input
                              type="text"
                              value={m.dir}
                              onChange={(e) => handleClimateChange(m.id, 'dir', e.target.value)}
                              style={{ width: '130px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                            />
                          </td>
                          {isLocalApiAvailable && (
                            <td style={{ padding: '6px 14px', textAlign: 'center' }}>
                              <button
                                onClick={() => saveClimateMonth(m)}
                                disabled={savingKey === `climate-${m.id}`}
                                style={{ backgroundColor: '#248a15', color: '#ffffff', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                              >
                                {savingKey === `climate-${m.id}` ? '...' : 'Guardar'}
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* PESTAÑA: CULTIVOS */}
            {activeTab === 'crops' && (
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Catálogo de Cultivos y Respuestas Agronómicas</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Edita umbrales de salinidad (Mass-Hoffman), rendimientos y precios de venta.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '20px' }}>
                  {crops.map((crop) => (
                    <div key={crop.id} style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F4D06' }}>
                            {crop.name}
                          </h4>
                          <span style={{ fontSize: '12px', fontStyle: 'italic', color: '#64748b' }}>
                            {crop.scientific_name}
                          </span>
                        </div>
                        <span style={{ fontSize: '11px', fontFamily: 'monospace', backgroundColor: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                          {crop.id.toUpperCase()}
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                        <div>
                          <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                            Umbral CE (dS/m)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            value={crop.ec_threshold}
                            onChange={(e) => handleCropChange(crop.id, 'ec_threshold', parseFloat(e.target.value) || 0)}
                            style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                            Pendiente Pérdida (%/dS/m)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            value={crop.slope_percent_per_ds}
                            onChange={(e) => handleCropChange(crop.id, 'slope_percent_per_ds', parseFloat(e.target.value) || 0)}
                            style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                            Rendimiento Objetivo (Ton)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            value={crop.target_yield_tons}
                            onChange={(e) => handleCropChange(crop.id, 'target_yield_tons', parseFloat(e.target.value) || 0)}
                            style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                            Precio Promedio (USD/kg)
                          </label>
                          <input
                            type="number"
                            step="0.05"
                            value={crop.avg_price_usd_per_kg}
                            onChange={(e) => handleCropChange(crop.id, 'avg_price_usd_per_kg', parseFloat(e.target.value) || 0)}
                            style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                            Malla Recomendada
                          </label>
                          <input
                            type="text"
                            value={crop.recommended_gsm}
                            onChange={(e) => handleCropChange(crop.id, 'recommended_gsm', e.target.value)}
                            style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                            Reducción Plaguicidas
                          </label>
                          <input
                            type="text"
                            value={crop.pesticide_reduction}
                            onChange={(e) => handleCropChange(crop.id, 'pesticide_reduction', e.target.value)}
                            style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                          />
                        </div>
                      </div>

                      {isLocalApiAvailable && (
                        <button
                          onClick={() => saveCrop(crop)}
                          disabled={savingKey === `crop-${crop.id}`}
                          style={{ width: '100%', backgroundColor: '#0F4D06', color: '#ffffff', border: 'none', padding: '10px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                        >
                          {savingKey === `crop-${crop.id}` ? 'Guardando...' : `Guardar Parámetros de ${crop.name}`}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PESTAÑA: TEXTOS Y CONTACTO */}
            {activeTab === 'content' && (
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Textos del Sitio y Datos de Contacto</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Edita títulos, llamadas a la acción y teléfonos comerciales.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px' }}>
                  {/* Textos de la Web */}
                  {siteContent.map((item) => (
                    <div key={item.key} style={{ backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                          {item.label}
                        </label>
                        <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#94a3b8' }}>
                          Sección: {item.section}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <textarea
                          rows={2}
                          value={item.value}
                          onChange={(e) => handleContentChange(item.key, e.target.value)}
                          style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', resize: 'vertical' }}
                        />
                        {isLocalApiAvailable && (
                          <button
                            onClick={() => saveContent(item)}
                            disabled={savingKey === `content-${item.key}`}
                            style={{ alignSelf: 'flex-start', backgroundColor: '#248a15', color: '#ffffff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                          >
                            {savingKey === `content-${item.key}` ? '...' : 'Guardar'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Datos de Contacto de Settings */}
                  {settings
                    .filter((s) => s.category === 'contact')
                    .map((item) => (
                      <div key={item.key} style={{ backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <label style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', display: 'block', marginBottom: '6px' }}>
                          {item.label} ({item.description})
                        </label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <input
                            type="text"
                            value={item.value}
                            onChange={(e) => handleSettingChange(item.key, e.target.value)}
                            style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                          />
                          {isLocalApiAvailable && (
                            <button
                              onClick={() => saveSetting(item.key, item.value)}
                              disabled={savingKey === item.key}
                              style={{ backgroundColor: '#248a15', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                            >
                              {savingKey === item.key ? '...' : 'Guardar'}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
