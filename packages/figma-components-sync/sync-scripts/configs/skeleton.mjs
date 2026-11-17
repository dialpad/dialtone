/**
 * DtSkeleton: a placeholder that stands in for content while it loads. It renders exactly ONE of four shapes,
 * chosen by which option prop is set (listItem, shape, paragraph, then text), so `kind` is the axis and the
 * option props are derived from it: text, heading, paragraph, circle, square, list item.
 *
 * `size` applies to the shapes (circle, square, and the list item's shape: 100 to 500) and to the heading's
 * height (200, 300, 400); the text and paragraph have none, so they keep only the default.
 *
 * Static, by decision: the shimmer is an animation (`animate: false`, nothing to draw), and a list item's
 * paragraph is NOT given random widths (`randomWidth: false`), which no measurement could reproduce.
 *
 * The bars are `width: 100%`, so the surface has a width (see verify-harness/container-widths.css); a
 * designer resizes the instance.
 */
export default {
  component: 'DtSkeleton', label: '', page: 'Skeleton', family: 'Identity & status',
  snapTokens: true,
  containerClass: () => 'dt-harness-width-240',
  // The list item's gap is its shape's `margin-inline-end: var(--dt-spacing-100)`, folded into the parent's
  // item spacing, so the audit sees a spacing binding with no declaration on the parent.
  foldedMargins: ['spacing/100'],

  // NO Code Connect template, on purpose. `kind` and `size` both change ONE nested option prop (`shapeOption`,
  // `textOption`, `listItemOption`), and the generator writes each axis's attributes on its own, so a circle of
  // any size would read `size: 100`. Needs a template that combines the two axes; until then Dev Mode shows the
  // plain mapping.

  axes: {
    kind: ['text', 'heading', 'paragraph', 'circle', 'square', 'listItem'],
    size: [100, 200, 300, 400, 500],
  },
  invalid: c => {
    const n = Number(c.size);
    if (c.kind === 'text' || c.kind === 'paragraph') return n !== 300;
    if (c.kind === 'heading') return ![200, 300, 400].includes(n);
    return false;
  },
  variantName: c => `kind=${c.kind}, size=${c.size}`,
  props: c => {
    const size = Number(c.size);
    const base = { ariaLabel: 'Loading', animate: false };
    switch (c.kind) {
      case 'heading': return { ...base, textOption: { type: 'heading', headingHeight: size } };
      case 'paragraph': return { ...base, paragraphOption: { rows: 3, randomWidth: false } };
      case 'circle': return { ...base, shapeOption: { shape: 'circle', size } };
      case 'square': return { ...base, shapeOption: { shape: 'square', size } };
      case 'listItem': return {
        ...base, listItemOption: { shape: 'circle', shapeSize: size, paragraphs: { rows: 3, randomWidth: false } },
      };
      default: return { ...base, textOption: { type: 'body' } };
    }
  },
  slots: () => [],
};
