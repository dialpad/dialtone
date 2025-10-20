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

export default {
  TEXT_KIND_MODIFIERS,
  TEXT_SIZE_MODIFIERS,
  TEXT_STRENGTH_MODIFIERS,
  TEXT_DENSITY_MODIFIERS,
  TEXT_ALIGN_MODIFIERS,
  TEXT_TONE_PREFIX,
  TEXT_NUMERIC_CLASS,
  TEXT_TRUNCATE_CLASS,
  TEXT_LINE_CLAMP_CLASS,
};
