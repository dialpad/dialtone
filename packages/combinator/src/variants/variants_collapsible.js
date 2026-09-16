/* eslint-disable max-len */
export default {
  default: {
    props: {
      anchorText: {
        initialValue: 'Collapsible label',
      },
    },
    slots: {
      content: {
        initialValue: `<dt-box
  padding="200"
  border-width="200"
  border-color="subtle"
  class="d-bas-dashed"
>
  <dt-text as="p" kind="body" size="100" tone="tertiary" align="center">Content slot</dt-text>
</dt-box>`,
      },
    },
  },

  'with anchor slot': {
    props: {
      open: { initialValue: true },
    },
    slots: {
      anchor: { initialValue: '<dt-button>Click Me!</dt-button>' },
      content: {
        initialValue: `<dt-box
  padding="200"
  border-width="200"
  border-color="subtle"
  class="d-bas-dashed"
>
  <dt-text as="p" kind="body" size="100" tone="tertiary" align="center">This will be shown in the expanded area.</dt-text>
</dt-box>`,
      },
    },
  },
};
