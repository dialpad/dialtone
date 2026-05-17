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
      // POST /__regenerate spawns the thumb generator in-place so the gallery
      // page can ship a "Regenerate" button. Equivalent to running
      // `pnpm nx run dialtone-documentation:thumbs` from the repo root.
      // Output streams to the terminal running this dev server. Serializes
      // requests via a single in-flight child — clicking the button while
      // regen is running returns 409 instead of spawning a second instance.
      name: 'thumb-regen-endpoint',
      configureServer (server) {
        let inFlight = null;
        server.middlewares.use('/__regenerate', (req, res, next) => {
          if (req.method !== 'POST') return next();
          if (inFlight) {
            res.statusCode = 409;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ ok: false, reason: 'already-running' }));
          }
          const child = spawn(
            'node',
            ['apps/dialtone-documentation/scripts/thumbs/generate.mjs'],
            { cwd: REPO_ROOT, stdio: 'inherit' },
          );
          inFlight = child;
          child.on('exit', (code) => {
            inFlight = null;
            res.statusCode = code === 0 ? 200 : 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: code === 0, code }));
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
