import { defineConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    name: 'dialtone-docs',
    globals: true,
    environment: 'node',
    root: path.resolve(__dirname),
    include: ['tests/**/*.test.js'],
    testTimeout: 10000,
    reporters: ['verbose'],
  },
  resolve: {
    alias: {
      '@helpers': path.resolve(__dirname, 'tests/helpers'),
      '@src': path.resolve(__dirname, 'src'),
    },
  },
});
