import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile, getIconNames } from '@/common/storybook_utils';
import DtRecipeCallbarButtonWithPopover from './callbar_button_with_popover';
import DtRecipeCallbarButtonWithPopoverMdx from './callbar_button_with_popover.mdx';
import DtRecipeCallbarButtonWithPopoverDefaultTemplate from './callbar_button_with_popover_default.story.vue';
import DtRecipeCallbarButtonWithPopoverVariantsTemplate from './callbar_button_with_popover_variants.story.vue';

import { POPOVER_DIRECTIONS, POPOVER_INITIAL_FOCUS_STRINGS } from '@/components/popover/popover_constants';
import { VALID_WIDTH_SIZE } from '@/recipes/buttons/callbar_button/callbar_button';

const iconsList = getIconNames();

// Default Prop Values
export const argsData = {
  onArrowClick: action('arrowClick'),
  onClick: action('click'),
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
  },
  buttonWidthSize: {
    defaultValue: 'xl',
    control: {
      type: 'select',
      options: VALID_WIDTH_SIZE,
    },
  },
  contentClass: {
    table: {
      type: {
        summary: ['string', 'array', 'object'],
      },
    },
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
  arrowClick: {
    description: 'Triggered when the arrow is clicked',
    table: {
      disable: false,
      type: {
        summary: 'event',
      },
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

  id: {
    table: {
      defaultValue: {
        summary: 'generated unique ID',
      },
    },
  },

  // Popover props
  initialFocusElement: {
    control: {
      type: 'select',
    },
    options: [...Object.values(POPOVER_INITIAL_FOCUS_STRINGS), '#content-close'],
  },
  placement: {
    control: {
      type: 'select',
    },
    options: POPOVER_DIRECTIONS,
  },

  // Action Event Handlers
  onArrowClick: {
    table: {
      disable: true,
    },
  },
  onClick: {
    table: {
      disable: true,
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
  parameters: {
    controls: {
      sort: 'requiredFirst',
    },
    docs: {
      page: DtRecipeCallbarButtonWithPopoverMdx,
    },
    options: {
      showPanel: true,
    },
  },
};

// Templates
const DefaultTemplate = (args) => createTemplateFromVueFile(
  args,
  DtRecipeCallbarButtonWithPopoverDefaultTemplate,
);
const VariantsTemplate = (args) => createTemplateFromVueFile(
  args,
  DtRecipeCallbarButtonWithPopoverVariantsTemplate,
);
// Stories
export const Default = DefaultTemplate.bind({});
Default.args = {
  default: 'Button',
  tooltip: 'Tooltip Text',
  ariaLabel: 'Button',
  arrowButtonLabel: 'Open popover',
  content: 'Popover body content',
  contentClass: ['d-h464', 'd-w512'],
  headerContent: 'Header content',
  showCloseButton: true,
  forceShowArrow: false,
  icon: 'dialpad-ai',
};

export const Variants = VariantsTemplate.bind({});
Variants.args = {};
Variants.parameters = { controls: { disable: true }, actions: { disable: true }, options: { showPanel: false } };
