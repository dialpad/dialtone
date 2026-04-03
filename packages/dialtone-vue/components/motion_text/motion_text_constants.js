// Animation mode options
export const MOTION_TEXT_ANIMATION_MODES = [
  'gradient-in',
  'fade-in',
  'slide-in',
  'gradient-sweep',
  'shimmer',
  'none',
];

// Speed options
export const MOTION_TEXT_SPEEDS = ['100', '200', '300', '400', '500'];

// Timing presets based on speed
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

export default {
  MOTION_TEXT_ANIMATION_MODES,
  MOTION_TEXT_SPEEDS,
  MOTION_TEXT_TIMING_PRESETS,
};
