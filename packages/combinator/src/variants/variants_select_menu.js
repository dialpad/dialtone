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
};
