

export default {
  title: 'Visual Testing/Inline Components',
  args: {
    show: true,
  },

  parameters: {
    options: { showPanel: false },
    a11y: {
      disable: true,
    },
    percy: {
      queryParams: {
        viewMode: 'docs',
      },
    },
  },
};

export const Default = () => ({
  template: '<h1>Only visible in Docs mode</h1>',
});
