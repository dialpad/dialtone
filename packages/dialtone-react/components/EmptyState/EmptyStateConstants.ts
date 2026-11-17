import type { TextDensity } from '../Text/TextConstants';

export const EMPTY_STATE_SIZE_MODIFIERS = {
  // Numeric (preferred)
  200: 'd-empty-state--size-sm',
  300: 'd-empty-state--size-md',
  400: 'd-empty-state--size-lg',
  // T-shirt aliases (deprecated)
  sm: 'd-empty-state--size-sm',
  md: 'd-empty-state--size-md',
  lg: 'd-empty-state--size-lg',
} as const;

export const EMPTY_STATE_CONTENT_SIZE_MODIFIERS = {
  // Numeric (preferred)
  200: 'd-empty-state__content--sm',
  300: 'd-empty-state__content--md',
  400: 'd-empty-state__content--lg',
  // T-shirt aliases (deprecated)
  sm: 'd-empty-state__content--sm',
  md: 'd-empty-state__content--md',
  lg: 'd-empty-state__content--lg',
} as const;

export const EMPTY_STATE_HEADLINE_SIZES = {
  // Numeric (preferred)
  200: 'md',
  300: 'xl',
  400: '2xl',
  // T-shirt aliases (deprecated)
  sm: 'md',
  md: 'xl',
  lg: '2xl',
} as const;

export const EMPTY_STATE_HEADLINE_DENSITIES: Readonly<Record<EmptyStateSize, TextDensity | undefined>> = {
  // Numeric (preferred)
  200: '200',
  300: '200',
  400: undefined,
  // T-shirt aliases (deprecated)
  sm: '200',
  md: '200',
  lg: undefined,
};

export const EMPTY_STATE_BODY_SIZES = {
  // Numeric (preferred)
  200: 'sm',
  300: 'md',
  400: 'lg',
  // T-shirt aliases (deprecated)
  sm: 'sm',
  md: 'md',
  lg: 'lg',
} as const;

export const EMPTY_STATE_BODY_DENSITIES: Readonly<Record<EmptyStateSize, TextDensity | undefined>> = {
  // Numeric (preferred)
  200: undefined,
  300: '300',
  400: '300',
  // T-shirt aliases (deprecated)
  sm: undefined,
  md: '300',
  lg: '300',
};

/** The keys of `EMPTY_STATE_SIZE_MODIFIERS`: 200, 300, 400, or the deprecated 'sm', 'md', 'lg'. */
export type EmptyStateSize = keyof typeof EMPTY_STATE_SIZE_MODIFIERS;

export default {
  EMPTY_STATE_SIZE_MODIFIERS,
  EMPTY_STATE_CONTENT_SIZE_MODIFIERS,
  EMPTY_STATE_HEADLINE_SIZES,
  EMPTY_STATE_HEADLINE_DENSITIES,
  EMPTY_STATE_BODY_SIZES,
  EMPTY_STATE_BODY_DENSITIES,
};
