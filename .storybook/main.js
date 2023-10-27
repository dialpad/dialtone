/** @type { import('@storybook/vue-vite').StorybookConfig } */
const config = {
  stories: [
    '../components/**/*.stories.@(js|jsx|ts|tsx)',
    '../components/**/*.mdx',
    '../recipes/**/*.stories.@(js|jsx|ts|tsx)',
    '../recipes/**/*.mdx', '../docs/**/*.mdx',
    '../directives/**/*.stories.@(js|jsx|ts|tsx)',
    '../directives/**/*.mdx',
    '../functions/**/*.mdx'
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
