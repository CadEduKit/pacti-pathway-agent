import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname, sep } from 'node:path';
import { generatePlan } from './agent.mjs';
const root = fileURLToPath(new URL('../dist/', import.meta.url));
const port = Number(process.env.PORT || 8787);
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png' };
let busy = false;
const send = (res, status, value) => { res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(value)); };
const server = createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  if (pathname === '/api/hvac-plan') {
    if (req.method !== 'POST') return send(res, 405, { error: 'Use POST.' });
    if (!['application/json'].includes(req.headers['content-type']?.split(';')[0])) return send(res, 415, { error: 'JSON required.' });
    const allowedOrigins = [`http://127.0.0.1:${port}`, `http://localhost:${port}`, 'http://localhost:5173', 'http://127.0.0.1:5173'];
    if (req.headers.origin && !allowedOrigins.includes(req.headers.origin)) return send(res, 403, { error: 'Origin rejected.' });
    let body = '';
    try { for await (const chunk of req) { body += chunk; if (body.length > 100) return send(res, 413, { error: 'Fixed demo accepts no participant data.' }); } if (body.trim() !== '{}') return send(res, 400, { error: 'Send an empty JSON object. Only the synthetic profile is supported.' }); } catch { return send(res, 400, { error: 'Invalid request.' }); }
    if (busy) return send(res, 429, { error: 'A plan is already being generated. Please wait.' });
    busy = true;
    try { return send(res, 200, await generatePlan()); }
    catch (error) { const unconfigured = error.message === 'NEBIUS_NOT_CONFIGURED'; return send(res, unconfigured ? 503 : 502, { error: unconfigured ? 'Live NVIDIA generation is not configured. Set server-side NEBIUS_API_KEY and NEBIUS_MODEL.' : 'Live NVIDIA generation failed. No plan was created. Check server configuration and Nebius availability.' }); }
    finally { busy = false; }
  }
  if (!['GET', 'HEAD'].includes(req.method)) return send(res, 405, { error: 'Method not supported.' });
  try {
    const decoded = decodeURIComponent(pathname);
    const file = resolve(root, '.' + decoded);
    if (file !== root && !file.startsWith(root + sep)) return send(res, 403, { error: 'Invalid path.' });
    let bytes;
    let extension = extname(file);
    try { bytes = await readFile(file); } catch { if (extension) return send(res, 404, { error: 'Not found.' }); bytes = await readFile(resolve(root, 'index.html')); extension = '.html'; }
    res.writeHead(200, { 'Content-Type': mime[extension] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' }); res.end(req.method === 'HEAD' ? undefined : bytes);
  } catch { return send(res, 404, { error: 'Build the frontend first.' }); }
});
server.listen(port, '127.0.0.1', () => console.log(`PACTI local demo: http://127.0.0.1:${port}`));
