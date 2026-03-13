export default {
  default: {
    props: {
      open: {
        initialValue: true,
      },
    },
    slots: {
      anchor: {
        initialValue: '<dt-button>View Popover</dt-button>',
      },
      content: {
        initialValue: '<p class="d-mb4">This is content rendered within the popover.</p>',
      },
    },
  },
};
