
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
  'Extra large headline': {
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
  'Medium body': {
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
  'Small label': {
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
  'Extra small code': {
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
