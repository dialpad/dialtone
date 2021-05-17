import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '../storybook_utils';
import DtInputGroup from './input_group';
import InputGroupMdx from './input_group.mdx';
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
  // Props
  'v-model': {
    description: 'Supported by this component',
    // remove control
    control: null,
  },
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

  // Slots
  default: {
    control: 'text',
    table: {
      type: {
        summary: 'text/html',
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
        summary: 'text/html',
      },
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
  title: 'Forms/Input Group',
  component: DtInputGroup,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
  parameters: {
    docs: {
      page: InputGroupMdx,
    },
  },
};

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, InputGroupDefaultTemplate);
const VariantsTemplate = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, InputGroupVariantsTemplate);

// Stories
export const Default = DefaultTemplate.bind({});
Default.args = {};

export const Variants = VariantsTemplate.bind({});
Variants.args = {};
