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
      show: {
        initialValue: true,
      },
    },
  },
};
