/**
 * Hand-maintained, docs-only metadata that the design tokens cannot supply.
 *
 * Keep this MINIMAL. The whole point of generate-data.mjs is that token-derived values
 * (stop lists, px/rem) come from the build, not from here — only genuinely non-derivable
 * docs prose/flags belong in this file. The more that lives here, the less drift protection
 * the generator provides.
 */

/**
 * z-index level descriptions (docs guidance prose).
 *
 * The level names and numeric values are derived from `Z_INDEX` in
 * dialtone-tokens/postcss/constants.cjs; only this human description is manual.
 * Keys MUST match the Z_INDEX keys — the emitter throws if a level is missing one,
 * which surfaces drift the moment a new z-index level is added to the constant.
 */
/**
 * gap.json direction options (docs display).
 *
 * Not derivable from tokens — these are the flex/grid gap axes documented on the gap utility
 * pages (`d-cg-*` column, `d-rg-*` row, `d-g-*` both).
 */
export const gapDirections = ['both', 'column', 'row'];

export const zIndexDescriptions = {
  hide: 'Hides an element behind everything',
  base: 'Resets an element to the base z-index',
  base1: 'Raises an element 1 level up from the base z-index',
  selected: 'Selected elements',
  active: 'Active elements',
  navigation: 'Navigation',
  'navigation-fixed': 'Fixed navigation',
  dropdown: 'Dropdowns',
  popover: 'Popovers',
  tooltip: 'Tooltips',
  drawer: 'Drawer',
  modal: 'Modal',
  'modal-element': 'An element within a modal',
  notification: 'Notifications',
};
