export const SLIDER_ORIENTATIONS = ['horizontal', 'vertical'] as const;
export type SliderOrientation = (typeof SLIDER_ORIENTATIONS)[number];

export const SLIDER_READOUT_MODES = ['always', 'never', 'tooltip'] as const;
export type SliderReadoutMode = (typeof SLIDER_READOUT_MODES)[number];

export const SLIDER_FILL_ORIGINS = ['start', 'end'] as const;
export type SliderFillOrigin = (typeof SLIDER_FILL_ORIGINS)[number];

export const SLIDER_DEFAULT_LARGE_STEP = 10;

// Marks nudge inward beyond this allowance; match the control's own
// overflow-clip-margin in slider.less. Floating tooltip readouts use the
// viewport as their boundary instead.
export const SLIDER_EDGE_CLAMP_TOLERANCE_PX = 32;

// readout="always" pills get no such allowance: unlike a mark (a small dot
// the control's own overflow-clip-margin is sized to cover), a readout's
// text can be arbitrarily wide (locale, suffix, a long getValueText), and a
// consumer's own wrapper can clip tighter than the control's margin.
// Zero tolerance nudges a readout inward the instant it would overflow the
// control's own edge at all, for any value approaching an edge, not only one
// sitting exactly at min/max (which takes the separate, measurement-free
// flush-edge path instead).
export const SLIDER_READOUT_EDGE_CLAMP_TOLERANCE_PX = 0;
