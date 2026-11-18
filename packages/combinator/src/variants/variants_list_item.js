 

export default {
  default: {
    props: {
      navigationType: {
        initialValue: 'tab',
      },
    },
    slots: {
      default: {
        initialValue: 'Default List Item',
      },
    },
  },

  disabled: {
    props: {
      navigationType: {
        initialValue: 'tab',
      },
      disabled: {
        initialValue: true,
      },
    },
    slots: {
      default: {
        initialValue: 'Delete',
      },
    },
  },
};
