
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
      endTooltipText: {
        initialValue: 'Remove',
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
      endTooltipText: {
        initialValue: 'Remove',
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
      endTooltipText: {
        initialValue: 'Remove',
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
      endTooltipText: {
        initialValue: 'Remove',
      },
    },
  },
};
