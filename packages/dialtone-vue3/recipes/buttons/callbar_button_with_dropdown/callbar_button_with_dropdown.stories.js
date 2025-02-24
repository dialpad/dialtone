import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile, getIconNames } from '@/common/storybook_utils';
import DtRecipeCallbarButtonWithDropdown from './callbar_button_with_dropdown.vue';

import DtRecipeCallbarButtonWithDropdownDefaultTemplate from './callbar_button_with_dropdown_default.story.vue';

import {
  POPOVER_DIRECTIONS,
} from '@/components/popover/popover_constants';
import { CALLBAR_BUTTON_VALID_WIDTH_SIZE } from '@/recipes/buttons/callbar_button/callbar_button_constants';

const iconsList = getIconNames();

// Default Prop Values
export const argsData = {
  buttonWidthSize: 'xl',
  onArrowClick: action('arrow-click'),
  onClick: action('click'),
  onOpened: action('opened'),
};

export const argTypesData = {
  // Button Slots
  default: {
    name: 'default',
    description: 'Slot default content. This will be the button label',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'text/html',
      },
    },
  },
  icon: {
    name: 'icon',
    description: 'Slot for button icon',
    options: iconsList,
    table: {
      category: 'slots',
      type: {
        summary: 'VNode',
      },
    },
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
  },
  tooltip: {
    name: 'tooltip',
    description: 'Slot tooltip',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'text/html',
      },
    },
  },
  active: {
    control: 'boolean',
  },
  danger: {
    control: 'boolean',
  },
  disabled: {
    control: 'boolean',
  },
  buttonClass: {
    table: {
      type: {
        summary: ['string', 'array', 'object'],
      },
    },
    control: 'text',
  },
  buttonWidthSize: {
    options: CALLBAR_BUTTON_VALID_WIDTH_SIZE,
    control: {
      type: 'select',
    },
  },
  textClass: {
    table: {
      type: {
        summary: ['string', 'array', 'object'],
      },
    },
    control: 'text',
  },
  contentClass: {
    table: {
      type: {
        summary: ['string', 'array', 'object'],
      },
    },
    control: 'text',
  },

  // Popover slots
  list: {
    description: 'Slot for dropdown list',
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },

  // Action Event Handlers
  'arrow-click': {
    description: 'Triggered when the arrow is clicked',
    table: {
      disable: false,
      type: {
        summary: 'event',
      },
    },
  },
  onArrowClick: {
    table: {
      disable: true,
    },
  },
  click: {
    description: 'Triggered when the button is clicked',
    table: {
      disable: false,
      type: {
        summary: 'event',
      },
    },
  },
  onClick: {
    table: {
      disable: true,
    },
  },
  opened: {
    table: {
      disable: false,
      type: {
        summary: 'event',
      },
    },
  },
  onOpened: {
    table: {
      disable: true,
    },
  },

  id: {
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
  },
};

// Story Collection
export default {
  title: 'Recipes/Buttons/Callbar Button With Dropdown',
  component: DtRecipeCallbarButtonWithDropdown,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Templates
const defaultArgs = {
  default: 'Button',
  tooltip: 'Tooltip Text',
  ariaLabel: 'Button',
  arrowButtonLabel: 'Open dropdown',
  list: 'Dropdown body content',
  forceShowArrow: false,
  icon: 'dialpad-ai',
};

const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtRecipeCallbarButtonWithDropdownDefaultTemplate,
);

export const Default = {
  render: DefaultTemplate,
  args: defaultArgs,
};
