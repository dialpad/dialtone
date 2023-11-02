import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtInputGroup from './input_group.vue';

import InputGroupDefaultTemplate from './input_group_default.story.vue';
import InputGroupVariantsTemplate from './input_group_variants.story.vue';

// Constants
const RADIO_GROUP_OPTIONS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Other', value: 'other' },
];

// Default Prop Values
export const argsData = {
  name: 'fruits-input-group',
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
    description: 'The legend of the input group',
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
    description: 'A provided value for the input group',
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
};

// Story Collection
export default {
  title: 'Components/Input Group',
  component: DtInputGroup,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Templates
const DefaultTemplate = (args) => createTemplateFromVueFile(args, InputGroupDefaultTemplate);
const VariantsTemplate = (args) => createTemplateFromVueFile(args, InputGroupVariantsTemplate);

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
