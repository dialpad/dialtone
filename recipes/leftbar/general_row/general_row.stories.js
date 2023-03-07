import { createTemplateFromVueFile } from '@/common/storybook_utils';
import { action } from '@storybook/addon-actions';
import DtRecipeGeneralRow from './general_row';
import DtRecipeGeneralRowMdx from './general_row.mdx';
import DtRecipeGeneralRowDefaultTemplate from './general_row_default.story.vue';
import DtRecipeGeneralRowVariantsTemplate from './general_row_variants.story.vue';
import {
  LEFTBAR_GENERAL_ROW_TYPES,
  LEFTBAR_GENERAL_ROW_CONTACT_CENTER_COLORS,
} from '@/recipes/leftbar/general_row/general_row_constants';

// Default Prop Values
export const argsData = {
  onClick: action('click'),
  onCall: action('call'),
};

export const argTypesData = {
  // Props
  type: {
    defaultValue: 'inbox',
    table: {
      category: 'props',
      type: {
        summary: 'string',
      },
    },
    control: {
      type: 'select',
      options: Object.values(LEFTBAR_GENERAL_ROW_TYPES),
    },
  },
  color: {
    table: {
      category: 'props',
      type: {
        summary: 'string',
      },
    },
    control: {
      type: 'select',
      options: Object.keys(LEFTBAR_GENERAL_ROW_CONTACT_CENTER_COLORS),
    },
  },
  description: {
    defaultValue: 'Description',
  },

  // Action Event Handlers
  onClick: {
    table: {
      disable: true,
    },
  },

  onCall: {
    table: {
      disable: true,
    },
  },

  click: {
    table: {
      type: { summary: 'event' },
    },
  },

  call: {
    table: {
      type: { summary: 'event' },
    },
  },
};

const decorator = () => ({
  template: '<div class="d-w264 d-theme-sidebar-bgc d-p8"><story /></div>',
});

// Story Collection
export default {
  title: 'Recipes/Leftbar/General Row',
  component: DtRecipeGeneralRow,
  args: argsData,
  argTypes: argTypesData,
  decorators: [decorator],
  excludeStories: /.*Data$/,
  parameters: {
    controls: {
      sort: 'requiredFirst',
    },
    docs: {
      page: DtRecipeGeneralRowMdx,
    },
    options: {
      showPanel: true,
    },
  },
};

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtRecipeGeneralRowDefaultTemplate,
);
const VariantsTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtRecipeGeneralRowVariantsTemplate,
);

// Stories
export const Default = DefaultTemplate.bind({});
Default.args = {};

export const Variants = VariantsTemplate.bind({});
Variants.args = {};
Variants.parameters = { controls: { disable: true }, actions: { disable: true }, options: { showPanel: false } };
