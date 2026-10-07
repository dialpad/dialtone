// Animation mode options
export const MOTION_TEXT_ANIMATION_MODES = [
  'gradient-in',
  'fade-in',
  'slide-in',
  'slide-in-gradient',
  'gradient-sweep',
  'shimmer',
];

// Still accepted so existing usages keep working; they render the text at rest
export const MOTION_TEXT_DEPRECATED_ANIMATION_MODES = ['none'];

// Speed options
export const MOTION_TEXT_SPEEDS = ['100', '200', '300', '400', '500'];

// Timing presets based on speed. `duration` relative to the 300 preset sets how much
// every motion timing is scaled (300 plays the design spec as authored).
export const MOTION_TEXT_TIMING_PRESETS = {
  100: { duration: 300 },
  200: { duration: 600 },
  300: { duration: 1000 },
  400: { duration: 1500 },
  500: { duration: 2100 },
};

// Per-word animation tracks in ms at speed 300, from the Motion Text design spec.
// Word `i` starts at `delay + stagger * i` and runs for `duration`.
export const MOTION_TEXT_TRACKS = {
  // Word fades in (and rises, for slide modes)
  enter: { delay: 0, stagger: 60, duration: 300 },
  // Text color fades in over the gradient
  reveal: { delay: 250, stagger: 50, duration: 300 },
  // Word fades to the gradient, holds, then fades back over `fade`
  sweep: { delay: 350, stagger: 120, duration: 1400, fade: 250 },
  // A dimmed band sweeps left to right across the whole text at once (the original shimmer)
  shimmer: { delay: 0, stagger: 0, duration: 3000 },
};

// `loopHold` is the pause after the last word settles before a looped animation restarts.
// With the six-word Figma sample it reproduces the 2000ms (reveal) and 2650ms (sweep) loops.
export const MOTION_TEXT_MODE_SETTINGS = {
  'gradient-in': { tracks: ['enter', 'reveal'], gradient: true, loopHold: 1200 },
  'fade-in': { tracks: ['enter'], gradient: false, loopHold: 1400 },
  'slide-in': { tracks: ['enter'], gradient: false, loopHold: 1400 },
  'slide-in-gradient': { tracks: ['enter', 'reveal'], gradient: true, loopHold: 1200 },
  'gradient-sweep': { tracks: ['sweep'], gradient: true, loopHold: 300 },
  // Loops back to back, as the band starts and ends off the text
  shimmer: { tracks: ['shimmer'], gradient: false, loopHold: 0 },
};

export default {
  MOTION_TEXT_ANIMATION_MODES,
  MOTION_TEXT_SPEEDS,
  MOTION_TEXT_TIMING_PRESETS,
  MOTION_TEXT_TRACKS,
  MOTION_TEXT_MODE_SETTINGS,
};
