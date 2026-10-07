import { hasNoValue, hasValue } from '@/src/lib/exclusion_rules';

// Reference sentence from the "Motion-Text-Effects" Figma spec.
const SAMPLE_TEXT = 'The AI platform for customer experience';

// Motion is time-based and the preview can't call start(), so the effect presets loop to stay
// visible. "not started" and "play once" render a stable, comparable frame.
export default {
  defaults: {
    props: {
      animationMode: { searchKeywords: ['effect'] },
      speed: { searchKeywords: ['duration'] },
      loop: { searchKeywords: ['repeat'] },
      screenReaderText: { searchKeywords: ['aria label'] },
    },
  },

  exclusions: [
    // `text` takes precedence over the default slot, so only one can be set at a time.
    {
      when: { text: hasValue },
      disable: { slots: ['default'] },
      clear: { slots: ['default'] },
    },
    {
      when: { text: hasNoValue },
      whenSlots: { default: hasValue },
      disable: { props: ['text'] },
    },
  ],

  default: {
    props: {
      text: { initialValue: SAMPLE_TEXT },
      animationMode: { initialValue: 'gradient-in' },
      loop: { initialValue: true },
    },
  },

  'fade in': {
    props: {
      text: { initialValue: SAMPLE_TEXT },
      animationMode: { initialValue: 'fade-in' },
      loop: { initialValue: true },
    },
  },

  'slide in': {
    props: {
      text: { initialValue: SAMPLE_TEXT },
      animationMode: { initialValue: 'slide-in' },
      loop: { initialValue: true },
    },
  },

  'slide in gradient': {
    props: {
      text: { initialValue: SAMPLE_TEXT },
      animationMode: { initialValue: 'slide-in-gradient' },
      loop: { initialValue: true },
    },
  },

  'gradient sweep': {
    props: {
      text: { initialValue: SAMPLE_TEXT },
      animationMode: { initialValue: 'gradient-sweep' },
      loop: { initialValue: true },
    },
  },

  shimmer: {
    props: {
      text: { initialValue: SAMPLE_TEXT },
      animationMode: { initialValue: 'shimmer' },
      loop: { initialValue: true },
    },
  },

  'gradient sweep, not started': {
    props: {
      text: { initialValue: SAMPLE_TEXT },
      animationMode: { initialValue: 'gradient-sweep' },
      autoStart: { initialValue: false },
    },
  },

  'fast, play once': {
    props: {
      text: { initialValue: SAMPLE_TEXT },
      animationMode: { initialValue: 'fade-in' },
      speed: { initialValue: '100' },
    },
  },

  'slow slide in gradient': {
    props: {
      text: { initialValue: SAMPLE_TEXT },
      animationMode: { initialValue: 'slide-in-gradient' },
      speed: { initialValue: '500' },
      loop: { initialValue: true },
    },
  },

  'shimmer with screen reader text': {
    props: {
      text: { initialValue: 'Thinking' },
      animationMode: { initialValue: 'shimmer' },
      loop: { initialValue: true },
      screenReaderText: { initialValue: 'Assistant is thinking' },
    },
  },

  'ignores reduced motion': {
    props: {
      text: { initialValue: SAMPLE_TEXT },
      animationMode: { initialValue: 'gradient-sweep' },
      loop: { initialValue: true },
      respectsReducedMotion: { initialValue: false },
    },
  },

  'slot content': {
    props: {
      animationMode: { initialValue: 'slide-in' },
      loop: { initialValue: true },
    },
    slots: {
      default: { initialValue: 'Slot text is split into words' },
    },
  },
};
