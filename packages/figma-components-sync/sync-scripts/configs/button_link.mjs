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
import { loaderSwap } from '../loader-swap.mjs';

export default {
  /**
   * RAW TYPOGRAPHY, NOT THE LIBRARY'S TEXT STYLES. `linkUnderline` is an axis, so the label's
   * underline differs between variants — and with a library text style applied, labels bound to
   * the same Label property share their text formatting: underlining one underlined all 700
   * (measured). Without a style each label keeps its own. Every other set uses the styles.
   */
  textStyles: false,
  component: 'DtButton', label: 'Button', page: 'ButtonLink', family: 'Buttons',
  // How the set reads in Dev Mode (see code-connect.mjs).
  codeConnect: {
    source: 'packages/dialtone-vue/components/Button/Button.vue',
    always: ['link'],
  },
  axes: {
    size: [100, 200, 300, 400, 500],
    // Figma variant value is 'focus'; the CSS pseudo-class is ':focus-visible'
    state: ['default', 'hover', 'active', 'focus', 'disabled'],
    loading: [false, true],
    linkKind: ['default', 'critical', 'warning', 'positive', 'info', 'muted', 'mention'],
    linkUnderline: [true, false],
    // No `linkInverted`: DtButton deprecates it in favour of the v-dt-mode directive.
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
  anatomySwap: loaderSwap,
  // only these two need the CDP override; active/disabled are class-driven
  pseudo: c => (c.state === 'hover' ? ['hover'] : c.state === 'focus' ? ['focus-visible'] : []),
};
