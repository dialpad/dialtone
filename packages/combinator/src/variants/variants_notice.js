 


export default {
  defaults: {
    props: {
      kind: { tokenCategory: 'color:d-notice--:backgroundColor' },
    },
    slots: {
      action: { initialValue: '<dt-button :size="200" importance="outlined" kind="muted">Action</dt-button>' },
    },
  },

  default: {
    slots: {
      default: {
        initialValue: 'Message body with <dt-link to="/path/to/">a link</dt-link>.',
      },
    },
    props: {
      headerText: {
        initialValue: 'Base title',
      },
    },
  },

  'info with action and hide close': {
    props: {
      headerText: { initialValue: 'Info title' },
      kind: { initialValue: 'info' },
      showClose: { initialValue: false },
    },
    slots: {
      default: { initialValue: 'Message body with <dt-link to="/path/to/">a link</dt-link>.' },
      action: { initialValue: '<dt-button :size="200" importance="outlined" kind="muted">Action</dt-button>' },
    },
  },

  'important warning with no message': {
    props: {
      headerText: { initialValue: 'Warning title' },
      kind: { initialValue: 'warning' },
      important: { initialValue: true },
    },
  },
};
