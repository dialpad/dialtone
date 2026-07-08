/**
 * Vite config for the visual-guide capture harness.
 *
 * Renders self-contained "scene" .vue files (../scenes/*.vue) against whichever
 * Dialtone build is present in the surrounding checkout. The generator copies
 * this whole scripts/visual-guide directory into a `staging` worktree to capture
 * the "before" state — each checkout's own built packages supply the old vs new
 * token values, so scene files stay branch-neutral.
 */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'url';

// repo root = apps/dialtone-documentation/scripts/visual-guide/harness → 5 up
const REPO_ROOT = fileURLToPath(new URL('../../../../..', import.meta.url));

export default defineConfig({
  plugins: [vue()],
  define: {
    // Absolute path of the surrounding checkout, exposed so main.js can load
    // the built theme JS via /@fs/ URLs at runtime (see note there).
    __DT_ROOT__: JSON.stringify(REPO_ROOT.replace(/\/$/, '')),
  },
  // Serve the docs site's static assets so scenes can reference image paths
  // (e.g. avatar photos) exactly as a real doc page would.
  publicDir: `${REPO_ROOT}/apps/dialtone-documentation/docs/.vuepress/public`,
  resolve: {
    alias: {
      // Full Vue bundle (runtime template compiler) — matches the thumbs harness.
      vue: 'vue/dist/vue.esm-bundler.js',
      // dialtone-vue and dialtone-css only live in app-level node_modules, so
      // point them straight at their workspace packages — which also keeps the
      // harness working when copied into a staging worktree.
      '@dialpad/dialtone-vue': `${REPO_ROOT}/packages/dialtone-vue`,
      '@dialpad/dialtone-css': `${REPO_ROOT}/packages/dialtone-css`,
    },
  },
  server: {
    // Scenes + the @dialpad/* workspace packages live above the harness root,
    // so the fs allow-list has to reach the repo root.
    fs: { allow: ['..', '../..', '../../..', '../../../..', '../../../../..'] },
  },
});
