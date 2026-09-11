import { getDatabase, exportToJson } from './db.js';

/**
 * Plugin de Vite para exponer la API local de base de datos SQLite
 * Solo se activa en modo de desarrollo local ('serve')
 */
export function viteSqliteDbPlugin() {
  return {
    name: 'vite-sqlite-db-plugin',
    configureServer(server) {
      server.middlewares.use('/api/db', async (req, res, next) => {
        // Habilitar CORS para peticiones locales
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }

        const url = req.url || '';

        try {
          const db = getDatabase();

          // 1. GET /api/db/all - Retorna todos los datos para el panel de control
          if (req.method === 'GET' && (url === '/all' || url === '/' || url === '')) {
            const settings = db.prepare('SELECT * FROM settings ORDER BY category, key').all();
            const climateMonths = db.prepare('SELECT * FROM climate_months ORDER BY id').all();
            const crops = db.prepare('SELECT * FROM crops ORDER BY id').all();
            const siteContent = db.prepare('SELECT * FROM site_content ORDER BY section, key').all();

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: true,
              data: {
                settings,
                climateMonths,
                crops,
                siteContent
              }
            }));
            return;
          }

          // Para métodos POST/PUT, parsear el body JSON
          if (req.method === 'POST' || req.method === 'PUT') {
            let bodyStr = '';
            req.on('data', (chunk) => {
              bodyStr += chunk;
            });

            req.on('end', () => {
              try {
                const body = bodyStr ? JSON.parse(bodyStr) : {};

                // 2. POST /api/db/setting - Actualizar un parámetro
                if (url.startsWith('/setting')) {
                  const { key, value } = body;
                  if (!key || value === undefined) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: 'Faltan parámetros key o value' }));
                    return;
                  }

                  const update = db.prepare('UPDATE settings SET value = ? WHERE key = ?');
                  const result = update.run(String(value), key);

                  // Data Baking automático tras actualizar
                  exportToJson();

                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({
                    success: true,
                    changes: result.changes,
                    message: `Parámetro ${key} actualizado con éxito.`
                  }));
                  return;
                }

                // 3. POST /api/db/climate - Actualizar un mes
                if (url.startsWith('/climate')) {
                  const { id, max, min, tmed, lluvia, viento, bochorno, rh, rad, eto, dir } = body;
                  if (!id) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: 'ID de mes requerido' }));
                    return;
                  }

                  const update = db.prepare(`
                    UPDATE climate_months 
                    SET max = ?, min = ?, tmed = ?, lluvia = ?, viento = ?, bochorno = ?, rh = ?, rad = ?, eto = ?, dir = ?
                    WHERE id = ?
                  `);
                  const result = update.run(
                    Number(max), Number(min), Number(tmed), Number(lluvia), 
                    Number(viento), Number(bochorno), Number(rh), Number(rad), 
                    Number(eto), String(dir), Number(id)
                  );

                  exportToJson();

                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({
                    success: true,
                    changes: result.changes,
                    message: `Datos climáticos del mes ${id} actualizados.`
                  }));
                  return;
                }

                // 4. POST /api/db/crop - Actualizar un cultivo
                if (url.startsWith('/crop')) {
                  const { id, name, scientific_name, ec_threshold, slope_percent_per_ds, recommended_gsm, pesticide_reduction, virosis_risk_reduction, target_yield_tons, avg_price_usd_per_kg } = body;
                  if (!id) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: 'ID de cultivo requerido' }));
                    return;
                  }

                  const update = db.prepare(`
                    UPDATE crops 
                    SET name = ?, scientific_name = ?, ec_threshold = ?, slope_percent_per_ds = ?, 
                        recommended_gsm = ?, pesticide_reduction = ?, virosis_risk_reduction = ?, 
                        target_yield_tons = ?, avg_price_usd_per_kg = ?
                    WHERE id = ?
                  `);
                  const result = update.run(
                    name, scientific_name, Number(ec_threshold), Number(slope_percent_per_ds),
                    recommended_gsm, pesticide_reduction, virosis_risk_reduction,
                    Number(target_yield_tons), Number(avg_price_usd_per_kg), id
                  );

                  exportToJson();

                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({
                    success: true,
                    changes: result.changes,
                    message: `Cultivo ${id} actualizado.`
                  }));
                  return;
                }

                // 5. POST /api/db/content - Actualizar texto
                if (url.startsWith('/content')) {
                  const { key, value } = body;
                  if (!key || value === undefined) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: 'Key y value requeridos' }));
                    return;
                  }

                  const update = db.prepare('UPDATE site_content SET value = ? WHERE key = ?');
                  const result = update.run(String(value), key);

                  exportToJson();

                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({
                    success: true,
                    changes: result.changes,
                    message: `Texto ${key} actualizado.`
                  }));
                  return;
                }

                // 6. POST /api/db/bake - Forzar exportación manual
                if (url.startsWith('/bake')) {
                  exportToJson();
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({
                    success: true,
                    message: 'Exportación a JSON (Data Baking) ejecutada correctamente.'
                  }));
                  return;
                }

                res.statusCode = 404;
                res.end(JSON.stringify({ error: 'Ruta API no encontrada' }));
              } catch (parseErr) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: parseErr.message }));
              }
            });
            return;
          }

          next();
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    }
  };
}
