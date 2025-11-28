export const TEXT_KIND_MODIFIERS = {
  headline: 'd-headline',
  body: 'd-body',
  label: 'd-label',
  helper: 'd-helper',
  code: 'd-code',
};

export const TEXT_SIZE_MODIFIERS = {
  headline: ['eyebrow', 'sm', 'md', 'lg', 'xl', 'xxl'],
  body: ['sm', 'md'],
  label: ['sm', 'md'],
  helper: ['sm', 'md'],
  code: ['sm', 'md'],
};

export const TEXT_STRENGTH_MODIFIERS = ['soft', 'plain'];
export const TEXT_DENSITY_MODIFIERS = ['compact'];

import TEXT_TONE_TOKENS from './text_tone_tokens.js';
export { TEXT_TONE_TOKENS };

export const TEXT_STRENGTH_BY_KIND_AND_SIZE = {
  headline: {
    sm: ['soft'],
    lg: ['soft'],
  },
  label: {
    sm: ['plain'],
    md: ['plain'],
  },
};

export const TEXT_DENSITY_BY_KIND_AND_SIZE = {
  headline: {
    sm: ['compact'],
    md: ['compact'],
    lg: ['compact'],
    xl: ['compact'],
    xxl: ['compact'],
  },
  body: {
    sm: ['compact'],
    md: ['compact'],
  },
  label: {
    sm: ['compact'],
    md: ['compact'],
  },
};

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

export const TEXT_TRIM_MODIFIERS = {
  start: 'd-text--trim-start',
  end: 'd-text--trim-end',
  both: 'd-text--trim-both',
};

export default {
  TEXT_KIND_MODIFIERS,
  TEXT_SIZE_MODIFIERS,
  TEXT_STRENGTH_MODIFIERS,
  TEXT_DENSITY_MODIFIERS,
  TEXT_TONE_TOKENS,
  TEXT_STRENGTH_BY_KIND_AND_SIZE,
  TEXT_DENSITY_BY_KIND_AND_SIZE,
  TEXT_ALIGN_MODIFIERS,
  TEXT_TONE_PREFIX,
  TEXT_NUMERIC_CLASS,
  TEXT_TRUNCATE_CLASS,
  TEXT_LINE_CLAMP_CLASS,
  TEXT_WRAP_MODIFIERS,
  TEXT_TRIM_MODIFIERS,
};
