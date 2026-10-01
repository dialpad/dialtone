/**
 * DtListItem.
 *
 * Axes are the props that change what is painted. `id`, `role`, `wrapperClass` and
 * `elementType` are pass-through or semantic only.
 *
 * `navigationType` is not cosmetic even though it sounds it: `list-item.less` keys its focus
 * rules off `&--focusable`, and that modifier comes from the navigation type. So the type
 * decides whether a focus ring exists at all, which is why `state` and `navigationType` are
 * swept together rather than one being pinned.
 */
export default {
  component: 'DtListItem', label: 'Item', page: 'ListItem',
  figmaSetId: '286:6325',

  axes: {
    // `custom` hands the whole interior to the consumer; `default` renders the component's
    // own row. Two different anatomies, not two skins.
    type: ['default', 'custom'],
    navigationType: ['arrow-keys', 'tab', 'none'],
    selected: [false, true],
    // `list-item.less` declares `&--focusable:focus`, `:focus-within` and `:focus-visible`.
    // No `hover` here: the file has no :hover rule, so a hover sweep would pair every
    // variant with a pixel-identical twin.
    state: ['default', 'focus'],
  },

  invalid: c => {
    // `navigationType: 'none'` is what removes `--focusable`, so there is no focus state to
    // force. Sweeping it anyway would produce a variant identical to its default twin.
    if (c.navigationType === 'none' && c.state === 'focus') return true;
    return false;
  },

  props: c => ({
    type: c.type,
    navigationType: c.navigationType,
    selected: c.selected,
  }),

  stateTarget: '.d-list-item',
  pseudo: c => (c.state === 'focus' ? ['focus', 'focus-visible'] : []),
  variantName: c => `type=${c.type}, navigationType=${c.navigationType}, `
    + `selected=${c.selected}, state=${c.state}`,
};
