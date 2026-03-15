
export default {
  default: {
    slots: {
      default: {
        initialValue: 'Label',
      },
    },
  },

  'hide label': {
    props: {
      labelVisible: { initialValue: false },
    },
  },

  'with space between': {
    props: {
      labelVisible: { initialValue: true },
      wrapperClass: { initialValue: 'd-g16 d-w128 d-jc-space-between' },
    },
    slots: {
      default: { initialValue: 'Label' },
    },
  },
};
