/**
 * Vite config for the thumb harness.
 * Used by both:
 *   - `vite` CLI (preview / live-edit mode — see nx target `dialtone-documentation:thumbs:preview`)
 *   - generate.mjs (loaded automatically by Vite's auto-discovery)
 */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'url';

export default defineConfig({
  plugins: [vue()],
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
