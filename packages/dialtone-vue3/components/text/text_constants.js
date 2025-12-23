export const TEXT_KIND_MODIFIERS = {
  headline: 'd-text-headline',
  body: 'd-text-body',
  label: 'd-text-label',
  code: 'd-text-code',
};

export const TEXT_SIZE_MODIFIERS = {
  headline: ['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs'],
  body: ['lg', 'md', 'sm', 'xs'],
  label: ['lg', 'md', 'sm', 'xs'],
  code: ['lg', 'md', 'sm', 'xs'],
};

// Sizes that are only valid for headline kind - using these with other kinds throws an error
export const TEXT_HEADLINE_ONLY_SIZES = ['xxxl', 'xxl', 'xl'];

import TEXT_TONE_TOKENS from './text_tone_tokens.js';
export { TEXT_TONE_TOKENS };

export const TEXT_ALIGN_MODIFIERS = {
  start: 'd-text--align-start',
  center: 'd-text--align-center',
  end: 'd-text--align-end',
  justify: 'd-text--align-justify',
};

export const TEXT_TONE_PREFIX = 'd-fc-';

export const TEXT_NUMERIC_CLASS = 'd-text--numeric';
export const TEXT_TRUNCATE_CLASS = 'd-truncate';
export const TEXT_LINE_CLAMP_CLASS = 'd-text--clamp';

export const TEXT_WRAP_MODIFIERS = {
  wrap: 'd-text--wrap-wrap',
  nowrap: 'd-text--wrap-nowrap',
  balance: 'd-text--wrap-balance',
  pretty: 'd-text--wrap-pretty',
};

export const TEXT_BOX_TRIM_MODIFIERS = {
  start: 'd-text--trim-start',
  end: 'd-text--trim-end',
  both: 'd-text--trim-both',
};

export const TEXT_STRENGTH_MODIFIERS = {
  bold: 'd-text--fw-bold',
  semibold: 'd-text--fw-semibold',
  medium: 'd-text--fw-medium',
  normal: 'd-text--fw-normal',
};

export const TEXT_DENSITY_MODIFIERS = {
  100: 'd-text--lh-100',
  200: 'd-text--lh-200',
  300: 'd-text--lh-300',
  400: 'd-text--lh-400',
  500: 'd-text--lh-500',
  600: 'd-text--lh-600',
};

export default {
  TEXT_KIND_MODIFIERS,
  TEXT_SIZE_MODIFIERS,
  TEXT_HEADLINE_ONLY_SIZES,
  TEXT_TONE_TOKENS,
  TEXT_ALIGN_MODIFIERS,
  TEXT_TONE_PREFIX,
  TEXT_NUMERIC_CLASS,
  TEXT_TRUNCATE_CLASS,
  TEXT_LINE_CLAMP_CLASS,
  TEXT_WRAP_MODIFIERS,
  TEXT_BOX_TRIM_MODIFIERS,
  TEXT_STRENGTH_MODIFIERS,
  TEXT_DENSITY_MODIFIERS,
};
