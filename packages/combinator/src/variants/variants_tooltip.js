export default {
  default: {
    props: {
      show: {
        initialValue: true,
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
      show: {
        initialValue: true,
      },
      message: {
        initialValue: 'This is a tooltip',
      },
      inverted: {
        initialValue: true,
        lockControl: true,
      },
    },
    slots: {
      anchor: {
        initialValue: '<dt-button>Hover me</dt-button>',
      },
    },
  },
};
