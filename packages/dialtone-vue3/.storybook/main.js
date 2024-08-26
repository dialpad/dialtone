import { mergeConfig } from 'vite';

/** @type { import('@storybook/vue3-vite').StorybookConfig } */
const config = {
  stories: [
    '../@(components|directives|recipes|prototypes)/**/*.stories.@(js|jsx|ts|tsx)',
    '../@(components|directives|docs|functions|recipes)/**/*.mdx',

    // @TODO: Replace lines before merging to exclude filter_pill component from storybook.
    //'../@(components|directives|recipes|prototypes)/**/!(filter_pill)/*.stories.@(js|jsx|ts|tsx)',
    //'../@(components|directives|docs|functions|recipes)/**/!(filter_pill)/*.mdx',
  ],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-a11y", 'storybook-dark-mode'],
  framework: {
    name: "@storybook/vue3-vite",
    options: {}
  },
  docs: {
    autodocs: false
  },
  async viteFinal(config) {
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
};
export default config;
