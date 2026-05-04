import { createTemplateFromVueFile } from '@/common/storybook_utils';
import { action } from 'storybook/actions';
import DtRecipeGeneralRow from './GeneralRow.vue';

import DtRecipeGeneralRowDefaultTemplate from './GeneralRowDefault.story.vue';
import DtRecipeGeneralRowVariantsTemplate from './GeneralRowVariants.story.vue';
import {
  LEFTBAR_GENERAL_ROW_TYPES,
  LEFTBAR_GENERAL_ROW_CONTACT_CENTER_COLORS,
} from '@/recipes/Leftbar/GeneralRow/GeneralRowConstants';
import { LEFTBAR_GENERAL_ROW_ICON_SIZES } from './GeneralRowConstants';

// Default Prop Values
export const argsData = {
  type: 'inbox',
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

  // Slots
  start: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },
  left: {
    table: {
      disable: true,
    },
  },
};

const decorator = () => ({
  template: `<div style="background-color: var--dt-shell-color-surface-default" class="d-wmx-400 d-p-100"><story />
  </div>`,
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
const DefaultTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtRecipeGeneralRowDefaultTemplate);
const VariantsTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtRecipeGeneralRowVariantsTemplate);

export const Default = {
  render: DefaultTemplate,
  args: {},
};

export const Variants = {
  render: VariantsTemplate,
  args: {},
  parameters: { options: { showPanel: false }, controls: { disable: true } },
};
