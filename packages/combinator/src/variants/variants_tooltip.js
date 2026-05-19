

export default {
  default: {
    props: {
      open: {
        initialValue: false,
      },
      message: {
        initialValue: 'This is a tooltip',
      },
    },
    slots: {
      anchor: {
        initialValue: '<dt-button>Hover me</dt-button>',
      },
    },
  },
  inverted: {
    props: {
      open: {
        initialValue: false,
      },
      message: {
        initialValue: 'This is a tooltip',
      },
      inverted: {
        initialValue: true,
      },
    },
    slots: {
      anchor: {
        initialValue: '<dt-button>Hover me</dt-button>',
      },
    },
  },
};
