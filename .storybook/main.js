/** @type { import('@storybook/vue-vite').StorybookConfig } */
const config = {
  stories: [
    '../components/**/*.stories.@(js|jsx|ts|tsx)',
    '../components/**/*.mdx',
    '../recipes/**/*.stories.@(js|jsx|ts|tsx)',
    '../recipes/**/*.mdx',
    '../docs/**/*.mdx',
    '../visual_testing/*.stories.@(js|jsx|ts|tsx)',
    '../visual_testing/*.mdx',
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
    "@storybook/addon-styling",
  ],
  framework: {
    name: "@storybook/vue-vite",
    options: {},
  },
  docs: {
    autodocs: false,
  },
};
export default config;
