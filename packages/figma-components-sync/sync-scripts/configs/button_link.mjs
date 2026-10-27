/**
 * DtButton in LINK mode, as its own set.
 *
 * `buttonClasses()` returns early when `link` is true: `d-link`, `linkKind` and
 * `linkUnderline` classes entirely REPLACE `d-btn`, `kind`, `importance` and `circle`, which
 * are never read at all. That makes it a separate branch of the component rather than
 * another crossed axis, and it lived inside Button's config, collapsing kind, importance and
 * circle to one representative value to avoid measuring the same render dozens of times. As
 * its own set it carries only the axes that mean something, and Button loses 560 variants
 * of a different component.
 *
 * Not DtLink: that is a separate Vue component with `tone`, `inverted` and `underline`, and
 * no size, loading or icons. A link-styled button keeps size, state and loading.
 *
 * No icons: `.d-btn__icon--left/--right:not(:only-child)` (button.less) pulls an icon in with
 * `margin-inline-start/end: var(--dt-spacing-25-negative)`, but `link.less`'s own padding is
 * 0, so there is no positive base padding left to absorb it. The padding computes NEGATIVE,
 * which Figma cannot represent, and clamping it to 0 would hide a real edge collision.
 * Excluded rather than guessed at; revisit if DtButton ever states the combination is
 * supported.
 */
export default {
  component: 'DtButton', label: 'Button', page: 'ButtonLink',
  figmaSetId: '536:37497',
  axes: {
    size: [100, 200, 300, 400, 500],
    // Figma variant value is 'focus'; the CSS pseudo-class is ':focus-visible'
    state: ['default', 'hover', 'active', 'focus', 'disabled'],
    loading: [false, true],
    linkKind: ['default', 'critical', 'warning', 'positive', 'info', 'muted', 'mention'],
    linkUnderline: [true, false],
  },
  // Hover and active are not reachable while loading: the button is pointer-events:none.
  invalid: c => c.loading === true && ['hover', 'active'].includes(c.state),
  variantName: c => `size=${c.size}, state=${c.state}, loading=${c.loading}, `
    + `linkKind=${c.linkKind}, linkUnderline=${c.linkUnderline}`,
  // kind and importance are dead props in link mode; they are pinned to the values the
  // component defaults to so the render is the one a consumer gets by writing `link`.
  props: c => ({
    link: true, kind: 'default', importance: 'primary', circle: false,
    size: Number(c.size), linkKind: c.linkKind, linkUnderline: c.linkUnderline,
    ...(c.state === 'active' ? { active: true } : {}),
    ...(c.state === 'disabled' ? { disabled: true } : {}),
    ...(c.loading ? { loading: true } : {}),
  }),
  slots: () => [],
  // While loading, `.d-loader` is an instance of the real DtLoader, exactly as in Button
  // (see button's anatomySwap in component-axes.mjs). DtLoader must be built first.
  anatomySwap: c => ({
    selector: 'd-loader',
    component: 'loader',
    variant: { size: { 100: 200, 200: 200, 300: 300, 400: 400, 500: 500 }[c.size] },
  }),
  // only these two need the CDP override; active/disabled are class-driven
  pseudo: c => (c.state === 'hover' ? ['hover'] : c.state === 'focus' ? ['focus-visible'] : []),
};
