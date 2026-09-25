export const SLIDER_ORIENTATIONS = ['horizontal', 'vertical'] as const;

export const SLIDER_READOUT_MODES = ['always', 'never', 'interaction'] as const;

export const SLIDER_SIZE_MODIFIERS: Record<string, string> = {
  200: 'd-slider--sm',
  300: '',
  400: 'd-slider--lg',
  sm: 'd-slider--sm',
  md: '',
  lg: 'd-slider--lg',
};

export const SLIDER_DEFAULT_LARGE_STEP = 10;
