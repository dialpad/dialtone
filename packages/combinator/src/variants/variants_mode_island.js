/* eslint-disable max-len */
 
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
      },
    },
    slots: {
      default: {
        initialValue: '<dt-text as="p">Always dark mode</dt-text>',
      },
    },
  },
};
