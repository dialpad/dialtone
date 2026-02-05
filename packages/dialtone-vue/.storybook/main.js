// This file has been automatically migrated to valid ESM format by Storybook.
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { mergeConfig } from 'vite';

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
      build: {
        sourcemap: true,
      },
      css: {
        devSourcemap: true,
      },
    });
  },

  staticDirs: ['../common/assets/'],
};
export default config;

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, 'package.json')));
}
