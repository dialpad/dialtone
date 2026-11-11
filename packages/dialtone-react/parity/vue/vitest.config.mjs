// Runs goldens.test.js under dialtone-vue's own Vite/Vitest config: its plugins, alias, setup file and
// jsdom environment. Only the test file and a couple of resolution details change.
import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import vueConfig from '../../../dialtone-vue/vite.config.js';

const here = p => fileURLToPath(new URL(p, import.meta.url));
const vueRoot = here('../../../dialtone-vue');

export default defineConfig({
  ...vueConfig,
  root: vueRoot,
  plugins: vueConfig.plugins.filter(p => p && p.name !== 'vite:dts'),
  resolve: {
    ...vueConfig.resolve,
    alias: [
      // Combinator's variant files import its internals through its own '@' alias, and some import the built
      // library; use the source, which a fresh checkout has and which is never stale.
      { find: /^@\/src\//, replacement: here('../../../combinator/src/') },
      { find: /^@dialpad\/dialtone-vue$/, replacement: here('../../../dialtone-vue/index.js') },
      ...Object.entries(vueConfig.resolve.alias).map(([find, replacement]) => ({ find, replacement })),
    ],
    // This test file lives outside dialtone-vue; resolve Vue from there, so there's a single copy.
    dedupe: ['vue', '@vue/test-utils'],
  },
  test: {
    ...vueConfig.test,
    name: 'dialtone-vue-parity',
    dir: here('.'),
    // PARITY_VUE_TESTS=transition-traces.test.js re-records DtTransition's reference traces.
    include: [process.env.PARITY_VUE_TESTS ?? 'goldens.test.js'],
    exclude: [],
    setupFiles: [here('../../../dialtone-vue/tests/setupTests.js'), here('../dom-setup.mjs')],
    coverage: { enabled: false },
  },
});
