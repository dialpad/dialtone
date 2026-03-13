/* eslint-disable max-len */
export default {
  default: {
    slots: {
      default: {
        initialValue: 'Message body with <a href="#" class="d-link">a link</a>.',
      },
    },
    props: {
      title: {
        initialValue: 'Base title (optional)',
      },
    },
  },

  truncated: {
    props: {
      truncateText: {
        initialValue: true,
      },
      title: {
        initialValue: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      },
    },
    slots: {
      default: {
        initialValue: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      },
    },
  },
};
