export const SLIDER_ORIENTATIONS = ['horizontal', 'vertical'] as const;

export const SLIDER_READOUT_MODES = ['always', 'never', 'interaction'] as const;

export const SLIDER_FILL_ORIGINS = ['start', 'end'] as const;

// Slider is a new component with no prior t-shirt-size API to stay backward
// compatible with, unlike existing components that still accept a deprecated
// sm/md/lg alias alongside the numeric scale — so only the numeric keys are
// defined here.
// Slider is a new component with no prior t-shirt-size API to stay backward
// compatible with, unlike existing components that still accept a deprecated
// sm/md/lg alias alongside the numeric scale — so only the numeric keys are
// defined here.
export const SLIDER_SIZE_MODIFIERS: Record<string, string> = {
  200: 'd-slider--sm',
  300: '',
  400: 'd-slider--lg',
};

export const SLIDER_DEFAULT_LARGE_STEP = 10;
