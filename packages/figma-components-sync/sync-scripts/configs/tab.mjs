/**
 * DtTab: one tab of a DtTabGroup, as its own set so the group can hold any number of instances of it
 * (the way DtSegmentedControl holds its items).
 *
 * A tab is a DtButton, and what makes it a tab comes from the group it sits in: its SIZE, its KIND and
 * whether it is SELECTED are read from an injected `groupContext` (a plain object, injected by string),
 * so the context is provided here (`__provide`, see the harness) for each variant.
 *
 * Kind default: the selected tab is a default, clear button with an underline (`.d-tab--is-selected::after`)
 * hanging below its box, and the others are muted. Kind muted: no underline, the selected tab is `active`.
 * The group's `outlined` and `orientation` change a tab further (the selected tab is outlined and the others
 * default; a vertical tab is full width and its underline is at the end side), so both are axes of this set.
 */
export default {
  component: 'DtTab', label: 'Tab', page: 'Tab', family: 'Navigation',
  snapTokens: true,
  // Its icons are boolean properties and its edge slots are native slots, as on DtButton: it renders a
  // DtButton and takes the same `startIcon`, `endIcon`, `leading` and `trailing` slots.
  merged: true,
  // A vertical tab is `inline-size: 100%`: it fills its list, and alone it hugs its label.
  percentIsFill: true,
  slotPass: ['startIcon', 'endIcon'],
  edgeSlots: { gap: 2 },
  slotSpacingDrift: { paddingLeft: 2, paddingRight: 2, itemSpacing: 2 },

  // How the set reads in Dev Mode (see code-connect.mjs). Figma has no property for the tab's `id` and
  // `panelId`, so both are made from the label; the tab hands `{ panelId, selected }` to the group's
  // template, which writes the selected one as `selected`. `kind`, `outlined` and `orientation` are the group's, not the tab's.
  codeConnect: {
    source: 'packages/dialtone-vue/components/Tab/Tab.vue',
    derive: [{ name: 'tabId', attr: 'id', from: 'Label' }, { name: 'panelId', attr: 'panel-id', from: 'Label' }],
    expose: [{ name: 'panelId' }, { name: 'selected', axis: 'Selected', is: true }],
    skipProps: ['kind', 'outlined', 'orientation'],
    icons: [
      { vue: 'startIcon', swap: 'Start Icon Choice', toggle: 'Start Icon' },
      { vue: 'endIcon', swap: 'End Icon Choice', toggle: 'End Icon' },
    ],
    slots: [
      { figma: 'Leading (Slot)', vue: 'leading', when: 'content' },
      { figma: 'Trailing (Slot)', vue: 'trailing', when: 'content' },
    ],
  },
  axes: {
    size: [100, 200, 300, 400, 500],
    selected: [false, true],
    kind: ['default', 'muted'],
    outlined: [false, true],
    orientation: ['horizontal', 'vertical'],
    // Figma variant value is 'focus'; the CSS pseudo-class is ':focus-visible'
    state: ['default', 'hover', 'focus', 'disabled'],
  },
  variantName: c => `size=${c.size}, selected=${c.selected}, kind=${c.kind}, outlined=${c.outlined}, `
    + `orientation=${c.orientation}, state=${c.state}`,
  // The underline is placed with a variable the group defines (--tablist-padding-bottom, see
  // verify-harness/tab-list.css), and takes its colour from the tab list's.
  containerClass: c => `d-tablist dt-harness-tab d-tablist--${{ 100: 'xs', 200: 'sm', 300: 'md', 400: 'lg', 500: 'xl' }[c.size]}`
    + (c.orientation === 'vertical' ? ' d-tablist--vertical' : ''),
  props: c => ({
    id: 'a',
    panelId: 'a',
    ...(c.state === 'disabled' ? { disabled: true } : {}),
    // The group's side of the conversation: what the tab injects.
    __provide: {
      groupContext: {
        selected: c.selected ? 'a' : '', disabled: false, size: Number(c.size), kind: c.kind,
        outlined: c.outlined, orientation: c.orientation, spread: 'none', focusedTabId: null,
      },
      setFocus: '$noop',
    },
  }),
  slots: () => [],
  pseudo: c => (c.state === 'hover' ? ['hover'] : c.state === 'focus' ? ['focus-visible'] : []),
};
