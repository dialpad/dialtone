import { mergeConfig } from 'vite';

/** @type { import('@storybook/vue3-vite').StorybookConfig } */
const config = {
  stories: [
    '../@(components|directives|recipes|prototypes|localization)/**/*.stories.@(js|jsx|ts|tsx)',
    '../@(components|directives|docs|functions|recipes|localization)/**/*.mdx',
  ],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-a11y', 'storybook-dark-mode'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  docs: {
    autodocs: false,
  },
  async viteFinal (config) {
    // Merge custom configuration into the default config
    const customConfig = {
      build: {
        sourcemap: true,
        rollupOptions: {
          external: (id) => {
            // Don't try to bundle CSS files - they're handled separately
            return id.includes('.css');
          },
        },
      },
      css: {
        devSourcemap: true,
      },
    };


    return mergeConfig(config, customConfig);
  },
  staticDirs: ['../common/assets/'],
};
export default config;
