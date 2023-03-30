import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile, getIconNames } from '@/common/storybook_utils';
import { DtRecipeCallbarButton, VALID_WIDTH_SIZE } from './callbar_button';
import DtRecipeCallbarButtonMdx from './callbar_button.mdx';
import DtRecipeCallbarButtonDefaultTemplate from './callbar_button_default.story.vue';
import DtRecipeCallbarButtonVariantsTemplate from './callbar_button_variants.story.vue';
import DtRecipeCallbarButtonCallbarTemplate from './callbar_button_callbar.story.vue';

const iconsList = getIconNames();

// Default Prop Values
export const argsData = {
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
    defaultValue: 'xl',
    control: {
      type: 'select',
      options: VALID_WIDTH_SIZE,
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
  parameters: {
    controls: {
      sort: 'requiredFirst',
    },
    docs: {
      page: DtRecipeCallbarButtonMdx,
    },
    options: {
      showPanel: true,
    },
  },
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
// Stories
export const Default = DefaultTemplate.bind({});
Default.args = {
  default: 'Button',
  tooltip: 'Tooltip Text',
  ariaLabel: 'Button',
  icon: 'accessibility',
};

export const Variants = VariantsTemplate.bind({});
Variants.args = {};
Variants.parameters = { controls: { disable: true }, actions: { disable: true }, options: { showPanel: false } };

export const Callbar = CallbarTemplate.bind({});
Callbar.args = {};
Callbar.parameters = {
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
  controls: { disable: true },
  actions: { disable: true },
  options: { showPanel: false },
};
