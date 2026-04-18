 
export default {
  default: {
    slots: {
      default: {
        initialValue: 'Label',
      },
    },
    props: {
      labelClass: { initialValue: 'd-pie-100' },
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
