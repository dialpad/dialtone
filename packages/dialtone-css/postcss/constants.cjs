/**
 * This file contains the constants that we use to dynamically generate
 * the dialtone utility classes and variables.
 *
 * Put here the unique values that are needed to generate the classes or mappings
 * to utilities/variables.

 * This data shouldn't duplicate values under `/docs/_data/` folder
 */
module.exports = {
  OPACITIES: [
    100,
    99,
    95,
    90,
    85,
    75,
    50,
    25,
    10,
    0,
  ],
  FLEX_COLUMNS: 12,
  BORDER_RADIUS_SIZES: {
    0: 'radius-0',
    2: 'radius-200',
    4: 'radius-300',
    8: 'radius-400',
    12: '450',
    16: 'radius-500',
    24: '550',
    32: 'radius-600',
  },
  GAP_SPACES: {
    0: '0',
    1: '100',
    2: '200',
    4: '300',
    6: '350',
    8: '400',
    12: '450',
    16: '500',
    24: '550',
    32: '600',
    48: '650',
    64: '700',
  },
  LAYOUT_SIZES: {
    0: '0',
    1: '100',
    2: '200',
    4: '300',
    6: '350',
    8: '400',
    12: '450',
    16: '500',
    24: '550',
    32: '600',
    48: '650',
    64: '700',
    72: '720',
    84: '730',
    96: '750',
    102: '760',
    n1: '100-negative',
    n2: '200-negative',
    n4: '300-negative',
    n6: '350-negative',
    n8: '400-negative',
    n12: '450-negative',
    n16: '500-negative',
    n24: '550-negative',
    n32: '600-negative',
    n48: '650-negative',
    n64: '700-negative',
    n72: '720-negative',
    n84: '730-negative',
    n96: '750-negative',
    n102: '760-negative',
  },
  PADDING_SIZES: {
    0: '0',
    1: '100',
    2: '200',
    4: '300',
    6: '350',
    8: '400',
    12: '450',
    16: '500',
    24: '550',
    32: '600',
    48: '650',
    64: '700',
    96: '750',
    128: '800',
  },
  MARGIN_SIZES: {
    0: '0',
    1: '100',
    2: '200',
    4: '300',
    6: '350',
    8: '400',
    12: '450',
    16: '500',
    24: '550',
    32: '600',
    48: '650',
    64: '700',
    96: '750',
    128: '800',
    n1: '100-negative',
    n2: '200-negative',
    n4: '300-negative',
    n6: '350-negative',
    n8: '400-negative',
    n12: '450-negative',
    n16: '500-negative',
    n24: '550-negative',
    n32: '600-negative',
    n48: '650-negative',
    n64: '700-negative',
    n96: '750-negative',
    n128: '800-negative',
  },
  REGEX_OPTIONS: {
    COLORS: [
      'White',
      'Black',
      'Purple',
      'Blue',
      'Magenta',
      'Gold',
      'Green',
      'Red',
      'Tan',
    ].join('|'),
    HOVER_FOCUS_PREFIXES: [
      'h',
      'f',
      'fv',
    ].join('|'),
    BACKGROUND_GRADIENTS: [
      'none',
      'unset',
    ].join('|'),
    FONT_COLORS: [
      'primary',
      'secondary',
      'tertiary',
      'muted',
      'placeholder',
      'disabled',
      'success',
      'warning',
      'error',
      'critical',
      'current',
      'transparent',
      'unset',
    ].join('|'),
    FONT_COLOR_VARIATIONS: [
      'strong-inverted',
      'inverted',
      'strong',
    ].join('|'),
    BACKGROUND_COLORS: [
      'primary',
      'secondary',
      'moderate',
      'strong',
      'contrast',
      'bold',
      'backdrop',
      'success',
      'warning',
      'info',
      'error',
      'critical',
      'danger',
      'transparent',
      'unset',
    ].join('|'),
    BACKGROUND_COLOR_VARIATIONS: [
      'opaque',
      'subtle-opaque',
      'subtle',
      'strong',
    ].join('|'),
    BORDER_COLORS: [
      'default',
      'subtle',
      'moderate',
      'bold',
      'focus',
      'critical',
      'success',
      'warning',
      'brand',
      'accent',
    ].join('|'),
    BORDER_COLOR_VARIATIONS: [
      'inverted',
      'subtle',
      'strong',
      'subtle-inverted',
      'strong-inverted',
    ].join('|'),
    BOX_SHADOWS: [
      'sm',
      'md',
      'lg',
      'xl',
      'card',
      'none',
      'unset',
    ].join('|'),
    SHADOW_VARIABLES: [
      'Small',
      'Medium',
      'Large',
      'ExtraLarge',
      'Card',
      'Focus',
      'FocusInset',
    ].join('|'),
    TYPOGRAPHY_VARIABLES: [
      'Body',
      'BodyCompact',
      'Headline',
      'HeadlineEyebrow',
      'HeadlineSoft',
      'HeadlineCompact',
      'HeadlineCompactSoft',
      'Label',
      'LabelPlain',
      'LabelCompact',
      'LabelCompactPlain',
      'Helper',
      'Code',

    ].join('|'),
    TYPOGRAPHY_SIZES: [
      'Small',
      'Base',
      'Medium',
      'Large',
      'ExtraLarge',
      'ExtraExtraLarge',

    ].join('|'),
    TEXT_DECORATION: [
      'dotted',
      'line-through',
      'none',
      'underline',
      'unset',
    ].join('|'),
    OPACITY_VARIATIONS: [
      '0',
      '10',
      '25',
      '50',
      '75',
      '90',
      '95',
      '99'
    ].join('|'),
  },
  WIDTH_HEIGHTS: {
    0: '0',
    1: '100',
    2: '200',
    4: '300',
    6: '350',
    8: '400',
    12: '450',
    16: '500',
    24: '550',
    32: '600',
    42: '625',
    48: '650',
    64: '700',
    72: '720',
    84: '730',
    96: '750',
    102: '760',
    114: '775',
    128: '800',
    164: '825',
    216: '875',
    264: '905',
    332: '925',
    464: '975',
    512: '1000',
    628: '1020',
    764: '1040',
    828: '1060',
    912: '1080',
    1024: '1100',
    1140: '1115',
    1268: '1120',
    1340: '1130',
  },
  PLATFORM_FONT_SIZES: {
    '100-mobile': '1.2rem',
    '200-mobile': '1.6rem',
    '300-mobile': '2rem',
    '400-mobile': '2.9rem',
    '500-mobile': '4.1rem',
    '100-tc8': '1.7rem',
    '200-tc8': '2.1rem',
    '300-tc8': '2.7rem',
    '400-tc8': '3.8rem',
    '500-tc8': '5.4rem',
    '100-tv': '2.5rem',
    '200-tv': '3.2rem',
    '300-tv': '4.1rem',
    '400-tv': '5.8rem',
    '500-tv': '8.2rem',
  },
  Z_INDEX: {
    hide: -1,
    base: 0,
    base1: 1,
    selected: 25,
    active: 50,
    navigation: 100,
    'navigation-fixed': 150,
    dropdown: 200,
    popover: 300,
    tooltip: 400,
    drawer: 500,
    modal: 600,
    'modal-element': 650,
    notification: 700,
  },
};
