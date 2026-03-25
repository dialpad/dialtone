/* eslint-disable max-len */

export default {
  default: {
    props: {
      endTooltipText: {
        initialValue: 'More calling options',
      },
    },
    slots: {
      default: {
        initialValue: 'Place call',
      },
      dropdownList: {
        initialValue: '<dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 1 </dt-list-item> <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 2 </dt-list-item> <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 3 </dt-list-item>',
      },
    },
  },

  outlined: {
    props: {
      importance: { initialValue: 'outlined' },
      endTooltipText: { initialValue: 'More calling options' },
    },
    slots: {
      default: { initialValue: 'Place Call' },
      dropdownList: {
        initialValue: '<dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 1 </dt-list-item> <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 2 </dt-list-item> <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 3 </dt-list-item>',
      },
    },
  },

  'clear muted': {
    props: {
      importance: { initialValue: 'clear' },
      kind: { initialValue: 'muted' },
      endTooltipText: { initialValue: 'More calling options' },
    },
    slots: {
      default: { initialValue: 'Place Call' },
      dropdownList: {
        initialValue: '<dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 1 </dt-list-item> <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 2 </dt-list-item> <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 3 </dt-list-item>',
      },
    },
  },

  'end disabled': {
    props: {
      endDisabled: { initialValue: true },
      endTooltipText: { initialValue: 'More calling options' },
    },
    slots: {
      default: { initialValue: 'End disabled' },
      dropdownList: {
        initialValue: '<dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 1 </dt-list-item> <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 2 </dt-list-item> <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 3 </dt-list-item>',
      },
    },
  },

  xs: {
    props: {
      size: { initialValue: 'xs' },
      endTooltipText: { initialValue: 'More calling options' },
    },
    slots: {
      default: { initialValue: 'xs' },
      dropdownList: {
        initialValue: '<dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 1 </dt-list-item> <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 2 </dt-list-item> <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 3 </dt-list-item>',
      },
    },
  },

  'start loading': {
    props: {
      startLoading: { initialValue: true },
      importance: { initialValue: 'outlined' },
      endTooltipText: { initialValue: 'More calling options' },
    },
    slots: {
      default: { initialValue: 'Place call' },
      dropdownList: {
        initialValue: '<dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 1 </dt-list-item> <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 2 </dt-list-item> <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 3 </dt-list-item>',
      },
    },
  },

  'with start icon': {
    props: {
      importance: { initialValue: 'outlined' },
      endTooltipText: { initialValue: 'More calling options' },
    },
    slots: {
      startIcon: { initialValue: '<dt-icon-phone :size="iconSize" />' },
      default: { initialValue: 'Place call' },
    },
  },

  'icon only muted': {
    props: {
      importance: { initialValue: 'outlined' },
      kind: { initialValue: 'muted' },
      endTooltipText: { initialValue: 'More calling options' },
      startTooltipText: { initialValue: 'Place call' },
    },
    slots: {
      startIcon: { initialValue: '<dt-icon-phone :size="iconSize" />' },
    },
  },

  'with leading': {
    props: {
      importance: { initialValue: 'outlined' },
      endTooltipText: { initialValue: 'More options' },
      alphaLeadingClass: { initialValue: 'd-pl-100' },
    },
    slots: {
      default: { initialValue: 'Place Call' },
      leading: { initialValue: '<dt-badge kind="count" text="3" />' },
      dropdownList: {
        initialValue: '<dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 1 </dt-list-item> <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 2 </dt-list-item> <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 3 </dt-list-item>',
      },
    },
  },
};
