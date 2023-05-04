import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile, getIconNames } from '@/common/storybook_utils';
import DtRecipeCallbarButton from './callbar_button.vue';
import { CALLBAR_BUTTON_VALID_WIDTH_SIZE } from './callbar_button_constants';

import DtRecipeCallbarButtonDefaultTemplate from './callbar_button_default.story.vue';
import DtRecipeCallbarButtonVariantsTemplate from './callbar_button_variants.story.vue';
import DtRecipeCallbarButtonCallbarTemplate from './callbar_button_callbar.story.vue';

const iconsList = getIconNames();

// Default Prop Values
export const argsData = {
  buttonWidthSize: 'xl',
  onClick: action('click'),
};

export const argTypesData = {
  // Props
  id: {
    table: {
      defaultValue: {
        summary: 'generated unique ID',
      },
    },
  },
  active: {
    control: 'boolean',
  },
  circle: {
    control: 'boolean',
  },
  danger: {
    control: 'boolean',
  },
  disabled: {
    control: 'boolean',
    description: 'Button is disabled, shows the tooltip',
  },
  buttonClass: {
    table: {
      type: {
        summary: ['string', 'array', 'object'],
      },
    },
    control: 'text',
  },
  textClass: {
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

  // Slots
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
    options: iconsList,
    description: 'Slot for button icon',
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

  // Action Event Handlers
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
};

// Story Collection
export default {
  title: 'Recipes/Buttons/Callbar Button',
  component: DtRecipeCallbarButton,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Templates
const DefaultTemplate = (args) => createTemplateFromVueFile(
  args,
  DtRecipeCallbarButtonDefaultTemplate,
);
const VariantsTemplate = (args) => createTemplateFromVueFile(
  args,
  DtRecipeCallbarButtonVariantsTemplate,
);
const CallbarTemplate = (args) => createTemplateFromVueFile(
  args,
  DtRecipeCallbarButtonCallbarTemplate,
);

export const Default = {
  render: DefaultTemplate,

  args: {
    default: 'Button',
    tooltip: 'Tooltip Text',
    ariaLabel: 'Button',
    icon: 'accessibility',
  },
};

export const Variants = {
  render: VariantsTemplate,
  args: {},
  parameters: { options: { showPanel: false }, controls: { disable: true } },
};

export const Callbar = {
  render: CallbarTemplate,
  args: {},

  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'duplicate-id',
            enabled: false,
          },
        ],
      },
    },
    options: { showPanel: false },
    controls: { disable: true },
  },
};
