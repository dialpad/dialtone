import { createTemplateFromVueFile } from '@/common/storybook_utils';
import { action } from '@storybook/addon-actions';
import DtRecipeGeneralRow from './general_row.vue';

import DtRecipeGeneralRowDefaultTemplate from './general_row_default.story.vue';
import DtRecipeGeneralRowVariantsTemplate from './general_row_variants.story.vue';
import {
  LEFTBAR_GENERAL_ROW_TYPES,
  LEFTBAR_GENERAL_ROW_CONTACT_CENTER_COLORS,
} from '@/recipes/leftbar/general_row/general_row_constants';
import { LEFTBAR_GENERAL_ROW_ICON_SIZES } from './general_row_constants';

// Default Prop Values
export const argsData = {
  type: 'inbox',
  callButtonTooltip: 'Call',
  dndTextTooltip: 'Do not Disturb',
  description: 'Description',
  iconSize: '300',
  onClick: action('click'),
  onCall: action('call'),
};

export const argTypesData = {
  // Props
  type: {
    table: {
      category: 'props',
      type: {
        summary: 'string',
      },
    },
    options: Object.values(LEFTBAR_GENERAL_ROW_TYPES),
    control: {
      type: 'select',
    },
  },
  iconSize: {
    control: {
      type: 'select',
      options: Object.values(LEFTBAR_GENERAL_ROW_ICON_SIZES),
    },
  },
  color: {
    table: {
      category: 'props',
      type: {
        summary: 'string',
      },
    },
    options: Object.keys(LEFTBAR_GENERAL_ROW_CONTACT_CENTER_COLORS),
    control: {
      type: 'select',
    },
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
    description: 'Native click event on the row itself',
    table: {
      category: 'events',
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
};
const DefaultTemplate = (args) => createTemplateFromVueFile(args, DtRecipeGeneralRowDefaultTemplate);
const VariantsTemplate = (args) => createTemplateFromVueFile(args, DtRecipeGeneralRowVariantsTemplate);

export const Default = {
  render: DefaultTemplate,
  args: {},
};

export const Variants = {
  render: VariantsTemplate,
  args: {},
  parameters: { options: { showPanel: false }, controls: { disable: true } },
};
