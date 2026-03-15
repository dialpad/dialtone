
export default {
  default: {
    slots: {
      default: {
        initialValue: 'Label',
      },
    },
    props: {
      wrapperClass: { initialValue: 'd-g16' },
    },
  },

  'hide label': {
    props: {
      labelVisible: { initialValue: false },
    },
    slots: {
      default: { initialValue: 'Label' },
    },
  },

  'with space between': {
    props: {
      wrapperClass: { initialValue: 'd-g16 d-w128 d-jc-space-between' },
    },
    slots: {
      default: { initialValue: 'Label' },
    },
  },
};
