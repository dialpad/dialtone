/* eslint-disable max-lines */
/* eslint-disable max-len */

const TokensBaseLight = require('@dialpad/dialtone-tokens/dist/tokens-base-light.json');
const TokensDpLight = require('@dialpad/dialtone-tokens/dist/tokens-dp-light.json');
const TokensContrastHighLight = require('@dialpad/dialtone-tokens/dist/tokens-contrast-high-light.json');
const TokensContrastHighDark = require('@dialpad/dialtone-tokens/dist/tokens-contrast-high-dark.json');

const { Rule } = require('postcss');

// TODO: Move these constants to the _data directory
const {
  BORDER_RADIUS_SIZES,
  FLEX_COLUMNS,
  OPACITIES,
  REGEX_OPTIONS,
  MARGIN_SIZES_SPACING,
  MARGIN_SIZES_LAYOUT,
  PADDING_SIZES_SPACING,
  PADDING_SIZES_LAYOUT,
  GAP_SPACES_SPACING,
  POSITION_SIZES_SPACING,
  POSITION_SIZES_LAYOUT,
  POSITION_SIZES_DEPRECATED,
  WIDTH_HEIGHTS_SPACING,
  WIDTH_HEIGHTS_LAYOUT,
  WIDTH_HEIGHTS_DEPRECATED,
  HSLA_EXCLUDED_COLORS,
} = require('./constants.cjs');
const {
  appendHoverFocusSelectors,
  processColors,
  generateTokenName,
} = require('./helpers.cjs');
// This constant determines the order in which classes are going to be added to the root CSS
const generatedRules = {
  fontColor: [],
  borderColor: [],
  backgroundColor: [],
  dividerColor: [],
  backgroundGradientFromColor: [],
  backgroundGradientToColor: [],
  fontOpacity: [],
  borderOpacity: [],
  dividerOpacity: [],
  backgroundOpacity: [],
  backgroundGradientFromOpacity: [],
  backgroundGradientToOpacity: [],
  flexColumn: [],
  flexColumnEveryChild: [],
  flexColumnNthChild: [],
  flexDirectionColumn: [],
  borderAllRadius: [],
  borderTopRadius: [],
  borderRightRadius: [],
  borderBottomRadius: [],
  borderLeftRadius: [],
  gap: [],
  rowGap: [],
  columnGap: [],
  gapEveryChild: [],
  columnGapEveryChild: [],
  gridColumns: [],
  gridColumnStart: [],
  gridColumnEnd: [],
  gridColumnSpan: [],
  gridRows: [],
  gridRowStart: [],
  gridRowEnd: [],
  gridRowSpan: [],
  gridGap: [],
  gridColumnGap: [],
  gridRowGap: [],
  positionAll: [],
  positionHorizontal: [],
  positionVertical: [],
  positionTop: [],
  positionRight: [],
  positionBottom: [],
  positionLeft: [],
  fixedHeight: [],
  maxHeight: [],
  minHeight: [],
  fixedWidth: [],
  minWidth: [],
  maxWidth: [],
  marginAll: [],
  marginHorizontal: [],
  marginVertical: [],
  marginTop: [],
  marginRight: [],
  marginBottom: [],
  marginLeft: [],
  paddingAll: [],
  paddingHorizontal: [],
  paddingVertical: [],
  paddingTop: [],
  paddingRight: [],
  paddingBottom: [],
  paddingLeft: [],
};

//    Utility classes generation      //

/**
 * Generate color utility classes.
 *  - Font Color
 *  - Border Color
 *  - Background Color
 *  - Divider Color
 *  - Gradient Colors
 * @param { Source } clonedSource
 * @param { Declaration } declaration
 */
function colorUtilities (clonedSource, declaration) {
  const foregroundColorsRegex = /dtColorForeground.+/i;
  const surfaceColorsRegex = /dtColorSurface.+/i;
  const borderColorsRegex = /dtColorBorder.+/i;
  const baseColorsRegex = /dtColor(?!(Foreground|Surface|Border|Brand|Gradient|Link|Chart)).+/i;
  const chartColorsRegex = /dtColorChart.+/i;

  const tokens = { ...TokensBaseLight, ...TokensDpLight };

  const baseColors = Object.entries(tokens).filter(([key]) => baseColorsRegex.test(key)).reduce(processColors, []);
  const foregroundColors = Object.entries(tokens).filter(([key]) => foregroundColorsRegex.test(key)).reduce(processColors, []);
  const surfaceColors = Object.entries(tokens).filter(([key]) => surfaceColorsRegex.test(key)).reduce(processColors, []);
  const borderColors = Object.entries(tokens).filter(([key]) => borderColorsRegex.test(key)).reduce(processColors, []);
  const chartColors = Object.entries(tokens).filter(([key]) => chartColorsRegex.test(key)).reduce(processColors, []);

  /**
   * High Contrast Color Utilities
   *
   * Problem: High contrast tokens redefine colors as complete hsl() values (e.g. hsl(0 0% 0% / 0.5)),
   * but CSS utilities construct colors from HSLA split components:
   *   - var(--dt-color-border-subtle-h)
   *   - var(--dt-color-border-subtle-s)
   *   - var(--dt-color-border-subtle-l)
   *   - var(--dt-color-border-subtle-a)
   *
   * These split components don't exist in high contrast mode, causing utilities to fail.
   *
   * Solution: Generate [data-dt-contrast="high"] overrides that use the full token variable
   * instead of constructing from splits. This ensures:
   *   - Normal mode: HSLA splits work, opacity utilities (--fco, --bgo, --bco, --dco) functional
   *   - High contrast mode: Full variable used, splits ignored
   *
   * The list of high contrast colors is dynamically extracted from token files to future-proof
   * against token additions/removals. Only colors defined in high contrast token files receive
   * override rules, minimizing CSS bloat (~14 rules for 10 colors).
   */
  const highContrastKeys = new Set([
    ...Object.keys(TokensContrastHighLight),
    ...Object.keys(TokensContrastHighDark),
  ]);

  // Only include semantic color tokens that are used in utilities
  // Excludes brand, gradient, shell, and action colors which are handled differently
  const HIGH_CONTRAST_COLORS = Array.from(highContrastKeys)
    .filter(key =>
      key.startsWith('dtColorForeground') ||
      key.startsWith('dtColorBorder') ||
      key.startsWith('dtColorSurface'),
    )
    .map(key => `--${generateTokenName(key)}`);

  function _generateColorNodes (token, prop, opacityVar) {
    return [
      declaration.clone({
        prop: opacityVar,
        value: HSLA_EXCLUDED_COLORS.includes(token)
          ? `100%`
          : `var(${token}-a)`,
      }),
      declaration.clone({
        prop,
        // Use relative color syntax to apply opacity
        // Extracts l, c, h from the token and applies the opacity variable to alpha
        // Alpha channel accepts percentages directly (75% = 0.75 opacity)
        value: HSLA_EXCLUDED_COLORS.includes(token)
          ? `var(${token}) !important`
          : `oklch(from var(${token}) l c h / var(${opacityVar})) !important`,
      }),
    ];
  }

  function _generateHighContrastColorNode (token, prop) {
    return [
      declaration.clone({
        prop,
        value: `var(${token}) !important`,
      }),
    ];
  }

  function _prependHighContrastSelector (selector) {
    return selector.split(', ').map(s => `[data-dt-contrast="high"] ${s}`).join(', ');
  }
  function _generateForegroundColors (token, colorName) {
    generatedRules.fontColor.push(new Rule({
      source: clonedSource,
      selector: appendHoverFocusSelectors(`.d-fc-${colorName}`),
      nodes: _generateColorNodes(token, 'color', '--fco'),
    }));
    // High contrast override (only for colors that have high contrast overrides)
    if (HIGH_CONTRAST_COLORS.includes(token)) {
      generatedRules.fontColor.push(new Rule({
        source: clonedSource,
        selector: _prependHighContrastSelector(appendHoverFocusSelectors(`.d-fc-${colorName}`)),
        nodes: _generateHighContrastColorNode(token, 'color'),
      }));
    }
  }
  function _generateSurfaceColors (token, colorName) {
    generatedRules.backgroundColor.push(new Rule({
      source: clonedSource,
      selector: appendHoverFocusSelectors(`.d-bgc-${colorName}`),
      nodes: _generateColorNodes(token, 'background-color', '--bgo'),
    }));
    // High contrast override (only for colors that have high contrast overrides)
    if (HIGH_CONTRAST_COLORS.includes(token)) {
      generatedRules.backgroundColor.push(new Rule({
        source: clonedSource,
        selector: _prependHighContrastSelector(appendHoverFocusSelectors(`.d-bgc-${colorName}`)),
        nodes: _generateHighContrastColorNode(token, 'background-color'),
      }));
    }
  }
  function _generateBorderColors (token, colorName) {
    generatedRules.borderColor.push(new Rule({
      source: clonedSource,
      selector: appendHoverFocusSelectors(`.d-bc-${colorName}`),
      nodes: _generateColorNodes(token, 'border-color', '--bco'),
    }));
    // High contrast override (only for colors that have high contrast overrides)
    if (HIGH_CONTRAST_COLORS.includes(token)) {
      generatedRules.borderColor.push(new Rule({
        source: clonedSource,
        selector: _prependHighContrastSelector(appendHoverFocusSelectors(`.d-bc-${colorName}`)),
        nodes: _generateHighContrastColorNode(token, 'border-color'),
      }));
    }
  }
  function _generateDividerColors (token, colorName) {
    generatedRules.dividerColor.push(new Rule({
      source: clonedSource,
      selector: `.d-divide-${colorName} > * + *`,
      nodes: _generateColorNodes(token, 'border-color', '--dco'),
    }));
    // High contrast override (only for colors that have high contrast overrides)
    if (HIGH_CONTRAST_COLORS.includes(token)) {
      generatedRules.dividerColor.push(new Rule({
        source: clonedSource,
        selector: `[data-dt-contrast="high"] .d-divide-${colorName} > * + *`,
        nodes: _generateHighContrastColorNode(token, 'border-color'),
      }));
    }
  }

  baseColors.forEach(({ token, colorName }) => {
    _generateForegroundColors(token, colorName);
    _generateBorderColors(token, colorName);
    _generateSurfaceColors(token, colorName);
    _generateDividerColors(token, colorName);
    generatedRules.backgroundGradientFromColor.push(new Rule({
      source: clonedSource,
      selector: appendHoverFocusSelectors(`.d-bgg-from-${colorName}`),
      nodes: [
        ..._generateColorNodes(token, '--bgg-from', '--bgg-from-opacity'),
        declaration.clone({
          prop: '--bgg-to',
          value: HSLA_EXCLUDED_COLORS.includes(token)
            ? `var(${token}) !important`
            : `hsl(var(${token}-h) var(${token}-s) var(${token}-l) / 0%) !important`,
        }),
      ],
    }));
    generatedRules.backgroundGradientToColor.push(new Rule({
      source: clonedSource,
      selector: appendHoverFocusSelectors(`.d-bgg-to-${colorName}`),
      nodes: _generateColorNodes(token, '--bgg-to', '--bgg-to-opacity'),
    }));
  });
  foregroundColors.forEach(({ token, colorName }) => {
    _generateForegroundColors(token, colorName);
  });
  surfaceColors.forEach(({ token, colorName }) => {
    // Exclude as it is a gradient color and it is being generated manually
    if (token === '--dt-color-surface-ai') return;

    _generateSurfaceColors(token, colorName);
  });
  borderColors.forEach(({ token, colorName }) => {
    // Exclude as it is a gradient color and it is being generated manually
    if (token === '--dt-color-border-ai') return;

    _generateBorderColors(token, colorName);
    _generateDividerColors(token, colorName);
  });
  chartColors.forEach(({ token, colorName }) => {
    _generateBorderColors(token, colorName);
    _generateSurfaceColors(token, colorName);
  });
}

/**
 * Generate opacity utility classes required.
 *  - Font Opacity
 *  - Border Opacity
 *  - Divider Opacity
 *  - Background Opacity
 *  - Background Gradient Opacity Starting Stop
 *  - Background Gradient Opacity Ending Stop
 * @param { Source } clonedSource
 * @param { Declaration } declaration
 */
function opacityUtilities (clonedSource, declaration) {
  OPACITIES.forEach(opacity => {
    generatedRules.fontOpacity.push(new Rule({
      source: clonedSource,
      selector: appendHoverFocusSelectors(`.d-fco${opacity}`),
      nodes: [
        declaration.clone({ prop: '--fco', value: `${opacity}% !important` }),
      ],
    }));
    generatedRules.borderOpacity.push(new Rule({
      source: clonedSource,
      selector: appendHoverFocusSelectors(`.d-bco${opacity}`),
      nodes: [
        declaration.clone({ prop: '--bco', value: `${opacity}% !important` }),
      ],
    }));
    generatedRules.dividerOpacity.push(new Rule({
      source: clonedSource,
      selector: `.d-dco-${opacity}`,
      nodes: [
        declaration.clone({ prop: '--dco', value: `${opacity}% !important` }),
      ],
    }));
    generatedRules.backgroundOpacity.push(new Rule({
      source: clonedSource,
      selector: appendHoverFocusSelectors(`.d-bgo${opacity}`),
      nodes: [
        declaration.clone({ prop: '--bgo', value: `${opacity}% !important` }),
      ],
    }));
    generatedRules.backgroundGradientFromOpacity.push(new Rule({
      source: clonedSource,
      selector: appendHoverFocusSelectors(`.d-bgg-from-o${opacity}`),
      nodes: [
        declaration.clone({ prop: '--bgg-from-opacity', value: `${opacity}% !important` }),
      ],
    }));
    generatedRules.backgroundGradientToOpacity.push(new Rule({
      source: clonedSource,
      selector: appendHoverFocusSelectors(`.d-bgg-to-o${opacity}`),
      nodes: [
        declaration.clone({ prop: '--bgg-to-opacity', value: `${opacity}% !important` }),
      ],
    }));
  });
}

/**
 * Generate flex column utility classes.
 * @param { Source } clonedSource
 * @param { Declaration } declaration
 */
function flexColumnsUtilities (clonedSource, declaration) {
  for (let i = 1; i <= FLEX_COLUMNS; i++) {
    // TODO: Update d-fl-col* implementation on our next migration. https://dialpad.atlassian.net/browse/DLT-1763
    generatedRules.flexColumn.push(new Rule({
      source: clonedSource,
      selector: `.d-fl-col${i}`,
      nodes: [
        declaration.clone({ prop: 'display', value: 'flex' }),
      ],
    }));
    generatedRules.flexColumnEveryChild.push(new Rule({
      source: clonedSource,
      selector: `.d-fl-col${i} > *`,
      nodes: [
        declaration.clone({ prop: '--fl-gap', value: 'var(--dt-size-0)' }),
        declaration.clone({ prop: '--fl-basis', value: `calc(100% / ${i})` }),
        declaration.clone({ prop: 'display', value: 'inline-flex' }),
        declaration.clone({ prop: 'margin', value: 'var(--fl-gap)' }),
        declaration.clone({ prop: 'flex', value: '1 calc(var(--fl-basis) - (var(--fl-gap) * 2))' }),
      ],
    }));
    generatedRules.flexColumnNthChild.push(new Rule({
      source: clonedSource,
      selector: `.d-fl-col${i} > *:nth-child(-n + ${i})`,
      nodes: [
        declaration.clone({ prop: 'margin-block-start', value: 'var(--dt-size-0)' }),
      ],
    }));
    generatedRules.flexDirectionColumn.push(new Rule({
      source: clonedSource,
      selector: `.d-fl-col${i}.d-fd-column > *`,
      nodes: [
        declaration.clone({ prop: 'margin', value: 'var(--fl-gap) 0' }),
      ],
    }));
  }
}

/**
 * Generate border utility classes.
 * @param { Source } clonedSource
 * @param { Declaration } declaration
 */
function borderUtilities (clonedSource, declaration) {
  Object.keys(BORDER_RADIUS_SIZES)
    .forEach(size => {
      generatedRules.borderAllRadius.push(new Rule({
        source: clonedSource,
        selector: `.d-bar${size}`,
        nodes: [
          declaration.clone({ prop: 'border-radius', value: `var(--dt-size-${BORDER_RADIUS_SIZES[size]}) !important` }),
        ],
      }));
      generatedRules.borderTopRadius.push(new Rule({
        source: clonedSource,
        selector: `.d-btr${size}`,
        nodes: [
          declaration.clone({ prop: 'border-start-start-radius', value: `var(--dt-size-${BORDER_RADIUS_SIZES[size]}) !important` }),
          declaration.clone({ prop: 'border-start-end-radius', value: `var(--dt-size-${BORDER_RADIUS_SIZES[size]}) !important` }),
        ],
      }));
      generatedRules.borderRightRadius.push(new Rule({
        source: clonedSource,
        selector: `.d-brr${size}`,
        nodes: [
          declaration.clone({ prop: 'border-start-end-radius', value: `var(--dt-size-${BORDER_RADIUS_SIZES[size]}) !important` }),
          declaration.clone({ prop: 'border-end-end-radius', value: `var(--dt-size-${BORDER_RADIUS_SIZES[size]}) !important` }),
        ],
      }));
      generatedRules.borderBottomRadius.push(new Rule({
        source: clonedSource,
        selector: `.d-bbr${size}`,
        nodes: [
          declaration.clone({ prop: 'border-end-start-radius', value: `var(--dt-size-${BORDER_RADIUS_SIZES[size]}) !important` }),
          declaration.clone({ prop: 'border-end-end-radius', value: `var(--dt-size-${BORDER_RADIUS_SIZES[size]}) !important` }),
        ],
      }));
      generatedRules.borderLeftRadius.push(new Rule({
        source: clonedSource,
        selector: `.d-blr${size}`,
        nodes: [
          declaration.clone({ prop: 'border-start-start-radius', value: `var(--dt-size-${BORDER_RADIUS_SIZES[size]}) !important` }),
          declaration.clone({ prop: 'border-end-start-radius', value: `var(--dt-size-${BORDER_RADIUS_SIZES[size]}) !important` }),
        ],
      }));
    });
}

/**
 * Generate Grid column and row utility classes.
 * @param { Source } clonedSource
 * @param { Declaration } declaration
 */
function gridUtilities (clonedSource, declaration) {
  for (let i = 1; i <= FLEX_COLUMNS; i++) {
    generatedRules.gridColumns.push(new Rule({
      source: clonedSource,
      selector: `.d-g-cols${i}`,
      nodes: [
        declaration.clone({ prop: 'grid-template-columns', value: `[full-start] repeat(${i}, [col-start] var(--col-width, minmax(0,1fr)) [col-end]) [full-end] !important` }),
      ],
    }));
    generatedRules.gridColumnStart.push(new Rule({
      source: clonedSource,
      selector: `.d-gcs${i}`,
      nodes: [
        declaration.clone({ prop: 'grid-column-start', value: `${i} !important` }),
      ],
    }));
    generatedRules.gridColumnEnd.push(new Rule({
      source: clonedSource,
      selector: `.d-gce${i}`,
      nodes: [
        declaration.clone({ prop: 'grid-column-end', value: `${i} !important` }),
      ],
    }));
    generatedRules.gridColumnSpan.push(new Rule({
      source: clonedSource,
      selector: `.d-gc${i}`,
      nodes: [
        declaration.clone({ prop: 'grid-column', value: `span ${i} / span ${i} !important` }),
      ],
    }));
    generatedRules.gridRows.push(new Rule({
      source: clonedSource,
      selector: `.d-g-rows${i}`,
      nodes: [
        declaration.clone({ prop: 'grid-template-rows', value: `[full-start] repeat(${i}, [col-start] minmax(0,1fr) [col-end]) [full-end] !important` }),
      ],
    }));
    generatedRules.gridRowStart.push(new Rule({
      source: clonedSource,
      selector: `.d-grs${i}`,
      nodes: [
        declaration.clone({ prop: 'grid-row-start', value: `${i} !important` }),
      ],
    }));
    generatedRules.gridRowEnd.push(new Rule({
      source: clonedSource,
      selector: `.d-gre${i}`,
      nodes: [
        declaration.clone({ prop: 'grid-row-end', value: `${i} !important` }),
      ],
    }));
    generatedRules.gridRowSpan.push(new Rule({
      source: clonedSource,
      selector: `.d-gr${i}`,
      nodes: [
        declaration.clone({ prop: 'grid-row', value: `span ${i} / span ${i} !important` }),
      ],
    }));
  }
}

/**
 * Generate gap utility classes.
 * @param { Source } clonedSource
 * @param { Declaration } declaration
 */
function gapUtilities (clonedSource, declaration) {
  // Helper to generate gap rules for a given stop and token
  function generateGapRules (stop, tokenVar) {
    generatedRules.gap.push(new Rule({
      source: clonedSource,
      selector: `.d-g${stop}`,
      nodes: [
        declaration.clone({ prop: 'gap', value: `${tokenVar} !important` }),
      ],
    }));
    generatedRules.rowGap.push(new Rule({
      source: clonedSource,
      selector: `.d-rg${stop}`,
      nodes: [
        declaration.clone({ prop: 'row-gap', value: `${tokenVar} !important` }),
      ],
    }));
    generatedRules.columnGap.push(new Rule({
      source: clonedSource,
      selector: `.d-cg${stop}`,
      nodes: [
        declaration.clone({ prop: 'column-gap', value: `${tokenVar} !important` }),
      ],
    }));
    generatedRules.gapEveryChild.push(new Rule({
      source: clonedSource,
      selector: `.d-g${stop} > *`,
      nodes: [
        declaration.clone({ prop: '--fl-gap', value: tokenVar }),
        declaration.clone({ prop: 'margin', value: 'unset' }),
      ],
    }));
    generatedRules.columnGapEveryChild.push(new Rule({
      source: clonedSource,
      selector: `.d-cg${stop} > *`,
      nodes: [
        declaration.clone({ prop: '--fl-gap', value: tokenVar }),
        declaration.clone({ prop: 'margin', value: 'unset' }),
      ],
    }));

    // TODO: Deprecated classes, remove on our next migration. https://dialpad.atlassian.net/browse/DLT-1763
    generatedRules.gridGap.push(new Rule({
      source: clonedSource,
      selector: `.d-gg${stop}`,
      nodes: [
        declaration.clone({ prop: 'grid-gap', value: `${tokenVar} !important` }),
      ],
    }));
    generatedRules.gridRowGap.push(new Rule({
      source: clonedSource,
      selector: `.d-grg${stop}`,
      nodes: [
        declaration.clone({ prop: 'grid-row-gap', value: `${tokenVar} !important` }),
      ],
    }));
    generatedRules.gridColumnGap.push(new Rule({
      source: clonedSource,
      selector: `.d-gcg${stop}`,
      nodes: [
        declaration.clone({ prop: 'grid-column-gap', value: `${tokenVar} !important` }),
      ],
    }));
  }

  // All gap values have exact spacing token matches (0-64px)
  Object.keys(GAP_SPACES_SPACING).forEach(stop => {
    const tokenVar = `var(--dt-spacing-${GAP_SPACES_SPACING[stop]})`;
    generateGapRules(stop, tokenVar);
  });
}

/**
 * Generate Layout utility classes (position: top, right, bottom, left, inset).
 * Uses three-tier token approach:
 * - Tier 1 (0-64px): Use --dt-spacing-* tokens
 * - Tier 2 (64px+ exact match): Use --dt-layout-* tokens
 * - Tier 3 (no exact match): Use --dt-size-* tokens (deprecated)
 * @param { Source } clonedSource
 * @param { Declaration } declaration
 */
function layoutUtilities (clonedSource, declaration) {
  // Helper to generate position rules for a given size and token
  function generatePositionRules (size, tokenVar) {
    generatedRules.positionTop.push(new Rule({
      source: clonedSource,
      selector: `.d-t${size}`,
      nodes: [
        declaration.clone({ prop: 'inset-block-start', value: `${tokenVar} !important` }),
      ],
    }));
    generatedRules.positionRight.push(new Rule({
      source: clonedSource,
      selector: `.d-r${size}`,
      nodes: [
        declaration.clone({ prop: 'inset-inline-end', value: `${tokenVar} !important` }),
      ],
    }));
    generatedRules.positionBottom.push(new Rule({
      source: clonedSource,
      selector: `.d-b${size}`,
      nodes: [
        declaration.clone({ prop: 'inset-block-end', value: `${tokenVar} !important` }),
      ],
    }));
    generatedRules.positionLeft.push(new Rule({
      source: clonedSource,
      selector: `.d-l${size}`,
      nodes: [
        declaration.clone({ prop: 'inset-inline-start', value: `${tokenVar} !important` }),
      ],
    }));
    generatedRules.positionVertical.push(new Rule({
      source: clonedSource,
      selector: `.d-y${size}`,
      nodes: [
        declaration.clone({ prop: 'inset-block', value: `${tokenVar} !important` }),
      ],
    }));
    generatedRules.positionHorizontal.push(new Rule({
      source: clonedSource,
      selector: `.d-x${size}`,
      nodes: [
        declaration.clone({ prop: 'inset-inline', value: `${tokenVar} !important` }),
      ],
    }));
    generatedRules.positionAll.push(new Rule({
      source: clonedSource,
      selector: `.d-all${size}`,
      nodes: [
        declaration.clone({ prop: 'inset', value: `${tokenVar} !important` }),
      ],
    }));
  }

  // Tier 1: Spacing tokens (0-64px) - exact matches
  Object.keys(POSITION_SIZES_SPACING).forEach(size => {
    const tokenVar = `var(--dt-spacing-${POSITION_SIZES_SPACING[size]})`;
    generatePositionRules(size, tokenVar);
  });

  // Tier 2: Layout tokens (64px+) - exact matches
  Object.keys(POSITION_SIZES_LAYOUT).forEach(size => {
    const tokenVar = `var(--dt-layout-${POSITION_SIZES_LAYOUT[size]})`;
    generatePositionRules(size, tokenVar);
  });

  // Tier 3: Size tokens - values without exact spacing/layout matches
  Object.keys(POSITION_SIZES_DEPRECATED).forEach(size => {
    const tokenVar = `var(--dt-size-${POSITION_SIZES_DEPRECATED[size]})`;
    generatePositionRules(size, tokenVar);
  });
}

/**
 * Generate Sizing utility classes using a three-tier token approach:
 * - Tier 1 (0-64px): Use --dt-spacing-* tokens (algorithmic)
 * - Tier 2 (64px+ with layout match): Use --dt-layout-* tokens (algorithmic)
 * - Tier 3 (64px+ without layout match): Use --dt-size-* tokens (legacy, deprecated)
 * @param { Source } clonedSource
 * @param { Declaration } declaration
 */
function sizingUtilities (clonedSource, declaration) {
  // Helper to generate all sizing rules for a given size and token
  function generateSizingRules (size, tokenVar) {
    generatedRules.fixedHeight.push(new Rule({
      source: clonedSource,
      selector: `.d-h${size}`,
      nodes: [
        declaration.clone({ prop: 'block-size', value: `${tokenVar} !important` }),
      ],
    }));
    generatedRules.minHeight.push(new Rule({
      source: clonedSource,
      selector: `.d-hmn${size}`,
      nodes: [
        declaration.clone({ prop: 'min-block-size', value: `${tokenVar} !important` }),
      ],
    }));
    generatedRules.maxHeight.push(new Rule({
      source: clonedSource,
      selector: `.d-hmx${size}`,
      nodes: [
        declaration.clone({ prop: 'max-block-size', value: `${tokenVar} !important` }),
      ],
    }));
    generatedRules.fixedWidth.push(new Rule({
      source: clonedSource,
      selector: `.d-w${size}`,
      nodes: [
        declaration.clone({ prop: 'inline-size', value: `${tokenVar} !important` }),
      ],
    }));
    generatedRules.minWidth.push(new Rule({
      source: clonedSource,
      selector: `.d-wmn${size}`,
      nodes: [
        declaration.clone({ prop: 'min-inline-size', value: `${tokenVar} !important` }),
      ],
    }));
    generatedRules.maxWidth.push(new Rule({
      source: clonedSource,
      selector: `.d-wmx${size}`,
      nodes: [
        declaration.clone({ prop: 'max-inline-size', value: `${tokenVar} !important` }),
      ],
    }));
  }

  // Tier 1: Small sizes (0-64px) with spacing tokens
  Object.keys(WIDTH_HEIGHTS_SPACING).forEach(size => {
    const tokenVar = `var(--dt-spacing-${WIDTH_HEIGHTS_SPACING[size]})`;
    generateSizingRules(size, tokenVar);
  });

  // Tier 2: Large sizes (64px+ with layout match) with layout tokens
  Object.keys(WIDTH_HEIGHTS_LAYOUT).forEach(size => {
    // Skip 64 - already covered by spacing (spacing-800 = 64px)
    if (size === '64') return;
    const tokenVar = `var(--dt-layout-${WIDTH_HEIGHTS_LAYOUT[size]})`;
    generateSizingRules(size, tokenVar);
  });

  // Tier 3: Deprecated sizes (no layout match) with old size tokens
  // These classes are kept for backwards compatibility but will be removed in v11
  Object.keys(WIDTH_HEIGHTS_DEPRECATED).forEach(size => {
    const tokenVar = `var(--dt-size-${WIDTH_HEIGHTS_DEPRECATED[size]})`;
    generateSizingRules(size, tokenVar);
  });
}

/**
 * Generate Margin utility classes.
 * @param { Source } clonedSource
 * @param { Declaration } declaration
 */
function marginUtilities (clonedSource, declaration) {
  // Helper to generate margin rules for a given size and token
  function generateMarginRules (size, tokenVar) {
    generatedRules.marginTop.push(new Rule({
      source: clonedSource,
      selector: `.d-mt${size}`,
      nodes: [
        declaration.clone({ prop: 'margin-block-start', value: `${tokenVar} !important` }),
      ],
    }));
    generatedRules.marginRight.push(new Rule({
      source: clonedSource,
      selector: `.d-mr${size}`,
      nodes: [
        declaration.clone({ prop: 'margin-inline-end', value: `${tokenVar} !important` }),
      ],
    }));
    generatedRules.marginBottom.push(new Rule({
      source: clonedSource,
      selector: `.d-mb${size}`,
      nodes: [
        declaration.clone({ prop: 'margin-block-end', value: `${tokenVar} !important` }),
      ],
    }));
    generatedRules.marginLeft.push(new Rule({
      source: clonedSource,
      selector: `.d-ml${size}`,
      nodes: [
        declaration.clone({ prop: 'margin-inline-start', value: `${tokenVar} !important` }),
      ],
    }));
    generatedRules.marginHorizontal.push(new Rule({
      source: clonedSource,
      selector: `.d-mx${size}`,
      nodes: [
        declaration.clone({ prop: 'margin-inline', value: `${tokenVar} !important` }),
      ],
    }));
    generatedRules.marginVertical.push(new Rule({
      source: clonedSource,
      selector: `.d-my${size}`,
      nodes: [
        declaration.clone({ prop: 'margin-block', value: `${tokenVar} !important` }),
      ],
    }));
    generatedRules.marginAll.push(new Rule({
      source: clonedSource,
      selector: `.d-m${size}`,
      nodes: [
        declaration.clone({ prop: 'margin', value: `${tokenVar} !important` }),
      ],
    }));
  }

  // Tier 1: Spacing tokens (0-64px) - exact matches
  Object.keys(MARGIN_SIZES_SPACING).forEach(size => {
    const tokenVar = `var(--dt-spacing-${MARGIN_SIZES_SPACING[size]})`;
    generateMarginRules(size, tokenVar);
  });

  // Tier 2: Layout tokens (64px+) - exact matches
  Object.keys(MARGIN_SIZES_LAYOUT).forEach(size => {
    const tokenVar = `var(--dt-layout-${MARGIN_SIZES_LAYOUT[size]})`;
    generateMarginRules(size, tokenVar);
  });
}

/**
 * Generate Padding utility classes.
 * @param { Source } clonedSource
 * @param { Declaration } declaration
 */
function paddingUtilities (clonedSource, declaration) {
  // Helper to generate padding rules for a given size and token
  function generatePaddingRules (size, tokenVar) {
    generatedRules.paddingTop.push(new Rule({
      source: clonedSource,
      selector: `.d-pt${size}`,
      nodes: [
        declaration.clone({ prop: 'padding-block-start', value: `${tokenVar} !important` }),
      ],
    }));
    generatedRules.paddingRight.push(new Rule({
      source: clonedSource,
      selector: `.d-pr${size}`,
      nodes: [
        declaration.clone({ prop: 'padding-inline-end', value: `${tokenVar} !important` }),
      ],
    }));
    generatedRules.paddingBottom.push(new Rule({
      source: clonedSource,
      selector: `.d-pb${size}`,
      nodes: [
        declaration.clone({ prop: 'padding-block-end', value: `${tokenVar} !important` }),
      ],
    }));
    generatedRules.paddingLeft.push(new Rule({
      source: clonedSource,
      selector: `.d-pl${size}`,
      nodes: [
        declaration.clone({ prop: 'padding-inline-start', value: `${tokenVar} !important` }),
      ],
    }));
    generatedRules.paddingHorizontal.push(new Rule({
      source: clonedSource,
      selector: `.d-px${size}`,
      nodes: [
        declaration.clone({ prop: 'padding-inline', value: `${tokenVar} !important` }),
      ],
    }));
    generatedRules.paddingVertical.push(new Rule({
      source: clonedSource,
      selector: `.d-py${size}`,
      nodes: [
        declaration.clone({ prop: 'padding-block', value: `${tokenVar} !important` }),
      ],
    }));
    generatedRules.paddingAll.push(new Rule({
      source: clonedSource,
      selector: `.d-p${size}`,
      nodes: [
        declaration.clone({ prop: 'padding', value: `${tokenVar} !important` }),
      ],
    }));
  }

  // Tier 1: Spacing tokens (0-64px) - exact matches
  Object.keys(PADDING_SIZES_SPACING).forEach(size => {
    const tokenVar = `var(--dt-spacing-${PADDING_SIZES_SPACING[size]})`;
    generatePaddingRules(size, tokenVar);
  });

  // Tier 2: Layout tokens (64px+) - exact matches
  Object.keys(PADDING_SIZES_LAYOUT).forEach(size => {
    const tokenVar = `var(--dt-layout-${PADDING_SIZES_LAYOUT[size]})`;
    generatePaddingRules(size, tokenVar);
  });
}

/**
 *
 * @param { Source } clonedSource
 * @param { Declaration } declaration
 * @private
 */
function _generateUtilities (clonedSource, declaration) {
  colorUtilities(clonedSource, declaration);
  opacityUtilities(clonedSource, declaration);
  flexColumnsUtilities(clonedSource, declaration);
  borderUtilities(clonedSource, declaration);
  gridUtilities(clonedSource, declaration);
  gapUtilities(clonedSource, declaration);
  layoutUtilities(clonedSource, declaration);
  sizingUtilities(clonedSource, declaration);
  marginUtilities(clonedSource, declaration);
  paddingUtilities(clonedSource, declaration);
}

//        Selector variations         //

/**
 * Generate :hover, :focus, :focus-within and :focus-visible selectors
 * and modifies the rule selector for provided utility classes.
 * @param { Rule } rule
 * @private
 */
function _generateHoverFocusVariations (rule) {
  const backgroundGradientRegex = new RegExp(`\\.d-bgg-(${REGEX_OPTIONS.BACKGROUND_GRADIENTS})`);
  const fontColorRegex = /\.d-fc-(current|transparent|unset)/;
  const backgroundColorRegex = /\.d-bgc-(transparent|unset)/;
  const borderColorRegex = /\.d-bc-(current|transparent|unset)/;
  const boxShadowRegex = new RegExp(`\\.d-bs-(${REGEX_OPTIONS.BOX_SHADOWS})`);
  const textDecorationRegex = new RegExp(`\\.d-td-(${REGEX_OPTIONS.TEXT_DECORATION})`);
  const opacityRegex = new RegExp(`\\.d-o(${REGEX_OPTIONS.OPACITY_VARIATIONS})`);
  const found = [
    backgroundGradientRegex,
    fontColorRegex,
    backgroundColorRegex,
    borderColorRegex,
    boxShadowRegex,
    textDecorationRegex,
    opacityRegex,
  ].some(regex => regex.test(rule.selector));

  if (
    !found ||
    rule.selectors.some(selector => REGEX_OPTIONS.HOVER_FOCUS_PREFIXES.test(selector))
  ) return;

  const selectors = rule.selectors.map(selector => appendHoverFocusSelectors(selector));
  rule.selector = selectors.filter(selector => !!selector).join(', ');
}

/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = () => {
  return {
    postcssPlugin: 'postcss-dialtone-generators',
    Once (root) {
      const rootSelector = root.last.prev().prev();
      const clonedSource = rootSelector.source;
      const declaration = rootSelector.first;

      _generateUtilities(clonedSource, declaration);

      const rules = Object.values(generatedRules).flat();

      root.insertAfter(rootSelector, rules);
    },
    Root (root) {
      root.walkRules(rule => {
        _generateHoverFocusVariations(rule);
      });
    },
  };
};

module.exports.postcss = true;
