/* eslint-disable max-len */
export default {
  default: {
    slots: {
      default: {
        initialValue: 'Chip',
      },
    },
  },

  'non-interactive': {
    props: {
      interactive: { initialValue: false },
      size: { initialValue: 'xs' },
    },
    slots: {
      default: { initialValue: 'chip' },
    },
  },

  'with icon': {
    slots: {
      icon: { initialValue: '<dt-icon-phone size="200" />' },
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
