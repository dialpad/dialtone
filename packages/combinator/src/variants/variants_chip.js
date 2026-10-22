/* eslint-disable max-len */

export default {
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

  'interactive': {
    props: {
      interactive: { initialValue: true },
      size: { initialValue: '300', tokenCategory: 'typography-size:label' },
    },
    slots: {
      default: { initialValue: 'I can be clicked' },
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
