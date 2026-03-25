
export default {
  default: {
    slots: {
      default: {
        initialValue: 'Label',
      },
    },
    props: {
      wrapperClass: { initialValue: 'd-g-200' },
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
      wrapperClass: { initialValue: 'd-g-200 d-w-200 d-jc-space-between' },
    },
    slots: {
      default: { initialValue: 'Label' },
    },
  },
};
