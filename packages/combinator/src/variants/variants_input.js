 
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

  disabled: {
    props: {
      label: { initialValue: 'Label' },
      disabled: { initialValue: true },
    },
    attributes: {
      placeholder: { initialValue: 'Placeholder' },
    },
  },

  textarea: {
    props: {
      label: { initialValue: 'Label' },
      type: { initialValue: 'textarea' },
    },
  },

  'with description': {
    props: {
      label: { initialValue: 'Label' },
      description: { initialValue: 'Helpful description text' },
    },
    attributes: {
      placeholder: { initialValue: 'Placeholder' },
    },
  },

  'with error': {
    props: {
      label: { initialValue: 'Label' },
      type: { initialValue: 'email' },
      messages: { initialValue: [{ message: 'Please enter a valid email address.', type: 'error' }] },
    },
  },
};
