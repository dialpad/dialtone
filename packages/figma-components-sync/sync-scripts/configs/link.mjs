/**
 * DtLink: an inline text link. Axes are the prop API: `tone`, `underline` and the interaction state.
 *
 * Left out on purpose: `kind` and `inverted` (deprecated; a dark surface is a mode, not a prop), and
 * `unstyled` (renders no link classes at all, a plain anchor with nothing to design). `to` and `href` are
 * behaviour. A link has no disabled state on the component (`d-link--disabled` exists in link.less, but there
 * is no `disabled` prop): link.less declares :hover, :active and :focus-visible.
 *
 * RAW TYPOGRAPHY, NOT THE LIBRARY'S TEXT STYLES, as DtButtonLink: `underline` is an axis, and with a library
 * style applied, labels bound to the same Label property share their text formatting (underlining one
 * underlined every label).
 */
const TONES = ['default', 'critical', 'warning', 'positive', 'info', 'muted', 'mention'];

export default {
  component: 'DtLink', label: 'Link', page: 'Link', family: 'Content',
  snapTokens: true,
  textStyles: false,

  // How the set reads in Dev Mode (see code-connect.mjs).
  codeConnect: {
    source: 'packages/dialtone-vue/components/Link/Link.vue',
  },

  axes: {
    tone: TONES,
    underline: [true, false],
    // Figma variant value is 'focus'; the CSS pseudo-class is ':focus-visible'
    state: ['default', 'hover', 'active', 'focus'],
  },
  variantName: c => `tone=${c.tone}, underline=${c.underline}, state=${c.state}`,
  props: c => ({
    tone: c.tone === 'default' ? '' : c.tone,
    underline: c.underline,
    href: '#',
  }),
  slots: () => [],
  pseudo: c => (c.state === 'hover' ? ['hover'] : c.state === 'active' ? ['active']
    : c.state === 'focus' ? ['focus-visible'] : []),
};
