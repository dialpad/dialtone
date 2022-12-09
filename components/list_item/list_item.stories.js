import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile, getIconNames } from '@/common/storybook_utils';
import DtListItem from './list_item';
import DtListItemMdx from './list_item.mdx';
import { LIST_ITEM_NAVIGATION_TYPES, LIST_ITEM_TYPES } from './list_item_constants.js';
import DtListItemDefaultTemplate from './list_item_default.story.vue';
import DtListItemCustomTemplate from './list_item_custom.story.vue';

const iconsList = getIconNames();

// Default Prop Values
export const argsData = {
  onClick: action('click'),
};

export const argTypesData = {
  // Slots
  default: {
    description: 'Slot for the main content',
    table: {
      category: 'slots',
      type: { summary: 'VNode' },
    },
    control: {
      type: 'text',
    },
  },
  left: {
    options: iconsList,
    mapping: iconsList,
    description: 'Slot for the left content',
    table: {
      category: 'slots',
      type: { summary: 'component' },
    },
    control: {
      type: 'select',
      labels: {
        // 'labels' maps option values to string labels
        '': '(empty)',
      },
    },
  },
  right: {
    options: iconsList,
    mapping: iconsList,
    description: 'Slot for the right content',
    table: {
      category: 'slots',
      type: { summary: 'component' },
    },
    control: {
      type: 'select',
      labels: {
        // 'labels' maps option values to string labels
        '': '(empty)',
      },
    },
  },
  subtitle: {
    description: 'Slot for the content below the main content',
    table: {
      category: 'slots',
      type: { summary: 'VNode' },
    },
    control: {
      type: 'text',
    },
  },
  bottom: {
    description: 'Slot for the content below the subtitle',
    table: {
      category: 'slots',
      type: { summary: 'VNode' },
    },
    control: {
      type: 'text',
    },
  },

  // Props
  id: {
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'generated unique ID' },
    },
    control: {
      type: 'text',
    },
  },
  role: {
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'listitem' },
    },
    control: {
      type: 'text',
    },
  },
  elementType: {
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'li' },
    },
    control: {
      type: 'text',
    },
  },
  type: {
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: LIST_ITEM_TYPES.DEFAULT },
    },
    control: {
      type: 'select',
      options: Object.values(LIST_ITEM_TYPES),
    },
  },
  navigationType: {
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'none' },
    },
    control: {
      type: 'select',
      options: Object.values(LIST_ITEM_NAVIGATION_TYPES),
    },
  },

  // Action Event Handlers
  onClick: {
    table: {
      disable: true,
    },
  },

  click: {
    description: 'Click event fired when clicking on the item',
    table: {
      type: { summary: 'event' },
    },
  },
};

const decorator = () => ({
  template: '<div class="d-w628"><story /></div>',
});

// Story Collection
export default {
  title: 'Components/List Item',
  component: DtListItem,
  args: argsData,
  argTypes: argTypesData,
  decorators: [decorator],
  excludeStories: /.*Data$/,
  parameters: {
    controls: {
      sort: 'requiredFirst',
    },
    docs: {
      page: DtListItemMdx,
    },
    options: {
      showPanel: true,
    },
  },
};

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, DtListItemDefaultTemplate);
const CustomTemplate = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, DtListItemCustomTemplate);

// Stories
export const Default = DefaultTemplate.bind({});
Default.args = {
  left: 'globe-2',
  right: 'external-link',
  default: 'Default List Item',
  subtitle: 'Description',
  bottom: '<span class="d-badge d-badge--purple-100">Label</span>',
  navigationType: LIST_ITEM_NAVIGATION_TYPES.TAB,
};

export const Custom = CustomTemplate.bind({});
Custom.args = {};
