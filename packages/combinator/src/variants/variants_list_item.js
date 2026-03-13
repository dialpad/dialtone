 
export default {
  default: {
    props: {
      navigationType: {
        initialValue: 'tab',
      },
    },
    slots: {
      default: {
        initialValue: 'Default List Item',
      },
    },
  },

  'with all slots': {
    props: {
      navigationType: { initialValue: 'tab' },
    },
    slots: {
      start: { initialValue: '<dt-icon size="300" name="check" />' },
      default: { initialValue: '<span>Default List Item</span>' },
      subtitle: { initialValue: 'Description' },
      bottom: { initialValue: '<dt-badge text="Label" />' },
      end: { initialValue: '<dt-icon size="300" name="external-link" />' },
    },
  },
};
