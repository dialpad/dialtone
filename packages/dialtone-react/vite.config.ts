import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    name: 'dialtone-react',
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['{common,components,icons}/**/*.test.{ts,tsx}'],
    // The package starts with no components, so no tests; the gate checks that a unit's tests ran.
    passWithNoTests: true,
  },
});
