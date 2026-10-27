/* eslint-disable max-len */

export default {
  defaults: {
    slots: {
      // Inserted when the slot is added in the playground, so it doesn't start empty.
      startAvatar: { starterValue: '<dt-avatar full-name="Jaqueline Nackos" seed="0" />' },
    },
  },

  default: {
    props: {
      interactive: { initialValue: false },
      size: { initialValue: '300', tokenCategory: 'typography-size:label' },
    },
    slots: {
      default: {
        initialValue: 'Chip',
      },
    },
  },

  exclusions: [
    // A remove button only renders on an interactive chip.
    {
      when: { interactive: v => !v },
      disable: { props: ['showClose'] },
      clear: { props: ['showClose'] },
    },
    // `subtle` is text only, so it can't be interactive (Chip falls back to base and warns).
    {
      when: { interactive: true },
      disableValues: { props: { emphasis: ['subtle'] } },
    },
    {
      when: { interactive: true, emphasis: 'subtle' },
      clear: { props: ['emphasis'] },
    },
    {
      when: { emphasis: 'subtle' },
      disable: { props: ['interactive'] },
    },
  ],

  'interactive': {
    props: {
      interactive: { initialValue: true },
      size: { initialValue: '300', tokenCategory: 'typography-size:label' },
    },
    slots: {
      default: { initialValue: 'I can be clicked' },
    },
  },

  'removable': {
    props: {
      interactive: { initialValue: true },
      showClose: { initialValue: true },
    },
    slots: {
      default: { initialValue: 'Remove me' },
    },
  },

  'strong': {
    props: {
      emphasis: { initialValue: 'strong' },
    },
    slots: {
      default: { initialValue: 'Selected' },
    },
  },

  'subtle': {
    props: {
      emphasis: { initialValue: 'subtle' },
    },
    slots: {
      default: { initialValue: 'Subtle' },
    },
  },

  'with end icon': {
    slots: {
      endIcon: { initialValue: '<dt-icon-chevron-down size="200" />' },
      default: { initialValue: 'Chip' },
    },
  },

  'with leading and trailing': {
    slots: {
      leading: { initialValue: '<dt-badge kind="status" variant="info" label="New" :size="100" />' },
      trailing: { initialValue: '<dt-badge kind="counter" variant="count" emphasis="strong" label="4" :size="100" />' },
      default: { initialValue: 'Inbox' },
    },
  },

  'with icon': {
    slots: {
      startIcon: { initialValue: '<dt-icon-box-select size="200" />' },
      default: { initialValue: 'Chip' },
    },
  },

  'with avatar': {
    props: {
      variant: { initialValue: 'people' },
    },
    slots: {
      startAvatar: { initialValue: '<dt-avatar image-src="/assets/images/person.png" image-alt="Jaqueline Nackos" full-name="Jaqueline Nackos" />' },
      default: { initialValue: 'Chip' },
    },
  },
};
