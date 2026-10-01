/**
 * DtPresence.
 *
 * Axes are the PROP API (Presence.vue's own props block): `presence`, `srText`,
 * `showIcon`. PresenceConstants.js also exports PRESENCE_STATES_LIST and a size
 * modifier map, but there is no size PROP — the size classes are applied from
 * outside, by DtAvatar, so a standalone DtPresence has exactly one size. That is
 * why this set is small and why it does not duplicate the avatar coverage: the
 * avatar's presence nodes are checked there, at every avatar size, as children.
 * This set checks the component on its own terms.
 *
 * Deliberately NOT an axis:
 *   srText — screen-reader copy with no painted effect. The harness drops
 *            sr-only nodes before they can become Figma nodes (they paint
 *            nothing), so sweeping it would produce byte-identical variants.
 *
 * No `state` axis: DtPresence has no interactive states. presence.less defines
 * no :hover, :focus or :active rule for .d-presence — it is a status dot, not a
 * control — so there is nothing to force.
 */
export default {
  component: 'DtPresence', label: '', page: 'Presence',
  figmaSetId: '286:6188',

  axes: {
    // The five documented states. Each one changes the dot's fill, its border,
    // or the glyph inside it, so all five are real variants rather than
    // aliases — `dnd` and `offline` both draw a bordered dot, but with
    // different border colours and different glyphs.
    presence: ['active', 'away', 'busy', 'dnd', 'offline'],
    // Gates the glyph inside the dot entirely. Kept as a variant axis rather
    // than a Figma component property so the false case is actually swept: a
    // BOOLEAN property defaults to false and its other value never renders,
    // which is the B-11 pattern this pipeline exists to avoid.
    showIcon: [true, false],
  },

  // Nothing to exclude: every presence × showIcon pair renders, and none of
  // them are known to be pixel-identical. If two turn out to be, the right fix
  // is an exclusion WITH the measurement that justifies it — not a guess now.
  invalid: () => false,

  props: c => ({
    presence: c.presence,
    showIcon: c.showIcon,
  }),

  // `presence` first so the set reads as one dot per state, with and without
  // its glyph. Figma cannot store an empty variant property value, so every
  // value here has to be a non-empty string — all of these already are.
  variantName: c => `presence=${c.presence}, showIcon=${c.showIcon}`,
};
