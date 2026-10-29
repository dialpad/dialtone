/**
 * DtCollapsible.
 *
 * A disclosure: an anchor with a chevron, and content that shows when `open`.
 *
 * A small set on purpose. `maxWidth`/`maxHeight` take arbitrary CSS lengths rather than a
 * scale, so there is no enumerable axis in them; `id`, `ariaLabel`, `ariaLabelledBy`,
 * `anchorClass` and `contentClass` paint nothing of their own; and `elementType` /
 * `contentElementType` change tag names without changing what is drawn.
 *
 * `open` defaults to `null`, not false: the component treats null as uncontrolled. Both
 * concrete states are swept and the uncontrolled default is left out, because "whatever the
 * component decides" is not a state a Figma variant can represent.
 *
 * No `state` axis: collapsible.less declares no :hover, :focus or :active rule. The anchor
 * inside it is a DtButton, which sweeps all five states in its own set.
 */
export default {
  component: 'DtCollapsible', label: 'Content', page: 'Collapsible',
  figmaSetId: '586:25877',

  axes: {
    open: [false, true],
  },

  invalid: () => false,
  props: c => ({ anchorText: 'More', open: c.open }),

  /**
   * The content is a NAMED slot (`name="content"`), not the default one.
   *
   * Without this the two variants came out byte-identical — 83x35, eight nodes, no content
   * node in either — because the harness's default slot went nowhere and `open` had nothing
   * to reveal. Two pixel-identical twins is worse than no set: every check passes and the
   * axis is decoration.
   */
  slots: () => ['content'],
  slotContent: () => ({
    content: { component: 'DtText', props: { as: 'p' }, text: 'Collapsible content' },
  }),
  // Free-form content, so a native Figma slot holding the example text, not a one-value swap.
  nativeSlots: ['content'],

  variantName: c => `open=${c.open}`,
};
