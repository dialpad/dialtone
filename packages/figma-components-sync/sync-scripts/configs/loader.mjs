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
  figmaSetId: '575:12434',

  axes: {
    // The full ICON_SIZE_MODIFIERS scale, which is what the prop validates against.
    // Every stop is a different rendered size, so none of them is an alias.
    size: [100, 200, 300, 400, 500, 600, 700, 800],
  },

  invalid: () => false,
  props: c => ({ size: c.size }),
  variantName: c => `size=${c.size}`,

  /**
   * THE ARC IS PAINTED WITH A GRADIENT, not swapped for a different asset.
   *
   * `.d-loader__icon`'s real look comes from `mask-image: conic-gradient(...)` (loader.less)
   * cutting a ~65° gap out of an otherwise full ring — this pipeline has no concept of a CSS
   * mask, so importing the raw SVG gives a second, solid, indistinguishable ring on top of
   * the track. An earlier version of this fix swapped the arc for the icon library's
   * hand-authored `time/loading` glyph instead — that fixed the missing fade but introduced a
   * NEW mismatch, because it is a different asset with its own stroke-width-to-diameter
   * ratio: the arc came out visibly thinner than the track underneath it.
   *
   * Painting the arc's OWN measured geometry with a Figma ANGULAR gradient (the direct
   * equivalent of a conic-gradient mask, no masking needed) fixes both at once — the stroke
   * width is identical to the track by construction, since it IS the track ring's own shape,
   * and the gradient reproduces the fade. See `gradientFill` in generic-builder.js for the
   * actual stops (tuned by eye against the real component).
   */
  anatomySwap: () => ({ selector: 'd-loader__icon', gradient: true }),
};
