export default {
  default: {
    props: {
      anchorText: {
        initialValue: 'Click me to toggle Content',
      },
    },
    slots: {
      content: {
        initialValue: '<div>Content slot</div>',
      },
    },
  },
};
