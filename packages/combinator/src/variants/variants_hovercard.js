
export default {
  default: {
    props: {
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
