/**
 * DtModeIsland.
 *
 * A container that pins its subtree to a colour mode regardless of the surrounding document.
 * `mode` is the only prop that paints; `as` changes the element name and nothing else.
 *
 * The interesting one to check is `inverted`, which means "the opposite of whatever is
 * outside" — so its rendering DIFFERS between the light and dark sweeps while `light` and
 * `dark` are pinned. That is exactly the shape B-16 hid in: two values identical in one mode
 * and opposite in the other.
 */
export default {
  component: 'DtModeIsland', label: 'Mode', page: 'ModeIsland',
  figmaSetId: '266:35462',

  axes: {
    mode: ['inverted', 'light', 'dark'],
  },

  invalid: () => false,
  props: c => ({ mode: c.mode }),
  variantName: c => `mode=${c.mode}`,
};
