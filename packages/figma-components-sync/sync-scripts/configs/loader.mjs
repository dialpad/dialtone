/**
 * DtLoader.
 *
 * The spinner. Two props only: `size` and `ariaLabel`. `ariaLabel` paints nothing, so `size`
 * is the whole coordinate space.
 *
 * Worth syncing despite being small: DtLoader already appears INSIDE DtButton's loading
 * variants, where it caused B-92 (`.d-loader` is an 18x18 grid holding a track ring and an arc
 * at the same offset, and auto-layout flowed them side by side, so 210 loading Buttons rendered
 * two spinners). Building it standalone puts that anatomy under direct comparison instead of
 * only ever seeing it as somebody else's child.
 *
 * No `state` axis: loader.less declares no :hover, :focus or :active rule. It is not a control.
 */
export default {
  component: 'DtLoader', label: '', page: 'Loader',
  figmaSetId: '286:6150',

  axes: {
    // The full ICON_SIZE_MODIFIERS scale, which is what the prop validates against.
    // Every stop is a different rendered size, so none of them is an alias.
    size: [100, 200, 300, 400, 500, 600, 700, 800],
  },

  invalid: () => false,
  props: c => ({ size: c.size }),
  variantName: c => `size=${c.size}`,
};
