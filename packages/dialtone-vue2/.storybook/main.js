/** @type { import('@storybook/vue-vite').StorybookConfig } */
const config = {
  stories: [
    '../@(components|directives|recipes)/**/*.stories.@(js|jsx|ts|tsx)',
    '../@(components|directives|functions|recipes)/**/*.mdx',
  ],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-a11y", 'storybook-dark-mode'],
  framework: {
    name: "@storybook/vue-vite",
    options: {}
  },
  docs: {
    autodocs: false
  }
};
export default config;
