/**
 * Vite config for the thumb harness.
 * Used by both:
 *   - `vite` CLI (preview / live-edit mode — see nx target `dialtone-documentation:thumbs:preview`)
 *   - generate.mjs (loaded automatically by Vite's auto-discovery)
 */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'url';
import { thumbRegen } from './vite-plugin-thumb-regen.mjs';

const THUMBS_OVERRIDE_DIR = fileURLToPath(new URL('../../../thumbs', import.meta.url));

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
    thumbRegen(),
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
      // Combinator variant files use the package-local `@` alias for helpers.
      '@': fileURLToPath(new URL('../../../../../packages/combinator', import.meta.url)),
    },
  },
  server: {
    // Allow imports from outside the harness root. The override files live
    // at apps/dialtone-documentation/thumbs/, and the @variants alias
    // resolves to packages/combinator/src/variants — so the allow list has
    // to reach the repo root, not just apps/.
    fs: { allow: ['..', '../../..', '../../../..', '../../../../..'] },
  },
});
