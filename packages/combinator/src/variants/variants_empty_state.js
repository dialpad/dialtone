

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

  'with icon and actions': {
    props: {
      headerText: { initialValue: 'Nothing to see here' },
      bodyText: { initialValue: 'Looks like there is no data to display here.' },
    },
    slots: {
      body: {
        initialValue: `<dt-stack direction="row" gap="50">
  <dt-button size="200" importance="clear">Action</dt-button>
  <dt-button size="200">Action</dt-button>
</dt-stack>`,
      },
      icon: {
        initialValue: '<dt-icon-box :size="iconSize" />',
      },
    },
  },
};
