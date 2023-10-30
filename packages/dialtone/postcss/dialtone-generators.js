/* eslint-disable max-lines */
/* eslint-disable max-len */

// eslint-disable-next-line no-unused-vars
const { Rule, Declaration, Source } = require('postcss');

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
  PLATFORM_FONT_SIZES, Z_INDEX,
} = require('./constants');
const {
  extractColors,
  appendHoverFocusSelectors,
  extractShadows,
  extractTypographies,
  removePrefixFromColor,
} = require('./helpers');
const tinycolor = require('tinycolor2');
const bodyCSSVariables = [];
const lightCSSVariables = [];
const darkCSSVariables = [];
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
 * @param { Rule } Rule
 * @param { Source } clonedSource
 * @param { Declaration } declaration
 */
function colorUtilities (Rule, clonedSource, declaration) {
  const dialtoneColors = extractColors(false);
  dialtoneColors.light.forEach(({ colorName: color }) => {
    const hslaColor = `hsla(var(${color}-h) var(${color}-s) var(${color}-l)`;
    const colorNoPrefix = removePrefixFromColor(color);
    generatedRules.fontColor.push(new Rule({
      source: clonedSource,
      selector: appendHoverFocusSelectors(`.d-fc-${colorNoPrefix}.d-fc-${colorNoPrefix}`),
      nodes: [
        declaration.clone({ prop: '--fco', value: '100%' }),
        declaration.clone({ prop: 'color', value: `${hslaColor} / var(--fco)) !important` }),
      ],
    }));
    generatedRules.borderColor.push(new Rule({
      source: clonedSource,
      selector: appendHoverFocusSelectors(`.d-bc-${colorNoPrefix}.d-bc-${colorNoPrefix}`),
      nodes: [
        declaration.clone({ prop: '--bco', value: '100%' }),
        declaration.clone({ prop: 'border-color', value: `${hslaColor} / var(--bco)) !important` }),
      ],
    }));
    generatedRules.backgroundColor.push(new Rule({
      source: clonedSource,
      selector: appendHoverFocusSelectors(`.d-bgc-${colorNoPrefix}.d-bgc-${colorNoPrefix}`),
      nodes: [
        declaration.clone({ prop: '--bgo', value: '100%' }),
        declaration.clone({ prop: 'background-color', value: `${hslaColor} / var(--bgo)) !important` }),
      ],
    }));
    generatedRules.dividerColor.push(new Rule({
      source: clonedSource,
      selector: `.d-divide-${colorNoPrefix}.d-divide-${colorNoPrefix} > * + *`,
      nodes: [
        declaration.clone({ prop: '--dco', value: '100%' }),
        declaration.clone({ prop: 'border-color', value: `${hslaColor} / var(--dco)) !important` }),
      ],
    }));
    generatedRules.backgroundGradientFromColor.push(new Rule({
      source: clonedSource,
      selector: appendHoverFocusSelectors(`.d-bgg-from-${colorNoPrefix}.d-bgg-from-${colorNoPrefix}`),
      nodes: [
        declaration.clone({ prop: '--bgg-from-opacity', value: '100%' }),
        declaration.clone({ prop: '--bgg-from', value: `${hslaColor} / var(--bgg-from-opacity))` }),
        declaration.clone({ prop: '--bgg-to', value: `${hslaColor} / 0%)` }),
      ],
    }));
    generatedRules.backgroundGradientToColor.push(new Rule({
      source: clonedSource,
      selector: appendHoverFocusSelectors(`.d-bgg-to-${colorNoPrefix}.d-bgg-to-${colorNoPrefix}`),
      nodes: [
        declaration.clone({ prop: '--bgg-to-opacity', value: '100%' }),
        declaration.clone({ prop: '--bgg-to', value: `${hslaColor} / var(--bgg-to-opacity)) !important` }),
      ],
    }));
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
 * @param { Rule } Rule
 * @param { Source } clonedSource
 * @param { Declaration } declaration
 */
function opacityUtilities (Rule, clonedSource, declaration) {
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
      selector: appendHoverFocusSelectors(`.d-bco-${opacity}`),
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
 * @param { Rule } Rule
 * @param { Source } clonedSource
 * @param { Declaration } declaration
 */
function flexColumnsUtilities (Rule, clonedSource, declaration) {
  for (let i = 1; i <= FLEX_COLUMNS; i++) {
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
        declaration.clone({ prop: '--fl-gap', value: 0 }),
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
        declaration.clone({ prop: 'margin-top', value: 0 }),
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
 * @param { Rule } Rule
 * @param { Source } clonedSource
 * @param { Declaration } declaration
 */
function borderUtilities (Rule, clonedSource, declaration) {
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
 * @param { Rule } Rule
 * @param { Source } clonedSource
 * @param { Declaration } declaration
 */
function gridUtilities (Rule, clonedSource, declaration) {
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
 * Generate Grid gap utility classes.
 * @param { Rule } Rule
 * @param { Source } clonedSource
 * @param { Declaration } declaration
 */
function gapUtilities (Rule, clonedSource, declaration) {
  Object.keys(GAP_SPACES)
    .forEach(stop => {
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
 * @param { Rule } Rule
 * @param { Source } clonedSource
 * @param { Declaration } declaration
 */
function layoutUtilities (Rule, clonedSource, declaration) {
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
 * @param { Rule } Rule
 * @param { Source } clonedSource
 * @param { Declaration } declaration
 */
function sizingUtilities (Rule, clonedSource, declaration) {
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
 * @param { Rule } Rule
 * @param { Source } clonedSource
 * @param { Declaration } declaration
 */
function marginUtilities (Rule, clonedSource, declaration) {
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
 * @param { Rule } Rule
 * @param { Source } clonedSource
 * @param { Declaration } declaration
 */
function paddingUtilities (Rule, clonedSource, declaration) {
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
 * @param { Rule } rule
 * @param { Source } clonedSource
 * @param { Declaration } declaration
 * @private
 */
function _generateUtilities (rule, clonedSource, declaration) {
  colorUtilities(rule, clonedSource, declaration);
  opacityUtilities(rule, clonedSource, declaration);
  flexColumnsUtilities(rule, clonedSource, declaration);
  borderUtilities(rule, clonedSource, declaration);
  gridUtilities(rule, clonedSource, declaration);
  gapUtilities(rule, clonedSource, declaration);
  layoutUtilities(rule, clonedSource, declaration);
  sizingUtilities(rule, clonedSource, declaration);
  marginUtilities(rule, clonedSource, declaration);
  paddingUtilities(rule, clonedSource, declaration);
}

//        Variables generation        //

/**
 * Generate HSL CSS Variables.
 * @param { Declaration } declaration
 */
function colorVariables (declaration) {
  const dialtoneColors = extractColors();
  dialtoneColors.light.forEach(({ colorName, hexValue }) => {
    const color = tinycolor(hexValue);
    const { h: hue, s: saturation, l: lightness } = color.toHsl();
    lightCSSVariables.push([
      declaration.clone({ prop: `${colorName}-h`, value: `${hue}` }),
      declaration.clone({ prop: `${colorName}-s`, value: `${saturation * 100}%` }),
      declaration.clone({ prop: `${colorName}-l`, value: `${lightness * 100}%` }),
      declaration.clone({ prop: `${colorName}-hsl`, value: `var(${colorName}-h) var(${colorName}-s) var(${colorName}-l)` }),
      declaration.clone({ prop: `${colorName}-hsla`, value: `hsla(var(${colorName}-h) var(${colorName}-s) var(${colorName}-l) / var(--alpha, 100%))` }),
    ]);
  });
  lightCSSVariables.push({ prop: 'color-scheme', value: 'light' });
  dialtoneColors.dark.forEach(({ colorName, hexValue }) => {
    const color = tinycolor(hexValue);
    const { h: hue, s: saturation, l: lightness } = color.toHsl();
    darkCSSVariables.push([
      declaration.clone({ prop: `${colorName}-h`, value: `${hue}` }),
      declaration.clone({ prop: `${colorName}-s`, value: `${saturation * 100}%` }),
      declaration.clone({ prop: `${colorName}-l`, value: `${lightness * 100}%` }),
      declaration.clone({ prop: `${colorName}-hsl`, value: `var(${colorName}-h) var(${colorName}-s) var(${colorName}-l)` }),
      declaration.clone({ prop: `${colorName}-hsla`, value: `hsla(var(${colorName}-h) var(${colorName}-s) var(${colorName}-l) / var(--alpha, 100%))` }),
    ]);
  });
  darkCSSVariables.push({ prop: 'color-scheme', value: 'dark' });
}

/**
 * Generates font sizes for specific platforms
 * TV, TC8 and Mobile
 * @param { Declaration } declaration
 */
function platformSpecificFontSizes (declaration) {
  Object.keys(PLATFORM_FONT_SIZES).forEach(stop => {
    const fontSizeVar = `--dt-font-size-${stop}`;
    bodyCSSVariables.push([
      declaration.clone({ prop: fontSizeVar, value: PLATFORM_FONT_SIZES[stop] }),
    ]);
  });
}

/**
 * Generate z-index Variables.
 * @param { Declaration } declaration
 */
function layoutVariables (declaration) {
  Object.keys(Z_INDEX).forEach(name => {
    const zIndexVar = `--zi-${name}`;
    bodyCSSVariables.push([
      declaration.clone({ prop: zIndexVar, value: Z_INDEX[name] }),
    ]);
  });
}

/**
 *
 * @param { Declaration } declaration
 * @private
 */
function _generateVariables (declaration) {
  colorVariables(declaration);
  platformSpecificFontSizes(declaration);
  layoutVariables(declaration);
}

//        Composition tokens          //

/**
 * Compose box shadow tokens
 * @param { Declaration } declaration
 * @param { string } [mode=light]
 */
function boxShadows (declaration, mode = 'light') {
  const dialtoneShadows = extractShadows(mode);

  Object
    .keys(dialtoneShadows)
    .forEach(shadowName => {
      const shadowVar = `--dt-shadow-${shadowName}`;
      const times = dialtoneShadows[shadowName];
      const value = Array(times)
        .fill(undefined)
        .map((val, i) => {
          const shadowNumber = i + 1;
          return `var(${shadowVar}-${shadowNumber}-x) var(${shadowVar}-${shadowNumber}-y) var(${shadowVar}-${shadowNumber}-blur) var(${shadowVar}-${shadowNumber}-spread) var(${shadowVar}-${shadowNumber}-color)`;
        }).join(', ');

      if (mode === 'light') {
        lightCSSVariables.push([
          declaration.clone({ prop: shadowVar, value }),
        ]);
      } else {
        darkCSSVariables.push([
          declaration.clone({ prop: shadowVar, value }),
        ]);
      }
    });
}

/**
 * Compose typography tokens
 * @param { Declaration } declaration
 */
function typography (declaration) {
  const dialtoneTypographies = extractTypographies();
  dialtoneTypographies
    .forEach(typographyName => {
      const composedVar = `--dt-typography-${typographyName}`;
      const value = `var(${composedVar}-font-weight) var(${composedVar}-font-size)/var(${composedVar}-line-height) var(${composedVar}-font-family)`;
      bodyCSSVariables.push([
        declaration.clone({ prop: composedVar, value }),
      ]);
    });
}

/**
 *
 * @param { Declaration } declaration
 */
function _generateCompositionTokens (declaration) {
  boxShadows(declaration);
  boxShadows(declaration, 'dark');
  typography(declaration);
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
  const fontColorRegex = new RegExp(`\\.d-fc-(${REGEX_OPTIONS.FONT_COLORS})(-(${REGEX_OPTIONS.FONT_COLOR_VARIATIONS}))?`);
  const backgroundColorRegex = new RegExp(`\\.d-bgc-(${REGEX_OPTIONS.BACKGROUND_COLORS})(-(${REGEX_OPTIONS.BACKGROUND_COLOR_VARIATIONS}))?`);
  const borderColorRegex = new RegExp(`\\.d-bc-(${REGEX_OPTIONS.BORDER_COLORS})(-(${REGEX_OPTIONS.BORDER_COLOR_VARIATIONS}))?`);
  const boxShadowRegex = new RegExp(`\\.d-bs-(${REGEX_OPTIONS.BOX_SHADOWS})`);
  const found = [
    backgroundGradientRegex,
    fontColorRegex,
    backgroundColorRegex,
    borderColorRegex,
    boxShadowRegex,
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
    Once (root, { Rule }) {
      const lastRule = root.last;
      const clonedSource = lastRule.source;
      const declaration = lastRule.first;

      _generateUtilities(Rule, clonedSource, declaration);
      _generateVariables(declaration);
      _generateCompositionTokens(declaration);

      root.insertAfter(lastRule, new Rule({ selector: '.dialtone-theme-light', nodes: lightCSSVariables, source: clonedSource }));
      root.insertAfter(lastRule, new Rule({ selector: '.dialtone-theme-dark', nodes: darkCSSVariables, source: clonedSource }));
      root.insertAfter(lastRule, new Rule({ selector: 'body', nodes: bodyCSSVariables, source: clonedSource }));
      root.insertAfter(lastRule, Object.values(generatedRules).flat());
    },
    Root (root) {
      root.walkRules(rule => {
        _generateHoverFocusVariations(rule);
      });
    },
  };
};

module.exports.postcss = true;
