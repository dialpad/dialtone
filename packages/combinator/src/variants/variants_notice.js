/* eslint-disable max-len */
export default {
  default: {
    slots: {
      default: {
        initialValue: 'Message body with <dt-link to="/path/to/">a link</dt-link>.',
      },
    },
    props: {
      title: {
        initialValue: 'Base title (optional)',
      },
    },
  },

  'info with action': {
    props: {
      title: { initialValue: 'Info title (optional)' },
      kind: { initialValue: 'info' },
    },
    slots: {
      default: { initialValue: 'Message body with <dt-link to="/path/to/">a link</dt-link>.' },
      action: { initialValue: '<dt-button size="sm" importance="outlined" kind="muted">Action</dt-button>' },
    },
  },

  'important warning': {
    props: {
      title: { initialValue: 'Warning title (optional)' },
      kind: { initialValue: 'warning' },
      important: { initialValue: true },
    },
    slots: {
      default: { initialValue: 'Message body with <dt-link v-dt-mode:invert to="/path/to/">a link</dt-link>.' },
      action: { initialValue: '<dt-button size="sm" importance="outlined" kind="inverted">Action</dt-button>' },
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
