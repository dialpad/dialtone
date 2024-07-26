/**
 * This file contains the constants that we use to dynamically generate
 * the dialtone hsl tokens and composition tokens
 *
 * Put here the unique values that are needed to generate the classes or mappings
 * to variables.

 * This data shouldn't duplicate values under `/docs/_data/` folder
 */

module.exports = {
  IS_COLOR_REGEX: /--dt.*-color/,
  IS_THEME_COLOR_REGEX: /(--dt-theme-).*-(color).*/,
  IS_SHADOW_REGEX: /--dt.*-shadow/,
  IS_TYPOGRAPHY_REGEX: /--dt.*-typography/,
  REGEX_OPTIONS: {
    SHADOW_VARIABLES: [
      'small',
      'medium',
      'large',
      'extra-large',
      'card',
      'focus',
      'focus-inset',
    ].join('|'),
    TYPOGRAPHY_VARIABLES: [
      'compact',
      'eyebrow',
      'soft',
      'soft-compact',
      'plain',
      'plain-compact',
    ].join('|'),
    TYPOGRAPHY_TYPE: [
      'headline',
      'body',
      'label',
      'helper',
      'code',
    ].join('|'),
    TYPOGRAPHY_SIZES: [
      'sm',
      'md',
      'lg',
      'xl',
      'xxl',
    ].join('|'),
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
