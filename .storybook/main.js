import { mergeConfig } from 'vite';
import { fileURLToPath } from 'url';

export default {
  stories: ['../components/**/*.stories.@(js|mdx)', '../recipes/**/*.stories.@(js|mdx)', '../docs/**/*.stories.@(js|mdx)', '../visual_testing/*.stories.@(js|mdx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-controls', '@storybook/addon-actions', '@storybook/addon-links', '@storybook/addon-a11y', '@storybook/addon-viewport', '@storybook/addon-backgrounds', '@storybook/addon-styling', '@storybook/addon-mdx-gfm'],
  framework: {
    name: '@storybook/vue-vite',
    options: {}
  },
  core: {
    builder: '@storybook/builder-vite',
  },
  docs: {
    autodocs: true
  },
  async viteFinal(config, { configType }) {
    return mergeConfig(config, {
      server: {
        fs: {
          strict: false
        }
      },
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('../', import.meta.url)),
        },
      },
    });
  }
};
