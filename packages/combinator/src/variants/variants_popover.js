
export default {
  default: {
    props: {
      open: {
        initialValue: true,
      },
    },
    slots: {
      anchor: {
        initialValue: '<dt-button>View Popover</dt-button>',
      },
      content: {
        initialValue: '<p>This is content rendered within the popover.</p>',
      },
    },
  },

  'with header': {
    props: {
      open: { initialValue: true },
    },
    slots: {
      anchor: { initialValue: '<dt-button>View Popover</dt-button>' },
      headerContent: { initialValue: '<div class="d-w100p">This is the header</div>' },
      content: { initialValue: '<p>This is content rendered within the popover.</p>' },
    },
  },

  'fallback placement': {
    props: {
      open: { initialValue: true },
      fallbackPlacements: { initialValue: ['top'] },
    },
    slots: {
      anchor: { initialValue: '<dt-button>fallback placement: top</dt-button>' },
      content: { initialValue: '<p>This is content rendered within the popover.</p>' },
    },
  },

  'small padding': {
    props: {
      open: { initialValue: true },
      padding: { initialValue: 'small' },
    },
    slots: {
      anchor: { initialValue: '<dt-button>View Popover</dt-button>' },
      content: { initialValue: '<p>This is content rendered within the popover.</p>' },
    },
  },
};
