
/* eslint-disable max-len */
import { watch } from 'vue';

const messageOptions = [
  { value: 'all', label: 'All Messages', shortLabel: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'mentions', label: 'Mentions & Reactions', shortLabel: 'Mentions' },
];
const channelOptions = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'chat', label: 'Chat' },
];

function controlledPreset (props = {}, slots = {}) {
  const single = props.useDropdown?.initialValue ?? true;
  return {
    metadata: {
      copyNotice: `Configuration snapshot. Bind selected with v-model:selected for interaction; see https://dialtone.dialpad.com/components/filter-pill.html#controlled-${single ? 'single' : 'multiple'}-selection. The options/selected API is unreleased; use a compatible published release when available.`,
      lookupExclude: {
        reason: 'Controlled options/selected require the DLT-3736 feature release; the current Dialtone 10.5.1 lookup profile predates that API. Withhold until compatible publication and profile qualification.',
        owner: 'DLT-3736 / Dialtone component and lookup maintainers',
      },
    },
    props: {
      options: { initialValue: single ? messageOptions : channelOptions },
      selected: { initialValue: single ? 'all' : [], types: single ? ['string', 'null'] : ['array'] },
      neutralValue: { initialValue: single ? 'all' : undefined },
      label: { initialValue: single ? 'Filter by' : 'Channel' },
      useDropdown: { initialValue: single, lockControl: true },
      endTooltipText: { initialValue: 'Clear' },
      ...props,
    },
    slots,
  };
}

// Keep the captured owner and its scroll context mounted until its own cleanup finishes.
function beforePreviewRemount (pill, { signal }) {
  const overlay = pill.$refs.overlay;
  const popover = overlay?.$options.name === 'DtDropdown' ? overlay.$refs.popover : overlay;
  if (!popover || (!pill.isOpen && !popover.isOpen && popover.isDialogAriaHidden)) return;

  return new Promise(resolve => {
    const finish = () => {
      stop();
      signal.removeEventListener('abort', finish);
      resolve();
    };
    const stop = watch(
      () => [pill.isOpen, popover.isOpen, popover.isDialogAriaHidden],
      ([open, ownerOpen, hidden]) => {
        if (open) pill.cancelSelection();
        else if (!ownerOpen && hidden) finish();
      },
      { flush: 'post' },
    );
    signal.addEventListener('abort', finish, { once: true });
    pill.cancelSelection();
  });
}

export default {
  defaults: {
    props: {
      overlayMinInlineSize: { tokenCategory: 'layout' },
    },
    metadata: {
      initialPreset: 'controlled default',
      beforePreviewRemount,
      previewIdentity: bindings => Array.isArray(bindings.options)
        ? ['controlled', Boolean(bindings.useDropdown)]
        : ['legacy', bindings.modelValue],
    },
  },
  exclusions: [
    {
      when: { options: Array.isArray },
      hide: { props: ['modelValue'] },
    },
    {
      when: { options: value => !Array.isArray(value) },
      hide: { props: ['selected', 'neutralValue', 'open'], slots: ['anchorEnd', 'optionEnd'] },
    },
    {
      when: { useDropdown: true },
      disable: {
        props: ['deferSelection', 'popoverContentClass', 'popoverHeaderClass', 'popoverFooterClass', 'popoverDialogClass', 'popoverPadding'],
        slots: ['footerContent'],
      },
    },
    {
      when: { useDropdown: v => !v },
      disable: { props: ['dropdownListClass'] },
    },
    {
      when: { options: Array.isArray, useDropdown: value => !value },
      hide: { props: ['neutralValue'] },
    },
  ],

  'controlled default': controlledPreset(),

  'controlled active': controlledPreset({ selected: { initialValue: 'mentions', types: ['string', 'null'] } }),

  'controlled multiple': controlledPreset({
    useDropdown: { initialValue: false, lockControl: true },
    selected: { initialValue: ['phone'], types: ['array'] },
  }),

  'controlled deferred': controlledPreset({
    useDropdown: { initialValue: false, lockControl: true },
    deferSelection: { initialValue: true },
    popoverFooterClass: { initialValue: 'd-pie-200 d-py-150' },
  }),

  'controlled empty options': controlledPreset({ options: { initialValue: [] } }),

  'controlled counts': controlledPreset({ selected: { initialValue: 'unread', types: ['string', 'null'] } }, {
    headerContent: { initialValue: 'Filter by' },
    anchorEnd: { initialValue: '<dt-badge v-if="selected === \'unread\'" type="bulletin" kind="count" aria-hidden="true">12</dt-badge><span v-if="selected === \'unread\'" class="d-vi-visible-sr">, 12 unread messages</span>' },
    optionEnd: { initialValue: '<dt-badge v-if="option.value === \'unread\'" type="bulletin" kind="count" aria-hidden="true">12</dt-badge><span v-if="option.value === \'unread\'" class="d-vi-visible-sr">, 12 unread messages</span>' },
  }),

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
