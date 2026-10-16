export default {
  // modelValue's shape (number vs. array) decides single/range mode — not a
  // separate boolean prop the option bar's dependency inference can pick up,
  // hence the explicit exclusion. fillOrigin is "Ignored in range mode" per
  // its own JSDoc; minGapSteps' gap enforcement returns early with no
  // second thumb to enforce against.
  exclusions: [
    {
      when: { modelValue: (v) => Array.isArray(v) },
      disable: { props: ['fillOrigin'] },
    },
    {
      when: { modelValue: (v) => !Array.isArray(v) },
      disable: { props: ['minGapSteps'] },
    },
  ],

  default: {
    props: {
      modelValue: { initialValue: 50 },
      label: { initialValue: 'Volume' },
      showLabel: { initialValue: false },
      suffix: { initialValue: '%' },
    },
  },

  'horizontal volume': {
    props: {
      modelValue: { initialValue: 50 },
      label: { initialValue: 'Volume' },
      suffix: { initialValue: '%' },
    },
    slots: {
      start: { initialValue: '<dt-icon-volume-x size="200" aria-label="Low volume" />' },
      end: { initialValue: '<dt-icon-volume-2 size="200" aria-label="High volume" />' },
    },
  },

  'call duration range': {
    props: {
      modelValue: { initialValue: [5, 45] },
      max: { initialValue: 120 },
      label: { initialValue: 'Call duration' },
      suffix: { initialValue: ' min' },
      minGapSteps: { initialValue: 5 },
      showMarks: { initialValue: true },
      readout: { initialValue: 'always' },
    },
  },

  'playback speed': {
    props: {
      modelValue: { initialValue: 1.25 },
      min: { initialValue: 0.5 },
      max: { initialValue: 2 },
      step: { initialValue: 0.25 },
      label: { initialValue: 'Playback speed' },
      suffix: { initialValue: '×' },
      showTicks: { initialValue: true },
      readout: { initialValue: 'always' },
    },
  },

  'audio balance': {
    props: {
      modelValue: { initialValue: 25 },
      min: { initialValue: -100 },
      max: { initialValue: 100 },
      label: { initialValue: 'Audio balance' },
      fillOrigin: { initialValue: 0 },
      showTicks: { initialValue: 25 },
      showMarks: { initialValue: [{ value: 0, text: 'Center' }] },
    },
    slots: {
      start: { initialValue: '<span>Left</span>' },
      end: { initialValue: '<span>Right</span>' },
    },
  },

  'budget cap': {
    props: {
      modelValue: { initialValue: 620 },
      max: { initialValue: 1000 },
      label: { initialValue: 'Budget cap' },
      prefix: { initialValue: '$' },
      snapPoints: { initialValue: 100 },
      showTicks: { initialValue: 100 },
      showMarks: { initialValue: [0, 500, 1000] },
    },
  },

  'vertical volume': {
    props: {
      modelValue: { initialValue: 60 },
      label: { initialValue: 'Volume' },
      orientation: { initialValue: 'vertical' },
      suffix: { initialValue: '%' },
      readout: { initialValue: 'always' },
    },
  },
};
