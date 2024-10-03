/* eslint-disable max-lines */
/* eslint-disable max-len */

const TokensBaseLight = require('@dialpad/dialtone-tokens/dist/tokens-base-light.json');
const TokensDpLight = require('@dialpad/dialtone-tokens/dist/tokens-dp-light.json');

const { Rule } = require('postcss');

// TODO: Move these constants to the _data directory
const {
  BORDER_RADIUS_SIZES,
  FLEX_COLUMNS,
  LAYOUT_SIZES,
  OPACITIES,
  REGEX_OPTIONS,
  MARGIN_SIZES,
  PADDING_SIZES,
  GAP_SPACES,
  WIDTH_HEIGHTS,
} = require('./constants.cjs');
const {
  appendHoverFocusSelectors,
  processColors,
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
  const baseColorsRegex = new RegExp(`(dtColor(Neutral)?(${REGEX_OPTIONS.COLORS})([0-9]{3})?)`);
  const foregroundColorsRegex = new RegExp(`(dtColorForeground(${REGEX_OPTIONS.FONT_COLORS})(${REGEX_OPTIONS.FONT_COLOR_VARIATIONS})?)`, 'i');
  const surfaceColorsRegex = new RegExp(`(dtColorSurface(${REGEX_OPTIONS.BACKGROUND_COLORS})(${REGEX_OPTIONS.BACKGROUND_COLOR_VARIATIONS})?)`, 'i');
  const borderColorsRegex = new RegExp(`(dtColorBorder(${REGEX_OPTIONS.BORDER_COLORS})(${REGEX_OPTIONS.BORDER_COLOR_VARIATIONS})?)`, 'i');

  const tokens = { ...TokensBaseLight, ...TokensDpLight };

  const baseColors = Object.entries(tokens).filter(([key]) => baseColorsRegex.test(key)).reduce(processColors, []);
  const foregroundColors = Object.entries(tokens).filter(([key]) => foregroundColorsRegex.test(key)).reduce(processColors, []);
  const surfaceColors = Object.entries(tokens).filter(([key]) => surfaceColorsRegex.test(key)).reduce(processColors, []);
  const borderColors = Object.entries(tokens).filter(([key]) => borderColorsRegex.test(key)).reduce(processColors, []);

  function _generateForegroundColors (token, colorName) {
    generatedRules.fontColor.push(new Rule({
      source: clonedSource,
      selector: appendHoverFocusSelectors(`.d-fc-${colorName}`),
      nodes: [
        declaration.clone({ prop: '--fco', value: `var(${token}-a)` }),
        declaration.clone({ prop: 'color', value: `hsl(var(${token}-h) var(${token}-s) var(${token}-l) / var(--fco)) !important` }),
      ],
    }));
  }
  function _generateSurfaceColors (token, colorName) {
    generatedRules.backgroundColor.push(new Rule({
      source: clonedSource,
      selector: appendHoverFocusSelectors(`.d-bgc-${colorName}`),
      nodes: [
        declaration.clone({ prop: '--bgo', value: `var(${token}-a)` }),
        declaration.clone({
          prop: 'background-color',
          value: `hsl(var(${token}-h) var(${token}-s) var(${token}-l) / var(--bgo)) !important`,
        }),
      ],
    }));
  }
  function _generateBorderColors (token, colorName) {
    generatedRules.borderColor.push(new Rule({
      source: clonedSource,
      selector: appendHoverFocusSelectors(`.d-bc-${colorName}`),
      nodes: [
        declaration.clone({ prop: '--bco', value: `var(${token}-a)` }),
        declaration.clone({
          prop: 'border-color',
          value: `hsl(var(${token}-h) var(${token}-s) var(${token}-l) / var(--bco)) !important`,
        }),
      ],
    }));
  }

  baseColors.forEach(({ token, colorName }) => {
    _generateForegroundColors(token, colorName);
    _generateBorderColors(token, colorName);
    _generateSurfaceColors(token, colorName);
    generatedRules.dividerColor.push(new Rule({
      source: clonedSource,
      selector: `.d-divide-${colorName} > * + *`,
      nodes: [
        declaration.clone({ prop: '--dco', value: `var(${token}-a)` }),
        declaration.clone({
          prop: 'border-color',
          value: `hsl(var(${token}-h) var(${token}-s) var(${token}-l) / var(--dco)) !important`,
        }),
      ],
    }));
    generatedRules.backgroundGradientFromColor.push(new Rule({
      source: clonedSource,
      selector: appendHoverFocusSelectors(`.d-bgg-from-${colorName}`),
      nodes: [
        declaration.clone({ prop: '--bgg-from-opacity', value: '100%' }),
        declaration.clone({
          prop: '--bgg-from',
          value: `hsl(var(${token}-h) var(${token}-s) var(${token}-l) / var(--bgg-from-opacity))`,
        }),
        declaration.clone({
          prop: '--bgg-to',
          value: `hsl(var(${token}-h) var(${token}-s) var(${token}-l) / 0%)`,
        }),
      ],
    }));
    generatedRules.backgroundGradientToColor.push(new Rule({
      source: clonedSource,
      selector: appendHoverFocusSelectors(`.d-bgg-to-${colorName}`),
      nodes: [
        declaration.clone({ prop: '--bgg-to-opacity', value: '100%' }),
        declaration.clone({ prop: '--bgg-to', value: `hsl(var(${token}-h) var(${token}-s) var(${token}-l) / var(--bgg-to-opacity)) !important` }),
      ],
    }));
  });
  foregroundColors.forEach(({ token, colorName }) => {
    _generateForegroundColors(token, colorName);
  });
  surfaceColors.forEach(({ token, colorName }) => {
    _generateSurfaceColors(token, colorName);
  });
  borderColors.forEach(({ token, colorName }) => {
    _generateBorderColors(token, colorName);
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
        declaration.clone({ prop: '--fl-gap', value: 'var(--dt-space-0)' }),
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
        declaration.clone({ prop: 'margin-top', value: 'var(--dt-space-0)' }),
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
          declaration.clone({ prop: 'border-top-left-radius', value: `var(--dt-size-${BORDER_RADIUS_SIZES[size]}) !important` }),
          declaration.clone({ prop: 'border-top-right-radius', value: `var(--dt-size-${BORDER_RADIUS_SIZES[size]}) !important` }),
        ],
      }));
      generatedRules.borderRightRadius.push(new Rule({
        source: clonedSource,
        selector: `.d-brr${size}`,
        nodes: [
          declaration.clone({ prop: 'border-top-right-radius', value: `var(--dt-size-${BORDER_RADIUS_SIZES[size]}) !important` }),
          declaration.clone({ prop: 'border-bottom-right-radius', value: `var(--dt-size-${BORDER_RADIUS_SIZES[size]}) !important` }),
        ],
      }));
      generatedRules.borderBottomRadius.push(new Rule({
        source: clonedSource,
        selector: `.d-bbr${size}`,
        nodes: [
          declaration.clone({ prop: 'border-bottom-left-radius', value: `var(--dt-size-${BORDER_RADIUS_SIZES[size]}) !important` }),
          declaration.clone({ prop: 'border-bottom-right-radius', value: `var(--dt-size-${BORDER_RADIUS_SIZES[size]}) !important` }),
        ],
      }));
      generatedRules.borderLeftRadius.push(new Rule({
        source: clonedSource,
        selector: `.d-blr${size}`,
        nodes: [
          declaration.clone({ prop: 'border-top-left-radius', value: `var(--dt-size-${BORDER_RADIUS_SIZES[size]}) !important` }),
          declaration.clone({ prop: 'border-bottom-left-radius', value: `var(--dt-size-${BORDER_RADIUS_SIZES[size]}) !important` }),
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
  Object.keys(GAP_SPACES)
    .forEach(stop => {
      generatedRules.gap.push(new Rule({
        source: clonedSource,
        selector: `.d-g${stop}`,
        nodes: [
          declaration.clone({ prop: 'gap', value: `var(--dt-space-${GAP_SPACES[stop]}) !important` }),
        ],
      }));
      generatedRules.rowGap.push(new Rule({
        source: clonedSource,
        selector: `.d-rg${stop}`,
        nodes: [
          declaration.clone({ prop: 'row-gap', value: `var(--dt-space-${GAP_SPACES[stop]}) !important` }),
        ],
      }));
      generatedRules.columnGap.push(new Rule({
        source: clonedSource,
        selector: `.d-cg${stop}`,
        nodes: [
          declaration.clone({ prop: 'column-gap', value: `var(--dt-space-${GAP_SPACES[stop]}) !important` }),
        ],
      }));
      generatedRules.gapEveryChild.push(new Rule({
        source: clonedSource,
        selector: `.d-g${stop} > *`,
        nodes: [
          declaration.clone({ prop: '--fl-gap', value: `var(--dt-space-${GAP_SPACES[stop]})` }),
          declaration.clone({ prop: 'margin', value: 'unset' }),
        ],
      }));
      generatedRules.columnGapEveryChild.push(new Rule({
        source: clonedSource,
        selector: `.d-cg${stop} > *`,
        nodes: [
          declaration.clone({ prop: '--fl-gap', value: `var(--dt-space-${GAP_SPACES[stop]})` }),
          declaration.clone({ prop: 'margin', value: 'unset' }),
        ],
      }));

      // TODO: Deprecated classes, remove on our next migration. https://dialpad.atlassian.net/browse/DLT-1763
      generatedRules.gridGap.push(new Rule({
        source: clonedSource,
        selector: `.d-gg${stop}`,
        nodes: [
          declaration.clone({ prop: 'grid-gap', value: `var(--dt-space-${GAP_SPACES[stop]}) !important` }),
        ],
      }));
      generatedRules.gridRowGap.push(new Rule({
        source: clonedSource,
        selector: `.d-grg${stop}`,
        nodes: [
          declaration.clone({ prop: 'grid-row-gap', value: `var(--dt-space-${GAP_SPACES[stop]}) !important` }),
        ],
      }));
      generatedRules.gridColumnGap.push(new Rule({
        source: clonedSource,
        selector: `.d-gcg${stop}`,
        nodes: [
          declaration.clone({ prop: 'grid-column-gap', value: `var(--dt-space-${GAP_SPACES[stop]}) !important` }),
        ],
      }));
    });
}

/**
 * Generate Layout utility classes.
 * @param { Source } clonedSource
 * @param { Declaration } declaration
 */
function layoutUtilities (clonedSource, declaration) {
  Object.keys(LAYOUT_SIZES)
    .forEach(size => {
      generatedRules.positionTop.push(new Rule({
        source: clonedSource,
        selector: `.d-t${size}`,
        nodes: [
          declaration.clone({ prop: 'top', value: `var(--dt-space-${LAYOUT_SIZES[size]}) !important` }),
        ],
      }));
      generatedRules.positionRight.push(new Rule({
        source: clonedSource,
        selector: `.d-r${size}`,
        nodes: [
          declaration.clone({ prop: 'right', value: `var(--dt-space-${LAYOUT_SIZES[size]}) !important` }),
        ],
      }));
      generatedRules.positionBottom.push(new Rule({
        source: clonedSource,
        selector: `.d-b${size}`,
        nodes: [
          declaration.clone({ prop: 'bottom', value: `var(--dt-space-${LAYOUT_SIZES[size]}) !important` }),
        ],
      }));
      generatedRules.positionLeft.push(new Rule({
        source: clonedSource,
        selector: `.d-l${size}`,
        nodes: [
          declaration.clone({ prop: 'left', value: `var(--dt-space-${LAYOUT_SIZES[size]}) !important` }),
        ],
      }));
      generatedRules.positionVertical.push(new Rule({
        source: clonedSource,
        selector: `.d-y${size}`,
        nodes: [
          declaration.clone({ prop: 'top', value: `var(--dt-space-${LAYOUT_SIZES[size]}) !important` }),
          declaration.clone({ prop: 'bottom', value: `var(--dt-space-${LAYOUT_SIZES[size]}) !important` }),
        ],
      }));
      generatedRules.positionHorizontal.push(new Rule({
        source: clonedSource,
        selector: `.d-x${size}`,
        nodes: [
          declaration.clone({ prop: 'right', value: `var(--dt-space-${LAYOUT_SIZES[size]}) !important` }),
          declaration.clone({ prop: 'left', value: `var(--dt-space-${LAYOUT_SIZES[size]}) !important` }),
        ],
      }));
      generatedRules.positionAll.push(new Rule({
        source: clonedSource,
        selector: `.d-all${size}`,
        nodes: [
          declaration.clone({ prop: 'top', value: `var(--dt-space-${LAYOUT_SIZES[size]}) !important` }),
          declaration.clone({ prop: 'right', value: `var(--dt-space-${LAYOUT_SIZES[size]}) !important` }),
          declaration.clone({ prop: 'bottom', value: `var(--dt-space-${LAYOUT_SIZES[size]}) !important` }),
          declaration.clone({ prop: 'left', value: `var(--dt-space-${LAYOUT_SIZES[size]}) !important` }),
        ],
      }));
    });
}

/**
 * Generate Sizing utility classes.
 * @param { Source } clonedSource
 * @param { Declaration } declaration
 */
function sizingUtilities (clonedSource, declaration) {
  Object.keys(WIDTH_HEIGHTS)
    .forEach(size => {
      generatedRules.fixedHeight.push(new Rule({
        source: clonedSource,
        selector: `.d-h${size}`,
        nodes: [
          declaration.clone({ prop: 'height', value: `var(--dt-size-${WIDTH_HEIGHTS[size]}) !important` }),
        ],
      }));
      generatedRules.minHeight.push(new Rule({
        source: clonedSource,
        selector: `.d-hmn${size}`,
        nodes: [
          declaration.clone({ prop: 'min-height', value: `var(--dt-size-${WIDTH_HEIGHTS[size]}) !important` }),
        ],
      }));
      generatedRules.maxHeight.push(new Rule({
        source: clonedSource,
        selector: `.d-hmx${size}`,
        nodes: [
          declaration.clone({ prop: 'max-height', value: `var(--dt-size-${WIDTH_HEIGHTS[size]}) !important` }),
        ],
      }));
      generatedRules.fixedWidth.push(new Rule({
        source: clonedSource,
        selector: `.d-w${size}`,
        nodes: [
          declaration.clone({ prop: 'width', value: `var(--dt-size-${WIDTH_HEIGHTS[size]}) !important` }),
        ],
      }));
      generatedRules.minWidth.push(new Rule({
        source: clonedSource,
        selector: `.d-wmn${size}`,
        nodes: [
          declaration.clone({ prop: 'min-width', value: `var(--dt-size-${WIDTH_HEIGHTS[size]}) !important` }),
        ],
      }));
      generatedRules.maxWidth.push(new Rule({
        source: clonedSource,
        selector: `.d-wmx${size}`,
        nodes: [
          declaration.clone({ prop: 'max-width', value: `var(--dt-size-${WIDTH_HEIGHTS[size]}) !important` }),
        ],
      }));
    });
}

/**
 * Generate Margin utility classes.
 * @param { Source } clonedSource
 * @param { Declaration } declaration
 */
function marginUtilities (clonedSource, declaration) {
  Object.keys(MARGIN_SIZES).forEach(size => {
    generatedRules.marginTop.push(new Rule({
      source: clonedSource,
      selector: `.d-mt${size}`,
      nodes: [
        declaration.clone({ prop: 'margin-top', value: `var(--dt-space-${MARGIN_SIZES[size]}) !important` }),
      ],
    }));
    generatedRules.marginRight.push(new Rule({
      source: clonedSource,
      selector: `.d-mr${size}`,
      nodes: [
        declaration.clone({ prop: 'margin-right', value: `var(--dt-space-${MARGIN_SIZES[size]}) !important` }),
      ],
    }));
    generatedRules.marginBottom.push(new Rule({
      source: clonedSource,
      selector: `.d-mb${size}`,
      nodes: [
        declaration.clone({ prop: 'margin-bottom', value: `var(--dt-space-${MARGIN_SIZES[size]}) !important` }),
      ],
    }));
    generatedRules.marginLeft.push(new Rule({
      source: clonedSource,
      selector: `.d-ml${size}`,
      nodes: [
        declaration.clone({ prop: 'margin-left', value: `var(--dt-space-${MARGIN_SIZES[size]}) !important` }),
      ],
    }));
    generatedRules.marginHorizontal.push(new Rule({
      source: clonedSource,
      selector: `.d-mx${size}`,
      nodes: [
        declaration.clone({ prop: 'margin-left', value: `var(--dt-space-${MARGIN_SIZES[size]}) !important` }),
        declaration.clone({ prop: 'margin-right', value: `var(--dt-space-${MARGIN_SIZES[size]}) !important` }),
      ],
    }));
    generatedRules.marginVertical.push(new Rule({
      source: clonedSource,
      selector: `.d-my${size}`,
      nodes: [
        declaration.clone({ prop: 'margin-top', value: `var(--dt-space-${MARGIN_SIZES[size]}) !important` }),
        declaration.clone({ prop: 'margin-bottom', value: `var(--dt-space-${MARGIN_SIZES[size]}) !important` }),
      ],
    }));
    generatedRules.marginAll.push(new Rule({
      source: clonedSource,
      selector: `.d-m${size}`,
      nodes: [
        declaration.clone({ prop: 'margin', value: `var(--dt-space-${MARGIN_SIZES[size]}) !important` }),
      ],
    }));
  });
}

/**
 * Generate Padding utility classes.
 * @param { Source } clonedSource
 * @param { Declaration } declaration
 */
function paddingUtilities (clonedSource, declaration) {
  Object.keys(PADDING_SIZES)
    .forEach(size => {
      generatedRules.paddingTop.push(new Rule({
        source: clonedSource,
        selector: `.d-pt${size}`,
        nodes: [
          declaration.clone({ prop: 'padding-top', value: `var(--dt-space-${PADDING_SIZES[size]}) !important` }),
        ],
      }));
      generatedRules.paddingRight.push(new Rule({
        source: clonedSource,
        selector: `.d-pr${size}`,
        nodes: [
          declaration.clone({ prop: 'padding-right', value: `var(--dt-space-${PADDING_SIZES[size]}) !important` }),
        ],
      }));
      generatedRules.paddingBottom.push(new Rule({
        source: clonedSource,
        selector: `.d-pb${size}`,
        nodes: [
          declaration.clone({ prop: 'padding-bottom', value: `var(--dt-space-${PADDING_SIZES[size]}) !important` }),
        ],
      }));
      generatedRules.paddingLeft.push(new Rule({
        source: clonedSource,
        selector: `.d-pl${size}`,
        nodes: [
          declaration.clone({ prop: 'padding-left', value: `var(--dt-space-${PADDING_SIZES[size]}) !important` }),
        ],
      }));
      generatedRules.paddingHorizontal.push(new Rule({
        source: clonedSource,
        selector: `.d-px${size}`,
        nodes: [
          declaration.clone({ prop: 'padding-left', value: `var(--dt-space-${PADDING_SIZES[size]}) !important` }),
          declaration.clone({ prop: 'padding-right', value: `var(--dt-space-${PADDING_SIZES[size]}) !important` }),
        ],
      }));
      generatedRules.paddingVertical.push(new Rule({
        source: clonedSource,
        selector: `.d-py${size}`,
        nodes: [
          declaration.clone({ prop: 'padding-top', value: `var(--dt-space-${PADDING_SIZES[size]}) !important` }),
          declaration.clone({ prop: 'padding-bottom', value: `var(--dt-space-${PADDING_SIZES[size]}) !important` }),
        ],
      }));
      generatedRules.paddingAll.push(new Rule({
        source: clonedSource,
        selector: `.d-p${size}`,
        nodes: [
          declaration.clone({ prop: 'padding', value: `var(--dt-space-${PADDING_SIZES[size]}) !important` }),
        ],
      }));
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
  if (!found) return;
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

      root.insertAfter(rootSelector, Object.values(generatedRules).flat());
    },
    Root (root) {
      root.walkRules(rule => {
        _generateHoverFocusVariations(rule);
      });
    },
  };
};

module.exports.postcss = true;
