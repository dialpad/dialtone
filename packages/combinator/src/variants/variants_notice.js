 
 
export default {
  defaults: {
    props: {
      kind: { tokenCategory: 'color:d-notice--:backgroundColor' },
    },
  },

  default: {
    slots: {
      default: {
        initialValue: 'Message body with <dt-link to="/path/to/">a link</dt-link>.',
      },
    },
    props: {
      title: {
        initialValue: 'Base title',
      },
    },
  },

  'info with action and hide close': {
    props: {
      title: { initialValue: 'Info title' },
      kind: { initialValue: 'info' },
      hideClose: { initialValue: true },
    },
    slots: {
      default: { initialValue: 'Message body with <dt-link to="/path/to/">a link</dt-link>.' },
      action: { initialValue: '<dt-button :size="200" importance="outlined" kind="muted">Action</dt-button>' },
    },
  },

  'important warning with no message': {
    props: {
      title: { initialValue: 'Warning title' },
      kind: { initialValue: 'warning' },
      important: { initialValue: true },
    },
  },
};
