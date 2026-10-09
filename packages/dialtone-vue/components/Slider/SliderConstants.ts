export const SLIDER_ORIENTATIONS = ['horizontal', 'vertical'] as const;

export const SLIDER_READOUT_MODES = ['always', 'never', 'interaction', 'tooltip'] as const;

export const SLIDER_FILL_ORIGINS = ['start', 'end'] as const;

export const SLIDER_DEFAULT_LARGE_STEP = 10;

// Must match .d-slider__control's own overflow-clip-margin (slider.less);
// shared so both consumers reference one number.
export const SLIDER_EDGE_CLAMP_TOLERANCE_PX = 32;
