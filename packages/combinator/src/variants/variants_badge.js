export default {
  exclusions: [
    {
      when: { kind: 'count' },
      hide: { props: ['decoration'] },
    },
    {
      when: { type: v => v !== 'default' },
      hide: { props: ['decoration'] },
    },
    {
      when: { type: v => v !== 'bulletin' },
      hide: { props: ['subtle'] },
    },
    {
      when: { decoration: v => !!v },
      hide: { slots: ['startIcon', 'endIcon'] },
    },
  ],

  default: {
    slots: {
      default: {
        initialValue: 'Badge',
      },
    },
  },
};
