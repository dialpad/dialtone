import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

const packageRoot = fileURLToPath(new URL('.', import.meta.url));
const coreStub = fileURLToPath(new URL('./tests/fixtures/core-stub.js', import.meta.url));

export default defineConfig({
  test: {
    name: 'dialtone-tokens',
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.test.js'],
  },
  resolve: {
    alias: [
      // Must precede the '@' prefix alias below — Vite array-form aliases match in order.
      { find: '@/themes/core.js', replacement: coreStub },
      { find: '@', replacement: packageRoot },
    ],
  },
});
