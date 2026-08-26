export default {
  // Each preset below is chosen to cover a distinct combination of
  // capabilities (single vs. range, ticks vs. marks vs. neither, icons vs.
  // none, fillOrigin) rather than variations on the same shape.
  //
  // Labels use the scoped #label slot (`value` binding — mirrors the
  // update:modelValue payload shape) instead of the static `label` prop, so
  // the value shown updates live while dragging rather than freezing at the
  // preset's initial value.
  default: {
    props: {
      modelValue: { initialValue: 50 },
      min: { initialValue: 0 },
      max: { initialValue: 100 },
      step: { initialValue: 1 },
      showTicks: { initialValue: true },
      tickInterval: { initialValue: 10 },
    },
    slots: {
      label: { initialValue: 'Slider label · {{ value }}' },
    },
  },

  'call duration filter': {
    props: {
      modelValue: { initialValue: [5, 45] },
      min: { initialValue: 0 },
      max: { initialValue: 120 },
      step: { initialValue: 1 },
    },
    slots: {
      label: { initialValue: 'Call duration filter · {{ value[0] }}–{{ value[1] }} min' },
      start: { initialValue: '<dt-icon name="clock-1" size="200" />' },
      end: { initialValue: '<dt-icon name="clock-12" size="200" />' },
    },
  },

  'noise cancellation': {
    props: {
      modelValue: { initialValue: 2 },
      min: { initialValue: 0 },
      max: { initialValue: 4 },
      step: { initialValue: 1 },
      showTicks: { initialValue: true },
      tickInterval: { initialValue: 1 },
      marks: { initialValue: [{ value: 0, text: 'Off' }, { value: 4, text: 'Max' }] },
    },
    slots: {
      label: { initialValue: 'Noise cancellation · {{ ["Off", "Low", "Medium", "High", "Max"][value] }}' },
      start: { initialValue: '<dt-icon name="volume-1" size="200" />' },
      end: { initialValue: '<dt-icon name="volume-x" size="200" />' },
    },
  },

  'auto-delete recordings after': {
    props: {
      modelValue: { initialValue: [14, 60] },
      min: { initialValue: 1 },
      max: { initialValue: 90 },
      step: { initialValue: 1 },
      marks: { initialValue: [1, 30, 60, 90] },
    },
    slots: {
      label: { initialValue: 'Auto-delete recordings after · {{ value[0] }}–{{ value[1] }} days' },
      start: { initialValue: '<dt-icon name="calendar-range" size="200" />' },
      end: { initialValue: '<dt-icon name="trash" size="200" />' },
    },
  },

  'audio pan': {
    props: {
      modelValue: { initialValue: 65 },
      min: { initialValue: 0 },
      max: { initialValue: 100 },
      step: { initialValue: 1 },
      fillOrigin: { initialValue: 50 },
    },
    slots: {
      label: { initialValue: 'Audio pan · {{ value }}' },
    },
  },
};
