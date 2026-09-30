import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'dialtone-cli',
    include: ['tests/**/*.test.ts'],
  },
});
