import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile, getIconNames } from '@/common/storybook_utils';
import DtRecipeCallbarButton from './callbar_button';
import DtRecipeCallbarButtonMdx from './callbar_button.mdx';
import DtRecipeCallbarButtonDefaultTemplate from './callbar_button_default.story.vue';
import DtRecipeCallbarButtonVariantsTemplate from './callbar_button_variants.story.vue';
import DtRecipeCallbarButtonCallbarTemplate from './callbar_button_callbar.story.vue';

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
  },
  buttonClass: {
    table: {
      type: {
        summary: ['string', 'array', 'object'],
      },
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
    description: 'Slot for button icon',
    table: {
      category: 'slots',
      type: {
        summary: 'VNode',
      },
    },
    options: getIconNames(),
    control: {
      type: 'select',
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
  icon: 'IconDialpadGlyph',
};

export const Variants = VariantsTemplate.bind({});
Variants.args = {};
Variants.parameters = { controls: { disable: true }, actions: { disable: true }, options: { showPanel: false } };

export const Callbar = CallbarTemplate.bind({});
Callbar.args = {};
Callbar.parameters = { controls: { disable: true }, actions: { disable: true }, options: { showPanel: false } };
