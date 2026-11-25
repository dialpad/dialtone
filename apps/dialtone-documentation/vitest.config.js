import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const workspaceRoot = fileURLToPath(new URL('../../', import.meta.url));
const combinatorRoot = fileURLToPath(new URL('../../packages/combinator/', import.meta.url));
const requireCombinator = createRequire(`${combinatorRoot}package.json`);

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [vue()],
  resolve: {
    dedupe: ['vue', 'vue-router'],
    alias: {
      // Reuse the package's test harness and its test-utils version without a second dependency installation.
      '@vue/test-utils': requireCombinator.resolve('@vue/test-utils'),
      '@dialpad/dialtone-combinator': `${combinatorRoot}index.js`,
      '@workspaceRoot': workspaceRoot,
      '@': combinatorRoot,
      vue: 'vue/dist/vue.esm-bundler.js',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['docs/.vuepress/**/*.test.js'],
    setupFiles: [`${combinatorRoot}tests/setupTests.js`],
  },
});
