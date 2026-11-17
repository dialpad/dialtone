/**
 * DtText: the text primitive. Its two design axes are `variant` and `tone`.
 *
 * `variant` is the primary interface (a complete, token-backed typography composition, one per library text
 * style) and `kind` + `size` is its deprecated predecessor, so only `variant` is an axis here; DT-3584's
 * guidance is that the Figma set reinforces `variant` as THE way. `tone` is the semantic foreground colour.
 *
 * Left out on purpose: `tone` values `neutral-black` and `neutral-white` (see TONES), `kind` and `size` (deprecated), and the modifiers that adjust a composition rather
 * than choose one: `weight`, `lineHeight`, `align`, `family`, `italic`, `numeric`, `truncate`, `maxLines`,
 * `wrap`, `boxTrim`, `strength` and `density`. A designer who needs one edits the text layer; the set would
 * otherwise multiply into thousands of variants of one text node. `as` changes the element, not the look.
 */
const VARIANTS = [
  'headline-3xl', 'headline-2xl', 'headline-xl', 'headline-lg', 'headline-md', 'headline-sm', 'headline-xs',
  'body-lg', 'body-md', 'body-sm', 'body-xs',
  'label-lg', 'label-md', 'label-sm', 'label-xs',
  'code-lg', 'code-md', 'code-sm', 'code-xs',
];
// `neutral-black` and `neutral-white` are left out: they are for text on a coloured surface, and the harness
// surface is white, so `neutral-white` would be invisible and could not be checked. 13 of the 15 tones.
const TONES = [
  'primary', 'secondary', 'tertiary', 'muted', 'disabled', 'placeholder',
  'critical', 'critical-strong', 'positive', 'positive-strong', 'warning', 'info', 'info-strong',
];

export default {
  component: 'DtText', label: 'Text', page: 'Text', family: 'Content',
  snapTokens: true,
  // The root holds only text: it hugs the text, so retyping the label widens the component instead of overflowing
  // the box measured for the sample word.
  flexLayout: true,
  // ...and hugs its LINE vertically too: the root is an inline <span>, which measures its content area (23px for
  // the large headline) while the text sits in a taller line, so a pinned height cut the text off.
  hugTextHeight: true,

  // How the set reads in Dev Mode (see code-connect.mjs). `variant` and `tone` have no default in the code, so
  // both are written for every value.
  codeConnect: {
    source: 'packages/dialtone-vue/components/Text/Text.vue',
    alwaysAxes: ['variant', 'tone'],
  },

  axes: {
    variant: VARIANTS,
    tone: TONES,
  },
  variantName: c => `variant=${c.variant}, tone=${c.tone}`,
  props: c => ({ variant: c.variant, tone: c.tone }),
  slots: () => [],
};
