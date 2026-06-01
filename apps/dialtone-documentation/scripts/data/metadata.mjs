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

/**
 * width-height.json docs-only metadata — none of this is token-derived:
 *  - `percentage`: the percentage width/height utilities (`d-w{n}p`)
 *  - `viewport`: viewport-relative CSS keywords (vh/dvh/svh/lvh, vw/dvw/svw/lvw)
 *  - `characterWidth`: ch-based widths
 *  - `keywords`: intrinsic-sizing CSS keywords
 * The `layout` stop list + px come from `LAYOUT_STOPS` + the layout tokens (see emit-width-height.mjs).
 */
export const widthHeight = {
  percentage: [10, 15, 20, 25, 30, 33, 40, 50, 60, 66, 70, 75, 80, 85, 90, 100],
  viewport: {
    height: ['100vh', 'dvh', 'svh', 'lvh'],
    width: ['100vw', 'dvw', 'svw', 'lvw'],
  },
  characterWidth: ['60ch', '75ch', '90ch'],
  keywords: ['auto', 'unset', 'fit-content', 'max-content', 'min-content'],
};

/**
 * spacing.json docs-only metadata.
 *
 * The `values` array and the coordinate stop list + `value` are token-derived (see emit-spacing.mjs);
 * everything here is non-derivable docs metadata:
 *  - `directions`: padding/margin direction suffixes, with deprecated physical names flagged.
 *  - `coordinateDirections`: the inset utility axes (logical property, physical display name,
 *    class prefix, and whether percentage offsets apply).
 *  - `coordinateFlags`: per-coordinate `negative`/`combo` flags (docs-only). Keys MUST cover every
 *    spacing stop; the emitter throws otherwise, surfacing a newly added stop.
 *  - `extraCoordinates`: literal percentage/calc coordinates appended after the token-stop ones.
 */
export const spacing = {
  directions: [
    { name: 'All' },
    { name: 'top', deprecated: true },
    { name: 'right', deprecated: true },
    { name: 'bottom', deprecated: true },
    { name: 'left', deprecated: true },
    { name: 'x' },
    { name: 'y' },
  ],
  coordinateDirections: [
    { direction: 'inset-block-start', directionPhysical: 'Top', prefix: 'ibs', percent: 'yes' },
    { direction: 'inset-inline-end', directionPhysical: 'Right', prefix: 'iie', percent: 'yes' },
    { direction: 'inset-block-end', directionPhysical: 'Bottom', prefix: 'ibe', percent: 'yes' },
    { direction: 'inset-inline-start', directionPhysical: 'Left', prefix: 'iis', percent: 'yes' },
    { direction: 'inset-inline', directionPhysical: 'Left/Right', prefix: 'x', percent: 'no' },
    { direction: 'inset-block', directionPhysical: 'Top/Bottom', prefix: 'y', percent: 'no' },
    { direction: 'inset', directionPhysical: 'All', prefix: 'all', percent: 'no' },
  ],
  coordinateFlags: {
    0: { negative: 'no', combo: 'yes' },
    1: { negative: 'yes', combo: 'yes' },
    25: { negative: 'yes', combo: 'yes' },
    50: { negative: 'yes', combo: 'yes' },
    75: { negative: 'yes', combo: 'yes' },
    100: { negative: 'yes', combo: 'yes' },
    125: { negative: 'yes', combo: 'yes' },
    150: { negative: 'yes', combo: 'yes' },
    175: { negative: 'yes', combo: 'yes' },
    200: { negative: 'yes', combo: 'yes' },
    250: { negative: 'yes', combo: 'yes' },
    300: { negative: 'yes', combo: 'yes' },
    350: { negative: 'yes', combo: 'yes' },
    400: { negative: 'yes', combo: 'yes' },
    450: { negative: 'yes', combo: 'yes' },
    500: { negative: 'yes', combo: 'yes' },
    525: { negative: 'yes', combo: 'yes' },
    550: { negative: 'yes', combo: 'yes' },
    600: { negative: 'yes', combo: 'yes' },
    650: { negative: 'yes', combo: 'yes' },
    700: { negative: 'yes', combo: 'yes' },
    750: { negative: 'yes', combo: 'yes' },
    800: { negative: 'yes', combo: 'yes' },
  },
  extraCoordinates: [
    { coordinate: '50p', negative: 'yes', combo: 'no', value: '50%' },
    { coordinate: '100p', negative: 'yes', combo: 'no', value: '100%' },
    { coordinate: '100p-calc', negative: 'yes', combo: 'no', value: 'calc(100% + 8px)' },
  ],
};

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
