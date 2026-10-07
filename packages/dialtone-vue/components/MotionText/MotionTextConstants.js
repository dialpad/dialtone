// Animation mode options
export const MOTION_TEXT_ANIMATION_MODES = [
  'gradient-in',
  'fade-in',
  'slide-in',
  'slide-in-gradient',
  'gradient-sweep',
  'shimmer',
];

// Speed options
export const MOTION_TEXT_SPEEDS = ['100', '200', '300', '400', '500'];

// Timing presets based on speed. `duration` relative to the 300 preset sets how much
// every motion timing is scaled (300 plays the Figma spec as authored).
// `characterDelay` and `wordDelay` are no longer used: animation is word-level.
export const MOTION_TEXT_TIMING_PRESETS = {
  100: {
    characterDelay: 10,
    wordDelay: 15,
    duration: 300,
  },
  200: {
    characterDelay: 20,
    wordDelay: 30,
    duration: 600,
  },
  300: {
    characterDelay: 30,
    wordDelay: 50,
    duration: 1000,
  },
  400: {
    characterDelay: 50,
    wordDelay: 100,
    duration: 1500,
  },
  500: {
    characterDelay: 80,
    wordDelay: 180,
    duration: 2100,
  },
};

// Per-word animation tracks in ms at speed 300, from the "Motion-Text-Effects" Figma spec.
// Word `i` starts at `delay + stagger * i` and runs for `duration`.
export const MOTION_TEXT_TRACKS = {
  // Word fades in (and rises, for slide modes)
  enter: { delay: 0, stagger: 60, duration: 300 },
  // Text color fades in over the gradient
  reveal: { delay: 250, stagger: 50, duration: 300 },
  // Word fades to the gradient (or to half opacity for shimmer), holds, then fades back over `fade`
  sweep: { delay: 350, stagger: 120, duration: 1400, fade: 250 },
};

// `loopHold` is the pause after the last word settles before a looped animation restarts.
// With the six-word Figma sample it reproduces the 2000ms (reveal) and 2650ms (sweep) loops.
export const MOTION_TEXT_MODE_SETTINGS = {
  'gradient-in': { tracks: ['enter', 'reveal'], gradient: true, loopHold: 1200 },
  'fade-in': { tracks: ['enter'], gradient: false, loopHold: 1400 },
  'slide-in': { tracks: ['enter'], gradient: false, loopHold: 1400 },
  'slide-in-gradient': { tracks: ['enter', 'reveal'], gradient: true, loopHold: 1200 },
  'gradient-sweep': { tracks: ['sweep'], gradient: true, loopHold: 300 },
  shimmer: { tracks: ['sweep'], gradient: false, loopHold: 300 },
};

export default {
  MOTION_TEXT_ANIMATION_MODES,
  MOTION_TEXT_SPEEDS,
  MOTION_TEXT_TIMING_PRESETS,
  MOTION_TEXT_TRACKS,
  MOTION_TEXT_MODE_SETTINGS,
};
