/**
 * Powers the gallery's "Regenerate" button. POST /__regenerate spawns the
 * generator and serializes concurrent clicks (returns 409 if one is already
 * in flight). GET /__regen-status returns the current dirty set for client
 * bootstrap; live deltas go over Vite HMR custom events.
 *
 * Race detail: if a watched file is touched WHILE a regen is running, the
 * generator's disk snapshot already missed it — keep dirty=true on exit
 * instead of letting the success path clear it.
 */
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'url';

const THUMBS_OVERRIDE_DIR = fileURLToPath(new URL('../../../thumbs', import.meta.url));
const REPO_ROOT = fileURLToPath(new URL('../../../../..', import.meta.url));

export function thumbRegen () {
  return {
    name: 'thumb-regen',
    configureServer (server) {
      const modifiedSlugs = new Set();
      let inFlight = null;
      let changedDuringRegen = false;

      function broadcastDirty () {
        server.ws.send({
          type: 'custom',
          event: 'regen:dirty',
          data: { slugs: [...modifiedSlugs] },
        });
      }

      function broadcastClean () {
        server.ws.send({ type: 'custom', event: 'regen:clean' });
      }

      function onFsEvent (file) {
        if (typeof file !== 'string' || !file.startsWith(THUMBS_OVERRIDE_DIR)) return;
        if (!file.endsWith('.vue')) return;
        // The filename (without extension) is the slug — overrides are
        // authored one file per slug at apps/dialtone-documentation/thumbs/<slug>.vue.
        const slug = file.slice(THUMBS_OVERRIDE_DIR.length + 1).replace(/\.vue$/, '');
        if (inFlight) changedDuringRegen = true;
        // Atomic-write editors (vim, JetBrains) fire 2–4 chokidar events per
        // save. Only broadcast on a real set growth — saves a full v-for
        // re-render on the client per duplicate event.
        const sizeBefore = modifiedSlugs.size;
        modifiedSlugs.add(slug);
        if (modifiedSlugs.size !== sizeBefore) broadcastDirty();
      }
      server.watcher.on('change', onFsEvent);
      server.watcher.on('add', onFsEvent);
      server.watcher.on('unlink', onFsEvent);

      server.middlewares.use('/__regen-status', (req, res, next) => {
        if (req.method !== 'GET') return next();
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          dirty: modifiedSlugs.size > 0,
          slugs: [...modifiedSlugs],
        }));
      });

      server.middlewares.use('/__regenerate', (req, res, next) => {
        if (req.method !== 'POST') return next();
        if (inFlight) {
          res.statusCode = 409;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ ok: false, reason: 'already-running' }));
        }
        // `?all=1` → pass `--force` to skip the content-hash cache and
        // regenerate every component. Without it, the generator's normal
        // cache logic only regens what's actually stale.
        const url = new URL(req.url, 'http://_');
        const force = url.searchParams.has('all');
        changedDuringRegen = false;
        const args = ['apps/dialtone-documentation/scripts/thumbs/generate.mjs'];
        if (force) args.push('--force');
        const child = spawn('node', args, { cwd: REPO_ROOT, stdio: ['inherit', 'pipe', 'pipe'] });
        // Forward child output to the dev-server terminal AND parse progress
        // markers. Both happen in the same 'data' handler to avoid the
        // back-pressure race that can occur when .pipe() and a 'data' listener
        // are attached to the same Readable simultaneously.
        child.stderr.on('data', (chunk) => process.stderr.write(chunk));

        let progressTotal = 0;
        let progressCurrent = 0;
        let stdoutBuf = '';
        child.stdout.on('data', (chunk) => {
          process.stdout.write(chunk);
          stdoutBuf += chunk.toString();
          let nl;
          while ((nl = stdoutBuf.indexOf('\n')) !== -1) {
            const line = stdoutBuf.slice(0, nl);
            stdoutBuf = stdoutBuf.slice(nl + 1);
            parseProgressLine(line);
          }
        });

        function parseProgressLine (line) {
          let m;
          if (
            (m = line.match(/\[generate\] --force: regenerating (\d+) component/)) ||
            (m = line.match(/\[generate\] (\d+) stale component/))
          ) {
            progressTotal = parseInt(m[1], 10);
            server.ws.send({ type: 'custom', event: 'regen:progress', data: { current: 0, total: progressTotal } });
            return;
          }
          if ((m = line.match(/^ {2}\[shot\] (\S+)… (✅|⚠️|❌)/))) {
            progressCurrent += 1;
            server.ws.send({ type: 'custom', event: 'regen:progress', data: { current: progressCurrent, total: progressTotal } });
          }
        }

        inFlight = child;
        // Node may emit 'error' without a following 'exit' (e.g. ENOENT on
        // spawn), so finalize once from whichever fires first.
        let settled = false;
        function finalize (ok, code, err) {
          if (settled) return;
          settled = true;
          inFlight = null;
          if (ok && !changedDuringRegen) {
            modifiedSlugs.clear();
            broadcastClean();
          }
          server.ws.send({ type: 'custom', event: 'regen:complete', data: { ok, code, total: progressTotal } });
          res.statusCode = ok ? 200 : 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(err ? { ok: false, error: err.message } : { ok, code }));
        }
        child.on('exit', (code) => finalize(code === 0, code, null));
        child.on('error', (err) => {
          console.error('[thumb-regen] spawn failed:', err);
          finalize(false, -1, err);
        });
      });
    },
  };
}
