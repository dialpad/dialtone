/**
 * This file contains the constants that we use to dynamically generate dialtone utility classes.
 *
 * Put here the unique values that are needed to generate utility classes

 * This data shouldn't duplicate values under `/docs/_data/` folder
 */

// @TODO: Move HSLA_EXCLUDED_COLORS to common/utils to share and sync it with dialtone-tokens/postcss/common.js
module.exports = {
  // Spacing token stops for generating new token-based utility classes (.d-pis-100, .d-mis-100, etc.)
  SPACING_TOKENS: [
    '0', '1', '25', '50', '75', '100', '125', '150', '175', '200',
    '225', '250', '275', '300', '350', '400', '450', '500', '525',
    '550', '600', '650', '700', '750', '800',
  ],
  SPACING_TOKENS_NEGATIVE: [
    '1', '25', '50', '75', '100', '125', '150', '175', '200',
    '225', '250', '275', '300', '350', '400', '450', '500', '525',
    '550', '600', '650', '700', '750', '800',
  ],
  HSLA_EXCLUDED_COLORS: ['--dt-color-surface-ai', '--dt-color-gradient-gold-red-magenta-purple', '--dt-color-gradient-magenta-purple', '--dt-badge-color-background-ai', '--dt-color-border-ai'],
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
    1: 'radius-100',
    2: 'radius-200',
    4: 'radius-300',
    8: 'radius-400',
    12: 'radius-450',
    16: 'radius-500',
    24: '550', // TODO: Remove as it doesn't have a valid token?
    32: 'radius-600',
  },
  // Maps pixel values to new algorithmic spacing token numbers
  // Formula: spacing-N where N = (pixels / 8) * 100
  // Example: 8px → spacing-100, 16px → spacing-200
  GAP_SPACES: {
    0: '0',
    1: '1',      // 1px
    2: '25',     // 2px
    4: '50',     // 4px
    6: '75',     // 6px
    8: '100',    // 8px (base)
    10: '125',   // 10px
    12: '150',   // 12px
    14: '175',   // 14px
    16: '200',   // 16px
    18: '225',   // 18px
    20: '250',   // 20px
    22: '275',   // 22px
    24: '300',   // 24px
    28: '350',   // 28px
    32: '400',   // 32px
    36: '450',   // 36px
    40: '500',   // 40px
    42: '525',   // 42px (legacy)
    44: '550',   // 44px
    48: '600',   // 48px
    52: '650',   // 52px
    56: '700',   // 56px
    60: '750',   // 60px
    64: '800',   // 64px (spacing cap)
  },
  // Maps pixel values to new algorithmic spacing token numbers for layout positioning
  LAYOUT_SIZES: {
    0: '0',
    1: '1',      // 1px
    2: '25',     // 2px
    4: '50',     // 4px
    6: '75',     // 6px
    8: '100',    // 8px
    10: '125',   // 10px
    12: '150',   // 12px
    14: '175',   // 14px
    16: '200',   // 16px
    18: '225',   // 18px
    20: '250',   // 20px
    22: '275',   // 22px
    24: '300',   // 24px
    28: '350',   // 28px
    32: '400',   // 32px
    36: '450',   // 36px
    40: '500',   // 40px
    42: '525',   // 42px (legacy)
    44: '550',   // 44px
    48: '600',   // 48px
    52: '650',   // 52px
    56: '700',   // 56px
    60: '750',   // 60px
    64: '800',   // 64px (spacing cap)
    n1: '1-negative',
    n2: '25-negative',
    n4: '50-negative',
    n6: '75-negative',
    n8: '100-negative',
    n12: '150-negative',
    n16: '200-negative',
    n20: '250-negative',
    n24: '300-negative',
    n32: '400-negative',
    n48: '600-negative',
    n64: '800-negative',
  },
  // Maps pixel values to new algorithmic spacing token numbers for padding
  PADDING_SIZES: {
    0: '0',
    1: '1',      // 1px
    2: '25',     // 2px
    4: '50',     // 4px
    6: '75',     // 6px
    8: '100',    // 8px (base)
    10: '125',   // 10px
    12: '150',   // 12px
    14: '175',   // 14px
    16: '200',   // 16px
    18: '225',   // 18px
    20: '250',   // 20px
    22: '275',   // 22px
    24: '300',   // 24px
    28: '350',   // 28px
    32: '400',   // 32px
    36: '450',   // 36px
    40: '500',   // 40px
    42: '525',   // 42px (legacy)
    44: '550',   // 44px
    48: '600',   // 48px
    52: '650',   // 52px
    56: '700',   // 56px
    60: '750',   // 60px
    64: '800',   // 64px (spacing cap)
  },
  // Maps pixel values to new algorithmic spacing token numbers for margin
  MARGIN_SIZES: {
    0: '0',
    1: '1',      // 1px
    2: '25',     // 2px
    4: '50',     // 4px
    6: '75',     // 6px
    8: '100',    // 8px (base)
    10: '125',   // 10px
    12: '150',   // 12px
    14: '175',   // 14px
    16: '200',   // 16px
    18: '225',   // 18px
    20: '250',   // 20px
    22: '275',   // 22px
    24: '300',   // 24px
    28: '350',   // 28px
    32: '400',   // 32px
    36: '450',   // 36px
    40: '500',   // 40px
    42: '525',   // 42px (legacy)
    44: '550',   // 44px
    48: '600',   // 48px
    52: '650',   // 52px
    56: '700',   // 56px
    60: '750',   // 60px
    64: '800',   // 64px (spacing cap)
    n1: '1-negative',
    n2: '25-negative',
    n4: '50-negative',
    n6: '75-negative',
    n8: '100-negative',
    n10: '125-negative',
    n12: '150-negative',
    n14: '175-negative',
    n16: '200-negative',
    n18: '225-negative',
    n20: '250-negative',
    n22: '275-negative',
    n24: '300-negative',
    n28: '350-negative',
    n32: '400-negative',
    n36: '450-negative',
    n40: '500-negative',
    n42: '525-negative',
    n44: '550-negative',
    n48: '600-negative',
    n52: '650-negative',
    n56: '700-negative',
    n60: '750-negative',
    n64: '800-negative',
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
    HOVER_FOCUS_PREFIXES: /\.(h|f|v)\\:/g,
    BACKGROUND_GRADIENTS: [
      'none',
      'unset',
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
      'ai',
      'accent',
      'transparent',
      'current',
      'unset',
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
    TEXT_DECORATION: [
      'dotted',
      'line-through',
      'none',
      'underline',
      'unset',
    ].join('|'),
    OPACITY_VARIATIONS: '\\d{1,3}',
  },
  // Maps pixel values to spacing tokens (0-64px) or layout tokens (64px+)
  // The generator needs to use --dt-spacing- for small values, --dt-layout- for large
  WIDTH_HEIGHTS_SPACING: {
    0: '0',
    1: '1',      // 1px
    2: '25',     // 2px
    4: '50',     // 4px
    6: '75',     // 6px
    8: '100',    // 8px
    10: '125',   // 10px
    12: '150',   // 12px
    14: '175',   // 14px
    16: '200',   // 16px
    18: '225',   // 18px
    20: '250',   // 20px
    22: '275',   // 22px
    24: '300',   // 24px
    28: '350',   // 28px
    32: '400',   // 32px
    36: '450',   // 36px
    40: '500',   // 40px
    42: '525',   // 42px (legacy)
    44: '550',   // 44px
    48: '600',   // 48px
    52: '650',   // 52px
    56: '700',   // 56px
    60: '750',   // 60px
    64: '800',   // 64px (spacing cap)
  },
  WIDTH_HEIGHTS_LAYOUT: {
    64: '100',    // 64px (layout-100)
    80: '125',    // 80px
    96: '150',    // 96px
    112: '175',   // 112px
    128: '200',   // 128px (layout base)
    160: '225',   // 160px
    192: '250',   // 192px
    224: '275',   // 224px
    256: '300',   // 256px
    288: '325',   // 288px
    320: '350',   // 320px
    352: '375',   // 352px
    384: '400',   // 384px
    448: '450',   // 448px
    512: '500',   // 512px
    576: '550',   // 576px
    640: '600',   // 640px
    704: '650',   // 704px
    768: '700',   // 768px
    832: '750',   // 832px
    896: '800',   // 896px
    960: '850',   // 960px
    1024: '900',  // 1024px (layout cap)
  },
  // Legacy combined mapping for backwards compatibility during migration
  WIDTH_HEIGHTS: {
    0: '0',
    1: '1',
    2: '25',
    4: '50',
    6: '75',
    8: '100',
    12: '150',
    16: '200',
    20: '250',
    24: '300',
    32: '400',
    42: '525',
    48: '600',
    64: '800',
  },
};
