export default {
  defaults: {
    props: {
      kind: { tokenCategory: 'color:d-notice--:backgroundColor' },
    },
  },

  default: {
    slots: {
      default: {
        initialValue: 'Message body with <dt-link href="#">a link</dt-link>.',
      },
    },
    props: {
      headerText: {
        initialValue: 'Base title (optional)',
      },
      open: {
        initialValue: true,
      },
    },
  },

  'info with action and hide close': {
    props: {
      headerText: { initialValue: 'Info title' },
      kind: { initialValue: 'info' },
      showClose: { initialValue: false },
      open: { initialValue: true },
    },
    slots: {
      default: { initialValue: 'Message body with <dt-link href="#">a link</dt-link>.' },
      action: { initialValue: '<dt-button :size="200" importance="outlined" kind="muted">Action</dt-button>' },
    },
  },

  'important warning with no message': {
    props: {
      headerText: { initialValue: 'Warning title' },
      kind: { initialValue: 'warning' },
      important: { initialValue: true },
      open: { initialValue: true },
    },
  },
};
