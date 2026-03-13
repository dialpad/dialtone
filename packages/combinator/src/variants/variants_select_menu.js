 
export default {
  exclusions: [
    {
      when: { labelVisible: false },
      hide: { props: ['labelClass', 'labelSize', 'labelStrength', 'labelChildProps'] },
    },
  ],

  default: {
    props: {
      label: {
        initialValue: 'Label',
      },
      options: {
        initialValue: [
          { value: 1, label: 'Option 1' },
          { value: 2, label: 'Option 2' },
          { value: 3, label: 'Option 3' },
        ],
      },
    },
    attributes: {
      value: {
        initialValue: '1',
      },
    },
  },

  'with description': {
    props: {
      label: { initialValue: 'Label' },
      description: { initialValue: 'Optional description text' },
      options: {
        initialValue: [
          { value: 1, label: 'Option 1' },
          { value: 2, label: 'Option 2' },
          { value: 3, label: 'Option 3' },
        ],
      },
    },
  },

  'success validation': {
    props: {
      label: { initialValue: 'Label' },
      options: {
        initialValue: [
          { value: 1, label: 'Option 1' },
          { value: 2, label: 'Option 2' },
          { value: 3, label: 'Option 3' },
        ],
      },
      messages: { initialValue: [{ message: 'Success validation message', type: 'success' }] },
    },
  },

  'small label': {
    props: {
      label: { initialValue: 'Label' },
      labelSize: { initialValue: 'sm' },
      labelStrength: { initialValue: 'normal' },
      options: {
        initialValue: [
          { value: 1, label: 'Option 1' },
          { value: 2, label: 'Option 2' },
          { value: 3, label: 'Option 3' },
        ],
      },
    },
  },
};
