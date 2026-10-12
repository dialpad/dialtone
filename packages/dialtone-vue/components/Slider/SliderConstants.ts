export const SLIDER_ORIENTATIONS = ['horizontal', 'vertical'] as const;

export const SLIDER_READOUT_MODES = ['always', 'never', 'interaction', 'tooltip'] as const;

export const SLIDER_FILL_ORIGINS = ['start', 'end'] as const;

export const SLIDER_DEFAULT_LARGE_STEP = 10;

// The horizontal (inline) tolerance marks and the tooltip readout nudge
// inward at. Must stay <= .d-slider__control's own overflow-clip-margin
// (slider.less) — that margin is shared across all four sides and sized for
// the tightest real need (the tooltip poking upward), so it's larger than
// this constant actually requires; the inline sides just get the leftover
// slack as a bonus, not a problem.
export const SLIDER_EDGE_CLAMP_TOLERANCE_PX = 32;

// Same tolerance the tooltip readout edge-clamps against (UseSliderGeometry's
// tooltipEdgeOffset, also reused by UseSliderCollisionAvoidance's analytical
// collision math so it checks the bubble's actual clamped position), minus a
// small safety margin — sub-pixel noise can tip an unmargined clamp back and
// forth at the boundary during a drag.
export const SLIDER_TOOLTIP_EDGE_CLAMP_TOLERANCE_PX = SLIDER_EDGE_CLAMP_TOLERANCE_PX - 4;
