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
  figmaSetId: '592:21746',
  axes: {
    size: [100, 200, 300, 400, 500],
    // Figma variant value is 'focus'; the CSS pseudo-class is ':focus-visible'
    state: ['default', 'hover', 'active', 'focus', 'disabled'],
    linkKind: ['default', 'critical', 'warning', 'positive', 'info', 'muted', 'mention'],
    linkUnderline: [true, false],
    // Links for dark backgrounds: every kind has an inverted colour (LINK_KIND_MODIFIERS_INVERTED).
    // Measured on a dark CONTAINER that is not part of the component, so the tree holds only the
    // link and its colours.
    linkInverted: [false, true],
  },
  /**
   * NO `loading` AXIS, deliberately.
   *
   * Crossing `linkInverted` with `loading` took the set to about 1,120 variants, past Figma's
   * 1,000-variant performance warning ("Components with more than 1000 variants may experience
   * performance issues"). Without it the set is 700. The cost is real and chosen: this set no
   * longer shows the loading spinner. DtButton's own loading state is covered by DtButton and
   * DtButtonIcon.
   */
  invalid: () => false,
  variantName: c => `size=${c.size}, state=${c.state}, linkKind=${c.linkKind}, `
    + `linkUnderline=${c.linkUnderline}, linkInverted=${c.linkInverted}`,
  // kind and importance are dead props in link mode; they are pinned to the values the
  // component defaults to so the render is the one a consumer gets by writing `link`.
  props: c => ({
    link: true, kind: 'default', importance: 'primary', circle: false,
    size: Number(c.size), linkKind: c.linkKind, linkUnderline: c.linkUnderline,
    linkInverted: c.linkInverted,
    ...(c.state === 'active' ? { active: true } : {}),
    ...(c.state === 'disabled' ? { disabled: true } : {}),
  }),
  // A dark container for the inverted links, outside the measured tree.
  containerClass: c => (c.linkInverted ? 'd-bgc-black-900' : ''),
  slots: () => [],
  // only these two need the CDP override; active/disabled are class-driven
  pseudo: c => (c.state === 'hover' ? ['hover'] : c.state === 'focus' ? ['focus-visible'] : []),
};
