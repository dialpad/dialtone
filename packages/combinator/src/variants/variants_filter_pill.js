
/* eslint-disable max-len */

export default {
  exclusions: [
    {
      when: { useDropdown: true },
      disable: { props: ['deferSelection'] },
    },
    {
      when: { useDropdown: v => !v },
      disable: { props: ['dropdownListClass'] },
    },
  ],

  default: {
    props: {
      label: {
        initialValue: 'Active example',
      },
      modelValue: {
        initialValue: [
          { name: 'Option 1' },
          { name: 'Option 2' },
          { name: 'Option 3', active: true },
        ],
      },
      endTooltipText: {
        initialValue: 'Remove',
      },
    },
  },

  'custom slot example': {
    props: {
      modelValue: {
        initialValue: [
          { name: 'Address', active: true },
          { name: 'Call Purpose', active: true },
          { name: 'Action Item' },
          { name: 'Negative Sentiment' },
          { name: 'Warranty Inquiry', active: true },
        ],
      },
      label: { initialValue: 'Moment' },
      endTooltipText: { initialValue: 'Remove' },
    },
    slots: {
      default: {
        initialValue: '{{ label }}<template v-if="activeFilters.length">: <strong>{{ activeFilters.length === filters.length ? \'All\' : activeFilters.length }}</strong></template>',
      },
    },
  },

  'use dropdown': {
    props: {
      modelValue: {
        initialValue: [
          { name: 'All Conversations' },
          { name: 'Only Calls' },
          { name: 'Only Meetings' },
          { name: 'Only Digital' },
        ],
      },
      label: { initialValue: 'Conversation type' },
      useDropdown: { initialValue: true },
      endTooltipText: { initialValue: 'Remove' },
    },
    slots: {
      content: {
        initialValue: '<dt-list-item role="menuitem" navigation-type="arrow-keys">All Conversations</dt-list-item><dt-list-item role="menuitem" navigation-type="arrow-keys">Only Calls</dt-list-item><dt-list-item role="menuitem" navigation-type="arrow-keys">Only Meetings</dt-list-item><dt-list-item role="menuitem" navigation-type="arrow-keys">Only Digital</dt-list-item>',
      },
    },
  },

  'defer selection': {
    props: {
      modelValue: {
        initialValue: [
          { name: 'Email' },
          { name: 'Phone', active: true },
          { name: 'Chat' },
          { name: 'Social' },
          { name: 'SMS' },
        ],
      },
      label: { initialValue: 'Channel' },
      endTooltipText: { initialValue: 'Remove' },
      popoverFooterClass: { initialValue: 'd-pie-200 d-py-150' },
      deferSelection: { initialValue: true },
    },
  },

  'read only selection': {
    props: {
      modelValue: {
        initialValue: [
          { name: 'Headquarters', active: true },
          { name: 'Westside', active: true },
          { name: 'Downtown' },
        ],
      },
      label: { initialValue: 'Contact centers' },
      readOnly: { initialValue: true },
    },
  },

  'non clearable': {
    props: {
      modelValue: {
        initialValue: [
          { name: '0\u20135 min', active: true },
          { name: '5\u201315 min' },
          { name: '15\u201330 min' },
          { name: '30+ min' },
        ],
      },
      label: { initialValue: 'Duration' },
      showClear: { initialValue: false },
    },
  },

  'active filter list': {
    props: {
      modelValue: {
        initialValue: [
          { name: 'Email', active: true },
          { name: 'Phone', active: true },
          { name: 'Chat', active: true },
          { name: 'Social' },
          { name: 'SMS' },
        ],
      },
      label: { initialValue: 'Channel' },
      endTooltipText: { initialValue: 'Remove' },
    },
    slots: {
      default: {
        initialValue: '{{ label }}<template v-if="activeFilters.length">: <strong>{{ activeFilters.length === filters.length ? \'All\' : activeFilterList }}</strong><template v-if="activeFilterOverflow"> {{ activeFilterOverflow }}</template></template>',
      },
    },
  },

  'custom content slot': {
    props: {
      modelValue: {
        initialValue: [
          { name: 'Contains' },
          { name: 'Starts with' },
        ],
      },
      label: { initialValue: 'Keyword' },
    },
    slots: {
      content: {
        initialValue: 'Enter a keyword to filter results',
      },
    },
  },
};
