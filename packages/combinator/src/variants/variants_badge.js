 
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

  'label with icon': {
    props: {
      type: { initialValue: 'default' },
      text: { initialValue: 'Label' },
      kind: { initialValue: 'label' },
    },
    slots: {
      startIcon: { initialValue: '<dt-icon-lightning-bolt :size="iconSize" />' },
    },
  },

  ai: {
    props: {
      type: { initialValue: 'ai' },
    },
    slots: {
      default: { initialValue: 'AI Notes' },
    },
  },

  locked: {
    slots: {
      startIcon: { initialValue: '<dt-icon-lock :size="iconSize" />' },
      default: { initialValue: 'Locked' },
    },
  },

  'count bulletin': {
    props: {
      kind: { initialValue: 'count' },
      type: { initialValue: 'bulletin' },
    },
    slots: {
      default: { initialValue: '9' },
    },
  },
};
