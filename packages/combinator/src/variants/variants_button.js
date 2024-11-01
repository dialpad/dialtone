export default {
  default: {
    slots: {
      default: {
        initialValue: 'Place call',
      },
    },
  },
  primary: {
    slots: {
      default: {
        initialValue: 'Primary',
      },
    },
    props: {
      importance: {
        initialValue: 'primary',
        lockControl: true,
      },
    },
  },
  outlined: {
    slots: {
      default: {
        initialValue: 'Outlined',
      },
    },
    props: {
      importance: {
        initialValue: 'outlined',
        lockControl: true,
      },
    },
  },
  clear: {
    slots: {
      default: {
        initialValue: 'Clear',
      },
    },
    props: {
      importance: {
        initialValue: 'clear',
        lockControl: true,
      },
    },
  },
  danger: {
    slots: {
      default: {
        initialValue: 'Danger',
      },
    },
    props: {
      kind: {
        initialValue: 'danger',
        lockControl: true,
      },
    },
  },
  inverted: {
    slots: {
      default: {
        initialValue: 'Inverted',
      },
    },
    props: {
      kind: {
        initialValue: 'inverted',
        lockControl: true,
      },
    },
  },
  disabled: {
    slots: {
      default: {
        initialValue: 'Disabled',
      },
    },
    attributes: {
      disabled: {
        initialValue: true,
        lockControl: true,
      },
    },
  },
  link: {
    slots: {
      default: {
        initialValue: 'Link',
      },
    },
    props: {
      link: {
        initialValue: true,
        lockControl: true,
      },
    },
  },
  loading: {
    slots: {
      default: {
        initialValue: 'Loading',
      },
    },
    props: {
      loading: {
        initialValue: true,
        lockControl: true,
      },
    },
  },
};
