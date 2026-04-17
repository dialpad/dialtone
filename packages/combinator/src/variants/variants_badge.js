 

export default {
  defaults: {
    props: {
      iconSize: { tokenCategory: 'icon-size' },
      type: { tokenCategory: 'color:d-badge--:backgroundColor' },
      decoration: { tokenCategory: 'color:d-badge--decorate-:--badge-decorative-color' },
    },
  },

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
    {
      when: { kind: 'count' },
      disableValues: { props: { type: ['ai'] } },
    },
    {
      when: { type: 'ai' },
      disableValues: { props: { kind: ['count'] } },
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
    props: {
      iconSize: { initialValue: '100' },
    },
    slots: {
      startIcon: { initialValue: '<dt-icon-lock :size="iconSize" />' },
      default: { initialValue: 'Locked' },
    },
  },

  recording: {
    props: {
      iconSize: { initialValue: '100' },
      type: { initialValue: 'critical' },
    },
    slots: {
      startIcon: { initialValue: '<dt-icon-record-filled :size="iconSize" />' },
      default: { initialValue: 'Recording' },
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
