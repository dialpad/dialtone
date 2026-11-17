/**
 * DtPresence: the status dot. Axes are the prop API: `presence` and `showIcon`.
 *
 * There is no size PROP: the size classes are applied from outside, by DtAvatar, so a standalone DtPresence has
 * exactly one size. DtAvatar holds its own presence NATIVELY (its size comes from the avatar's CSS variables, so
 * an instance of this set would not scale); this set is the dot on its own terms.
 *
 * Not an axis: `srText` (screen-reader copy, nothing painted; the harness drops sr-only nodes). No `state`: presence.less
 * declares no :hover, :focus or :active, it is a status dot, not a control.
 */
export default {
  component: 'DtPresence', label: '', page: 'Presence', family: 'Identity & status',
  snapTokens: true,

  // How the set reads in Dev Mode (see code-connect.mjs).
  codeConnect: {
    source: 'packages/dialtone-vue/components/Presence/Presence.vue',
    selfClosing: true,
  },

  axes: {
    // The five documented states: each changes the dot's fill, its border or its glyph.
    presence: ['active', 'away', 'busy', 'dnd', 'offline'],
    // Gates the glyph inside the dot. An axis, not a boolean property, so the false case is swept (B-11).
    showIcon: [true, false],
  },
  variantName: c => `presence=${c.presence}, showIcon=${c.showIcon}`,
  props: c => ({ presence: c.presence, showIcon: c.showIcon }),
  slots: () => [],
};
