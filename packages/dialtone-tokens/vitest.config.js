import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

const packageRoot = fileURLToPath(new URL('.', import.meta.url));
const coreStub = fileURLToPath(new URL('./tests/fixtures/core-stub.js', import.meta.url));
const coreNoLayersStub = fileURLToPath(new URL('./tests/fixtures/core-no-layers-stub.js', import.meta.url));

export default defineConfig({
  test: {
    name: 'dialtone-tokens',
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.test.js'],
  },
  resolve: {
    alias: [
      // Must precede the '@/' prefix alias below — Vite array-form aliases match in order.
      { find: '@/themes/core.js', replacement: coreStub },
      { find: '@/themes/core-no-layers.js', replacement: coreNoLayersStub },
      // Restricted to '@/...' so it doesn't match scoped package imports like '@scope/pkg'.
      { find: /^@\/(.*)/, replacement: `${packageRoot}/$1` },
    ],
  },
});
