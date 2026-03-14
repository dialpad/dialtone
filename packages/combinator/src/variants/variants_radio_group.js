/* eslint-disable max-len */
export default {
  default: {
    props: {
      name: {
        initialValue: 'fruits-radio-group',
      },
      legend: {
        initialValue: 'Fruits',
      },
    },
    slots: {
      default: {
        initialValue: '<dt-radio value="apple"><span>Apple</span></dt-radio><dt-radio value="banana"><span>Banana</span></dt-radio><dt-radio value="other"><span>Other</span></dt-radio>',
      },
    },
  },

  'with validation': {
    props: {
      name: { initialValue: 'validated-radio-group' },
      legend: { initialValue: 'Fruits' },
      messages: { initialValue: [{ message: 'Please select an option.', type: 'error' }] },
    },
    slots: {
      default: {
        initialValue: '<dt-radio value="apple"><span>Apple</span></dt-radio><dt-radio value="banana"><span>Banana</span></dt-radio>',
      },
    },
  },
};
