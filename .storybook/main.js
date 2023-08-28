/** @type { import('@storybook/vue3-vite').StorybookConfig } */
const config = {
  stories: ['../components/**/*.stories.@(js|jsx|ts|tsx)', '../components/**/*.mdx', '../recipes/**/*.stories.@(js|jsx|ts|tsx)', '../recipes/**/*.mdx', '../docs/**/*.mdx'],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-a11y", 'storybook-dark-mode'],
  framework: {
    name: "@storybook/vue3-vite",
    options: {}
  },
  docs: {
    autodocs: false
  }
};
export default config;
