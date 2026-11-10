
export default {
  defaults: {
    slots: {
      anchor: { scopeName: 'anchorAttrs' },
    },
  },
  default: {
    props: {
      navigationType: { initialValue: 'arrow-keys' },
      open: { initialValue: true },
      modal: { initialValue: false },
    },
    slots: {
      anchor: { initialValue: `<dt-button
  :aria-expanded="anchorAttrs['aria-expanded']"
  :aria-controls="anchorAttrs['aria-controls']"
  :aria-haspopup="anchorAttrs['aria-haspopup']"
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
  :aria-expanded="anchorAttrs['aria-expanded']"
  :aria-controls="anchorAttrs['aria-controls']"
  :aria-haspopup="anchorAttrs['aria-haspopup']"
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

  'persistent choices': {
    props: {
      navigationType: { initialValue: 'arrow-keys' },
      open: { initialValue: true },
      modal: { initialValue: false },
      appendTo: { initialValue: 'root' },
    },
    slots: {
      anchor: { initialValue: `<dt-button
  :aria-expanded="anchorAttrs['aria-expanded']"
  :aria-controls="anchorAttrs['aria-controls']"
  :aria-haspopup="anchorAttrs['aria-haspopup']"
  importance="clear"
  kind="muted"
>
  Sort order
  <template #endIcon="{ iconSize }">
    <dt-icon-chevron-down :size="iconSize" />
  </template>
</dt-button>
<dt-box block-size="200"><!-- holding space... delete me... --> </dt-box>` },
      list: {
        initialValue: `<!-- Requires a Dialtone release with menuitemradio support; 10.5.1 does not support it.
Bind selected to application state and update that state on click. -->
<dt-list-item-group heading="Sort order">
  <dt-list-item role="menuitemradio" navigation-type="arrow-keys" selected>Newest first</dt-list-item>
  <dt-list-item role="menuitemradio" navigation-type="arrow-keys" :selected="false">Oldest first</dt-list-item>
</dt-list-item-group>
<dt-dropdown-separator />
<dt-list-item role="menuitem" navigation-type="arrow-keys">Refresh</dt-list-item>`,
      },
    },
  },
};
