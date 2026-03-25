 
export default {
  default: {
    props: {
      show: {
        initialValue: true,
      },
    },
    slots: {
      default: {
        initialValue: 'I\'m Lazy!',
      },
    },
  },

  'with transition': {
    props: {
      transition: { initialValue: 'fade' },
      show: { initialValue: true },
    },
    slots: {
      default: { initialValue: 'I\'m Lazy!' },
    },
  },
};
