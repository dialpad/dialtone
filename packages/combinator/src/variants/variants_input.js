export default {
  exclusions: [
    {
      when: { labelVisible: false },
      hide: { props: ['labelClass', 'labelSize', 'labelStrength'] },
    },
  ],

  default: {
    props: {
      label: {
        initialValue: 'Label',
      },
    },
    attributes: {
      placeholder: {
        initialValue: 'Placeholder',
      },
    },
  },

  'with icon': {
    props: {
      label: {
        initialValue: 'Start icon',
      },
      type: {
        initialValue: 'text',
      },
    },
    attributes: {
      placeholder: {
        initialValue: 'Placeholder',
      },
    },
    slots: {
      startIcon: {
        initialValue: '<dt-icon-send :size="iconSize" />',
      },
    },
  },

  'bold label': {
    props: {
      label: {
        initialValue: 'Label',
      },
      labelStrength: {
        initialValue: 'bold',
      },
    },
    attributes: {
      placeholder: {
        initialValue: 'Placeholder',
      },
    },
  },
};
