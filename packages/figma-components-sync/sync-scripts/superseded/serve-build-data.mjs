/**
 * Serve the shard payloads to the Figma dev plugin, and catch its result POST.
 *
 * The plugin cannot read local files, but it CAN fetch from localhost once the
 * manifest declares devAllowedDomains. This is the whole reason the plugin route
 * removes the assistant from the transport path.
 */
import { createServer } from 'http';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { extname, normalize } from 'path';

const DIR = new URL('./build-data/', import.meta.url).pathname;
const PORT = Number(process.env.PORT || 8931);
const TYPES = { '.json': 'application/json', '.png': 'image/png' };

const handler = (req, res) => {
  // The plugin runs from a null origin, so CORS has to be permissive here.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }

  if (req.method === 'POST' && req.url === '/results') {
    let body = '';
    req.on('data', d => { body += d; });
    req.on('end', () => {
      writeFileSync(`${DIR}plugin-results.json`, body);
      console.log('\n=== plugin reported ===');
      try {
        for (const r of JSON.parse(body)) {
          console.log(`  ${r.page.padEnd(10)} ${String(r.built).padStart(4)} built  set ${r.setId}  [${r.properties.join(', ')}]`);
        }
      } catch { console.log(body.slice(0, 400)); }
      console.log('\nwritten to sync-scripts/build-data/plugin-results.json');
      res.writeHead(200); res.end('ok');
    });
    return;
  }

  // Serve only inside build-data, and only .json — nothing else needs to be exposed.
  const rel = normalize(decodeURIComponent((req.url || '/').split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  const file = DIR + rel.replace(/^\//, '');
  // .png as well as .json: the plugin fetches the avatar bytes from here, because
  // base64 in the payload would be larger than everything else in a shard combined.
  const ext = extname(file);
  if (!file.startsWith(DIR) || !['.json', '.png'].includes(ext) || !existsSync(file)) {
    res.writeHead(404); return res.end('not found');
  }
  res.writeHead(200, { 'Content-Type': TYPES[ext] || 'application/octet-stream' });
  res.end(readFileSync(file));
};

// Listen on BOTH loopback stacks. `localhost` resolves to ::1 first on macOS, so an
// IPv4-only bind makes the plugin's fetch fail with a connection error that is
// indistinguishable from the server not running. Loopback only — never 0.0.0.0.
for (const host of ['127.0.0.1', '::1']) {
  const s = createServer(handler);
  s.on('error', (e) => { if (e.code !== 'EADDRNOTAVAIL' && e.code !== 'EAFNOSUPPORT') throw e; });
  s.listen(PORT, host);
}
console.log(`serving ${DIR} on http://localhost:${PORT}  (127.0.0.1 and ::1)`);
console.log('waiting for the Figma dev plugin to POST /results …  (ctrl-C when done)');

