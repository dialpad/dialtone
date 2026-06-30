
import { disableAndClearProps, hasNoValue, hasValue } from '@/src/lib/exclusion_rules';

export default {
  exclusions: [
    {
      when: { startClass: hasValue },
      ...disableAndClearProps(['leftClass']),
    },
    {
      whenSlots: { start: hasNoValue, left: hasNoValue },
      ...disableAndClearProps(['leftClass']),
    },
    {
      when: { blockEndClass: hasValue },
      ...disableAndClearProps(['bottomClass']),
    },
    {
      whenSlots: { blockEnd: hasNoValue, bottom: hasNoValue },
      ...disableAndClearProps(['bottomClass']),
    },
    {
      when: { endClass: hasValue },
      ...disableAndClearProps(['rightClass']),
    },
    {
      whenSlots: { end: hasNoValue, right: hasNoValue },
      ...disableAndClearProps(['rightClass']),
    },
  ],

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
      start: { initialValue: '<dt-icon size="200" name="lock" />' },
      default: { initialValue: 'Layout title' },
      subtitle: { initialValue: 'Subtitle' },
      bottom: { initialValue: '<dt-badge>Content</dt-badge>' },
      end: { initialValue: '<dt-icon size="200" name="share" />' },
      selected: { initialValue: '<dt-icon size="200" name="check" />' },
    },
  },
};
