// eslint-disable-next-line storybook/story-exports
export default {
  title: 'Visual Testing/Inline Components',
  args: {
    show: true,
  },

  parameters: {
    options: { showPanel: false },
    viewMode: 'docs',
    previewTabs: { canvas: { hidden: true } },
    controls: { disable: true },
    a11y: {
      disable: true,
    },
    percy: {
      queryParams: {
        path: '/docs/visual-testing-inline-components--docs',
        viewMode: 'docs',
      },
    },
  },
};
