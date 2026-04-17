 
 
export default {
  defaults: {
    props: {
      tone: { tokenCategory: 'color:d-link--:color' },
    },
  },

  default: {
    slots: {
      default: {
        initialValue: 'Base link',
      },
    },
    props: {
      href: {
        initialValue: '#',
      },
    },
  },

  danger: {
    props: {
      href: { initialValue: '#link' },
      kind: { initialValue: 'danger' },
    },
    slots: {
      default: { initialValue: 'Danger link' },
    },
  },

  mention: {
    props: {
      href: { initialValue: '#link' },
      kind: { initialValue: 'mention' },
    },
    slots: {
      default: { initialValue: 'Mention link' },
    },
  },

  'no underline': {
    props: {
      href: { initialValue: '#link' },
      underline: { initialValue: false },
    },
    slots: {
      default: { initialValue: 'No underline link' },
    },
  },

  external: {
    props: {
      href: { initialValue: 'https://github.com/dialpad/dialtone' },
      target: { initialValue: '_blank' },
      rel: { initialValue: 'noopener noreferrer' },
    },
    slots: {
      default: { initialValue: 'GitHub' },
    },
  },

  'router link': {
    props: {
      to: { initialValue: '/components/button' },
    },
    slots: {
      default: { initialValue: 'Button docs' },
    },
  },
};
