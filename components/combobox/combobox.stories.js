import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtCombobox from './combobox';
import DtComboboxMdx from './combobox.mdx';
import DtComboboxDefaultTemplate from './combobox_default.story.vue';

// Default Prop Values
export const argsData = {
  showList: true,
  onEscape: action('escape'),
  onHighlight: action('highlight'),
  onSelect: action('select'),
  onOpened: action('opened'),
};

export const argTypesData = {
  // Slots
  input: {
    description: 'Slot for the input component',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'VNode',
      },
    },
  },
  list: {
    description: 'Slot for the list component',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'VNode',
      },
    },
  },
  emptyListItem: {
    description: 'Slot for the empty list item. Defaults to emptyStateMessage prop. It\'s shown when `emptyList=true`',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'VNode',
      },
    },
  },

  // Props
  listAriaLabel: {
    table: {
      category: 'props',
      type: {
        summary: 'string',
      },
      defaultValue: {
        summary: '',
      },
    },
    control: {
      type: 'text',
    },
  },
  listId: {
    table: {
      defaultValue: {
        summary: 'generated unique ID',
      },
    },
  },
  onBeginningOfList: {
    table: {
      category: 'props',
      type: {
        summary: 'function',
      },
      defaultValue: {
        summary: 'null',
      },
    },
  },
  onEndOfList: {
    table: {
      category: 'props',
      type: {
        summary: 'function',
      },
      defaultValue: {
        summary: 'null',
      },
    },
  },
  emptyList: {
    defaultValue: false,
  },
  loading: {
    defaultValue: false,
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
  onSelect: {
    table: {
      disable: true,
    },
  },
  onOpened: {
    table: {
      disable: true,
    },
  },

  escape: {
    description: 'Event fired when pressing escape',
    table: {
      type: { summary: 'event' },
    },
  },
  highlight: {
    description: 'Event fired when the highlight changes',
    table: {
      type: { summary: 'event' },
    },
  },
  select: {
    description: 'Select item event',
    table: {
      type: { summary: 'event' },
    },
  },
  opened: {
    description: `Event fired when list is shown or hidden.`,
    table: {
      type: {
        summary: 'event',
      },
    },
  },

  // Hide items because its used for storybook only
  // not a real component prop.
  items: {
    table: {
      disable: true,
    },
  },
};

// Story Collection
export default {
  title: 'Components/Combobox',
  component: DtCombobox,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
  parameters: {
    controls: {
      sort: 'requiredFirst',
    },
    docs: {
      page: DtComboboxMdx,
    },
    options: {
      showPanel: true,
    },
  },
};

// Templates
const DefaultTemplate = (args) => createTemplateFromVueFile(
  args,
  DtComboboxDefaultTemplate,
);

// Stories
export const Default = DefaultTemplate.bind({});
Default.args = {
  items: [
    { name: 'combobox item 1', id: 1 },
    { name: 'combobox item 2', id: 2 },
    { name: 'combobox item 3', id: 3 },
    { name: 'combobox item 4', id: 4 },
    { name: 'combobox item 5', id: 5 },
    { name: 'combobox item 6', id: 6 },
    { name: 'combobox item 7', id: 7 },
    { name: 'combobox item 8', id: 8 },
    { name: 'combobox item 9', id: 9 },
    { name: 'combobox item 10', id: 10 },
    { name: 'combobox item 11', id: 11 },
    { name: 'combobox item 12', id: 12 },
  ],
};

export const Empty = DefaultTemplate.bind({});
Empty.args = {
  items: [],
  emptyStateMessage: 'No matches found.',
  emptyList: true,
};
