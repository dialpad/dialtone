/* eslint-disable max-len */

export default {
  default: {
    slots: {
      default: {
        initialValue: 'Layout title',
      },
      subtitle: {
        initialValue: 'Subtitle',
      },
    },
  },

  full: {
    slots: {
      start: { initialValue: '<dt-icon size="300" name="lock" />' },
      default: { initialValue: 'Layout title' },
      subtitle: { initialValue: 'Subtitle' },
      bottom: { initialValue: '<dt-badge>Content</dt-badge>' },
      end: { initialValue: '<dt-icon size="300" name="share" />' },
      selected: { initialValue: '<dt-icon size="300" name="check" />' },
    },
  },
};
