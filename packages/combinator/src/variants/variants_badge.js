import { hasNoValue, hasValue } from '@/src/lib/exclusion_rules';

export default {
  defaults: {
    props: {
      size: { initialValue: '200', tokenCategory: 'typography-size:label' },
      kind: { initialValue: 'status' },
      variant: { initialValue: 'neutral', tokenCategory: 'color:d-badge--:backgroundColor' },
      decoration: { tokenCategory: 'color:d-badge--decorate-:--badge-decorative-color' },
    },
  },

  exclusions: [
    ...Object.entries({
      // Each kind (group) owns its variants; offer only the ones that belong to the selected kind
      // and drop a selected variant that doesn't belong to it.
      status: ['neutral', 'info', 'positive', 'warning', 'critical'],
      counter: ['count', 'mention'],
      release: ['pre-release', 'release'],
      lifecycle: ['draft', 'edited', 'unsaved', 'saved', 'published', 'archived', 'scheduled'],
    }).flatMap(([kind, own], _, groups) => {
      const others = groups.flatMap(([, variants]) => variants).filter(v => !own.includes(v));
      return [
        { when: { kind }, disableValues: { props: { variant: others } } },
        { when: { kind, variant: v => hasValue(v) && !own.includes(v) }, clear: { props: ['variant'] } },
      ];
    }),
    {
      when: { variant: 'count' },
      hide: { props: ['decoration'] },
    },
    {
      when: { variant: v => v !== 'neutral' },
      hide: { props: ['decoration'] },
    },
    {
      // `subtle` (outline) is a release emphasis; the other groups support base and strong.
      when: { variant: v => !['pre-release', 'release'].includes(v) },
      disableValues: { props: { emphasis: ['subtle'] } },
    },
    {
      when: { decoration: v => !!v },
      hide: { slots: ['startIcon', 'endIcon', 'leading', 'trailing'] },
    },
    {
      whenSlots: { startIcon: hasNoValue, endIcon: hasNoValue },
      disable: { props: ['iconSize'] },
    },
    {
      whenSlots: { startIcon: hasNoValue },
      disable: { props: ['startIconClass'] },
    },
    {
      whenSlots: { endIcon: hasNoValue },
      disable: { props: ['endIconClass'] },
    },
    {
      whenSlots: { leading: hasNoValue },
      disable: { props: ['leadingClass'] },
    },
    {
      whenSlots: { trailing: hasNoValue },
      disable: { props: ['trailingClass'] },
    },
    {
      whenSlots: { default: hasValue },
      disable: { props: ['label'] },
      clear: { props: ['label'] },
    },
    {
      when: { label: hasValue },
      whenSlots: { default: hasNoValue },
      disable: { slots: ['default'] },
      clear: { slots: ['default'] },
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
      kind: { initialValue: 'status' },
      variant: { initialValue: 'neutral' },
      label: { initialValue: 'Label' },
    },
    slots: {
      startIcon: { initialValue: '<dt-icon-lightning-bolt size="200" />' },
    },
  },

  new: {
    props: {
      kind: { initialValue: 'release' },
      variant: { initialValue: 'pre-release' },
    },
    slots: {
      default: { initialValue: 'New' },
    },
  },

  locked: {
    slots: {
      startIcon: { initialValue: '<dt-icon-lock size="200" />' },
      default: { initialValue: 'Locked' },
    },
  },

  recording: {
    props: {
      kind: { initialValue: 'status' },
      variant: { initialValue: 'critical' },
    },
    slots: {
      startIcon: { initialValue: '<dt-icon-record-filled size="200" />' },
      default: { initialValue: 'Recording' },
    },
  },

  count: {
    props: {
      kind: { initialValue: 'counter' },
      variant: { initialValue: 'count' },
    },
    slots: {
      default: { initialValue: '9' },
    },
  },

  mention: {
    props: {
      kind: { initialValue: 'counter' },
      variant: { initialValue: 'mention' },
    },
    slots: {
      default: { initialValue: '2' },
    },
  },

  alpha: {
    props: {
      kind: { initialValue: 'release' },
      variant: { initialValue: 'pre-release' },
      emphasis: { initialValue: 'subtle' },
    },
    slots: {
      default: { initialValue: 'Alpha' },
    },
  },

  draft: {
    props: {
      kind: { initialValue: 'lifecycle' },
      variant: { initialValue: 'draft' },
    },
    slots: {
      default: { initialValue: 'Draft' },
    },
  },
};
