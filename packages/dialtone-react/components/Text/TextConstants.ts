export const TEXT_KIND_MODIFIERS = {
  headline: 'd-text-headline',
  body: 'd-text-body',
  label: 'd-text-label',
  code: 'd-text-code',
} as const;

export const TEXT_VARIANT_MODIFIERS = {
  'headline-3xl': 'd-text-headline--3xl',
  'headline-2xl': 'd-text-headline--2xl',
  'headline-xl': 'd-text-headline--xl',
  'headline-lg': 'd-text-headline--lg',
  'headline-md': 'd-text-headline--md',
  'headline-sm': 'd-text-headline--sm',
  'headline-xs': 'd-text-headline--xs',
  'body-lg': 'd-text-body--lg',
  'body-md': 'd-text-body--md',
  'body-sm': 'd-text-body--sm',
  'body-xs': 'd-text-body--xs',
  'label-lg': 'd-text-label--lg',
  'label-md': 'd-text-label--md',
  'label-sm': 'd-text-label--sm',
  'label-xs': 'd-text-label--xs',
  'code-lg': 'd-text-code--lg',
  'code-md': 'd-text-code--md',
  'code-sm': 'd-text-code--sm',
  'code-xs': 'd-text-code--xs',
} as const;

export const TEXT_SIZE_MODIFIERS = {
  headline: [
    '700',
    '600',
    '500',
    '400',
    '300',
    '200',
    '100',
    '3xl',
    '2xl',
    'xl',
    'lg',
    'md',
    'sm',
    'xs',
  ],
  body: ['400', '300', '200', '100', 'lg', 'md', 'sm', 'xs'],
  label: ['400', '300', '200', '100', 'lg', 'md', 'sm', 'xs'],
  code: ['400', '300', '200', '100', 'lg', 'md', 'sm', 'xs'],
} as const;

// Sizes that are only valid for headline kind - using these with other kinds throws an error
export const TEXT_HEADLINE_ONLY_SIZES = [
  '700',
  '600',
  '500',
  '3xl',
  '2xl',
  'xl',
] as const;

// Numeric → t-shirt CSS class suffix mapping
export const TEXT_SIZE_MAP = {
  100: 'xs',
  200: 'sm',
  300: 'md',
  400: 'lg',
  500: 'xl',
  600: '2xl',
  700: '3xl',
} as const;

export const TEXT_FONT_SIZE_MODIFIERS = {
  50: 'd-text--fs-50',
  75: 'd-text--fs-75',
  100: 'd-text--fs-100',
  125: 'd-text--fs-125',
  150: 'd-text--fs-150',
  200: 'd-text--fs-200',
  250: 'd-text--fs-250',
  300: 'd-text--fs-300',
  350: 'd-text--fs-350',
  400: 'd-text--fs-400',
  450: 'd-text--fs-450',
  500: 'd-text--fs-500',
  550: 'd-text--fs-550',
  600: 'd-text--fs-600',
  650: 'd-text--fs-650',
  700: 'd-text--fs-700',
  750: 'd-text--fs-750',
  800: 'd-text--fs-800',
} as const;

export const TEXT_FAMILY_MODIFIERS = {
  inherit: 'd-text--ff-inherit',
  custom: 'd-text--ff-custom',
  sans: 'd-text--ff-sans',
  mono: 'd-text--ff-mono',
  expressive: 'd-text--ff-expressive',
} as const;

export const TEXT_ITALIC_CLASS = 'd-text--italic';

export const TEXT_TONE_MODIFIERS = {
  primary: 'd-text--tone-primary',
  secondary: 'd-text--tone-secondary',
  tertiary: 'd-text--tone-tertiary',
  muted: 'd-text--tone-muted',
  disabled: 'd-text--tone-disabled',
  placeholder: 'd-text--tone-placeholder',
  critical: 'd-text--tone-critical',
  'critical-strong': 'd-text--tone-critical-strong',
  positive: 'd-text--tone-positive',
  'positive-strong': 'd-text--tone-positive-strong',
  warning: 'd-text--tone-warning',
  info: 'd-text--tone-info',
  'info-strong': 'd-text--tone-info-strong',
  'neutral-black': 'd-text--tone-neutral-black',
  'neutral-white': 'd-text--tone-neutral-white',
} as const;

export const TEXT_ALIGN_MODIFIERS = {
  start: 'd-text--align-start',
  center: 'd-text--align-center',
  end: 'd-text--align-end',
  justify: 'd-text--align-justify',
} as const;

export const TEXT_NUMERIC_CLASS = 'd-text--numeric';
export const TEXT_TRUNCATE_CLASS = 'd-truncate';
export const TEXT_LINE_CLAMP_CLASS = 'd-text--clamp';

export const TEXT_WRAP_MODIFIERS = {
  wrap: 'd-text--wrap-wrap',
  nowrap: 'd-text--wrap-nowrap',
  balance: 'd-text--wrap-balance',
  pretty: 'd-text--wrap-pretty',
} as const;

export const TEXT_BOX_TRIM_MODIFIERS = {
  start: 'd-text--trim-start',
  end: 'd-text--trim-end',
  both: 'd-text--trim-both',
} as const;

export const TEXT_STRENGTH_MODIFIERS = {
  bold: 'd-text--fw-bold',
  semibold: 'd-text--fw-semibold',
  medium: 'd-text--fw-medium',
  normal: 'd-text--fw-normal',
} as const;

export const TEXT_DENSITY_MODIFIERS = {
  100: 'd-text--lh-100',
  200: 'd-text--lh-200',
  300: 'd-text--lh-300',
  400: 'd-text--lh-400',
  500: 'd-text--lh-500',
  600: 'd-text--lh-600',
} as const;

// The validators' value sets, as literal unions. Numeric keys are accepted as numbers or strings, as in Vue.
export type TextKind = keyof typeof TEXT_KIND_MODIFIERS;
export type TextVariant = keyof typeof TEXT_VARIANT_MODIFIERS;
export type TextFamily = keyof typeof TEXT_FAMILY_MODIFIERS;
export type TextTone = keyof typeof TEXT_TONE_MODIFIERS;
export type TextAlign = keyof typeof TEXT_ALIGN_MODIFIERS;
export type TextWrap = keyof typeof TEXT_WRAP_MODIFIERS;
export type TextBoxTrim = keyof typeof TEXT_BOX_TRIM_MODIFIERS;
export type TextStrength = keyof typeof TEXT_STRENGTH_MODIFIERS;
export type TextDensity = keyof typeof TEXT_DENSITY_MODIFIERS | `${keyof typeof TEXT_DENSITY_MODIFIERS}`;

export default {
  TEXT_KIND_MODIFIERS,
  TEXT_VARIANT_MODIFIERS,
  TEXT_SIZE_MODIFIERS,
  TEXT_HEADLINE_ONLY_SIZES,
  TEXT_FONT_SIZE_MODIFIERS,
  TEXT_FAMILY_MODIFIERS,
  TEXT_ITALIC_CLASS,
  TEXT_TONE_MODIFIERS,
  TEXT_ALIGN_MODIFIERS,
  TEXT_NUMERIC_CLASS,
  TEXT_TRUNCATE_CLASS,
  TEXT_LINE_CLAMP_CLASS,
  TEXT_WRAP_MODIFIERS,
  TEXT_BOX_TRIM_MODIFIERS,
  TEXT_STRENGTH_MODIFIERS,
  TEXT_DENSITY_MODIFIERS,
};
