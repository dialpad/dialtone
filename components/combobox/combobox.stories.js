import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '../storybook_utils';
import DtCombobox from './combobox';
import DtComboboxMdx from './combobox.mdx';
import DtComboboxDefaultTemplate from './combobox_default.story.vue';

// Default Prop Values
export const argsData = {
  showList: true,
  onEscape: action('escape'),
  onHighlight: action('highlight'),
  onSelect: action('select'),
};

export const argTypesData = {
  // Slots
  input: {
    description: 'Slot for the input component',
    table: {
      category: 'slots',
      type: {
        summary: 'VNode',
      },
    },
  },
  list: {
    description: 'Slot for the list component',
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
  },
};

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtComboboxDefaultTemplate,
);

// Stories
export const Default = DefaultTemplate.bind({});
Default.args = {};
