 
export default {
  default: {
    props: {
      label: {
        initialValue: 'Checkbox label',
      },
    },
  },

  'with description': {
    props: {
      label: { initialValue: 'Block callers not already in contacts list' },
      description: { initialValue: 'You get enough calls. Free up some of your time.' },
    },
  },
};
