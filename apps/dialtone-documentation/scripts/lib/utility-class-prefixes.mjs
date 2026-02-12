/**
 * Mapping of utility page relative paths (from utilities/ dir, without .md)
 * to prefix filters for dialtone-docs.json lookup.
 *
 * - prefixes: array of key prefixes to match against dialtone-docs.json keys
 * - cssProperty: optional CSS property string to disambiguate prefix collisions
 *   (matched against the `prop` field in each value entry)
 */
export const UTILITY_CLASS_MAPPING = {
  // Borders
  'borders/width': { prefixes: ['d-baw', 'd-btw', 'd-brw', 'd-bbw', 'd-blw', 'd-bxw', 'd-byw'] },
  'borders/radius': { prefixes: ['d-bar', 'd-btr', 'd-brr', 'd-bbr', 'd-blr'] },
  'borders/direction': { prefixes: ['d-ba', 'd-bt', 'd-br', 'd-bb', 'd-bl', 'd-bx', 'd-by'], cssProperty: 'border' },
  'borders/style': { prefixes: ['d-bas-', 'd-bts-', 'd-brs-', 'd-bbs-', 'd-bls-'] },
  'borders/divide-width': { prefixes: ['d-divide-y', 'd-divide-x'], cssProperty: 'border' },

  // Layout
  'layout/z-index': { prefixes: ['d-zi-'] },
  'layout/position': { prefixes: ['d-ps-'] },
  'layout/visibility': { prefixes: ['d-vi-'] },
  'layout/box-sizing': { prefixes: ['d-box-'] },

  // Interactivity
  'interactivity/outline': { prefixes: ['d-ol-'] },
  'interactivity/resize': { prefixes: ['d-r-'] },
  'interactivity/pointer-events': { prefixes: ['d-pe-', 'd-us-'] },
  'interactivity/cursor': { prefixes: ['d-c-'] },

  // Backgrounds
  'backgrounds/attachment': { prefixes: ['d-bga-'] },
  'backgrounds/clip': { prefixes: ['d-bgc-'], cssProperty: 'background-clip' },
  'backgrounds/position': { prefixes: ['d-bgp-'] },
  'backgrounds/repeat': { prefixes: ['d-bgr-'] },
  'backgrounds/size': { prefixes: ['d-bgs-'] },
  'backgrounds/patterns': { prefixes: ['d-bgg-pattern'] },
  'backgrounds/gradients': { prefixes: ['d-bgg-'] },

  // Spacing
  'spacing/padding': { prefixes: ['d-p'], cssProperty: 'padding' },
  'spacing/margin': { prefixes: ['d-m'], cssProperty: 'margin' },

  // Effects
  'effects/opacity': { prefixes: ['d-o'], cssProperty: 'opacity' },
  'effects/box-shadow': { prefixes: ['d-bs-'] },
  'effects/transition': { prefixes: ['d-t'], cssProperty: 'transition' },

  // Flex
  'flex/align-self': { prefixes: ['d-as-'] },
  'flex/align-content': { prefixes: ['d-ac-'] },
  'flex/align-items': { prefixes: ['d-ai-'] },
  'flex/gap': { prefixes: ['d-g', 'd-cg', 'd-rg'], cssProperty: 'gap' },
  'flex/justify': { prefixes: ['d-jc-'] },
  'flex/columns-layouts': { prefixes: ['d-fl-col'] },
  'flex/order': { prefixes: ['d-order'] },

  // Grid
  'grid/column-start-end-span': { prefixes: ['d-gc', 'd-gcs', 'd-gce'], excludePrefixes: ['d-gcg'] },
  'grid/row-start-end-span': { prefixes: ['d-gr', 'd-grs', 'd-gre'], excludePrefixes: ['d-grg'] },
  'grid/justify-self': { prefixes: ['d-js-'] },
  'grid/gap': { prefixes: ['d-gg', 'd-gcg', 'd-grg'] },
  'grid/layouts': { prefixes: ['d-g-cols'] },
  'grid/place-items': { prefixes: ['d-pli-'] },
  'grid/place-content': { prefixes: ['d-plc-'] },
  'grid/place-self': { prefixes: ['d-pls-'] },
  'grid/justify-items': { prefixes: ['d-ji-'] },

  // Typography
  'typography/text-overflow': { prefixes: ['d-truncate', 'd-to-'] },
  'typography/line-height': { prefixes: ['d-lh'] },
  'typography/whitespace': { prefixes: ['d-ws-'] },
  'typography/text-decoration': { prefixes: ['d-td-'], cssProperty: 'text-decoration' },
  'typography/font-variant-numeric': { prefixes: ['d-fvn-'] },
  'typography/vertical-align': { prefixes: ['d-va-'] },
  'typography/line-clamp': { prefixes: ['d-lc-'] },
  'typography/font-style': { prefixes: ['d-fs-'], cssProperty: 'font-style' },
  'typography/lists': { prefixes: ['d-ls-', 'd-lst-'] },
  'typography/font-weight': { prefixes: ['d-fw-'], cssProperty: 'font-weight' },
  'typography/text-align': { prefixes: ['d-ta-'] },
  'typography/text-transform': { prefixes: ['d-tt-'] },
  'typography/text-opacity': { prefixes: ['d-fco'] },
};
