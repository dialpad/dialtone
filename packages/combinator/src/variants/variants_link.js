import { disableAndClearProps, hasValue } from '@/src/lib/exclusion_rules';

export default {
  defaults: {
    props: {
      href: { searchKeywords: ['url'] },
      tone: {
        tokenCategory: 'color:d-link--:color',
        searchKeywords: ['text color'],
      },
      underline: { searchKeywords: ['text decoration'] },
    },
  },

  exclusions: [
    {
      when: { tone: hasValue },
      ...disableAndClearProps(['kind']),
    },
  ],

  default: {
    slots: {
      default: {
        initialValue: 'Base link',
      },
    },
    props: {
      href: {
        initialValue: '#',
      },
    },
  },

  critical: {
    props: {
      href: { initialValue: '#link' },
      tone: { initialValue: 'critical' },
    },
    slots: {
      default: { initialValue: 'Critical link' },
    },
  },

  mention: {
    props: {
      href: { initialValue: '#link' },
      tone: { initialValue: 'mention' },
    },
    slots: {
      default: { initialValue: 'Mention link' },
    },
  },

  'no underline': {
    props: {
      href: { initialValue: '#link' },
      underline: { initialValue: false },
    },
    slots: {
      default: { initialValue: 'No underline link' },
    },
  },

  external: {
    props: {
      href: { initialValue: 'https://github.com/dialpad/dialtone' },
      target: { initialValue: '_blank' },
      rel: { initialValue: 'noopener noreferrer' },
    },
    slots: {
      default: { initialValue: 'GitHub' },
    },
  },

  'router link': {
    props: {
      to: { initialValue: '/components/button' },
    },
    slots: {
      default: { initialValue: 'Button docs' },
    },
  },
};
