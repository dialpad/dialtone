export default {
  default: {
    props: {
      validationMessages: {
        initialValue: [{ message: 'Positive validation message', type: 'positive' }],
      },
    },
  },
  'with error': {
    props: {
      validationMessages: {
        initialValue: [{ message: 'Critical validation message', type: 'critical' }],
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
          { message: 'First error message', type: 'critical' },
          { message: 'Second error message', type: 'critical' },
        ],
      },
    },
  },
};
