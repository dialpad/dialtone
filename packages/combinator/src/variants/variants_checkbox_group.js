/* eslint-disable max-len */

export default {
  default: {
    props: {
      name: {
        initialValue: 'fruits-checkbox-group',
      },
      legend: {
        initialValue: 'Fruits',
      },
    },
    slots: {
      default: {
        initialValue: '<dt-checkbox value="apple"><span>Apple</span></dt-checkbox><dt-checkbox value="banana"><span>Banana</span></dt-checkbox><dt-checkbox value="other"><span>Other</span></dt-checkbox>',
      },
    },
  },

  'with validation': {
    props: {
      name: { initialValue: 'validated-checkbox-group' },
      legend: { initialValue: 'Fruits' },
      messages: { initialValue: [{ message: 'Please select at least one option.', type: 'critical' }] },
    },
    slots: {
      default: {
        initialValue: '<dt-checkbox value="apple"><span>Apple</span></dt-checkbox><dt-checkbox value="banana"><span>Banana</span></dt-checkbox>',
      },
    },
  },
};
