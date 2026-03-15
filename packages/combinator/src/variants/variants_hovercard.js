
export default {
  default: {
    props: {
      open: {
        initialValue: true,
      },
      placement: {
        initialValue: 'bottom',
      },
    },
    slots: {
      anchor: {
        initialValue: '<dt-button importance="outlined" kind="muted">Hover over me</dt-button>',
      },
      content: {
        initialValue: 'Hovercard content',
      },
    },
  },
};
