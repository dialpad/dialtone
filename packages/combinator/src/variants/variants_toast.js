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
      closeButtonProps: {
        initialValue: {
          ariaLabel: 'close',
        },
      },
      show: {
        initialValue: true,
      },
    },
  },
};
