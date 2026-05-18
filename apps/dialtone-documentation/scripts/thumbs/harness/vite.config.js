/**
 * Vite config for the thumb harness.
 * Used by both:
 *   - `vite` CLI (preview / live-edit mode — see nx target `dialtone-documentation:thumbs:preview`)
 *   - generate.mjs (loaded automatically by Vite's auto-discovery)
 */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'url';

const THUMBS_OVERRIDE_DIR = fileURLToPath(new URL('../../../thumbs', import.meta.url));
const REPO_ROOT = fileURLToPath(new URL('../../../../..', import.meta.url));

export default defineConfig({
  plugins: [
    vue(),
    {
      // The override `.vue` files live outside the harness root, so Vite's
      // file watcher doesn't pick up additions automatically — new overrides
      // would only appear after a server restart. Explicitly subscribe the
      // override dir to chokidar so `import.meta.glob('.../thumbs/*.vue')` in
      // main.js re-evaluates and HMRs when a new file appears.
      name: 'watch-thumb-overrides',
      configureServer (server) {
        server.watcher.add(THUMBS_OVERRIDE_DIR);
      },
    },
    {
      // Powers the gallery's "Regenerate" button.
      //
      // Tracks an in-memory `dirty` flag: flips to true whenever a watched
      // override .vue file is added / changed / removed, and resets after a
      // successful regen. Clients ask for the current state via GET
      // /__regen-status (used on initial page load), and subscribe to live
      // updates via Vite's HMR custom events (`regen:dirty` / `regen:clean`).
      //
      // POST /__regenerate spawns the generator in-place — equivalent to
      // `pnpm nx run dialtone-documentation:thumbs` from the repo root.
      // Output streams to the terminal running this dev server. Serialized
      // via a single in-flight child; concurrent clicks return 409.
      //
      // Race detail: if a watched file is touched WHILE a regen is running,
      // the generator's disk snapshot already missed it — so we keep
      // dirty=true on exit instead of letting the success path clear it.
      name: 'thumb-regen',
      configureServer (server) {
        // Set of slugs whose override file has changed since the last regen.
        // The gallery uses this to highlight the matching cells with a focus
        // border, and the split button's "Regenerate" (start) is enabled
        // when this set is non-empty.
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
          child.on('exit', (code) => {
            inFlight = null;
            const ok = code === 0;
            if (ok && !changedDuringRegen) {
              modifiedSlugs.clear();
              broadcastClean();
            }
            server.ws.send({ type: 'custom', event: 'regen:complete', data: { ok, code, total: progressTotal } });
            res.statusCode = ok ? 200 : 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok, code }));
          });
        });
      },
    },
  ],
  // Serve the docs site's static assets at the same URL paths the wall uses,
  // so override files can reference `/assets/images/<x>.png` exactly as they
  // would in a real component doc page (e.g. avatar.vue uses person.png).
  publicDir: fileURLToPath(new URL('../../../docs/.vuepress/public', import.meta.url)),
  resolve: {
    alias: {
      // Full Vue bundle (includes runtime template compiler) — needed so the
      // Combinator-variant slot template strings can be compiled at runtime.
      vue: 'vue/dist/vue.esm-bundler.js',
      // Reach the Combinator variants files directly from the harness.
      '@variants': fileURLToPath(new URL('../../../../../packages/combinator/src/variants', import.meta.url)),
    },
  },
  server: {
    // Allow imports from outside the harness root (the override files live
    // at apps/dialtone-documentation/thumbs/).
    fs: { allow: ['..', '../../..', '../../../..'] },
  },
});
