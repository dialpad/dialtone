/* eslint-disable max-len */

export default {
  default: {
    props: {
      interactive: { initialValue: false },
      size: { initialValue: '100' },
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
      size: { initialValue: '100' },
    },
    slots: {
      default: { initialValue: 'I can be clicked' },
    },
  },

  'with icon': {
    slots: {
      icon: { initialValue: '<dt-icon-box-select size="200" />' },
      default: { initialValue: 'Chip' },
    },
  },

  'with avatar': {
    slots: {
      avatar: { initialValue: '<dt-avatar image-src="/assets/images/person.png" image-alt="Jaqueline Nackos" full-name="Jaqueline Nackos" />' },
      default: { initialValue: 'Chip' },
    },
  },
};
