 
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
    },
  },

  outlined: {
    props: {
      importance: { initialValue: 'outlined' },
      endTooltipText: { initialValue: 'More calling options' },
    },
    slots: {
      default: { initialValue: 'Place Call' },
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
    },
  },

  'end disabled': {
    props: {
      endDisabled: { initialValue: true },
      endTooltipText: { initialValue: 'More calling options' },
    },
    slots: {
      default: { initialValue: 'End disabled' },
    },
  },

  xs: {
    props: {
      size: { initialValue: 'xs' },
      endTooltipText: { initialValue: 'More calling options' },
    },
    slots: {
      default: { initialValue: 'xs' },
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
      alphaLeadingClass: { initialValue: 'd-pl8' },
    },
    slots: {
      default: { initialValue: 'Place Call' },
      leading: { initialValue: '<dt-badge kind="count" text="3" />' },
    },
  },
};
