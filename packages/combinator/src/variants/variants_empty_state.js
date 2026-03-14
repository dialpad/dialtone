
export default {
  default: {
    props: {
      headerText: {
        initialValue: 'Nothing to see here',
      },
      bodyText: {
        initialValue: 'Looks like there is no data to display here.',
      },
    },
  },

  'with illustration': {
    props: {
      headerText: { initialValue: 'Nothing to see here' },
      bodyText: { initialValue: 'Looks like there is no data to display here.' },
      size: { initialValue: 'lg' },
    },
    slots: {
      illustration: {
        initialValue: '<dt-illustration-nothing-to-see-here />',
      },
    },
  },
};
