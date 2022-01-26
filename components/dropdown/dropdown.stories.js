import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '../storybook_utils';
import DtDropdown from './dropdown';
import DtDropdownMdx from './dropdown.mdx';
import DtDropdownDefaultTemplate from './dropdown_default.story.vue';
import DtDropdownVariantsTemplate from './dropdown_variants.story.vue';
import { LIST_ITEM_NAVIGATION_TYPES } from '../list_item/list_item_constants';
import {
  POPOVER_CONTENT_WIDTHS,
  POPOVER_HORIZONTAL_ALIGNMENT,
  POPOVER_PADDING_CLASSES,
  POPOVER_VERTICAL_ALIGNMENT,
} from '../popover';

// Default Prop Values
export const argsData = {
  onHighlight: action('highlight'),
  onEscape: action('escape'),
  onUpdateOpen: action('update:open'),
};

export const argTypesData = {
  // Slots
  anchor: {
    table: {
      category: 'slots',
      type: {
        summary: 'VNode',
      },
    },
    control: {
      type: 'text',
    },
  },
  list: {
    table: {
      category: 'slots',
      type: {
        summary: 'VNode',
      },
    },
    control: {
      type: 'text',
    },
  },

  // Props
  navigationType: {
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'arrow-keys' },
    },
    defaultValue: 'arrow-keys',
    control: {
      type: 'select',
      options: Object.values(LIST_ITEM_NAVIGATION_TYPES),
    },
  },
  listId: {
    table: {
      defaultValue: {
        summary: 'generated unique ID',
      },
    },
  },
  padding: {
    control: {
      type: 'select',
      options: Object.keys(POPOVER_PADDING_CLASSES),
    },
  },
  fixedVerticalAlignment: {
    defaultValue: null,
    control: {
      type: 'select',
      options: POPOVER_VERTICAL_ALIGNMENT,
    },
    table: {
      defaultValue: {
        summary: 'null',
      },
    },
  },
  fixedAlignment: {
    defaultValue: 'left',
    control: {
      type: 'select',
      options: POPOVER_HORIZONTAL_ALIGNMENT,
    },
    table: {
      defaultValue: {
        summary: 'left',
      },
    },
  },
  contentWidth: {
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'null' },
    },
    defaultValue: null,
    control: {
      type: 'select',
      options: POPOVER_CONTENT_WIDTHS,
    },
  },

  // Action Event Handlers
  onUpdateOpen: {
    table: {
      disable: true,
    },
  },
  onHighlight: {
    table: {
      disable: true,
    },
  },
  onEscape: {
    table: {
      disable: true,
    },
  },

  'update:open': {
    description: `The dropdown will emit a boolean value for this event when the \
user performs a closing or opening action and also the dropdown content reference when it was open. \
Parent components can sync on this value to create a 2-way binding to control dropdown visibility.`,
    table: {
      type: {
        summary: 'boolean',
      },
    },
  },
  highlight: {
    description: 'Event fired when the highlight changes',
    table: {
      type: { summary: 'event' },
    },
  },
  escape: {
    description: 'Event fired when when pressing escape',
    table: {
      type: { summary: 'event' },
    },
  },
};

// Story Collection
export default {
  title: 'Components/Dropdown',
  component: DtDropdown,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
  parameters: {
    controls: {
      sort: 'requiredFirst',
    },
    docs: {
      page: DtDropdownMdx,
    },
  },
};

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtDropdownDefaultTemplate,
);
const VariantsTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtDropdownVariantsTemplate,
);

// Stories
export const Default = DefaultTemplate.bind({});
Default.args = {};
Default.decorators = [() => ({
  template: `<div class="d-d-flex d-jc-center d-ai-center d-h164"><story /></div>`,
})];

export const Variants = VariantsTemplate.bind({});
Variants.args = {};
Variants.decorators = [() => ({
  template: `<div class="d-d-flex d-jc-center d-ai-center d-h164"><story /></div>`,
})];
