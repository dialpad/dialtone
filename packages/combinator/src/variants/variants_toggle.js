export default {
  default: {
    slots: {
      default: {
        initialValue: 'Label',
      },
    },
    props: {
      labelClass: { initialValue: 'd-pie-100' },
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
};
