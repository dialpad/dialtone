
export default {
  default: {
    props: {
      label: {
        initialValue: 'Radio label',
      },
    },
  },

  'hidden label': {
    props: {
      label: { initialValue: 'Radio label' },
      labelVisible: { initialValue: false },
    },
  },

  'with warning validation message': {
    props: {
      name: { initialValue: 'warning-radio' },
      value: { initialValue: 'voicemail' },
      label: { initialValue: 'To voicemail' },
      validationState: { initialValue: 'warning' },
      messages: { initialValue: [{ message: 'So they can hear your voice', type: 'warning' }] },
    },
  },

  'with description': {
    props: {
      name: { initialValue: 'description-radio' },
      value: { initialValue: 'Value' },
      label: { initialValue: 'With description' },
    },
    slots: {
      description: { initialValue: 'Slotted Description' },
    },
  },

  'with custom label size and strength': {
    props: {
      label: { initialValue: 'Radio label' },
      labelSize: { initialValue: 'xs' },
      labelStrength: { initialValue: 'bold' },
    },
  },
};
