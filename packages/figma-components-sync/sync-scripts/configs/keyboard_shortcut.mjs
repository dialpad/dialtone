/**
 * DtKeyboardShortcut.
 *
 * Axes are the PROP API: `shortcut` and `inverted`. `screenReaderText` is not an
 * axis — it paints nothing, and the harness drops sr-only nodes before they can
 * become Figma nodes.
 *
 * `shortcut` is a STRING, not an array: passing `['cmd','K']` renders nothing at
 * all (measured, via the render probe). The string is parsed by the component
 * into one <kbd> per key, so its VALUE changes the anatomy — which is why a
 * short and a long form are both swept rather than one representative value.
 */
export default {
  component: 'DtKeyboardShortcut', label: '', page: 'KeyboardShortcut',
  figmaSetId: '286:6101',

  axes: {
    // Anatomy axis, not copy: each variant produces a different number of key
    // boxes, and a modifier key renders a glyph where a letter renders text.
    shortcut: ['K', 'cmd+K', 'cmd+shift+K'],
    // Swaps the palette for use on a dark surface.
    inverted: [false, true],
  },

  invalid: () => false,

  props: c => ({ shortcut: c.shortcut, inverted: c.inverted }),

  // '+' is fine in a Figma variant value; only an EMPTY value is unstorable.
  variantName: c => `shortcut=${c.shortcut}, inverted=${c.inverted}`,
};
