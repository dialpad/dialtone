import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

// Mirrors packages/dialtone-vue/.storybook/main.js, minus the docs (no MDX,
// no addon-docs) and Vue's .jsx workaround (react-vite brings its own React
// plugin). Addons resolve by name: they are direct devDependencies of this
// package, so Vue's require.resolve helper isn't needed, and this file stays
// free of Node types.
const config: StorybookConfig = {
  stories: [
    '../@(components|common|directives|prototypes|localization)/**/*.stories.@(js|jsx|ts|tsx)',
  ],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-a11y',
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
      build: {
        sourcemap: true,
      },
      css: {
        devSourcemap: true,
      },
    });
  },

  // Vue's assets (favicons, logos, avatars), so both Storybooks serve the same files.
  staticDirs: ['../../dialtone-vue/common/assets/'],
};
export default config;
