import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

// The comparison Storybook: Vue's sidebar, generated from Vue's story index by
// compare/generate-stories.mjs, with each story showing Vue and React side by
// side. Only the dark-mode addon: everything else happens in the two frames.
const config: StorybookConfig = {
  stories: ['../generated/**/*.stories.tsx'],

  addons: [
    '@vueless/storybook-dark-mode',
  ],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  async viteFinal (config) {
    return mergeConfig(config, {
      // One React: @vueless/storybook-dark-mode imports react without declaring
      // it, which pnpm resolves to the workspace's hoisted React 18.
      resolve: {
        dedupe: ['react', 'react-dom'],
      },
    });
  },

  // Vue's favicons and logos, as in the other two Storybooks.
  staticDirs: ['../../../dialtone-vue/common/assets/'],
};
export default config;
