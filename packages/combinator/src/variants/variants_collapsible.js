/* eslint-disable max-len */
 
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

  'with anchor slot': {
    props: {
      open: { initialValue: true },
    },
    slots: {
      anchor: { initialValue: '<dt-button>Click Me!</dt-button>' },
      content: { initialValue: '<div>This will be shown in the expanded area.</div>' },
    },
  },
};
