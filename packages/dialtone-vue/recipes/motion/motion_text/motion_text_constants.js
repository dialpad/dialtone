// Animation mode options
export const MOTION_TEXT_ANIMATION_MODES = [
  'gradient-in',
  'fade-in',
  'slide-in',
  'gradient-sweep',
  'shimmer',
  'none',
];

// Speed options (t-shirt sizing)
export const MOTION_TEXT_SPEEDS = ['sm', 'md', 'lg'];

// Timing presets based on speed
export const MOTION_TEXT_TIMING_PRESETS = {
  sm: {
    characterDelay: 20,
    wordDelay: 30,
    duration: 600,
  },
  md: {
    characterDelay: 30,
    wordDelay: 50,
    duration: 1000,
  },
  lg: {
    characterDelay: 50,
    wordDelay: 100,
    duration: 1500,
  },
};

export default {
  MOTION_TEXT_ANIMATION_MODES,
  MOTION_TEXT_SPEEDS,
  MOTION_TEXT_TIMING_PRESETS,
};
