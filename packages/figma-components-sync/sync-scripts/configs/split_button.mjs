/**
 * DtSplitButton.
 *
 * A primary action plus a dropdown trigger, sharing one border. Its props validate against
 * DtButton's own constants (`BUTTON_KIND_MODIFIERS`, `BUTTON_IMPORTANCE_MODIFIERS`,
 * `BUTTON_SIZE_MODIFIERS`), so the axes here are Button's and the same exclusion applies.
 *
 * DELIBERATELY NOT AXES, each for a stated reason:
 *
 *   state — split-button has no stylesheet of its own; `button.less` styles both halves. A
 *     hover or focus here belongs to one of the two sub-buttons, and DtButton already sweeps
 *     all five states across 2,240 variants. Sweeping them again would re-measure that
 *     component through a wrapper.
 *   showDivider — pinned at its default `true`. It draws a 1px line between the halves;
 *     sweeping it doubles the set to check one border. Worth an axis only if that line turns
 *     out to differ per kind, which is a measurement nobody has taken.
 *   width — takes an arbitrary CSS length, not a scale.
 *   the per-half props (startDisabled, endDisabled, startLoading, startActive, …) — these
 *     configure the two halves independently, and each is DtButton's own prop surface seen
 *     from outside. `disabled` below disables both, which is the composite behaviour worth
 *     checking; the per-half combinations multiply by 16 to re-check Button.
 *
 * The physical aliases (`alphaActive`, `omegaId`, …) are the deprecated half of
 * logical-naming.md's pairs and are not swept: they resolve to the same rendering as their
 * logical counterparts by construction.
 */
export default {
  component: 'DtSplitButton', label: 'Action', page: 'SplitButton',
  figmaSetId: '286:28537',

  axes: {
    kind: ['default', 'muted', 'critical', 'positive', 'inverted'],
    importance: ['clear', 'outlined', 'primary'],
    size: [100, 200, 300, 400, 500],
    // Disables BOTH halves, which is the composite's own behaviour rather than either
    // sub-button's. The disabled surface is a different paint, not an opacity overlay.
    disabled: [false, true],
  },

  // Same rejection DtButton has: the component refuses muted + primary.
  invalid: c => c.kind === 'muted' && c.importance === 'primary',

  props: c => ({
    kind: c.kind,
    importance: c.importance,
    size: Number(c.size),
    disabled: c.disabled,
  }),

  variantName: c => `kind=${c.kind}, importance=${c.importance}, size=${c.size}, `
    + `disabled=${c.disabled}`,
};
