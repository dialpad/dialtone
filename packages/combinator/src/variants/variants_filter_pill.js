
export default {
  default: {
    props: {
      label: {
        initialValue: 'Active example',
      },
      modelValue: {
        initialValue: [
          { name: 'Option 1' },
          { name: 'Option 2' },
          { name: 'Option 3', active: true },
        ],
      },
    },
  },

  'no selection': {
    props: {
      label: {
        initialValue: 'Simple example',
      },
      modelValue: {
        initialValue: [
          { name: 'Option 1' },
          { name: 'Option 2' },
          { name: 'Option 3' },
        ],
      },
    },
  },

  'non clearable': {
    props: {
      label: {
        initialValue: 'Non Clearable example',
      },
      modelValue: {
        initialValue: [
          { name: 'Option 1', active: true },
          { name: 'Option 2' },
          { name: 'Option 3' },
        ],
      },
      hideClear: {
        initialValue: true,
      },
    },
  },

  disabled: {
    props: {
      label: {
        initialValue: 'Disabled filter',
      },
      modelValue: {
        initialValue: [
          { name: 'Option 1' },
          { name: 'Option 2' },
          { name: 'Option 3' },
        ],
      },
      disabled: {
        initialValue: true,
      },
    },
  },

  'content mode invert': {
    props: {
      label: {
        initialValue: 'Inverted',
      },
      modelValue: {
        initialValue: [
          { name: 'Orange', active: true },
          { name: 'Apple' },
        ],
      },
      contentMode: {
        initialValue: 'invert',
      },
    },
  },
};
