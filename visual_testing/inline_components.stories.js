import InlineComponentsMdx from './inline_components.mdx';

export default {
  title: 'Visual Testing/Inline Components',
  args: {
    show: true,
  },
  parameters: {
    docs: {
      page: InlineComponentsMdx,
    },
    options: { showPanel: false },
    a11y: {
      disable: true,
    },
  },
};

export const Default = () => ({
  template: '<h1>Only visible in Docs mode</h1>',
});
