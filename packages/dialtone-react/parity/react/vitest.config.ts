import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import base from '../../vite.config';

export default defineConfig({
  ...base,
  root: fileURLToPath(new URL('../..', import.meta.url)),
  test: {
    ...base.test,
    name: 'dialtone-react-parity',
    include: ['parity/react/dom.test.tsx'],
    setupFiles: [...[base.test?.setupFiles ?? []].flat(), './parity/dom-setup.mjs'],
  },
});
