 
 

export default {
  defaults: {
    props: {
      size: { tokenCategory: 'icon-size' },
    },
  },

  default: {
    props: {
      size: { initialValue: '500' },
      ariaLabel: { initialValue: 'Processing' },
    },
  },

  small: {
    props: {
      size: { initialValue: '100' },
      ariaLabel: { initialValue: 'Processing' },
    },
  },

  large: {
    props: {
      size: { initialValue: '400' },
      ariaLabel: { initialValue: 'Processing' },
    },
  },
};
