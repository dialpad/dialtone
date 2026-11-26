import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    name: 'dialtone-react',
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    // compare/: the comparison Storybook's sync relay and cursor.
    include: ['{common,compare,components,icons,tests}/**/*.test.{ts,tsx}'],
  },
});
