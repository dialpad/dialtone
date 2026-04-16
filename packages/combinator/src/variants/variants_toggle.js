export default {
  default: {
    slots: {
      default: {
        initialValue: 'Label',
      },
    },
    props: {
      class: { initialValue: 'd-g-200' },
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

  'with space between': {
    props: {
      class: { initialValue: 'd-g-200 d-w-200 d-jc-space-between' },
    },
    slots: {
      default: { initialValue: 'Label' },
    },
  },
};
