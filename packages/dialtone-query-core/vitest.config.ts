import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'dialtone-query-core',
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    testTimeout: 10000,
  },
});
