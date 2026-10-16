export const SLIDER_ORIENTATIONS = ['horizontal', 'vertical'] as const;

export const SLIDER_READOUT_MODES = ['always', 'never', 'tooltip'] as const;

export const SLIDER_FILL_ORIGINS = ['start', 'end'] as const;

export const SLIDER_DEFAULT_LARGE_STEP = 10;

// Marks nudge inward beyond this allowance; match the control's own
// overflow-clip-margin in slider.less. Floating tooltip readouts use the
// viewport as their boundary instead.
export const SLIDER_EDGE_CLAMP_TOLERANCE_PX = 32;
