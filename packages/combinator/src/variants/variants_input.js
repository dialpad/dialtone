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
};
