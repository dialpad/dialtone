
export default {
  default: {
    props: {
      validationMessages: {
        initialValue: [{ message: 'Positive validation message', type: 'success' }],
      },
    },
  },
  'with error': {
    props: {
      validationMessages: {
        initialValue: [{ message: 'Error validation message', type: 'error' }],
      },
    },
  },
  'with warning': {
    props: {
      validationMessages: {
        initialValue: [{ message: 'Warning validation message', type: 'warning' }],
      },
    },
  },
  'with multiple errors': {
    props: {
      validationMessages: {
        initialValue: [
          { message: 'First error message', type: 'error' },
          { message: 'Second error message', type: 'error' },
        ],
      },
    },
  },
};
