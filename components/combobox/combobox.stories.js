import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtCombobox from './combobox.vue';

import DtComboboxDefaultTemplate from './combobox_default.story.vue';
import { LABEL_SIZES } from './combobox_constants';

// Default Prop Values
export const argsData = {
  label: 'Label Text',
  labelVisible: true,
  showList: true,
  size: LABEL_SIZES.DEFAULT,
  emptyList: false,
  loading: false,
  clickOnSelect: false,
  onEscape: action('escape'),
  onHighlight: action('highlight'),
  onSelect: action('select'),
  onOpened: action('opened'),
  onItemClick: action('click'),
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
    description:
      'Slot for the empty list item. Defaults to emptyStateMessage prop. It\'s shown when `emptyList=true`',
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
  size: {
    options: Object.values(LABEL_SIZES),
    control: {
      type: 'select',
    },
    table: {
      defaultValue: {
        summary: LABEL_SIZES.DEFAULT,
      },
    },
  },
  description: {
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
  onItemClick: {
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
};

// Templates
const DefaultTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtComboboxDefaultTemplate);

export const Default = {
  render: DefaultTemplate,

  args: {
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
  },
};

export const Empty = {
  render: DefaultTemplate,

  args: {
    items: [],
    emptyStateMessage: 'No matches found.',
    emptyList: true,
  },
};
