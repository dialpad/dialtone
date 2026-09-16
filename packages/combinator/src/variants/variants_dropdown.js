
export default {
  default: {
    props: {
      navigationType: { initialValue: 'arrow-keys' },
      open: { initialValue: true },
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
</dt-button>
<dt-box block-size="200"><!-- holding space... delete me... --> </dt-box>` },
      list: {
        initialValue: `<dt-list-item role="menuitem" navigation-type="arrow-keys">Menu Item 1</dt-list-item>
<dt-list-item role="menuitem" navigation-type="arrow-keys">Menu Item 2</dt-list-item>
<dt-list-item role="menuitem" navigation-type="arrow-keys">Menu Item 3</dt-list-item>`,
      },
    },
  },

  'with groups': {
    props: {
      navigationType: { initialValue: 'arrow-keys' },
      open: { initialValue: true },
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
</dt-button>
<dt-box block-size="200"><!-- holding space... delete me... --> </dt-box>` },
      list: {
        initialValue: `<dt-list-item-group heading="Menu Heading A">
  <dt-list-item role="menuitem" navigation-type="arrow-keys">Menu Item 1</dt-list-item>
  <dt-list-item role="menuitem" navigation-type="arrow-keys">Menu Item 2</dt-list-item>
</dt-list-item-group>
<dt-dropdown-separator />
<dt-list-item-group heading="Menu Heading B">
  <dt-list-item role="menuitem" navigation-type="arrow-keys">Menu Item 3</dt-list-item>
</dt-list-item-group>`,
      },
    },
  },
};
