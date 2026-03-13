export default {
  default: {
    slots: {
      default: {
        initialValue: 'The quick brown fox',
      },
    },
    props: {
      kind: {
        initialValue: 'body',
      },
    },
  },
  headline: {
    slots: {
      default: {
        initialValue: 'Extra large headline',
      },
    },
    props: {
      kind: {
        initialValue: 'headline',
      },
      size: {
        initialValue: 'xl',
      },
      as: {
        initialValue: 'h2',
      },
    },
  },
  body: {
    slots: {
      default: {
        initialValue: 'Medium body',
      },
    },
    props: {
      kind: {
        initialValue: 'body',
      },
      size: {
        initialValue: 'md',
      },
      as: {
        initialValue: 'p',
      },
    },
  },
  label: {
    slots: {
      default: {
        initialValue: 'Small label',
      },
    },
    props: {
      kind: {
        initialValue: 'label',
      },
      size: {
        initialValue: 'sm',
      },
    },
  },
  code: {
    slots: {
      default: {
        initialValue: 'Extra small code',
      },
    },
    props: {
      kind: {
        initialValue: 'code',
      },
      size: {
        initialValue: 'xs',
      },
    },
  },
};
