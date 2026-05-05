import { action } from 'storybook/actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtComboboxMultiSelect from './combobox_multi_select.vue';

import DtComboboxMultiSelectDefaultTemplate from './combobox_multi_select_default.story.vue';
import { MULTI_SELECT_SIZES } from './combobox_multi_select_constants';
import { ITEMS_LIST_DATA } from './combobox_multi_select_story_constants';

// Default Prop Values
export const argsData = {
  label: 'Label Text',
  labelVisible: true,
  listMaxHeight: '300px',
  loading: false,
  loadingMessage: 'loading...',
  selectedItems: [],
  maxSelected: 0,
  maxSelectedMessage: [],
  hasSuggestionList: true,
  appendTo: 'body',
  showList: null,
  disabled: false,
  onInput: action('input'),
  onSelect: action('select'),
  onRemove: action('remove'),
  onMaxSelected: action('maxSelected'),
  onComboboxHighlight: action('comboboxHighlight'),
  onFocus: action('focus'),
  onKeydown: action('keydown'),
  onInputKeydown: action('input-keydown'),
  onEscape: action('escape'),
  onEnter: action('enter'),
};

export const argTypesData = {
  // Slots
  list: {
    description: 'Slot for the list',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'VNode',
      },
    },
  },
  header: {
    description: 'Slot for popover header content',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'VNode',
      },
    },
  },
  footer: {
    description: 'Slot for popover footer content',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'VNode',
      },
    },
  },

  // Props
  label: {
    control: {
      type: 'text',
    },
  },
  description: {
    control: {
      type: 'text',
    },
  },
  disabled: {
    control: {
      type: 'boolean',
    },
  },
  appendTo: {
    table: {
      defaultValue: {
        summary: 'body',
      },
    },
  },
  size: {
    control: {
      type: 'select',
    },
    options: Object.values(MULTI_SELECT_SIZES),
  },

  // Action Event Handlers
  onEscape: {
    table: {
      disable: true,
    },
  },
  onEnter: {
    table: {
      disable: true,
    },
  },
  onKeydown: {
    table: {
      disable: true,
    },
  },
  onInputKeydown: {
    table: {
      disable: true,
    },
  },
  onHighlight: {
    table: {
      disable: true,
    },
  },
  onInput: {
    table: {
      disable: true,
    },
  },
  onSelect: {
    table: {
      disable: true,
    },
  },
  onMaxSelected: {
    table: {
      disable: true,
    },
  },

  onRemove: {
    table: {
      disable: true,
    },
  },

  select: {
    description: 'Select item event',
    table: {
      type: { summary: 'event' },
    },
  },

  onComboboxHighlight: {
    table: {
      disable: true,
    },
  },
};

// Story Collection
export default {
  title: 'Components/Combobox Multi-Select',
  component: DtComboboxMultiSelect,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Templates
const Template = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtComboboxMultiSelectDefaultTemplate,
);

export const Default = {
  render: Template,
};

export const WithMaxSelectValidation = {
  render: Template,

  args: {
    description: 'Select up to 2 options.',
    maxSelected: 2,
    selectedItems: ['item12', 'item13', 'item14'],
    maxSelectedMessage: [{ message: 'More than 2 selected', type: 'error' }],
  },

  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: false,
          },
          {
            id: 'label',
            enabled: false,
          },
        ],
      },
    },
    percy: {
      args: {
        showList: true,
      },
    },
  },
};

export const DuplicatedNames = {
  render: Template,

  args: {
    selectedItems: ['item12', 'item12', 'item12'],
  },
};

export const WithCollapseOnFocusOut = {
  render: Template,

  args: {
    selectedItems: ITEMS_LIST_DATA.map(item => item.value),
    collapseOnFocusOut: true,
  },
};

export const WithStyledInput = {
  render: Template,

  args: {
    selectedItems: ['item12', 'item13', 'item14'],
    inputWrapperClass: ['d-ba-none', 'd-bgc-primary'],
  },
};
