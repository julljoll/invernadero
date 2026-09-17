import React, { useState } from 'react';
import { Modal, Button, Badge, Nav, Table, Alert } from 'react-bootstrap';
import {
  GOOGLE_SHEET_CONFIG,
  getAllProductionSheets,
  copySheetToClipboard,
  downloadSheetCsv,
  downloadAllSheetsPackage,
  syncWithGoogleAppsScript,
  SheetDefinition,
} from '../../core/services/googleSheetsSync';
import { useAgroStore } from '../store/useAgroStore';

interface GoogleSheetsSyncModalProps {
  show: boolean;
  onHide: () => void;
  initialSheetId?: string;
}

export const GoogleSheetsSyncModal: React.FC<GoogleSheetsSyncModalProps> = ({
  show,
  onHide,
  initialSheetId = '01_Plan_Siembra',
}) => {
  const { waterEcDsM } = useAgroStore();
  const [selectedSheetId, setSelectedSheetId] = useState<string>(initialSheetId);
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);
  const [webhookUrl, setWebhookUrl] = useState<string>(() => {
    try {
      return typeof window !== 'undefined' && window.localStorage
        ? localStorage.getItem(GOOGLE_SHEET_CONFIG.storageKeyWebhook) || ''
        : '';
    } catch {
      return '';
    }
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncFeedback, setSyncFeedback] = useState<{ type: 'success' | 'danger' | 'info'; message: string } | null>(null);
  const [activeSubView, setActiveSubView] = useState<'preview' | 'script'>('preview');

  const sheets = getAllProductionSheets(waterEcDsM);
  const currentSheet: SheetDefinition =
    sheets.find((s) => s.id === selectedSheetId) || sheets[0];

  const handleCopyCurrentSheet = async () => {
    const ok = await copySheetToClipboard(currentSheet);
    if (ok) {
      setCopiedStatus(`✓ Hoja "${currentSheet.title}" copiada al portapapeles.`);
      setTimeout(() => setCopiedStatus(null), 3500);
    }
  };

  const handleDownloadCurrentCsv = () => {
    downloadSheetCsv(currentSheet);
  };

  const handleDownloadAll = () => {
    downloadAllSheetsPackage(waterEcDsM);
  };

  const handleSaveWebhookUrl = (val: string) => {
    setWebhookUrl(val);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(GOOGLE_SHEET_CONFIG.storageKeyWebhook, val);
      }
    } catch {
      // Ignorar restricciones en entornos aislados
    }
  };

  const handleExecuteWebhookSync = async () => {
    if (!webhookUrl) {
      setSyncFeedback({
        type: 'danger',
        message: 'Por favor ingresa la URL de implementación de Google Apps Script primero.',
      });
      return;
    }

    setIsSyncing(true);
    setSyncFeedback(null);
    const res = await syncWithGoogleAppsScript(webhookUrl, waterEcDsM);
    setIsSyncing(false);
    setSyncFeedback({
      type: res.success ? 'success' : 'danger',
      message: res.message,
    });
  };

  const handleCopyScriptCode = async () => {
    try {
      let text = '';
      const res1 = await fetch('/google-apps-script.js');
      if (res1.ok) {
        text = await res1.text();
      } else {
        const res2 = await fetch('/scripts/google-apps-script.js');
        if (res2.ok) {
          text = await res2.text();
        }
      }
      if (!text) {
        text = `// Abre el archivo scripts/google-apps-script.js en tu proyecto y copia su contenido completo.`;
      }
      await navigator.clipboard.writeText(text);
      setCopiedStatus('¡Código Google Apps Script copiado al portapapeles!');
      setTimeout(() => setCopiedStatus(null), 3500);
    } catch {
      setCopiedStatus('Código disponible en scripts/google-apps-script.js');
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered className="google-sheets-sync-modal">
      <Modal.Header closeButton className="bg-dark text-white border-bottom border-success border-opacity-30">
        <div className="d-flex align-items-center gap-3">
          <div className="p-2 bg-success bg-opacity-20 rounded-3 border border-success border-opacity-40 text-success d-flex align-items-center justify-content-center">
            <span className="material-symbols-outlined fs-4">table_chart</span>
          </div>
          <div>
            <div className="d-flex align-items-center gap-2">
              <Modal.Title className="h5 mb-0 fw-bold text-white">
                Sincronización con Google Sheets Oficial
              </Modal.Title>
              <Badge bg="success" className="font-mono text-2xs px-2 py-1">
                EN VIVO
              </Badge>
            </div>
            <div className="text-secondary text-xs mt-0.5">
              Valle de Quíbor · Documento ID:{' '}
              <span className="font-mono text-light">{GOOGLE_SHEET_CONFIG.id}</span>
            </div>
          </div>
        </div>
      </Modal.Header>

      <Modal.Body className="bg-light p-3 p-md-4">
        {/* Banner de acceso directo al documento oficial */}
        <div className="card card-agro p-3 mb-3 bg-white border-success border-opacity-40 shadow-xs">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div className="d-flex align-items-center gap-2.5">
              <span className="material-symbols-outlined text-success fs-3">open_in_new</span>
              <div>
                <div className="fw-bold text-dark text-sm">
                  Documento Maestro: Plan de Siembra Pimenton
                </div>
                <a
                  href={GOOGLE_SHEET_CONFIG.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-success text-xs text-break fw-semibold text-decoration-none hover-underline font-mono"
                >
                  {GOOGLE_SHEET_CONFIG.url}
                </a>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2 flex-wrap">
              <Button
                variant="success"
                size="sm"
                as="a"
                href={GOOGLE_SHEET_CONFIG.url}
                target="_blank"
                rel="noopener noreferrer"
                className="fw-bold d-flex align-items-center gap-1.5 shadow-xs px-3"
              >
                <span className="material-symbols-outlined ms-sm">launch</span>
                <span>Abrir Google Sheet</span>
              </Button>

              <Button
                variant="outline-success"
                size="sm"
                as="a"
                href="/Plan_Maestro_Pimenton_Quibor.xlsx"
                download="Plan_Maestro_Pimenton_Quibor.xlsx"
                className="fw-bold d-flex align-items-center gap-1.5 shadow-xs"
                title="Descarga el libro Excel con las 5 pestañas listas para importar directamente en Google Sheets"
              >
                <span className="material-symbols-outlined ms-sm">description</span>
                <span>Descargar Excel (.xlsx)</span>
              </Button>

              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleDownloadAll}
                className="fw-semibold d-flex align-items-center gap-1.5 shadow-xs"
                title="Descarga el paquete completo con las 5 hojas en texto plano"
              >
                <span className="material-symbols-outlined ms-sm">download</span>
                <span>Descargar 5 CSVs</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Notificación de copiado / feedback */}
        {copiedStatus && (
          <Alert variant="success" className="py-2 px-3 text-xs fw-semibold mb-3 d-flex align-items-center gap-2">
            <span className="material-symbols-outlined ms-sm">check_circle</span>
            <span>{copiedStatus}</span>
          </Alert>
        )}

        {syncFeedback && (
          <Alert
            variant={syncFeedback.type}
            dismissible
            onClose={() => setSyncFeedback(null)}
            className="py-2 px-3 text-xs fw-semibold mb-3 d-flex align-items-center gap-2"
          >
            <span className="material-symbols-outlined ms-sm">info</span>
            <span>{syncFeedback.message}</span>
          </Alert>
        )}

        {/* Selector de Vistas: Vista Previa de Tablas vs Script de Instalación */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3 pb-2 border-bottom border-secondary-subtle">
          <Nav variant="pills" className="gap-2">
            <Nav.Item>
              <Button
                variant={activeSubView === 'preview' ? 'dark' : 'outline-secondary'}
                size="sm"
                onClick={() => setActiveSubView('preview')}
                className="fw-bold d-flex align-items-center gap-1 text-xs"
              >
                <span className="material-symbols-outlined ms-sm">table_view</span>
                <span>Visualizador de Hojas ({sheets.length})</span>
              </Button>
            </Nav.Item>
            <Nav.Item>
              <Button
                variant={activeSubView === 'script' ? 'dark' : 'outline-secondary'}
                size="sm"
                onClick={() => setActiveSubView('script')}
                className="fw-bold d-flex align-items-center gap-1 text-xs"
              >
                <span className="material-symbols-outlined ms-sm">code</span>
                <span>Asistente Apps Script (Instalador en 1 clic)</span>
              </Button>
            </Nav.Item>
          </Nav>

          <span className="text-muted text-xs">
            Cultivo activo: <strong>Pimentón Magistral F1</strong> (3.500 pl · 1.000 m²)
          </span>
        </div>

        {activeSubView === 'preview' ? (
          <div>
            {/* Pestañas de las 5 Hojas */}
            <Nav variant="tabs" className="mb-3">
              {sheets.map((s) => {
                const isActive = s.id === currentSheet.id;
                return (
                  <Nav.Item key={s.id}>
                    <button
                      type="button"
                      className={`nav-link text-xs fw-bold px-3 py-2 ${
                        isActive ? 'active text-success border-success border-bottom-0' : 'text-secondary'
                      }`}
                      onClick={() => setSelectedSheetId(s.id)}
                    >
                      {s.name}
                    </button>
                  </Nav.Item>
                );
              })}
            </Nav>

            {/* Cabecera de la hoja seleccionada */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-2 p-2 bg-white rounded-2 border border-secondary-subtle">
              <div>
                <div className="fw-bold text-dark text-xs">{currentSheet.title}</div>
                <div className="text-secondary text-2xs">{currentSheet.description}</div>
              </div>

              <div className="d-flex align-items-center gap-2">
                <Button
                  variant="outline-success"
                  size="sm"
                  onClick={handleCopyCurrentSheet}
                  className="fw-bold d-flex align-items-center gap-1 text-xs py-1"
                  title="Copia la tabla en formato TSV. Luego solo pulsa Ctrl+V en tu Google Sheet."
                >
                  <span className="material-symbols-outlined ms-sm">content_copy</span>
                  <span>Copiar para Pegar en Sheets</span>
                </Button>

                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={handleDownloadCurrentCsv}
                  className="fw-semibold d-flex align-items-center gap-1 text-xs py-1"
                  title="Descarga el archivo CSV de esta hoja"
                >
                  <span className="material-symbols-outlined ms-sm">file_download</span>
                  <span>Descargar CSV</span>
                </Button>
              </div>
            </div>

            {/* Tabla con scroll de datos */}
            <div
              className="table-responsive bg-white rounded-3 border border-secondary-subtle shadow-xs"
              style={{ maxHeight: '360px', overflowY: 'auto' }}
            >
              <Table hover size="sm" className="mb-0 text-xs align-middle">
                <thead className="table-dark sticky-top" style={{ zIndex: 5 }}>
                  <tr>
                    <th className="text-center text-muted font-mono" style={{ width: '40px' }}>
                      #
                    </th>
                    {currentSheet.headers.map((h, i) => (
                      <th key={i} className="text-nowrap py-2 px-2.5 fw-bold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentSheet.rows.map((row, rIdx) => (
                    <tr key={rIdx}>
                      <td className="text-center text-muted font-mono bg-light text-2xs">{rIdx + 1}</td>
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className={`px-2.5 py-1.5 ${
                            typeof cell === 'number'
                              ? 'font-mono text-dark fw-semibold'
                              : 'text-secondary'
                          }`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            <div className="mt-2 text-end text-muted text-2xs font-mono">
              Total filas en esta hoja: {currentSheet.rows.length} registros estructurados
            </div>
          </div>
        ) : (
          /* Vista del Asistente Google Apps Script */
          <div className="bg-white p-3 rounded-3 border border-secondary-subtle shadow-xs">
            <div className="row g-3">
              <div className="col-12 col-lg-7">
                <h6 className="fw-bold text-dark d-flex align-items-center gap-1.5 mb-2">
                  <span className="material-symbols-outlined text-success">auto_awesome</span>
                  <span>Generador Automático de 5 Hojas con Google Apps Script</span>
                </h6>
                <p className="text-secondary text-xs mb-3">
                  Google Sheets permite ejecutar scripts automáticos que limpian la celda "P" inicial, crean las 5
                  pestañas corporativas (con colores verde esmeralda y azul profundo, bordes y anchos automáticos) y
                  agregan un menú superior en tu hoja de cálculo.
                </p>

                <ol className="text-xs text-secondary ps-3 mb-3 d-flex flex-column gap-1.5">
                  <li>
                    Abre tu hoja en Google Sheets:{' '}
                    <a href={GOOGLE_SHEET_CONFIG.url} target="_blank" rel="noreferrer" className="fw-bold text-success">
                      Plan de Siembra Pimenton
                    </a>
                    .
                  </li>
                  <li>
                    En el menú superior haz clic en: <strong>Extensiones &gt; Apps Script</strong>.
                  </li>
                  <li>
                    Borra cualquier texto que haya en el editor y pega el código pre-compilado de Agrovenecua.
                  </li>
                  <li>
                    Haz clic en el icono de <strong>Guardar</strong> y luego en <strong>Ejecutar</strong> (función:{' '}
                    <code>generarPlanesProduccion</code>).
                  </li>
                  <li>¡Listo! Tu hoja creará al instante las 5 pestañas formateadas.</li>
                </ol>

                <div className="d-flex gap-2">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={handleCopyScriptCode}
                    className="fw-bold d-flex align-items-center gap-1.5 px-3 shadow-xs"
                  >
                    <span className="material-symbols-outlined ms-sm">content_copy</span>
                    <span>Copiar Código Apps Script</span>
                  </Button>
                </div>
              </div>

              <div className="col-12 col-lg-5">
                <div className="p-3 bg-light rounded-3 border border-secondary-subtle h-100">
                  <div className="fw-bold text-dark text-xs mb-1.5 d-flex align-items-center gap-1">
                    <span className="material-symbols-outlined text-primary fs-6">sync_alt</span>
                    <span>Sincronización en la Nube (Webhook Opcional)</span>
                  </div>
                  <p className="text-secondary text-2xs mb-2">
                    Si publicas tu Apps Script como "Aplicación web", puedes pegar la URL aquí para enviar
                    actualizaciones con un solo clic desde esta aplicación:
                  </p>

                  <div className="mb-2">
                    <label className="text-2xs fw-bold text-secondary text-uppercase mb-1">
                      URL de Webhook (exec):
                    </label>
                    <input
                      type="url"
                      placeholder="https://script.google.com/macros/s/.../exec"
                      value={webhookUrl}
                      onChange={(e) => handleSaveWebhookUrl(e.target.value)}
                      className="form-control form-control-sm text-xs font-mono"
                    />
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    disabled={isSyncing || !webhookUrl}
                    onClick={handleExecuteWebhookSync}
                    className="w-100 fw-bold d-flex align-items-center justify-content-center gap-1.5 py-1.5 text-xs shadow-xs"
                  >
                    <span className="material-symbols-outlined ms-sm">cloud_upload</span>
                    <span>{isSyncing ? 'Sincronizando...' : 'Enviar Datos a Google Sheet'}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="bg-white border-top border-secondary-subtle d-flex justify-content-between">
        <div className="d-flex align-items-center gap-2 text-2xs text-secondary font-mono">
          <span className="material-symbols-outlined text-success fs-6">verified</span>
          <span>Google Sheets API v4 Compatible · Valle de Quíbor 2026</span>
        </div>

        <Button variant="secondary" size="sm" onClick={onHide} className="fw-semibold px-4">
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
