import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtRecipeTopBannerInfo from './top_banner_info.vue';

import DtRecipeTopBannerInfoDefaultTemplate from './top_banner_info_default.story.vue';
import DtRecipeTopBannerInfoVariantsTemplate from './top_banner_info_variants.story.vue';
import { COLOR_CODES } from './top_banner_info_constants';

// Default Prop Values
export const argsData = {
  colorCode: 'green300',
  onEvent: action('event'),
};

/**
 * example prop description decorator
 */

/*
  Controls
  ========

  Here we define any custom controls or control overrides for our components.

  By default storybook will attempt to provide an appropriate control of the same name for each property in the
  component as well as include any description provided using a prop decorator within your component (see above).

  Storybook will also attempt to provide an appropriate control for each slot in the component as well as include any
  description provided using a slot decorator within your component (see below).

  <!-- @slot example slot decorator -->
*/
export const argTypesData = {
  // Props
  colorCode: {
    description: 'Background color of the banner',
    options: COLOR_CODES,
    control: {
      type: 'select',
    },
  },

  // Slots
  default: {
    description: 'Display content in the center of the banner',
    table: {
      type: { summary: 'VNode' },
    },
    control: {
      type: 'text',
    },
  },
  /*
    We use the following naming scheme `<SLOT_NAME>Slot` for slot controls to prevent conflicts with props that share
    the same name. We provide the correct name of the slot using the name control attribute to ensure that the argument
    table and description within the controls accurately reflects the correct names of our component's props and slots.
  */
  left: {
    name: 'left',
    table: {
      type: { summary: 'VNode' },
    },
    control: {
      type: 'text',
    },
  },

  right: {
    name: 'right',
    table: {
      type: { summary: 'VNode' },
    },
    control: {
      type: 'text',
    },
  },

  // Action Event Handlers
  onEvent: {
    table: {
      disable: true,
    },
  },
};

// Story Collection
export default {
  title: 'Recipes/Notices/Top Banner Info',
  component: DtRecipeTopBannerInfo,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Templates
const DefaultTemplate = (args) => createTemplateFromVueFile(
  args,
  DtRecipeTopBannerInfoDefaultTemplate,
);
const VariantsTemplate = (args) => createTemplateFromVueFile(
  args,
  DtRecipeTopBannerInfoVariantsTemplate,
);

export const Default = {
  render: DefaultTemplate,
  args: {},
};

export const Variants = {
  render: VariantsTemplate,
  args: {},

  parameters: {
    options: {
      showPanel: false,
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: false,
          },
          {
            id: 'duplicate-id',
            enabled: false,
          },
        ],
      },
    },
  },
};
