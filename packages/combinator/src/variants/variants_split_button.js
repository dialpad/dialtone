/* eslint-disable max-len */

import { disableAndClearProps, hasNoValue, hasValue } from '@/src/lib/exclusion_rules';

const END_ALIAS_PROPS = ['omegaActive', 'omegaAriaLabel', 'omegaDisabled', 'omegaId', 'omegaTooltipText'];


export default {
  defaults: {
    props: {
      kind: { tokenCategory: 'color:d-btn--:color' },
    },
  },

  exclusions: [
    {
      when: { importance: v => v !== 'clear' },
      hide: { props: ['showDivider'] },
    },
    {
      when: { startActive: true },
      ...disableAndClearProps(['alphaActive']),
    },
    {
      when: { startAriaLabel: hasValue },
      ...disableAndClearProps(['alphaAriaLabel']),
    },
    {
      when: { startIconPosition: v => hasValue(v) && v !== 'left' },
      ...disableAndClearProps(['alphaIconPosition']),
    },
    {
      when: { startLeadingClass: hasValue },
      ...disableAndClearProps(['alphaLeadingClass']),
    },
    {
      when: { startTrailingClass: hasValue },
      ...disableAndClearProps(['alphaTrailingClass']),
    },
    {
      when: { startLabelClass: hasValue },
      ...disableAndClearProps(['alphaLabelClass']),
    },
    {
      when: { startDisabled: true },
      ...disableAndClearProps(['alphaDisabled']),
    },
    {
      when: { startLoading: true },
      ...disableAndClearProps(['alphaLoading']),
    },
    {
      when: { startTooltipText: hasValue },
      ...disableAndClearProps(['alphaTooltipText']),
    },
    {
      when: { endActive: true },
      ...disableAndClearProps(['omegaActive']),
    },
    {
      when: { endAriaLabel: hasValue },
      ...disableAndClearProps(['omegaAriaLabel']),
    },
    {
      when: { endDisabled: true },
      ...disableAndClearProps(['omegaDisabled']),
    },
    {
      when: { endId: hasValue },
      ...disableAndClearProps(['omegaId']),
    },
    {
      when: { endTooltipText: hasValue },
      ...disableAndClearProps(['omegaTooltipText']),
    },
    {
      whenSlots: { startIcon: hasNoValue, alphaIcon: hasNoValue },
      ...disableAndClearProps(['alphaIconPosition']),
    },
    {
      whenSlots: { startEndIcon: hasValue },
      ...disableAndClearProps(['alphaIconPosition']),
    },
    {
      whenSlots: { leading: hasNoValue },
      ...disableAndClearProps(['alphaLeadingClass']),
    },
    {
      whenSlots: { trailing: hasNoValue },
      ...disableAndClearProps(['alphaTrailingClass']),
    },
    {
      whenSlots: { default: hasNoValue },
      ...disableAndClearProps(['alphaLabelClass']),
    },
    {
      whenSlots: { end: hasValue },
      ...disableAndClearProps(END_ALIAS_PROPS),
    },
    {
      whenSlots: { omega: hasValue },
      ...disableAndClearProps(END_ALIAS_PROPS),
    },
    {
      when: { kind: 'muted' },
      disableValues: { props: { importance: ['primary'] } },
    },
    {
      when: { importance: 'primary' },
      disableValues: { props: { kind: ['muted'] } },
    },
  ],

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
        initialValue: '<dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 1 </dt-list-item>\n<dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 2 </dt-list-item>\n <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 3 </dt-list-item>',
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
        initialValue: '<dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 1 </dt-list-item>\n<dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 2 </dt-list-item>\n<dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 3 </dt-list-item>',
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
        initialValue: '<dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 1 </dt-list-item>\n<dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 2 </dt-list-item>\n<dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 3 </dt-list-item>',
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
        initialValue: '<dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 1 </dt-list-item>\n<dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 2 </dt-list-item>\n<dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 3 </dt-list-item>',
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
        initialValue: '<dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 1 </dt-list-item>\n<dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 2 </dt-list-item>\n<dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 3 </dt-list-item>',
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
      alphaLeadingClass: { initialValue: 'd-pis-100' },
    },
    slots: {
      default: { initialValue: 'Place Call' },
      leading: { initialValue: '<dt-badge kind="count" text="3" />' },
      dropdownList: {
        initialValue: '<dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 1 </dt-list-item>\n<dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 2 </dt-list-item>\n<dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 3 </dt-list-item>',
      },
    },
  },

  'clear muted no divider': {
    props: {
      importance: { initialValue: 'clear' },
      kind: { initialValue: 'muted' },
      showDivider: { initialValue: false },
      endTooltipText: { initialValue: 'More calling options' },
    },
    slots: {
      default: { initialValue: 'Place Call' },
      dropdownList: {
        initialValue: '<dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 1 </dt-list-item>\n<dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 2 </dt-list-item>\n<dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 3 </dt-list-item>',
      },
    },
  },
};
