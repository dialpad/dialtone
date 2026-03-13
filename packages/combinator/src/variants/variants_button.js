export default {
  exclusions: [
    {
      when: { link: true },
      hide: {
        props: ['importance', 'kind', 'circle', 'loading', 'active', 'type', 'size'],
      },
    },
    {
      when: { kind: 'unstyled' },
      hide: { props: ['importance'] },
    },
    {
      when: { href: v => !!v },
      hide: { props: ['type'] },
    },
    {
      when: { to: v => !!v },
      hide: { props: ['target', 'rel', 'type'] },
    },
  ],

  default: {
    slots: {
      default: {
        initialValue: 'Place call',
      },
    },
  },

  'start icon': {
    props: {
      importance: {
        initialValue: 'outlined',
      },
    },
    slots: {
      default: {
        initialValue: 'Label',
      },
      startIcon: {
        initialValue: '<dt-icon-phone :size="iconSize" />',
      },
    },
  },

  'end icon': {
    slots: {
      default: {
        initialValue: 'Label',
      },
      endIcon: {
        initialValue: '<dt-icon-arrow-right :size="iconSize" />',
      },
    },
  },

  'small muted': {
    props: {
      importance: {
        initialValue: 'outlined',
      },
      kind: {
        initialValue: 'muted',
      },
      size: {
        initialValue: 'sm',
      },
    },
    slots: {
      default: {
        initialValue: 'Label',
      },
      startIcon: {
        initialValue: '<dt-icon-phone :size="iconSize" />',
      },
      endIcon: {
        initialValue: '<dt-icon-arrow-right :size="iconSize" />',
      },
    },
  },

  'icon only': {
    props: {
      kind: {
        initialValue: 'muted',
      },
      importance: {
        initialValue: 'clear',
      },
    },
    slots: {
      startIcon: {
        initialValue: '<dt-icon-phone :size="iconSize" />',
      },
    },
  },

  'loading': {
    props: {
      loading: {
        initialValue: true,
      },
    },
    slots: {
      default: {
        initialValue: 'Add contact',
      },
    },
  },

  'loading with label, disabled': {
    props: {
      disabled: {
        initialValue: true,
      },
    },
    slots: {
      default: {
        initialValue: 'Add contact',
      },
      endIcon: {
        initialValue: '<dt-loader :size="iconSize" />',
      },
    },
  },

  'render as anchor element': {
    props: {
      href: { initialValue: 'https://dialtone.dialpad.com' },
      target: { initialValue: '_blank' },
      rel: { initialValue: 'noopener noreferrer' },
      kind: { initialValue: 'muted' },
      importance: { initialValue: 'outlined' },
      size: { initialValue: 'sm' },
      iconPosition: { initialValue: 'right' },
    },
    slots: {
      icon: { initialValue: '<dt-icon name="external-link" :size="iconSize" />' },
      default: { initialValue: 'Dialtone' },
    },
  },

  'router link': {
    props: {
      to: { initialValue: '/' },
      kind: { initialValue: 'default' },
      size: { initialValue: 'xs' },
    },
    slots: {
      default: { initialValue: 'Home' },
    },
  },

  'render as warning link text': {
    props: {
      link: { initialValue: true },
      linkKind: { initialValue: 'warning' },
    },
    slots: {
      default: { initialValue: 'Warning link text' },
    },
  },

  'block start icon': {
    props: {
      importance: { initialValue: 'outlined' },
    },
    slots: {
      blockStartIcon: { initialValue: '<dt-icon name="phone" :size="iconSize" />' },
      default: { initialValue: 'Label' },
    },
  },

  'with leading slot': {
    props: {
      kind: { initialValue: 'muted' },
      importance: { initialValue: 'outlined' },
      leadingClass: { initialValue: 'd-pl12' },
    },
    slots: {
      default: { initialValue: 'Caution' },
      leading: { initialValue: '<span class="d-bgc-critical-strong d-bar4 d-w12 d-h12"></span>' },
    },
  },

  'with trailing slot': {
    props: {
      size: {
        initialValue: 'sm',
      },
      kind: {
        initialValue: 'muted',
      },
      importance: {
        initialValue: 'outlined',
      },
      trailingClass: {
        initialValue: 'd-pr2',
      },
    },
    slots: {
      default: {
        initialValue: 'Copy',
      },
      icon: {
        initialValue: '<dt-icon-copy :size="iconSize" />',
      },
      trailing: {
        initialValue: '<dt-keyboard-shortcut shortcut="{cmd}+C" />',
      },
    },
  },
};
