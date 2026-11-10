import { action } from 'storybook/actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtDropdown from './Dropdown.vue';

import DtDropdownDefaultTemplate from './DropdownDefault.story.vue';
import DtDropdownControlledArrowsTemplate from './DropdownControlledArrows.story.vue';
import DtDropdownMenuRolesTemplate from './DropdownMenuRoles.story.vue';
import DtDropdownVariantsTemplate from './DropdownVariants.story.vue';
import { LIST_ITEM_NAVIGATION_TYPES } from '../ListItem/ListItemConstants';
import { POPOVER_CONTENT_WIDTHS } from '../Popover';
import { DROPDOWN_PADDING_CLASSES } from './DropdownConstants';
import { POPOVER_DIRECTIONS } from '../Popover/PopoverConstants';
import { CONTENT_MODE_ARG_TYPE } from '@/common/mode_constants';

// Default Prop Values
export const argsData = {
  onHighlight: action('highlight'),
  onOpened: action('opened'),
  navigationType: 'arrow-keys',
  placement: 'bottom',
  appendTo: 'body',
  padding: 'none',
  contentWidth: '',
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
  footer: {
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
  contentMode: CONTENT_MODE_ARG_TYPE,
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

export const Default = {
  render: DefaultTemplate,
  args: {},

  parameters: {
    percy: {
      args: {
        open: true,
      },
    },
  },

  decorators: [
    () => ({
      template: `<dt-stack direction="row" justify="center" align="center" class="d-h-250"><story /></dt-stack>`,
    }),
  ],
};

export const Variants = {
  render: VariantsTemplate,
  args: {},

  parameters: {
    ...Default.parameters,
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
      template: `<dt-stack direction="row" justify="center" align="center"><story /></dt-stack>`,
    }),
  ],
};


export const MenuRoles = {
  render: (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, DtDropdownMenuRolesTemplate),
  args: { onOpenChange: action('open-change') },
  parameters: {
    docs: {
      description: {
        story: 'ListItem defaults to ordinary list content. Menu actions explicitly use menuitem; persistent mutually exclusive menu choices explicitly use menuitemradio and consumer-owned selected state. Highlight moves focus without changing checked state. Listbox choices remain option.',
      },
    },
  },
};


export const ControlledArrows = {
  render: (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, DtDropdownControlledArrowsTemplate),
  args: { onOpenChange: action('open-change') },
  parameters: {
    docs: {
      description: {
        story: 'The boolean-open menu accepts anchor arrows synchronously in its own emitted keydown callback and checks the target. Turn acceptance off to ignore arrows, then click the trigger to verify pointer opening retains dialog focus.',
      },
    },
  },
};
