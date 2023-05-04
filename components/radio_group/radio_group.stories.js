import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtRadioGroup from './radio_group.vue';

import RadioGroupDefaultTemplate from './radio_group_default.story.vue';
import RadioGroupVariantsTemplate from './radio_group_variants.story.vue';

// Constants
const RADIO_GROUP_OPTIONS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Other', value: 'other' },
];

// Default Prop Values
export const argsData = {
  name: 'fruits-radio-group',
  legend: 'Fruits',
  value: '',
  options: RADIO_GROUP_OPTIONS,
  onInput: action('input'),
};

// Controls
export const argTypesData = {
  // Slots
  default: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },
  legendSlot: {
    name: 'legend',
    description: 'Slot for legend',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'VNode',
      },
    },
  },

  // Props
  legend: {
    description: 'The legend of the radio group',
    table: {
      category: 'props',
      type: {
        summary: 'string',
      },
    },
    control: {
      type: 'text',
    },
  },
  value: {
    description: 'A provided value for the radio group',
    control: 'text',
    table: {
      category: 'props',
    },
  },
  id: {
    table: {
      defaultValue: {
        summary: 'generated unique ID',
      },
    },
  },

  // Directives
  'v-model': {
    description: 'Supported by this component',
    control: null,
    table: {
      category: 'directives',
    },
  },

  // Action Event Handlers
  onInput: {
    table: {
      disable: true,
    },
  },

  // Story Variables
  options: {
    table: {
      disable: true,
    },
  },

  // Disabled Controls
  dataQaGroup: {
    table: {
      disable: true,
    },
  },
  dataQaGroupLegend: {
    table: {
      disable: true,
    },
  },
  dataQaGroupMessages: {
    table: {
      disable: true,
    },
  },
};

// Story Collection
export default {
  title: 'Components/Radio Group',
  component: DtRadioGroup,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Templates
const DefaultTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, RadioGroupDefaultTemplate);
const VariantsTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, RadioGroupVariantsTemplate);

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
        ],
      },
    },
  },
};
