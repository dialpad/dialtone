import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile, getIconNames } from '@/common/storybook_utils';
import DtRecipeCallbarButtonWithPopover from './callbar_button_with_popover.vue';

import DtRecipeCallbarButtonWithPopoverDefaultTemplate from './callbar_button_with_popover_default.story.vue';
import DtRecipeCallbarButtonWithPopoverVariantsTemplate from './callbar_button_with_popover_variants.story.vue';

import {
  POPOVER_DIRECTIONS,
  POPOVER_INITIAL_FOCUS_STRINGS,
} from '@/components/popover/popover_constants';
import { CALLBAR_BUTTON_VALID_WIDTH_SIZE } from '@/recipes/buttons/callbar_button/callbar_button_constants';

const iconsList = getIconNames();

// Default Prop Values
export const argsData = {
  buttonWidthSize: 'xl',
  openPopover: false,
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
  openPopover: {
    control: 'boolean',
  },

  // Popover slots
  content: {
    description: 'Slot for popover content',
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },
  headerContent: {
    description: 'Slot for popover header content',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'VNode',
      },
    },
  },
  footerContent: {
    description: 'Slot for popover footer content',
    control: 'text',
    table: {
      category: 'slots',
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

  // Popover props
  initialFocusElement: {
    options: [...Object.values(POPOVER_INITIAL_FOCUS_STRINGS), '#content-close'],
    control: {
      type: 'select',
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
  title: 'Recipes/Buttons/Callbar Button With Popover',
  component: DtRecipeCallbarButtonWithPopover,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtRecipeCallbarButtonWithPopoverDefaultTemplate,
);
const VariantsTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtRecipeCallbarButtonWithPopoverVariantsTemplate,
);

export const Default = {
  render: DefaultTemplate,

  args: {
    default: 'Button',
    tooltip: 'Tooltip Text',
    ariaLabel: 'Button',
    arrowButtonLabel: 'Open popover',
    content: 'Popover body content',
    contentClass: ['d-h464', 'd-w512'],
    headerContent: 'Header content',
    showCloseButton: true,
    forceShowArrow: false,
    openPopover: false,
    icon: 'dialpad-ai',
  },
};

export const Variants = {
  render: VariantsTemplate,
  args: {},
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    percy: {
      args: {
        openPopover: true,
      },
    },
  },
};
