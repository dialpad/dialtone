 
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

  loading: {
    slots: {
      default: {
        initialValue: 'Validating',
      },
      endIcon: {
        initialValue: '<dt-loader :size="iconSize" />',
      },
    },
  },

  'with trailing': {
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
