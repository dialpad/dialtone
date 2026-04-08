// This file has been automatically migrated to valid ESM format by Storybook.
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { mergeConfig } from 'vite';
import react from '@vitejs/plugin-react';

const require = createRequire(import.meta.url);

/** @type { import('@storybook/vue3-vite').StorybookConfig } */
const config = {
  stories: [
    '../@(components|directives|recipes|prototypes|localization)/**/*.stories.@(js|jsx|ts|tsx)',
    '../@(components|directives|docs|recipes|localization)/**/*.mdx',
    '../functions/*.mdx',
  ],

  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@vueless/storybook-dark-mode'),
    getAbsolutePath('@storybook/addon-docs'),
  ],

  framework: {
    name: getAbsolutePath('@storybook/vue3-vite'),
    options: {},
  },

  async viteFinal (config) {
    // Merge custom configuration into the default config
    return mergeConfig(config, {
      // @vitejs/plugin-react ensures .jsx files are transformed before
      // Storybook's external-globals-plugin (which uses es-module-lexer
      // and cannot parse JSX). Scoped to .jsx only to avoid conflicts
      // with Vue's SFC compiler.
      plugins: [react({ include: /\.jsx$/, jsxRuntime: 'classic' })],
      build: {
        sourcemap: true,
      },
      css: {
        devSourcemap: true,
      },
      optimizeDeps: {
        include: ['react-dom/client'],
      },
    });
  },

  staticDirs: ['../common/assets/'],
};
export default config;

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, 'package.json')));
}
