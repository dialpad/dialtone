export default {
  default: {
    slots: {
      default: {
        initialValue: '<dt-text as="p">Inverted mode (opposite of parent)</dt-text>',
      },
    },
  },
  light: {
    props: {
      mode: {
        initialValue: 'light',
        lockControl: true,
      },
    },
    slots: {
      default: {
        initialValue: '<dt-text as="p">Always light mode</dt-text>',
      },
    },
  },
  dark: {
    props: {
      mode: {
        initialValue: 'dark',
        lockControl: true,
      },
    },
    slots: {
      default: {
        initialValue: '<dt-text as="p">Always dark mode</dt-text>',
      },
    },
  },
};
