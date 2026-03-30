
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
    slots: {
      illustration: {
        initialValue: '<dt-illustration-nothing-to-see-here />',
      },
    },
  },

  'with no illustration': {
    props: {
      headerText: { initialValue: 'Nothing to see here' },
      bodyText: { initialValue: 'Looks like there is no data to display here.' },
      size: { initialValue: '400' },
    },
  },
};
