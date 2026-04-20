

export default {
  defaults: {
    props: {
      kind: { tokenCategory: 'color:d-notice--:backgroundColor' },
    },
  },

  default: {
    slots: {
      default: {
        initialValue: 'Message body with <a href="#" class="d-link">a link</a>.',
      },
    },
    props: {
      headerText: {
        initialValue: 'Base title (optional)',
      },
      show: {
        initialValue: true,
      },
    },
  },

  'info with action and hide close': {
    props: {
      headerText: { initialValue: 'Info title' },
      kind: { initialValue: 'info' },
      showClose: { initialValue: false },
      show: { initialValue: true },
    },
    slots: {
      default: { initialValue: 'Message body with <a href="#" class="d-link">a link</a>.' },
      action: { initialValue: '<dt-button :size="200" importance="outlined" kind="muted">Action</dt-button>' },
    },
  },

  'important warning with no message': {
    props: {
      headerText: { initialValue: 'Warning title' },
      kind: { initialValue: 'warning' },
      important: { initialValue: true },
      show: { initialValue: true },
    },
  },
};
