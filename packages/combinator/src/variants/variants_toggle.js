export default {
  default: {
    slots: {
      default: {
        initialValue: 'Label',
      },
    },
    props: {
      modelValue: { initialValue: true },
    },
  },

  'hide label': {
    props: {
      showLabel: { initialValue: false },
    },
    slots: {
      default: { initialValue: 'Label' },
    },
  },

  'indeterminate': {
    props: {
      modelValue: { initialValue: 'mixed' },
      size: { initialValue: '200' },
    },
    slots: {
      default: { initialValue: 'Indeterminate' },
    },
  },
};
