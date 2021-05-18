import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '../storybook_utils';
import { VALIDATION_MESSAGE_TYPES } from '../constants';
import CheckboxDefault from './checkbox_default.story.vue';
import CheckboxVariants from './checkbox_variants.story.vue';
import BaseCheckboxMdx from './checkbox.mdx';
import DtCheckbox from './checkbox';

// Default Prop Values
export const argsData = {
  value: 'Value',
  name: 'Name',
  label: 'Checkbox',
  validationState: '',
  onInput: action('input'),
};

// Prop Controls
export const argTypesData = {
  // Props
  'v-model': {
    description: 'Supported by this component',
    control: null,
  },
  description: {
    description: 'Describes the checkbox option',
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
  checked: {
    description: 'Used to set the initial state of the checkbox',
    control: 'boolean',
    table: {
      category: 'props',
      type: {
        summary: 'boolean',
      },
    },
  },
  validationState: {
    table: {
      type: {
        summary: 'string',
      },
    },
    control: {
      type: 'select',
      options: ['', ...Object.values(VALIDATION_MESSAGE_TYPES)],
    },
  },
  labelChildProps: {
    control: null,
  },
  descriptionChildProps: {
    control: null,
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
  descriptionSlot: {
    name: 'description',
    description: 'slot for Checkbox Description',
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
};

// Story Collection
export default {
  title: 'Forms/Checkbox',
  component: DtCheckbox,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
  parameters: {
    docs: {
      page: BaseCheckboxMdx,
    },
  },
};

// Checkbox Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, CheckboxDefault);
const VariantsTemplate = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, CheckboxVariants);

// Stories
export const Default = DefaultTemplate.bind({});
Default.args = {};

export const Variants = VariantsTemplate.bind({});
Variants.args = {};
