import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtDropdown from './dropdown.vue';

import DtDropdownDefaultTemplate from './dropdown_default.story.vue';
import DtDropdownVariantsTemplate from './dropdown_variants.story.vue';
import { LIST_ITEM_NAVIGATION_TYPES } from '../list_item/list_item_constants';
import { POPOVER_CONTENT_WIDTHS } from '../popover';
import { DROPDOWN_PADDING_CLASSES } from './dropdown_constants';
import { POPOVER_DIRECTIONS } from '../popover/popover_constants';

// Default Prop Values
export const argsData = {
  onHighlight: action('highlight'),
  onOpened: action('opened'),
  visuallyHiddenCloseLabel: 'Close Dropdown',
  navigationType: 'arrow-keys',
  placement: 'bottom',
  appendTo: 'body',
  padding: 'none',
  contentWidth: 'null',
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
    options: Object.values(LIST_ITEM_NAVIGATION_TYPES),
    control: {
      type: 'select',
    },
  },
  listId: {
    table: {
      defaultValue: {
        summary: 'generated unique ID',
      },
    },
  },
  placement: {
    options: POPOVER_DIRECTIONS,
    control: {
      type: 'select',
    },
    table: {
      defaultValue: {
        summary: 'bottom',
      },
    },
  },
  appendTo: {
    table: {
      defaultValue: {
        summary: 'body',
      },
    },
  },
  padding: {
    options: Object.keys(DROPDOWN_PADDING_CLASSES),
    control: {
      type: 'select',
    },
  },
  contentWidth: {
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'null' },
    },
    options: POPOVER_CONTENT_WIDTHS,
    control: {
      type: 'select',
    },
  },

  // Action Event Handlers
  onOpened: {
    table: {
      disable: true,
    },
  },
  onHighlight: {
    table: {
      disable: true,
    },
  },
  'update:open': {
    table: {
      disable: true,
    },
  },

  opened: {
    description: `emitted when dropdown is shown or hidden.`,
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
};

// Story Collection
export default {
  title: 'Components/Dropdown',
  component: DtDropdown,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Templates
const DefaultTemplate = (args) => createTemplateFromVueFile(
  args,
  DtDropdownDefaultTemplate,
);
const VariantsTemplate = (args) => createTemplateFromVueFile(
  args,
  DtDropdownVariantsTemplate,
);

export const Default = {
  render: DefaultTemplate,
  args: {},

  decorators: [
    () => ({
      template: `<div class="d-d-flex d-jc-center d-ai-center d-h164"><story /></div>`,
    }),
  ],
};

export const Variants = {
  render: VariantsTemplate,
  args: {},

  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    a11y: {
      config: {
        rules: [
          {
            id: 'aria-allowed-attr',
            enabled: false,
          },
        ],
      },
    },
  },

  decorators: [
    () => ({
      template: `<div class="d-d-flex d-jc-center d-ai-center"><story /></div>`,
    }),
  ],
};
