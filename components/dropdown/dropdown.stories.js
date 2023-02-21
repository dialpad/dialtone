import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtDropdown from './dropdown';
import DtDropdownMdx from './dropdown.mdx';
import DtDropdownDefaultTemplate from './dropdown_default.story.vue';
import DtDropdownVariantsTemplate from './dropdown_variants.story.vue';
import { LIST_ITEM_NAVIGATION_TYPES } from '../list_item/list_item_constants';
import {
  POPOVER_CONTENT_WIDTHS,
} from '../popover';
import {
  DROPDOWN_PADDING_CLASSES,
} from './dropdown_constants';
import { POPOVER_DIRECTIONS } from '../popover/popover_constants';

// Default Prop Values
export const argsData = {
  onHighlight: action('highlight'),
  onOpened: action('opened'),
  visuallyHiddenCloseLabel: 'Close Dropdown',
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
  placement: {
    defaultValue: 'bottom',
    control: {
      type: 'select',
      options: POPOVER_DIRECTIONS,
    },
    table: {
      defaultValue: {
        summary: 'bottom',
      },
    },
  },
  appendTo: {
    defaultValue: 'body',
    table: {
      defaultValue: {
        summary: 'body',
      },
    },
  },
  padding: {
    defaultValue: 'none',
    control: {
      type: 'select',
      options: Object.keys(DROPDOWN_PADDING_CLASSES),
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
  parameters: {
    controls: {
      sort: 'requiredFirst',
    },
    options: { showPanel: true },
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
Variants.parameters = {
  controls: { disable: true },
  actions: { disable: true },
  options: { showPanel: false },
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
};
Variants.decorators = [() => ({
  template: `<div class="d-d-flex d-jc-center d-ai-center"><story /></div>`,
})];
