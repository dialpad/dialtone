/**
 * DtButton as the circular, icon-only button: its own Figma set, `DtButtonIcon`.
 *
 * `circle` is documented "use only with icon-only buttons", so it has no label and exactly one
 * icon, in the `startIcon` slot as the docs write it. It used to be a `circle` axis on Button,
 * where every circle variant still rendered the "Button" label (a shape the component does not
 * document), and where it doubled the set past Figma's 1,000-variant performance warning. Its
 * own set has no label, no start/end icon toggles (the icon is always there), and an icon swap
 * to choose the glyph. In code it is still one component, DtButton with `circle`.
 */
export default {
  component: 'DtButton', label: '', page: 'ButtonIcon',
  figmaSetId: '589:38882',
  axes: {
    kind: ['default', 'muted', 'critical', 'positive', 'inverted'],
    importance: ['clear', 'outlined', 'primary'],
    size: [100, 200, 300, 400, 500],
    // Figma variant value is 'focus'; the CSS pseudo-class is ':focus-visible'
    state: ['default', 'hover', 'active', 'focus', 'disabled'],
    loading: [false, true],
  },
  // The component's own rejections for a circle (ButtonConstants.js `INVALID_COMBINATION`), plus
  // muted/primary for both shapes, and hover/active while loading (pointer-events: none).
  invalid: c => (c.kind === 'muted' && c.importance === 'primary')
    || (c.loading === true && ['hover', 'active'].includes(c.state))
    || (c.kind === 'default' && c.importance === 'primary')
    || (c.kind === 'critical' && c.importance === 'outlined'),
  variantName: c => `kind=${c.kind}, importance=${c.importance}, size=${c.size}, state=${c.state}, `
    + `loading=${c.loading}`,
  props: c => ({
    kind: c.kind, importance: c.importance, size: Number(c.size), circle: true,
    ...(c.state === 'active' ? { active: true } : {}),
    ...(c.state === 'disabled' ? { disabled: true } : {}),
    ...(c.loading ? { loading: true } : {}),
  }),
  // The one icon, always present: an icon-only button with no icon is not a button.
  slots: () => ['startIcon'],
  // While loading `.d-loader` is an instance of DtLoader, as in DtButton (see component-axes.mjs).
  anatomySwap: c => ({
    selector: 'd-loader',
    component: 'loader',
    variant: { size: { 100: 200, 200: 200, 300: 300, 400: 400, 500: 500 }[c.size] },
  }),
  pseudo: c => (c.state === 'hover' ? ['hover'] : c.state === 'focus' ? ['focus-visible'] : []),
};
