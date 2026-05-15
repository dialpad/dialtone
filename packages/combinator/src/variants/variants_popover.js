

export default {
  default: {
    props: {
      open: { initialValue: true },
      placement: { initialValue: 'bottom' },
      modal: { initialValue: false },
    },
    slots: {
      anchor: {
        initialValue: `<dt-button
  importance="clear"
  kind="muted"
>
  Label
  <template #endIcon="{ iconSize }">
    <dt-icon-chevron-down :size="iconSize" />
  </template>
</dt-button>`,
      },
      content: {
        initialValue: '<p>Popover Content</p>',
      },
    },
  },

  'with header': {
    props: {
      open: { initialValue: true },
      placement: { initialValue: 'bottom' },
      modal: { initialValue: false },
    },
    slots: {
      anchor: { initialValue: `<dt-button
  importance="clear"
  kind="muted"
>
  Label
  <template #endIcon="{ iconSize }">
    <dt-icon-chevron-down :size="iconSize" />
  </template>
</dt-button>` },
      headerContent: { initialValue: '<div class="d-w100p">This is the header</div>' },
      content: { initialValue: '<p>Popover Content</p>' },
    },
  },

  'fallback placement': {
    props: {
      open: { initialValue: true },
      placement: { initialValue: 'bottom' },
      modal: { initialValue: false },
      fallbackPlacements: { initialValue: ['top'] },
    },
    slots: {
      anchor: { initialValue: '<dt-button>fallback placement: top</dt-button>' },
      content: { initialValue: '<p>Popover Content</p>' },
    },
  },

  'small padding': {
    props: {
      open: { initialValue: true },
      placement: { initialValue: 'bottom' },
      modal: { initialValue: false },
      padding: { initialValue: 'small' },
    },
    slots: {
      anchor: { initialValue: `<dt-button
  importance="clear"
  kind="muted"
>
  Label
  <template #endIcon="{ iconSize }">
    <dt-icon-chevron-down :size="iconSize" />
  </template>
</dt-button>` },
      content: { initialValue: '<p>Popover Content</p>' },
    },
  },
};
