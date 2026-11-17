/**
 * DtToggle: a switch. Axes are the prop API.
 *
 * `modelValue` is TRI-state: `mixed` drives `d-toggle--indeterminate` and switches the role to checkbox, and the
 * Figma value is named `mixed`, as in the code. While mixed the inner icon is hidden, so `showIcon` has no effect
 * there and only one of its two values is kept.
 *
 * `size` is 200 or 300 (the `sm` and `md` aliases are deprecated). There is no hover rule in toggle.less: only
 * :focus-visible and disabled, so `state` is default or focus, and a disabled toggle cannot be focused.
 *
 * The label is the default slot (a TEXT property). `showLabel` and `showIcon` gate real child elements, kept as
 * axes so both are swept (B-11).
 *
 * The thumb's glyph is a data-URI SVG whose colour changes with the mode and is baked from the light render; the
 * verifier does not compare the colour of a background-image glyph, so check the dark mode by eye in Figma.
 */
export default {
  component: 'DtToggle', label: 'Toggle', page: 'Toggle', family: 'Selection controls',
  snapTokens: true,
  // The label's block holds only text: it hugs the text, so a longer label widens the toggle instead of being
  // clipped at the width the harness measured.
  flexLayout: true,
  // The track's radius is its own width (`border-radius: var(--toggle-size-width)`, 36 or 48), far past half its
  // height: a pill whatever the number. It is no radius token, so it is left exact rather than moved to the
  // nearest one (32), which the builder and the checks did not agree on.
  noSnap: ['topLeftRadius', 'topRightRadius', 'bottomRightRadius', 'bottomLeftRadius'],

  // How the set reads in Dev Mode (see code-connect.mjs).
  codeConnect: {
    source: 'packages/dialtone-vue/components/Toggle/Toggle.vue',
  },

  axes: {
    modelValue: [false, true, 'mixed'],
    size: [200, 300],
    disabled: [false, true],
    showIcon: [true, false],
    showLabel: [true, false],
    state: ['default', 'focus'],
  },
  invalid: c => (c.disabled === true && c.state === 'focus')
    // `mixed` hides the icon, so the icon switch changes nothing there.
    || (c.modelValue === 'mixed' && c.showIcon === false),
  variantName: c => `modelValue=${c.modelValue}, size=${c.size}, disabled=${c.disabled}, `
    + `showIcon=${c.showIcon}, showLabel=${c.showLabel}, state=${c.state}`,
  props: c => ({
    modelValue: c.modelValue, size: Number(c.size), disabled: c.disabled, showIcon: c.showIcon, showLabel: c.showLabel,
  }),
  pseudo: c => (c.state === 'focus' ? ['focus-visible'] : []),
  // The focusable element is the inner <button class="d-toggle">, not the wrapper: its focus ring is the
  // button's `::after`.
  stateTarget: '.d-toggle',
  // `.d-toggle-wrapper` is display:flex with NO gap of its own, and every Dialtone example passes a spacing
  // class, so the library depicts that rather than a render nobody ships.
  rootClass: 'd-g-200',
};
