
export default {
  default: {
    props: {
      progress: {
        initialValue: 66,
      },
      ariaLabel: {
        initialValue: 'Upload progress',
      },
    },
  },

  'critical at 99% progress': {
    props: {
      ariaLabel: { initialValue: 'Upload progress' },
      progress: { initialValue: 99 },
      size: { initialValue: '800' },
      kind: { initialValue: 'critical' },
    },
  },

  positive: {
    props: {
      ariaLabel: { initialValue: 'Upload progress' },
      progress: { initialValue: 81 },
      size: { initialValue: '600' },
      kind: { initialValue: 'positive' },
    },
  },

  ai: {
    props: {
      ariaLabel: { initialValue: 'Upload progress' },
      progress: { initialValue: 38 },
      size: { initialValue: '400' },
      kind: { initialValue: 'ai' },
    },
  },

  'info at 10% progress': {
    props: {
      ariaLabel: { initialValue: 'Upload progress' },
      progress: { initialValue: 10 },
      size: { initialValue: '400' },
      kind: { initialValue: 'info' },
    },
  },

  'warning at 1% progress': {
    props: {
      ariaLabel: { initialValue: 'Upload progress' },
      progress: { initialValue: 1 },
      size: { initialValue: '400' },
      kind: { initialValue: 'warning' },
    },
  },
};
