export const SLIDER_ORIENTATIONS = ['horizontal', 'vertical'] as const;

export const SLIDER_SIZE_MODIFIERS: Record<string, string> = {
  100: 'd-slider--xs',
  200: 'd-slider--sm',
  300: '',
  400: 'd-slider--lg',
  500: 'd-slider--xl',
  xs: 'd-slider--xs',
  sm: 'd-slider--sm',
  md: '',
  lg: 'd-slider--lg',
  xl: 'd-slider--xl',
};

export const SLIDER_DEFAULT_LARGE_STEP = 10;
