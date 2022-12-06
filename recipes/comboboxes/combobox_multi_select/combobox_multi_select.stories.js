import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtRecipeComboboxMultiSelect from './combobox_multi_select';
import DtRecipeComboboxMultiSelectMdx from './combobox_multi_select.mdx';
import DtRecipeComboboxMultiSelectDefaultTemplate from './combobox_multi_select_default.story.vue';
import { MULTI_SELECT_SIZES } from './combobox_multi_select_story_constants';

// Default Prop Values
export const argsData = {
  label: 'Label Text',
  labelVisible: true,
  listMaxHeight: '300px',
  onInput: action('input'),
  onSelect: action('select'),
  onRemove: action('remove'),
  onMaxSelected: action('maxSelected'),
  visuallyHiddenCloseLabel: 'Close Combobox',
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
  labelVisible: {
    defaultValue: true,
  },
  description: {
    control: {
      type: 'text',
    },
  },
  loading: {
    defaultValue: false,
  },
  loadingMessage: {
    defaultValue: 'loading...',
  },
  showList: {
    defaultValue: null,
  },
  listMaxHeight: {
    defaultValue: '300px',
  },
  maxSelected: {
    defaultValue: 0,
  },
  maxSelectedMessage: {
    defaultValue: [],
  },
  hasSuggestionList: {
    defaultValue: true,
  },
  size: {
    control: {
      type: 'select',
      options: Object.values(MULTI_SELECT_SIZES),
    },
    defaultValue: MULTI_SELECT_SIZES.DEFAULT,
    table: {
      defaultValue: {
        summary: MULTI_SELECT_SIZES.DEFAULT,
      },
    },
  },

  // Action Event Handlers
  onEscape: {
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
};

// Story Collection
export default {
  title: 'Recipes/Comboboxes/Combobox Multi-Select',
  component: DtRecipeComboboxMultiSelect,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
  parameters: {
    controls: {
      sort: 'requiredFirst',
    },
    docs: {
      page: DtRecipeComboboxMultiSelectMdx,
    },
    options: {
      showPanel: true,
    },
  },
};

// Templates
const Template = (args) => createTemplateFromVueFile(
  args,
  DtRecipeComboboxMultiSelectDefaultTemplate,
);

// Stories
export const Default = Template.bind({});

export const WithMaxSelectValidation = Template.bind({});
WithMaxSelectValidation.args = {
  description: 'Select up to 2 options.',
  maxSelected: 2,
  selectedItems: ['item12', 'item13', 'item14'],
  maxSelectedMessage: [{ message: 'More than 2 selected', type: 'error' }],
};
WithMaxSelectValidation.parameters = {
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
};
